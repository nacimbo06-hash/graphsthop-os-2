# Treasury Store Dependencies Audit

> **Date**: January 7, 2026  
> **Status**: Phase 0 - Pre-Refactoring Analysis

---

## 1. Consumer Files (10 total)

| File | Store Members Used | Domain |
|------|-------------------|--------|
| `pages/Treasury/tabs/CashRegister.tsx` | currentSession, sessions, movements, openSession, closeSession, addMovement, depositToSafe, contributeToFund, getCurrentBalance, getDailyProvisionTarget, getProvisionProgress | ALL |
| `pages/Treasury/tabs/Savings.tsx` | sinkingFunds, safeBalance, safeTransactions, depositToSafe, withdrawFromSafe, contributeToFund, withdrawFromFund, updateFundTarget, addSinkingFund, getTotalSafeAndProvisions | Safe + Provisions |
| `pages/Treasury/tabs/Expenses.tsx` | expenses, expenseCategories, addExpense, markExpenseAsPaid, deleteExpense, safeBalance, sinkingFunds, currentSession | Expenses + Safe + Session |
| `pages/Treasury/tabs/ZReport.tsx` | sessions, movements, currentSession, sinkingFunds, expenses, safeBalance | Read-only (reports) |
| `pages/Treasury/GoodsReceipt.tsx` | currentSession, addExpense, safeBalance, getCurrentBalance, withdrawFromSafe | Session + Expenses + Safe |
| `pages/POS/POS.tsx` | addMovement, currentSession | Session + Movements |
| `pages/Dashboard/Dashboard.tsx` | currentSession | Session only |
| `pages/Dashboard/CommandCenter.tsx` | currentSession, getTodaySales | Session + Computed |
| `stores/index.ts` | Re-exports useTreasuryStore | Barrel |
| `stores.ts` | Definition | Source |

---

## 2. Usage Pattern Analysis

### Hot Paths (Multiple Domains)
```
CashRegister.tsx  →  [Session] [Movements] [Safe] [Provisions]
Savings.tsx       →  [Safe] [Provisions]
Expenses.tsx      →  [Expenses] [Session] [Safe] [Provisions]
GoodsReceipt.tsx  →  [Session] [Expenses] [Safe]
```

### Light Consumers (Single Domain)
```
POS.tsx           →  [Session] [Movements]
Dashboard.tsx     →  [Session]
CommandCenter.tsx →  [Session]
ZReport.tsx       →  READ-ONLY (all domains)
```

---

## 3. Inter-Store Dependencies

### Within `treasuryStore.ts`
| Action | Calls Other Actions |
|--------|---------------------|
| `depositToSafe` | → `addMovement` (if session open) |
| `contributeToFund` | → `addMovement` (if session open) |
| `markExpenseAsPaid` | → `addMovement` OR `withdrawFromSafe` OR `withdrawFromFund` |

**Implication**: These actions have INTERNAL dependencies. When split:
- `safeStore` will need to call `cashSessionStore.addMovement`
- `sinkingFundsStore` will need to call `cashSessionStore.addMovement`
- `expensesStore` will need to call multiple stores

### External Store Dependencies
```
NONE FOUND - treasuryStore is self-contained
```

---

## 4. Type Dependencies

All types defined in `types/treasury.ts`:
- `CashSession`
- `CashMovement`
- `SinkingFund`
- `SinkingFundTransaction`
- `SafeTransaction`
- `Expense`
- `ExpenseCategory`

**No changes needed** - types are already external.

---

## 5. Persistence Strategy

Current: Single localStorage key `treasury-storage-v2`

**Persisted State:**
```typescript
{
  sessions: CashSession[];
  movements: CashMovement[];
  currentSession: CashSession | null;
  safeBalance: number;
  safeTransactions: SafeTransaction[];
  sinkingFunds: SinkingFund[];
  expenses: Expense[];
}
```

---

## 6. Circular Dependency Risk Assessment

| Scenario | Risk Level | Mitigation |
|----------|------------|------------|
| Safe → Session | 🟡 Medium | Pass addMovement as parameter |
| Provisions → Session | 🟡 Medium | Pass addMovement as parameter |
| Expenses → Safe + Provisions | 🟡 Medium | Use facade or event pattern |
| Session → Others | 🟢 None | Session has no outbound deps |

**Recommended Pattern**: Injected callbacks or event-based communication

---

## 7. Migration Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Mid-session users | 🔴 High | Migration must preserve active session |
| Data corruption | 🔴 High | Validate all fields before split |
| Orphaned movements | 🟡 Medium | Check sessionId references |
| Balance mismatch | 🔴 High | Verify safe+provisions totals |

---

## 8. Recommended Cross-Store Communication

### Option A: Injected Callbacks (RECOMMENDED)
```typescript
// safeStore.ts
depositToSafe: (amount, reason, performedBy, onMovement?: (m) => void) => {
  // ... create transaction
  if (onMovement) onMovement({ type: 'transfer_to_safe', amount, ... });
}

// Consumer usage
const { addMovement } = useCashSessionStore();
const { depositToSafe } = useSafeStore();
depositToSafe(1000, "Daily transfer", "Ahmed", addMovement);
```

### Option B: Event Emitter
```typescript
// Not recommended - adds complexity without benefit for this use case
```

### Option C: Facade Hook (BACKWARDS COMPAT)
```typescript
// useTreasuryFacade.ts
export const useTreasuryFacade = () => {
  const cashSession = useCashSessionStore();
  const safe = useSafeStore();
  const provisions = useSinkingFundsStore();
  const expenses = useExpensesStore();
  
  return {
    ...cashSession,
    ...safe,
    ...provisions,
    ...expenses,
    // Override cross-domain actions
    depositToSafe: (amount, reason, performedBy) => {
      safe.depositToSafe(amount, reason, performedBy, cashSession.addMovement);
    },
  };
};
```

---

## 9. Approval Checklist

Before proceeding to Phase 1:

- [ ] Cross-store pattern approved (Option A, B, or C)
- [ ] Migration strategy reviewed
- [ ] Persistence keys decided (separate vs shared)
- [ ] Test coverage requirements confirmed

# Treasury State Management Architecture

> **Date**: January 7, 2026  
> **Library**: Zustand v4.x with persist middleware

---

## 1. Current Architecture

```
┌─────────────────────────────────────────────────┐
│                useTreasuryStore                 │
│  (Single monolithic store with persist)         │
├─────────────────────────────────────────────────┤
│  State:                                         │
│    • currentSession, sessions, movements        │
│    • safeBalance, safeTransactions             │
│    • sinkingFunds                              │
│    • expenses, expenseCategories               │
├─────────────────────────────────────────────────┤
│  Persistence: localStorage['treasury-storage-v2']│
└─────────────────────────────────────────────────┘
```

---

## 2. Target Architecture

```
┌─────────────────────────────────────────────────┐
│              useTreasuryFacade                  │
│     (Backwards-compatible combined hook)         │
└─────────────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ CashSession  │ │    Safe      │ │  Sinking     │
│    Store     │ │    Store     │ │   Funds      │
├──────────────┤ ├──────────────┤ ├──────────────┤
│currentSession│ │ safeBalance  │ │sinkingFunds  │
│ sessions     │ │ transactions │ │              │
│ movements    │ └──────────────┘ └──────────────┘
│              │        │               │
│ addMovement()│◄───────┴───────────────┘
└──────────────┘   (callback injection)
        │
        ▼
┌──────────────┐
│  Expenses    │
│    Store     │
├──────────────┤
│ expenses     │
│ categories   │
└──────────────┘
```

---

## 3. Cross-Store Communication Pattern

### Decision: Callback Injection + Facade

**Why not Event Emitter?**
- Adds complexity without benefit for 4 tightly-coupled stores
- Harder to trace data flow
- No async operations requiring decoupling

**Why Callback Injection?**
- Explicit dependencies visible in function signatures
- Easy to test with mocks
- No hidden coupling

**Implementation Example:**
```typescript
// safeStore.ts
interface SafeStoreActions {
  depositToSafe: (
    amount: number, 
    reason: string, 
    performedBy: string,
    onMovement?: (movement: Omit<CashMovement, 'id' | 'sessionId' | 'createdAt'>) => void
  ) => void;
}

// Implementation
depositToSafe: (amount, reason, performedBy, onMovement) => {
  // 1. Create safe transaction
  const transaction = { ... };
  
  // 2. Update safe balance
  set(state => ({ safeBalance: state.safeBalance + amount, ... }));
  
  // 3. Notify session store (if callback provided)
  if (onMovement) {
    onMovement({
      type: 'transfer_to_safe',
      amount,
      reason: `Transfert vers coffre: ${reason}`,
      createdBy: performedBy,
    });
  }
}
```

---

## 4. Persistence Strategy

### Option A: Unified Key (RECOMMENDED)
All stores share one localStorage entry, migrating from existing data.

```typescript
// Each store reads from same key, only writes its slice
name: 'treasury-storage-v2',
partialize: (state) => ({ /* only this store's state */ })
```

**Pros:** No migration needed, backwards compatible  
**Cons:** Potential for stale reads if not careful

### Option B: Separate Keys
Each store has its own localStorage key.

```typescript
// cashSessionStore: 'treasury-sessions-v1'
// safeStore: 'treasury-safe-v1'
// etc.
```

**Pros:** Clean separation, smaller payloads  
**Cons:** Requires migration script

### Selected: Option A (Unified Key)
- Lower risk
- No data migration required
- Use `merge` option in persist to handle partial reads

---

## 5. Concurrency & Atomicity

### Current Behavior
- Zustand updates are synchronous within a single action
- No cross-action atomicity

### Potential Issues After Split
| Scenario | Risk | Mitigation |
|----------|------|------------|
| User deposits to safe while session closing | Low | Session check happens first |
| Expense paid from provision mid-contribution | Low | UI prevents concurrent operations |
| Multiple tabs open | Medium | Share same localStorage key |

### Recommendation
- Keep current behavior (no transactions needed)
- Document that actions should complete before starting new ones
- Consider `useBlocker` in UI for critical operations

---

## 6. Testing Requirements

### Unit Tests (per store)
- [ ] Initial state is correct
- [ ] Each action updates state correctly
- [ ] Getters compute correct values

### Integration Tests (facade)
- [ ] depositToSafe creates movement when session open
- [ ] contributeToFund creates movement when session open
- [ ] markExpenseAsPaid handles all paidFrom options
- [ ] Facade exposes all legacy methods

### Migration Tests
- [ ] Old data loads correctly in new stores
- [ ] No data loss during migration
- [ ] Rollback restores original state

---

## 7. Error Handling

### Store-Level
```typescript
depositToSafe: (amount, ...) => {
  if (amount <= 0) {
    console.error('[SafeStore] Invalid deposit amount');
    return false; // or throw
  }
  // ...
}
```

### UI-Level
- Consumers should check return values
- Toast notifications for user feedback
- No silent failures for financial operations

---

## 8. Approval Required

- [x] Callback injection pattern
- [x] Unified localStorage key (Option A)
- [x] No atomicity requirements
- [ ] Test coverage targets (80%? 100%?)

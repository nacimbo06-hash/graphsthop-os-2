# Treasury Store Migration & Rollback Plan

> **Date**: January 7, 2026  
> **Risk Level**: LOW (No localStorage key change)

---

## 1. Migration Strategy

### Current State
```
localStorage['treasury-storage-v2'] = {
  state: {
    currentSession: { ... },
    sessions: [...],
    movements: [...],
    safeBalance: 12500,
    safeTransactions: [...],
    sinkingFunds: [...],
    expenses: [...],
  },
  version: 0
}
```

### Target State
**Same localStorage key** - No migration needed at storage level!

Each new store will read the SAME key but only access its slice.

---

## 2. Why No Migration Script Needed

1. **Unified Key Approach**: All stores read from `treasury-storage-v2`
2. **Zustand Merge**: `merge` option handles partial state gracefully
3. **Backwards Compatible**: Facade provides identical API

**Risk Mitigation:**
- Old store continues working until all consumers migrate
- No data transformation required
- No schema changes

---

## 3. Rollback Plan

### Scenario: Split stores cause bugs

**Rollback Steps:**
1. Revert commits for new store files
2. Restore original `treasuryStore.ts`
3. Update imports back to original
4. Deploy hotfix

**Time Estimate:** 15-30 minutes

**Data Impact:** None (same localStorage key)

---

## 4. Validation Checklist

Before deploying split stores:

- [ ] All treasury tabs render correctly
- [ ] Session open/close works
- [ ] Safe deposit/withdrawal reflects in balance
- [ ] Provision contributions recorded
- [ ] Expenses can be created and paid
- [ ] Z-Report shows correct totals
- [ ] POS can record sales with movements

---

## 5. Edge Cases

| Scenario | Handling |
|----------|----------|
| User has mid-session data | Loads into cashSessionStore normally |
| User has no data | Default values apply per store |
| Corrupted localStorage | Zustand handles with defaults |
| Multiple tabs | Same key = synced (browser limitation) |

---

## 6. Performance Considerations

### Before (1 store)
- Single parse on load
- Single serialize on write
- All 50+ lines of state in memory

### After (4 stores + facade)
- 4 parses on load (same key, but 4 `get()` calls)
- Writes only touched slice
- Same memory footprint

**Expected Impact:** Negligible (<5ms difference)

---

## 7. Test Verification Commands

```bash
# Run after each step
npm run build          # Ensure no TypeScript errors
npm run dev            # Manual smoke test
# Future: npm run test:treasury
```

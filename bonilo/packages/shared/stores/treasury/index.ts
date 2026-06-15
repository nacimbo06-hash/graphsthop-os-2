/**
 * Treasury Stores - Barrel Export
 * 
 * This module re-exports all treasury-related stores and the facade.
 * For backwards compatibility, useTreasuryFacade provides the same API
 * as the original useTreasuryStore.
 */

// Individual stores (use for new code)
export { useCashSessionStore } from './cashSessionStore';
export type { SessionTotals } from './cashSessionStore';
export { useSafeStore } from './safeStore';
export { useSinkingFundsStore } from './sinkingFundsStore';
export { useExpensesStore } from './expensesStore';

// Facade (use for backwards compatibility)
export { useTreasuryFacade } from './useTreasuryFacade';

// Legacy alias for gradual migration
export { useTreasuryFacade as useTreasuryStore } from './useTreasuryFacade';

// Re-export types
export type {
    CashSession,
    CashMovement,
    SinkingFund,
    SinkingFundTransaction,
    SafeTransaction,
    Expense,
    ExpenseCategory
} from '@shared/types/treasury';

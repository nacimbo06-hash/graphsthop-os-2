/**
 * Treasury Facade Hook - SuperMarket Control OS
 * 
 * Provides backwards-compatible API combining all treasury stores.
 * Use this for gradual migration from useTreasuryStore.
 */

import { useCashSessionStore } from './cashSessionStore';
import { useSafeStore } from './safeStore';
import { useSinkingFundsStore } from './sinkingFundsStore';
import { useExpensesStore } from './expensesStore';
import type { CashMovement } from '@shared/types/treasury';

// Re-export types for backwards compatibility
export type {
    CashSession,
    CashMovement,
    SinkingFund,
    SinkingFundTransaction,
    SafeTransaction,
    Expense,
    ExpenseCategory
} from '@shared/types/treasury';

/**
 * Combined treasury facade hook
 * 
 * This hook provides the same API as the original useTreasuryStore
 * but internally uses the split stores. Use this for backwards
 * compatibility during migration.
 */
export const useTreasuryFacade = () => {
    // Individual stores
    const cashSession = useCashSessionStore();
    const safe = useSafeStore();
    const provisions = useSinkingFundsStore();
    const expenses = useExpensesStore();

    // ========== CROSS-STORE ACTIONS ==========

    // Deposit to safe with automatic movement recording
    const depositToSafe = (amount: number, reason: string, performedBy: string) => {
        const shouldRecordMovement = cashSession.currentSession?.status === 'open';
        safe.depositToSafe(
            amount,
            reason,
            performedBy,
            shouldRecordMovement ? cashSession.addMovement : undefined
        );
    };

    // Contribute to fund with automatic movement recording
    const contributeToFund = (fundId: string, amount: number, reason: string, performedBy: string) => {
        const shouldRecordMovement = cashSession.currentSession?.status === 'open';
        provisions.contributeToFund(
            fundId,
            amount,
            reason,
            performedBy,
            shouldRecordMovement ? cashSession.addMovement : undefined
        );
    };

    // Mark expense as paid with cross-store coordination
    const markExpenseAsPaid = (
        expenseId: string,
        paidFrom: 'cash' | 'safe' | 'provision',
        performedBy: string = 'System'
    ) => {
        expenses.markExpenseAsPaid(expenseId, paidFrom, performedBy, {
            onMovement: cashSession.currentSession?.status === 'open'
                ? cashSession.addMovement
                : undefined,
            onWithdrawFromSafe: safe.withdrawFromSafe,
            onWithdrawFromFund: provisions.withdrawFromFund,
            getFundByCategory: (category: string) =>
                provisions.sinkingFunds.find(f => f.category === category),
        });
    };

    // Add expense with optional immediate payment
    const addExpense = (
        expense: Parameters<typeof expenses.addExpense>[0],
        isPaid: boolean = false,
        paidFrom?: 'cash' | 'safe' | 'provision'
    ) => {
        const newExpense = expenses.addExpense(expense, isPaid, paidFrom);
        if (isPaid && paidFrom) {
            markExpenseAsPaid(newExpense.id, paidFrom);
        }
    };

    // Calculate total safe + provisions
    const getTotalSafeAndProvisions = () => {
        return safe.safeBalance + provisions.getTotalProvisions();
    };

    // ========== RETURN COMBINED API ==========

    return {
        // Cash Session State & Actions
        currentSession: cashSession.currentSession,
        sessions: cashSession.sessions,
        movements: cashSession.movements,
        openSession: cashSession.openSession,
        closeSession: cashSession.closeSession,
        addMovement: cashSession.addMovement,
        getSessionMovements: cashSession.getSessionMovements,
        getTodaySales: cashSession.getTodaySales,
        getCurrentBalance: cashSession.getCurrentBalance,

        // Safe State & Actions
        safeBalance: safe.safeBalance,
        safeTransactions: safe.safeTransactions,
        depositToSafe,
        withdrawFromSafe: safe.withdrawFromSafe,

        // Sinking Funds State & Actions
        sinkingFunds: provisions.sinkingFunds,
        contributeToFund,
        withdrawFromFund: provisions.withdrawFromFund,
        updateFundTarget: provisions.updateFundTarget,
        addSinkingFund: provisions.addSinkingFund,
        getDailyProvisionTarget: provisions.getDailyProvisionTarget,
        getProvisionProgress: provisions.getProvisionProgress,

        // Expenses State & Actions
        expenses: expenses.expenses,
        expenseCategories: expenses.expenseCategories,
        addExpense,
        markExpenseAsPaid,
        deleteExpense: expenses.deleteExpense,
        getTodayExpenses: expenses.getTodayExpenses,

        // Combined Getters
        getTotalSafeAndProvisions,
    };
};

// Default export for cleaner imports
export default useTreasuryFacade;

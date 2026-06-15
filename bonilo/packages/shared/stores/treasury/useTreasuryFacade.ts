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

// Check if running in Tauri (SQLite + Rust commands available).
const isTauri = () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

// Map a facade transfer ({ movement, safeTx?, fundTx? }) into the shape the
// Rust `close_session` command expects.
function toCommandTransfer(t: { movement: CashMovement; safeTx?: SafeTransaction; fundTx?: SinkingFundTransaction }) {
    return {
        movementId: t.movement.id,
        movementType: t.movement.type,
        amount: t.movement.amount,
        movementReason: t.movement.reason,
        provisionType: t.movement.provisionType || '',
        createdBy: t.movement.createdBy,
        createdAt: t.movement.createdAt,
        safeTxId: t.safeTx?.id ?? null,
        safeReason: t.safeTx?.reason ?? null,
        fundTxId: t.fundTx?.id ?? null,
        fundId: t.fundTx?.fundId ?? null,
        fundReason: t.fundTx?.reason ?? null,
    };
}
import type {
    CashSession,
    CashMovement,
    SinkingFund,
    SinkingFundTransaction,
    SafeTransaction,
    Expense,
    ExpenseCategory
} from '@shared/types/treasury';

// Re-export types for backwards compatibility
export type {
    CashSession,
    CashMovement,
    SinkingFund,
    SinkingFundTransaction,
    SafeTransaction,
    Expense,
    ExpenseCategory
};

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

    // Deposit to safe with atomic transaction
    const depositToSafe = async (amount: number, reason: string, performedBy: string) => {
        const sessionId = cashSession.currentSession?.id;
        if (!sessionId) {
            // If no session, just update safe
            await safe.depositToSafe(amount, reason, performedBy);
            return;
        }

        const movement: CashMovement = {
            id: crypto.randomUUID(),
            sessionId,
            type: 'transfer_to_safe',
            amount,
            reason: `Transfert vers coffre: ${reason}`,
            createdBy: performedBy,
            createdAt: new Date().toISOString()
        };

        const safeTx: SafeTransaction = {
            id: crypto.randomUUID(),
            type: 'deposit',
            amount,
            reason,
            date: new Date().toISOString(),
            performedBy,
        };

        // Atomic DB update via the Rust command (one transaction: cash movement
        // + safe deposit).
        if (isTauri()) {
            const { invoke } = await import('@tauri-apps/api/core');
            await invoke('transfer_to_safe', {
                input: {
                    movementId: movement.id,
                    sessionId,
                    amount,
                    movementReason: movement.reason,
                    safeTxId: safeTx.id,
                    safeReason: safeTx.reason,
                    performedBy,
                    createdAt: movement.createdAt,
                },
            });
        }

        // Update memory state
        useCashSessionStore.setState(state => ({
            movements: [movement, ...state.movements]
        }));
        useSafeStore.setState(state => ({
            safeBalance: state.safeBalance + amount,
            safeTransactions: [safeTx, ...state.safeTransactions]
        }));
    };

    // Contribute to fund with atomic transaction
    const contributeToFund = async (fundId: string, amount: number, reason: string, performedBy: string) => {
        const sessionId = cashSession.currentSession?.id;
        const fund = provisions.sinkingFunds.find(f => f.id === fundId);

        if (!sessionId || !fund) {
            await provisions.contributeToFund(fundId, amount, reason, performedBy);
            return;
        }

        const movement: CashMovement = {
            id: crypto.randomUUID(),
            sessionId,
            type: 'transfer_to_provision',
            amount,
            reason: `Provision ${fund.name}: ${reason}`,
            provisionType: fund.category,
            createdBy: performedBy,
            createdAt: new Date().toISOString()
        };

        const fundTx: SinkingFundTransaction = {
            id: crypto.randomUUID(),
            fundId,
            type: 'contribution',
            amount,
            reason,
            date: new Date().toISOString(),
            performedBy,
        };

        const newBalance = fund.currentBalance + amount;

        // Atomic DB update via the Rust command (cash movement + fund tx +
        // fund balance applied as a delta).
        if (isTauri()) {
            const { invoke } = await import('@tauri-apps/api/core');
            await invoke('contribute_to_fund', {
                input: {
                    movementId: movement.id,
                    sessionId,
                    amount,
                    movementReason: movement.reason,
                    provisionType: fund.category,
                    fundTxId: fundTx.id,
                    fundId,
                    fundReason: fundTx.reason,
                    performedBy,
                    createdAt: movement.createdAt,
                },
            });
        }

        // Update memory state
        useCashSessionStore.setState(state => ({
            movements: [movement, ...state.movements]
        }));
        useSinkingFundsStore.setState(state => ({
            sinkingFunds: state.sinkingFunds.map(f =>
                f.id === fundId
                    ? { ...f, currentBalance: newBalance, lastContribution: fundTx.date, history: [fundTx, ...f.history] }
                    : f
            )
        }));
    };

    // Mark expense as paid with cross-store coordination and atomic transaction
    const markExpenseAsPaid = async (
        expenseId: string,
        paidFrom: 'cash' | 'safe' | 'provision',
        performedBy: string = 'System'
    ) => {
        const expense = expenses.expenses.find(e => e.id === expenseId);
        if (!expense || expense.isPaid) return;

        const amount = expense.amount;
        const reason = `Paiement depense: ${expense.description}`;

        let movementData: any = { reason, createdBy: performedBy };
        let safeTx: SafeTransaction | undefined;
        let fundTx: SinkingFundTransaction | undefined;
        let newFundBalance: number | undefined;
        let fundId: string | undefined;

        if (paidFrom === 'cash') {
            const sessionId = cashSession.currentSession?.id;
            if (sessionId) {
                movementData.sessionId = sessionId;
                movementData.movementId = crypto.randomUUID();
            }
        } else if (paidFrom === 'safe') {
            safeTx = {
                id: crypto.randomUUID(),
                type: 'withdrawal',
                amount,
                reason,
                date: new Date().toISOString(),
                performedBy,
            };
        } else if (paidFrom === 'provision') {
            const fund = provisions.sinkingFunds.find(f => f.category === expense.category.toLowerCase());
            if (fund) {
                fundId = fund.id;
                newFundBalance = fund.currentBalance - amount;
                fundTx = {
                    id: crypto.randomUUID(),
                    fundId: fund.id,
                    type: 'withdrawal',
                    amount,
                    reason,
                    date: new Date().toISOString(),
                    performedBy,
                };
            }
        }

        // 1. Atomic DB update via the Rust command (expense status + the
        // matching cash/safe/provision write, fund balance as a delta).
        if (isTauri()) {
            const { invoke } = await import('@tauri-apps/api/core');
            await invoke('record_expense_payment', {
                input: {
                    expenseId,
                    amount,
                    paidFrom,
                    reason,
                    performedBy,
                    createdAt: new Date().toISOString(),
                    sessionId: movementData.sessionId ?? null,
                    movementId: movementData.movementId ?? null,
                    safeTxId: safeTx?.id ?? null,
                    fundTxId: fundTx?.id ?? null,
                    fundId: fundId ?? null,
                },
            });
        }

        // 2. Update memory state
        useExpensesStore.setState(state => ({
            expenses: state.expenses.map(e => e.id === expenseId ? { ...e, isPaid: true, paidFrom } : e)
        }));

        if (paidFrom === 'cash' && movementData.sessionId) {
            const movement: CashMovement = {
                id: movementData.movementId,
                sessionId: movementData.sessionId,
                type: 'expense',
                amount,
                reason,
                createdBy: performedBy,
                createdAt: new Date().toISOString()
            };
            useCashSessionStore.setState(state => ({
                movements: [movement, ...state.movements]
            }));
        } else if (paidFrom === 'safe' && safeTx) {
            useSafeStore.setState(state => ({
                safeBalance: state.safeBalance - amount,
                safeTransactions: [safeTx, ...state.safeTransactions]
            }));
        } else if (paidFrom === 'provision' && fundTx && fundId && newFundBalance !== undefined) {
            useSinkingFundsStore.setState(state => ({
                sinkingFunds: state.sinkingFunds.map(f =>
                    f.id === fundId
                        ? { ...f, currentBalance: newFundBalance!, history: [fundTx!, ...f.history] }
                        : f
                )
            }));
        }
    };

    // Add expense with optional immediate payment
    const addExpense = async (
        expense: Parameters<typeof expenses.addExpense>[0],
        isPaid: boolean = false,
        paidFrom?: 'cash' | 'safe' | 'provision'
    ) => {
        const newExpense = await expenses.addExpense(expense, isPaid, paidFrom);
        if (isPaid && paidFrom) {
            await markExpenseAsPaid(newExpense.id, paidFrom);
        }
    };

    // Calculate total safe + provisions
    const getTotalSafeAndProvisions = () => {
        return safe.safeBalance + provisions.getTotalProvisions();
    };

    // Close session with atomic transfers
    const closeSessionWithTransfers = async (
        closingBalance: number,
        notes: string,
        transfers: {
            safe?: number;
            funds?: Record<string, number>;
        },
        performedBy: string
    ) => {
        const currentSession = cashSession.currentSession;
        if (!currentSession) return;

        const sessionId = currentSession.id;
        const now = new Date().toISOString();

        // 1. Calculate session stats
        const sessionMovements = cashSession.movements.filter(m => m.sessionId === sessionId);
        const totalIn = sessionMovements
            .filter(m => m.type === 'deposit' || (m.type === 'sale' && (m.paymentMethod === 'cash' || !m.paymentMethod)))
            .reduce((sum, m) => sum + m.amount, 0);
        const totalOut = sessionMovements
            .filter(m => ['withdrawal', 'expense', 'refund', 'transfer_to_safe', 'transfer_to_provision'].includes(m.type))
            .reduce((sum, m) => sum + m.amount, 0);

        const expectedBalance = currentSession.openingBalance + totalIn - totalOut;
        const difference = closingBalance - expectedBalance;

        // 2. Prepare transfers
        const repoTransfers: any[] = [];
        const memoryMovements: CashMovement[] = [];
        const memorySafeTxs: SafeTransaction[] = [];
        const fundUpdates: Array<{ id: string, balance: number, tx: SinkingFundTransaction }> = [];

        // Safe transfer
        if (transfers.safe && transfers.safe > 0) {
            const amount = transfers.safe;
            const movement: CashMovement = {
                id: crypto.randomUUID(),
                sessionId,
                type: 'transfer_to_safe',
                amount,
                reason: `Clôture journée (Coffre)`,
                createdBy: performedBy,
                createdAt: now
            };
            const safeTx: SafeTransaction = {
                id: crypto.randomUUID(),
                type: 'deposit',
                amount,
                reason: 'Clôture journée',
                date: now,
                performedBy,
            };
            repoTransfers.push({ movement, safeTx });
            memoryMovements.push(movement);
            memorySafeTxs.push(safeTx);
        }

        // Fund transfers
        if (transfers.funds) {
            for (const [fundId, amount] of Object.entries(transfers.funds)) {
                if (amount <= 0) continue;
                const fund = provisions.sinkingFunds.find(f => f.id === fundId);
                if (!fund) continue;

                const movement: CashMovement = {
                    id: crypto.randomUUID(),
                    sessionId,
                    type: 'transfer_to_provision',
                    amount,
                    reason: `Clôture journée (${fund.name})`,
                    provisionType: fund.category,
                    createdBy: performedBy,
                    createdAt: now
                };
                const fundTx: SinkingFundTransaction = {
                    id: crypto.randomUUID(),
                    fundId,
                    type: 'contribution',
                    amount,
                    reason: 'Clôture journée',
                    date: now,
                    performedBy,
                };
                const newBalance = fund.currentBalance + amount;

                repoTransfers.push({ movement, fundTx, newFundBalance: newBalance });
                memoryMovements.push(movement);
                fundUpdates.push({ id: fundId, balance: newBalance, tx: fundTx });
            }
        }

        // 3. Atomic DB update via the Rust command (session close + all
        // transfers in one transaction; fund balances applied as deltas).
        if (isTauri()) {
            const { invoke } = await import('@tauri-apps/api/core');
            await invoke('close_session', {
                input: {
                    sessionId,
                    closure: {
                        closingAmount: closingBalance,
                        expectedAmount: expectedBalance,
                        difference,
                        closedAt: now,
                        notes,
                    },
                    transfers: repoTransfers.map(toCommandTransfer),
                },
            });
        }

        // 4. Update memory state
        const closedSession: CashSession = {
            ...currentSession,
            closedAt: now,
            closingBalance,
            expectedBalance,
            difference,
            status: 'closed',
            notes,
        };

        useCashSessionStore.setState(state => ({
            currentSession: null,
            sessions: state.sessions.map(s => s.id === sessionId ? closedSession : s),
            movements: [...memoryMovements, ...state.movements]
        }));

        if (memorySafeTxs.length > 0) {
            useSafeStore.setState(state => ({
                safeBalance: state.safeBalance + (transfers.safe || 0),
                safeTransactions: [...memorySafeTxs, ...state.safeTransactions]
            }));
        }

        if (fundUpdates.length > 0) {
            useSinkingFundsStore.setState(state => ({
                sinkingFunds: state.sinkingFunds.map(f => {
                    const update = fundUpdates.find(u => u.id === f.id);
                    return update
                        ? { ...f, currentBalance: update.balance, lastContribution: update.tx.date, history: [update.tx, ...f.history] }
                        : f;
                })
            }));
        }
    };

    // Perform bulk transfers atomically
    const performBulkTransfers = async (
        transfers: {
            safe?: number;
            funds?: Record<string, number>;
        },
        reason: string,
        performedBy: string
    ) => {
        const sessionId = cashSession.currentSession?.id;
        if (!sessionId) return;

        const now = new Date().toISOString();
        const repoTransfers: any[] = [];
        const memoryMovements: CashMovement[] = [];
        const memorySafeTxs: SafeTransaction[] = [];
        const fundUpdates: Array<{ id: string, balance: number, tx: SinkingFundTransaction }> = [];

        // Safe transfer
        if (transfers.safe && transfers.safe > 0) {
            const amount = transfers.safe;
            const movement: CashMovement = {
                id: crypto.randomUUID(),
                sessionId,
                type: 'transfer_to_safe',
                amount,
                reason: `Transfert: ${reason}`,
                createdBy: performedBy,
                createdAt: now
            };
            const safeTx: SafeTransaction = {
                id: crypto.randomUUID(),
                type: 'deposit',
                amount,
                reason: reason,
                date: now,
                performedBy,
            };
            repoTransfers.push({ movement, safeTx });
            memoryMovements.push(movement);
            memorySafeTxs.push(safeTx);
        }

        // Fund transfers
        if (transfers.funds) {
            for (const [fundId, amount] of Object.entries(transfers.funds)) {
                if (amount <= 0) continue;
                const fund = provisions.sinkingFunds.find(f => f.id === fundId);
                if (!fund) continue;

                const movement: CashMovement = {
                    id: crypto.randomUUID(),
                    sessionId,
                    type: 'transfer_to_provision',
                    amount,
                    reason: `Provision ${fund.name}: ${reason}`,
                    provisionType: fund.category,
                    createdBy: performedBy,
                    createdAt: now
                };
                const fundTx: SinkingFundTransaction = {
                    id: crypto.randomUUID(),
                    fundId,
                    type: 'contribution',
                    amount,
                    reason: reason,
                    date: now,
                    performedBy,
                };
                const newBalance = fund.currentBalance + amount;

                repoTransfers.push({ movement, fundTx, newFundBalance: newBalance });
                memoryMovements.push(movement);
                fundUpdates.push({ id: fundId, balance: newBalance, tx: fundTx });
            }
        }

        if (repoTransfers.length === 0) return;

        // Atomic DB update via the Rust command (transfers only — no session
        // closure; fund balances applied as deltas).
        if (isTauri()) {
            const { invoke } = await import('@tauri-apps/api/core');
            await invoke('close_session', {
                input: {
                    sessionId,
                    transfers: repoTransfers.map(toCommandTransfer),
                },
            });
        }

        // Memory state update
        useCashSessionStore.setState(state => ({
            movements: [...memoryMovements, ...state.movements]
        }));

        if (memorySafeTxs.length > 0) {
            useSafeStore.setState(state => ({
                safeBalance: state.safeBalance + (transfers.safe || 0),
                safeTransactions: [...memorySafeTxs, ...state.safeTransactions]
            }));
        }

        if (fundUpdates.length > 0) {
            useSinkingFundsStore.setState(state => ({
                sinkingFunds: state.sinkingFunds.map(f => {
                    const update = fundUpdates.find(u => u.id === f.id);
                    return update
                        ? { ...f, currentBalance: update.balance, lastContribution: update.tx.date, history: [update.tx, ...f.history] }
                        : f;
                })
            }));
        }
    };

    // ========== RETURN COMBINED API ==========

    return {
        // Cash Session State & Actions
        currentSession: cashSession.currentSession,
        sessions: cashSession.sessions,
        movements: cashSession.movements,
        openSession: cashSession.openSession,
        closeSession: cashSession.closeSession,
        closeSessionWithTransfers,
        performBulkTransfers,
        addMovement: cashSession.addMovement,
        getSessionMovements: cashSession.getSessionMovements,
        getTodaySales: cashSession.getTodaySales,
        getCurrentBalance: cashSession.getCurrentBalance,
        getSessionTotals: cashSession.getSessionTotals,

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

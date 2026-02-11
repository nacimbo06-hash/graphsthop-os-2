/**
 * Sinking Funds Store - SuperMarket Control OS
 *
 * Manages provisions (salaries, bank credit, fixed charges).
 * Part of the treasury store split for better maintainability.
 */

import { create } from 'zustand';
import type { SinkingFund, SinkingFundTransaction, CashMovement } from '@shared/types/treasury';
import { sinkingFundsRepo } from '../../db';

// ============================================
// DEFAULT DATA
// ============================================

const defaultSinkingFunds: SinkingFund[] = [
    {
        id: 'salaries',
        name: 'Provision Salaires',
        icon: '👥',
        color: '#3D7C4F',
        targetAmount: 150000,
        currentBalance: 0,
        dueDay: 28,
        isRecurring: true,
        category: 'salaries',
        lastContribution: null,
        history: [],
    },
    {
        id: 'bankCredit',
        name: 'Credit Bancaire',
        icon: '🏦',
        color: '#4A7B8C',
        targetAmount: 50000,
        currentBalance: 0,
        dueDay: 15,
        isRecurring: true,
        category: 'bankCredit',
        lastContribution: null,
        history: [],
    },
    {
        id: 'fixedCharges',
        name: 'Charges Fixes',
        icon: '⚡',
        color: '#D4A84B',
        targetAmount: 80000,
        currentBalance: 0,
        dueDay: 5,
        isRecurring: true,
        category: 'fixedCharges',
        lastContribution: null,
        history: [],
    },
];

// ============================================
// STATE INTERFACE
// ============================================

interface SinkingFundsState {
    // State
    sinkingFunds: SinkingFund[];
    isLoading: boolean;
    isHydrated: boolean;

    // Lifecycle
    hydrate: () => Promise<void>;

    // Actions
    contributeToFund: (
        fundId: string,
        amount: number,
        reason: string,
        performedBy: string,
        onMovement?: (movement: Omit<CashMovement, 'id' | 'sessionId' | 'createdAt'>) => void
    ) => Promise<void>;
    withdrawFromFund: (fundId: string, amount: number, reason: string, performedBy: string) => Promise<boolean>;
    updateFundTarget: (fundId: string, newTarget: number) => Promise<void>;
    addSinkingFund: (fund: Omit<SinkingFund, 'id' | 'currentBalance' | 'lastContribution' | 'history'>) => Promise<void>;

    // Getters
    getDailyProvisionTarget: () => { salaries: number; bankCredit: number; fixedCharges: number; total: number };
    getProvisionProgress: () => { salaries: number; bankCredit: number; fixedCharges: number };
    getTotalProvisions: () => number;
}

// ============================================
// STORE
// ============================================

export const useSinkingFundsStore = create<SinkingFundsState>()(
    (set, get) => ({
        sinkingFunds: defaultSinkingFunds,
        isLoading: false,
        isHydrated: false,

        hydrate: async () => {
            if (get().isHydrated) return;
            set({ isLoading: true });
            try {
                // Seed defaults if DB is empty
                await sinkingFundsRepo.seedDefaults(defaultSinkingFunds);
                const funds = await sinkingFundsRepo.loadAll();
                set({ sinkingFunds: funds.length > 0 ? funds : defaultSinkingFunds, isHydrated: true, isLoading: false });
                console.log(`[SinkingFundsStore] Hydrated ${funds.length} funds from DB`);
            } catch (error) {
                console.error('[SinkingFundsStore] Failed to hydrate:', error);
                set({ isLoading: false });
            }
        },

        // ========== FUND ACTIONS ==========

        contributeToFund: async (fundId, amount, reason, performedBy, onMovement) => {
            const { sinkingFunds } = get();
            const fund = sinkingFunds.find(f => f.id === fundId);

            const transaction: SinkingFundTransaction = {
                id: crypto.randomUUID(),
                fundId,
                type: 'contribution',
                amount,
                reason,
                date: new Date().toISOString(),
                performedBy,
            };

            // Notify session store via callback (if provided)
            if (onMovement && fund) {
                onMovement({
                    type: 'transfer_to_provision',
                    amount,
                    reason: `Provision ${fund.name}: ${reason}`,
                    provisionType: fund.category,
                    createdBy: performedBy,
                });
            }

            const newBalance = (fund?.currentBalance || 0) + amount;
            const now = new Date().toISOString();

            await sinkingFundsRepo.addTransaction(transaction);
            await sinkingFundsRepo.updateBalance(fundId, newBalance, now);

            set(state => ({
                sinkingFunds: state.sinkingFunds.map(f =>
                    f.id === fundId
                        ? {
                            ...f,
                            currentBalance: newBalance,
                            lastContribution: now,
                            history: [transaction, ...f.history],
                        }
                        : f
                ),
            }));
        },

        withdrawFromFund: async (fundId, amount, reason, performedBy) => {
            const { sinkingFunds } = get();
            const fund = sinkingFunds.find(f => f.id === fundId);
            if (!fund || amount > fund.currentBalance) {
                console.error('[ERROR] Insufficient fund balance');
                return false;
            }

            const transaction: SinkingFundTransaction = {
                id: crypto.randomUUID(),
                fundId,
                type: 'withdrawal',
                amount,
                reason,
                date: new Date().toISOString(),
                performedBy,
            };

            const newBalance = fund.currentBalance - amount;

            await sinkingFundsRepo.addTransaction(transaction);
            await sinkingFundsRepo.updateBalance(fundId, newBalance, null);

            set(state => ({
                sinkingFunds: state.sinkingFunds.map(f =>
                    f.id === fundId
                        ? {
                            ...f,
                            currentBalance: newBalance,
                            history: [transaction, ...f.history],
                        }
                        : f
                ),
            }));

            return true;
        },

        updateFundTarget: async (fundId, newTarget) => {
            await sinkingFundsRepo.updateTarget(fundId, newTarget);
            set(state => ({
                sinkingFunds: state.sinkingFunds.map(f =>
                    f.id === fundId ? { ...f, targetAmount: newTarget } : f
                ),
            }));
        },

        addSinkingFund: async (fund) => {
            const newFund: SinkingFund = {
                ...fund,
                id: crypto.randomUUID(),
                currentBalance: 0,
                lastContribution: null,
                history: [],
            };

            await sinkingFundsRepo.create(newFund);

            set(state => ({
                sinkingFunds: [...state.sinkingFunds, newFund],
            }));
        },

        // ========== GETTERS ==========

        getDailyProvisionTarget: () => {
            const { sinkingFunds } = get();
            const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

            const salaries = (sinkingFunds.find(f => f.category === 'salaries')?.targetAmount || 0) / daysInMonth;
            const bankCredit = (sinkingFunds.find(f => f.category === 'bankCredit')?.targetAmount || 0) / daysInMonth;
            const fixedCharges = (sinkingFunds.find(f => f.category === 'fixedCharges')?.targetAmount || 0) / daysInMonth;

            return {
                salaries: Math.round(salaries),
                bankCredit: Math.round(bankCredit),
                fixedCharges: Math.round(fixedCharges),
                total: Math.round(salaries + bankCredit + fixedCharges),
            };
        },

        getProvisionProgress: () => {
            const { sinkingFunds } = get();
            const currentDay = new Date().getDate();
            const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
            const expectedProgress = currentDay / daysInMonth;

            const calcProgress = (category: string) => {
                const fund = sinkingFunds.find(f => f.category === category);
                if (!fund) return 0;
                const expectedNow = fund.targetAmount * expectedProgress;
                return expectedNow > 0 ? Math.min(100, (fund.currentBalance / expectedNow) * 100) : 0;
            };

            return {
                salaries: Math.round(calcProgress('salaries')),
                bankCredit: Math.round(calcProgress('bankCredit')),
                fixedCharges: Math.round(calcProgress('fixedCharges')),
            };
        },

        getTotalProvisions: () => {
            return get().sinkingFunds.reduce((sum, f) => sum + f.currentBalance, 0);
        },
    })
);

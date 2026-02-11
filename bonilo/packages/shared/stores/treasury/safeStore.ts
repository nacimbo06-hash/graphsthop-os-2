/**
 * Safe Store - SuperMarket Control OS
 *
 * Manages the safe (coffre) balance and transactions.
 * Part of the treasury store split for better maintainability.
 */

import { create } from 'zustand';
import type { SafeTransaction, CashMovement } from '@shared/types/treasury';
import { safeRepo } from '../../db';

// ============================================
// STATE INTERFACE
// ============================================

interface SafeState {
    // State
    safeBalance: number;
    safeTransactions: SafeTransaction[];
    isLoading: boolean;
    isHydrated: boolean;

    // Lifecycle
    hydrate: () => Promise<void>;

    // Actions (with optional callback for cross-store communication)
    depositToSafe: (
        amount: number,
        reason: string,
        performedBy: string,
        onMovement?: (movement: Omit<CashMovement, 'id' | 'sessionId' | 'createdAt'>) => void
    ) => Promise<void>;
    withdrawFromSafe: (amount: number, reason: string, performedBy: string) => Promise<boolean>;

    // Getters
    getSafeBalance: () => number;
}

// ============================================
// STORE
// ============================================

export const useSafeStore = create<SafeState>()(
    (set, get) => ({
        safeBalance: 0,
        safeTransactions: [],
        isLoading: false,
        isHydrated: false,

        hydrate: async () => {
            if (get().isHydrated) return;
            set({ isLoading: true });
            try {
                const [transactions, balance] = await Promise.all([
                    safeRepo.loadTransactions(),
                    safeRepo.computeBalance(),
                ]);
                set({ safeTransactions: transactions, safeBalance: balance, isHydrated: true, isLoading: false });
                console.log(`[SafeStore] Hydrated ${transactions.length} transactions, balance=${balance} from DB`);
            } catch (error) {
                console.error('[SafeStore] Failed to hydrate:', error);
                set({ isLoading: false });
            }
        },

        // ========== SAFE ACTIONS ==========

        depositToSafe: async (amount, reason, performedBy, onMovement) => {
            const transaction: SafeTransaction = {
                id: crypto.randomUUID(),
                type: 'deposit',
                amount,
                reason,
                date: new Date().toISOString(),
                performedBy,
            };

            // Notify session store via callback (if provided)
            if (onMovement) {
                onMovement({
                    type: 'transfer_to_safe',
                    amount,
                    reason: `Transfert vers coffre: ${reason}`,
                    createdBy: performedBy,
                });
            }

            await safeRepo.addTransaction(transaction);

            set(state => ({
                safeBalance: state.safeBalance + amount,
                safeTransactions: [transaction, ...state.safeTransactions],
            }));
        },

        withdrawFromSafe: async (amount, reason, performedBy) => {
            const { safeBalance } = get();
            if (amount > safeBalance) {
                console.error('[ERROR] Insufficient safe balance');
                return false;
            }

            const transaction: SafeTransaction = {
                id: crypto.randomUUID(),
                type: 'withdrawal',
                amount,
                reason,
                date: new Date().toISOString(),
                performedBy,
            };

            await safeRepo.addTransaction(transaction);

            set(state => ({
                safeBalance: state.safeBalance - amount,
                safeTransactions: [transaction, ...state.safeTransactions],
            }));

            return true;
        },

        // ========== GETTERS ==========

        getSafeBalance: () => get().safeBalance,
    })
);

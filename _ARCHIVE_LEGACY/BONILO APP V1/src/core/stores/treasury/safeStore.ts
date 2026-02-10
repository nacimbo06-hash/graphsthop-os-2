/**
 * Safe Store - SuperMarket Control OS
 * 
 * Manages the safe (coffre) balance and transactions.
 * Part of the treasury store split for better maintainability.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SafeTransaction, CashMovement } from '../../types/treasury';

// ============================================
// STATE INTERFACE
// ============================================

interface SafeState {
    // State
    safeBalance: number;
    safeTransactions: SafeTransaction[];

    // Actions (with optional callback for cross-store communication)
    depositToSafe: (
        amount: number,
        reason: string,
        performedBy: string,
        onMovement?: (movement: Omit<CashMovement, 'id' | 'sessionId' | 'createdAt'>) => void
    ) => void;
    withdrawFromSafe: (amount: number, reason: string, performedBy: string) => boolean;

    // Getters
    getSafeBalance: () => number;
}

// ============================================
// STORE
// ============================================

export const useSafeStore = create<SafeState>()(
    persist(
        (set, get) => ({
            safeBalance: 0,
            safeTransactions: [],

            // ========== SAFE ACTIONS ==========

            depositToSafe: (amount, reason, performedBy, onMovement) => {
                const transaction: SafeTransaction = {
                    id: crypto.randomUUID(),
                    type: 'deposit',
                    amount,
                    reason,
                    date: new Date(),
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

                set(state => ({
                    safeBalance: state.safeBalance + amount,
                    safeTransactions: [transaction, ...state.safeTransactions],
                }));
            },

            withdrawFromSafe: (amount, reason, performedBy) => {
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
                    date: new Date(),
                    performedBy,
                };

                set(state => ({
                    safeBalance: state.safeBalance - amount,
                    safeTransactions: [transaction, ...state.safeTransactions],
                }));

                return true;
            },

            // ========== GETTERS ==========

            getSafeBalance: () => get().safeBalance,
        }),
        {
            name: 'treasury-storage-v2',
            partialize: (state) => ({
                safeBalance: state.safeBalance,
                safeTransactions: state.safeTransactions,
            }),
        }
    )
);

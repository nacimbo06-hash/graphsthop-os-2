/**
 * Expenses Store - SuperMarket Control OS
 * 
 * Manages expense tracking and payment.
 * Part of the treasury store split for better maintainability.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Expense, ExpenseCategory, CashMovement } from '@shared/types/treasury';

// ============================================
// DEFAULT DATA
// ============================================

const defaultExpenseCategories: ExpenseCategory[] = [
    { id: 'supplies', name: 'Fournitures', icon: '📦', color: '#4A7B8C' },
    { id: 'utilities', name: 'Charges', icon: '⚡', color: '#D4A84B' },
    { id: 'rent', name: 'Loyer', icon: '🏠', color: '#7B6B8A' },
    { id: 'transport', name: 'Transport', icon: '🚚', color: '#D4875A' },
    { id: 'maintenance', name: 'Entretien', icon: '🔧', color: '#B07388' },
    { id: 'salary', name: 'Salaires', icon: '👥', color: '#3D7C4F' },
    { id: 'admin', name: 'Administratif', icon: '📋', color: '#5B8FA8' },
    { id: 'other', name: 'Autres', icon: '📄', color: '#8A8078' },
];

// ============================================
// STATE INTERFACE
// ============================================

interface ExpensesState {
    // State
    expenses: Expense[];
    expenseCategories: ExpenseCategory[];

    // Actions
    addExpense: (
        expense: Omit<Expense, 'id' | 'createdAt' | 'isPaid' | 'paidFrom'>,
        isPaid?: boolean,
        paidFrom?: 'cash' | 'safe' | 'provision'
    ) => Expense;
    markExpenseAsPaid: (
        expenseId: string,
        paidFrom: 'cash' | 'safe' | 'provision',
        performedBy: string,
        callbacks?: {
            onMovement?: (movement: Omit<CashMovement, 'id' | 'sessionId' | 'createdAt'>) => void;
            onWithdrawFromSafe?: (amount: number, reason: string, performedBy: string) => boolean;
            onWithdrawFromFund?: (fundId: string, amount: number, reason: string, performedBy: string) => boolean;
            getFundByCategory?: (category: string) => { id: string } | undefined;
        }
    ) => void;
    deleteExpense: (expenseId: string) => void;

    // Getters
    getTodayExpenses: () => number;
    getUnpaidExpenses: () => Expense[];
}

// ============================================
// STORE
// ============================================

export const useExpensesStore = create<ExpensesState>()(
    persist(
        (set, get) => ({
            expenses: [],
            expenseCategories: defaultExpenseCategories,

            // ========== EXPENSE ACTIONS ==========

            addExpense: (expense, isPaid = false, paidFrom) => {
                const newExpense: Expense = {
                    ...expense,
                    id: crypto.randomUUID(),
                    createdAt: new Date(),
                    isPaid,
                    paidFrom: paidFrom || null,
                };

                set(state => ({
                    expenses: [newExpense, ...state.expenses],
                }));

                return newExpense;
            },

            markExpenseAsPaid: (expenseId, paidFrom, performedBy, callbacks) => {
                const { expenses } = get();
                const expense = expenses.find(e => e.id === expenseId);
                if (!expense || expense.isPaid) return;

                // Handle the financial impact via callbacks
                if (paidFrom === 'cash' && callbacks?.onMovement) {
                    callbacks.onMovement({
                        type: 'expense',
                        amount: expense.amount,
                        reason: `Paiement dépense: ${expense.description}`,
                        createdBy: performedBy,
                    });
                } else if (paidFrom === 'safe' && callbacks?.onWithdrawFromSafe) {
                    callbacks.onWithdrawFromSafe(
                        expense.amount,
                        `Paiement dépense: ${expense.description}`,
                        performedBy
                    );
                } else if (paidFrom === 'provision' && callbacks?.onWithdrawFromFund && callbacks?.getFundByCategory) {
                    const fund = callbacks.getFundByCategory(expense.category.toLowerCase());
                    if (fund) {
                        callbacks.onWithdrawFromFund(
                            fund.id,
                            expense.amount,
                            `Paiement dépense: ${expense.description}`,
                            performedBy
                        );
                    }
                }

                set(state => ({
                    expenses: state.expenses.map(e =>
                        e.id === expenseId ? { ...e, isPaid: true, paidFrom } : e
                    ),
                }));
            },

            deleteExpense: (expenseId) => {
                set(state => ({
                    expenses: state.expenses.filter(e => e.id !== expenseId),
                }));
            },

            // ========== GETTERS ==========

            getTodayExpenses: () => {
                const today = new Date().toDateString();
                return get().expenses
                    .filter(e => e.isPaid && new Date(e.createdAt).toDateString() === today)
                    .reduce((sum, e) => sum + e.amount, 0);
            },

            getUnpaidExpenses: () => {
                return get().expenses.filter(e => !e.isPaid);
            },
        }),
        {
            name: 'treasury-storage-v2',
            partialize: (state) => ({
                expenses: state.expenses,
            }),
        }
    )
);

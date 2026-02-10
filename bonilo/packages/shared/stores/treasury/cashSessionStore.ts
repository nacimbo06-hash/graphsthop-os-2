/**
 * Cash Session Store - SuperMarket Control OS
 * 
 * Manages cash register sessions and movements.
 * Part of the treasury store split for better maintainability.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CashSession, CashMovement } from '@shared/types/treasury';

// ============================================
// STATE INTERFACE
// ============================================

interface CashSessionState {
    // State
    currentSession: CashSession | null;
    sessions: CashSession[];
    movements: CashMovement[];

    // Actions
    openSession: (openingBalance: number, cashierName: string) => void;
    closeSession: (closingBalance: number, notes?: string) => void;
    addMovement: (movement: Omit<CashMovement, 'id' | 'sessionId' | 'createdAt'>) => void;

    // Getters
    getSessionMovements: (sessionId: string) => CashMovement[];
    getTodaySales: () => number;
    getCurrentBalance: () => number;
}

// ============================================
// STORE
// ============================================

export const useCashSessionStore = create<CashSessionState>()(
    persist(
        (set, get) => ({
            currentSession: null,
            sessions: [],
            movements: [],

            // ========== SESSION ACTIONS ==========

            openSession: (openingBalance, cashierName) => {
                const newSession: CashSession = {
                    id: crypto.randomUUID(),
                    openedAt: new Date(),
                    closedAt: null,
                    openingBalance,
                    closingBalance: null,
                    expectedBalance: null,
                    difference: null,
                    cashierId: '1',
                    cashierName,
                    status: 'open',
                    notes: '',
                    transferToSafe: 0,
                    transferToProvisions: {
                        salaries: 0,
                        bankCredit: 0,
                        fixedCharges: 0,
                    },
                };

                set(state => ({
                    currentSession: newSession,
                    sessions: [newSession, ...state.sessions],
                }));
            },

            closeSession: (closingBalance, notes = '') => {
                const { currentSession, movements } = get();
                if (!currentSession) return;

                const sessionMovements = movements.filter(m => m.sessionId === currentSession.id);
                const totalIn = sessionMovements
                    .filter(m => m.type === 'deposit' || (m.type === 'sale' && (m.paymentMethod === 'cash' || !m.paymentMethod)))
                    .reduce((sum, m) => sum + m.amount, 0);
                const totalOut = sessionMovements
                    .filter(m => ['withdrawal', 'expense', 'refund', 'transfer_to_safe', 'transfer_to_provision'].includes(m.type))
                    .reduce((sum, m) => sum + m.amount, 0);

                const expectedBalance = currentSession.openingBalance + totalIn - totalOut;
                const difference = closingBalance - expectedBalance;

                const closedSession: CashSession = {
                    ...currentSession,
                    closedAt: new Date(),
                    closingBalance,
                    expectedBalance,
                    difference,
                    status: 'closed',
                    notes,
                };

                set(state => ({
                    currentSession: null,
                    sessions: state.sessions.map(s =>
                        s.id === closedSession.id ? closedSession : s
                    ),
                }));
            },

            // ========== MOVEMENT ACTIONS ==========

            addMovement: (movement) => {
                const { currentSession } = get();
                if (!currentSession || currentSession.status !== 'open') {
                    console.error('[SECURITY] Cannot add movement: No active session or session is closed');
                    return;
                }

                const newMovement: CashMovement = {
                    ...movement,
                    id: crypto.randomUUID(),
                    sessionId: currentSession.id,
                    createdAt: new Date(),
                };

                set(state => ({
                    movements: [newMovement, ...state.movements],
                }));
            },

            // ========== GETTERS ==========

            getSessionMovements: (sessionId) => {
                return get().movements.filter(m => m.sessionId === sessionId);
            },

            getTodaySales: () => {
                const today = new Date().toDateString();
                return get().movements
                    .filter(m => m.type === 'sale' && new Date(m.createdAt).toDateString() === today)
                    .reduce((sum, m) => sum + m.amount, 0);
            },

            getCurrentBalance: () => {
                const { currentSession, movements } = get();
                if (!currentSession) return 0;

                const sessionMovements = movements.filter(m => m.sessionId === currentSession.id);
                const totalIn = sessionMovements
                    .filter(m => m.type === 'deposit' || (m.type === 'sale' && (m.paymentMethod === 'cash' || !m.paymentMethod)))
                    .reduce((sum, m) => sum + m.amount, 0);
                const totalOut = sessionMovements
                    .filter(m => ['withdrawal', 'expense', 'refund', 'transfer_to_safe', 'transfer_to_provision'].includes(m.type))
                    .reduce((sum, m) => sum + m.amount, 0);

                return currentSession.openingBalance + totalIn - totalOut;
            },
        }),
        {
            name: 'treasury-storage-v2',
            partialize: (state) => ({
                sessions: state.sessions,
                movements: state.movements,
                currentSession: state.currentSession,
            }),
        }
    )
);

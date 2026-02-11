/**
 * Cash Session Store - SuperMarket Control OS
 *
 * Manages cash register sessions and movements.
 * Part of the treasury store split for better maintainability.
 */

import { create } from 'zustand';
import type { CashSession, CashMovement } from '@shared/types/treasury';
import { cashSessionRepo } from '../../db';

// ============================================
// STATE INTERFACE
// ============================================

interface CashSessionState {
    // State
    currentSession: CashSession | null;
    sessions: CashSession[];
    movements: CashMovement[];
    isLoading: boolean;
    isHydrated: boolean;

    // Lifecycle
    hydrate: () => Promise<void>;

    // Actions
    openSession: (openingBalance: number, cashierName: string) => Promise<void>;
    closeSession: (closingBalance: number, notes?: string) => Promise<void>;
    addMovement: (movement: Omit<CashMovement, 'id' | 'sessionId' | 'createdAt'>) => Promise<void>;

    // Getters
    getSessionMovements: (sessionId: string) => CashMovement[];
    getTodaySales: () => number;
    getCurrentBalance: () => number;
}

// ============================================
// STORE
// ============================================

export const useCashSessionStore = create<CashSessionState>()(
    (set, get) => ({
        currentSession: null,
        sessions: [],
        movements: [],
        isLoading: false,
        isHydrated: false,

        hydrate: async () => {
            if (get().isHydrated) return;
            set({ isLoading: true });
            try {
                const [sessions, movements] = await Promise.all([
                    cashSessionRepo.loadSessions(),
                    cashSessionRepo.loadMovements(),
                ]);
                const currentSession = sessions.find(s => s.status === 'open') || null;
                set({ sessions, movements, currentSession, isHydrated: true, isLoading: false });
                console.log(`[CashSessionStore] Hydrated ${sessions.length} sessions, ${movements.length} movements from DB`);
            } catch (error) {
                console.error('[CashSessionStore] Failed to hydrate:', error);
                set({ isLoading: false });
            }
        },

        // ========== SESSION ACTIONS ==========

        openSession: async (openingBalance, cashierName) => {
            const newSession: CashSession = {
                id: crypto.randomUUID(),
                openedAt: new Date().toISOString(),
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

            await cashSessionRepo.createSession(newSession);

            set(state => ({
                currentSession: newSession,
                sessions: [newSession, ...state.sessions],
            }));
        },

        closeSession: async (closingBalance, notes = '') => {
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
                closedAt: new Date().toISOString(),
                closingBalance,
                expectedBalance,
                difference,
                status: 'closed',
                notes,
            };

            await cashSessionRepo.closeSession(closedSession);

            set(state => ({
                currentSession: null,
                sessions: state.sessions.map(s =>
                    s.id === closedSession.id ? closedSession : s
                ),
            }));
        },

        // ========== MOVEMENT ACTIONS ==========

        addMovement: async (movement) => {
            const { currentSession } = get();
            if (!currentSession || currentSession.status !== 'open') {
                console.error('[SECURITY] Cannot add movement: No active session or session is closed');
                return;
            }

            const newMovement: CashMovement = {
                ...movement,
                id: crypto.randomUUID(),
                sessionId: currentSession.id,
                createdAt: new Date().toISOString(),
            };

            await cashSessionRepo.addMovement(newMovement);

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
    })
);

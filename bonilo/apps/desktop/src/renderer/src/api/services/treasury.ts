/**
 * Treasury API Service
 * 
 * Handles all treasury-related API calls.
 * Supports both online (API) and offline (local store) modes.
 */

import { apiClient, ApiResponse } from '../client';
import { API_CONFIG, ENDPOINTS } from '../config';
import type { CashSession, CashMovement, Expense } from '@bonilo/shared';

// ===== TYPES =====

export interface OpenSessionRequest {
    initialCash: number;
    notes?: string;
}

export interface CloseSessionRequest {
    countedCash: number;
    notes?: string;
}

export interface AddMovementRequest {
    type: 'in' | 'out';
    amount: number;
    reason: string;
    category?: string;
}

export interface CreateExpenseRequest {
    amount: number;
    category: string;
    description: string;
    payee?: string;
    date?: string;
}

export interface SessionSummary {
    session: CashSession;
    movements: CashMovement[];
    totalIn: number;
    totalOut: number;
    expectedBalance: number;
}

// ===== TREASURY SERVICE =====

export const treasuryApi = {
    /**
     * Get current active session
     */
    async getCurrentSession(): Promise<ApiResponse<SessionSummary | null>> {
        if (API_CONFIG.MOCK_MODE) {
            return { success: true, data: null };
        }
        return apiClient.get<SessionSummary | null>(ENDPOINTS.TREASURY.CURRENT_SESSION);
    },

    /**
     * Open a new cash session
     */
    async openSession(request: OpenSessionRequest): Promise<ApiResponse<CashSession>> {
        if (API_CONFIG.MOCK_MODE) {
            return { success: false, error: 'Mock mode - use local store' };
        }
        return apiClient.post<CashSession>(ENDPOINTS.TREASURY.OPEN_SESSION, request);
    },

    /**
     * Close the current session
     */
    async closeSession(request: CloseSessionRequest): Promise<ApiResponse<CashSession>> {
        if (API_CONFIG.MOCK_MODE) {
            return { success: false, error: 'Mock mode - use local store' };
        }
        return apiClient.post<CashSession>(ENDPOINTS.TREASURY.CLOSE_SESSION, request);
    },

    /**
     * Get all sessions
     */
    async getSessions(filters?: { startDate?: string; endDate?: string }): Promise<ApiResponse<CashSession[]>> {
        if (API_CONFIG.MOCK_MODE) {
            return { success: true, data: [] };
        }

        let endpoint = ENDPOINTS.TREASURY.SESSIONS;
        if (filters) {
            const params = new URLSearchParams();
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (params.toString()) endpoint += `?${params}`;
        }

        return apiClient.get<CashSession[]>(endpoint);
    },

    /**
     * Add a cash movement
     */
    async addMovement(request: AddMovementRequest): Promise<ApiResponse<CashMovement>> {
        if (API_CONFIG.MOCK_MODE) {
            return { success: false, error: 'Mock mode - use local store' };
        }
        return apiClient.post<CashMovement>(ENDPOINTS.TREASURY.MOVEMENTS, request);
    },

    /**
     * Get movements for current session
     */
    async getMovements(): Promise<ApiResponse<CashMovement[]>> {
        if (API_CONFIG.MOCK_MODE) {
            return { success: true, data: [] };
        }
        return apiClient.get<CashMovement[]>(ENDPOINTS.TREASURY.MOVEMENTS);
    },

    /**
     * Get safe balance and transactions
     */
    async getSafe(): Promise<ApiResponse<{ balance: number; transactions: any[] }>> {
        if (API_CONFIG.MOCK_MODE) {
            return { success: true, data: { balance: 0, transactions: [] } };
        }
        return apiClient.get(ENDPOINTS.TREASURY.SAFE);
    },

    /**
     * Create an expense
     */
    async createExpense(request: CreateExpenseRequest): Promise<ApiResponse<Expense>> {
        if (API_CONFIG.MOCK_MODE) {
            return { success: false, error: 'Mock mode - use local store' };
        }
        return apiClient.post<Expense>(ENDPOINTS.TREASURY.EXPENSES, request);
    },

    /**
     * Get all expenses
     */
    async getExpenses(filters?: { startDate?: string; endDate?: string; category?: string }): Promise<ApiResponse<Expense[]>> {
        if (API_CONFIG.MOCK_MODE) {
            return { success: true, data: [] };
        }

        let endpoint = ENDPOINTS.TREASURY.EXPENSES;
        if (filters) {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            if (params.toString()) endpoint += `?${params}`;
        }

        return apiClient.get<Expense[]>(endpoint);
    },
};

export default treasuryApi;

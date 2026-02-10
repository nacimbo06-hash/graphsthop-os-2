/**
 * Sales API Service
 * 
 * Handles all sales-related API calls.
 * Supports both online (API) and offline (local store) modes.
 */

import { apiClient, ApiResponse } from '../client';
import { API_CONFIG, ENDPOINTS } from '../config';
import type { Sale } from '@core';

// ===== TYPES =====

export interface SaleCreateRequest {
    items: {
        productId: string;
        quantity: number;
        unitPrice: number;
        discountPercent?: number;
    }[];
    customerId?: string;
    paymentMethod: string;
    discountAmount?: number;
    notes?: string;
}

export interface SalesFilters {
    startDate?: string;
    endDate?: string;
    cashierId?: string;
    customerId?: string;
    paymentMethod?: string;
    status?: string;
    page?: number;
    limit?: number;
}

export interface SalesListResponse {
    sales: Sale[];
    total: number;
    page: number;
    totalPages: number;
    summary?: {
        totalAmount: number;
        totalCount: number;
    };
}

export interface DailyReportResponse {
    date: string;
    totalSales: number;
    totalAmount: number;
    byPaymentMethod: Record<string, { count: number; amount: number }>;
    byHour: { hour: number; count: number; amount: number }[];
}

// ===== SALES SERVICE =====

export const salesApi = {
    /**
     * Get all sales with optional filters
     */
    async getAll(filters?: SalesFilters): Promise<ApiResponse<SalesListResponse>> {
        if (API_CONFIG.MOCK_MODE) {
            return {
                success: true,
                data: {
                    sales: [],
                    total: 0,
                    page: 1,
                    totalPages: 0,
                },
            };
        }

        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const endpoint = params.toString()
            ? `${ENDPOINTS.SALES.LIST}?${params}`
            : ENDPOINTS.SALES.LIST;

        return apiClient.get<SalesListResponse>(endpoint);
    },

    /**
     * Get a single sale by ID
     */
    async getById(id: string): Promise<ApiResponse<Sale>> {
        if (API_CONFIG.MOCK_MODE) {
            return { success: false, error: 'Mock mode - use local store' };
        }
        return apiClient.get<Sale>(ENDPOINTS.SALES.GET(id));
    },

    /**
     * Create a new sale
     */
    async create(sale: SaleCreateRequest): Promise<ApiResponse<Sale>> {
        if (API_CONFIG.MOCK_MODE) {
            return { success: false, error: 'Mock mode - use local store' };
        }
        return apiClient.post<Sale>(ENDPOINTS.SALES.CREATE, sale);
    },

    /**
     * Void a sale
     */
    async void(id: string, reason: string): Promise<ApiResponse<Sale>> {
        if (API_CONFIG.MOCK_MODE) {
            return { success: false, error: 'Mock mode - use local store' };
        }
        return apiClient.post<Sale>(ENDPOINTS.SALES.VOID(id), { reason });
    },

    /**
     * Refund a sale
     */
    async refund(id: string, items: { productId: string; quantity: number }[]): Promise<ApiResponse<Sale>> {
        if (API_CONFIG.MOCK_MODE) {
            return { success: false, error: 'Mock mode - use local store' };
        }
        return apiClient.post<Sale>(ENDPOINTS.SALES.REFUND(id), { items });
    },

    /**
     * Get daily sales report
     */
    async getDailyReport(date?: string): Promise<ApiResponse<DailyReportResponse>> {
        if (API_CONFIG.MOCK_MODE) {
            return {
                success: true,
                data: {
                    date: date || new Date().toISOString().split('T')[0],
                    totalSales: 0,
                    totalAmount: 0,
                    byPaymentMethod: {},
                    byHour: [],
                },
            };
        }

        const endpoint = date
            ? `${ENDPOINTS.SALES.DAILY_REPORT}?date=${date}`
            : ENDPOINTS.SALES.DAILY_REPORT;

        return apiClient.get<DailyReportResponse>(endpoint);
    },
};

export default salesApi;

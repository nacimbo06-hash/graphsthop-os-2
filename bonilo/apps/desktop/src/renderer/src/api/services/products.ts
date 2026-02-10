/**
 * Products API Service
 * 
 * Handles all product-related API calls.
 * Supports both online (API) and offline (local store) modes.
 */

import { apiClient, ApiResponse } from '../client';
import { API_CONFIG, ENDPOINTS } from '../config';
import type { Product } from '@asgard/shared';

// ===== TYPES =====

export interface ProductFilters {
    search?: string;
    category?: string;
    brand?: string;
    minStock?: number;
    maxStock?: number;
    isActive?: boolean;
    page?: number;
    limit?: number;
}

export interface ProductsListResponse {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
}

// ===== PRODUCTS SERVICE =====

export const productsApi = {
    /**
     * Get all products with optional filters
     */
    async getAll(filters?: ProductFilters): Promise<ApiResponse<ProductsListResponse>> {
        if (API_CONFIG.MOCK_MODE) {
            // Return from local store in mock mode
            return {
                success: true,
                data: {
                    products: [],
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
            ? `${ENDPOINTS.PRODUCTS.LIST}?${params}`
            : ENDPOINTS.PRODUCTS.LIST;

        return apiClient.get<ProductsListResponse>(endpoint);
    },

    /**
     * Get a single product by ID
     */
    async getById(id: string): Promise<ApiResponse<Product>> {
        if (API_CONFIG.MOCK_MODE) {
            return { success: false, error: 'Mock mode - use local store' };
        }
        return apiClient.get<Product>(ENDPOINTS.PRODUCTS.GET(id));
    },

    /**
     * Get product by barcode
     */
    async getByBarcode(barcode: string): Promise<ApiResponse<Product>> {
        if (API_CONFIG.MOCK_MODE) {
            return { success: false, error: 'Mock mode - use local store' };
        }
        return apiClient.get<Product>(ENDPOINTS.PRODUCTS.BY_BARCODE(barcode));
    },

    /**
     * Create a new product
     */
    async create(product: Omit<Product, 'id'>): Promise<ApiResponse<Product>> {
        if (API_CONFIG.MOCK_MODE) {
            return { success: false, error: 'Mock mode - use local store' };
        }
        return apiClient.post<Product>(ENDPOINTS.PRODUCTS.CREATE, product);
    },

    /**
     * Update an existing product
     */
    async update(id: string, product: Partial<Product>): Promise<ApiResponse<Product>> {
        if (API_CONFIG.MOCK_MODE) {
            return { success: false, error: 'Mock mode - use local store' };
        }
        return apiClient.put<Product>(ENDPOINTS.PRODUCTS.UPDATE(id), product);
    },

    /**
     * Delete a product
     */
    async delete(id: string): Promise<ApiResponse<void>> {
        if (API_CONFIG.MOCK_MODE) {
            return { success: false, error: 'Mock mode - use local store' };
        }
        return apiClient.delete<void>(ENDPOINTS.PRODUCTS.DELETE(id));
    },

    /**
     * Search products
     */
    async search(query: string): Promise<ApiResponse<Product[]>> {
        if (API_CONFIG.MOCK_MODE) {
            return { success: true, data: [] };
        }
        return apiClient.get<Product[]>(`${ENDPOINTS.PRODUCTS.SEARCH}?q=${encodeURIComponent(query)}`);
    },
};

export default productsApi;

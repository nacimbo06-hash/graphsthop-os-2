/**
 * API Module - Backend Integration Layer
 * 
 * This module provides a complete API layer for connecting to a backend.
 * Currently operates in MOCK_MODE using local stores, but can be switched
 * to use a real backend by setting VITE_MOCK_MODE=false.
 * 
 * @example
 * ```ts
 * import { api, API_CONFIG } from '@renderer/api';
 * 
 * // Check if we're in mock mode
 * if (!API_CONFIG.MOCK_MODE) {
 *     const products = await api.products.getAll();
 * }
 * 
 * // Or use the client directly
 * import { apiClient } from '@renderer/api';
 * const response = await apiClient.get('/custom/endpoint');
 * ```
 */

// Configuration
export { API_CONFIG, ENDPOINTS, IS_DEV, IS_PROD, API_STORAGE_KEYS } from './config';

// Core Client
export { apiClient, ApiClient, ApiError, NetworkError, TimeoutError } from './client';
export type { ApiResponse, RequestConfig } from './client';

// API Services
export * from './services';

// Convenience namespace export
import { authApi } from './services/auth';
import { productsApi } from './services/products';
import { salesApi } from './services/sales';
import { treasuryApi } from './services/treasury';
import { syncApi } from './services/sync';

export const api = {
    auth: authApi,
    products: productsApi,
    sales: salesApi,
    treasury: treasuryApi,
    sync: syncApi,
} as const;

export default api;

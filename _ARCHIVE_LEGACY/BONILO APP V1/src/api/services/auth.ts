/**
 * Auth API Service
 * 
 * Handles authentication and authorization API calls.
 */

import { apiClient, ApiResponse } from '../client';
import { API_CONFIG, ENDPOINTS, API_STORAGE_KEYS } from '../config';
import { secureStorage } from '../../services/secureStorage';
import type { User } from '@core';

// ===== TYPES =====

export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface LoginResponse {
    user: User;
    token: string;
    refreshToken: string;
    expiresIn: number;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

// ===== AUTH SERVICE =====

export const authApi = {
    /**
     * Login user
     */
    async login(request: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        if (API_CONFIG.MOCK_MODE) {
            // In mock mode, authentication is handled by local authStore
            return { success: false, error: 'Mock mode - use local auth' };
        }

        const response = await apiClient.post<LoginResponse>(
            ENDPOINTS.AUTH.LOGIN,
            request,
            { skipAuth: true }
        );

        if (response.success && response.data) {
            // Store tokens securely
            await secureStorage.setItem(API_STORAGE_KEYS.AUTH_TOKEN, response.data.token);
            await secureStorage.setItem(API_STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);

            // Update API client
            apiClient.setAuthToken(response.data.token);
            apiClient.setRefreshToken(response.data.refreshToken);
        }

        return response;
    },

    /**
     * Logout user
     */
    async logout(): Promise<ApiResponse<void>> {
        if (API_CONFIG.MOCK_MODE) {
            return { success: true };
        }

        const response = await apiClient.post<void>(ENDPOINTS.AUTH.LOGOUT);

        // Clear tokens regardless of response
        secureStorage.removeItem(API_STORAGE_KEYS.AUTH_TOKEN);
        secureStorage.removeItem(API_STORAGE_KEYS.REFRESH_TOKEN);
        apiClient.setAuthToken(null);
        apiClient.setRefreshToken(null);

        return response;
    },

    /**
     * Get current user
     */
    async getCurrentUser(): Promise<ApiResponse<User>> {
        if (API_CONFIG.MOCK_MODE) {
            return { success: false, error: 'Mock mode - use local auth' };
        }
        return apiClient.get<User>(ENDPOINTS.AUTH.ME);
    },

    /**
     * Register new user
     */
    async register(request: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
        if (API_CONFIG.MOCK_MODE) {
            return { success: false, error: 'Mock mode - registration disabled' };
        }
        return apiClient.post<LoginResponse>(ENDPOINTS.AUTH.REGISTER, request, { skipAuth: true });
    },

    /**
     * Initialize auth from stored tokens
     */
    async initFromStorage(): Promise<boolean> {
        const token = await secureStorage.getItem(API_STORAGE_KEYS.AUTH_TOKEN);
        const refreshToken = await secureStorage.getItem(API_STORAGE_KEYS.REFRESH_TOKEN);

        if (token) {
            apiClient.setAuthToken(token);
            apiClient.setRefreshToken(refreshToken);
            return true;
        }

        return false;
    },

    /**
     * Check if user is authenticated (has valid token)
     */
    async isAuthenticated(): Promise<boolean> {
        const token = await secureStorage.getItem(API_STORAGE_KEYS.AUTH_TOKEN);
        return !!token;
    },
};

export default authApi;

/**
 * API Client - Core HTTP Client for Backend Integration
 * 
 * Features:
 * - Automatic retry with exponential backoff
 * - Request/response interceptors
 * - Timeout handling
 * - Token refresh integration
 * - Offline detection
 */

import { API_CONFIG } from './config';

// ===== TYPES =====

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    statusCode?: number;
}

export interface RequestConfig {
    headers?: Record<string, string>;
    timeout?: number;
    retry?: number;
    skipAuth?: boolean;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// ===== ERROR TYPES =====

export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public code?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export class NetworkError extends Error {
    constructor(message: string = 'Network error - please check your connection') {
        super(message);
        this.name = 'NetworkError';
    }
}

export class TimeoutError extends Error {
    constructor(message: string = 'Request timed out') {
        super(message);
        this.name = 'TimeoutError';
    }
}

// ===== UTILITIES =====

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const isOnline = (): boolean => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
};

// ===== API CLIENT CLASS =====

export class ApiClient {
    private baseUrl: string;
    private defaultTimeout: number;
    private maxRetries: number;
    private authToken: string | null = null;
    private refreshToken: string | null = null;
    private onTokenRefresh?: (token: string) => void;
    private onUnauthorized?: () => void;

    constructor(config: Partial<typeof API_CONFIG> = {}) {
        this.baseUrl = config.BASE_URL || API_CONFIG.BASE_URL;
        this.defaultTimeout = config.TIMEOUT || API_CONFIG.TIMEOUT;
        this.maxRetries = config.RETRY_ATTEMPTS || API_CONFIG.RETRY_ATTEMPTS;
    }

    // ===== AUTH MANAGEMENT =====

    setAuthToken(token: string | null): void {
        this.authToken = token;
    }

    setRefreshToken(token: string | null): void {
        this.refreshToken = token;
    }

    setTokenRefreshHandler(handler: (token: string) => void): void {
        this.onTokenRefresh = handler;
    }

    setUnauthorizedHandler(handler: () => void): void {
        this.onUnauthorized = handler;
    }

    // ===== CORE REQUEST METHOD =====

    private async request<T>(
        method: HttpMethod,
        endpoint: string,
        data?: unknown,
        config: RequestConfig = {}
    ): Promise<ApiResponse<T>> {
        // Check online status
        if (!isOnline()) {
            return {
                success: false,
                error: 'Vous êtes hors ligne',
                statusCode: 0,
            };
        }

        const url = `${this.baseUrl}${endpoint}`;
        const timeout = config.timeout || this.defaultTimeout;
        const retries = config.retry ?? this.maxRetries;

        // Build headers
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...config.headers,
        };

        if (!config.skipAuth && this.authToken) {
            headers['Authorization'] = `Bearer ${this.authToken}`;
        }

        // Request options
        const options: RequestInit = {
            method,
            headers,
            body: data ? JSON.stringify(data) : undefined,
        };

        // Execute with retry
        let lastError: Error | null = null;

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);

                const response = await fetch(url, {
                    ...options,
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                // Handle response
                const responseData = await this.parseResponse<T>(response);

                // Handle 401 - try token refresh
                if (response.status === 401 && this.refreshToken && attempt === 0) {
                    const refreshed = await this.handleTokenRefresh();
                    if (refreshed) {
                        // Retry with new token
                        headers['Authorization'] = `Bearer ${this.authToken}`;
                        continue;
                    }
                    this.onUnauthorized?.();
                }

                return responseData;

            } catch (error) {
                lastError = error as Error;

                if (error instanceof DOMException && error.name === 'AbortError') {
                    lastError = new TimeoutError();
                }

                // Don't retry on client errors (4xx)
                if (error instanceof ApiError && error.statusCode >= 400 && error.statusCode < 500) {
                    break;
                }

                // Exponential backoff for retries
                if (attempt < retries) {
                    await sleep(Math.pow(2, attempt) * 1000);
                }
            }
        }

        return {
            success: false,
            error: lastError?.message || 'Unknown error',
            statusCode: lastError instanceof ApiError ? lastError.statusCode : 500,
        };
    }

    private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
        let data: any = null;

        try {
            const text = await response.text();
            data = text ? JSON.parse(text) : null;
        } catch {
            // Not JSON response
        }

        if (!response.ok) {
            throw new ApiError(
                data?.message || data?.error || `HTTP ${response.status}`,
                response.status,
                data?.code
            );
        }

        return {
            success: true,
            data: data?.data ?? data,
            message: data?.message,
            statusCode: response.status,
        };
    }

    private async handleTokenRefresh(): Promise<boolean> {
        if (!this.refreshToken) return false;

        try {
            const response = await fetch(`${this.baseUrl}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: this.refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                this.authToken = data.token;
                this.onTokenRefresh?.(data.token);
                return true;
            }
        } catch {
            // Refresh failed
        }

        return false;
    }

    // ===== HTTP METHODS =====

    async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>('GET', endpoint, undefined, config);
    }

    async post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>('POST', endpoint, data, config);
    }

    async put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>('PUT', endpoint, data, config);
    }

    async patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>('PATCH', endpoint, data, config);
    }

    async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>('DELETE', endpoint, undefined, config);
    }
}

// Export singleton
export const apiClient = new ApiClient();
export default apiClient;

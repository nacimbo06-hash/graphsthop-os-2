/**
 * API Configuration
 * 
 * Environment-based configuration for the API client.
 * Uses Vite environment variables.
 */

// ===== ENVIRONMENT DETECTION =====

export const IS_DEV = import.meta.env.DEV;
export const IS_PROD = import.meta.env.PROD;

// ===== API CONFIGURATION =====

export const API_CONFIG = {
    // Base URL - can be overridden by environment variable
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',

    // Request timeout in milliseconds
    TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,

    // Number of retry attempts for failed requests
    RETRY_ATTEMPTS: Number(import.meta.env.VITE_API_RETRY) || 3,

    // Enable mock mode (use local data instead of API)
    MOCK_MODE: import.meta.env.VITE_MOCK_MODE === 'true' || false, // Default to FALSE for production
} as const;

// ===== API ENDPOINTS =====

export const ENDPOINTS = {
    // Authentication
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        ME: '/auth/me',
        REGISTER: '/auth/register',
    },

    // Products
    PRODUCTS: {
        LIST: '/products',
        GET: (id: string) => `/products/${id}`,
        CREATE: '/products',
        UPDATE: (id: string) => `/products/${id}`,
        DELETE: (id: string) => `/products/${id}`,
        SEARCH: '/products/search',
        BY_BARCODE: (barcode: string) => `/products/barcode/${barcode}`,
    },

    // Sales
    SALES: {
        LIST: '/sales',
        GET: (id: string) => `/sales/${id}`,
        CREATE: '/sales',
        VOID: (id: string) => `/sales/${id}/void`,
        REFUND: (id: string) => `/sales/${id}/refund`,
        DAILY_REPORT: '/sales/reports/daily',
    },

    // Customers
    CUSTOMERS: {
        LIST: '/customers',
        GET: (id: string) => `/customers/${id}`,
        CREATE: '/customers',
        UPDATE: (id: string) => `/customers/${id}`,
        DELETE: (id: string) => `/customers/${id}`,
        LOYALTY: (id: string) => `/customers/${id}/loyalty`,
    },

    // Suppliers
    SUPPLIERS: {
        LIST: '/suppliers',
        GET: (id: string) => `/suppliers/${id}`,
        CREATE: '/suppliers',
        UPDATE: (id: string) => `/suppliers/${id}`,
        DELETE: (id: string) => `/suppliers/${id}`,
    },

    // Treasury
    TREASURY: {
        SESSIONS: '/treasury/sessions',
        CURRENT_SESSION: '/treasury/sessions/current',
        OPEN_SESSION: '/treasury/sessions/open',
        CLOSE_SESSION: '/treasury/sessions/close',
        MOVEMENTS: '/treasury/movements',
        SAFE: '/treasury/safe',
        EXPENSES: '/treasury/expenses',
    },

    // Inventory
    INVENTORY: {
        STOCK: '/inventory/stock',
        MOVEMENTS: '/inventory/movements',
        LOTS: '/inventory/lots',
        ALERTS: '/inventory/alerts',
    },

    // Sync
    SYNC: {
        PUSH: '/sync/push',
        PULL: '/sync/pull',
        STATUS: '/sync/status',
        CONFLICT: '/sync/conflict',
    },

    // Reports
    REPORTS: {
        SALES: '/reports/sales',
        INVENTORY: '/reports/inventory',
        TREASURY: '/reports/treasury',
        EXPORT: '/reports/export',
    },
} as const;

// ===== STORAGE KEYS =====

export const API_STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    LAST_SYNC: 'last_sync_timestamp',
} as const;

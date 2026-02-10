/**
 * Shared Constants - App-wide constants for main and renderer
 */

// ===== APPLICATION =====

export const APP_NAME = 'IGO';
export const APP_VERSION = '1.0.0';

// ===== LOCALIZATION =====

export const DEFAULT_LOCALE = 'fr-FR';
export const DEFAULT_CURRENCY = 'DZD';
export const CURRENCY_SYMBOL = 'DA';
export const DEFAULT_TIMEZONE = 'Africa/Algiers';

// ===== ROUTES =====

export const ROUTES = {
    ROOT: '/',
    LOGIN: '/login',
    ONBOARDING: '/onboarding',
    DASHBOARD: '/',
    POS: '/pos',
    TREASURY: '/treasury',
    INVENTORY: '/inventory',
    CUSTOMERS: '/customers',
    SUPPLIERS: '/suppliers',
    PRINT: '/print',
    REPORTS: '/reports',
    SETTINGS: '/settings',
    USERS: '/users',
    HELP: '/help',
    CIRCULARITY: '/circularity',
    COPILOT: '/copilot',
} as const;

// ===== ROLES & PERMISSIONS =====

export const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    CASHIER: 'cashier',
    STOCK_MANAGER: 'stock_manager',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// ===== MODULES =====

export const MODULES = {
    DASHBOARD: 'dashboard',
    POS: 'pos',
    INVENTORY: 'inventory',
    TREASURY: 'treasury',
    CUSTOMERS: 'customers',
    SUPPLIERS: 'suppliers',
    REPORTS: 'reports',
    SETTINGS: 'settings',
    USERS: 'users',
    PRINT_CENTER: 'print_center',
    HELP: 'help',
    CIRCULARITY: 'circularity',
    COPILOT: 'copilot',
} as const;

export type Module = typeof MODULES[keyof typeof MODULES];

// ===== PAYMENT METHODS =====

export const PAYMENT_METHODS = {
    CASH: 'cash',
    CARD: 'card',
    CIB: 'cib',
    DAHABIA: 'dahabia',
    VISA: 'visa',
    MASTERCARD: 'mastercard',
    CHECK: 'check',
    CREDIT: 'credit',
    SPLIT: 'split',
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

// ===== VAT =====

export const DEFAULT_VAT_RATE = 19; // 19% TVA Algeria

// ===== STORAGE KEYS =====

export const STORAGE_KEYS = {
    AUTH: 'auth-storage-v2',
    SETTINGS: 'settings-storage',
    TREASURY: 'treasury-storage-v2',
    PRODUCTS: 'products-storage',
    CUSTOMERS: 'customers-storage',
    THEME: 'theme-storage',
    SYNC: 'sync-storage',
} as const;

// ===== PRINT PAPER WIDTHS =====

export const PAPER_WIDTHS = {
    THERMAL_58MM: 58,
    THERMAL_80MM: 80,
    LABEL_50MM: 50,
    A4: 210,
} as const;

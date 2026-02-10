/**
 * Route Constants - Application routing
 */

export const ROUTES = {
    // Main routes
    HOME: '/',
    DASHBOARD: '/',
    LOGIN: '/login',
    ONBOARDING: '/onboarding',

    // Features
    POS: '/pos',
    INVENTORY: '/inventory',
    TREASURY: '/treasury',
    CUSTOMERS: '/customers',
    SUPPLIERS: '/suppliers',
    REPORTS: '/reports',
    SETTINGS: '/settings',
    USERS: '/users',
    PRINT_CENTER: '/print-center',
    HELP: '/help',
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];

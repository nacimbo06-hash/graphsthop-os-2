/**
 * UI Constants - Colors, breakpoints, transitions
 */

// ===== COLORS =====

export const COLORS = {
    // Brand
    PRIMARY: '#3D7C4F',
    PRIMARY_LIGHT: '#E8F0FE',
    PRIMARY_DARK: '#1967D2',

    // Status
    SUCCESS: '#34C759',
    SUCCESS_LIGHT: '#EBF7EE',
    WARNING: '#FBBC04',
    WARNING_LIGHT: '#FEF7E0',
    DANGER: '#EA4335',
    DANGER_LIGHT: '#FDE7E7',

    // Neutrals
    TEXT_PRIMARY: '#1F2937',
    TEXT_SECONDARY: '#6B7280',
    TEXT_MUTED: '#9CA3AF',
    BORDER: '#E5E7EB',
    BACKGROUND: '#F9FAFB',
    SURFACE: '#FFFFFF',

    // Dark mode
    DARK_BG: '#0F172A',
    DARK_SURFACE: '#1E293B',
    DARK_BORDER: '#334155',
} as const;

// ===== BREAKPOINTS =====

export const BREAKPOINTS = {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1536,
} as const;

// ===== Z-INDEX =====

export const Z_INDEX = {
    DROPDOWN: 100,
    STICKY: 200,
    MODAL_BACKDROP: 300,
    MODAL: 400,
    POPOVER: 500,
    TOOLTIP: 600,
    TOAST: 700,
} as const;

// ===== TRANSITIONS =====

export const TRANSITIONS = {
    FAST: '150ms ease',
    NORMAL: '200ms ease',
    SLOW: '300ms ease',
} as const;

// ===== SHADOWS =====

export const SHADOWS = {
    SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
} as const;

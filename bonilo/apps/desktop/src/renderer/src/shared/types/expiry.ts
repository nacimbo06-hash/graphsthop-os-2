/**
 * Expiry Date Management Types - SuperMarket Control OS
 * 
 * Minimum Input, Maximum Intelligence approach
 */

// ===== SHELF LIFE CATEGORIES =====

export type ShelfLifeCategory = 'dairy' | 'short' | 'medium' | 'long';

export interface QuickDatePreset {
    label: string;
    days: number;
    category: ShelfLifeCategory;
}

// Quick date presets by category
export const EXPIRY_PRESETS: Record<ShelfLifeCategory, QuickDatePreset[]> = {
    dairy: [
        { label: '+3j', days: 3, category: 'dairy' },
        { label: '+5j', days: 5, category: 'dairy' },
        { label: '+7j', days: 7, category: 'dairy' },
        { label: '+10j', days: 10, category: 'dairy' },
    ],
    short: [
        { label: '+1sem', days: 7, category: 'short' },
        { label: '+2sem', days: 14, category: 'short' },
        { label: '+3sem', days: 21, category: 'short' },
        { label: '+1mois', days: 30, category: 'short' },
    ],
    medium: [
        { label: '+1m', days: 30, category: 'medium' },
        { label: '+2m', days: 60, category: 'medium' },
        { label: '+3m', days: 90, category: 'medium' },
        { label: '+6m', days: 180, category: 'medium' },
    ],
    long: [
        { label: '+6m', days: 180, category: 'long' },
        { label: '+1an', days: 365, category: 'long' },
        { label: '+2ans', days: 730, category: 'long' },
        { label: '∞', days: 9999, category: 'long' }, // No expiry
    ],
};

// Map product categories to shelf life categories
export const CATEGORY_SHELF_LIFE: Record<string, ShelfLifeCategory> = {
    dairy: 'dairy',
    milk: 'dairy',
    yogurt: 'dairy',
    cheese: 'dairy',
    butter: 'dairy',
    cream: 'dairy',
    bakery: 'short',
    bread: 'short',
    pastry: 'short',
    deli: 'short',
    meat: 'short',
    fish: 'short',
    vegetables: 'short',
    fruits: 'short',
    beverages: 'medium',
    juices: 'medium',
    grocery: 'long',
    canned: 'long',
    pasta: 'long',
    rice: 'long',
    oil: 'long',
    sugar: 'long',
    flour: 'long',
    spices: 'long',
    cleaning: 'long',
    hygiene: 'long',
};

// ===== EXPIRY STATUS =====

export type ExpiryStatus = 'ok' | 'attention' | 'warning' | 'critical' | 'expired';

export interface ExpiryStatusConfig {
    status: ExpiryStatus;
    label: string;
    color: string;
    bgColor: string;
    daysThreshold: number;
    suggestedDiscount: number;
}

export const EXPIRY_STATUS_CONFIG: ExpiryStatusConfig[] = [
    { status: 'expired', label: 'Expiré', color: '#1F2937', bgColor: '#F3F4F6', daysThreshold: 0, suggestedDiscount: 100 },
    { status: 'critical', label: 'Critique', color: '#DC2626', bgColor: '#FEE2E2', daysThreshold: 3, suggestedDiscount: 50 },
    { status: 'warning', label: 'Alerte', color: '#D97706', bgColor: '#FEF3C7', daysThreshold: 7, suggestedDiscount: 20 },
    { status: 'attention', label: 'Attention', color: '#2563EB', bgColor: '#DBEAFE', daysThreshold: 14, suggestedDiscount: 0 },
    { status: 'ok', label: 'OK', color: '#059669', bgColor: '#D1FAE5', daysThreshold: Infinity, suggestedDiscount: 0 },
];

// ===== PRODUCT LOT =====

export interface ProductLot {
    id: string;
    productId: string;
    lotNumber?: string;
    quantity: number;
    expiryDate: Date | null; // null = no expiry
    receivedDate: Date;
    costPrice: number;
    status: ExpiryStatus;
    daysRemaining: number | null;
}

// ===== EXPIRY ALERT =====

export interface ExpiryAlert {
    id: string;
    productId: string;
    productName: string;
    lotId: string;
    lotNumber?: string;
    quantity: number;
    expiryDate: Date;
    daysRemaining: number;
    status: ExpiryStatus;
    suggestedDiscount: number;
    suggestedAction: 'discount' | 'return' | 'donate' | 'dispose';
    createdAt: Date;
    acknowledged: boolean;
    actionTaken?: string;
}

// ===== UTILITY FUNCTIONS =====

/**
 * Calculate days remaining until expiry
 */
export function calculateDaysRemaining(expiryDate: Date | null): number | null {
    if (!expiryDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Get expiry status from days remaining
 */
export function getExpiryStatus(daysRemaining: number | null): ExpiryStatus {
    if (daysRemaining === null) return 'ok'; // No expiry = always OK
    if (daysRemaining <= 0) return 'expired';
    if (daysRemaining <= 3) return 'critical';
    if (daysRemaining <= 7) return 'warning';
    if (daysRemaining <= 14) return 'attention';
    return 'ok';
}

/**
 * Get status config by status
 */
export function getExpiryStatusConfig(status: ExpiryStatus): ExpiryStatusConfig {
    return EXPIRY_STATUS_CONFIG.find(c => c.status === status) || EXPIRY_STATUS_CONFIG[4];
}

/**
 * Get suggested discount for expiry status
 */
export function getSuggestedDiscount(status: ExpiryStatus): number {
    const config = getExpiryStatusConfig(status);
    return config.suggestedDiscount;
}

/**
 * Format days remaining as human-readable string
 */
export function formatDaysRemaining(days: number | null): string {
    if (days === null) return 'Sans expiration';
    if (days < 0) return `Expiré depuis ${Math.abs(days)}j`;
    if (days === 0) return 'Expire aujourd\'hui';
    if (days === 1) return 'Expire demain';
    if (days <= 7) return `${days} jours`;
    if (days <= 30) return `${Math.floor(days / 7)} semaines`;
    if (days <= 365) return `${Math.floor(days / 30)} mois`;
    if (days >= 9999) return 'Sans expiration';
    return `${Math.floor(days / 365)} an(s)`;
}

/**
 * Calculate expiry date from days offset
 */
export function calculateExpiryDate(daysOffset: number): Date | null {
    if (daysOffset >= 9999) return null; // No expiry
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    date.setHours(23, 59, 59, 999);
    return date;
}

/**
 * Get shelf life category for a product category
 */
export function getShelfLifeCategory(productCategory: string): ShelfLifeCategory {
    return CATEGORY_SHELF_LIFE[productCategory] || 'medium';
}

/**
 * Get presets for a product category
 */
export function getExpiryPresetsForCategory(productCategory: string): QuickDatePreset[] {
    const shelfLife = getShelfLifeCategory(productCategory);
    return EXPIRY_PRESETS[shelfLife];
}

/**
 * Sort lots by FEFO (First-Expired-First-Out)
 */
export function sortByFEFO(lots: ProductLot[]): ProductLot[] {
    return [...lots].sort((a, b) => {
        // Null expiry dates go last (no expiry)
        if (!a.expiryDate && !b.expiryDate) return 0;
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return a.expiryDate.getTime() - b.expiryDate.getTime();
    });
}

/**
 * Get available quantity for sale (excluding expired)
 */
export function getAvailableQuantity(lots: ProductLot[]): number {
    return lots
        .filter(lot => lot.status !== 'expired')
        .reduce((sum, lot) => sum + lot.quantity, 0);
}

/**
 * Select lots for sale using FEFO
 */
export function selectLotsForSale(lots: ProductLot[], quantity: number): { lot: ProductLot; qty: number }[] {
    // SECURITY: Input validation to prevent integer overflow/DoS
    if (!Number.isFinite(quantity) || quantity <= 0) {
        console.error('[SECURITY] Invalid quantity for lot selection:', quantity);
        return [];
    }
    // Cap at reasonable maximum to prevent abuse
    const MAX_QUANTITY = 1000000;
    if (quantity > MAX_QUANTITY) {
        console.warn('[SECURITY] Quantity exceeds maximum, capping at', MAX_QUANTITY);
        quantity = MAX_QUANTITY;
    }

    const sortedLots = sortByFEFO(lots).filter(lot => lot.status !== 'expired');
    const selections: { lot: ProductLot; qty: number }[] = [];
    let remaining = Math.floor(quantity); // Ensure integer

    for (const lot of sortedLots) {
        if (remaining <= 0) break;
        const take = Math.min(lot.quantity, remaining);
        if (take <= 0) continue; // Guard against zero/negative
        selections.push({ lot, qty: take });
        remaining -= take;
    }

    return selections;
}

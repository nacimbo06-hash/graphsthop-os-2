import Dexie, { type Table } from 'dexie';

// ============================================
// Database Types
// ============================================

export interface DBProduct {
    id?: number;
    serverId?: string;
    sku: string;
    ean?: string;
    name: string;
    brand?: string;
    categoryId?: number;
    supplierId?: number;
    salePrice: number;
    purchasePrice?: number;
    vatRate: number;
    priceCap?: number;
    unit: 'unit' | 'kg' | 'liter' | 'pack';
    stockMin: number;
    stockMax: number;
    currentStock: number;
    isPerishable: boolean;
    shelfLifeDays?: number;
    imageUrl?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    syncedAt?: Date;
}

export interface DBProductLot {
    id?: number;
    serverId?: string;
    productId: number;
    lotNumber?: string;
    quantity: number;
    purchasePrice: number;
    expiryDate?: Date;
    receivedDate: Date;
    isActive: boolean;
    syncedAt?: Date;
}

export interface DBSale {
    id?: number;
    serverId?: string;
    receiptNumber: string;
    customerId?: number;
    userId: string;
    subtotal: number;
    vatAmount: number;
    discountAmount: number;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: 'pending' | 'completed' | 'refunded';
    isVoided: boolean;
    voidedBy?: string;
    voidReason?: string;
    createdAt: Date;
    syncedAt?: Date;
}

export interface DBSaleItem {
    id?: number;
    saleId: number;
    productId: number;
    lotId?: number;
    quantity: number;
    unitPrice: number;
    vatRate: number;
    discountPercent: number;
    lineTotal: number;
}

export interface DBCustomer {
    id?: number;
    serverId?: string;
    code: string;
    firstName?: string;
    lastName?: string;
    phone: string;
    email?: string;
    address?: string;
    wilaya?: string;
    loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
    loyaltyPoints: number;
    totalSpent: number;
    creditLimit: number;
    currentDebt: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    syncedAt?: Date;
}

export interface DBCategory {
    id?: number;
    serverId?: string;
    parentId?: number;
    name: string;
    code: string;
    level: number;
    vatRate: number;
    isActive: boolean;
}

export interface DBSupplier {
    id?: number;
    serverId?: string;
    name: string;
    contactName?: string;
    email?: string;
    phone?: string;
    address?: string;
    wilaya?: string;
    paymentTerms: number;
    leadTimeDays: number;
    rating: number;
    isActive: boolean;
}

export interface DBExpense {
    id?: number;
    serverId?: string;
    categoryId: number;
    amount: number;
    description?: string;
    vendorName?: string;
    receiptNumber?: string;
    expenseDate: Date;
    isRecurring: boolean;
    recurrencePeriod?: string;
    userId: string;
    createdAt: Date;
    syncedAt?: Date;
}

export interface DBSettings {
    id: string;
    value: unknown;
    updatedAt: Date;
}

export interface DBPendingSync {
    id?: number;
    entity: string;
    operation: 'create' | 'update' | 'delete';
    data: unknown;
    timestamp: Date;
    retryCount: number;
}

// ============================================
// Database Class
// ============================================

export class SuperMarketDB extends Dexie {
    products!: Table<DBProduct>;
    productLots!: Table<DBProductLot>;
    sales!: Table<DBSale>;
    saleItems!: Table<DBSaleItem>;
    customers!: Table<DBCustomer>;
    categories!: Table<DBCategory>;
    suppliers!: Table<DBSupplier>;
    expenses!: Table<DBExpense>;
    settings!: Table<DBSettings>;
    pendingSync!: Table<DBPendingSync>;

    constructor() {
        super('SuperMarketDB');

        this.version(1).stores({
            products: '++id, serverId, sku, ean, name, categoryId, supplierId, isActive, [categoryId+isActive]',
            productLots: '++id, serverId, productId, expiryDate, [productId+isActive]',
            sales: '++id, serverId, receiptNumber, customerId, userId, createdAt, [createdAt+paymentStatus]',
            saleItems: '++id, saleId, productId, lotId',
            customers: '++id, serverId, code, phone, loyaltyTier, [isActive+loyaltyTier]',
            categories: '++id, serverId, parentId, code, level, isActive',
            suppliers: '++id, serverId, name, isActive',
            expenses: '++id, serverId, categoryId, expenseDate, userId, [expenseDate+categoryId]',
            settings: 'id',
            pendingSync: '++id, entity, operation, timestamp',
        });
    }
}

// ============================================
// Database Instance
// ============================================

export const db = new SuperMarketDB();

// ============================================
// Helper Functions
// ============================================

/**
 * Generate a unique receipt number
 */
export function generateReceiptNumber(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `REC-${dateStr}-${random}`;
}

/**
 * Add a pending sync operation
 */
export async function addPendingSync(
    entity: string,
    operation: 'create' | 'update' | 'delete',
    data: unknown
): Promise<number> {
    return db.pendingSync.add({
        entity,
        operation,
        data,
        timestamp: new Date(),
        retryCount: 0,
    });
}

/**
 * Get products with low stock
 */
export async function getLowStockProducts(): Promise<DBProduct[]> {
    return db.products
        .filter(product => product.isActive && product.currentStock <= product.stockMin)
        .toArray();
}

/**
 * Get expiring product lots (within X days)
 */
export async function getExpiringLots(withinDays: number = 7): Promise<DBProductLot[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + withinDays);

    return db.productLots
        .filter(lot =>
            lot.isActive &&
            lot.expiryDate !== undefined &&
            lot.expiryDate <= cutoffDate
        )
        .toArray();
}

/**
 * Get sales total for a date range
 */
export async function getSalesTotal(startDate: Date, endDate: Date): Promise<number> {
    const sales = await db.sales
        .filter(sale =>
            sale.createdAt >= startDate &&
            sale.createdAt <= endDate &&
            sale.paymentStatus === 'completed' &&
            !sale.isVoided
        )
        .toArray();

    return sales.reduce((sum: number, sale: any) => sum + (sale.totalAmount || 0), 0);
}

/**
 * FEFO: Get the oldest lot for a product (First Expired, First Out)
 */
export async function getOldestLot(productId: number): Promise<DBProductLot | undefined> {
    const lots = await db.productLots
        .where('productId')
        .equals(productId)
        .filter(lot => lot.isActive && lot.quantity > 0)
        .sortBy('expiryDate');

    return lots[0];
}

/**
 * Clear all data (for testing/reset)
 */
export async function clearAllData(): Promise<void> {
 await Promise.all([
        db.products.clear(),
        db.productLots.clear(),
        db.sales.clear(),
        db.saleItems.clear(),
        db.customers.clear(),
        db.categories.clear(),
        db.suppliers.clear(),
        db.expenses.clear(),
        db.pendingSync.clear()
    ]);
}

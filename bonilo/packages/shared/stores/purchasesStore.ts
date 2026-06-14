import { create } from 'zustand';
import { purchasesRepo } from '../db';

// Check if running in Tauri (SQLite + Rust commands available).
const isTauri = () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export interface Supplier {
    id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    city?: string;
    ice?: string; // Algerian specific
    nif?: string; // Algerian specific
}

export interface PurchaseItem {
    id: string;
    productId: string;
    productName: string;
    productBarcode: string;
    productEmoji: string;
    orderedQty: number;
    receivedQty: number;
    purchasePrice: number;
    total: number;
    expiryDate?: string;
    lotNumber?: string;
    unit: string;
    /** When true (or when an expiry is set), receive_goods creates a lot for this line. */
    isPerishable?: boolean;
    /** Fallback shelf life (days) for the lot when perishable but no explicit expiry. */
    shelfLifeDays?: number;
}

export interface PurchaseOrder {
    id: string;
    poNumber: string;
    supplierId: string;
    supplierName: string;
    date: string;
    expectedDate: string;
    status: 'draft' | 'sent' | 'partial' | 'complete' | 'cancelled';
    items: PurchaseItem[];
    subtotal: number;
    taxAmount: number;
    total: number;
    notes?: string;
    createdAt: string;
}

export interface GoodsReceipt {
    id: string;
    grNumber: string;
    poId?: string;
    supplierId: string;
    supplierName: string;
    date: string;
    invoiceNumber?: string;
    items: PurchaseItem[];
    total: number;
    status: 'pending' | 'completed' | 'cancelled';
    paidFrom?: 'cash' | 'safe' | 'provision';
    isPaid: boolean;
    createdAt: string;
}

interface PurchasesState {
    suppliers: Supplier[];
    purchaseOrders: PurchaseOrder[];
    goodsReceipts: GoodsReceipt[];
    isLoading: boolean;
    isHydrated: boolean;

    // Lifecycle
    hydrate: () => Promise<void>;

    // Actions
    addSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<void>;
    updateSupplier: (id: string, updates: Partial<Supplier>) => Promise<void>;
    deleteSupplier: (id: string) => Promise<void>;

    addPurchaseOrder: (order: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt'>) => Promise<void>;
    updatePurchaseOrder: (id: string, updates: Partial<PurchaseOrder>) => Promise<void>;

    addGoodsReceipt: (
        receipt: Omit<GoodsReceipt, 'id' | 'grNumber' | 'createdAt'>,
        options?: {
            /** Open cash session id; required to settle a cash-paid receipt from the drawer. */
            sessionId?: string | null;
            /** Display name of who received the goods (audit on movements). */
            createdBy?: string;
        }
    ) => Promise<GoodsReceipt>;
    confirmGoodsReceipt: (id: string) => Promise<void>;
    payGoodsReceipt: (id: string, paidFrom: 'cash' | 'safe' | 'provision') => Promise<void>;

    // Getters
    getSupplierDebt: (supplierId: string) => number;
    getTotalDebt: () => number;
    getMonthlyStats: () => { name: string; total: number; orders: number }[];
    getSupplierStats: (supplierId: string) => { totalPurchases: number; unpaidAmount: number; receiptsCount: number };
}

export const usePurchasesStore = create<PurchasesState>()(
    (set, get) => ({
        suppliers: [],
        purchaseOrders: [],
        goodsReceipts: [],
        isLoading: false,
        isHydrated: false,

        hydrate: async () => {
            if (get().isHydrated) return;
            set({ isLoading: true });
            try {
                const [suppliers, purchaseOrders, goodsReceipts] = await Promise.all([
                    purchasesRepo.loadSuppliers(),
                    purchasesRepo.loadPurchaseOrders(),
                    purchasesRepo.loadGoodsReceipts(),
                ]);
                set({ suppliers, purchaseOrders, goodsReceipts, isHydrated: true, isLoading: false });
                console.log(`[PurchasesStore] Hydrated ${suppliers.length} suppliers, ${purchaseOrders.length} POs, ${goodsReceipts.length} GRs from DB`);
            } catch (error) {
                console.error('[PurchasesStore] Failed to hydrate:', error);
                set({ isLoading: false });
            }
        },

        addSupplier: async (supplierData) => {
            const newSupplier: Supplier = {
                ...supplierData,
                id: crypto.randomUUID(),
            };
            await purchasesRepo.createSupplier(newSupplier);
            set(state => ({ suppliers: [...state.suppliers, newSupplier] }));
        },

        updateSupplier: async (id, updates) => {
            await purchasesRepo.updateSupplier(id, updates);
            set(state => ({
                suppliers: state.suppliers.map(s => s.id === id ? { ...s, ...updates } : s)
            }));
        },

        deleteSupplier: async (id) => {
            await purchasesRepo.removeSupplier(id);
            set(state => ({
                suppliers: state.suppliers.filter(s => s.id !== id)
            }));
        },

        addPurchaseOrder: async (orderData) => {
            const newOrder: PurchaseOrder = {
                ...orderData,
                id: crypto.randomUUID(),
                poNumber: `BC-${new Date().getFullYear()}-${String(get().purchaseOrders.length + 1).padStart(3, '0')}`,
                createdAt: new Date().toISOString(),
            };
            await purchasesRepo.createPurchaseOrder(newOrder);
            set(state => ({ purchaseOrders: [newOrder, ...state.purchaseOrders] }));
        },

        updatePurchaseOrder: async (id, updates) => {
            await purchasesRepo.updatePurchaseOrder(id, updates);
            set(state => ({
                purchaseOrders: state.purchaseOrders.map(o => o.id === id ? { ...o, ...updates } : o)
            }));
        },

        // Record a goods receipt. Under Tauri this goes through the atomic Rust
        // `receive_goods` command (one SQLite transaction: receipt + items +
        // stock + inventory movements + lots + a single settlement — cash
        // movement, safe withdrawal, or supplier-debt delta), which mints the
        // GR number and returns it. In the browser we mint locally and keep the
        // receipt in memory only. Replaces the old non-atomic path that wrote a
        // cash 'withdrawal' here and let the renderer post a second 'expense'.
        addGoodsReceipt: async (receiptData, options = {}) => {
            const timestamp = new Date().toISOString();

            if (isTauri()) {
                const { invoke } = await import('@tauri-apps/api/core');
                const input = {
                    items: receiptData.items.map((it) => ({
                        productId: it.productId,
                        productName: it.productName,
                        productBarcode: it.productBarcode,
                        productEmoji: it.productEmoji,
                        orderedQty: it.orderedQty,
                        receivedQty: it.receivedQty,
                        purchasePrice: it.purchasePrice,
                        total: it.total,
                        unit: it.unit,
                        expiryDate: it.expiryDate || null,
                        lotNumber: it.lotNumber || null,
                        isPerishable: it.isPerishable ?? false,
                        shelfLifeDays: it.shelfLifeDays ?? null,
                    })),
                    supplierId: receiptData.supplierId,
                    supplierName: receiptData.supplierName,
                    date: receiptData.date,
                    invoiceNumber: receiptData.invoiceNumber || '',
                    total: receiptData.total,
                    poId: receiptData.poId || null,
                    status: receiptData.status || 'completed',
                    isPaid: receiptData.isPaid,
                    paidFrom: receiptData.paidFrom || null,
                    sessionId: options.sessionId || null,
                    createdAt: timestamp,
                    createdBy: options.createdBy || '',
                };

                // Rejects with { code, message } on UNKNOWN_SUPPLIER /
                // UNKNOWN_PRODUCT / INVALID_INPUT — the caller surfaces it.
                const result = await invoke<{ receiptId: string; grNumber: string; createdAt: string }>(
                    'receive_goods',
                    { input }
                );

                const newReceipt: GoodsReceipt = {
                    ...receiptData,
                    id: result.receiptId,
                    grNumber: result.grNumber,
                    createdAt: result.createdAt,
                };
                set(state => ({ goodsReceipts: [newReceipt, ...state.goodsReceipts] }));
                return newReceipt;
            }

            // Browser fallback: no SQLite — mint locally and keep in memory only.
            const newReceipt: GoodsReceipt = {
                ...receiptData,
                id: crypto.randomUUID(),
                grNumber: `BE-${new Date().getFullYear()}-${String(get().goodsReceipts.length + 1).padStart(3, '0')}`,
                createdAt: timestamp,
            };
            set(state => ({ goodsReceipts: [newReceipt, ...state.goodsReceipts] }));
            return newReceipt;
        },

        confirmGoodsReceipt: async (id) => {
            await purchasesRepo.updateGoodsReceipt(id, { status: 'completed' });
            set(state => ({
                goodsReceipts: state.goodsReceipts.map(r =>
                    r.id === id ? { ...r, status: 'completed' } : r
                )
            }));
        },

        payGoodsReceipt: async (id, paidFrom) => {
            await purchasesRepo.updateGoodsReceipt(id, { isPaid: true, paidFrom });
            set(state => ({
                goodsReceipts: state.goodsReceipts.map(r =>
                    r.id === id ? { ...r, isPaid: true, paidFrom } : r
                )
            }));
        },

        // Getters
        getSupplierDebt: (supplierId) => {
            return get().goodsReceipts
                .filter(r => r.supplierId === supplierId && !r.isPaid)
                .reduce((sum, r) => sum + r.total, 0);
        },

        getTotalDebt: () => {
            return get().goodsReceipts
                .filter(r => !r.isPaid)
                .reduce((sum, r) => sum + r.total, 0);
        },

        getMonthlyStats: () => {
            const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
            const now = new Date();
            const stats: { name: string; total: number; orders: number }[] = [];

            // Get last 6 months
            for (let i = 5; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
                const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

                const monthReceipts = get().goodsReceipts.filter(r => {
                    const receiptDate = new Date(r.createdAt);
                    return receiptDate >= monthStart && receiptDate <= monthEnd;
                });

                stats.push({
                    name: months[date.getMonth()],
                    total: monthReceipts.reduce((sum, r) => sum + r.total, 0),
                    orders: monthReceipts.length,
                });
            }

            return stats;
        },

        getSupplierStats: (supplierId) => {
            const supplierReceipts = get().goodsReceipts.filter(r => r.supplierId === supplierId);
            return {
                totalPurchases: supplierReceipts.reduce((sum, r) => sum + r.total, 0),
                unpaidAmount: supplierReceipts.filter(r => !r.isPaid).reduce((sum, r) => sum + r.total, 0),
                receiptsCount: supplierReceipts.length,
            };
        },
    })
);

export default usePurchasesStore;

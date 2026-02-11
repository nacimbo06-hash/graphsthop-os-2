import { create } from 'zustand';
import { purchasesRepo } from '../db';

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

    addGoodsReceipt: (receipt: Omit<GoodsReceipt, 'id' | 'grNumber' | 'createdAt'>) => Promise<void>;
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
                id: `sup_${Date.now()}`,
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
                id: `po_${Date.now()}`,
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

        addGoodsReceipt: async (receiptData) => {
            const newReceipt: GoodsReceipt = {
                ...receiptData,
                id: `gr_${Date.now()}`,
                grNumber: `BE-${new Date().getFullYear()}-${String(get().goodsReceipts.length + 1).padStart(3, '0')}`,
                createdAt: new Date().toISOString(),
            };
            await purchasesRepo.createGoodsReceipt(newReceipt);
            set(state => ({ goodsReceipts: [newReceipt, ...state.goodsReceipts] }));
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

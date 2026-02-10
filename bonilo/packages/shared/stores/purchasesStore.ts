import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

    // Actions
    addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
    updateSupplier: (id: string, updates: Partial<Supplier>) => void;
    deleteSupplier: (id: string) => void;

    addPurchaseOrder: (order: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt'>) => void;
    updatePurchaseOrder: (id: string, updates: Partial<PurchaseOrder>) => void;

    addGoodsReceipt: (receipt: Omit<GoodsReceipt, 'id' | 'grNumber' | 'createdAt'>) => void;
    confirmGoodsReceipt: (id: string) => void;
    payGoodsReceipt: (id: string, paidFrom: 'cash' | 'safe' | 'provision') => void;

    // Getters
    getSupplierDebt: (supplierId: string) => number;
    getTotalDebt: () => number;
    getMonthlyStats: () => { name: string; total: number; orders: number }[];
    getSupplierStats: (supplierId: string) => { totalPurchases: number; unpaidAmount: number; receiptsCount: number };
}

const initialSuppliers: Supplier[] = [];

export const usePurchasesStore = create<PurchasesState>()(
    persist(
        (set, get) => ({
            suppliers: initialSuppliers,
            purchaseOrders: [],
            goodsReceipts: [],

            addSupplier: (supplierData) => {
                const newSupplier: Supplier = {
                    ...supplierData,
                    id: `sup_${Date.now()}`,
                };
                set(state => ({ suppliers: [...state.suppliers, newSupplier] }));
            },

            updateSupplier: (id, updates) => {
                set(state => ({
                    suppliers: state.suppliers.map(s => s.id === id ? { ...s, ...updates } : s)
                }));
            },

            deleteSupplier: (id) => {
                set(state => ({
                    suppliers: state.suppliers.filter(s => s.id !== id)
                }));
            },

            addPurchaseOrder: (orderData) => {
                const newOrder: PurchaseOrder = {
                    ...orderData,
                    id: `po_${Date.now()}`,
                    poNumber: `BC-${new Date().getFullYear()}-${String(get().purchaseOrders.length + 1).padStart(3, '0')}`,
                    createdAt: new Date().toISOString(),
                };
                set(state => ({ purchaseOrders: [newOrder, ...state.purchaseOrders] }));
            },

            updatePurchaseOrder: (id, updates) => {
                set(state => ({
                    purchaseOrders: state.purchaseOrders.map(o => o.id === id ? { ...o, ...updates } : o)
                }));
            },

            addGoodsReceipt: (receiptData) => {
                const newReceipt: GoodsReceipt = {
                    ...receiptData,
                    id: `gr_${Date.now()}`,
                    grNumber: `BE-${new Date().getFullYear()}-${String(get().goodsReceipts.length + 1).padStart(3, '0')}`,
                    createdAt: new Date().toISOString(),
                };
                set(state => ({ goodsReceipts: [newReceipt, ...state.goodsReceipts] }));
            },

            confirmGoodsReceipt: (id) => {
                set(state => ({
                    goodsReceipts: state.goodsReceipts.map(r =>
                        r.id === id ? { ...r, status: 'completed' } : r
                    )
                }));
            },

            payGoodsReceipt: (id, paidFrom) => {
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
                const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'];
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
        }),
        {
            name: 'purchases-storage',
        }
    )
);

export default usePurchasesStore;

import { create } from 'zustand';
import { Sale } from '@bonilo/shared/types/sales';
import { salesRepo } from '../db';

// Check if running in Tauri (SQLite available)
const isTauri = () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

const BROWSER_STORAGE_KEY = 'bonilo-sales';

/** Save sales to localStorage (browser fallback) */
function saveToBrowser(sales: Sale[]) {
    if (!isTauri()) {
        try {
            // Only keep last 500 sales in localStorage to avoid quota issues
            localStorage.setItem(BROWSER_STORAGE_KEY, JSON.stringify(sales.slice(0, 500)));
        } catch (e) {
            console.warn('[SalesStore] localStorage save failed:', e);
        }
    }
}

/** Load sales from localStorage (browser fallback) */
function loadFromBrowser(): Sale[] {
    if (!isTauri()) {
        try {
            const data = localStorage.getItem(BROWSER_STORAGE_KEY);
            if (data) return JSON.parse(data);
        } catch (e) {
            console.warn('[SalesStore] localStorage load failed:', e);
        }
    }
    return [];
}

interface SalesState {
    sales: Sale[];
    isLoading: boolean;
    isHydrated: boolean;

    // Lifecycle
    hydrate: () => Promise<void>;

    // Actions
    addSale: (
        saleData: Omit<Sale, 'id' | 'receiptNumber' | 'timestamp'>,
        options?: {
            /** product_id -> unit cost, recorded as cost_at_sale per line. */
            costMap?: Record<string, number>;
            /** Open cash session id; drives the treasury movement on cash sales. */
            sessionId?: string | null;
            /** Display name of who rang the sale (audit on movements). */
            createdBy?: string;
            /** When true, a line may drive stock negative instead of being rejected. */
            allowNegativeStock?: boolean;
        }
    ) => Promise<Sale>;
    getSaleById: (id: string) => Sale | undefined;
    getTodaySales: () => Sale[];
    getWeekSales: () => Sale[];
    getMonthSales: () => Sale[];
    getSalesByPeriod: (start: Date, end: Date) => Sale[];
    getTodayTotal: () => number;
    getWeekTotal: () => number;
    getMonthTotal: () => number;
}

export const useSalesStore = create<SalesState>()(
    (set, get) => ({
        sales: [],
        isLoading: false,
        isHydrated: false,

        // Load recent sales into memory
        hydrate: async () => {
            if (get().isHydrated) return;
            set({ isLoading: true });
            try {
                let sales: Sale[];
                if (isTauri()) {
                    const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
                    sales = await salesRepo.loadAll({ withItems: true, since });
                } else {
                    sales = loadFromBrowser();
                }
                set({ sales, isHydrated: true, isLoading: false });
                console.log(`[SalesStore] ✅ Hydrated ${sales.length} sales from ${isTauri() ? 'DB' : 'localStorage'}`);
            } catch (error) {
                console.error('[SalesStore] ❌ Failed to hydrate:', error);
                const sales = loadFromBrowser();
                set({ sales, isHydrated: true, isLoading: false });
            }
        },

        // Record a sale. Under Tauri this goes through the atomic Rust
        // `checkout_sale` command (one SQLite transaction: sale + items + stock
        // + FEFO lots + credit delta + treasury), which mints the receipt
        // number and returns it. In the browser we mint locally and persist to
        // localStorage.
        addSale: async (saleData, options = {}) => {
            const timestamp = new Date().toISOString();

            if (isTauri()) {
                const { invoke } = await import('@tauri-apps/api/core');
                const input = {
                    items: saleData.items.map((it: any) => ({
                        productId: it.productId,
                        productName: it.productName,
                        quantity: it.quantity,
                        unitPrice: it.unitPrice,
                        total: it.total,
                        taxAmount: it.taxAmount || 0,
                        discountPercent: it.discountPercent || 0,
                        costAtSale: options.costMap?.[it.productId] ?? 0,
                        stockQuantity: it.stockQuantity ?? it.quantity,
                    })),
                    subtotal: saleData.subtotal,
                    taxAmount: saleData.taxAmount,
                    discountAmount: saleData.discountAmount,
                    totalAmount: saleData.totalAmount,
                    paymentMethod: saleData.paymentMethod,
                    customerId: saleData.customerId || null,
                    customerName: saleData.customerName || '',
                    cashierId: saleData.cashierId,
                    cashierName: saleData.cashierName,
                    status: saleData.status || 'completed',
                    createdAt: timestamp,
                    sessionId: options.sessionId || null,
                    createdBy: options.createdBy || saleData.cashierId || '',
                    allowNegativeStock: options.allowNegativeStock ?? false,
                };

                // Rejects with { code, message } on EMPTY_CART, INSUFFICIENT_STOCK,
                // CREDIT_REQUIRES_CUSTOMER, etc. — the caller surfaces it.
                const result = await invoke<{ saleId: string; receiptNumber: string; createdAt: string }>(
                    'checkout_sale',
                    { input }
                );

                const newSale: Sale = {
                    ...saleData,
                    id: result.saleId,
                    receiptNumber: result.receiptNumber,
                    timestamp: result.createdAt,
                };
                set(state => ({ sales: [newSale, ...state.sales] }));
                return newSale;
            }

            // Browser fallback: no SQLite — mint locally and persist to localStorage.
            const newSale: Sale = {
                ...saleData,
                id: crypto.randomUUID(),
                receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
                timestamp,
            };
            set(state => {
                const updated = [newSale, ...state.sales];
                saveToBrowser(updated);
                return { sales: updated };
            });
            return newSale;
        },

        getSaleById: (id) => get().sales.find(s => s.id === id),

        getTodaySales: () => {
            const today = new Date().toISOString().split('T')[0];
            return get().sales.filter(s => s.timestamp.startsWith(today));
        },

        getSalesByPeriod: (start, end) => {
            return get().sales.filter(s => {
                const date = new Date(s.timestamp);
                return date >= start && date <= end;
            });
        },

        getWeekSales: () => {
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return get().sales.filter(s => new Date(s.timestamp) >= weekAgo);
        },

        getMonthSales: () => {
            const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            return get().sales.filter(s => new Date(s.timestamp) >= monthStart);
        },

        getTodayTotal: () => {
            const todaySales = get().getTodaySales();
            return todaySales.reduce((sum, s) => sum + s.totalAmount, 0);
        },

        getWeekTotal: () => {
            const weekSales = get().getWeekSales();
            return weekSales.reduce((sum, s) => sum + s.totalAmount, 0);
        },

        getMonthTotal: () => {
            const monthSales = get().getMonthSales();
            return monthSales.reduce((sum, s) => sum + s.totalAmount, 0);
        },
    })
);

export default useSalesStore;

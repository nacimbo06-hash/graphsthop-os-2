import { create } from 'zustand';
import { Sale } from '@bonilo/shared/types/sales';
import { salesRepo } from '../db';

interface SalesState {
    sales: Sale[];
    isLoading: boolean;
    isHydrated: boolean;

    // Lifecycle
    hydrate: () => Promise<void>;

    // Actions
    addSale: (
        saleData: Omit<Sale, 'id' | 'receiptNumber' | 'timestamp'>,
        costMap?: Record<string, number>,
        customerCredit?: {
            newBalance: number;
            lastPaymentDate: string | null;
        },
        treasuryMovement?: {
            sessionId: string;
            movementId: string;
            createdBy: string;
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

        // Load recent sales from SQLite into memory
        hydrate: async () => {
            if (get().isHydrated) return;
            set({ isLoading: true });
            try {
                // Load last 90 days of sales with items
                const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
                const sales = await salesRepo.loadAll({ withItems: true, since });
                set({ sales, isHydrated: true, isLoading: false });
                console.log(`[SalesStore] ✅ Hydrated ${sales.length} sales from DB`);
            } catch (error) {
                console.error('[SalesStore] ❌ Failed to hydrate:', error);
                set({ isLoading: false });
            }
        },

        // Record a sale — DB first in a transaction, then update memory
        addSale: async (saleData, costMap = {}, customerCredit, treasuryMovement) => {
            const newSale: Sale = {
                ...saleData,
                id: crypto.randomUUID(),
                receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
                timestamp: new Date().toISOString(),
            };

            // Write to DB atomically (sale + items + stock decrement + movements + optional customer credit + optional treasury movement)
            await salesRepo.recordSale(newSale, costMap, customerCredit, treasuryMovement);

            // Update in-memory state
            set(state => ({
                sales: [newSale, ...state.sales]
            }));

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

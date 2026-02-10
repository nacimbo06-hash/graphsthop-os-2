import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Sale, SaleItem } from '@shared/types/sales';




interface SalesState {
    sales: Sale[];

    // Actions
    addSale: (sale: Omit<Sale, 'id' | 'receiptNumber' | 'timestamp'>) => Sale;
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
    persist(
        (set, get) => ({
            sales: [],

            addSale: (saleData) => {
                const newSale: Sale = {
                    ...saleData,
                    id: `sale_${Date.now()}`,
                    receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
                    timestamp: new Date().toISOString(),
                };

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
        }),
        {
            name: 'sales-storage',
        }
    )
);

export default useSalesStore;

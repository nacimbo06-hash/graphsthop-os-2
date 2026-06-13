import { describe, it, expect, beforeEach, vi } from 'vitest';

// Hoisted so the vi.mock factory can reference it. Mimics the Rust
// `checkout_sale` command: returns an incrementing receipt number per call.
const { invokeMock } = vi.hoisted(() => {
    let seq = 0;
    return {
        invokeMock: vi.fn(async () => {
            seq += 1;
            return {
                saleId: `sale_${seq}`,
                receiptNumber: `REC-${String(seq).padStart(6, '0')}`,
                createdAt: new Date().toISOString(),
                lotsDrained: [],
            };
        }),
    };
});

vi.mock('@tauri-apps/api/core', () => ({ invoke: invokeMock }));

vi.mock('../../db', () => ({
    salesRepo: {
        loadAll: vi.fn().mockResolvedValue([]),
    },
}));

import { useSalesStore } from '../salesStore';
import { salesRepo } from '../../db';

const mockSaleInput = {
    items: [
        {
            id: 'item_1',
            productId: 'prod_1',
            productName: 'CANDIA Lait 1L',
            quantity: 2,
            unitPrice: 120,
            total: 240,
        },
    ],
    subtotal: 240,
    taxAmount: 45.6,
    discountAmount: 0,
    totalAmount: 285.6,
    paymentMethod: 'cash' as const,
    cashierId: 'user_1',
    cashierName: 'Ahmed',
    status: 'completed' as const,
};

describe('SalesStore', () => {
    beforeEach(() => {
        useSalesStore.setState({
            sales: [],
            isLoading: false,
            isHydrated: false,
        });
        vi.clearAllMocks();
    });

    it('should start with empty sales', () => {
        expect(useSalesStore.getState().sales).toEqual([]);
    });

    it('should hydrate from database', async () => {
        const dbSales = [{
            ...mockSaleInput,
            id: 'sale_1',
            receiptNumber: 'REC-000001',
            timestamp: new Date().toISOString(),
        }];
        (salesRepo.loadAll as any).mockResolvedValueOnce(dbSales);

        await useSalesStore.getState().hydrate();

        const state = useSalesStore.getState();
        expect(state.isHydrated).toBe(true);
        expect(state.sales).toHaveLength(1);
        expect(salesRepo.loadAll).toHaveBeenCalledOnce();
    });

    it('should not hydrate twice', async () => {
        (salesRepo.loadAll as any).mockResolvedValueOnce([]);
        await useSalesStore.getState().hydrate();
        await useSalesStore.getState().hydrate();
        expect(salesRepo.loadAll).toHaveBeenCalledOnce();
    });

    it('should add a sale via the checkout_sale command', async () => {
        const sale = await useSalesStore.getState().addSale(mockSaleInput);

        expect(sale.id).toBe('sale_1');
        expect(sale.receiptNumber).toMatch(/^REC-\d{6}$/);
        expect(sale.timestamp).toBeDefined();
        expect(sale.totalAmount).toBe(285.6);
        expect(invokeMock).toHaveBeenCalledWith(
            'checkout_sale',
            expect.objectContaining({
                input: expect.objectContaining({ totalAmount: 285.6, paymentMethod: 'cash' }),
            })
        );
        expect(useSalesStore.getState().sales).toHaveLength(1);
    });

    it('should pass the cost map into the checkout input', async () => {
        await useSalesStore.getState().addSale(mockSaleInput, { costMap: { prod_1: 90 } });

        expect(invokeMock).toHaveBeenCalledWith(
            'checkout_sale',
            expect.objectContaining({
                input: expect.objectContaining({
                    items: expect.arrayContaining([
                        expect.objectContaining({ productId: 'prod_1', costAtSale: 90 }),
                    ]),
                }),
            })
        );
    });

    it('should find sale by id', async () => {
        const sale = await useSalesStore.getState().addSale(mockSaleInput);
        const found = useSalesStore.getState().getSaleById(sale.id);
        expect(found?.totalAmount).toBe(285.6);
    });

    it('should return today sales', async () => {
        await useSalesStore.getState().addSale(mockSaleInput);
        const todaySales = useSalesStore.getState().getTodaySales();
        expect(todaySales).toHaveLength(1);
    });

    it('should return today total', async () => {
        await useSalesStore.getState().addSale(mockSaleInput);
        await useSalesStore.getState().addSale({ ...mockSaleInput, totalAmount: 500 });

        const total = useSalesStore.getState().getTodayTotal();
        expect(total).toBe(785.6);
    });

    it('should return week sales', async () => {
        await useSalesStore.getState().addSale(mockSaleInput);
        const weekSales = useSalesStore.getState().getWeekSales();
        expect(weekSales).toHaveLength(1);
    });

    it('should return month sales', async () => {
        await useSalesStore.getState().addSale(mockSaleInput);
        const monthSales = useSalesStore.getState().getMonthSales();
        expect(monthSales).toHaveLength(1);
    });

    it('should filter sales by period', async () => {
        await useSalesStore.getState().addSale(mockSaleInput);

        const start = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const end = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const sales = useSalesStore.getState().getSalesByPeriod(start, end);
        expect(sales).toHaveLength(1);

        // Out-of-range period
        const pastStart = new Date('2020-01-01');
        const pastEnd = new Date('2020-01-02');
        const noSales = useSalesStore.getState().getSalesByPeriod(pastStart, pastEnd);
        expect(noSales).toHaveLength(0);
    });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Hoisted so the vi.mock factory can reference it. Mimics the Rust commands:
// returns the right result shape per command, with an incrementing number.
const { invokeMock } = vi.hoisted(() => {
    let seq = 0;
    return {
        invokeMock: vi.fn(async (cmd: string) => {
            seq += 1;
            const n = String(seq).padStart(3, '0');
            if (cmd === 'create_purchase_order') {
                return { orderId: `po_${seq}`, poNumber: `BC-2026-${n}`, createdAt: new Date().toISOString() };
            }
            return {
                receiptId: `gr_${seq}`,
                grNumber: `BE-2026-${n}`,
                createdAt: new Date().toISOString(),
                lotsCreated: [],
                supplierDebtDelta: 0,
            };
        }),
    };
});

vi.mock('@tauri-apps/api/core', () => ({ invoke: invokeMock }));

vi.mock('../../db', () => ({
    purchasesRepo: {
        loadSuppliers: vi.fn().mockResolvedValue([]),
        loadPurchaseOrders: vi.fn().mockResolvedValue([]),
        loadGoodsReceipts: vi.fn().mockResolvedValue([]),
    },
}));

import { usePurchasesStore } from '../purchasesStore';
import { purchasesRepo } from '../../db';

const mockReceiptInput = {
    supplierId: 'sup_1',
    supplierName: 'Sarl Lait',
    date: '2026-06-13',
    invoiceNumber: 'FAC-001',
    items: [
        {
            id: 'i1',
            productId: 'prod_1',
            productName: 'CANDIA Lait 1L',
            productBarcode: '611',
            productEmoji: '🥛',
            orderedQty: 10,
            receivedQty: 12,
            purchasePrice: 80,
            total: 960,
            expiryDate: '2026-12-01',
            unit: 'unit',
            isPerishable: true,
            shelfLifeDays: 30,
        },
    ],
    total: 960,
    status: 'completed' as const,
    isPaid: false,
};

describe('PurchasesStore', () => {
    beforeEach(() => {
        usePurchasesStore.setState({
            suppliers: [],
            purchaseOrders: [],
            goodsReceipts: [],
            isLoading: false,
            isHydrated: false,
        });
        vi.clearAllMocks();
    });

    it('should hydrate from database', async () => {
        await usePurchasesStore.getState().hydrate();
        const state = usePurchasesStore.getState();
        expect(state.isHydrated).toBe(true);
        expect(purchasesRepo.loadSuppliers).toHaveBeenCalledOnce();
        expect(purchasesRepo.loadGoodsReceipts).toHaveBeenCalledOnce();
    });

    it('should record a goods receipt via the receive_goods command', async () => {
        const receipt = await usePurchasesStore.getState().addGoodsReceipt(mockReceiptInput, {
            sessionId: null,
            createdBy: 'Staff',
        });

        expect(receipt.id).toBe('gr_1');
        expect(receipt.grNumber).toMatch(/^BE-2026-\d{3}$/);
        expect(receipt.createdAt).toBeDefined();
        expect(usePurchasesStore.getState().goodsReceipts).toHaveLength(1);

        // The command receives the camelCase input, including the per-line lot
        // hints the renderer now supplies.
        expect(invokeMock).toHaveBeenCalledWith(
            'receive_goods',
            expect.objectContaining({
                input: expect.objectContaining({
                    supplierId: 'sup_1',
                    total: 960,
                    isPaid: false,
                    items: expect.arrayContaining([
                        expect.objectContaining({
                            productId: 'prod_1',
                            receivedQty: 12,
                            isPerishable: true,
                            shelfLifeDays: 30,
                            expiryDate: '2026-12-01',
                        }),
                    ]),
                }),
            })
        );
    });

    it('should thread the cash session id into the command input', async () => {
        await usePurchasesStore.getState().addGoodsReceipt(
            { ...mockReceiptInput, isPaid: true, paidFrom: 'cash' },
            { sessionId: 'sess_9', createdBy: 'Staff' }
        );

        expect(invokeMock).toHaveBeenCalledWith(
            'receive_goods',
            expect.objectContaining({
                input: expect.objectContaining({ paidFrom: 'cash', sessionId: 'sess_9' }),
            })
        );
    });

    it('should reflect an unpaid receipt in the derived supplier debt', async () => {
        await usePurchasesStore.getState().addGoodsReceipt(mockReceiptInput);
        expect(usePurchasesStore.getState().getSupplierDebt('sup_1')).toBe(960);
    });

    it('should create a purchase order via the create_purchase_order command', async () => {
        const order = await usePurchasesStore.getState().addPurchaseOrder({
            supplierId: 'sup_1',
            supplierName: 'Sarl Lait',
            date: '2026-06-14',
            expectedDate: '2026-06-21',
            status: 'draft',
            items: mockReceiptInput.items,
            subtotal: 960,
            taxAmount: 0,
            total: 960,
        });

        expect(order.id).toMatch(/^po_\d+$/);
        expect(order.poNumber).toMatch(/^BC-2026-\d{3}$/);
        expect(usePurchasesStore.getState().purchaseOrders).toHaveLength(1);
        expect(invokeMock).toHaveBeenCalledWith(
            'create_purchase_order',
            expect.objectContaining({
                input: expect.objectContaining({
                    supplierId: 'sup_1',
                    total: 960,
                    items: expect.arrayContaining([
                        expect.objectContaining({ productId: 'prod_1', orderedQty: 10 }),
                    ]),
                }),
            })
        );
    });

    it('should surface a rejected command to the caller', async () => {
        invokeMock.mockRejectedValueOnce({ code: 'UNKNOWN_PRODUCT', message: 'unknown product: ghost' });

        await expect(
            usePurchasesStore.getState().addGoodsReceipt(mockReceiptInput)
        ).rejects.toMatchObject({ code: 'UNKNOWN_PRODUCT' });

        // Nothing added to memory on failure.
        expect(usePurchasesStore.getState().goodsReceipts).toHaveLength(0);
    });
});

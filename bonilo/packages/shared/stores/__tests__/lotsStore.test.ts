import { describe, it, expect, beforeEach, vi } from 'vitest';

// Hoisted so the vi.mock factory can reference it. Mimics the Rust lot ops:
// update_lot_with_movement returns a movement id; bulk_update_lot_statuses
// returns how many rows it touched.
const { invokeMock } = vi.hoisted(() => {
    let seq = 0;
    return {
        invokeMock: vi.fn(async (cmd: string, args: any) => {
            seq += 1;
            if (cmd === 'bulk_update_lot_statuses') {
                return { updated: args.input.updates.length };
            }
            return { lotId: args.input.lotId, newQuantity: args.input.newQuantity, movementId: `mv_${seq}` };
        }),
    };
});

vi.mock('@tauri-apps/api/core', () => ({ invoke: invokeMock }));

vi.mock('../../db', () => ({
    lotsRepo: {
        loadLots: vi.fn().mockResolvedValue([]),
        loadMovements: vi.fn().mockResolvedValue([]),
    },
}));

import { useLotsStore, type ProductLot } from '../lotsStore';

function makeLot(overrides: Partial<ProductLot> = {}): ProductLot {
    const oneYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    return {
        id: 'lot1',
        productId: 'p1',
        productName: 'CANDIA Lait 1L',
        productBarcode: '611',
        lotNumber: 'LOT-0001',
        quantity: 10,
        originalQuantity: 10,
        expiryDate: oneYear,
        receivedDate: new Date().toISOString(),
        purchasePrice: 80,
        status: 'ok',
        daysRemaining: 365,
        createdAt: new Date().toISOString(),
        ...overrides,
    };
}

describe('LotsStore', () => {
    beforeEach(() => {
        useLotsStore.setState({ lots: [], movements: [], isLoading: false, isHydrated: false });
        vi.clearAllMocks();
    });

    it('reduces a lot via the update_lot_with_movement command', async () => {
        useLotsStore.setState({ lots: [makeLot({ quantity: 10 })] });

        await useLotsStore.getState().reduceLotQuantity('lot1', 3, 'Casse', 'ref-1', 'staff');

        expect(invokeMock).toHaveBeenCalledWith(
            'update_lot_with_movement',
            expect.objectContaining({
                input: expect.objectContaining({
                    lotId: 'lot1',
                    newQuantity: 7,
                    movement: expect.objectContaining({ type: 'sale', quantity: -3 }),
                }),
            })
        );

        const lot = useLotsStore.getState().lots.find(l => l.id === 'lot1');
        expect(lot?.quantity).toBe(7);
        const mv = useLotsStore.getState().movements[0];
        expect(mv.id).toBe('mv_1');
        expect(mv.quantity).toBe(-3);
    });

    it('clamps a reduction to the available quantity', async () => {
        useLotsStore.setState({ lots: [makeLot({ quantity: 4 })] });

        await useLotsStore.getState().reduceLotQuantity('lot1', 100, 'Casse');

        expect(invokeMock).toHaveBeenCalledWith(
            'update_lot_with_movement',
            expect.objectContaining({
                input: expect.objectContaining({ newQuantity: 0 }),
            })
        );
        expect(useLotsStore.getState().lots[0].quantity).toBe(0);
    });

    it('disposes a lot via the command (zeroed + expired)', async () => {
        useLotsStore.setState({ lots: [makeLot({ quantity: 6 })] });

        await useLotsStore.getState().disposeLot('lot1', 'Périmé', 'staff');

        expect(invokeMock).toHaveBeenCalledWith(
            'update_lot_with_movement',
            expect.objectContaining({
                input: expect.objectContaining({
                    newQuantity: 0,
                    status: 'expired',
                    movement: expect.objectContaining({ type: 'disposal', quantity: -6 }),
                }),
            })
        );
        const lot = useLotsStore.getState().lots[0];
        expect(lot.quantity).toBe(0);
        expect(lot.status).toBe('expired');
    });

    it('persists recomputed statuses via bulk_update_lot_statuses', async () => {
        // Stored status is stale (expired) but the lot expires in a year, so the
        // refresh recomputes it and pushes an update.
        useLotsStore.setState({ lots: [makeLot({ status: 'expired', daysRemaining: 0 })] });

        await useLotsStore.getState().refreshLotStatuses();

        expect(invokeMock).toHaveBeenCalledWith(
            'bulk_update_lot_statuses',
            expect.objectContaining({
                input: expect.objectContaining({
                    updates: expect.arrayContaining([
                        expect.objectContaining({ id: 'lot1' }),
                    ]),
                }),
            })
        );
        // In-memory lot is recomputed away from the stale 'expired'.
        expect(useLotsStore.getState().lots[0].status).not.toBe('expired');
    });
});

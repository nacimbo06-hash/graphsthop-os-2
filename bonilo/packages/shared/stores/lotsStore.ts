import { create } from 'zustand';
import type { ExpiryStatus } from '@shared/types/expiry';
import { lotsRepo } from '../db';

/**
 * Lot Store - Tracks product batches/lots with expiry dates
 * Integrates with Goods Receipt for full batch tracking
 */

export interface ProductLot {
    id: string;
    productId: string;
    productName: string;
    productBarcode: string;
    lotNumber: string;
    batchNumber?: string;
    quantity: number;
    originalQuantity: number;
    expiryDate: string;
    receivedDate: string;
    supplierId?: string;
    supplierName?: string;
    goodsReceiptId?: string;
    purchasePrice: number;
    status: ExpiryStatus;
    daysRemaining: number;
    createdAt: string;
}

export interface LotMovement {
    id: string;
    lotId: string;
    productId: string;
    type: 'receipt' | 'sale' | 'adjustment' | 'disposal' | 'return';
    quantity: number;
    reason?: string;
    reference?: string;
    createdAt: string;
    createdBy: string;
}

interface LotsState {
    lots: ProductLot[];
    movements: LotMovement[];
    isLoading: boolean;
    isHydrated: boolean;

    // Lifecycle
    hydrate: () => Promise<void>;

    // Actions
    addLot: (lot: Omit<ProductLot, 'id' | 'createdAt' | 'status' | 'daysRemaining'>) => Promise<string>;
    updateLot: (id: string, updates: Partial<ProductLot>) => Promise<void>;
    reduceLotQuantity: (lotId: string, quantity: number, reason: string, reference?: string, createdBy?: string) => Promise<void>;
    disposeLot: (lotId: string, reason: string, createdBy: string) => Promise<void>;

    // Getters
    getLotsByProduct: (productId: string) => ProductLot[];
    getActiveLots: () => ProductLot[];
    getExpiringLots: (daysThreshold?: number) => ProductLot[];
    getExpiredLots: () => ProductLot[];
    getLotMovements: (lotId: string) => LotMovement[];
    selectLotsForSale: (productId: string, quantity: number) => { lot: ProductLot; qty: number }[];
    refreshLotStatuses: () => Promise<void>;
}

// Calculate expiry status based on days remaining
function getExpiryStatus(daysRemaining: number): ExpiryStatus {
    if (daysRemaining < 0) return 'expired';
    if (daysRemaining <= 3) return 'critical';
    if (daysRemaining <= 7) return 'warning';
    if (daysRemaining <= 14) return 'attention';
    return 'ok';
}

// Calculate days remaining from expiry date
function calculateDaysRemaining(expiryDate: string): number {
    const expiry = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export const useLotsStore = create<LotsState>()(
    (set, get) => ({
        lots: [],
        movements: [],
        isLoading: false,
        isHydrated: false,

        hydrate: async () => {
            if (get().isHydrated) return;
            set({ isLoading: true });
            try {
                const [lots, movements] = await Promise.all([
                    lotsRepo.loadLots(),
                    lotsRepo.loadMovements(),
                ]);
                set({ lots, movements, isHydrated: true, isLoading: false });
                console.log(`[LotsStore] Hydrated ${lots.length} lots, ${movements.length} movements from DB`);
            } catch (error) {
                console.error('[LotsStore] Failed to hydrate:', error);
                set({ isLoading: false });
            }
        },

        addLot: async (lotData) => {
            const daysRemaining = calculateDaysRemaining(lotData.expiryDate);
            const status = getExpiryStatus(daysRemaining);

            const newLot: ProductLot = {
                ...lotData,
                id: crypto.randomUUID(),
                status,
                daysRemaining,
                createdAt: new Date().toISOString(),
            };

            // Add movement record
            const movement: LotMovement = {
                id: crypto.randomUUID(),
                lotId: newLot.id,
                productId: newLot.productId,
                type: 'receipt',
                quantity: newLot.quantity,
                reason: 'Reception marchandise',
                reference: newLot.goodsReceiptId,
                createdAt: new Date().toISOString(),
                createdBy: 'System',
            };

            await lotsRepo.createLot(newLot);
            await lotsRepo.addMovement(movement);

            set(state => ({
                lots: [newLot, ...state.lots],
                movements: [movement, ...state.movements],
            }));

            return newLot.id;
        },

        updateLot: async (id, updates) => {
            await lotsRepo.updateLot(id, updates);
            set(state => ({
                lots: state.lots.map(lot =>
                    lot.id === id ? { ...lot, ...updates } : lot
                ),
            }));
        },

        reduceLotQuantity: async (lotId, quantity, reason, reference, createdBy = 'System') => {
            const lot = get().lots.find(l => l.id === lotId);
            if (!lot || quantity <= 0) return;

            const actualQty = Math.min(quantity, lot.quantity);
            const newQuantity = lot.quantity - actualQty;

            // Add movement record
            const movement: LotMovement = {
                id: crypto.randomUUID(),
                lotId,
                productId: lot.productId,
                type: 'sale',
                quantity: -actualQty,
                reason,
                reference,
                createdAt: new Date().toISOString(),
                createdBy,
            };

            await lotsRepo.updateLotWithMovement(lotId, newQuantity, lot.status, movement);

            set(state => ({
                lots: state.lots.map(l =>
                    l.id === lotId ? { ...l, quantity: newQuantity } : l
                ),
                movements: [movement, ...state.movements],
            }));
        },

        disposeLot: async (lotId, reason, createdBy) => {
            const lot = get().lots.find(l => l.id === lotId);
            if (!lot) return;

            // Add disposal movement
            const movement: LotMovement = {
                id: crypto.randomUUID(),
                lotId,
                productId: lot.productId,
                type: 'disposal',
                quantity: -lot.quantity,
                reason,
                createdAt: new Date().toISOString(),
                createdBy,
            };

            await lotsRepo.updateLotWithMovement(lotId, 0, 'expired', movement);

            set(state => ({
                lots: state.lots.map(l =>
                    l.id === lotId ? { ...l, quantity: 0, status: 'expired' as ExpiryStatus } : l
                ),
                movements: [movement, ...state.movements],
            }));
        },

        getLotsByProduct: (productId) => {
            return get().lots
                .filter(l => l.productId === productId && l.quantity > 0)
                .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
        },

        getActiveLots: () => {
            return get().lots.filter(l => l.quantity > 0 && l.status !== 'expired');
        },

        getExpiringLots: (daysThreshold = 7) => {
            return get().lots.filter(l =>
                l.quantity > 0 &&
                l.daysRemaining <= daysThreshold &&
                l.daysRemaining >= 0
            );
        },

        getExpiredLots: () => {
            return get().lots.filter(l => l.quantity > 0 && l.status === 'expired');
        },

        getLotMovements: (lotId) => {
            return get().movements.filter(m => m.lotId === lotId);
        },

        // FEFO: First Expired First Out selection for sales
        selectLotsForSale: (productId, quantity) => {
            const lots = get().getLotsByProduct(productId);
            const selection: { lot: ProductLot; qty: number }[] = [];
            let remaining = quantity;

            for (const lot of lots) {
                if (remaining <= 0) break;
                if (lot.quantity <= 0) continue;

                const takeQty = Math.min(remaining, lot.quantity);
                selection.push({ lot, qty: takeQty });
                remaining -= takeQty;
            }

            return selection;
        },

        refreshLotStatuses: async () => {
            const updates: Array<{ id: string; status: string; daysRemaining: number }> = [];
            const newLots = get().lots.map(lot => {
                const daysRemaining = calculateDaysRemaining(lot.expiryDate);
                const status = getExpiryStatus(daysRemaining);
                if (lot.status !== status || lot.daysRemaining !== daysRemaining) {
                    updates.push({ id: lot.id, status, daysRemaining });
                }
                return { ...lot, daysRemaining, status };
            });

            if (updates.length > 0) {
                await lotsRepo.bulkUpdateStatuses(updates);
            }

            set({ lots: newLots });
        },
    })
);

export default useLotsStore;

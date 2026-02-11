import { create } from 'zustand';
import { stockMovementsRepo } from '../db';

export interface StockMovement {
    id: string;
    date: string;
    type: 'entry' | 'exit' | 'adjustment' | 'sale';
    productId: string;
    productName: string;
    productEmoji: string;
    quantity: number;
    previousStock: number;
    newStock: number;
    reason: string;
    performedBy: string;
    reference?: string;
}

interface StockMovementsState {
    movements: StockMovement[];
    isLoading: boolean;
    isHydrated: boolean;

    // Lifecycle
    hydrate: () => Promise<void>;

    // Actions
    addMovement: (movement: Omit<StockMovement, 'id' | 'date'>) => Promise<void>;

    // Getters
    getMovementsByDate: (date: Date) => StockMovement[];
    getMovementsByProduct: (productId: string) => StockMovement[];
    getTodayMovements: () => StockMovement[];
    getTodayEntries: () => number;
    getTodayExits: () => number;
}

export const useStockMovementsStore = create<StockMovementsState>()(
    (set, get) => ({
        movements: [],
        isLoading: false,
        isHydrated: false,

        hydrate: async () => {
            if (get().isHydrated) return;
            set({ isLoading: true });
            try {
                const movements = await stockMovementsRepo.loadAll();
                set({ movements, isHydrated: true, isLoading: false });
                console.log(`[StockMovementsStore] Hydrated ${movements.length} movements from DB`);
            } catch (error) {
                console.error('[StockMovementsStore] Failed to hydrate:', error);
                set({ isLoading: false });
            }
        },

        addMovement: async (movement) => {
            const newMovement: StockMovement = {
                ...movement,
                id: crypto.randomUUID(),
                date: new Date().toISOString(),
            };
            await stockMovementsRepo.create(newMovement);
            set(state => ({
                movements: [newMovement, ...state.movements],
            }));
        },

        getMovementsByDate: (date) => {
            const dateStr = date.toDateString();
            return get().movements.filter(
                m => new Date(m.date).toDateString() === dateStr
            );
        },

        getMovementsByProduct: (productId) => {
            return get().movements.filter(m => m.productId === productId);
        },

        getTodayMovements: () => {
            const today = new Date().toDateString();
            return get().movements.filter(
                m => new Date(m.date).toDateString() === today
            );
        },

        getTodayEntries: () => {
            const today = new Date().toDateString();
            return get().movements
                .filter(m => new Date(m.date).toDateString() === today && m.type === 'entry')
                .reduce((sum, m) => sum + m.quantity, 0);
        },

        getTodayExits: () => {
            const today = new Date().toDateString();
            return get().movements
                .filter(m => new Date(m.date).toDateString() === today && (m.type === 'sale' || m.type === 'exit'))
                .reduce((sum, m) => sum + m.quantity, 0);
        },
    })
);

export default useStockMovementsStore;

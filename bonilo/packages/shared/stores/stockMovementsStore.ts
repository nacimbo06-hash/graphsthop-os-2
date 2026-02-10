import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

    // Actions
    addMovement: (movement: Omit<StockMovement, 'id' | 'date'>) => void;

    // Getters
    getMovementsByDate: (date: Date) => StockMovement[];
    getMovementsByProduct: (productId: string) => StockMovement[];
    getTodayMovements: () => StockMovement[];
    getTodayEntries: () => number;
    getTodayExits: () => number;
}

export const useStockMovementsStore = create<StockMovementsState>()(
    persist(
        (set, get) => ({
            movements: [],

            addMovement: (movement) => {
                const newMovement: StockMovement = {
                    ...movement,
                    id: crypto.randomUUID(),
                    date: new Date().toISOString(),
                };
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
        }),
        {
            name: 'stock-movements-storage',
        }
    )
);

export default useStockMovementsStore;

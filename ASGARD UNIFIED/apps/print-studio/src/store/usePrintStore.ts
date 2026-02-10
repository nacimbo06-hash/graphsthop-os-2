import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    currency: string;
    barcode: string;
    category?: string;
}

export interface PrintItem extends Product {
    quantity: number;
    templateId?: string;
}

interface PrintStore {
    products: Product[];
    printQueue: PrintItem[];

    // Product actions
    addProduct: (product: Product) => void;
    removeProduct: (productId: string) => void;
    updateProduct: (productId: string, updates: Partial<Product>) => void;
    setProducts: (products: Product[]) => void;

    // Queue actions
    addToQueue: (product: Product, quantity?: number) => void;
    removeFromQueue: (productId: string) => void;
    updateQueueQuantity: (productId: string, quantity: number) => void;
    clearQueue: () => void;
}

export const usePrintStore = create<PrintStore>()(
    persist(
        (set) => ({
            products: [],
            printQueue: [],

            addProduct: (product) =>
                set((state) => ({ products: [...state.products, product] })),

            removeProduct: (productId) =>
                set((state) => ({ products: state.products.filter(p => p.id !== productId) })),

            updateProduct: (productId, updates) =>
                set((state) => ({
                    products: state.products.map(p => p.id === productId ? { ...p, ...updates } : p)
                })),

            setProducts: (products) => set({ products }),

            addToQueue: (product, quantity = 1) =>
                set((state) => {
                    const existing = state.printQueue.find(item => item.id === product.id);
                    if (existing) {
                        return {
                            printQueue: state.printQueue.map(item =>
                                item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                            )
                        };
                    }
                    return { printQueue: [...state.printQueue, { ...product, quantity }] };
                }),

            removeFromQueue: (productId) =>
                set((state) => ({ printQueue: state.printQueue.filter(item => item.id !== productId) })),

            updateQueueQuantity: (productId, quantity) =>
                set((state) => ({
                    printQueue: state.printQueue.map(item =>
                        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
                    )
                })),

            clearQueue: () => set({ printQueue: [] }),
        }),
        {
            name: 'igo-print-store',
        }
    )
);

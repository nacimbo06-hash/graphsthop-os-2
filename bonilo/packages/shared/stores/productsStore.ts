import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@bonilo/shared/types/product';
import { productsRepo } from '../db';

export type { Product };

// Check if running in Tauri (SQLite available)
const isTauri = () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

const BROWSER_STORAGE_KEY = 'bonilo-products';

interface ProductsState {
    products: Product[];
    isLoading: boolean;
    isHydrated: boolean;

    // Lifecycle
    hydrate: () => Promise<void>;

    // Actions
    addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
    updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    toggleFavorite: (id: string) => Promise<void>;
    updateStock: (id: string, quantity: number, type: 'add' | 'remove' | 'set') => Promise<void>;

    // Getters (synchronous, from in-memory cache)
    getProductById: (id: string) => Product | undefined;
    getProductByBarcode: (barcode: string) => Product | undefined;
    getProductsBySKU: (sku: string) => Product | undefined;
    getLowStockProducts: () => Product[];
    getOutOfStockProducts: () => Product[];
    getFavoriteProducts: () => Product[];
    getProductsByCategory: (category: string) => Product[];
    getAllSKUs: () => string[];
}

/** Save products to localStorage (browser fallback) */
function saveToBrowser(products: Product[]) {
    if (!isTauri()) {
        try {
            localStorage.setItem(BROWSER_STORAGE_KEY, JSON.stringify(products));
        } catch (e) {
            console.warn('[ProductsStore] localStorage save failed:', e);
        }
    }
}

/** Load products from localStorage (browser fallback) */
function loadFromBrowser(): Product[] {
    if (!isTauri()) {
        try {
            const data = localStorage.getItem(BROWSER_STORAGE_KEY);
            if (data) return JSON.parse(data);
        } catch (e) {
            console.warn('[ProductsStore] localStorage load failed:', e);
        }
    }
    return [];
}

export const useProductsStore = create<ProductsState>()(
    (set, get) => ({
        products: [],
        isLoading: false,
        isHydrated: false,

        // Load products into memory on app start
        hydrate: async () => {
            if (get().isHydrated) return;
            set({ isLoading: true });
            try {
                let products: Product[];
                if (isTauri()) {
                    // Tauri mode: load from SQLite
                    products = await productsRepo.loadAll();
                } else {
                    // Browser mode: load from localStorage
                    products = loadFromBrowser();
                }
                set({ products, isHydrated: true, isLoading: false });
                console.log(`[ProductsStore] ✅ Hydrated ${products.length} products from ${isTauri() ? 'DB' : 'localStorage'}`);
            } catch (error) {
                console.error('[ProductsStore] ❌ Failed to hydrate:', error);
                // Browser fallback on error
                const products = loadFromBrowser();
                set({ products, isHydrated: true, isLoading: false });
            }
        },

        // Add a new product — write to DB/localStorage, then update memory
        addProduct: async (productData) => {
            const newProduct: Product = {
                ...productData,
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            if (isTauri()) {
                await productsRepo.create(newProduct);
            }

            set((state) => {
                const updated = [...state.products, newProduct];
                saveToBrowser(updated);
                return { products: updated };
            });

            return newProduct;
        },

        // Update an existing product
        updateProduct: async (id, updates) => {
            if (isTauri()) {
                await productsRepo.update(id, updates);
            }

            set((state) => {
                const updated = state.products.map((p) =>
                    p.id === id
                        ? { ...p, ...updates, updatedAt: new Date().toISOString() }
                        : p
                );
                saveToBrowser(updated);
                return { products: updated };
            });
        },

        // Delete a product (soft delete)
        deleteProduct: async (id) => {
            if (isTauri()) {
                await productsRepo.softDelete(id);
            }

            set((state) => {
                const updated = state.products.filter((p) => p.id !== id);
                saveToBrowser(updated);
                return { products: updated };
            });
        },

        // Toggle favorite status
        toggleFavorite: async (id) => {
            const product = get().products.find(p => p.id === id);
            if (!product) return;

            const newFav = !product.isFavorite;
            if (isTauri()) {
                await productsRepo.update(id, { isFavorite: newFav });
            }

            set((state) => {
                const updated = state.products.map((p) =>
                    p.id === id ? { ...p, isFavorite: newFav } : p
                );
                saveToBrowser(updated);
                return { products: updated };
            });
        },

        // Update stock with DB transaction + inventory movement
        updateStock: async (id, quantity, type) => {
            const product = get().products.find(p => p.id === id);
            if (!product) return;

            let newStock: number;
            let qtyChange: number;
            let movementType: 'restock' | 'correction' | 'sale' = 'correction';

            switch (type) {
                case 'add':
                    newStock = product.stock + quantity;
                    qtyChange = quantity;
                    movementType = 'restock';
                    break;
                case 'remove':
                    newStock = Math.max(0, product.stock - quantity);
                    qtyChange = -(product.stock - newStock);
                    movementType = 'sale';
                    break;
                case 'set':
                    newStock = quantity;
                    qtyChange = quantity - product.stock;
                    movementType = 'correction';
                    break;
                default:
                    newStock = product.stock;
                    qtyChange = 0;
            }

            if (isTauri()) {
                await productsRepo.updateStock(id, newStock, qtyChange, movementType);
            }

            set((state) => {
                const updated = state.products.map((p) =>
                    p.id === id ? { ...p, stock: newStock, updatedAt: new Date().toISOString() } : p
                );
                saveToBrowser(updated);
                return { products: updated };
            });
        },

        // ============================================
        // Synchronous Getters (from in-memory cache)
        // ============================================

        getProductById: (id) => get().products.find((p) => p.id === id),

        getProductByBarcode: (barcode) => get().products.find((p) => p.barcode === barcode),

        getProductsBySKU: (sku) => get().products.find((p) => p.sku === sku),

        getLowStockProducts: () => get().products.filter((p) => p.stock > 0 && p.stock <= p.minStock),

        getOutOfStockProducts: () => get().products.filter((p) => p.stock === 0),

        getFavoriteProducts: () => get().products.filter((p) => p.isFavorite),

        getProductsByCategory: (category) => {
            if (category === 'Toutes' || category === 'all') {
                return get().products;
            }
            return get().products.filter((p) => p.category === category);
        },

        getAllSKUs: () => get().products.map((p) => p.sku),
    })
);

export default useProductsStore;

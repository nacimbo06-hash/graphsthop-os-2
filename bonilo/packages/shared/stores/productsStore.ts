import { create } from 'zustand';
import { Product } from '@bonilo/shared/types/product';
import { productsRepo } from '../db';

export type { Product };

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

export const useProductsStore = create<ProductsState>()(
    (set, get) => ({
        products: [],
        isLoading: false,
        isHydrated: false,

        // Load products from SQLite into memory on app start
        hydrate: async () => {
            if (get().isHydrated) return;
            set({ isLoading: true });
            try {
                const products = await productsRepo.loadAll();
                set({ products, isHydrated: true, isLoading: false });
                console.log(`[ProductsStore] ✅ Hydrated ${products.length} products from DB`);
            } catch (error) {
                console.error('[ProductsStore] ❌ Failed to hydrate:', error);
                set({ isLoading: false });
            }
        },

        // Add a new product — write to DB first, then update memory
        addProduct: async (productData) => {
            const newProduct: Product = {
                ...productData,
                id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            await productsRepo.create(newProduct);

            set((state) => ({
                products: [...state.products, newProduct],
            }));

            return newProduct;
        },

        // Update an existing product
        updateProduct: async (id, updates) => {
            await productsRepo.update(id, updates);

            set((state) => ({
                products: state.products.map((p) =>
                    p.id === id
                        ? { ...p, ...updates, updatedAt: new Date().toISOString() }
                        : p
                ),
            }));
        },

        // Delete a product (soft delete)
        deleteProduct: async (id) => {
            await productsRepo.softDelete(id);

            set((state) => ({
                products: state.products.filter((p) => p.id !== id),
            }));
        },

        // Toggle favorite status
        toggleFavorite: async (id) => {
            const product = get().products.find(p => p.id === id);
            if (!product) return;

            const newFav = !product.isFavorite;
            await productsRepo.update(id, { isFavorite: newFav });

            set((state) => ({
                products: state.products.map((p) =>
                    p.id === id ? { ...p, isFavorite: newFav } : p
                ),
            }));
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

            await productsRepo.updateStock(id, newStock, qtyChange, movementType);

            set((state) => ({
                products: state.products.map((p) =>
                    p.id === id ? { ...p, stock: newStock, updatedAt: new Date().toISOString() } : p
                ),
            }));
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

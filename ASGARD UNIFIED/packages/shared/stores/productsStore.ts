import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, PriceHistoryEntry } from '@shared/types/product';

export type { Product };




// Initial data - Start empty for a fresh OS
const initialProducts: Product[] = [];

interface ProductsState {
    products: Product[];

    // Actions
    addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    toggleFavorite: (id: string) => void;
    updateStock: (id: string, quantity: number, type: 'add' | 'remove' | 'set') => void;

    // Getters
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
    persist(
        (set, get) => ({
            products: initialProducts,

            // Add a new product
            addProduct: (productData) => {
                const newProduct: Product = {
                    ...productData,
                    id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                set((state) => ({
                    products: [...state.products, newProduct],
                }));

                return newProduct;
            },

            // Update an existing product
            updateProduct: (id, updates) => {
                set((state) => ({
                    products: state.products.map((p) =>
                        p.id === id
                            ? { ...p, ...updates, updatedAt: new Date() }
                            : p
                    ),
                }));
            },

            // Delete a product
            deleteProduct: (id) => {
                set((state) => ({
                    products: state.products.filter((p) => p.id !== id),
                }));
            },

            // Toggle favorite status
            toggleFavorite: (id) => {
                set((state) => ({
                    products: state.products.map((p) =>
                        p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
                    ),
                }));
            },

            // Update stock quantity
            updateStock: (id, quantity, type) => {
                set((state) => ({
                    products: state.products.map((p) => {
                        if (p.id !== id) return p;

                        let newStock: number;
                        switch (type) {
                            case 'add':
                                newStock = p.stock + quantity;
                                break;
                            case 'remove':
                                newStock = Math.max(0, p.stock - quantity);
                                break;
                            case 'set':
                                newStock = quantity;
                                break;
                            default:
                                newStock = p.stock;
                        }

                        return { ...p, stock: newStock, updatedAt: new Date() };
                    }),
                }));
            },

            // Get product by ID
            getProductById: (id) => {
                return get().products.find((p) => p.id === id);
            },

            // Get product by barcode
            getProductByBarcode: (barcode) => {
                return get().products.find((p) => p.barcode === barcode);
            },

            // Get product by SKU
            getProductsBySKU: (sku) => {
                return get().products.find((p) => p.sku === sku);
            },

            // Get low stock products
            getLowStockProducts: () => {
                return get().products.filter(
                    (p) => p.stock > 0 && p.stock <= p.minStock
                );
            },

            // Get out of stock products
            getOutOfStockProducts: () => {
                return get().products.filter((p) => p.stock === 0);
            },

            // Get favorite products
            getFavoriteProducts: () => {
                return get().products.filter((p) => p.isFavorite);
            },

            // Get products by category
            getProductsByCategory: (category) => {
                if (category === 'Toutes' || category === 'all') {
                    return get().products;
                }
                return get().products.filter((p) => p.category === category);
            },

            // Get all SKUs (for validation)
            getAllSKUs: () => {
                return get().products.map((p) => p.sku);
            },
        }),
        {
            name: 'products-storage',
            partialize: (state) => ({ products: state.products }),
        }
    )
);

export default useProductsStore;

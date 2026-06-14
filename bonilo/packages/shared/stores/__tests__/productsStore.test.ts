import { describe, it, expect, beforeEach, vi } from 'vitest';

// Hoisted so the vi.mock factory can reference it. Mimics the Rust
// `adjust_stock` command (return value is unused by the store, which keeps an
// optimistic in-memory stock).
const { invokeMock } = vi.hoisted(() => ({
    invokeMock: vi.fn(async () => ({ newStock: 0, qtyChange: 0, movementId: 'mv_1' })),
}));

vi.mock('@tauri-apps/api/core', () => ({ invoke: invokeMock }));

// Mock the db module before importing the store
vi.mock('../../db', () => ({
    productsRepo: {
        loadAll: vi.fn().mockResolvedValue([]),
        create: vi.fn().mockResolvedValue(undefined),
        update: vi.fn().mockResolvedValue(undefined),
        softDelete: vi.fn().mockResolvedValue(undefined),
        updateStock: vi.fn().mockResolvedValue(undefined),
    },
}));

import { useProductsStore } from '../productsStore';
import { productsRepo } from '../../db';

const mockProduct = {
    name: 'CANDIA Lait UHT 1L',
    designation: 'Lait UHT Demi-Écrémé',
    barcode: '6141234567890',
    sku: 'PRD-000001',
    emoji: '🥛',
    brand: 'CANDIA',
    nature: 'Lait',
    variety: 'Demi-Écrémé',
    shortName: 'CANDIA Lait 1L',
    category: 'dairy',
    categoryId: '',
    subcategoryId: '',
    purchasePrice: 90,
    sellingPrice: 120,
    buyPrice: 90,
    sellPrice: 120,
    stock: 50,
    minStock: 10,
    unit: 'unit',
    quantity: 1,
    volume: 1,
    volumeUnit: 'L',
    vatRate: 0.19,
    isActive: true,
    isFavorite: false,
    isLocalProduct: false,
    isPerishable: true,
    shelfLifeDays: 180,
    supplierId: '',
    imageUrl: '',
    nameAr: '',
};

describe('ProductsStore', () => {
    beforeEach(() => {
        // Reset store state
        useProductsStore.setState({
            products: [],
            isLoading: false,
            isHydrated: false,
        });
        vi.clearAllMocks();
    });

    it('should start with empty products', () => {
        const { products } = useProductsStore.getState();
        expect(products).toEqual([]);
    });

    it('should hydrate from database', async () => {
        const dbProducts = [{ ...mockProduct, id: 'prod_1', createdAt: '2024-01-01', updatedAt: '2024-01-01' }];
        (productsRepo.loadAll as any).mockResolvedValueOnce(dbProducts);

        await useProductsStore.getState().hydrate();

        const state = useProductsStore.getState();
        expect(state.isHydrated).toBe(true);
        expect(state.products).toHaveLength(1);
        expect(state.products[0].name).toBe('CANDIA Lait UHT 1L');
        expect(productsRepo.loadAll).toHaveBeenCalledOnce();
    });

    it('should not hydrate twice', async () => {
        (productsRepo.loadAll as any).mockResolvedValueOnce([]);

        await useProductsStore.getState().hydrate();
        await useProductsStore.getState().hydrate();

        expect(productsRepo.loadAll).toHaveBeenCalledOnce();
    });

    it('should add a product to DB and memory', async () => {
        const newProduct = await useProductsStore.getState().addProduct(mockProduct);

        expect(newProduct.id).toBeDefined();
        expect(newProduct.name).toBe('CANDIA Lait UHT 1L');
        expect(newProduct.createdAt).toBeDefined();
        expect(productsRepo.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'CANDIA Lait UHT 1L' }));
        expect(useProductsStore.getState().products).toHaveLength(1);
    });

    it('should update a product in DB and memory', async () => {
        // Add a product first
        const product = await useProductsStore.getState().addProduct(mockProduct);

        // Update it
        await useProductsStore.getState().updateProduct(product.id, { sellingPrice: 130 });

        expect(productsRepo.update).toHaveBeenCalledWith(product.id, { sellingPrice: 130 });
        const updated = useProductsStore.getState().getProductById(product.id);
        expect(updated?.sellingPrice).toBe(130);
    });

    it('should soft-delete a product', async () => {
        const product = await useProductsStore.getState().addProduct(mockProduct);
        expect(useProductsStore.getState().products).toHaveLength(1);

        await useProductsStore.getState().deleteProduct(product.id);

        expect(productsRepo.softDelete).toHaveBeenCalledWith(product.id);
        expect(useProductsStore.getState().products).toHaveLength(0);
    });

    it('should toggle favorite', async () => {
        const product = await useProductsStore.getState().addProduct(mockProduct);
        expect(product.isFavorite).toBe(false);

        await useProductsStore.getState().toggleFavorite(product.id);

        const updated = useProductsStore.getState().getProductById(product.id);
        expect(updated?.isFavorite).toBe(true);
        expect(productsRepo.update).toHaveBeenCalledWith(product.id, { isFavorite: true });
    });

    it('should update stock with add operation', async () => {
        const product = await useProductsStore.getState().addProduct(mockProduct);

        await useProductsStore.getState().updateStock(product.id, 20, 'add');

        const updated = useProductsStore.getState().getProductById(product.id);
        expect(updated?.stock).toBe(70); // 50 + 20
        expect(invokeMock).toHaveBeenCalledWith(
            'adjust_stock',
            expect.objectContaining({
                input: expect.objectContaining({ productId: product.id, quantity: 20, type: 'add' }),
            })
        );
    });

    it('should update stock with remove operation', async () => {
        const product = await useProductsStore.getState().addProduct(mockProduct);

        await useProductsStore.getState().updateStock(product.id, 5, 'remove');

        const updated = useProductsStore.getState().getProductById(product.id);
        expect(updated?.stock).toBe(45); // 50 - 5
    });

    it('should not go below zero stock', async () => {
        const product = await useProductsStore.getState().addProduct(mockProduct);

        await useProductsStore.getState().updateStock(product.id, 100, 'remove');

        const updated = useProductsStore.getState().getProductById(product.id);
        expect(updated?.stock).toBe(0);
    });

    it('should find product by barcode', async () => {
        await useProductsStore.getState().addProduct(mockProduct);

        const found = useProductsStore.getState().getProductByBarcode('6141234567890');
        expect(found?.name).toBe('CANDIA Lait UHT 1L');
    });

    it('should return low stock products', async () => {
        await useProductsStore.getState().addProduct({ ...mockProduct, stock: 5, minStock: 10 });
        await useProductsStore.getState().addProduct({ ...mockProduct, name: 'Other', barcode: '999', stock: 50, minStock: 10 });

        const lowStock = useProductsStore.getState().getLowStockProducts();
        expect(lowStock).toHaveLength(1);
        expect(lowStock[0].stock).toBe(5);
    });

    it('should return out of stock products', async () => {
        await useProductsStore.getState().addProduct({ ...mockProduct, stock: 0 });

        const outOfStock = useProductsStore.getState().getOutOfStockProducts();
        expect(outOfStock).toHaveLength(1);
    });

    it('should filter by category', async () => {
        await useProductsStore.getState().addProduct({ ...mockProduct, category: 'dairy' });
        await useProductsStore.getState().addProduct({ ...mockProduct, name: 'Coca', barcode: '222', category: 'beverages' });

        const dairy = useProductsStore.getState().getProductsByCategory('dairy');
        expect(dairy).toHaveLength(1);

        const all = useProductsStore.getState().getProductsByCategory('all');
        expect(all).toHaveLength(2);
    });
});

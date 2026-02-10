/**
 * Products Repository
 */
import { db } from './database';
import { Product } from '../types/product';

interface ProductRow {
    id: string;
    barcode: string | null;
    sku: string | null;
    name: string;
    designation: string;
    emoji: string;
    brand: string;
    nature: string;
    variety: string;
    short_name: string;
    category: string;
    category_id: string;
    subcategory_id: string;
    purchase_price: number;
    selling_price: number;
    stock: number;
    min_stock: number;
    unit: string;
    quantity: number;
    volume: number;
    volume_unit: string;
    tax_rate: number;
    is_active: number;
    is_favorite: number;
    is_local_product: number;
    is_perishable: number;
    shelf_life_days: number | null;
    units_per_carton: number | null;
    units_per_selling_pack: number | null;
    selling_pack_price: number | null;
    supplier_id: string;
    image_url: string;
    name_ar: string;
    created_at: string;
    updated_at: string;
}

function rowToProduct(row: ProductRow): Product {
    return {
        id: row.id,
        barcode: row.barcode || '',
        sku: row.sku || '',
        name: row.name,
        designation: row.designation,
        emoji: row.emoji,
        brand: row.brand,
        nature: row.nature,
        variety: row.variety,
        shortName: row.short_name,
        category: row.category,
        categoryId: row.category_id,
        subcategoryId: row.subcategory_id,
        purchasePrice: row.purchase_price,
        sellingPrice: row.selling_price,
        buyPrice: row.purchase_price,
        sellPrice: row.selling_price,
        stock: row.stock,
        minStock: row.min_stock,
        unit: row.unit,
        quantity: row.quantity,
        volume: row.volume,
        volumeUnit: row.volume_unit,
        vatRate: row.tax_rate,
        isActive: row.is_active === 1,
        isFavorite: row.is_favorite === 1,
        isLocalProduct: row.is_local_product === 1,
        isPerishable: row.is_perishable === 1,
        shelfLifeDays: row.shelf_life_days ?? undefined,
        unitsPerCarton: row.units_per_carton ?? undefined,
        unitsPerSellingPack: row.units_per_selling_pack ?? undefined,
        sellingPackPrice: row.selling_pack_price ?? undefined,
        supplierId: row.supplier_id,
        imageUrl: row.image_url,
        nameAr: row.name_ar,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

function productToRow(product: Partial<Product> & { id: string }): Record<string, any> {
    const row: Record<string, any> = { id: product.id };
    if (product.barcode !== undefined) row.barcode = product.barcode;
    if (product.sku !== undefined) row.sku = product.sku;
    if (product.name !== undefined) row.name = product.name;
    if (product.designation !== undefined) row.designation = product.designation;
    if (product.emoji !== undefined) row.emoji = product.emoji;
    if (product.brand !== undefined) row.brand = product.brand;
    if (product.nature !== undefined) row.nature = product.nature;
    if (product.variety !== undefined) row.variety = product.variety;
    if (product.shortName !== undefined) row.short_name = product.shortName;
    if (product.category !== undefined) row.category = product.category;
    if (product.categoryId !== undefined) row.category_id = product.categoryId;
    if (product.subcategoryId !== undefined) row.subcategory_id = product.subcategoryId;
    if (product.purchasePrice !== undefined) row.purchase_price = product.purchasePrice;
    if (product.sellingPrice !== undefined) row.selling_price = product.sellingPrice;
    if (product.stock !== undefined) row.stock = product.stock;
    if (product.minStock !== undefined) row.min_stock = product.minStock;
    if (product.unit !== undefined) row.unit = product.unit;
    if (product.quantity !== undefined) row.quantity = product.quantity;
    if (product.volume !== undefined) row.volume = product.volume;
    if (product.volumeUnit !== undefined) row.volume_unit = product.volumeUnit;
    if (product.vatRate !== undefined) row.tax_rate = product.vatRate;
    if (product.isActive !== undefined) row.is_active = product.isActive ? 1 : 0;
    if (product.isFavorite !== undefined) row.is_favorite = product.isFavorite ? 1 : 0;
    if (product.isLocalProduct !== undefined) row.is_local_product = product.isLocalProduct ? 1 : 0;
    if (product.isPerishable !== undefined) row.is_perishable = product.isPerishable ? 1 : 0;
    if (product.shelfLifeDays !== undefined) row.shelf_life_days = product.shelfLifeDays;
    if (product.unitsPerCarton !== undefined) row.units_per_carton = product.unitsPerCarton;
    if (product.unitsPerSellingPack !== undefined) row.units_per_selling_pack = product.unitsPerSellingPack;
    if (product.sellingPackPrice !== undefined) row.selling_pack_price = product.sellingPackPrice;
    if (product.supplierId !== undefined) row.supplier_id = product.supplierId;
    if (product.imageUrl !== undefined) row.image_url = product.imageUrl;
    if (product.nameAr !== undefined) row.name_ar = product.nameAr;
    row.updated_at = new Date().toISOString();
    return row;
}

export const productsRepo = {
    async loadAll(): Promise<Product[]> {
        const rows = await db.select<ProductRow>('SELECT * FROM products WHERE is_active = 1 ORDER BY name ASC');
        return rows.map(rowToProduct);
    },
    async create(product: Product): Promise<void> {
        const row = productToRow(product);
        row.created_at = new Date().toISOString();
        await db.insert('products', row);
    },
    async update(id: string, updates: Partial<Product>): Promise<void> {
        const row = productToRow({ id, ...updates });
        delete row.id;
        await db.update('products', id, row);
    },
    async softDelete(id: string): Promise<void> {
        await db.execute('UPDATE products SET is_active = 0, updated_at = $1 WHERE id = $2', [new Date().toISOString(), id]);
    },
    async updateStock(productId: string, newStock: number, qtyChange: number, type: string, referenceId?: string): Promise<void> {
        const movementId = `mov_${Date.now()}`;
        await db.transaction([
            { query: 'UPDATE products SET stock = $1, updated_at = $2 WHERE id = $3', params: [newStock, new Date().toISOString(), productId] },
            { query: 'INSERT INTO inventory_movements (id, product_id, type, qty_change, stock_after, reference_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)', params: [movementId, productId, type, qtyChange, newStock, referenceId || '', new Date().toISOString()] }
        ]);
    }
};

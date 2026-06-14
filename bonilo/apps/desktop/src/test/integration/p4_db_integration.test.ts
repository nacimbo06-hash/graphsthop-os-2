import { describe, it, expect, beforeAll, vi } from 'vitest';

// Initialize mock window for Tauri detection
if (typeof window === 'undefined') {
    (global as any).window = {};
}
(global as any).window.__TAURI_INTERNALS__ = {};

// Mock the Tauri SQL plugin using better-sqlite3 in-memory
vi.mock('@tauri-apps/plugin-sql', async () => {
    const Database = (await import('better-sqlite3')).default;
    const db = new Database(':memory:');

    return {
        default: {
            load: async () => ({
                execute: async (sql: string, params: any[] = []) => {
                    const convertedSql = sql.replace(/\$\d+/g, '?');
                    const stmt = db.prepare(convertedSql);
                    const result = stmt.run(...params);
                    return { rowsAffected: result.changes, lastInsertId: Number(result.lastInsertRowid) };
                },
                select: async (sql: string, params: any[] = []) => {
                    const convertedSql = sql.replace(/\$\d+/g, '?');
                    const stmt = db.prepare(convertedSql);
                    return stmt.all(...params);
                }
            })
        }
    };
});

import { db } from '@shared/db/database';
import { productsRepo } from '@shared/db/productsRepo';

describe('P4 Integration: Core Workflow & DB Persistence', () => {
    beforeAll(async () => {
        await db.init();
    });

    it('should create a product in DB', async () => {
        await productsRepo.create({
            id: 'prod_1',
            barcode: '123456',
            sku: 'SKU-001',
            name: 'Test Product',
            category: 'grocery',
            purchasePrice: 100,
            sellingPrice: 150,
            stock: 50,
            minStock: 5,
            unit: 'unit',
            taxRate: 0.19,
            isActive: true,
        } as any);

        const products = await productsRepo.loadAll();
        expect(products.length).toBeGreaterThan(0);
        expect(products[0].name).toBe('Test Product');
        expect(products[0].stock).toBe(50);
    });

    it('should load all products', async () => {
        const products = await productsRepo.loadAll();
        expect(products).toHaveLength(1);
        expect(products[0].id).toBe('prod_1');
    });

    it('should update product stock via direct update', async () => {
        await productsRepo.update('prod_1', { stock: 45, sellingPrice: 160 });
        const products = await productsRepo.loadAll();
        const product = products.find(p => p.id === 'prod_1');
        expect(product).toBeDefined();
        expect(product!.stock).toBe(45);
        expect(product!.sellingPrice).toBe(160);
    });

    // The atomic sale path moved to the Rust `checkout_sale` command (M1.2) and
    // is covered by its Rust unit tests; the old salesRepo.recordSale path is gone.
});

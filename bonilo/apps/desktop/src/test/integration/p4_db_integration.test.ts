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
import { salesRepo } from '@shared/db/salesRepo';

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

    it('should record a sale atomically with stock decrement', async () => {
        // Create a cash session first (FK constraint)
        await db.execute(`INSERT INTO cash_sessions (id, cashier_id, cashier_name, opened_at, opening_amount, status) 
                         VALUES ('session_test', 'u1', 'Test', '${new Date().toISOString()}', 500, 'open')`);

        const sale = {
            id: crypto.randomUUID(),
            receiptNumber: 'REC-000001',
            items: [{
                id: 'item_1',
                productId: 'prod_1',
                productName: 'Test Product',
                quantity: 3,
                unitPrice: 150,
                total: 450,
                taxAmount: 0,
                discountPercent: 0,
            }],
            subtotal: 450,
            taxAmount: 0,
            discountAmount: 0,
            totalAmount: 450,
            paymentMethod: 'cash',
            cashierId: 'u1',
            cashierName: 'Test',
            status: 'completed',
            timestamp: new Date().toISOString(),
        };

        await salesRepo.recordSale(sale as any, { prod_1: 100 }, undefined, {
            sessionId: 'session_test',
            movementId: crypto.randomUUID(),
            createdBy: 'u1',
        });

        // Verify sale recorded
        const sales = await salesRepo.loadAll({ withItems: true });
        expect(sales.length).toBeGreaterThan(0);
        expect(sales[0].totalAmount).toBe(450);
        expect(sales[0].items).toHaveLength(1);

        // Verify stock was decremented (45 - 3 = 42)
        const products = await productsRepo.loadAll();
        const product = products.find(p => p.id === 'prod_1');
        expect(product!.stock).toBe(42);

        // Verify cash movement
        const movements = await db.select('SELECT * FROM cash_movements WHERE session_id = $1', ['session_test']);
        expect(movements.length).toBeGreaterThan(0);
        expect(movements[0].type).toBe('sale');
    });
});

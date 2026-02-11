import { describe, it, expect, beforeAll, vi } from 'vitest';

// initialize mock window (hoisted automatically if at top level, but explicit here for clarity)
if (typeof window === 'undefined') {
    (global as any).window = {};
}
(global as any).window.__TAURI_INTERNALS__ = {};

// Mock the Tauri SQL plugin using better-sqlite3 in-memory
vi.mock('@tauri-apps/plugin-sql', async () => {
    const Database = (await import('better-sqlite3')).default;
    // Singleton DB instance for this test file
    const db = new Database(':memory:');

    return {
        default: {
            load: async () => {
                console.log('[MockDB] creating connection');
                return {
                    execute: async (sql: string, params: any[] = []) => {
                        try {
                            // Convert $N to ? for better-sqlite3
                            // Note: This simple regex works because we don't have $ in string literals in these queries
                            const convertedSql = sql.replace(/\$\d+/g, '?');

                            const stmt = db.prepare(convertedSql);
                            const result = stmt.run(...params);
                            // console.log("SQL Exec:", convertedSql);
                            return { rowsAffected: result.changes, lastInsertId: Number(result.lastInsertRowid) };
                        } catch (e) {
                            console.error("SQL Execute Error", sql, e);
                            throw e;
                        }
                    },
                    select: async (sql: string, params: any[] = []) => {
                        try {
                            const convertedSql = sql.replace(/\$\d+/g, '?');
                            const stmt = db.prepare(convertedSql);
                            return stmt.all(...params);
                        } catch (e) {
                            console.error("SQL Select Error", sql, e);
                            throw e;
                        }
                    }
                };
            }
        }
    };
});

// Import the real code (which will use the mock above)
import { db } from '@shared/db/database';
// Use dynamic imports or ensure these files export what we need
import { customersRepo } from '@shared/db/customersRepo';
import { stockMovementsRepo } from '@shared/db/stockMovementsRepo';
import { productsRepo } from '@shared/db/productsRepo';
import { salesRepo } from '@shared/db/salesRepo';
import { purchasesRepo } from '@shared/db/purchasesRepo';

describe('P4 Integration: Core Workflow & DB Persistence', () => {

    beforeAll(async () => {
        // Trigger the DB init which calls load() and runs migrations
        try {
            await db.init();
        } catch (e) {
            console.error("DB Init Failed", e);
            throw e;
        }
    });

    it('should initialize database and have required tables', async () => {
        const tables = await db.select("SELECT name FROM sqlite_master WHERE type='table'");
        const tableNames = tables.map((t: any) => t.name);
        // Verify core tables
        expect(tableNames).toContain('products');
        expect(tableNames).toContain('sales');
        expect(tableNames).toContain('stock_movements');
        // Verify Migration 002 tables
        expect(tableNames).toContain('lots');
        expect(tableNames).toContain('sinking_funds');
    });

    describe('Products Repository', () => {
        it('should create a product', async () => {
            const product = {
                id: 'prod_1',
                name: 'Test Product',
                barcode: '123456',
                sellingPrice: 10.5,
                stock: 10,
                isActive: true, // productsRepo expects boolean for isActive
                // Fill required fields to match Product interface roughly (mocked)
                category: 'other',
                purchasePrice: 5,
                minStock: 5,
                unit: 'unit',
                vatRate: 0.19
            };

            // Cast to any to avoid strict type checking in this integration test file
            await (productsRepo as any).create(product);

            // Verify using direct DB query since findById is missing
            const rows = await db.select('SELECT * FROM products WHERE id = $1', ['prod_1']);
            expect(rows.length).toBe(1);
            expect(rows[0].name).toBe('Test Product');
            expect(rows[0].stock).toBe(10);
        });
    });

    describe('Stock Movements', () => {
        it('should log a movement', async () => {
            await stockMovementsRepo.create({
                id: 'mov_1',
                productId: 'prod_1',
                productName: 'Test Product',
                productEmoji: '',
                type: 'out',
                quantity: 2,
                previousStock: 10,
                newStock: 8,
                reason: 'Sale',
                date: new Date().toISOString(),
                performedBy: 'user'
            });

            const all = await stockMovementsRepo.loadAll();
            expect(all.length).toBeGreaterThan(0);
            expect(all[0].quantity).toBe(2);
        });
    });

    describe('Sales Repository', () => {
        it('should create a sale', async () => {
            const sale = {
                id: 'sale_1',
                receiptNumber: 'R-1',
                subtotal: 21,
                taxAmount: 0,
                discountAmount: 0,
                totalAmount: 21,
                paymentMethod: 'cash',
                cashierId: 'c1',
                cashierName: 'Cashier',
                status: 'completed',
                createdAt: new Date().toISOString(),
                items: [
                    {
                        id: 'si_1',
                        productId: 'prod_1',
                        productName: 'Test Product',
                        quantity: 2,
                        unitPrice: 10.5,
                        total: 21
                    }
                ]
            };

            // Use recordSale instead of create
            await salesRepo.recordSale(sale as any, { 'prod_1': 5 });

            // Use direct DB query to verify if findById is missing or use loadAll
            const fetchedList = await salesRepo.loadAll({ withItems: true });
            const fetched = fetchedList.find(s => s.id === 'sale_1');

            expect(fetched).toBeDefined();
            expect(fetched?.totalAmount).toBe(21);
            expect(fetched?.items).toHaveLength(1);
        });
    });
});

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
import { salesRepo } from '@shared/db/salesRepo';

describe('salesRepo.loadAll (grouped item fetch, no N+1)', () => {
    beforeAll(async () => {
        await db.init();

        // Two sales with differing numbers of line items.
        await db.execute(`INSERT INTO sales (id, receipt_number, total_amount, created_at) VALUES ('sale_a', 'REC-A', 300, '2026-06-15T09:00:00Z')`);
        await db.execute(`INSERT INTO sales (id, receipt_number, total_amount, created_at) VALUES ('sale_b', 'REC-B', 80, '2026-06-15T10:00:00Z')`);

        const item = (id: string, saleId: string, name: string, qty: number, price: number) =>
            db.execute(
                `INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, total) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [id, saleId, 'p1', name, qty, price, qty * price]
            );

        await item('i1', 'sale_a', 'Lait', 2, 100);
        await item('i2', 'sale_a', 'Pain', 1, 100);
        await item('i3', 'sale_b', 'Eau', 1, 80);
    });

    it('returns each sale with exactly its own items', async () => {
        const sales = await salesRepo.loadAll({ withItems: true });

        const a = sales.find(s => s.id === 'sale_a');
        const b = sales.find(s => s.id === 'sale_b');

        expect(a?.items).toHaveLength(2);
        expect(b?.items).toHaveLength(1);
        // Items are grouped under the right sale.
        expect(a?.items.map(i => i.productName).sort()).toEqual(['Lait', 'Pain']);
        expect(b?.items[0].productName).toBe('Eau');
    });

    it('omits items when withItems is not requested', async () => {
        const sales = await salesRepo.loadAll();
        expect(sales.every(s => s.items.length === 0)).toBe(true);
    });
});

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
import { useCashSessionStore } from '@shared/stores';

describe('getSessionTotals (Z-report SQL aggregate)', () => {
    beforeAll(async () => {
        await db.init();

        await db.execute(
            `INSERT INTO cash_sessions (id, cashier_id, cashier_name, opened_at, opening_amount, status)
             VALUES ('sess1', 'u1', 'Test', '2026-06-15T08:00:00Z', 1000, 'open')`
        );

        const mv = (id: string, type: string, amount: number, pm = '') =>
            db.execute(
                `INSERT INTO cash_movements (id, session_id, type, amount, payment_method, created_at)
                 VALUES ($1, 'sess1', $2, $3, $4, '2026-06-15T09:00:00Z')`,
                [id, type, amount, pm]
            );

        await mv('m1', 'sale', 1000, 'cash');
        await mv('m2', 'sale', 500, 'card');
        await mv('m3', 'sale', 200, ''); // empty payment method counts as cash
        await mv('m4', 'expense', 300);
        await mv('m5', 'deposit', 2000);
        await mv('m6', 'transfer_to_safe', 400);
    });

    it('aggregates a session straight from SQL', async () => {
        const t = await useCashSessionStore.getState().getSessionTotals('sess1');

        expect(t.totalSales).toBe(1700);
        expect(t.salesCount).toBe(3);
        expect(t.cashSales).toBe(1200); // 1000 + 200 (empty pm)
        expect(t.cardSales).toBe(500);
        expect(t.expenses).toBe(300);
        expect(t.expensesCount).toBe(1);
        expect(t.deposits).toBe(2000);
        expect(t.transfersToSafe).toBe(400);
    });

    it('returns zeroed totals for an unknown session', async () => {
        const t = await useCashSessionStore.getState().getSessionTotals('nope');
        expect(t.totalSales).toBe(0);
        expect(t.salesCount).toBe(0);
    });
});

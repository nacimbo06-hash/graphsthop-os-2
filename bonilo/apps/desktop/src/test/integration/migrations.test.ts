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

describe('Migrations (runner + 004 constraints)', () => {
    beforeAll(async () => {
        await db.init();
    });

    it('runs all migrations and lands at the latest user_version', async () => {
        const rows = await db.select<{ user_version: number }>('PRAGMA user_version;');
        // 005 is the highest migration; the runner sets the version atomically.
        expect(rows[0].user_version).toBe(5);
    });

    it('enforces the UNIQUE index on sales.receipt_number (survives the 005 rebuild)', async () => {
        await db.execute(`INSERT INTO sales (id, receipt_number, total_amount) VALUES ('s1', 'REC-000001', 100)`);

        // A second sale reusing the receipt number must be rejected.
        await expect(
            db.execute(`INSERT INTO sales (id, receipt_number, total_amount) VALUES ('s2', 'REC-000001', 50)`)
        ).rejects.toThrow();

        // A distinct number is fine.
        await db.execute(`INSERT INTO sales (id, receipt_number, total_amount) VALUES ('s3', 'REC-000002', 50)`);
        const rows = await db.select<{ n: number }>(`SELECT COUNT(*) AS n FROM sales`);
        expect(rows[0].n).toBe(2);
    });

    it('rejects negative money amounts via the 005 CHECK guards', async () => {
        await expect(
            db.execute(`INSERT INTO sales (id, receipt_number, total_amount) VALUES ('neg1', 'REC-NEG-1', -10)`)
        ).rejects.toThrow();

        await expect(
            db.execute(`INSERT INTO expenses (id, category, amount) VALUES ('e_neg', 'Achats', -5)`)
        ).rejects.toThrow();

        // A valid expense still inserts.
        await db.execute(`INSERT INTO expenses (id, category, amount) VALUES ('e_ok', 'Achats', 250)`);
        const rows = await db.select<{ n: number }>(`SELECT COUNT(*) AS n FROM expenses WHERE id = 'e_ok'`);
        expect(rows[0].n).toBe(1);
    });
});

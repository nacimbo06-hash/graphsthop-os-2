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
        // 004 is the highest migration; the runner sets the version atomically.
        expect(rows[0].user_version).toBe(4);
    });

    it('enforces the UNIQUE index on sales.receipt_number', async () => {
        await db.execute(`INSERT INTO sales (id, receipt_number) VALUES ('s1', 'REC-000001')`);

        // A second sale reusing the receipt number must be rejected.
        await expect(
            db.execute(`INSERT INTO sales (id, receipt_number) VALUES ('s2', 'REC-000001')`)
        ).rejects.toThrow();

        // A distinct number is fine.
        await db.execute(`INSERT INTO sales (id, receipt_number) VALUES ('s3', 'REC-000002')`);
        const rows = await db.select<{ n: number }>(`SELECT COUNT(*) AS n FROM sales`);
        expect(rows[0].n).toBe(2);
    });
});

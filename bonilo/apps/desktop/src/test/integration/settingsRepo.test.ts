import { describe, it, expect, beforeAll, vi } from 'vitest';

if (typeof window === 'undefined') {
    (global as any).window = {};
}
(global as any).window.__TAURI_INTERNALS__ = {};

vi.mock('@tauri-apps/plugin-sql', async () => {
    const Database = (await import('better-sqlite3')).default;
    const db = new Database(':memory:');
    return {
        default: {
            load: async () => ({
                execute: async (sql: string, params: any[] = []) => {
                    const convertedSql = sql.replace(/\$\d+/g, '?');
                    return db.prepare(convertedSql).run(...params);
                },
                select: async (sql: string, params: any[] = []) => {
                    const convertedSql = sql.replace(/\$\d+/g, '?');
                    return db.prepare(convertedSql).all(...params);
                }
            })
        }
    };
});

import { db } from '@shared/db/database';
import { settingsRepo } from '@shared/db/settingsRepo';

describe('settingsRepo', () => {
    beforeAll(async () => {
        await db.init();
    });

    it('returns null when the table is empty', async () => {
        expect(await settingsRepo.load()).toBeNull();
    });

    it('saves and loads an object round-trip', async () => {
        await settingsRepo.save({ store: { name: 'BoniloTest', currency: 'DZD' } });
        const result = await settingsRepo.load<{ store: { name: string; currency: string } }>();
        expect(result?.store.name).toBe('BoniloTest');
        expect(result?.store.currency).toBe('DZD');
    });

    it('overwrites on repeated save (upsert)', async () => {
        await settingsRepo.save({ store: { name: 'Updated' } });
        const result = await settingsRepo.load<{ store: { name: string } }>();
        expect(result?.store.name).toBe('Updated');

        // Still only one row
        const rows = await db.select<{ n: number }>(`SELECT COUNT(*) AS n FROM settings WHERE key = 'app_settings'`);
        expect(rows[0].n).toBe(1);
    });
});

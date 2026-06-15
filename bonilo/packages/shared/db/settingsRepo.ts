/**
 * Settings Repository
 *
 * Stores all app settings as a single JSON blob under the key 'app_settings'
 * in the SQLite `settings` table. The table has been there since migration 001
 * but was never written to; this makes it the source of truth under Tauri.
 * localStorage remains the browser-dev fallback.
 */
import { db } from './database';

const SETTINGS_KEY = 'app_settings';

interface SettingsRow {
    key: string;
    value: string;
    updated_at: string;
}

export const settingsRepo = {
    async load<T>(): Promise<T | null> {
        const rows = await db.select<SettingsRow>(
            'SELECT value FROM settings WHERE key = $1',
            [SETTINGS_KEY]
        );
        if (!rows[0]) return null;
        try {
            return JSON.parse(rows[0].value) as T;
        } catch {
            return null;
        }
    },

    async save<T>(value: T): Promise<void> {
        const json = JSON.stringify(value);
        const now = new Date().toISOString();
        await db.execute(
            `INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, $3)
             ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
            [SETTINGS_KEY, json, now]
        );
    },
};

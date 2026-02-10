import { PGlite } from '@electric-sql/pglite';

// Whitelist of allowed table names
const ALLOWED_TABLES = [
    'products', 'sales', 'customers', 'suppliers',
    'goods_receipts', 'purchase_orders', 'inventory_movements',
    'treasury_movements', 'expenses', 'safe_transactions',
    'sinking_funds', 'users', 'settings', 'store_settings',
    'outbox' // Added for the Roadmap's Outbox Pattern
] as const;

export class DBService {
    private db: PGlite | null = null;
    private dbName: string = 'igo-desktop.db';

    async init() {
        if (this.db) return this.db;
        
        // Roadmap 2026: Using PGlite for "Postgres in WASM" local-first architecture
        this.db = new PGlite(`idb://${this.dbName}`);
        await this.setupTables();
        return this.db;
    }

    private async setupTables() {
        if (!this.db) return;

        // Base schema for local tables
        for (const table of ALLOWED_TABLES) {
            await this.db.exec(`
                CREATE TABLE IF NOT EXISTS ${table} (
                    id TEXT PRIMARY KEY,
                    data JSONB NOT NULL,
                    updated_at BIGINT NOT NULL,
                    deleted BOOLEAN DEFAULT FALSE
                )
            `);
        }

        // Outbox specific table for Roadmap's sync strategy
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS outbox (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                action_type TEXT NOT NULL,
                payload JSONB NOT NULL,
                timestamp BIGINT NOT NULL,
                synced BOOLEAN DEFAULT FALSE
            )
        `);
    }

    async upsert(table: string, items: any[], trackInOutbox = true) {
        if (!this.db) await this.init();
        if (!ALLOWED_TABLES.includes(table as any)) {
            throw new Error(`Invalid table name: ${table}`);
        }

        const timestamp = Date.now();
        
        for (const item of items) {
            await this.db!.query(
                `INSERT INTO ${table} (id, data, updated_at, deleted) 
                 VALUES ($1, $2, $3, FALSE) 
                 ON CONFLICT(id) DO UPDATE SET 
                 data = EXCLUDED.data, 
                 updated_at = EXCLUDED.updated_at, 
                 deleted = FALSE`,
                [item.id, JSON.stringify(item), timestamp]
            );

            if (trackInOutbox && table !== 'outbox') {
                await this.addToOutbox('upsert', { table, item });
            }
        }
    }

    async get(table: string, since: number = 0) {
        if (!this.db) await this.init();
        if (!ALLOWED_TABLES.includes(table as any)) {
            throw new Error(`Invalid table name: ${table}`);
        }

        const result = await this.db!.query(
            `SELECT data FROM ${table} WHERE updated_at > $1 AND deleted = FALSE`,
            [since]
        );
        return result.rows.map((r: any) => r.data);
    }

    async delete(table: string, id: string) {
        if (!this.db) await this.init();
        if (!ALLOWED_TABLES.includes(table as any)) {
            throw new Error(`Invalid table name: ${table}`);
        }

        const timestamp = Date.now();
        await this.db!.query(
            `UPDATE ${table} SET deleted = TRUE, updated_at = $1 WHERE id = $2`,
            [timestamp, id]
        );

        await this.addToOutbox('delete', { table, id });
    }

    // Roadmap 2026: Outbox Pattern implementation
    private async addToOutbox(actionType: string, payload: any) {
        if (!this.db) return;
        await this.db.query(
            `INSERT INTO outbox (action_type, payload, timestamp) 
             VALUES ($1, $2, $3)`,
            [actionType, JSON.stringify(payload), Date.now()]
        );
    }

    async getUnsyncedOutbox() {
        if (!this.db) await this.init();
        const result = await this.db!.query(
            `SELECT * FROM outbox WHERE synced = FALSE ORDER BY timestamp ASC`
        );
        return result.rows;
    }

    async markSynced(id: string) {
        if (!this.db) await this.init();
        await this.db!.query(
            `UPDATE outbox SET synced = TRUE WHERE id = $1`,
            [id]
        );
    }
}

export const dbService = new DBService();

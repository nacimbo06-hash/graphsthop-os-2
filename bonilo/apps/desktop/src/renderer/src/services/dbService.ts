import Database from '@tauri-apps/plugin-sql';

// Security: Whitelist of allowed collection names to prevent SQL injection
const ALLOWED_COLLECTIONS = [
    'products', 'sales', 'customers', 'suppliers',
    'goods_receipts', 'purchase_orders', 'inventory_movements',
    'treasury_movements', 'expenses', 'safe_transactions',
    'sinking_funds', 'users', 'settings', 'store_settings'
] as const;

export class DBService {
    private db: any = null;
    private dbName: string = 'igo-desktop.db';

    async init() {
        if (this.db) return this.db;
        this.db = await Database.load(`sqlite:${this.dbName}`);
        await this.setupTables();
        return this.db;
    }

    private async setupTables() {
        for (const collection of ALLOWED_COLLECTIONS) {
            await this.db.execute(`
                CREATE TABLE IF NOT EXISTS ${collection} (
                    id TEXT PRIMARY KEY,
                    data TEXT NOT NULL,
                    updated_at INTEGER NOT NULL,
                    deleted INTEGER DEFAULT 0
                )
            `);
        }
    }

    async upsert(collection: string, items: any[]) {
        // Security: Validate collection name against whitelist
        if (!ALLOWED_COLLECTIONS.includes(collection as typeof ALLOWED_COLLECTIONS[number])) {
            throw new Error(`Invalid collection name: ${collection}`);
        }

        const timestamp = Date.now();
        for (const item of items) {
            await this.db.execute(
                `INSERT INTO ${collection} (id, data, updated_at, deleted) 
                 VALUES ($1, $2, $3, 0) 
                 ON CONFLICT(id) DO UPDATE SET 
                 data = excluded.data, 
                 updated_at = excluded.updated_at, 
                 deleted = 0`,
                [item.id, JSON.stringify(item), timestamp]
            );
        }
    }

    async get(collection: string, since: number = 0) {
        // Security: Validate collection name against whitelist
        if (!ALLOWED_COLLECTIONS.includes(collection as typeof ALLOWED_COLLECTIONS[number])) {
            throw new Error(`Invalid collection name: ${collection}`);
        }

        const rows = await this.db.select(
            `SELECT data FROM ${collection} WHERE updated_at > $1 AND deleted = 0`,
            [since]
        );
        return rows.map((r: any) => JSON.parse(r.data));
    }

    async delete(collection: string, id: string) {
        // Security: Validate collection name against whitelist
        if (!ALLOWED_COLLECTIONS.includes(collection as typeof ALLOWED_COLLECTIONS[number])) {
            throw new Error(`Invalid collection name: ${collection}`);
        }

        const timestamp = Date.now();
        await this.db.execute(
            `UPDATE ${collection} SET deleted = 1, updated_at = $1 WHERE id = $2`,
            [timestamp, id]
        );
    }
}

export const dbService = new DBService();

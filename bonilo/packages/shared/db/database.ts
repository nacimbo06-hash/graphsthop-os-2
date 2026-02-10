/**
 * Bonilo Database Service
 * 
 * Real SQLite persistence layer using @tauri-apps/plugin-sql.
 * Replaces the old JSON-blob dbService.ts with:
 * - WAL mode for performance & crash safety
 * - Migration runner (PRAGMA user_version)
 * - Typed query helpers
 * - Transaction support
 */

// Dynamic import for Tauri database to support non-Tauri environments (browser/tests)
const getTauriDb = async () => {
    if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
        const { default: Database } = await import('@tauri-apps/plugin-sql');
        return Database;
    }
    return null;
};

// Import migration SQL as raw strings
const MIGRATION_001 = `
-- Enable WAL mode and foreign keys
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  barcode TEXT,
  sku TEXT,
  name TEXT NOT NULL,
  designation TEXT DEFAULT '',
  emoji TEXT DEFAULT '📦',
  brand TEXT DEFAULT '',
  nature TEXT DEFAULT '',
  variety TEXT DEFAULT '',
  short_name TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'other',
  category_id TEXT DEFAULT '',
  subcategory_id TEXT DEFAULT '',
  purchase_price REAL NOT NULL DEFAULT 0,
  selling_price REAL NOT NULL DEFAULT 0,
  stock REAL NOT NULL DEFAULT 0,
  min_stock REAL NOT NULL DEFAULT 5,
  unit TEXT NOT NULL DEFAULT 'unit',
  quantity REAL DEFAULT 0,
  volume REAL DEFAULT 0,
  volume_unit TEXT DEFAULT '',
  tax_rate REAL NOT NULL DEFAULT 0.19,
  is_active INTEGER NOT NULL DEFAULT 1,
  is_favorite INTEGER NOT NULL DEFAULT 0,
  is_local_product INTEGER NOT NULL DEFAULT 0,
  is_perishable INTEGER NOT NULL DEFAULT 0,
  shelf_life_days INTEGER DEFAULT NULL,
  units_per_carton INTEGER DEFAULT NULL,
  units_per_selling_pack INTEGER DEFAULT NULL,
  selling_pack_price REAL DEFAULT NULL,
  supplier_id TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  name_ar TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

CREATE TABLE IF NOT EXISTS sales (
  id TEXT PRIMARY KEY,
  receipt_number TEXT NOT NULL,
  subtotal REAL NOT NULL DEFAULT 0,
  tax_amount REAL NOT NULL DEFAULT 0,
  discount_amount REAL NOT NULL DEFAULT 0,
  total_amount REAL NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'cash',
  customer_id TEXT DEFAULT NULL,
  customer_name TEXT DEFAULT '',
  cashier_id TEXT NOT NULL DEFAULT '',
  cashier_name TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_cashier_id ON sales(cashier_id);
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales(status);

CREATE TABLE IF NOT EXISTS sale_items (
  id TEXT PRIMARY KEY,
  sale_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit_price REAL NOT NULL,
  total REAL NOT NULL,
  tax_amount REAL DEFAULT 0,
  discount_percent REAL DEFAULT 0,
  cost_at_sale REAL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(sale_id) REFERENCES sales(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product_id ON sale_items(product_id);

CREATE TABLE IF NOT EXISTS inventory_movements (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  type TEXT NOT NULL,
  qty_change REAL NOT NULL,
  stock_after REAL NOT NULL,
  reason TEXT DEFAULT '',
  reference_id TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(product_id) REFERENCES products(id)
);
CREATE INDEX IF NOT EXISTS idx_inv_movements_product ON inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_inv_movements_created ON inventory_movements(created_at);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address TEXT DEFAULT '',
  credit_limit REAL DEFAULT 0,
  current_balance REAL DEFAULT 0,
  total_purchases REAL DEFAULT 0,
  notes TEXT DEFAULT '',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);

CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact_name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address TEXT DEFAULT '',
  current_debt REAL DEFAULT 0,
  notes TEXT DEFAULT '',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cash_sessions (
  id TEXT PRIMARY KEY,
  cashier_id TEXT NOT NULL,
  cashier_name TEXT DEFAULT '',
  opening_amount REAL NOT NULL DEFAULT 0,
  closing_amount REAL DEFAULT NULL,
  expected_amount REAL DEFAULT NULL,
  difference REAL DEFAULT NULL,
  total_sales REAL DEFAULT 0,
  total_cash_sales REAL DEFAULT 0,
  total_card_sales REAL DEFAULT 0,
  transactions_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open',
  opened_at TEXT NOT NULL DEFAULT (datetime('now')),
  closed_at TEXT DEFAULT NULL,
  notes TEXT DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_cash_sessions_status ON cash_sessions(status);

CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  amount REAL NOT NULL,
  payment_method TEXT DEFAULT 'cash',
  reference TEXT DEFAULT '',
  created_by TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_expenses_created ON expenses(created_at);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  pin_hash TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'cashier',
  is_active INTEGER NOT NULL DEFAULT 1,
  last_login TEXT DEFAULT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

PRAGMA user_version = 1;
`;

// Ordered list of migrations
const MIGRATIONS = [
    { version: 1, sql: MIGRATION_001 },
];

class BoniloDatabase {
    private db: any = null;
    private initialized = false;

    async init(): Promise<any> {
        if (this.db && this.initialized) return this.db;

        try {
            const DatabasePlugin = await getTauriDb();
            if (!DatabasePlugin) {
                console.warn('[BoniloDB] ⚠️ Not in Tauri environment. Database operations will be mocked.');
                this.initialized = true;
                return null;
            }

            this.db = await DatabasePlugin.load('sqlite:bonilo.db');

            // Enable WAL mode and foreign keys
            await this.db.execute('PRAGMA journal_mode = WAL;');
            await this.db.execute('PRAGMA synchronous = NORMAL;');
            await this.db.execute('PRAGMA foreign_keys = ON;');

            await this.runMigrations();

            this.initialized = true;
            console.log('[BoniloDB] ✅ Database initialized successfully');
            return this.db;
        } catch (error) {
            console.error('[BoniloDB] ❌ Failed to initialize database:', error);
            throw error;
        }
    }

    private async runMigrations(): Promise<void> {
        if (!this.db) return;

        const result = await this.db.select<[{ user_version: number }]>('PRAGMA user_version;');
        const currentVersion = result[0]?.user_version ?? 0;

        for (const migration of MIGRATIONS) {
            if (migration.version > currentVersion) {
                const statements = migration.sql
                    .split(';')
                    .map(s => s.trim())
                    .filter(s => s.length > 0 && !s.startsWith('--'));

                for (const stmt of statements) {
                    await this.db.execute(stmt + ';');
                }
            }
        }
    }

    getDb(): any {
        return this.db;
    }

    async select<T = any>(query: string, params: any[] = []): Promise<T[]> {
        if (!this.db) return [];
        return this.db.select(query, params);
    }

    async execute(query: string, params: any[] = []): Promise<any> {
        if (!this.db) return { rowsAffected: 0, lastInsertId: 0 };
        return this.db.execute(query, params);
    }

    async transaction(operations: Array<{ query: string; params?: any[] }>): Promise<void> {
        if (!this.db) return;
        await this.db.execute('BEGIN TRANSACTION;');
        try {
            for (const op of operations) {
                await this.db.execute(op.query, op.params || []);
            }
            await this.db.execute('COMMIT;');
        } catch (error) {
            await this.db.execute('ROLLBACK;');
            throw error;
        }
    }

    async insert(table: string, data: Record<string, any>): Promise<string> {
        const keys = Object.keys(data);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const values = Object.values(data);
        const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
        await this.execute(query, values);
        return data.id as string;
    }

    async update(table: string, id: string, data: Record<string, any>): Promise<void> {
        const keys = Object.keys(data);
        const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
        const values = [...Object.values(data), id];
        const query = `UPDATE ${table} SET ${setClause} WHERE id = $${keys.length + 1}`;
        await this.execute(query, values);
    }
}

export const db = new BoniloDatabase();
export default db;

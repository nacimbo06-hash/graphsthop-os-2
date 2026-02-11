import Database from 'better-sqlite3';

export class TestDbAdapter {
    private db: Database.Database;

    constructor() {
        this.db = new Database(':memory:');
    }

    async execute(query: string, params: any[] = []): Promise<any> {
        // Better-sqlite3 prepares statements synchronously
        try {
            const stmt = this.db.prepare(query);
            const result = stmt.run(...params);
            return {
                rowsAffected: result.changes,
                lastInsertId: Number(result.lastInsertRowid),
            };
        } catch (error) {
            console.error('SQL Error:', error);
            throw error;
        }
    }

    async select<T>(query: string, params: any[] = []): Promise<T[]> {
        try {
            const stmt = this.db.prepare(query);
            const rows = stmt.all(...params);
            return rows as T[];
        } catch (error) {
            console.error('SQL Error:', error);
            throw error;
        }
    }

    // Helper to inspect DB state directly in tests
    rawDb() {
        return this.db;
    }
}

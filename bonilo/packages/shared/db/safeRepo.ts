/**
 * Safe Repository
 */
import { db } from './database';
import type { SafeTransaction } from '../types/treasury';

interface SafeTransactionRow {
    id: string;
    type: string;
    amount: number;
    reason: string;
    performed_by: string;
    created_at: string;
}

function rowToTransaction(row: SafeTransactionRow): SafeTransaction {
    return {
        id: row.id,
        type: row.type as 'deposit' | 'withdrawal',
        amount: row.amount,
        reason: row.reason || '',
        date: row.created_at,
        performedBy: row.performed_by || '',
    };
}

export const safeRepo = {
    async loadTransactions(): Promise<SafeTransaction[]> {
        const rows = await db.select<SafeTransactionRow>('SELECT * FROM safe_transactions ORDER BY created_at DESC');
        return rows.map(rowToTransaction);
    },

    async computeBalance(): Promise<number> {
        const rows = await db.select<{ balance: number }>(`
            SELECT COALESCE(SUM(CASE WHEN type = 'deposit' THEN amount ELSE -amount END), 0) as balance
            FROM safe_transactions
        `);
        return rows[0]?.balance ?? 0;
    },

    async addTransaction(tx: SafeTransaction): Promise<void> {
        await db.insert('safe_transactions', {
            id: tx.id,
            type: tx.type,
            amount: tx.amount,
            reason: tx.reason || '',
            performed_by: tx.performedBy || '',
            created_at: typeof tx.date === 'string' ? tx.date : tx.date instanceof Date ? (tx.date as Date).toISOString() : new Date().toISOString(),
        });
    },
};

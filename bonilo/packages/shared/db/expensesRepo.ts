/**
 * Expenses Repository
 */
import { db } from './database';
import type { Expense } from '../types/treasury';

interface ExpenseRow {
    id: string;
    category: string;
    description: string;
    amount: number;
    payment_method: string;
    reference: string;
    created_by: string;
    created_at: string;
}

function rowToExpense(row: ExpenseRow): Expense {
    return {
        id: row.id,
        description: row.description,
        amount: row.amount,
        category: row.category,
        date: row.created_at,
        paymentMethod: row.payment_method as Expense['paymentMethod'],
        reference: row.reference || undefined,
        isPaid: true, // Only paid expenses are in the DB expenses table
        paidFrom: (row.payment_method as any) || null,
        createdAt: row.created_at,
    };
}

export const expensesRepo = {
    async loadAll(): Promise<Expense[]> {
        const rows = await db.select<ExpenseRow>('SELECT * FROM expenses ORDER BY created_at DESC');
        return rows.map(rowToExpense);
    },

    async create(expense: Expense): Promise<void> {
        await db.insert('expenses', {
            id: expense.id,
            category: expense.category,
            description: expense.description || '',
            amount: expense.amount,
            payment_method: expense.paymentMethod || 'cash',
            reference: expense.reference || '',
            created_by: '',
            created_at: typeof expense.createdAt === 'string' ? expense.createdAt : expense.createdAt instanceof Date ? (expense.createdAt as Date).toISOString() : new Date().toISOString(),
        });
    },

    async update(id: string, updates: { isPaid?: boolean; paidFrom?: string | null; paymentMethod?: string }): Promise<void> {
        const row: Record<string, any> = {};
        if (updates.paymentMethod !== undefined) row.payment_method = updates.paymentMethod;
        if (Object.keys(row).length > 0) {
            await db.update('expenses', id, row);
        }
    },

    async remove(id: string): Promise<void> {
        await db.execute('DELETE FROM expenses WHERE id = $1', [id]);
    },
};

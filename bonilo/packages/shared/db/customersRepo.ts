/**
 * Customers Repository
 */
import { db } from './database';
import type { Customer, CreditTransaction } from '../stores/customersStore';

interface CustomerRow {
    id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    credit_limit: number;
    current_balance: number;
    total_purchases: number;
    loyalty_points: number;
    notes: string;
    is_active: number;
    last_visit: string | null;
    last_payment_date: string | null;
    barcode: string;
    created_at: string;
    updated_at: string;
}

interface CreditTransactionRow {
    id: string;
    customer_id: string;
    amount: number;
    type: string;
    date: string;
    sale_id: string;
    notes: string;
}

function rowToCustomer(row: CustomerRow): Customer {
    return {
        id: row.id,
        name: row.name,
        phone: row.phone || '',
        email: row.email || undefined,
        address: row.address || undefined,
        city: row.city || undefined,
        creditLimit: row.credit_limit,
        currentCredit: row.current_balance,
        loyaltyPoints: row.loyalty_points || 0,
        lastVisit: row.last_visit,
        lastPaymentDate: row.last_payment_date,
        createdAt: row.created_at,
        barcode: row.barcode || undefined,
    };
}

function customerToRow(customer: Partial<Customer> & { id: string }): Record<string, any> {
    const row: Record<string, any> = { id: customer.id };
    if (customer.name !== undefined) row.name = customer.name;
    if (customer.phone !== undefined) row.phone = customer.phone;
    if (customer.email !== undefined) row.email = customer.email || '';
    if (customer.address !== undefined) row.address = customer.address || '';
    if (customer.city !== undefined) row.city = customer.city || '';
    if (customer.creditLimit !== undefined) row.credit_limit = customer.creditLimit;
    if (customer.currentCredit !== undefined) row.current_balance = customer.currentCredit;
    if (customer.loyaltyPoints !== undefined) row.loyalty_points = customer.loyaltyPoints;
    if (customer.lastVisit !== undefined) row.last_visit = customer.lastVisit;
    if (customer.lastPaymentDate !== undefined) row.last_payment_date = customer.lastPaymentDate;
    if (customer.barcode !== undefined) row.barcode = customer.barcode || '';
    row.updated_at = new Date().toISOString();
    return row;
}

function rowToTransaction(row: CreditTransactionRow): CreditTransaction {
    return {
        id: row.id,
        customerId: row.customer_id,
        amount: row.amount,
        type: row.type as CreditTransaction['type'],
        date: row.date,
        saleId: row.sale_id || undefined,
        notes: row.notes || undefined,
    };
}

export const customersRepo = {
    async loadAll(): Promise<Customer[]> {
        const rows = await db.select<CustomerRow>('SELECT * FROM customers WHERE is_active = 1 ORDER BY name ASC');
        return rows.map(rowToCustomer);
    },

    async loadTransactions(): Promise<CreditTransaction[]> {
        const rows = await db.select<CreditTransactionRow>('SELECT * FROM credit_transactions ORDER BY date DESC');
        return rows.map(rowToTransaction);
    },

    async create(customer: Customer): Promise<void> {
        const row = customerToRow(customer);
        row.created_at = new Date().toISOString();
        row.is_active = 1;
        row.total_purchases = 0;
        row.notes = '';
        await db.insert('customers', row);
    },

    async update(id: string, updates: Partial<Customer>): Promise<void> {
        const row = customerToRow({ id, ...updates });
        delete row.id;
        await db.update('customers', id, row);
    },

    async remove(id: string): Promise<void> {
        await db.execute('UPDATE customers SET is_active = 0, updated_at = $1 WHERE id = $2', [new Date().toISOString(), id]);
    },

    async addCreditTransaction(tx: CreditTransaction, newBalance: number, lastPaymentDate: string | null): Promise<void> {
        await db.transaction([
            {
                query: `INSERT INTO credit_transactions (id, customer_id, amount, type, date, sale_id, notes) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                params: [tx.id, tx.customerId, tx.amount, tx.type, tx.date, tx.saleId || '', tx.notes || ''],
            },
            {
                query: `UPDATE customers SET current_balance = $1, last_payment_date = COALESCE($2, last_payment_date), updated_at = $3 WHERE id = $4`,
                params: [newBalance, lastPaymentDate, new Date().toISOString(), tx.customerId],
            },
        ]);
    },

    async updateLoyaltyPoints(id: string, newPoints: number): Promise<void> {
        await db.execute('UPDATE customers SET loyalty_points = $1, updated_at = $2 WHERE id = $3', [newPoints, new Date().toISOString(), id]);
    },
};

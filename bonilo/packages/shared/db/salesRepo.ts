/**
 * Sales Repository
 */
import { db } from './database';
import { Sale, SaleItem } from '../types/sales';

interface SaleRow {
    id: string;
    receipt_number: string;
    subtotal: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    payment_method: string;
    customer_id: string | null;
    customer_name: string;
    cashier_id: string;
    cashier_name: string;
    status: string;
    created_at: string;
}

interface SaleItemRow {
    id: string;
    sale_id: string;
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    total: number;
    tax_amount: number;
    discount_percent: number;
    cost_at_sale: number;
    created_at: string;
}

function rowToSale(row: SaleRow, items: SaleItem[] = []): Sale {
    return {
        id: row.id,
        receiptNumber: row.receipt_number,
        items,
        subtotal: row.subtotal,
        taxAmount: row.tax_amount,
        discountAmount: row.discount_amount,
        totalAmount: row.total_amount,
        paymentMethod: row.payment_method as any,
        customerId: row.customer_id ?? undefined,
        customerName: row.customer_name,
        cashierId: row.cashier_id,
        cashierName: row.cashier_name,
        timestamp: row.created_at,
        status: row.status as any,
    };
}

function rowToSaleItem(row: SaleItemRow): SaleItem {
    return {
        id: row.id,
        productId: row.product_id,
        productName: row.product_name,
        quantity: row.quantity,
        unitPrice: row.unit_price,
        total: row.total,
        taxAmount: row.tax_amount,
        discountPercent: row.discount_percent,
    };
}

export const salesRepo = {
    // Sale recording moved to the atomic Rust `checkout_sale` command (M1.2).
    // Reads stay here.
    async loadAll(options?: { withItems?: boolean; limit?: number; since?: string }): Promise<Sale[]> {
        let query = 'SELECT * FROM sales';
        const params: any[] = [];
        if (options?.since) { query += ' WHERE created_at >= $1'; params.push(options.since); }
        query += ' ORDER BY created_at DESC';
        if (options?.limit) query += ` LIMIT ${options.limit}`;

        const saleRows = await db.select<SaleRow>(query, params);
        if (!options?.withItems || saleRows.length === 0) {
            return saleRows.map(row => rowToSale(row));
        }

        // Fetch every line for the loaded sales in a single grouped pass instead
        // of one query per sale (the old N+1). Chunked to stay under SQLite's
        // bound-parameter limit, so it scales to large hydration windows.
        const itemsBySale = new Map<string, SaleItem[]>();
        const ids = saleRows.map(r => r.id);
        const CHUNK = 400;
        for (let i = 0; i < ids.length; i += CHUNK) {
            const batch = ids.slice(i, i + CHUNK);
            const placeholders = batch.map((_, j) => `$${j + 1}`).join(', ');
            const itemRows = await db.select<SaleItemRow>(
                `SELECT * FROM sale_items WHERE sale_id IN (${placeholders})`,
                batch
            );
            for (const row of itemRows) {
                const list = itemsBySale.get(row.sale_id);
                if (list) list.push(rowToSaleItem(row));
                else itemsBySale.set(row.sale_id, [rowToSaleItem(row)]);
            }
        }

        return saleRows.map(row => rowToSale(row, itemsBySale.get(row.id) ?? []));
    }
};

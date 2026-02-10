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
    async recordSale(sale: Sale, costMap: Record<string, number>): Promise<void> {
        const now = new Date().toISOString();
        const operations: Array<{ query: string; params?: any[] }> = [];

        operations.push({
            query: `INSERT INTO sales (id, receipt_number, subtotal, tax_amount, discount_amount, total_amount, payment_method, customer_id, customer_name, cashier_id, cashier_name, status, created_at)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
            params: [sale.id, sale.receiptNumber, sale.subtotal, sale.taxAmount, sale.discountAmount, sale.totalAmount, sale.paymentMethod, sale.customerId || null, sale.customerName || '', sale.cashierId, sale.cashierName, sale.status || 'completed', now]
        });

        for (const item of sale.items) {
            const itemId = `si_${Date.now()}_${Math.random()}`;
            const movId = `mov_${Date.now()}_${Math.random()}`;
            const cost = costMap[item.productId] || 0;

            operations.push({
                query: `INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, total, tax_amount, discount_percent, cost_at_sale, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                params: [itemId, sale.id, item.productId, item.productName, item.quantity, item.unitPrice, item.total, item.taxAmount || 0, item.discountPercent || 0, cost, now]
            });

            operations.push({
                query: `UPDATE products SET stock = MAX(0, stock - $1), updated_at = $2 WHERE id = $3`,
                params: [item.quantity, now, item.productId]
            });

            operations.push({
                query: `INSERT INTO inventory_movements (id, product_id, type, qty_change, stock_after, reference_id, created_at)
                VALUES ($1, $2, 'sale', $3, (SELECT MAX(0, stock - $4) FROM products WHERE id = $5), $6, $7)`,
                params: [movId, item.productId, -item.quantity, item.quantity, item.productId, sale.id, now]
            });
        }

        await db.transaction(operations);
    },
    async loadAll(options?: { withItems?: boolean; limit?: number; since?: string }): Promise<Sale[]> {
        let query = 'SELECT * FROM sales';
        const params: any[] = [];
        if (options?.since) { query += ' WHERE created_at >= $1'; params.push(options.since); }
        query += ' ORDER BY created_at DESC';
        if (options?.limit) query += ` LIMIT ${options.limit}`;

        const saleRows = await db.select<SaleRow>(query, params);
        if (!options?.withItems) return saleRows.map(row => rowToSale(row));

        const sales: Sale[] = [];
        for (const saleRow of saleRows) {
            const itemRows = await db.select<SaleItemRow>('SELECT * FROM sale_items WHERE sale_id = $1', [saleRow.id]);
            const items = itemRows.map(rowToSaleItem);
            sales.push(rowToSale(saleRow, items));
        }
        return sales;
    }
};

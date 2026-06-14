/**
 * Purchases Repository (Suppliers, Purchase Orders, Goods Receipts)
 */
import { db } from './database';
import type { Supplier, PurchaseOrder, PurchaseItem, GoodsReceipt } from '../stores/purchasesStore';

// ============ SUPPLIER ============

interface SupplierRow {
    id: string;
    name: string;
    contact_name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    ice: string;
    nif: string;
    current_debt: number;
    notes: string;
    is_active: number;
    created_at: string;
    updated_at: string;
}

function rowToSupplier(row: SupplierRow): Supplier {
    return {
        id: row.id,
        name: row.name,
        phone: row.phone || '',
        email: row.email || undefined,
        address: row.address || undefined,
        city: row.city || undefined,
        ice: row.ice || undefined,
        nif: row.nif || undefined,
    };
}

// ============ PURCHASE ORDER ============

interface PORow {
    id: string;
    po_number: string;
    supplier_id: string;
    supplier_name: string;
    date: string;
    expected_date: string;
    status: string;
    subtotal: number;
    tax_amount: number;
    total: number;
    notes: string;
    created_at: string;
}

interface POItemRow {
    id: string;
    po_id: string;
    product_id: string;
    product_name: string;
    product_barcode: string;
    product_emoji: string;
    ordered_qty: number;
    received_qty: number;
    purchase_price: number;
    total: number;
    expiry_date: string;
    lot_number: string;
    unit: string;
}

function rowToPurchaseItem(row: POItemRow): PurchaseItem {
    return {
        id: row.id,
        productId: row.product_id,
        productName: row.product_name,
        productBarcode: row.product_barcode,
        productEmoji: row.product_emoji,
        orderedQty: row.ordered_qty,
        receivedQty: row.received_qty,
        purchasePrice: row.purchase_price,
        total: row.total,
        expiryDate: row.expiry_date || undefined,
        lotNumber: row.lot_number || undefined,
        unit: row.unit,
    };
}

function rowToPO(row: PORow, items: PurchaseItem[] = []): PurchaseOrder {
    return {
        id: row.id,
        poNumber: row.po_number,
        supplierId: row.supplier_id,
        supplierName: row.supplier_name,
        date: row.date,
        expectedDate: row.expected_date,
        status: row.status as PurchaseOrder['status'],
        items,
        subtotal: row.subtotal,
        taxAmount: row.tax_amount,
        total: row.total,
        notes: row.notes || undefined,
        createdAt: row.created_at,
    };
}

// ============ GOODS RECEIPT ============

interface GRRow {
    id: string;
    gr_number: string;
    po_id: string;
    supplier_id: string;
    supplier_name: string;
    date: string;
    invoice_number: string;
    total: number;
    status: string;
    paid_from: string;
    is_paid: number;
    created_at: string;
}

function rowToGR(row: GRRow, items: PurchaseItem[] = []): GoodsReceipt {
    return {
        id: row.id,
        grNumber: row.gr_number,
        poId: row.po_id || undefined,
        supplierId: row.supplier_id,
        supplierName: row.supplier_name,
        date: row.date,
        invoiceNumber: row.invoice_number || undefined,
        items,
        total: row.total,
        status: row.status as GoodsReceipt['status'],
        paidFrom: (row.paid_from || undefined) as GoodsReceipt['paidFrom'],
        isPaid: row.is_paid === 1,
        createdAt: row.created_at,
    };
}

export const purchasesRepo = {
    // ===== SUPPLIERS =====
    async loadSuppliers(): Promise<Supplier[]> {
        const rows = await db.select<SupplierRow>('SELECT * FROM suppliers WHERE is_active = 1 ORDER BY name ASC');
        return rows.map(rowToSupplier);
    },

    async createSupplier(supplier: Supplier): Promise<void> {
        const now = new Date().toISOString();
        await db.insert('suppliers', {
            id: supplier.id,
            name: supplier.name,
            contact_name: '',
            phone: supplier.phone || '',
            email: supplier.email || '',
            address: supplier.address || '',
            city: supplier.city || '',
            ice: supplier.ice || '',
            nif: supplier.nif || '',
            current_debt: 0,
            notes: '',
            is_active: 1,
            created_at: now,
            updated_at: now,
        });
    },

    async updateSupplier(id: string, updates: Partial<Supplier>): Promise<void> {
        const row: Record<string, any> = { updated_at: new Date().toISOString() };
        if (updates.name !== undefined) row.name = updates.name;
        if (updates.phone !== undefined) row.phone = updates.phone;
        if (updates.email !== undefined) row.email = updates.email || '';
        if (updates.address !== undefined) row.address = updates.address || '';
        if (updates.city !== undefined) row.city = updates.city || '';
        if (updates.ice !== undefined) row.ice = updates.ice || '';
        if (updates.nif !== undefined) row.nif = updates.nif || '';
        await db.update('suppliers', id, row);
    },

    async removeSupplier(id: string): Promise<void> {
        await db.execute('UPDATE suppliers SET is_active = 0, updated_at = $1 WHERE id = $2', [new Date().toISOString(), id]);
    },

    // ===== PURCHASE ORDERS =====
    async loadPurchaseOrders(): Promise<PurchaseOrder[]> {
        const poRows = await db.select<PORow>('SELECT * FROM purchase_orders ORDER BY created_at DESC');
        const orders: PurchaseOrder[] = [];
        for (const poRow of poRows) {
            const itemRows = await db.select<POItemRow>('SELECT * FROM purchase_order_items WHERE po_id = $1', [poRow.id]);
            orders.push(rowToPO(poRow, itemRows.map(rowToPurchaseItem)));
        }
        return orders;
    },

    // Purchase-order creation moved to the atomic Rust `create_purchase_order` command (M1.3).

    async updatePurchaseOrder(id: string, updates: Partial<PurchaseOrder>): Promise<void> {
        const row: Record<string, any> = {};
        if (updates.status !== undefined) row.status = updates.status;
        if (updates.notes !== undefined) row.notes = updates.notes;
        if (updates.subtotal !== undefined) row.subtotal = updates.subtotal;
        if (updates.taxAmount !== undefined) row.tax_amount = updates.taxAmount;
        if (updates.total !== undefined) row.total = updates.total;
        if (Object.keys(row).length > 0) {
            await db.update('purchase_orders', id, row);
        }
    },

    // ===== GOODS RECEIPTS =====
    async loadGoodsReceipts(): Promise<GoodsReceipt[]> {
        const grRows = await db.select<GRRow>('SELECT * FROM goods_receipts ORDER BY created_at DESC');
        const receipts: GoodsReceipt[] = [];
        for (const grRow of grRows) {
            const itemRows = await db.select<POItemRow>('SELECT * FROM goods_receipt_items WHERE gr_id = $1', [grRow.id]);
            receipts.push(rowToGR(grRow, itemRows.map(rowToPurchaseItem)));
        }
        return receipts;
    },

    // Goods-receipt creation moved to the atomic Rust `receive_goods` command (M1.3).

    async updateGoodsReceipt(id: string, updates: { status?: string; isPaid?: boolean; paidFrom?: string }): Promise<void> {
        const row: Record<string, any> = {};
        if (updates.status !== undefined) row.status = updates.status;
        if (updates.isPaid !== undefined) row.is_paid = updates.isPaid ? 1 : 0;
        if (updates.paidFrom !== undefined) row.paid_from = updates.paidFrom;
        if (Object.keys(row).length > 0) {
            await db.update('goods_receipts', id, row);
        }
    },
};

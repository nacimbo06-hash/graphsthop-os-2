/**
 * Lots Repository
 */
import { db } from './database';
import type { ProductLot, LotMovement } from '../stores/lotsStore';

interface LotRow {
    id: string;
    product_id: string;
    product_name: string;
    product_barcode: string;
    lot_number: string;
    batch_number: string;
    quantity: number;
    original_quantity: number;
    expiry_date: string;
    received_date: string;
    supplier_id: string;
    supplier_name: string;
    goods_receipt_id: string;
    purchase_price: number;
    status: string;
    days_remaining: number;
    created_at: string;
}

interface LotMovementRow {
    id: string;
    lot_id: string;
    product_id: string;
    type: string;
    quantity: number;
    reason: string;
    reference: string;
    created_by: string;
    created_at: string;
}

function rowToLot(row: LotRow): ProductLot {
    return {
        id: row.id,
        productId: row.product_id,
        productName: row.product_name,
        productBarcode: row.product_barcode,
        lotNumber: row.lot_number,
        batchNumber: row.batch_number || undefined,
        quantity: row.quantity,
        originalQuantity: row.original_quantity,
        expiryDate: row.expiry_date,
        receivedDate: row.received_date,
        supplierId: row.supplier_id || undefined,
        supplierName: row.supplier_name || undefined,
        goodsReceiptId: row.goods_receipt_id || undefined,
        purchasePrice: row.purchase_price,
        status: row.status as ProductLot['status'],
        daysRemaining: row.days_remaining,
        createdAt: row.created_at,
    };
}

function rowToMovement(row: LotMovementRow): LotMovement {
    return {
        id: row.id,
        lotId: row.lot_id,
        productId: row.product_id,
        type: row.type as LotMovement['type'],
        quantity: row.quantity,
        reason: row.reason || undefined,
        reference: row.reference || undefined,
        createdAt: row.created_at,
        createdBy: row.created_by || '',
    };
}

export const lotsRepo = {
    async loadLots(): Promise<ProductLot[]> {
        const rows = await db.select<LotRow>('SELECT * FROM lots ORDER BY expiry_date ASC');
        return rows.map(rowToLot);
    },

    async loadMovements(): Promise<LotMovement[]> {
        const rows = await db.select<LotMovementRow>('SELECT * FROM lot_movements ORDER BY created_at DESC');
        return rows.map(rowToMovement);
    },

    async createLot(lot: ProductLot): Promise<void> {
        await db.insert('lots', {
            id: lot.id,
            product_id: lot.productId,
            product_name: lot.productName,
            product_barcode: lot.productBarcode,
            lot_number: lot.lotNumber,
            batch_number: lot.batchNumber || '',
            quantity: lot.quantity,
            original_quantity: lot.originalQuantity,
            expiry_date: lot.expiryDate,
            received_date: lot.receivedDate,
            supplier_id: lot.supplierId || '',
            supplier_name: lot.supplierName || '',
            goods_receipt_id: lot.goodsReceiptId || '',
            purchase_price: lot.purchasePrice,
            status: lot.status,
            days_remaining: lot.daysRemaining,
            created_at: lot.createdAt,
        });
    },

    async updateLot(id: string, updates: Partial<ProductLot>): Promise<void> {
        const row: Record<string, any> = {};
        if (updates.quantity !== undefined) row.quantity = updates.quantity;
        if (updates.status !== undefined) row.status = updates.status;
        if (updates.daysRemaining !== undefined) row.days_remaining = updates.daysRemaining;
        if (Object.keys(row).length > 0) {
            await db.update('lots', id, row);
        }
    },

    async addMovement(movement: LotMovement): Promise<void> {
        await db.insert('lot_movements', {
            id: movement.id,
            lot_id: movement.lotId,
            product_id: movement.productId,
            type: movement.type,
            quantity: movement.quantity,
            reason: movement.reason || '',
            reference: movement.reference || '',
            created_by: movement.createdBy || '',
            created_at: movement.createdAt,
        });
    },

    // Lot mutation + movement and bulk status refresh moved to the atomic Rust
    // lot_ops commands (update_lot_with_movement / bulk_update_lot_statuses) (M1.3).
};

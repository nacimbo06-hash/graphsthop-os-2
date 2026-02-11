/**
 * Stock Movements Repository
 */
import { db } from './database';
import type { StockMovement } from '../stores/stockMovementsStore';

interface StockMovementRow {
    id: string;
    product_id: string;
    product_name: string;
    product_emoji: string;
    type: string;
    quantity: number;
    previous_stock: number;
    new_stock: number;
    reason: string;
    performed_by: string;
    reference: string;
    created_at: string;
}

function rowToMovement(row: StockMovementRow): StockMovement {
    return {
        id: row.id,
        date: row.created_at,
        type: row.type as StockMovement['type'],
        productId: row.product_id,
        productName: row.product_name,
        productEmoji: row.product_emoji,
        quantity: row.quantity,
        previousStock: row.previous_stock,
        newStock: row.new_stock,
        reason: row.reason || '',
        performedBy: row.performed_by || '',
        reference: row.reference || undefined,
    };
}

export const stockMovementsRepo = {
    async loadAll(): Promise<StockMovement[]> {
        const rows = await db.select<StockMovementRow>('SELECT * FROM stock_movements ORDER BY created_at DESC');
        return rows.map(rowToMovement);
    },

    async create(movement: StockMovement): Promise<void> {
        await db.insert('stock_movements', {
            id: movement.id,
            product_id: movement.productId,
            product_name: movement.productName,
            product_emoji: movement.productEmoji,
            type: movement.type,
            quantity: movement.quantity,
            previous_stock: movement.previousStock,
            new_stock: movement.newStock,
            reason: movement.reason || '',
            performed_by: movement.performedBy || '',
            reference: movement.reference || '',
            created_at: movement.date,
        });
    },
};

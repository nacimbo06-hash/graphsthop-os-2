/**
 * Cash Session Repository
 */
import { db } from './database';
import type { CashSession, CashMovement } from '../types/treasury';

interface SessionRow {
    id: string;
    cashier_id: string;
    cashier_name: string;
    opening_amount: number;
    closing_amount: number | null;
    expected_amount: number | null;
    difference: number | null;
    total_sales: number;
    total_cash_sales: number;
    total_card_sales: number;
    transactions_count: number;
    status: string;
    opened_at: string;
    closed_at: string | null;
    notes: string;
}

interface MovementRow {
    id: string;
    session_id: string;
    type: string;
    amount: number;
    reason: string;
    category: string;
    reference: string;
    provision_type: string;
    created_by: string;
    payment_method: string;
    created_at: string;
}

function rowToSession(row: SessionRow): CashSession {
    return {
        id: row.id,
        openedAt: row.opened_at,
        closedAt: row.closed_at,
        openingBalance: row.opening_amount,
        closingBalance: row.closing_amount,
        expectedBalance: row.expected_amount,
        difference: row.difference,
        cashierId: row.cashier_id,
        cashierName: row.cashier_name || '',
        status: row.status as 'open' | 'closed',
        notes: row.notes || '',
        transferToSafe: 0,
        transferToProvisions: { salaries: 0, bankCredit: 0, fixedCharges: 0 },
    };
}

function rowToMovement(row: MovementRow): CashMovement {
    return {
        id: row.id,
        sessionId: row.session_id,
        type: row.type as CashMovement['type'],
        amount: row.amount,
        reason: row.reason || '',
        category: row.category || undefined,
        reference: row.reference || undefined,
        provisionType: (row.provision_type || undefined) as CashMovement['provisionType'],
        createdAt: row.created_at,
        createdBy: row.created_by || '',
        paymentMethod: (row.payment_method || undefined) as CashMovement['paymentMethod'],
    };
}

export const cashSessionRepo = {
    async loadSessions(): Promise<CashSession[]> {
        const rows = await db.select<SessionRow>('SELECT * FROM cash_sessions ORDER BY opened_at DESC');
        return rows.map(rowToSession);
    },

    async loadMovements(): Promise<CashMovement[]> {
        const rows = await db.select<MovementRow>('SELECT * FROM cash_movements ORDER BY created_at DESC');
        return rows.map(rowToMovement);
    },

    async createSession(session: CashSession): Promise<void> {
        await db.insert('cash_sessions', {
            id: session.id,
            cashier_id: session.cashierId,
            cashier_name: session.cashierName,
            opening_amount: session.openingBalance,
            closing_amount: null,
            expected_amount: null,
            difference: null,
            total_sales: 0,
            total_cash_sales: 0,
            total_card_sales: 0,
            transactions_count: 0,
            status: session.status,
            opened_at: typeof session.openedAt === 'string' ? session.openedAt : session.openedAt.toISOString(),
            closed_at: null,
            notes: session.notes || '',
        });
    },

    async closeSession(session: CashSession): Promise<void> {
        await db.update('cash_sessions', session.id, {
            closing_amount: session.closingBalance,
            expected_amount: session.expectedBalance,
            difference: session.difference,
            status: 'closed',
            closed_at: typeof session.closedAt === 'string' ? session.closedAt : session.closedAt instanceof Date ? session.closedAt.toISOString() : new Date().toISOString(),
            notes: session.notes || '',
        });
    },

    async addMovement(movement: CashMovement): Promise<void> {
        await db.insert('cash_movements', {
            id: movement.id,
            session_id: movement.sessionId,
            type: movement.type,
            amount: movement.amount,
            reason: movement.reason || '',
            category: movement.category || '',
            reference: movement.reference || '',
            provision_type: movement.provisionType || '',
            created_by: movement.createdBy || '',
            payment_method: movement.paymentMethod || '',
            created_at: typeof movement.createdAt === 'string' ? movement.createdAt : movement.createdAt.toISOString(),
        });
    },
};

/**
 * Treasury Repository
 * 
 * Handles atomic cross-cutting concerns in the treasury module.
 */
import { db } from './database';
import type { CashMovement, SafeTransaction, SinkingFundTransaction } from '../types/treasury';

export const treasuryRepo = {
    /**
     * Performs an atomic transfer from cash drawer to safe
     */
    async recordTransferToSafe(
        sessionId: string,
        movement: CashMovement,
        safeTx: SafeTransaction
    ): Promise<void> {
        const now = new Date().toISOString();

        await db.transaction([
            {
                query: `INSERT INTO cash_movements (id, session_id, type, amount, reason, created_by, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                params: [movement.id, sessionId, movement.type, movement.amount, movement.reason, movement.createdBy, now]
            },
            {
                query: `INSERT INTO safe_transactions (id, type, amount, reason, performed_by, created_at)
                VALUES ($1, $2, $3, $4, $5, $6)`,
                params: [safeTx.id, safeTx.type, safeTx.amount, safeTx.reason, safeTx.performedBy, now]
            }
        ]);
    },

    /**
     * Performs an atomic contribution from cash drawer to a sinking fund
     */
    async recordContributionToFund(
        sessionId: string,
        movement: CashMovement,
        fundTx: SinkingFundTransaction,
        newBalance: number
    ): Promise<void> {
        const now = new Date().toISOString();

        await db.transaction([
            {
                query: `INSERT INTO cash_movements (id, session_id, type, amount, reason, provision_type, created_by, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                params: [movement.id, sessionId, movement.type, movement.amount, movement.reason, movement.provisionType, movement.createdBy, now]
            },
            {
                query: `INSERT INTO sinking_fund_transactions (id, fund_id, type, amount, reason, performed_by, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                params: [fundTx.id, fundTx.fundId, fundTx.type, fundTx.amount, fundTx.reason, fundTx.performedBy, now]
            },
            {
                query: `UPDATE sinking_funds SET current_balance = $1, last_contribution = $2 WHERE id = $3`,
                params: [newBalance, now, fundTx.fundId]
            }
        ]);
    },

    /**
     * Performs an atomic expense payment from a chosen source
     */
    async recordExpensePayment(
        expenseId: string,
        amount: number,
        paidFrom: 'cash' | 'safe' | 'provision',
        movementData: {
            sessionId?: string;
            movementId?: string;
            reason: string;
            createdBy: string;
        },
        safeTx?: SafeTransaction,
        fundTx?: SinkingFundTransaction,
        newFundBalance?: number
    ): Promise<void> {
        const now = new Date().toISOString();
        const ops: Array<{ query: string; params?: any[] }> = [];

        // 1. Update expense status
        ops.push({
            query: `UPDATE expenses SET is_paid = 1, paid_from = $1, payment_method = $2 WHERE id = $3`,
            params: [paidFrom, paidFrom, expenseId]
        });

        // 2. record movement if from cash
        if (paidFrom === 'cash' && movementData.sessionId && movementData.movementId) {
            ops.push({
                query: `INSERT INTO cash_movements (id, session_id, type, amount, reason, created_by, created_at)
                  VALUES ($1, $2, 'expense', $3, $4, $5, $6)`,
                params: [movementData.movementId, movementData.sessionId, amount, movementData.reason, movementData.createdBy, now]
            });
        }

        // 3. record safe tx if from safe
        if (paidFrom === 'safe' && safeTx) {
            ops.push({
                query: `INSERT INTO safe_transactions (id, type, amount, reason, performed_by, created_at)
                  VALUES ($1, $2, $3, $4, $5, $6)`,
                params: [safeTx.id, safeTx.type, safeTx.amount, safeTx.reason, safeTx.performedBy, now]
            });
        }

        // 4. record fund tx and update balance if from provision
        if (paidFrom === 'provision' && fundTx && newFundBalance !== undefined) {
            ops.push({
                query: `INSERT INTO sinking_fund_transactions (id, fund_id, type, amount, reason, performed_by, created_at)
                  VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                params: [fundTx.id, fundTx.fundId, fundTx.type, fundTx.amount, fundTx.reason, fundTx.performedBy, now]
            });
            ops.push({
                query: `UPDATE sinking_funds SET current_balance = $1 WHERE id = $2`,
                params: [newFundBalance, fundTx.fundId]
            });
        }

        await db.transaction(ops);
    },

    /**
     * Performs an atomic session closure with multiple transfers
     */
    async recordSessionClosure(
        sessionId: string,
        updates: {
            closing_amount: number;
            expected_amount: number;
            difference: number;
            status: string;
            closed_at: string;
            notes: string;
        },
        transfers: Array<{
            movement: CashMovement;
            safeTx?: SafeTransaction;
            fundTx?: SinkingFundTransaction;
            newFundBalance?: number;
        }>
    ): Promise<void> {
        const ops: Array<{ query: string; params?: any[] }> = [];

        // 1. Update session status
        ops.push({
            query: `UPDATE cash_sessions SET 
                closing_amount = $1, 
                expected_amount = $2, 
                difference = $3, 
                status = $4, 
                closed_at = $5, 
                notes = $6 
                WHERE id = $7`,
            params: [
                updates.closing_amount,
                updates.expected_amount,
                updates.difference,
                updates.status,
                updates.closed_at,
                updates.notes,
                sessionId
            ]
        });

        // 2. Add all transfers
        for (const t of transfers) {
            // Cash movement
            ops.push({
                query: `INSERT INTO cash_movements (id, session_id, type, amount, reason, provision_type, created_by, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                params: [
                    t.movement.id,
                    sessionId,
                    t.movement.type,
                    t.movement.amount,
                    t.movement.reason,
                    t.movement.provisionType || '',
                    t.movement.createdBy,
                    t.movement.createdAt
                ]
            });

            // Safe transaction if applicable
            if (t.safeTx) {
                ops.push({
                    query: `INSERT INTO safe_transactions (id, type, amount, reason, performed_by, created_at)
                    VALUES ($1, $2, $3, $4, $5, $6)`,
                    params: [
                        t.safeTx.id,
                        t.safeTx.type,
                        t.safeTx.amount,
                        t.safeTx.reason,
                        t.safeTx.performedBy,
                        t.safeTx.date
                    ]
                });
            }

            // Fund transaction and balance update if applicable
            if (t.fundTx && t.newFundBalance !== undefined) {
                ops.push({
                    query: `INSERT INTO sinking_fund_transactions (id, fund_id, type, amount, reason, performed_by, created_at)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    params: [
                        t.fundTx.id,
                        t.fundTx.fundId,
                        t.fundTx.type,
                        t.fundTx.amount,
                        t.fundTx.reason,
                        t.fundTx.performedBy,
                        t.fundTx.date
                    ]
                });
                ops.push({
                    query: `UPDATE sinking_funds SET current_balance = $1, last_contribution = $2 WHERE id = $3`,
                    params: [t.newFundBalance, t.fundTx.date, t.fundTx.fundId]
                });
            }
        }

        await db.transaction(ops);
    }
};

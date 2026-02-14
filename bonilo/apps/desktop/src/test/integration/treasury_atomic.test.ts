import { describe, it, expect, beforeAll, vi } from 'vitest';

// initialize mock window
if (typeof window === 'undefined') {
    (global as any).window = {};
}
(global as any).window.__TAURI_INTERNALS__ = {};

// Mock the Tauri SQL plugin using better-sqlite3 in-memory
vi.mock('@tauri-apps/plugin-sql', async () => {
    const Database = (await import('better-sqlite3')).default;
    const db = new Database(':memory:');

    return {
        default: {
            load: async () => {
                return {
                    execute: async (sql: string, params: any[] = []) => {
                        const convertedSql = sql.replace(/\$\d+/g, '?');
                        const stmt = db.prepare(convertedSql);
                        const result = stmt.run(...params);
                        return { rowsAffected: result.changes, lastInsertId: Number(result.lastInsertRowid) };
                    },
                    select: async (sql: string, params: any[] = []) => {
                        const convertedSql = sql.replace(/\$\d+/g, '?');
                        const stmt = db.prepare(convertedSql);
                        return stmt.all(...params);
                    }
                };
            }
        }
    };
});

import { db } from '@shared/db/database';
import { treasuryRepo } from '@shared/db/treasuryRepo';

describe('Treasury Atomic Transactions Integration', () => {

    beforeAll(async () => {
        await db.init();

        // Setup initial data
        await db.execute(`INSERT INTO users (id, username, display_name, role) VALUES ('u1', 'admin', 'Admin', 'admin')`);

        // Setup a session for FK constraints
        await db.execute(`INSERT INTO cash_sessions (id, cashier_id, cashier_name, opened_at, opening_amount, status) 
                         VALUES ('session_1', 'u1', 'Admin', '${new Date().toISOString()}', 1000, 'open')`);

        // Setup initial sinking fund
        await db.execute(`INSERT INTO sinking_funds (id, name, category, current_balance, target_amount) 
                         VALUES ('fund_1', 'Salaries', 'salaries', 1000, 5000)`);
    });

    it('should record a contribution to fund and update balance atomically', async () => {
        const sessionId = 'session_1';
        const movement = {
            id: 'mov_1',
            type: 'transfer_to_provision',
            amount: 500,
            reason: 'Provision salaries',
            provisionType: 'salaries',
            createdBy: 'u1'
        };
        const fundTx = {
            id: 'ftx_1',
            fundId: 'fund_1',
            type: 'contribution',
            amount: 500,
            reason: 'Daily provision',
            performedBy: 'u1',
            date: new Date().toISOString()
        };
        const newBalance = 1500;

        await treasuryRepo.recordContributionToFund(sessionId, movement as any, fundTx as any, newBalance);

        // Verify cash movement
        const movements = await db.select('SELECT * FROM cash_movements WHERE id = $1', ['mov_1']);
        expect(movements).toHaveLength(1);
        expect(movements[0].amount).toBe(500);

        // Verify fund transaction
        const fundTxs = await db.select('SELECT * FROM sinking_fund_transactions WHERE id = $1', ['ftx_1']);
        expect(fundTxs).toHaveLength(1);

        // Verify fund balance
        const fund = await db.select('SELECT current_balance FROM sinking_funds WHERE id = $1', ['fund_1']);
        expect(fund[0].current_balance).toBe(1500);
    });

    it('should record a transfer to safe atomically', async () => {
        const sessionId = 'session_1';
        const movement = {
            id: 'mov_2',
            type: 'transfer_to_safe',
            amount: 2000,
            reason: 'Transfer to safe',
            createdBy: 'u1'
        };
        const safeTx = {
            id: 'stx_1',
            type: 'deposit',
            amount: 2000,
            reason: 'End of day transfer',
            performedBy: 'u1'
        };

        await treasuryRepo.recordTransferToSafe(sessionId, movement as any, safeTx as any);

        // Verify cash movement
        const movements = await db.select('SELECT * FROM cash_movements WHERE id = $1', ['mov_2']);
        expect(movements).toHaveLength(1);

        // Verify safe transaction
        const safeTxs = await db.select('SELECT * FROM safe_transactions WHERE id = $1', ['stx_1']);
        expect(safeTxs).toHaveLength(1);
        expect(safeTxs[0].amount).toBe(2000);
    });

    it('should record an expense payment from safe atomically', async () => {
        // Setup expense
        await db.execute(`INSERT INTO expenses (id, description, amount, category) 
                         VALUES ('exp_1', 'Office Supplies', 150, 'office')`);

        const safeTx = {
            id: 'stx_2',
            type: 'withdrawal',
            amount: 150,
            reason: 'Paiement depense: Office Supplies',
            performedBy: 'u1'
        };

        await treasuryRepo.recordExpensePayment(
            'exp_1',
            150,
            'safe',
            { reason: 'Office Supplies', createdBy: 'u1' },
            safeTx as any
        );

        // Verify expense update
        const expense = await db.select('SELECT is_paid, paid_from FROM expenses WHERE id = $1', ['exp_1']);
        expect(expense[0].is_paid).toBe(1);
        expect(expense[0].paid_from).toBe('safe');

        // Verify safe transaction
        const safeTxs = await db.select('SELECT * FROM safe_transactions WHERE id = $1', ['stx_2']);
        expect(safeTxs).toHaveLength(1);
        expect(safeTxs[0].type).toBe('withdrawal');
    });

    it('should record a session closure with multiple transfers atomically', async () => {
        // Setup another session
        await db.execute(`INSERT INTO cash_sessions (id, cashier_id, cashier_name, opened_at, opening_amount, status) 
                         VALUES ('session_clos_1', 'u1', 'Test', '${new Date().toISOString()}', 1000, 'open')`);

        const sessionId = 'session_clos_1';
        const updates = {
            closing_amount: 3000,
            expected_amount: 3000,
            difference: 0,
            status: 'closed',
            closed_at: new Date().toISOString(),
            notes: 'Perfect day'
        };

        const transfers = [
            {
                movement: {
                    id: 'clos_mov_1',
                    type: 'transfer_to_safe',
                    amount: 1000,
                    reason: 'Clôture journée (Coffre)',
                    createdBy: 'u1',
                    createdAt: new Date().toISOString()
                },
                safeTx: {
                    id: 'clos_stx_1',
                    type: 'deposit',
                    amount: 1000,
                    reason: 'Clôture journée',
                    date: new Date().toISOString(),
                    performedBy: 'u1'
                }
            },
            {
                movement: {
                    id: 'clos_mov_2',
                    type: 'transfer_to_provision',
                    amount: 500,
                    reason: 'Clôture journée (Salaries)',
                    provisionType: 'salaries',
                    createdBy: 'u1',
                    createdAt: new Date().toISOString()
                },
                fundTx: {
                    id: 'clos_ftx_1',
                    fundId: 'fund_1',
                    type: 'contribution',
                    amount: 500,
                    reason: 'Clôture journée',
                    date: new Date().toISOString(),
                    performedBy: 'u1'
                },
                newFundBalance: 2000
            }
        ];

        await treasuryRepo.recordSessionClosure(sessionId, updates as any, transfers as any);

        // Verify session status
        const session = await db.select('SELECT status, closing_amount FROM cash_sessions WHERE id = $1', [sessionId]);
        expect(session[0].status).toBe('closed');
        expect(session[0].closing_amount).toBe(3000);

        // Verify movements
        const mov1 = await db.select('SELECT * FROM cash_movements WHERE id = $1', ['clos_mov_1']);
        expect(mov1).toHaveLength(1);
        const mov2 = await db.select('SELECT * FROM cash_movements WHERE id = $1', ['clos_mov_2']);
        expect(mov2).toHaveLength(1);

        // Verify safe tx
        const stx = await db.select('SELECT * FROM safe_transactions WHERE id = $1', ['clos_stx_1']);
        expect(stx).toHaveLength(1);

        // Verify fund tx and balance
        const ftx = await db.select('SELECT * FROM sinking_fund_transactions WHERE id = $1', ['clos_ftx_1']);
        expect(ftx).toHaveLength(1);
        const fund = await db.select('SELECT current_balance FROM sinking_funds WHERE id = $1', ['fund_1']);
        expect(fund[0].current_balance).toBe(2000);
    });
});

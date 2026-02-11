/**
 * Sinking Funds Repository
 */
import { db } from './database';
import type { SinkingFund, SinkingFundTransaction } from '../types/treasury';

interface FundRow {
    id: string;
    name: string;
    icon: string;
    color: string;
    target_amount: number;
    current_balance: number;
    due_day: number;
    is_recurring: number;
    category: string;
    last_contribution: string | null;
    created_at: string;
}

interface FundTxRow {
    id: string;
    fund_id: string;
    type: string;
    amount: number;
    reason: string;
    performed_by: string;
    created_at: string;
}

function rowToFund(row: FundRow, history: SinkingFundTransaction[] = []): SinkingFund {
    return {
        id: row.id,
        name: row.name,
        icon: row.icon || '',
        color: row.color || '',
        targetAmount: row.target_amount,
        currentBalance: row.current_balance,
        dueDay: row.due_day,
        isRecurring: row.is_recurring === 1,
        category: row.category as SinkingFund['category'],
        lastContribution: row.last_contribution,
        history,
    };
}

function rowToFundTx(row: FundTxRow): SinkingFundTransaction {
    return {
        id: row.id,
        fundId: row.fund_id,
        type: row.type as 'contribution' | 'withdrawal',
        amount: row.amount,
        reason: row.reason || '',
        date: row.created_at,
        performedBy: row.performed_by || '',
    };
}

export const sinkingFundsRepo = {
    async loadAll(): Promise<SinkingFund[]> {
        const fundRows = await db.select<FundRow>('SELECT * FROM sinking_funds ORDER BY name ASC');
        const txRows = await db.select<FundTxRow>('SELECT * FROM sinking_fund_transactions ORDER BY created_at DESC');
        const txMap = new Map<string, SinkingFundTransaction[]>();
        for (const tx of txRows) {
            const list = txMap.get(tx.fund_id) || [];
            list.push(rowToFundTx(tx));
            txMap.set(tx.fund_id, list);
        }
        return fundRows.map(f => rowToFund(f, txMap.get(f.id) || []));
    },

    async create(fund: SinkingFund): Promise<void> {
        await db.insert('sinking_funds', {
            id: fund.id,
            name: fund.name,
            icon: fund.icon || '',
            color: fund.color || '',
            target_amount: fund.targetAmount,
            current_balance: fund.currentBalance,
            due_day: fund.dueDay,
            is_recurring: fund.isRecurring ? 1 : 0,
            category: fund.category,
            last_contribution: fund.lastContribution ? (typeof fund.lastContribution === 'string' ? fund.lastContribution : (fund.lastContribution as Date).toISOString()) : null,
            created_at: new Date().toISOString(),
        });
    },

    async updateBalance(fundId: string, newBalance: number, lastContribution: string | null): Promise<void> {
        const row: Record<string, any> = { current_balance: newBalance };
        if (lastContribution) row.last_contribution = lastContribution;
        await db.update('sinking_funds', fundId, row);
    },

    async updateTarget(fundId: string, newTarget: number): Promise<void> {
        await db.update('sinking_funds', fundId, { target_amount: newTarget });
    },

    async addTransaction(tx: SinkingFundTransaction): Promise<void> {
        await db.insert('sinking_fund_transactions', {
            id: tx.id,
            fund_id: tx.fundId,
            type: tx.type,
            amount: tx.amount,
            reason: tx.reason || '',
            performed_by: tx.performedBy || '',
            created_at: typeof tx.date === 'string' ? tx.date : tx.date instanceof Date ? (tx.date as Date).toISOString() : new Date().toISOString(),
        });
    },

    async seedDefaults(defaults: SinkingFund[]): Promise<void> {
        const existing = await db.select<{ id: string }>('SELECT id FROM sinking_funds');
        const existingIds = new Set(existing.map(r => r.id));
        for (const fund of defaults) {
            if (!existingIds.has(fund.id)) {
                await sinkingFundsRepo.create(fund);
            }
        }
    },
};

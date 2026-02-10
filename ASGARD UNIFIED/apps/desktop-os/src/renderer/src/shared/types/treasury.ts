/**
 * Treasury and Financial Data Types
 */

export interface CashSession {
    id: string;
    openedAt: Date | string;
    closedAt: Date | string | null;
    openingBalance: number;
    closingBalance: number | null;
    expectedBalance: number | null;
    difference: number | null;
    cashierId: string;
    cashierName: string;
    status: 'open' | 'closed';
    notes: string;
    transferToSafe: number;
    transferToProvisions: {
        salaries: number;
        bankCredit: number;
        fixedCharges: number;
    };
}

export interface CashMovement {
    id: string;
    sessionId: string;
    type: 'deposit' | 'withdrawal' | 'expense' | 'sale' | 'refund' | 'transfer_to_safe' | 'transfer_to_provision';
    amount: number;
    reason: string;
    category?: string;
    reference?: string;
    provisionType?: 'salaries' | 'bankCredit' | 'fixedCharges' | 'custom';
    createdAt: Date | string;
    createdBy: string;
}

export interface SinkingFund {
    id: string;
    name: string;
    icon: string;
    color: string;
    targetAmount: number;
    currentBalance: number;
    dueDay: number;
    isRecurring: boolean;
    category: 'salaries' | 'bankCredit' | 'fixedCharges' | 'custom';
    lastContribution: Date | string | null;
    history: SinkingFundTransaction[];
}

export interface SinkingFundTransaction {
    id: string;
    fundId: string;
    type: 'contribution' | 'withdrawal';
    amount: number;
    reason: string;
    date: Date | string;
    performedBy: string;
}

export interface SafeTransaction {
    id: string;
    type: 'deposit' | 'withdrawal';
    amount: number;
    reason: string;
    date: Date | string;
    performedBy: string;
}

export interface Expense {
    id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
    paymentMethod: 'cash' | 'bank' | 'check' | 'card' | 'safe';
    reference?: string;
    isPaid: boolean;
    paidFrom: 'cash' | 'safe' | 'provision' | null;
    createdAt: Date | string;
}

export interface ExpenseCategory {
    id: string;
    name: string;
    icon: string;
    color: string;
}

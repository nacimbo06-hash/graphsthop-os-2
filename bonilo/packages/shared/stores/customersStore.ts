import { create } from 'zustand';
import { customersRepo } from '../db';

// Check if running in Tauri (SQLite available)
const isTauri = () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

const BROWSER_CUSTOMERS_KEY = 'bonilo-customers';
const BROWSER_CREDIT_TX_KEY = 'bonilo-credit-transactions';

/** Save customers to localStorage (browser fallback) */
function saveCustomersToBrowser(customers: Customer[]) {
    if (!isTauri()) {
        try {
            localStorage.setItem(BROWSER_CUSTOMERS_KEY, JSON.stringify(customers));
        } catch (e) {
            console.warn('[CustomersStore] localStorage save failed:', e);
        }
    }
}

function saveTransactionsToBrowser(transactions: CreditTransaction[]) {
    if (!isTauri()) {
        try {
            localStorage.setItem(BROWSER_CREDIT_TX_KEY, JSON.stringify(transactions.slice(0, 500)));
        } catch (e) {
            console.warn('[CustomersStore] localStorage save failed:', e);
        }
    }
}

/** Load from localStorage (browser fallback) */
function loadCustomersFromBrowser(): Customer[] {
    if (!isTauri()) {
        try {
            const data = localStorage.getItem(BROWSER_CUSTOMERS_KEY);
            if (data) return JSON.parse(data);
        } catch (e) {
            console.warn('[CustomersStore] localStorage load failed:', e);
        }
    }
    return [];
}

function loadTransactionsFromBrowser(): CreditTransaction[] {
    if (!isTauri()) {
        try {
            const data = localStorage.getItem(BROWSER_CREDIT_TX_KEY);
            if (data) return JSON.parse(data);
        } catch (e) {
            console.warn('[CustomersStore] localStorage load failed:', e);
        }
    }
    return [];
}

export interface Customer {
    id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    city?: string;
    loyaltyPoints: number;
    creditLimit: number;
    currentCredit: number;
    lastVisit: string | null;
    lastPaymentDate: string | null;
    createdAt: string;
    barcode?: string;
}

export interface CreditTransaction {
    id: string;
    customerId: string;
    amount: number; // Positive for debt, negative for payment
    type: 'purchase' | 'payment' | 'adjustment';
    date: string;
    saleId?: string;
    notes?: string;
}

interface CustomersState {
    customers: Customer[];
    transactions: CreditTransaction[];
    isLoading: boolean;
    isHydrated: boolean;

    // Lifecycle
    hydrate: () => Promise<void>;

    // Actions
    addCustomer: (customer: Omit<Customer, 'id' | 'loyaltyPoints' | 'currentCredit' | 'lastVisit' | 'lastPaymentDate' | 'createdAt'>) => Promise<void>;
    updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
    deleteCustomer: (id: string) => Promise<void>;

    addLoyaltyPoints: (id: string, points: number) => Promise<void>;
    updateCredit: (id: string, amount: number, type: CreditTransaction['type'], saleId?: string, notes?: string) => Promise<void>;

    // Getters
    getCustomerById: (id: string) => Customer | undefined;
    getCustomerByBarcode: (barcode: string) => Customer | undefined;
    getTotalCredit: () => number;
    getLoyalCustomers: (minPoints?: number) => Customer[];
    getCustomersWithCredit: () => Customer[];
    getOverdueCustomers: (days: number) => Customer[];
    getTotalOutstandingCredit: () => number;
}

export const useCustomersStore = create<CustomersState>()(
    (set, get) => ({
        customers: [],
        transactions: [],
        isLoading: false,
        isHydrated: false,

        hydrate: async () => {
            if (get().isHydrated) return;
            set({ isLoading: true });
            try {
                let customers: Customer[];
                let transactions: CreditTransaction[];
                if (isTauri()) {
                    [customers, transactions] = await Promise.all([
                        customersRepo.loadAll(),
                        customersRepo.loadTransactions(),
                    ]);
                } else {
                    customers = loadCustomersFromBrowser();
                    transactions = loadTransactionsFromBrowser();
                }
                set({ customers, transactions, isHydrated: true, isLoading: false });
                console.log(`[CustomersStore] ✅ Hydrated ${customers.length} customers from ${isTauri() ? 'DB' : 'localStorage'}`);
            } catch (error) {
                console.error('[CustomersStore] ❌ Failed to hydrate:', error);
                const customers = loadCustomersFromBrowser();
                const transactions = loadTransactionsFromBrowser();
                set({ customers, transactions, isHydrated: true, isLoading: false });
            }
        },

        addCustomer: async (data) => {
            const newCustomer: Customer = {
                ...data,
                id: crypto.randomUUID(),
                loyaltyPoints: 0,
                currentCredit: 0,
                lastVisit: null,
                lastPaymentDate: null,
                createdAt: new Date().toISOString(),
                barcode: data.barcode || `CUST-${data.phone || Date.now()}`,
            };
            if (isTauri()) {
                await customersRepo.create(newCustomer);
            }
            set(state => {
                const updated = [...state.customers, newCustomer];
                saveCustomersToBrowser(updated);
                return { customers: updated };
            });
        },

        updateCustomer: async (id, updates) => {
            if (isTauri()) {
                await customersRepo.update(id, updates);
            }
            set(state => {
                const updated = state.customers.map(c => c.id === id ? { ...c, ...updates } : c);
                saveCustomersToBrowser(updated);
                return { customers: updated };
            });
        },

        deleteCustomer: async (id) => {
            if (isTauri()) {
                await customersRepo.remove(id);
            }
            set(state => {
                const updated = state.customers.filter(c => c.id !== id);
                saveCustomersToBrowser(updated);
                return { customers: updated };
            });
        },

        addLoyaltyPoints: async (id, points) => {
            const customer = get().customers.find(c => c.id === id);
            if (!customer) return;
            const newPoints = customer.loyaltyPoints + points;
            if (isTauri()) {
                await customersRepo.updateLoyaltyPoints(id, newPoints);
            }
            set(state => {
                const updated = state.customers.map(c =>
                    c.id === id ? { ...c, loyaltyPoints: newPoints } : c
                );
                saveCustomersToBrowser(updated);
                return { customers: updated };
            });
        },

        updateCredit: async (id, amount, type, saleId, notes) => {
            const customer = get().customers.find(c => c.id === id);
            if (!customer) return;

            const transaction: CreditTransaction = {
                id: crypto.randomUUID(),
                customerId: id,
                amount,
                type,
                date: new Date().toISOString(),
                saleId,
                notes,
            };

            const isPayment = type === 'payment' || amount < 0;
            const newBalance = customer.currentCredit + amount;
            const lastPaymentDate = isPayment ? new Date().toISOString() : null;

            if (isTauri()) {
                await customersRepo.addCreditTransaction(transaction, newBalance, lastPaymentDate);
            }

            set(state => {
                const updatedCustomers = state.customers.map(c =>
                    c.id === id
                        ? {
                            ...c,
                            currentCredit: newBalance,
                            lastPaymentDate: isPayment ? new Date().toISOString() : c.lastPaymentDate,
                        }
                        : c
                );
                const updatedTx = [transaction, ...state.transactions];
                saveCustomersToBrowser(updatedCustomers);
                saveTransactionsToBrowser(updatedTx);
                return { customers: updatedCustomers, transactions: updatedTx };
            });
        },

        getCustomerById: (id) => get().customers.find(c => c.id === id),

        getCustomerByBarcode: (barcode) => get().customers.find(c => c.barcode === barcode),

        getTotalCredit: () => get().customers.reduce((sum, c) => sum + c.currentCredit, 0),

        getLoyalCustomers: (minPoints = 1000) =>
            get().customers.filter(c => c.loyaltyPoints >= minPoints),

        getCustomersWithCredit: () =>
            get().customers.filter(c => c.currentCredit > 0),

        getOverdueCustomers: (days) => {
            const now = new Date();
            return get().customers.filter(c => {
                if (c.currentCredit <= 0) return false;
                if (!c.lastPaymentDate) return true; // Never paid = overdue
                const lastPayment = new Date(c.lastPaymentDate);
                const daysSincePayment = Math.floor((now.getTime() - lastPayment.getTime()) / (1000 * 60 * 60 * 24));
                return daysSincePayment > days;
            });
        },

        getTotalOutstandingCredit: () =>
            get().customers.reduce((sum, c) => sum + Math.max(0, c.currentCredit), 0),
    })
);

export default useCustomersStore;

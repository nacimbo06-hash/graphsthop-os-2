import { create } from 'zustand';
import { customersRepo } from '../db';

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
                const [customers, transactions] = await Promise.all([
                    customersRepo.loadAll(),
                    customersRepo.loadTransactions(),
                ]);
                set({ customers, transactions, isHydrated: true, isLoading: false });
                console.log(`[CustomersStore] Hydrated ${customers.length} customers from DB`);
            } catch (error) {
                console.error('[CustomersStore] Failed to hydrate:', error);
                set({ isLoading: false });
            }
        },

        addCustomer: async (data) => {
            const newCustomer: Customer = {
                ...data,
                id: `cust_${Date.now()}`,
                loyaltyPoints: 0,
                currentCredit: 0,
                lastVisit: null,
                lastPaymentDate: null,
                createdAt: new Date().toISOString(),
                barcode: data.barcode || `CUST-${data.phone || Date.now()}`,
            };
            await customersRepo.create(newCustomer);
            set(state => ({ customers: [...state.customers, newCustomer] }));
        },

        updateCustomer: async (id, updates) => {
            await customersRepo.update(id, updates);
            set(state => ({
                customers: state.customers.map(c => c.id === id ? { ...c, ...updates } : c)
            }));
        },

        deleteCustomer: async (id) => {
            await customersRepo.remove(id);
            set(state => ({
                customers: state.customers.filter(c => c.id !== id)
            }));
        },

        addLoyaltyPoints: async (id, points) => {
            const customer = get().customers.find(c => c.id === id);
            if (!customer) return;
            const newPoints = customer.loyaltyPoints + points;
            await customersRepo.updateLoyaltyPoints(id, newPoints);
            set(state => ({
                customers: state.customers.map(c =>
                    c.id === id ? { ...c, loyaltyPoints: newPoints } : c
                )
            }));
        },

        updateCredit: async (id, amount, type, saleId, notes) => {
            const customer = get().customers.find(c => c.id === id);
            if (!customer) return;

            const transaction: CreditTransaction = {
                id: `txn_${Date.now()}`,
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

            await customersRepo.addCreditTransaction(transaction, newBalance, lastPaymentDate);

            set(state => ({
                customers: state.customers.map(c =>
                    c.id === id
                        ? {
                            ...c,
                            currentCredit: newBalance,
                            lastPaymentDate: isPayment ? new Date().toISOString() : c.lastPaymentDate,
                        }
                        : c
                ),
                transactions: [transaction, ...state.transactions]
            }));
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

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

    // Actions
    addCustomer: (customer: Omit<Customer, 'id' | 'loyaltyPoints' | 'currentCredit' | 'lastVisit' | 'lastPaymentDate' | 'createdAt'>) => void;
    updateCustomer: (id: string, updates: Partial<Customer>) => void;
    deleteCustomer: (id: string) => void;

    addLoyaltyPoints: (id: string, points: number) => void;
    updateCredit: (id: string, amount: number, type: CreditTransaction['type'], saleId?: string, notes?: string) => void;

    // Getters
    getCustomerById: (id: string) => Customer | undefined;
    getCustomerByBarcode: (barcode: string) => Customer | undefined;
    getTotalCredit: () => number;
    getLoyalCustomers: (minPoints?: number) => Customer[];
    getCustomersWithCredit: () => Customer[];
    getOverdueCustomers: (days: number) => Customer[];
    getTotalOutstandingCredit: () => number;
}

const initialCustomers: Customer[] = [];

export const useCustomersStore = create<CustomersState>()(
    persist(
        (set, get) => ({
            customers: initialCustomers,
            transactions: [],

            addCustomer: (data) => {
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
                set(state => ({ customers: [...state.customers, newCustomer] }));
            },

            updateCustomer: (id, updates) => {
                set(state => ({
                    customers: state.customers.map(c => c.id === id ? { ...c, ...updates } : c)
                }));
            },

            deleteCustomer: (id) => {
                set(state => ({
                    customers: state.customers.filter(c => c.id !== id)
                }));
            },

            addLoyaltyPoints: (id, points) => {
                set(state => ({
                    customers: state.customers.map(c =>
                        c.id === id ? { ...c, loyaltyPoints: c.loyaltyPoints + points } : c
                    )
                }));
            },

            updateCredit: (id, amount, type, saleId, notes) => {
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

                set(state => ({
                    customers: state.customers.map(c =>
                        c.id === id
                            ? {
                                ...c,
                                currentCredit: c.currentCredit + amount,
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
        }),
        {
            name: 'customers-storage',
        }
    )
);

export default useCustomersStore;

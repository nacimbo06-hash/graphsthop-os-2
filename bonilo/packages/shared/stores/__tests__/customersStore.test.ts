import { describe, it, expect, beforeEach, vi } from 'vitest';

// Hoisted so the vi.mock factory can reference it. Mimics the Rust
// `record_credit_transaction` command: applies the signed amount as a delta to
// a per-customer running balance and returns the authoritative result.
const { invokeMock } = vi.hoisted(() => {
    const balances = new Map<string, number>();
    let seq = 0;
    return {
        invokeMock: vi.fn(async (_cmd: string, args: any) => {
            seq += 1;
            const { customerId, amount, type } = args.input;
            const next = (balances.get(customerId) ?? 0) + amount;
            balances.set(customerId, next);
            const isPayment = type === 'payment' || amount < 0;
            return {
                transactionId: `ctx_${seq}`,
                newBalance: next,
                lastPaymentDate: isPayment ? new Date().toISOString() : null,
            };
        }),
    };
});

vi.mock('@tauri-apps/api/core', () => ({ invoke: invokeMock }));

vi.mock('../../db', () => ({
    customersRepo: {
        loadAll: vi.fn().mockResolvedValue([]),
        loadTransactions: vi.fn().mockResolvedValue([]),
        create: vi.fn().mockResolvedValue(undefined),
        update: vi.fn().mockResolvedValue(undefined),
        remove: vi.fn().mockResolvedValue(undefined),
        updateLoyaltyPoints: vi.fn().mockResolvedValue(undefined),
        addCreditTransaction: vi.fn().mockResolvedValue(undefined),
    },
}));

import { useCustomersStore } from '../customersStore';
import { customersRepo } from '../../db';

const mockCustomerInput = {
    name: 'Mohamed Benali',
    phone: '0555123456',
    email: 'mohamed@example.com',
    address: '12 Rue Didouche Mourad',
    city: 'Alger',
    creditLimit: 50000,
};

describe('CustomersStore', () => {
    beforeEach(() => {
        useCustomersStore.setState({
            customers: [],
            transactions: [],
            isLoading: false,
            isHydrated: false,
        });
        vi.clearAllMocks();
    });

    it('should start with empty customers', () => {
        expect(useCustomersStore.getState().customers).toEqual([]);
    });

    it('should hydrate from database', async () => {
        const dbCustomers = [{
            id: 'cust_1',
            ...mockCustomerInput,
            loyaltyPoints: 500,
            currentCredit: 0,
            lastVisit: null,
            lastPaymentDate: null,
            createdAt: '2024-01-01',
            barcode: 'CUST-0555123456',
        }];
        (customersRepo.loadAll as any).mockResolvedValueOnce(dbCustomers);
        (customersRepo.loadTransactions as any).mockResolvedValueOnce([]);

        await useCustomersStore.getState().hydrate();

        const state = useCustomersStore.getState();
        expect(state.isHydrated).toBe(true);
        expect(state.customers).toHaveLength(1);
        expect(state.customers[0].name).toBe('Mohamed Benali');
    });

    it('should not hydrate twice', async () => {
        (customersRepo.loadAll as any).mockResolvedValueOnce([]);
        (customersRepo.loadTransactions as any).mockResolvedValueOnce([]);

        await useCustomersStore.getState().hydrate();
        await useCustomersStore.getState().hydrate();

        expect(customersRepo.loadAll).toHaveBeenCalledOnce();
    });

    it('should add a customer', async () => {
        await useCustomersStore.getState().addCustomer(mockCustomerInput);

        const customers = useCustomersStore.getState().customers;
        expect(customers).toHaveLength(1);
        expect(customers[0].name).toBe('Mohamed Benali');
        expect(customers[0].loyaltyPoints).toBe(0);
        expect(customers[0].currentCredit).toBe(0);
        expect(customersRepo.create).toHaveBeenCalledOnce();
    });

    it('should update a customer', async () => {
        await useCustomersStore.getState().addCustomer(mockCustomerInput);
        const customer = useCustomersStore.getState().customers[0];

        await useCustomersStore.getState().updateCustomer(customer.id, { phone: '0777999888' });

        expect(customersRepo.update).toHaveBeenCalledWith(customer.id, { phone: '0777999888' });
        const updated = useCustomersStore.getState().getCustomerById(customer.id);
        expect(updated?.phone).toBe('0777999888');
    });

    it('should delete a customer', async () => {
        await useCustomersStore.getState().addCustomer(mockCustomerInput);
        const customer = useCustomersStore.getState().customers[0];

        await useCustomersStore.getState().deleteCustomer(customer.id);

        expect(customersRepo.remove).toHaveBeenCalledWith(customer.id);
        expect(useCustomersStore.getState().customers).toHaveLength(0);
    });

    it('should add loyalty points', async () => {
        await useCustomersStore.getState().addCustomer(mockCustomerInput);
        const customer = useCustomersStore.getState().customers[0];

        await useCustomersStore.getState().addLoyaltyPoints(customer.id, 100);

        const updated = useCustomersStore.getState().getCustomerById(customer.id);
        expect(updated?.loyaltyPoints).toBe(100);
        expect(customersRepo.updateLoyaltyPoints).toHaveBeenCalledWith(customer.id, 100);
    });

    it('should update credit (purchase)', async () => {
        await useCustomersStore.getState().addCustomer(mockCustomerInput);
        const customer = useCustomersStore.getState().customers[0];

        await useCustomersStore.getState().updateCredit(customer.id, 5000, 'purchase', 'sale_1');

        const updated = useCustomersStore.getState().getCustomerById(customer.id);
        expect(updated?.currentCredit).toBe(5000);
        expect(invokeMock).toHaveBeenCalledWith(
            'record_credit_transaction',
            expect.objectContaining({
                input: expect.objectContaining({ amount: 5000, type: 'purchase' }),
            })
        );
    });

    it('should pass the drawer-deposit options on a cash payment', async () => {
        await useCustomersStore.getState().addCustomer(mockCustomerInput);
        const customer = useCustomersStore.getState().customers[0];

        await useCustomersStore.getState().updateCredit(
            customer.id, -2000, 'payment', undefined, 'Règlement espèces',
            { sessionId: 'sess_1', recordCashMovement: true, createdBy: 'Staff' }
        );

        expect(invokeMock).toHaveBeenCalledWith(
            'record_credit_transaction',
            expect.objectContaining({
                input: expect.objectContaining({
                    amount: -2000,
                    type: 'payment',
                    recordCashMovement: true,
                    sessionId: 'sess_1',
                }),
            })
        );
    });

    it('should default to no drawer deposit when no options are given', async () => {
        await useCustomersStore.getState().addCustomer(mockCustomerInput);
        const customer = useCustomersStore.getState().customers[0];

        await useCustomersStore.getState().updateCredit(customer.id, -500, 'payment');

        expect(invokeMock).toHaveBeenCalledWith(
            'record_credit_transaction',
            expect.objectContaining({
                input: expect.objectContaining({ recordCashMovement: false, sessionId: null }),
            })
        );
    });

    it('should update credit (payment reduces balance)', async () => {
        await useCustomersStore.getState().addCustomer(mockCustomerInput);
        const customer = useCustomersStore.getState().customers[0];

        // Add debt first
        await useCustomersStore.getState().updateCredit(customer.id, 5000, 'purchase');
        // Pay part of it
        await useCustomersStore.getState().updateCredit(customer.id, -2000, 'payment');

        const updated = useCustomersStore.getState().getCustomerById(customer.id);
        expect(updated?.currentCredit).toBe(3000);
        expect(updated?.lastPaymentDate).toBeDefined();
    });

    it('should find customer by barcode', async () => {
        await useCustomersStore.getState().addCustomer(mockCustomerInput);
        const customer = useCustomersStore.getState().customers[0];

        const found = useCustomersStore.getState().getCustomerByBarcode(customer.barcode!);
        expect(found?.name).toBe('Mohamed Benali');
    });

    it('should return total credit', async () => {
        await useCustomersStore.getState().addCustomer(mockCustomerInput);
        const c1 = useCustomersStore.getState().customers[0];
        await useCustomersStore.getState().updateCredit(c1.id, 3000, 'purchase');

        await useCustomersStore.getState().addCustomer({ ...mockCustomerInput, name: 'Ali', phone: '0666111222' });
        const c2 = useCustomersStore.getState().customers[1];
        await useCustomersStore.getState().updateCredit(c2.id, 2000, 'purchase');

        expect(useCustomersStore.getState().getTotalCredit()).toBe(5000);
    });

    it('should return loyal customers', async () => {
        await useCustomersStore.getState().addCustomer(mockCustomerInput);
        const customer = useCustomersStore.getState().customers[0];
        await useCustomersStore.getState().addLoyaltyPoints(customer.id, 1500);

        const loyal = useCustomersStore.getState().getLoyalCustomers(1000);
        expect(loyal).toHaveLength(1);

        const veryLoyal = useCustomersStore.getState().getLoyalCustomers(2000);
        expect(veryLoyal).toHaveLength(0);
    });

    it('should return customers with credit', async () => {
        await useCustomersStore.getState().addCustomer(mockCustomerInput);
        const customer = useCustomersStore.getState().customers[0];
        await useCustomersStore.getState().updateCredit(customer.id, 5000, 'purchase');

        const withCredit = useCustomersStore.getState().getCustomersWithCredit();
        expect(withCredit).toHaveLength(1);
    });

    it('should return total outstanding credit', async () => {
        await useCustomersStore.getState().addCustomer(mockCustomerInput);
        const customer = useCustomersStore.getState().customers[0];
        await useCustomersStore.getState().updateCredit(customer.id, 10000, 'purchase');

        expect(useCustomersStore.getState().getTotalOutstandingCredit()).toBe(10000);
    });
});

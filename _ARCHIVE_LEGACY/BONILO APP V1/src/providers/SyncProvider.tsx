/**
 * Sync Provider Component
 * Initializes network sync and handles automatic synchronization between PCs
 * - Server (Windows - Main PC)
 * - Client (AntiX Linux - Cashier PC)
 * 
 * Features:
 * - Auto-reconnect on app startup
 * - Real-time sync of all collections
 * - Offline queue for pending changes
 */

import React, { useEffect, useCallback, useRef } from 'react';
import { getSyncClient } from '../services/syncClient';
import { 
    useNetworkSyncStore,
    useProductsStore,
    useSalesStore,
    useCustomersStore,
    usePurchasesStore,
    useStockMovementsStore,
    useCashSessionStore,
    useExpensesStore,
    useSafeStore,
    useSinkingFundsStore
} from '@core/stores';
import type { Product, Customer } from '@core';
import type { Sale } from '@core';

interface SyncProviderProps {
    children: React.ReactNode;
}

// Collection mapping for all synced stores
const SYNCED_COLLECTIONS = [
    'products',
    'sales',
    'customers',
    'suppliers',
    'goods_receipts',
    'purchase_orders',
    'inventory_movements',
    'treasury_movements',
    'expenses',
    'safe_transactions',
    'sinking_funds'
] as const;

export const SyncProvider: React.FC<SyncProviderProps> = ({ children }) => {
    const {
        mode,
        clientConnected,
        serverRunning,
        serverAddress,
        serverPort,
        connectToServer
    } = useNetworkSyncStore();

    const isInitialized = useRef(false);
    const autoConnectAttempted = useRef(false);

    // Store actions
    const updateProduct = useProductsStore(state => state.updateProduct);
    const deleteProduct = useProductsStore(state => state.deleteProduct);

    // Handle incoming sync messages for all collections
    const handleSyncMessage = useCallback((collection: string, data: unknown, isDelete?: boolean) => {
        console.log(`[SyncProvider] Received ${isDelete ? 'delete' : 'update'} for ${collection}`);

        if (isDelete) {
            const item = data as { id: string };
            switch (collection) {
                case 'products':
                    deleteProduct(item.id);
                    break;
                case 'sales':
                    useSalesStore.setState(state => ({
                        sales: state.sales.filter(s => s.id !== item.id)
                    }));
                    break;
                case 'customers':
                    useCustomersStore.setState(state => ({
                        customers: state.customers.filter(c => c.id !== item.id)
                    }));
                    break;
                case 'suppliers':
                    usePurchasesStore.setState(state => ({
                        suppliers: state.suppliers.filter(s => s.id !== item.id)
                    }));
                    break;
                case 'goods_receipts':
                    usePurchasesStore.setState(state => ({
                        goodsReceipts: state.goodsReceipts.filter(r => r.id !== item.id)
                    }));
                    break;
                case 'inventory_movements':
                    useStockMovementsStore.setState(state => ({
                        movements: state.movements.filter(m => m.id !== item.id)
                    }));
                    break;
                case 'expenses':
                    useExpensesStore.setState(state => ({
                        expenses: state.expenses.filter(e => e.id !== item.id)
                    }));
                    break;
            }
            return;
        }

        const items = Array.isArray(data) ? data : [data];

        switch (collection) {
            case 'products':
                items.forEach(item => {
                    const product = item as Product;
                    const existing = useProductsStore.getState().getProductById(product.id);
                    if (existing) {
                        updateProduct(product.id, product);
                    } else {
                        useProductsStore.setState(state => ({
                            products: [...state.products.filter(p => p.id !== product.id), product]
                        }));
                    }
                });
                break;

            case 'sales':
                items.forEach(item => {
                    const sale = item as Sale;
                    useSalesStore.setState(state => ({
                        sales: [...state.sales.filter(s => s.id !== sale.id), sale]
                    }));
                });
                break;

            case 'customers':
                items.forEach(item => {
                    const customer = item as Customer;
                    useCustomersStore.setState(state => ({
                        customers: [...state.customers.filter(c => c.id !== customer.id), customer]
                    }));
                });
                break;

            case 'suppliers':
                items.forEach(item => {
                    const supplier = item as { id: string };
                    usePurchasesStore.setState(state => ({
                        suppliers: [...state.suppliers.filter(s => s.id !== supplier.id), item as any]
                    }));
                });
                break;

            case 'goods_receipts':
                items.forEach(item => {
                    const receipt = item as { id: string };
                    usePurchasesStore.setState(state => ({
                        goodsReceipts: [...state.goodsReceipts.filter(r => r.id !== receipt.id), item as any]
                    }));
                });
                break;

            case 'purchase_orders':
                items.forEach(item => {
                    const order = item as { id: string };
                    usePurchasesStore.setState(state => ({
                        purchaseOrders: [...state.purchaseOrders.filter(o => o.id !== order.id), item as any]
                    }));
                });
                break;

            case 'inventory_movements':
                items.forEach(item => {
                    const movement = item as { id: string };
                    useStockMovementsStore.setState(state => ({
                        movements: [...state.movements.filter(m => m.id !== movement.id), item as any]
                    }));
                });
                break;

            case 'treasury_movements':
                items.forEach(item => {
                    const movement = item as { id: string };
                    useCashSessionStore.setState(state => ({
                        movements: [...state.movements.filter(m => m.id !== movement.id), item as any]
                    }));
                });
                break;

            case 'expenses':
                items.forEach(item => {
                    const expense = item as { id: string };
                    useExpensesStore.setState(state => ({
                        expenses: [...state.expenses.filter(e => e.id !== expense.id), item as any]
                    }));
                });
                break;

            case 'safe_transactions':
                items.forEach(item => {
                    const tx = item as { id: string };
                    useSafeStore.setState(state => ({
                        safeTransactions: [...state.safeTransactions.filter(t => t.id !== tx.id), item as any]
                    }));
                });
                break;

            case 'sinking_funds':
                items.forEach(item => {
                    const fund = item as { id: string };
                    useSinkingFundsStore.setState(state => ({
                        sinkingFunds: [...state.sinkingFunds.filter(f => f.id !== fund.id), item as any]
                    }));
                });
                break;
        }
    }, [deleteProduct, updateProduct]);

    // AUTO-CONNECT: Reconnect to server on app startup if previously connected
    useEffect(() => {
        if (autoConnectAttempted.current) return;
        autoConnectAttempted.current = true;

        // Only auto-connect if mode is 'client' and we have a saved server address
        if (mode === 'client' && serverAddress && !clientConnected) {
            console.log('[SyncProvider] Auto-connecting to saved server:', serverAddress);

            // Parse the saved address (format: "ip:port")
            const [ip, portStr] = serverAddress.includes(':')
                ? serverAddress.split(':')
                : [serverAddress, '9876'];
            const port = parseInt(portStr) || 9876;

            // Attempt to reconnect with retry
            const attemptConnect = async () => {
                const success = await connectToServer(ip, port);
                if (success) {
                    console.log('[SyncProvider] Auto-connection successful');
                } else {
                    console.log('[SyncProvider] Auto-connection failed, will retry in 5s...');
                    // Retry after 5 seconds
                    setTimeout(attemptConnect, 5000);
                }
            };

            attemptConnect();
        }

        // If this is the server, auto-start the sync server
        if (mode === 'server' && !serverRunning) {
            console.log('[SyncProvider] Auto-starting sync server...');
            // @ts-expect-error - electronAPI is exposed via preload
            window.electronAPI?.startSyncServer(serverPort || 9876).then((result: any) => {
                if (result?.success) {
                    console.log('[SyncProvider] Sync server auto-started on port', result.port);
                    useNetworkSyncStore.getState().setServerStatus(
                        true,
                        result.port ?? 9876,
                        result.ips ?? []
                    );
                } else {
                    console.error('[SyncProvider] Failed to auto-start server:', result?.error);
                }
            }).catch((err: Error) => {
                console.error('[SyncProvider] Failed to auto-start server:', err);
            });
        }
    }, [mode, serverAddress, clientConnected, serverRunning, serverPort, connectToServer]);

    // Set up sync listeners when in network mode
    useEffect(() => {
        if (mode === 'standalone' || isInitialized.current) return;

        const client = getSyncClient();

        // Subscribe to all collections
        const unsubscribers = SYNCED_COLLECTIONS.map(collection =>
            client.onMessage(collection, (col, data, isDelete) => {
                handleSyncMessage(col, data, isDelete);
            })
        );

        // Also subscribe to wildcard for any collection
        const globalUnsubscribe = client.onMessage('*', handleSyncMessage);

        isInitialized.current = true;

        return () => {
            unsubscribers.forEach(unsub => unsub());
            globalUnsubscribe();
            isInitialized.current = false;
        };
    }, [mode, handleSyncMessage]);

    // Perform initial full sync when connected as client
    useEffect(() => {
        if (mode !== 'client' || !clientConnected) return;

        const performInitialSync = async () => {
            const client = getSyncClient();

            try {
                console.log('[SyncProvider] Starting initial full sync...');

                // Fetch all data from server
                const allData = await client.fetchFullSync();

                // Update local stores with all synced data
                if (allData.products && allData.products.length > 0) {
                    console.log('[SyncProvider] Syncing', allData.products.length, 'products');
                    useProductsStore.setState({ products: allData.products as Product[] });
                }

                if (allData.sales && allData.sales.length > 0) {
                    console.log('[SyncProvider] Syncing', allData.sales.length, 'sales');
                    useSalesStore.setState({ sales: allData.sales as Sale[] });
                }

                if (allData.customers && allData.customers.length > 0) {
                    console.log('[SyncProvider] Syncing', allData.customers.length, 'customers');
                    useCustomersStore.setState({ customers: allData.customers as Customer[] });
                }

                if (allData.suppliers && allData.suppliers.length > 0) {
                    console.log('[SyncProvider] Syncing', allData.suppliers.length, 'suppliers');
                    usePurchasesStore.setState(state => ({
                        ...state,
                        suppliers: allData.suppliers as any[]
                    }));
                }

                if (allData.goods_receipts && allData.goods_receipts.length > 0) {
                    console.log('[SyncProvider] Syncing', allData.goods_receipts.length, 'goods receipts');
                    usePurchasesStore.setState(state => ({
                        ...state,
                        goodsReceipts: allData.goods_receipts as any[]
                    }));
                }

                if (allData.inventory_movements && allData.inventory_movements.length > 0) {
                    console.log('[SyncProvider] Syncing', allData.inventory_movements.length, 'stock movements');
                    useStockMovementsStore.setState({ movements: allData.inventory_movements as any[] });
                }

                if (allData.treasury_movements && allData.treasury_movements.length > 0) {
                    console.log('[SyncProvider] Syncing', allData.treasury_movements.length, 'treasury movements');
                    useCashSessionStore.setState(state => ({
                        ...state,
                        movements: allData.treasury_movements as any[]
                    }));
                }

                if (allData.expenses && allData.expenses.length > 0) {
                    console.log('[SyncProvider] Syncing', allData.expenses.length, 'expenses');
                    useExpensesStore.setState({ expenses: allData.expenses as any[] });
                }

                console.log('[SyncProvider] ✅ Initial sync complete - all collections updated');
            } catch (error) {
                console.error('[SyncProvider] Initial sync failed:', error);
            }
        };

        performInitialSync();
    }, [mode, clientConnected]);

    // Push local changes to server when in SERVER mode
    useEffect(() => {
        if (mode !== 'server' || !serverRunning) return;

        const client = getSyncClient();

        // Subscribe to local store changes and push to connected clients
        const unsubProducts = useProductsStore.subscribe((state, prevState) => {
            if (state.products !== prevState.products) {
                const changed = state.products.filter(p => {
                    const prev = prevState.products.find(pp => pp.id === p.id);
                    return !prev || (p.updatedAt && prev.updatedAt &&
                        new Date(p.updatedAt).getTime() !== new Date(prev.updatedAt).getTime());
                });
                if (changed.length > 0) {
                    client.upsert('products', changed).catch(console.error);
                }
            }
        });

        const unsubSales = useSalesStore.subscribe((state, prevState) => {
            if (state.sales !== prevState.sales) {
                const changed = state.sales.filter(s => {
                    const prev = prevState.sales.find(ps => ps.id === s.id);
                    return !prev;
                });
                if (changed.length > 0) {
                    client.upsert('sales', changed).catch(console.error);
                }
            }
        });

        const unsubCustomers = useCustomersStore.subscribe((state, prevState) => {
            if (state.customers !== prevState.customers) {
                const changed = state.customers.filter(c => {
                    const prev = prevState.customers.find(pc => pc.id === c.id);
                    return !prev;
                });
                if (changed.length > 0) {
                    client.upsert('customers', changed).catch(console.error);
                }
            }
        });

        const unsubSuppliers = usePurchasesStore.subscribe((state, prevState) => {
            // Sync suppliers
            if (state.suppliers !== prevState.suppliers) {
                const changed = state.suppliers.filter(s => {
                    const prev = prevState.suppliers.find(ps => ps.id === s.id);
                    return !prev;
                });
                if (changed.length > 0) {
                    client.upsert('suppliers', changed).catch(console.error);
                }
            }
            // Sync goods receipts
            if (state.goodsReceipts !== prevState.goodsReceipts) {
                const changed = state.goodsReceipts.filter(r => {
                    const prev = prevState.goodsReceipts.find(pr => pr.id === r.id);
                    return !prev;
                });
                if (changed.length > 0) {
                    client.upsert('goods_receipts', changed).catch(console.error);
                }
            }
        });

        const unsubMovements = useStockMovementsStore.subscribe((state, prevState) => {
            if (state.movements !== prevState.movements) {
                const changed = state.movements.filter(m => {
                    const prev = prevState.movements.find(pm => pm.id === m.id);
                    return !prev;
                });
                if (changed.length > 0) {
                    client.upsert('inventory_movements', changed).catch(console.error);
                }
            }
        });

        const unsubExpenses = useExpensesStore.subscribe((state, prevState) => {
            if (state.expenses !== prevState.expenses) {
                const changed = state.expenses.filter(e => {
                    const prev = prevState.expenses.find(pe => pe.id === e.id);
                    return !prev;
                });
                if (changed.length > 0) {
                    client.upsert('expenses', changed).catch(console.error);
                }
            }
        });

        return () => {
            unsubProducts();
            unsubSales();
            unsubCustomers();
            unsubSuppliers();
            unsubMovements();
            unsubExpenses();
        };
    }, [mode, serverRunning]);

    // Push local changes to server when in CLIENT mode (bidirectional sync)
    useEffect(() => {
        if (mode !== 'client' || !clientConnected) return;

        const client = getSyncClient();

        // When a sale is made on the cashier, sync it to the server
        const unsubSales = useSalesStore.subscribe((state, prevState) => {
            if (state.sales !== prevState.sales) {
                const newSales = state.sales.filter(s => {
                    const prev = prevState.sales.find(ps => ps.id === s.id);
                    return !prev;
                });
                if (newSales.length > 0) {
                    console.log('[SyncProvider] Syncing', newSales.length, 'new sales to server');
                    client.upsert('sales', newSales).catch(console.error);
                }
            }
        });

        // Sync cash movements from cashier to server
        const unsubCashMovements = useCashSessionStore.subscribe((state, prevState) => {
            if (state.movements !== prevState.movements) {
                const newMovements = state.movements.filter(m => {
                    const prev = prevState.movements.find(pm => pm.id === m.id);
                    return !prev;
                });
                if (newMovements.length > 0) {
                    console.log('[SyncProvider] Syncing', newMovements.length, 'cash movements to server');
                    client.upsert('treasury_movements', newMovements).catch(console.error);
                }
            }
        });

        // Sync customers created on cashier
        const unsubCustomers = useCustomersStore.subscribe((state, prevState) => {
            if (state.customers !== prevState.customers) {
                const newCustomers = state.customers.filter(c => {
                    const prev = prevState.customers.find(pc => pc.id === c.id);
                    return !prev;
                });
                if (newCustomers.length > 0) {
                    console.log('[SyncProvider] Syncing', newCustomers.length, 'new customers to server');
                    client.upsert('customers', newCustomers).catch(console.error);
                }
            }
        });

        return () => {
            unsubSales();
            unsubCashMovements();
            unsubCustomers();
        };
    }, [mode, clientConnected]);

    return <>{children}</>;
};

export default SyncProvider;

// Barrel export for all stores
export { useAuthStore, ROLE_LABELS, ROLE_PERMISSIONS, MODULE_LABELS, ALL_MODULES, DEFAULT_MODULE_ACCESS, PREDEFINED_USERS } from './authStore';
export { useNotificationsStore, type AppNotification } from './notificationsStore';
export { useProductsStore, type Product } from './productsStore';
export { useSalesStore, type Sale, type SaleItem } from './salesStore';
export { useCustomersStore, type Customer } from './customersStore';
export { usePurchasesStore, type PurchaseOrder, type PurchaseItem, type Supplier, type GoodsReceipt } from './purchasesStore';
export { useStockMovementsStore, type StockMovement } from './stockMovementsStore';
export { useNetworkSyncStore } from './networkSyncStore';
export { useLotsStore, type Lot } from './lotsStore';
export { useSettingsStore } from './settingsStore';
export { useSyncStore } from './syncStore';
export { useThemeStore } from './themeStore';

// Treasury stores (split for maintainability)
export {
    useTreasuryStore,
    useTreasuryFacade,
    useCashSessionStore,
    useSafeStore,
    useSinkingFundsStore,
    useExpensesStore
} from './treasury';

// Re-export treasury types
export type {
    CashSession,
    CashMovement,
    SinkingFund,
    SinkingFundTransaction,
    SafeTransaction,
    Expense,
    ExpenseCategory
} from './treasury';

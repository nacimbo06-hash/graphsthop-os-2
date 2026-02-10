/**
 * SuperMarket Control OS - Unified Type Definitions
 */

export * from './product';
export * from './sales';
export * from './treasury';
export * from './expiry';
export * from './print';

// ===========================================
// USER & AUTHENTICATION
// ===========================================

export type UserRole = 'owner' | 'manager' | 'cashier' | 'stock_manager' | 'accountant';

// Available modules in the application
export type ModuleId =
  | 'dashboard'
  | 'pos'
  | 'treasury'
  | 'inventory'
  | 'customers'
  | 'suppliers'
  | 'reports'
  | 'print'
  | 'settings'
  | 'users'
  | 'help';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  firstNameAr?: string;
  lastNameAr?: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: Date | string;
  createdAt: Date | string;
  // Module access permissions (if undefined, uses role defaults)
  moduleAccess?: ModuleId[];
}

export interface AuthCredentials {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ===========================================
// CUSTOMERS & LOYALTY
// ===========================================

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Customer {
  id: string;
  code: string;
  firstName?: string;
  lastName?: string;
  firstNameAr?: string;
  lastNameAr?: string;
  phone: string;
  email?: string;
  address?: string;
  wilaya?: string;
  loyaltyTier: LoyaltyTier;
  loyaltyPoints: number;
  totalSpent: number;
  creditLimit: number;
  currentDebt: number;
  paymentTerms: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// ===========================================
// API RESPONSES & SHARED
// ===========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

// ===========================================
// SETTINGS & SYNC
// ===========================================

export interface AppSettings {
  general: {
    storeName: string;
    storeNameAr?: string;
    currency: string;
    language: string;
    timezone: string;
    dateFormat: string;
  };
  pos: {
    autoPrintReceipt: boolean;
    allowPriceOverride: boolean;
    requireCustomer: boolean;
    defaultPaymentMethod: 'cash' | 'card' | 'dahabia';
  };
  loyalty: {
    pointsPer10DA: number;
    minRedeemPoints: number;
    pointsValue: number;
  };
  tax: {
    defaultVatRate: number;
    foodVatRate: number;
  };
  printer: {
    type: 'escpos' | 'browser';
    name?: string;
    connectionType: 'usb' | 'network' | 'bluetooth';
    ipAddress?: string;
  };
}

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export interface PendingOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  resource: 'product' | 'sale' | 'customer' | 'supplier' | 'expense';
  data: any;
  timestamp: Date;
  retryCount: number;
}


/**
 * API Services Barrel Export
 */

export { authApi } from './auth';
export { productsApi } from './products';
export { salesApi } from './sales';
export { treasuryApi } from './treasury';
export { syncApi } from './sync';

// Re-export types
export type { LoginRequest, LoginResponse, RegisterRequest } from './auth';
export type { ProductFilters, ProductsListResponse } from './products';
export type { SaleCreateRequest, SalesFilters, SalesListResponse, DailyReportResponse } from './sales';
export type { OpenSessionRequest, CloseSessionRequest, AddMovementRequest, CreateExpenseRequest, SessionSummary } from './treasury';
export type { SyncItem, SyncEntityType, SyncPushRequest, SyncPullRequest, SyncConflict, SyncStatus, ConflictResolution } from './sync';

/**
 * React Query Hooks for API Integration
 * 
 * Provides type-safe React Query hooks for all API endpoints.
 * Uses TanStack Query for caching, refetching, and state management.
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { api, API_CONFIG } from '../api';
import type { Product } from '@core/types/product';
import type { Sale } from '@core/types/sales';
import type { ApiResponse } from '../api/client';
import type {
    ProductFilters,
    SaleCreateRequest,
    SalesFilters,
    OpenSessionRequest,
    CloseSessionRequest,
    AddMovementRequest,
} from '../api/services';

// ===== QUERY KEYS =====

export const queryKeys = {
    products: {
        all: ['products'] as const,
        list: (filters?: ProductFilters) => ['products', 'list', filters] as const,
        detail: (id: string) => ['products', 'detail', id] as const,
        byBarcode: (barcode: string) => ['products', 'barcode', barcode] as const,
    },
    sales: {
        all: ['sales'] as const,
        list: (filters?: SalesFilters) => ['sales', 'list', filters] as const,
        detail: (id: string) => ['sales', 'detail', id] as const,
        dailyReport: (date?: string) => ['sales', 'daily-report', date] as const,
    },
    treasury: {
        all: ['treasury'] as const,
        currentSession: ['treasury', 'current-session'] as const,
        sessions: (filters?: any) => ['treasury', 'sessions', filters] as const,
        movements: ['treasury', 'movements'] as const,
        safe: ['treasury', 'safe'] as const,
        expenses: (filters?: any) => ['treasury', 'expenses', filters] as const,
    },
    sync: {
        status: ['sync', 'status'] as const,
    },
} as const;

// ===== PRODUCTS HOOKS =====

export function useProducts(filters?: ProductFilters, options?: Partial<UseQueryOptions>) {
    return useQuery({
        queryKey: queryKeys.products.list(filters),
        queryFn: () => api.products.getAll(filters),
        enabled: !API_CONFIG.MOCK_MODE,
        ...options,
    });
}

export function useProduct(id: string, options?: Partial<UseQueryOptions>) {
    return useQuery({
        queryKey: queryKeys.products.detail(id),
        queryFn: () => api.products.getById(id),
        enabled: !API_CONFIG.MOCK_MODE && !!id,
        ...options,
    });
}

export function useProductByBarcode(barcode: string, options?: Partial<UseQueryOptions>) {
    return useQuery({
        queryKey: queryKeys.products.byBarcode(barcode),
        queryFn: () => api.products.getByBarcode(barcode),
        enabled: !API_CONFIG.MOCK_MODE && !!barcode,
        ...options,
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (product: Omit<Product, 'id'>) => api.products.create(product),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
        },
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
            api.products.update(id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
        },
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => api.products.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
        },
    });
}

// ===== SALES HOOKS =====

export function useSales(filters?: SalesFilters, options?: Partial<UseQueryOptions>) {
    return useQuery({
        queryKey: queryKeys.sales.list(filters),
        queryFn: () => api.sales.getAll(filters),
        enabled: !API_CONFIG.MOCK_MODE,
        ...options,
    });
}

export function useSale(id: string, options?: Partial<UseQueryOptions>) {
    return useQuery({
        queryKey: queryKeys.sales.detail(id),
        queryFn: () => api.sales.getById(id),
        enabled: !API_CONFIG.MOCK_MODE && !!id,
        ...options,
    });
}

export function useDailyReport(date?: string, options?: Partial<UseQueryOptions>) {
    return useQuery({
        queryKey: queryKeys.sales.dailyReport(date),
        queryFn: () => api.sales.getDailyReport(date),
        enabled: !API_CONFIG.MOCK_MODE,
        ...options,
    });
}

export function useCreateSale() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (sale: SaleCreateRequest) => api.sales.create(sale),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.sales.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.treasury.currentSession });
        },
    });
}

// ===== TREASURY HOOKS =====

export function useCurrentSession(options?: Partial<UseQueryOptions>) {
    return useQuery({
        queryKey: queryKeys.treasury.currentSession,
        queryFn: () => api.treasury.getCurrentSession(),
        enabled: !API_CONFIG.MOCK_MODE,
        ...options,
    });
}

export function useOpenSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: OpenSessionRequest) => api.treasury.openSession(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.treasury.all });
        },
    });
}

export function useCloseSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: CloseSessionRequest) => api.treasury.closeSession(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.treasury.all });
        },
    });
}

export function useAddMovement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: AddMovementRequest) => api.treasury.addMovement(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.treasury.currentSession });
            queryClient.invalidateQueries({ queryKey: queryKeys.treasury.movements });
        },
    });
}

// ===== SYNC HOOKS =====

export function useSyncStatus(options?: Partial<UseQueryOptions>) {
    return useQuery({
        queryKey: queryKeys.sync.status,
        queryFn: () => api.sync.getStatus(),
        refetchInterval: 30000, // Refresh every 30 seconds
        ...options,
    });
}

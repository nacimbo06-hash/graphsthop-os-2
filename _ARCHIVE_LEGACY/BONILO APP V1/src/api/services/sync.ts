/**
 * Sync API Service
 * 
 * Handles data synchronization between local store and backend.
 * Implements offline-first sync strategy with conflict resolution.
 */

import { apiClient, ApiResponse } from '../client';
import { API_CONFIG, ENDPOINTS } from '../config';

// ===== TYPES =====

export type SyncEntityType = 'products' | 'sales' | 'customers' | 'suppliers' | 'treasury' | 'inventory';

export interface SyncItem {
    id: string;
    entityType: SyncEntityType;
    action: 'create' | 'update' | 'delete';
    data: Record<string, unknown>;
    timestamp: string;
    localVersion: number;
}

export interface SyncPushRequest {
    items: SyncItem[];
    deviceId: string;
    lastSyncTimestamp?: string;
}

export interface SyncPushResponse {
    success: boolean;
    synced: string[];
    conflicts: SyncConflict[];
    serverTimestamp: string;
}

export interface SyncPullRequest {
    entityTypes: SyncEntityType[];
    lastSyncTimestamp?: string;
    deviceId: string;
}

export interface SyncPullResponse {
    items: SyncItem[];
    serverTimestamp: string;
    hasMore: boolean;
}

export interface SyncConflict {
    id: string;
    entityType: SyncEntityType;
    localData: Record<string, unknown>;
    serverData: Record<string, unknown>;
    localTimestamp: string;
    serverTimestamp: string;
}

export interface SyncStatus {
    lastSync: string | null;
    pendingItems: number;
    conflictCount: number;
    isOnline: boolean;
}

export type ConflictResolution = 'local' | 'server' | 'merge';

// ===== SYNC SERVICE =====

export const syncApi = {
    /**
     * Push local changes to server
     */
    async push(request: SyncPushRequest): Promise<ApiResponse<SyncPushResponse>> {
        if (API_CONFIG.MOCK_MODE) {
            return {
                success: true,
                data: {
                    success: true,
                    synced: request.items.map(i => i.id),
                    conflicts: [],
                    serverTimestamp: new Date().toISOString(),
                },
            };
        }
        return apiClient.post<SyncPushResponse>(ENDPOINTS.SYNC.PUSH, request);
    },

    /**
     * Pull changes from server
     */
    async pull(request: SyncPullRequest): Promise<ApiResponse<SyncPullResponse>> {
        if (API_CONFIG.MOCK_MODE) {
            return {
                success: true,
                data: {
                    items: [],
                    serverTimestamp: new Date().toISOString(),
                    hasMore: false,
                },
            };
        }
        return apiClient.post<SyncPullResponse>(ENDPOINTS.SYNC.PULL, request);
    },

    /**
     * Get current sync status
     */
    async getStatus(): Promise<ApiResponse<SyncStatus>> {
        if (API_CONFIG.MOCK_MODE) {
            return {
                success: true,
                data: {
                    lastSync: null,
                    pendingItems: 0,
                    conflictCount: 0,
                    isOnline: navigator.onLine,
                },
            };
        }
        return apiClient.get<SyncStatus>(ENDPOINTS.SYNC.STATUS);
    },

    /**
     * Resolve a sync conflict
     */
    async resolveConflict(
        conflictId: string,
        resolution: ConflictResolution,
        mergedData?: Record<string, unknown>
    ): Promise<ApiResponse<void>> {
        if (API_CONFIG.MOCK_MODE) {
            return { success: true };
        }
        return apiClient.post<void>(ENDPOINTS.SYNC.CONFLICT, {
            conflictId,
            resolution,
            mergedData,
        });
    },
};

export default syncApi;

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SyncStatus, PendingOperation } from '@shared/types';

interface SyncState {
    isOnline: boolean;
    lastSyncTime: Date | null;
    syncStatus: SyncStatus;
    pendingOperations: PendingOperation[];

    // Actions
    setOnlineStatus: (isOnline: boolean) => void;
    addPendingOperation: (operation: Omit<PendingOperation, 'id' | 'timestamp' | 'retryCount'>) => void;
    removePendingOperation: (id: string) => void;
    clearPendingOperations: () => void;
    syncNow: () => Promise<void>;
    setLastSyncTime: (time: Date) => void;
}

export const useSyncStore = create<SyncState>()(
    persist(
        (set, get) => ({
            isOnline: navigator.onLine,
            lastSyncTime: null,
            syncStatus: 'idle' as SyncStatus,
            pendingOperations: [],

            setOnlineStatus: (isOnline: boolean) => {
                set({ isOnline });

                // Auto-sync when coming back online
                if (isOnline && get().pendingOperations.length > 0) {
                    get().syncNow();
                }
            },

            addPendingOperation: (operation) => {
                const newOperation: PendingOperation = {
                    id: Date.now().toString(),
                    ...operation,
                    timestamp: new Date(),
                    retryCount: 0,
                };

                set((state) => ({
                    pendingOperations: [...state.pendingOperations, newOperation],
                }));
            },

            removePendingOperation: (id: string) => {
                set((state) => ({
                    pendingOperations: state.pendingOperations.filter(op => op.id !== id),
                }));
            },

            clearPendingOperations: () => {
                set({ pendingOperations: [] });
            },

            syncNow: async () => {
                const { isOnline, pendingOperations } = get();

                if (!isOnline || pendingOperations.length === 0) {
                    return;
                }

                set({ syncStatus: 'syncing' });

                // SECURITY FIX: Take a snapshot of operations to prevent TOCTOU race condition
                const operationsToSync = [...pendingOperations];
                const successfulIds: string[] = [];
                const failedIds = new Map<string, number>();

                try {
                    // Process each pending operation from snapshot
                    for (const operation of operationsToSync) {
                        try {
                            // TODO: Replace with actual API call
                            // await api.sync(operation);
                            await new Promise(resolve => setTimeout(resolve, 100));

                            // Mark as successful (don't mutate state during iteration)
                            successfulIds.push(operation.id);
                        } catch (error) {
                            // Track failed operations
                            failedIds.set(operation.id, operation.retryCount + 1);
                            console.error('Failed to sync operation:', operation.id, error);
                        }
                    }

                    // ATOMIC state update after all processing completes
                    set((state) => ({
                        pendingOperations: state.pendingOperations
                            .filter(op => !successfulIds.includes(op.id))
                            .map(op =>
                                failedIds.has(op.id)
                                    ? { ...op, retryCount: failedIds.get(op.id)! }
                                    : op
                            ),
                        syncStatus: 'success',
                        lastSyncTime: new Date(),
                    }));

                    // Check for new operations added during sync
                    const currentOps = get().pendingOperations;
                    if (currentOps.length > 0) {
                        console.log('[SYNC] New operations detected during sync, scheduling retry...');
                        setTimeout(() => get().syncNow(), 1000);
                    }

                    // Reset status after a delay
                    setTimeout(() => {
                        set({ syncStatus: 'idle' });
                    }, 3000);
                } catch (error) {
                    set({ syncStatus: 'error' });
                    console.error('Sync failed:', error);
                }
            },

            setLastSyncTime: (time: Date) => {
                set({ lastSyncTime: time });
            },
        }),
        {
            name: 'sync-storage',
            partialize: (state) => ({
                lastSyncTime: state.lastSyncTime,
                pendingOperations: state.pendingOperations,
            }),
        }
    )
);

// Listen for online/offline events
if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
        useSyncStore.getState().setOnlineStatus(true);
    });

    window.addEventListener('offline', () => {
        useSyncStore.getState().setOnlineStatus(false);
    });
}

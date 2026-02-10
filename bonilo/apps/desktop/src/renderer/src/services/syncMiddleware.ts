/**
 * Sync Utilities for Network Synchronization
 * Helper functions to sync data with the network server
 */

import { getSyncClient } from './syncClient';
import { useNetworkSyncStore } from '@asgard/shared/stores';

/**
 * Sync a specific item to the network
 */
export async function syncItem(collectionName: string, item: unknown): Promise<void> {
    const networkState = useNetworkSyncStore.getState();
    if (networkState.mode === 'standalone') return;

    const client = getSyncClient();
    await client.upsert(collectionName, item);
}

/**
 * Sync multiple items to the network
 */
export async function syncItems(collectionName: string, items: unknown[]): Promise<void> {
    const networkState = useNetworkSyncStore.getState();
    if (networkState.mode === 'standalone') return;

    const client = getSyncClient();
    await client.upsert(collectionName, items);
}

/**
 * Sync deletion of an item
 */
export async function syncDelete(collectionName: string, id: string): Promise<void> {
    const networkState = useNetworkSyncStore.getState();
    if (networkState.mode === 'standalone') return;

    const client = getSyncClient();
    await client.delete(collectionName, id);
}

/**
 * Perform a full sync of a collection
 */
export async function fullSync(collectionName: string): Promise<unknown[]> {
    const networkState = useNetworkSyncStore.getState();
    if (networkState.mode === 'standalone') return [];

    const client = getSyncClient();
    return await client.fetchCollection(collectionName, 0);
}

/**
 * Perform a full sync of all collections
 */
export async function fullSyncAll(): Promise<Record<string, unknown[]>> {
    const networkState = useNetworkSyncStore.getState();
    if (networkState.mode === 'standalone') return {};

    const client = getSyncClient();
    return await client.fetchFullSync();
}

/**
 * Check if app is in network mode
 */
export function isNetworkMode(): boolean {
    return useNetworkSyncStore.getState().mode !== 'standalone';
}

/**
 * Check if connected (either as server or client)
 */
export function isConnected(): boolean {
    const state = useNetworkSyncStore.getState();
    return state.clientConnected || state.serverRunning;
}

/**
 * IGO Network Sync Store
 * Manages LAN synchronization state: server mode (main PC) or client mode (cashier)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSyncClient } from '../services/syncClient';

export type NetworkMode = 'standalone' | 'server' | 'client';

export interface NetworkSyncState {
    // Mode configuration
    mode: NetworkMode;

    // Server mode state (when this PC is the main/server)
    serverRunning: boolean;
    serverPort: number;
    serverIps: string[];
    connectedClients: Array<{ id: string; name: string; connectedAt: number }>;

    // Client mode state (when this PC is a cashier/client)
    clientConnected: boolean;
    serverAddress: string;
    lastSyncTime: number | null;
    pendingChanges: number;

    // UI state
    showSetupModal: boolean;
    connectionError: string | null;

    // Actions
    setMode: (mode: NetworkMode) => void;
    setShowSetupModal: (show: boolean) => void;

    // Server actions
    setServerStatus: (running: boolean, port: number, ips: string[]) => void;
    setConnectedClients: (clients: Array<{ id: string; name: string; connectedAt: number }>) => void;

    // Client actions
    connectToServer: (address: string, port?: number) => Promise<boolean>;
    disconnectFromServer: () => void;
    setConnectionError: (error: string | null) => void;
    updateClientStatus: () => void;
}

export const useNetworkSyncStore = create<NetworkSyncState>()(
    persist(
        (set, get) => ({
            // Initial state
            mode: 'standalone',

            // Server state
            serverRunning: false,
            serverPort: 9876,
            serverIps: [],
            connectedClients: [],

            // Client state
            clientConnected: false,
            serverAddress: '',
            lastSyncTime: null,
            pendingChanges: 0,

            // UI state
            showSetupModal: false,
            connectionError: null,

            // Actions
            setMode: (mode) => set({ mode }),

            setShowSetupModal: (show) => set({ showSetupModal: show }),

            setServerStatus: (running, port, ips) => set({
                serverRunning: running,
                serverPort: port,
                serverIps: ips
            }),

            setConnectedClients: (clients) => set({ connectedClients: clients }),

            connectToServer: async (address, port = 9876) => {
                set({ connectionError: null });

                try {
                    const client = getSyncClient();
                    if (!client) {
                        console.warn('Sync client not available');
                        return false;
                    }
                    const connected = await client.connect(address, port);

                    if (connected) {
                        set({
                            mode: 'client',
                            clientConnected: true,
                            serverAddress: `${address}:${port}`,
                            lastSyncTime: Date.now(),
                            connectionError: null
                        });

                        // Set up connection listener
                        client.onConnection?.((isConnected: boolean) => {
                            set({
                                clientConnected: isConnected,
                                pendingChanges: client.getStatus().queueSize
                            });

                            if (isConnected) {
                                set({ lastSyncTime: Date.now() });
                            }
                        });

                        return true;
                    } else {
                        set({ connectionError: 'Impossible de se connecter au serveur' });
                        return false;
                    }
                } catch (error) {
                    console.error('[NetworkSync] Connection error:', error);
                    set({ connectionError: 'Erreur de connexion au serveur' });
                    return false;
                }
            },

            disconnectFromServer: () => {
                const client = getSyncClient();
                if (client) {
                    client.disconnect();
                    set({
                        mode: 'standalone',
                        clientConnected: false,
                        serverAddress: '',
                        lastSyncTime: null,
                    });
                }
                set({
                    mode: 'standalone',
                    clientConnected: false,
                    serverAddress: '',
                    lastSyncTime: null,
                    pendingChanges: 0,
                    connectionError: null
                });
            },

            setConnectionError: (error) => set({ connectionError: error }),

            updateClientStatus: () => {
                const client = getSyncClient();
                if (client) {
                    const status = client.getStatus();
                    set({
                        clientConnected: status.connected,
                        pendingChanges: status.queueSize
                    });
                }
            }
        }),
        {
            name: 'igo-network-sync-storage',
            partialize: (state) => ({
                mode: state.mode,
                serverPort: state.serverPort,
                serverAddress: state.serverAddress
            })
        }
    )
);

// Helper hooks
export function useIsNetworkMode(): boolean {
    return useNetworkSyncStore(state => state.mode !== 'standalone');
}

export function useIsServerMode(): boolean {
    return useNetworkSyncStore(state => state.mode === 'server');
}

export function useIsClientMode(): boolean {
    return useNetworkSyncStore(state => state.mode === 'client');
}

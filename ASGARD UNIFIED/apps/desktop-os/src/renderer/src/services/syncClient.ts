/**
 * IGO Sync Client
 * Runs on cashier PCs and connects to the main server
 */

// Generate UUID using browser's crypto API
const generateUUID = (): string => crypto.randomUUID();

// Types
interface SyncMessage {
    type: 'sync' | 'update' | 'delete' | 'full_sync' | 'ping' | 'pong' | 'welcome';
    collection?: string;
    data?: unknown;
    id?: string;
    timestamp: number;
    clientId?: string;
}

interface SyncQueueItem {
    id: string;
    collection: string;
    action: 'upsert' | 'delete';
    data?: unknown;
    itemId?: string;
    timestamp: number;
    retries: number;
}

type MessageHandler = (collection: string, data: unknown, isDelete?: boolean) => void;
type ConnectionHandler = (connected: boolean) => void;

export class SyncClient {
    private serverUrl: string = '';
    private wsUrl: string = '';
    private ws: WebSocket | null = null;
    private clientId: string;
    private isConnected: boolean = false;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 10;
    private reconnectDelay: number = 2000;
    private pingInterval: NodeJS.Timeout | null = null;
    private syncQueue: SyncQueueItem[] = [];
    private messageHandlers: Map<string, MessageHandler[]> = new Map();
    private connectionHandlers: ConnectionHandler[] = [];
    private lastSyncTimestamp: Map<string, number> = new Map();

    constructor() {
        this.clientId = this.getOrCreateClientId();
        this.loadSyncQueue();
    }

    private getOrCreateClientId(): string {
        const stored = localStorage.getItem('igo-client-id');
        if (stored) return stored;

        const id = generateUUID();
        localStorage.setItem('igo-client-id', id);
        return id;
    }

    private loadSyncQueue(): void {
        const stored = localStorage.getItem('igo-sync-queue');
        if (stored) {
            this.syncQueue = JSON.parse(stored);
        }
    }

    private saveSyncQueue(): void {
        localStorage.setItem('igo-sync-queue', JSON.stringify(this.syncQueue));
    }

    public async connect(serverAddress: string, port: number = 9876): Promise<boolean> {
        this.serverUrl = `http://${serverAddress}:${port}`;
        this.wsUrl = `ws://${serverAddress}:${port}`;

        try {
            // Test connection with health check
            const response = await fetch(`${this.serverUrl}/health`, {
                signal: AbortSignal.timeout(5000)
            });

            if (!response.ok) {
                throw new Error('Server health check failed');
            }

            // Connect WebSocket
            await this.connectWebSocket();

            // Process queued items
            await this.processQueue();

            return true;
        } catch (error) {
            console.error('[Sync Client] Connection failed:', error);
            return false;
        }
    }

    private connectWebSocket(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.ws) {
                this.ws.close();
            }

            this.ws = new WebSocket(this.wsUrl);

            this.ws.onopen = () => {
                console.log('[Sync Client] WebSocket connected');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.startPingInterval();
                this.notifyConnectionHandlers(true);
                resolve();
            };

            this.ws.onmessage = (event) => {
                try {
                    const msg: SyncMessage = JSON.parse(event.data);
                    this.handleMessage(msg);
                } catch (error) {
                    console.error('[Sync Client] Error parsing message:', error);
                }
            };

            this.ws.onclose = () => {
                console.log('[Sync Client] WebSocket disconnected');
                this.isConnected = false;
                this.stopPingInterval();
                this.notifyConnectionHandlers(false);
                this.attemptReconnect();
            };

            this.ws.onerror = (error) => {
                console.error('[Sync Client] WebSocket error:', error);
                reject(error);
            };
        });
    }

    private handleMessage(msg: SyncMessage): void {
        switch (msg.type) {
            case 'welcome':
                console.log('[Sync Client] Received welcome, server assigned ID:', msg.clientId);
                break;

            case 'pong':
                // Server is alive
                break;

            case 'sync':
            case 'update':
                if (msg.collection && msg.data) {
                    // Don't process our own updates
                    if (msg.clientId !== this.clientId) {
                        this.notifyHandlers(msg.collection, msg.data, false);
                    }
                    // Update last sync timestamp
                    this.lastSyncTimestamp.set(msg.collection, msg.timestamp);
                }
                break;

            case 'delete':
                if (msg.collection && msg.id) {
                    if (msg.clientId !== this.clientId) {
                        this.notifyHandlers(msg.collection, { id: msg.id }, true);
                    }
                }
                break;
        }
    }

    private notifyHandlers(collection: string, data: unknown, isDelete: boolean): void {
        const handlers = this.messageHandlers.get(collection) || [];
        handlers.forEach(handler => handler(collection, data, isDelete));

        // Also notify global handlers
        const globalHandlers = this.messageHandlers.get('*') || [];
        globalHandlers.forEach(handler => handler(collection, data, isDelete));
    }

    private notifyConnectionHandlers(connected: boolean): void {
        this.connectionHandlers.forEach(handler => handler(connected));
    }

    private startPingInterval(): void {
        this.stopPingInterval();
        this.pingInterval = setInterval(() => {
            if (this.ws && this.isConnected) {
                this.ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
            }
        }, 30000);
    }

    private stopPingInterval(): void {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }

    private attemptReconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('[Sync Client] Max reconnect attempts reached');
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);

        console.log(`[Sync Client] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

        setTimeout(() => {
            if (!this.isConnected && this.wsUrl) {
                this.connectWebSocket().catch(() => {
                    // Will retry via onclose handler
                });
            }
        }, delay);
    }

    // Public API

    public async upsert(collection: string, data: unknown | unknown[]): Promise<void> {
        const items = Array.isArray(data) ? data : [data];

        if (this.isConnected) {
            try {
                const response = await fetch(`${this.serverUrl}/api/${collection}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Client-Id': this.clientId
                    },
                    body: JSON.stringify(items)
                });

                if (!response.ok) {
                    throw new Error('Upsert failed');
                }
            } catch (error) {
                console.error('[Sync Client] Upsert failed, queueing:', error);
                this.queueAction('upsert', collection, items);
            }
        } else {
            this.queueAction('upsert', collection, items);
        }
    }

    public async delete(collection: string, id: string): Promise<void> {
        if (this.isConnected) {
            try {
                const response = await fetch(`${this.serverUrl}/api/${collection}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-Client-Id': this.clientId
                    }
                });

                if (!response.ok) {
                    throw new Error('Delete failed');
                }
            } catch (error) {
                console.error('[Sync Client] Delete failed, queueing:', error);
                this.queueAction('delete', collection, undefined, id);
            }
        } else {
            this.queueAction('delete', collection, undefined, id);
        }
    }

    public async fetchCollection(collection: string, since?: number): Promise<unknown[]> {
        if (!this.isConnected) {
            return [];
        }

        try {
            const sinceTs = since || this.lastSyncTimestamp.get(collection) || 0;
            const response = await fetch(`${this.serverUrl}/api/${collection}?since=${sinceTs}`, {
                headers: {
                    'X-Client-Id': this.clientId
                }
            });

            if (!response.ok) {
                throw new Error('Fetch failed');
            }

            const result = await response.json();
            this.lastSyncTimestamp.set(collection, result.timestamp);
            return result.items;
        } catch (error) {
            console.error('[Sync Client] Fetch failed:', error);
            return [];
        }
    }

    public async fetchFullSync(): Promise<Record<string, unknown[]>> {
        if (!this.isConnected) {
            return {};
        }

        try {
            const response = await fetch(`${this.serverUrl}/api/sync/full`, {
                headers: {
                    'X-Client-Id': this.clientId
                }
            });

            if (!response.ok) {
                throw new Error('Full sync failed');
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('[Sync Client] Full sync failed:', error);
            return {};
        }
    }

    private queueAction(action: 'upsert' | 'delete', collection: string, data?: unknown, itemId?: string): void {
        const item: SyncQueueItem = {
            id: generateUUID(),
            collection,
            action,
            data,
            itemId,
            timestamp: Date.now(),
            retries: 0
        };

        this.syncQueue.push(item);
        this.saveSyncQueue();
    }

    private async processQueue(): Promise<void> {
        if (this.syncQueue.length === 0) return;

        console.log(`[Sync Client] Processing ${this.syncQueue.length} queued items`);

        const itemsToRemove: string[] = [];

        for (const item of this.syncQueue) {
            try {
                if (item.action === 'upsert') {
                    const response = await fetch(`${this.serverUrl}/api/${item.collection}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Client-Id': this.clientId
                        },
                        body: JSON.stringify(item.data)
                    });

                    if (response.ok) {
                        itemsToRemove.push(item.id);
                    }
                } else if (item.action === 'delete' && item.itemId) {
                    const response = await fetch(`${this.serverUrl}/api/${item.collection}/${item.itemId}`, {
                        method: 'DELETE',
                        headers: {
                            'X-Client-Id': this.clientId
                        }
                    });

                    if (response.ok) {
                        itemsToRemove.push(item.id);
                    }
                }
            } catch (error) {
                console.error('[Sync Client] Queue item failed:', error);
                item.retries++;
            }
        }

        // Remove successfully processed items
        this.syncQueue = this.syncQueue.filter(item => !itemsToRemove.includes(item.id));
        this.saveSyncQueue();
    }

    // Event handlers

    public onMessage(collection: string, handler: MessageHandler): () => void {
        const handlers = this.messageHandlers.get(collection) || [];
        handlers.push(handler);
        this.messageHandlers.set(collection, handlers);

        return () => {
            const current = this.messageHandlers.get(collection) || [];
            this.messageHandlers.set(collection, current.filter(h => h !== handler));
        };
    }

    public onConnection(handler: ConnectionHandler): () => void {
        this.connectionHandlers.push(handler);
        return () => {
            this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
        };
    }

    // Status

    public getStatus(): { connected: boolean; serverUrl: string; queueSize: number } {
        return {
            connected: this.isConnected,
            serverUrl: this.serverUrl,
            queueSize: this.syncQueue.length
        };
    }

    public disconnect(): void {
        this.stopPingInterval();
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.isConnected = false;
        this.serverUrl = '';
        this.wsUrl = '';
    }
}

// Singleton instance
let syncClientInstance: SyncClient | null = null;

export function getSyncClient(): SyncClient {
    if (!syncClientInstance) {
        syncClientInstance = new SyncClient();
    }
    return syncClientInstance;
}

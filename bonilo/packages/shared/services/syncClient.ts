/**
 * Basic sync client interface for @asgard/shared
 * Real implementation should be provided by consuming app
 */

export interface SyncClient {
  connect(address: string, port: number): Promise<boolean>;
  disconnect(): void;
  startServer(port: number): Promise<void>;
  getStatus(): { connected: boolean; queueSize: number };
}

// Mock implementation for now
const createMockSyncClient = (): SyncClient => ({
  connect: async () => false,
  disconnect: () => {},
  startServer: async () => {},
  getStatus: () => ({ connected: false, queueSize: 0 })
});

export const getSyncClient = (): SyncClient => {
  // This should be overridden by the actual app
  return createMockSyncClient();
};
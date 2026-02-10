import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DBService } from '../dbService';

describe('DBService', () => {
    let dbService: DBService;
    let mockDb: any;

    beforeEach(() => {
        mockDb = {
            execute: vi.fn(),
            select: vi.fn(),
        };
        dbService = new DBService();
        // Access private db property for testing
        (dbService as any).db = mockDb;
    });

    describe('upsert', () => {
        it('should insert items into valid collections', async () => {
            const items = [
                { id: '1', name: 'Test Product' },
                { id: '2', name: 'Another Product' },
            ];

            mockDb.execute.mockResolvedValue(undefined);

            await dbService.upsert('products', items);

            expect(mockDb.execute).toHaveBeenCalledTimes(2);
            expect(mockDb.execute).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO products'),
                expect.arrayContaining([expect.any(String), expect.any(String), expect.any(Number)])
            );
        });

        it('should throw error for invalid collection names', async () => {
            const items = [{ id: '1', name: 'Test' }];

            await expect(dbService.upsert('invalid_collection', items)).rejects.toThrow(
                'Invalid collection name: invalid_collection'
            );
        });

        it('should prevent SQL injection in collection names', async () => {
            const items = [{ id: '1', name: 'Test' }];
            const maliciousCollection = 'products; DROP TABLE users; --';

            await expect(dbService.upsert(maliciousCollection, items)).rejects.toThrow(
                `Invalid collection name: ${maliciousCollection}`
            );
        });
    });

    describe('get', () => {
        it('should retrieve items from valid collections', async () => {
            const mockRows = [
                { data: JSON.stringify({ id: '1', name: 'Product 1' }) },
                { data: JSON.stringify({ id: '2', name: 'Product 2' }) },
            ];
            mockDb.select.mockResolvedValue(mockRows);

            const result = await dbService.get('products', 0);

            expect(mockDb.select).toHaveBeenCalledWith(
                expect.stringContaining('SELECT data FROM products'),
                [0]
            );
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({ id: '1', name: 'Product 1' });
        });

        it('should throw error for invalid collection names in get', async () => {
            await expect(dbService.get('invalid_collection')).rejects.toThrow(
                'Invalid collection name: invalid_collection'
            );
        });

        it('should prevent SQL injection in get collection names', async () => {
            const maliciousCollection = "users' OR '1'='1";

            await expect(dbService.get(maliciousCollection)).rejects.toThrow(
                `Invalid collection name: ${maliciousCollection}`
            );
        });
    });

    describe('delete', () => {
        it('should soft delete items from valid collections', async () => {
            mockDb.execute.mockResolvedValue(undefined);

            await dbService.delete('products', 'item-123');

            expect(mockDb.execute).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE products SET deleted = 1'),
                expect.arrayContaining([expect.any(Number), 'item-123'])
            );
        });

        it('should throw error for invalid collection names in delete', async () => {
            await expect(dbService.delete('invalid_collection', 'id')).rejects.toThrow(
                'Invalid collection name: invalid_collection'
            );
        });
    });

    describe('Allowed Collections', () => {
        it('should only allow whitelisted collections', async () => {
            const allowedCollections = [
                'products', 'sales', 'customers', 'suppliers',
                'goods_receipts', 'purchase_orders', 'inventory_movements',
                'treasury_movements', 'expenses', 'safe_transactions',
                'sinking_funds', 'users', 'settings', 'store_settings'
            ];

            mockDb.execute.mockResolvedValue(undefined);
            mockDb.select.mockResolvedValue([]);

            // All allowed collections should work
            for (const collection of allowedCollections) {
                await expect(dbService.get(collection)).resolves.toBeDefined();
                await expect(dbService.upsert(collection, [])).resolves.toBeUndefined();
                await expect(dbService.delete(collection, 'test-id')).resolves.toBeUndefined();
            }
        });
    });
});

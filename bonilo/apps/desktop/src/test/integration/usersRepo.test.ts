import { describe, it, expect, beforeAll, vi } from 'vitest';

// Initialize mock window for Tauri detection
if (typeof window === 'undefined') {
    (global as any).window = {};
}
(global as any).window.__TAURI_INTERNALS__ = {};

// Mock the Tauri SQL plugin using better-sqlite3 in-memory
vi.mock('@tauri-apps/plugin-sql', async () => {
    const Database = (await import('better-sqlite3')).default;
    const db = new Database(':memory:');

    return {
        default: {
            load: async () => ({
                execute: async (sql: string, params: any[] = []) => {
                    const convertedSql = sql.replace(/\$\d+/g, '?');
                    const stmt = db.prepare(convertedSql);
                    const result = stmt.run(...params);
                    return { rowsAffected: result.changes, lastInsertId: Number(result.lastInsertRowid) };
                },
                select: async (sql: string, params: any[] = []) => {
                    const convertedSql = sql.replace(/\$\d+/g, '?');
                    const stmt = db.prepare(convertedSql);
                    return stmt.all(...params);
                }
            })
        }
    };
});

import { db } from '@shared/db/database';
import { usersRepo } from '@shared/db/usersRepo';
import type { User } from '@shared/types';

const makeUser = (over: Partial<User> = {}): User => ({
    id: 'u_owner',
    email: 'owner@shop.dz',
    firstName: 'Sami',
    lastName: 'Bensaid',
    role: 'owner',
    isActive: true,
    twoFactorEnabled: false,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    ...over,
});

describe('usersRepo', () => {
    beforeAll(async () => {
        await db.init();
    });

    it('creates a user with a password hash and loads it back', async () => {
        await usersRepo.create(makeUser(), '$2a$10$hashforowner');

        const users = await usersRepo.loadAll();
        expect(users).toHaveLength(1);
        expect(users[0].email).toBe('owner@shop.dz');
        expect(users[0].firstName).toBe('Sami');
        expect(users[0].role).toBe('owner');
        expect(users[0].isActive).toBe(true);

        // The hash is stored separately, never on the User object.
        expect((users[0] as any).password_hash).toBeUndefined();
        expect(await usersRepo.getPasswordHash('u_owner')).toBe('$2a$10$hashforowner');
        expect(await usersRepo.count()).toBe(1);
    });

    it('round-trips module_access as a JSON array', async () => {
        await usersRepo.create(
            makeUser({ id: 'u_cashier', email: 'cashier@shop.dz', role: 'cashier', moduleAccess: ['pos', 'customers'] }),
            '$2a$10$hashcashier'
        );

        const users = await usersRepo.loadAll();
        const cashier = users.find(u => u.id === 'u_cashier')!;
        expect(cashier.moduleAccess).toEqual(['pos', 'customers']);
    });

    it('updates fields and the password hash independently', async () => {
        await usersRepo.update('u_cashier', { phone: '0555-12-34-56', role: 'stock_manager' });
        await usersRepo.setPasswordHash('u_cashier', '$2a$10$rotated');

        const users = await usersRepo.loadAll();
        const u = users.find(x => x.id === 'u_cashier')!;
        expect(u.phone).toBe('0555-12-34-56');
        expect(u.role).toBe('stock_manager');
        expect(await usersRepo.getPasswordHash('u_cashier')).toBe('$2a$10$rotated');
    });

    it('records last login', async () => {
        await usersRepo.updateLastLogin('u_owner', '2026-06-15T09:30:00.000Z');
        const users = await usersRepo.loadAll();
        const owner = users.find(u => u.id === 'u_owner')!;
        expect(owner.lastLogin).toBe('2026-06-15T09:30:00.000Z');
    });

    it('soft-deletes: the row drops out of loadAll but count still sees it', async () => {
        await usersRepo.remove('u_cashier');
        const users = await usersRepo.loadAll();
        expect(users.find(u => u.id === 'u_cashier')).toBeUndefined();
        // Soft delete keeps the row for audit.
        expect(await usersRepo.count()).toBe(2);
    });
});

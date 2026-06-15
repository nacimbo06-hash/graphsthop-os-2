/**
 * Users Repository
 *
 * Source of truth for application users when running under Tauri. The bcrypt
 * password hash lives in the row (`password_hash`) — it used to sit in
 * localStorage under `sm_user_passwords`. `module_access` is a JSON array
 * string, or NULL to fall back to role defaults.
 */
import { db } from './database';
import type { User, UserRole, ModuleId } from '../types';

interface UserRow {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    first_name_ar: string;
    last_name_ar: string;
    phone: string;
    role: string;
    is_active: number;
    two_factor_enabled: number;
    module_access: string | null;
    password_hash: string;
    last_login: string | null;
    created_at: string;
    updated_at: string;
}

function rowToUser(row: UserRow): User {
    let moduleAccess: ModuleId[] | undefined;
    if (row.module_access) {
        try {
            const parsed = JSON.parse(row.module_access);
            if (Array.isArray(parsed)) moduleAccess = parsed as ModuleId[];
        } catch {
            moduleAccess = undefined;
        }
    }
    return {
        id: row.id,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        firstNameAr: row.first_name_ar || undefined,
        lastNameAr: row.last_name_ar || undefined,
        phone: row.phone || undefined,
        role: row.role as UserRole,
        isActive: row.is_active === 1,
        twoFactorEnabled: row.two_factor_enabled === 1,
        moduleAccess,
        lastLogin: row.last_login || undefined,
        createdAt: row.created_at,
    };
}

function toIso(value: Date | string | undefined): string | undefined {
    if (value === undefined) return undefined;
    return value instanceof Date ? value.toISOString() : value;
}

/** Maps a (partial) User onto DB columns. Always stamps updated_at. */
function userToRow(user: Partial<User>): Record<string, any> {
    const row: Record<string, any> = {};
    if (user.email !== undefined) row.email = user.email;
    if (user.firstName !== undefined) row.first_name = user.firstName;
    if (user.lastName !== undefined) row.last_name = user.lastName;
    if (user.firstNameAr !== undefined) row.first_name_ar = user.firstNameAr || '';
    if (user.lastNameAr !== undefined) row.last_name_ar = user.lastNameAr || '';
    if (user.phone !== undefined) row.phone = user.phone || '';
    if (user.role !== undefined) row.role = user.role;
    if (user.isActive !== undefined) row.is_active = user.isActive ? 1 : 0;
    if (user.twoFactorEnabled !== undefined) row.two_factor_enabled = user.twoFactorEnabled ? 1 : 0;
    if (user.moduleAccess !== undefined) {
        row.module_access = user.moduleAccess && user.moduleAccess.length > 0
            ? JSON.stringify(user.moduleAccess)
            : null;
    }
    if (user.lastLogin !== undefined) row.last_login = toIso(user.lastLogin) ?? null;
    row.updated_at = new Date().toISOString();
    return row;
}

export const usersRepo = {
    async loadAll(): Promise<User[]> {
        const rows = await db.select<UserRow>(
            'SELECT * FROM users WHERE is_active = 1 ORDER BY created_at ASC'
        );
        return rows.map(rowToUser);
    },

    async count(): Promise<number> {
        const rows = await db.select<{ n: number }>('SELECT COUNT(*) AS n FROM users');
        return rows[0]?.n ?? 0;
    },

    async create(user: User, passwordHash: string): Promise<void> {
        const row = userToRow(user);
        row.id = user.id;
        row.password_hash = passwordHash;
        row.created_at = toIso(user.createdAt) ?? new Date().toISOString();
        if (row.is_active === undefined) row.is_active = 1;
        await db.insert('users', row);
    },

    async update(id: string, updates: Partial<User>): Promise<void> {
        const row = userToRow(updates);
        await db.update('users', id, row);
    },

    /** Soft delete — keeps the row for audit, drops it from loadAll(). */
    async remove(id: string): Promise<void> {
        await db.execute(
            'UPDATE users SET is_active = 0, updated_at = $1 WHERE id = $2',
            [new Date().toISOString(), id]
        );
    },

    async getPasswordHash(id: string): Promise<string | null> {
        const rows = await db.select<{ password_hash: string }>(
            'SELECT password_hash FROM users WHERE id = $1',
            [id]
        );
        return rows[0]?.password_hash ?? null;
    },

    async setPasswordHash(id: string, hash: string): Promise<void> {
        await db.execute(
            'UPDATE users SET password_hash = $1, updated_at = $2 WHERE id = $3',
            [hash, new Date().toISOString(), id]
        );
    },

    async updateLastLogin(id: string, whenIso: string): Promise<void> {
        await db.execute(
            'UPDATE users SET last_login = $1, updated_at = $2 WHERE id = $3',
            [whenIso, new Date().toISOString(), id]
        );
    },
};

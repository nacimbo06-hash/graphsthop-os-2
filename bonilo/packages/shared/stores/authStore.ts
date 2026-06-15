import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import bcrypt from 'bcryptjs';
import { secureStorage } from '../utils/secureStorage';
import { usersRepo } from '../db';
import type { User, UserRole, ModuleId } from '@shared/types';

// Constants for secure storage
const SECURE_TOKEN_KEY = 'auth_token_secure';

// Running under Tauri? SQLite is the source of truth; in plain-browser dev we
// fall back to localStorage.
const isTauri = () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

// Permission definitions per role
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
    owner: [
        'all', // Full access to everything
        'manage_users', 'view_reports', 'edit_settings', 'manage_inventory',
        'manage_treasury', 'manage_customers', 'manage_pos', 'view_analytics',
        'export_data', 'backup_data', 'delete_records',
    ],
    manager: [
        'view_reports', 'manage_inventory', 'manage_treasury', 'manage_customers',
        'manage_pos', 'view_analytics', 'edit_settings', 'export_data',
    ],
    cashier: [
        'manage_pos', 'view_customers', 'view_inventory', 'create_sale',
    ],
    stock_manager: [
        'manage_inventory', 'view_reports', 'receive_goods', 'adjust_stock',
        'view_analytics', 'export_data',
    ],
    accountant: [
        'view_reports', 'manage_treasury', 'view_analytics', 'export_data',
        'view_inventory', 'manage_expenses',
    ],
};

// Role labels in French
export const ROLE_LABELS: Record<UserRole, string> = {
    owner: 'Propriétaire',
    manager: 'Gérant',
    cashier: 'Caissier(ère)',
    stock_manager: 'Responsable Stock',
    accountant: 'Comptable',
};

// Module labels in French
export const MODULE_LABELS: Record<ModuleId, string> = {
    dashboard: 'Tableau de bord',
    pos: 'Point de vente (Caisse)',
    treasury: 'Trésorerie',
    inventory: 'Gestion des stocks',
    customers: 'Clients',
    suppliers: 'Fournisseurs',
    reports: 'Rapports',
    print: 'Impression',
    settings: 'Paramètres',
    users: 'Gestion utilisateurs',
    help: 'Aide',
};

// All available modules
export const ALL_MODULES: ModuleId[] = [
    'dashboard', 'pos', 'treasury', 'inventory',
    'customers', 'suppliers', 'reports', 'print', 'settings', 'users', 'help'
];

// Default module access per role
export const DEFAULT_MODULE_ACCESS: Record<UserRole, ModuleId[]> = {
    owner: ALL_MODULES, // Full access
    manager: ['dashboard', 'pos', 'treasury', 'inventory', 'customers', 'suppliers', 'reports', 'print', 'settings', 'help'],
    cashier: ['dashboard', 'pos', 'customers', 'help'],
    stock_manager: ['dashboard', 'inventory', 'suppliers', 'reports', 'print', 'help'],
    accountant: ['dashboard', 'treasury', 'suppliers', 'reports', 'help'],
};

// Predefined users - EMPTY for production, users created during setup
// Password is stored per-user in localStorage alongside the store
export const PREDEFINED_USERS: Array<User & { password: string }> = [];

// Storage key for user passwords (separate from user data for security).
// Under Tauri the hash lives in the users table; this localStorage map is the
// browser-dev fallback (and the migration source on first DB hydrate).
const USER_PASSWORDS_KEY = 'sm_user_passwords';

/** Read a user's bcrypt hash from the DB (Tauri) or localStorage (browser). */
async function getStoredHash(userId: string): Promise<string | null> {
    if (isTauri()) {
        try {
            return await usersRepo.getPasswordHash(userId);
        } catch (e) {
            console.warn('[AuthStore] getPasswordHash failed:', e);
            return null;
        }
    }
    const stored: Record<string, string> = JSON.parse(localStorage.getItem(USER_PASSWORDS_KEY) || '{}');
    return stored[userId] ?? null;
}

/** Persist a user's bcrypt hash to the DB (Tauri) or localStorage (browser). */
async function setStoredHash(userId: string, hash: string): Promise<void> {
    if (isTauri()) {
        await usersRepo.setPasswordHash(userId, hash);
        return;
    }
    const stored: Record<string, string> = JSON.parse(localStorage.getItem(USER_PASSWORDS_KEY) || '{}');
    stored[userId] = hash;
    localStorage.setItem(USER_PASSWORDS_KEY, JSON.stringify(stored));
}

/** Drop a user's hash from the localStorage fallback map. */
function removeBrowserHash(userId: string): void {
    const stored: Record<string, string> = JSON.parse(localStorage.getItem(USER_PASSWORDS_KEY) || '{}');
    delete stored[userId];
    localStorage.setItem(USER_PASSWORDS_KEY, JSON.stringify(stored));
}

// Active session tracking for multi-user support
export interface UserSession {
    userId: string;
    userName: string;
    userRole: UserRole;
    loginTime: Date;
    lastActivity: Date;
    isActive: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    loginError: string | null;
    allUsers: User[];
    activeSessions: UserSession[];

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    setUser: (user: User) => void;
    setLoading: (loading: boolean) => void;
    hasPermission: (permission: string) => boolean;
    canAccess: (requiredRole: UserRole | UserRole[]) => boolean;
    canAccessModule: (moduleId: ModuleId) => boolean;

    // User management (for owner/manager)
    createUser: (user: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<boolean>;
    updateUser: (id: string, updates: Partial<User>) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    getUsers: () => User[];
    changePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<boolean>;

    // Multi-user session management
    switchUser: (userId: string, password: string) => Promise<boolean>;
    getActiveSessions: () => UserSession[];
    updateLastActivity: () => void;
    endSession: (userId: string) => void;

    // Initialization
    initializeFromSecureStorage: () => Promise<void>;
    // Load users from SQLite (Tauri). Migrates any localStorage users into the
    // DB once, then makes the DB the source of truth for allUsers.
    hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            loginError: null,
            allUsers: [], // Start empty - users created during setup
            activeSessions: [],

            login: async (email: string, password: string) => {
                set({ isLoading: true, loginError: null });

                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 500));

                // Find user in allUsers
                const { allUsers } = get();
                const foundUser = allUsers.find(
                    u => u.email.toLowerCase() === email.toLowerCase()
                );

                // Verify password using bcrypt (hash lives in SQLite under Tauri)
                let isValidPassword = false;
                const storedHash = foundUser ? await getStoredHash(foundUser.id) : null;
                if (foundUser && storedHash) {
                    // Check if password is already hashed (starts with $2)
                    if (storedHash.startsWith('$2')) {
                        isValidPassword = await bcrypt.compare(password, storedHash);
                    } else {
                        // Legacy plain text password - migrate to hashed
                        if (storedHash === password) {
                            isValidPassword = true;
                            // Migrate to hashed password
                            await setStoredHash(foundUser.id, await bcrypt.hash(password, 10));
                        }
                    }
                }

                if (foundUser && isValidPassword) {
                    const loginAt = new Date();
                    const userWithLogin = {
                        ...foundUser,
                        lastLogin: loginAt,
                    };

                    // Record the login on the DB row (best-effort; never blocks login)
                    if (isTauri()) {
                        usersRepo.updateLastLogin(foundUser.id, loginAt.toISOString())
                            .catch(e => console.warn('[AuthStore] updateLastLogin failed:', e));
                    }

                    // Add to active sessions
                    const newSession: UserSession = {
                        userId: foundUser.id,
                        userName: `${foundUser.firstName} ${foundUser.lastName}`,
                        userRole: foundUser.role,
                        loginTime: new Date(),
                        lastActivity: new Date(),
                        isActive: true,
                    };

                    // Store token securely
                    const token = `token_${foundUser.id}_${Date.now()}`;
                    await secureStorage.setItem(SECURE_TOKEN_KEY, token);

                    set((state) => ({
                        user: userWithLogin,
                        token: token,
                        isAuthenticated: true,
                        isLoading: false,
                        loginError: null,
                        activeSessions: [
                            ...state.activeSessions.filter(s => s.userId !== foundUser.id),
                            newSession,
                        ],
                    }));

                    return true;
                } else {
                    set({
                        isLoading: false,
                        loginError: 'Email ou mot de passe incorrect',
                    });
                    return false;
                }
            },

            logout: () => {
                const { user } = get();
                secureStorage.removeItem(SECURE_TOKEN_KEY);
                set((state) => ({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    loginError: null,
                    activeSessions: user
                        ? state.activeSessions.map(s =>
                            s.userId === user.id ? { ...s, isActive: false } : s
                        )
                        : state.activeSessions,
                }));
            },

            setUser: (user: User) => {
                set({ user, isAuthenticated: true });
            },

            setLoading: (loading: boolean) => {
                set({ isLoading: loading });
            },

            hasPermission: (permission: string) => {
                const { user } = get();
                if (!user) return false;

                const permissions = ROLE_PERMISSIONS[user.role];
                return permissions.includes('all') || permissions.includes(permission);
            },

            canAccess: (requiredRole: UserRole | UserRole[]) => {
                const { user } = get();
                if (!user) return false;

                const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

                // Owner can access everything
                if (user.role === 'owner') return true;

                return roles.includes(user.role);
            },

            canAccessModule: (moduleId: ModuleId) => {
                const { user } = get();
                if (!user) return false;

                // Owner always has access to everything
                if (user.role === 'owner') return true;

                // Check if user has custom module access
                if (user.moduleAccess && user.moduleAccess.length > 0) {
                    return user.moduleAccess.includes(moduleId);
                }

                // Otherwise use role defaults
                return DEFAULT_MODULE_ACCESS[user.role].includes(moduleId);
            },

            createUser: async (userData) => {
                const { user: currentUser, allUsers } = get();

                // Only owner can create users (or first user creation during setup)
                if (allUsers.length > 0 && (!currentUser || currentUser.role !== 'owner')) {
                    return false;
                }

                // Check if email already exists
                if (allUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
                    return false;
                }

                const { password, ...userFields } = userData;
                const newUser: User = {
                    ...userFields,
                    id: `user_${Date.now()}`,
                    createdAt: new Date(),
                };

                // Hash password before storing
                const hashedPassword = await bcrypt.hash(password, 10);

                // Persist to SQLite (Tauri) or localStorage (browser)
                if (isTauri()) {
                    try {
                        await usersRepo.create(newUser, hashedPassword);
                    } catch (e) {
                        console.error('[AuthStore] createUser DB write failed:', e);
                        return false;
                    }
                } else {
                    await setStoredHash(newUser.id, hashedPassword);
                }

                set({
                    allUsers: [...allUsers, newUser],
                });

                return true;
            },

            updateUser: async (id, updates) => {
                set((state) => ({
                    allUsers: state.allUsers.map(u =>
                        u.id === id ? { ...u, ...updates } : u
                    ),
                    user: state.user?.id === id ? { ...state.user, ...updates } : state.user,
                }));

                if (isTauri()) {
                    try {
                        await usersRepo.update(id, updates);
                    } catch (e) {
                        console.error('[AuthStore] updateUser DB write failed:', e);
                    }
                }
            },

            deleteUser: async (id) => {
                const { user: currentUser } = get();

                // Can't delete yourself or if not owner
                if (!currentUser || currentUser.role !== 'owner' || currentUser.id === id) {
                    return;
                }

                // Remove from the source of truth
                if (isTauri()) {
                    try {
                        await usersRepo.remove(id);
                    } catch (e) {
                        console.error('[AuthStore] deleteUser DB write failed:', e);
                        return;
                    }
                } else {
                    removeBrowserHash(id);
                }

                set((state) => ({
                    allUsers: state.allUsers.filter(u => u.id !== id),
                }));
            },

            getUsers: () => {
                return get().allUsers;
            },

            changePassword: async (userId: string, currentPassword: string, newPassword: string) => {
                const { user: currentUser } = get();

                // Users can change their own password, or owner can change any password
                if (!currentUser || (currentUser.id !== userId && currentUser.role !== 'owner')) {
                    return false;
                }

                const storedHash = await getStoredHash(userId);
                if (!storedHash) return false;

                // Verify current password
                let isValidCurrentPassword = false;
                if (storedHash.startsWith('$2')) {
                    isValidCurrentPassword = await bcrypt.compare(currentPassword, storedHash);
                } else {
                    // Legacy plain text
                    isValidCurrentPassword = storedHash === currentPassword;
                }

                if (!isValidCurrentPassword) {
                    return false;
                }

                // Hash and store new password
                const newHash = await bcrypt.hash(newPassword, 10);
                await setStoredHash(userId, newHash);

                return true;
            },

            // Multi-user session methods
            switchUser: async (userId, password) => {
                const { allUsers } = get();

                const foundUser = allUsers.find(u => u.id === userId);

                // Verify password using bcrypt (hash lives in SQLite under Tauri)
                let isValidPassword = false;
                const storedHash = foundUser ? await getStoredHash(userId) : null;
                if (foundUser && storedHash) {
                    // Check if password is already hashed (starts with $2)
                    if (storedHash.startsWith('$2')) {
                        isValidPassword = await bcrypt.compare(password, storedHash);
                    } else {
                        // Legacy plain text password - migrate to hashed
                        if (storedHash === password) {
                            isValidPassword = true;
                            // Migrate to hashed password
                            await setStoredHash(userId, await bcrypt.hash(password, 10));
                        }
                    }
                }

                if (foundUser && isValidPassword) {
                    const userWithLogin = {
                        ...foundUser,
                        lastLogin: new Date(),
                    };

                    // Update session
                    const newSession: UserSession = {
                        userId: foundUser.id,
                        userName: `${foundUser.firstName} ${foundUser.lastName}`,
                        userRole: foundUser.role,
                        loginTime: new Date(),
                        lastActivity: new Date(),
                        isActive: true,
                    };

                    set((state) => ({
                        user: userWithLogin,
                        token: `token_${foundUser.id}_${Date.now()}`,
                        isAuthenticated: true,
                        activeSessions: [
                            ...state.activeSessions.filter(s => s.userId !== foundUser.id),
                            newSession,
                        ],
                    }));

                    return true;
                }
                return false;
            },

            getActiveSessions: () => {
                return get().activeSessions.filter(s => s.isActive);
            },

            updateLastActivity: () => {
                const { user } = get();
                if (!user) return;

                set((state) => ({
                    activeSessions: state.activeSessions.map(s =>
                        s.userId === user.id ? { ...s, lastActivity: new Date() } : s
                    ),
                }));
            },

            endSession: (userId) => {
                set((state) => ({
                    activeSessions: state.activeSessions.map(s =>
                        s.userId === userId ? { ...s, isActive: false } : s
                    ),
                }));
            },

            initializeFromSecureStorage: async () => {
                const token = await secureStorage.getItem(SECURE_TOKEN_KEY);
                const state = get();

                if (token && state.isAuthenticated && state.user) {
                    set({ token });
                }
            },

            hydrate: async () => {
                // Browser dev keeps using the localStorage-persisted allUsers.
                if (!isTauri()) return;

                try {
                    // One-time migration: if the DB has no users yet but the
                    // localStorage cache does, port them (with their hashes) in.
                    const dbCount = await usersRepo.count();
                    if (dbCount === 0) {
                        const legacyUsers = get().allUsers;
                        if (legacyUsers.length > 0) {
                            const storedPasswords: Record<string, string> = JSON.parse(
                                localStorage.getItem(USER_PASSWORDS_KEY) || '{}'
                            );
                            for (const u of legacyUsers) {
                                await usersRepo.create(u, storedPasswords[u.id] || '');
                            }
                            console.log(`[AuthStore] Migrated ${legacyUsers.length} user(s) from localStorage into SQLite`);
                        }
                    }

                    // SQLite is now the source of truth for the user list.
                    const users = await usersRepo.loadAll();
                    set({ allUsers: users });
                    console.log(`[AuthStore] ✅ Hydrated ${users.length} user(s) from DB`);
                } catch (e) {
                    console.error('[AuthStore] ❌ Failed to hydrate users from DB:', e);
                }
            },
        }),
        {
            name: 'auth-storage',
            version: 1, // Bump version to clear old cache so new suppliers module shows up
            partialize: (state) => ({
                user: state.user,
                // token excluded - stored securely separately
                isAuthenticated: state.isAuthenticated,
                allUsers: state.allUsers,
                activeSessions: state.activeSessions,
            }),
        }
    )
);

export default useAuthStore;

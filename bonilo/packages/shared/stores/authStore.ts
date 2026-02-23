import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import bcrypt from 'bcryptjs';
import { secureStorage } from '../utils/secureStorage';
import type { User, UserRole, ModuleId } from '@shared/types';

// Constants for secure storage
const SECURE_TOKEN_KEY = 'auth_token_secure';

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

// Storage key for user passwords (separate from user data for security)
const USER_PASSWORDS_KEY = 'sm_user_passwords';

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
    updateUser: (id: string, updates: Partial<User>) => void;
    deleteUser: (id: string) => void;
    getUsers: () => User[];
    changePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<boolean>;

    // Multi-user session management
    switchUser: (userId: string, password: string) => Promise<boolean>;
    getActiveSessions: () => UserSession[];
    updateLastActivity: () => void;
    endSession: (userId: string) => void;

    // Initialization
    initializeFromSecureStorage: () => Promise<void>;
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

                // Get stored passwords
                const storedPasswords: Record<string, string> = JSON.parse(
                    localStorage.getItem(USER_PASSWORDS_KEY) || '{}'
                );

                // Find user in allUsers
                const { allUsers } = get();
                const foundUser = allUsers.find(
                    u => u.email.toLowerCase() === email.toLowerCase()
                );

                // Verify password using bcrypt
                let isValidPassword = false;
                if (foundUser && storedPasswords[foundUser.id]) {
                    const storedHash = storedPasswords[foundUser.id];
                    // Check if password is already hashed (starts with $2)
                    if (storedHash.startsWith('$2')) {
                        isValidPassword = await bcrypt.compare(password, storedHash);
                    } else {
                        // Legacy plain text password - migrate to hashed
                        if (storedHash === password) {
                            isValidPassword = true;
                            // Migrate to hashed password
                            const newHash = await bcrypt.hash(password, 10);
                            storedPasswords[foundUser.id] = newHash;
                            localStorage.setItem(USER_PASSWORDS_KEY, JSON.stringify(storedPasswords));
                        }
                    }
                }

                if (foundUser && isValidPassword) {
                    const userWithLogin = {
                        ...foundUser,
                        lastLogin: new Date(),
                    };

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

                const newUser: User = {
                    ...userData,
                    id: `user_${Date.now()}`,
                    createdAt: new Date(),
                };

                // Hash password before storing
                const hashedPassword = await bcrypt.hash(userData.password, 10);

                // Store hashed password in localStorage
                const storedPasswords: Record<string, string> = JSON.parse(
                    localStorage.getItem(USER_PASSWORDS_KEY) || '{}'
                );
                storedPasswords[newUser.id] = hashedPassword;
                localStorage.setItem(USER_PASSWORDS_KEY, JSON.stringify(storedPasswords));

                set({
                    allUsers: [...allUsers, newUser],
                });

                return true;
            },

            updateUser: (id, updates) => {
                set((state) => ({
                    allUsers: state.allUsers.map(u =>
                        u.id === id ? { ...u, ...updates } : u
                    ),
                    user: state.user?.id === id ? { ...state.user, ...updates } : state.user,
                }));
            },

            deleteUser: (id) => {
                const { user: currentUser } = get();

                // Can't delete yourself or if not owner
                if (!currentUser || currentUser.role !== 'owner' || currentUser.id === id) {
                    return;
                }

                // Remove password from storage
                const storedPasswords: Record<string, string> = JSON.parse(
                    localStorage.getItem(USER_PASSWORDS_KEY) || '{}'
                );
                delete storedPasswords[id];
                localStorage.setItem(USER_PASSWORDS_KEY, JSON.stringify(storedPasswords));

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

                const storedPasswords: Record<string, string> = JSON.parse(
                    localStorage.getItem(USER_PASSWORDS_KEY) || '{}'
                );

                const storedHash = storedPasswords[userId];
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
                storedPasswords[userId] = newHash;
                localStorage.setItem(USER_PASSWORDS_KEY, JSON.stringify(storedPasswords));

                return true;
            },

            // Multi-user session methods
            switchUser: async (userId, password) => {
                const { allUsers } = get();

                // Get stored passwords
                const storedPasswords: Record<string, string> = JSON.parse(
                    localStorage.getItem(USER_PASSWORDS_KEY) || '{}'
                );

                const foundUser = allUsers.find(u => u.id === userId);

                // Verify password using bcrypt
                let isValidPassword = false;
                if (foundUser && storedPasswords[userId]) {
                    const storedHash = storedPasswords[userId];
                    // Check if password is already hashed (starts with $2)
                    if (storedHash.startsWith('$2')) {
                        isValidPassword = await bcrypt.compare(password, storedHash);
                    } else {
                        // Legacy plain text password - migrate to hashed
                        if (storedHash === password) {
                            isValidPassword = true;
                            // Migrate to hashed password
                            const newHash = await bcrypt.hash(password, 10);
                            storedPasswords[userId] = newHash;
                            localStorage.setItem(USER_PASSWORDS_KEY, JSON.stringify(storedPasswords));
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

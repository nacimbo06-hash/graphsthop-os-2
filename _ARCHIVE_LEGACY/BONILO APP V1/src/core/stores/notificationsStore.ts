import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Notification types (named AppNotification to avoid conflict with browser's Notification API)
export interface AppNotification {
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
    actionUrl?: string;
    category: 'stock' | 'expiry' | 'sale' | 'customer' | 'system';
}

interface NotificationsState {
    notifications: AppNotification[];
    unreadCount: number;

    // Actions
    addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;

    // Initial demo notifications
    loadDemoNotifications: () => void;
}

export const useNotificationsStore = create<NotificationsState>()(
    persist(
        (set, get) => ({
            notifications: [],
            unreadCount: 0,

            addNotification: (notification) => {
                const newNotification: AppNotification = {
                    ...notification,
                    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    timestamp: new Date(),
                    isRead: false,
                };

                set((state) => ({
                    notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep max 50
                    unreadCount: state.unreadCount + 1,
                }));
            },

            markAsRead: (id) => {
                set((state) => {
                    const notification = state.notifications.find(n => n.id === id);
                    if (notification && !notification.isRead) {
                        return {
                            notifications: state.notifications.map(n =>
                                n.id === id ? { ...n, isRead: true } : n
                            ),
                            unreadCount: Math.max(0, state.unreadCount - 1),
                        };
                    }
                    return state;
                });
            },

            markAllAsRead: () => {
                set((state) => ({
                    notifications: state.notifications.map(n => ({ ...n, isRead: true })),
                    unreadCount: 0,
                }));
            },

            removeNotification: (id) => {
                set((state) => {
                    const notification = state.notifications.find(n => n.id === id);
                    return {
                        notifications: state.notifications.filter(n => n.id !== id),
                        unreadCount: notification && !notification.isRead
                            ? Math.max(0, state.unreadCount - 1)
                            : state.unreadCount,
                    };
                });
            },

            clearAll: () => {
                set({ notifications: [], unreadCount: 0 });
            },

            loadDemoNotifications: () => {
                const demoNotifications: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>[] = [
                    {
                        type: 'warning',
                        title: 'Stock bas - Huile Elio',
                        message: 'Le stock de Huile Elio 5L est à 0 unités. Commandez rapidement!',
                        category: 'stock',
                        actionUrl: '/inventory?tab=alerts',
                    },
                    {
                        type: 'warning',
                        title: 'Stock bas - Yaourt Soummam',
                        message: 'Le stock de Yaourt Soummam x12 est sous le minimum (8/10).',
                        category: 'stock',
                        actionUrl: '/inventory?tab=alerts',
                    },
                    {
                        type: 'error',
                        title: 'Produit proche de péremption',
                        message: 'Lait Candia 1L - 5 unités expirent dans 3 jours.',
                        category: 'expiry',
                        actionUrl: '/inventory?tab=alerts',
                    },
                    {
                        type: 'info',
                        title: 'Ramadan dans 65 jours',
                        message: 'Préparez votre stock de dattes et semoule. Demande prévue: +320%',
                        category: 'system',
                    },
                    {
                        type: 'success',
                        title: 'Ventes du jour',
                        message: 'Vous avez atteint 245,800 DA de ventes aujourd\'hui. Excellent!',
                        category: 'sale',
                    },
                ];

                // Add notifications with staggered timestamps
                const now = Date.now();
                demoNotifications.forEach((notif, index) => {
                    const timestamp = new Date(now - index * 3600000); // 1 hour apart
                    set((state) => ({
                        notifications: [
                            {
                                ...notif,
                                id: `demo_${index}`,
                                timestamp,
                                isRead: false,
                            },
                            ...state.notifications,
                        ].slice(0, 50),
                        unreadCount: state.unreadCount + 1,
                    }));
                });
            },
        }),
        {
            name: 'notifications-storage',
            partialize: (state) => ({
                notifications: state.notifications,
                unreadCount: state.unreadCount,
            }),
        }
    )
);

export default useNotificationsStore;

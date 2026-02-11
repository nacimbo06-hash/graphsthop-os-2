import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    X,
    Check,
    CheckCheck,
    Trash2,
    AlertTriangle,
    AlertCircle,
    Info,
    CheckCircle,
    Package,
    Calendar,
    ShoppingCart,
    Users,
    Settings,
} from 'lucide-react';
import { useNotificationsStore, type AppNotification } from '@bonilo/shared/stores';
import styles from './NotificationsPanel.module.css';

interface NotificationsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll
    } = useNotificationsStore();

    const getIcon = (notification: AppNotification) => {
        switch (notification.type) {
            case 'error':
                return <AlertCircle size={18} className={styles.iconError} />;
            case 'warning':
                return <AlertTriangle size={18} className={styles.iconWarning} />;
            case 'success':
                return <CheckCircle size={18} className={styles.iconSuccess} />;
            default:
                return <Info size={18} className={styles.iconInfo} />;
        }
    };

    const getCategoryIcon = (category: AppNotification['category']) => {
        switch (category) {
            case 'stock':
                return <Package size={14} />;
            case 'expiry':
                return <Calendar size={14} />;
            case 'sale':
                return <ShoppingCart size={14} />;
            case 'customer':
                return <Users size={14} />;
            default:
                return <Settings size={14} />;
        }
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `Il y a ${days}j`;
        if (hours > 0) return `Il y a ${hours}h`;
        if (minutes > 0) return `Il y a ${minutes}min`;
        return 'À l\'instant';
    };

    const handleNotificationClick = (notification: AppNotification) => {
        markAsRead(notification.id);
        if (notification.actionUrl) {
            navigate(notification.actionUrl);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.panel}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerTitle}>
                    <h3>Notifications</h3>
                    {unreadCount > 0 && (
                        <span className={styles.badge}>{unreadCount}</span>
                    )}
                </div>
                <div className={styles.headerActions}>
                    {unreadCount > 0 && (
                        <button
                            className={styles.actionBtn}
                            onClick={markAllAsRead}
                            title="Tout marquer comme lu"
                        >
                            <CheckCheck size={16} />
                        </button>
                    )}
                    <button
                        className={styles.closeBtn}
                        onClick={onClose}
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className={styles.list}>
                {notifications.length === 0 ? (
                    <div className={styles.empty}>
                        <CheckCircle size={40} />
                        <p>Aucune notification</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`${styles.notification} ${!notification.isRead ? styles.unread : ''}`}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <div className={styles.notifIcon}>
                                {getIcon(notification)}
                            </div>
                            <div className={styles.notifContent}>
                                <div className={styles.notifHeader}>
                                    <span className={styles.notifTitle}>{notification.title}</span>
                                    <span className={styles.notifTime}>{formatTime(notification.timestamp)}</span>
                                </div>
                                <p className={styles.notifMessage}>{notification.message}</p>
                                <div className={styles.notifMeta}>
                                    {getCategoryIcon(notification.category)}
                                    <span>{notification.category}</span>
                                </div>
                            </div>
                            <button
                                className={styles.removeBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeNotification(notification.id);
                                }}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div className={styles.footer}>
                    <button className={styles.clearBtn} onClick={clearAll}>
                        <Trash2 size={14} />
                        Effacer tout
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationsPanel;

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Menu,
    Bell,
    Search,
    User,
    Settings,
    LogOut,
    Maximize2,
    Minimize2,
    Shield,
    ChevronDown,
} from 'lucide-react';
import { ThemeToggle } from '../../ui/ThemeToggle';
import { GlobalSearch } from './GlobalSearch';
import { NotificationsPanel } from './NotificationsPanel';
import { UserSwitcher } from './UserSwitcher';
import { SyncIndicator } from '../../domain/sync/SyncIndicator';
import { useAuthStore, ROLE_LABELS, useNotificationsStore } from '@bonilo/shared/stores';
import styles from './Header.module.css';

interface HeaderProps {
    title?: string;
    onMenuClick?: () => void;
    showMenuButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    onMenuClick,
    showMenuButton = false,
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const userMenuRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    // Auth store
    const { user, isAuthenticated, logout } = useAuthStore();

    // Notifications store
    const { unreadCount, loadDemoNotifications, notifications } = useNotificationsStore();

    // UI state
    const [showUserMenu, setShowUserMenu] = React.useState(false);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [showSearch, setShowSearch] = React.useState(false);
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    // Load demo notifications on first mount if empty
    useEffect(() => {
        if (notifications.length === 0 && isAuthenticated) {
            loadDemoNotifications();
        }
    }, [isAuthenticated]);

    // Close menus on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setShowUserMenu(false);
            }
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard shortcut for search (Ctrl+K or Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setShowSearch(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Fullscreen toggle
    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
                setIsFullscreen(true);
            } else {
                await document.exitFullscreen();
                setIsFullscreen(false);
            }
        } catch (error) {
            console.log('Fullscreen not supported or denied');
        }
    };

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Handle logout
    const handleLogout = () => {
        logout();
        navigate('/login');
        setShowUserMenu(false);
    };

    // Get current time
    const [time, setTime] = React.useState(new Date());
    React.useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Get user initials
    const userInitials = user
        ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
        : 'U';

    const userName = user
        ? `${user.firstName} ${user.lastName}`
        : 'Utilisateur';

    const userRole = user ? ROLE_LABELS[user.role] : '';

    return (
        <>
            <header className={styles.header}>
                <div className={styles.left}>
                    {showMenuButton && (
                        <button className={styles.menuButton} onClick={onMenuClick}>
                            <Menu size={24} />
                        </button>
                    )}

                    {title && <h1 className={styles.title}>{title}</h1>}

                    {/* Search Bar - Opens Modal */}
                    <button
                        className={styles.searchContainer}
                        onClick={() => setShowSearch(true)}
                    >
                        <Search size={18} className={styles.searchIcon} />
                        <span className={styles.searchPlaceholder}>
                            Rechercher...
                        </span>
                        <kbd className={styles.searchShortcut}>⌘K</kbd>
                    </button>
                </div>

                <div className={styles.right}>
                    {/* Current Time */}
                    <div className={styles.timeDisplay}>
                        <span className={styles.time}>
                            {time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className={styles.date}>
                            {time.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </span>
                    </div>

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Sync Status */}
                    <SyncIndicator />

                    {/* User Switcher */}
                    <UserSwitcher />

                    {/* Fullscreen Toggle */}
                    <button
                        className={styles.iconButton}
                        onClick={toggleFullscreen}
                        title={isFullscreen ? 'Quitter plein écran' : 'Plein écran'}
                    >
                        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>

                    {/* Notifications */}
                    <div className={styles.notificationWrapper} ref={notifRef}>
                        <button
                            className={`${styles.iconButton} ${showNotifications ? styles.active : ''}`}
                            onClick={() => setShowNotifications(!showNotifications)}
                            title="Notifications"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className={styles.badge}>
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        <NotificationsPanel
                            isOpen={showNotifications}
                            onClose={() => setShowNotifications(false)}
                        />
                    </div>

                    {/* User Menu */}
                    <div className={styles.userMenu} ref={userMenuRef}>
                        <button
                            className={`${styles.userButton} ${showUserMenu ? styles.active : ''}`}
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            <div className={styles.avatar}>
                                {userInitials}
                            </div>
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>{userName}</span>
                                <span className={styles.userRole}>{userRole}</span>
                            </div>
                            <ChevronDown size={16} className={styles.chevron} />
                        </button>

                        {showUserMenu && (
                            <div className={styles.dropdown}>
                                <div className={styles.dropdownHeader}>
                                    <div className={styles.dropdownAvatar}>
                                        {userInitials}
                                    </div>
                                    <div>
                                        <span className={styles.dropdownName}>{userName}</span>
                                        <span className={styles.dropdownRole}>
                                            <Shield size={12} />
                                            {userRole}
                                        </span>
                                    </div>
                                </div>

                                <hr className={styles.divider} />

                                <button
                                    className={styles.dropdownItem}
                                    onClick={() => {
                                        navigate('/settings');
                                        setShowUserMenu(false);
                                    }}
                                >
                                    <User size={16} />
                                    <span>Mon profil</span>
                                </button>
                                <button
                                    className={styles.dropdownItem}
                                    onClick={() => {
                                        navigate('/settings');
                                        setShowUserMenu(false);
                                    }}
                                >
                                    <Settings size={16} />
                                    <span>{t('nav.settings')}</span>
                                </button>

                                <hr className={styles.divider} />

                                <button
                                    className={`${styles.dropdownItem} ${styles.danger}`}
                                    onClick={handleLogout}
                                >
                                    <LogOut size={16} />
                                    <span>Déconnexion</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Global Search Modal */}
            <GlobalSearch
                isOpen={showSearch}
                onClose={() => setShowSearch(false)}
            />
        </>
    );
};

export default Header;

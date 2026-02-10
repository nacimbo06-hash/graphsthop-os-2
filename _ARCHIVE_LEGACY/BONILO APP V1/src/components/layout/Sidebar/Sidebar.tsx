import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    ShoppingCart,
    Wallet,
    Package,
    Users,
    UserCog,
    BarChart3,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Wifi,
    WifiOff,
    RefreshCw,
    Printer,
    Truck,
    Leaf,
    Brain,
} from 'lucide-react';
import { useAuthStore } from '@core/stores';
import type { ModuleId } from '@core';
import { ROUTES } from '@core/constants';
import styles from './Sidebar.module.css';
import igoLogo from '../../../assets/igo-logo.svg';
import { NetworkSyncIndicator } from '../../NetworkSync';

interface NavItem {
    path: string;
    labelKey: string;
    icon: React.ReactNode;
    moduleId: ModuleId;
}

const navItems: NavItem[] = [
    { path: ROUTES.DASHBOARD, labelKey: 'nav.dashboard', icon: <LayoutDashboard size={20} />, moduleId: 'dashboard' },
    { path: ROUTES.POS, labelKey: 'nav.pos', icon: <ShoppingCart size={20} />, moduleId: 'pos' },
    { path: ROUTES.TREASURY, labelKey: 'nav.treasury', icon: <Wallet size={20} />, moduleId: 'treasury' },
    { path: ROUTES.INVENTORY, labelKey: 'nav.inventory', icon: <Package size={20} />, moduleId: 'inventory' },
    { path: ROUTES.CUSTOMERS, labelKey: 'nav.customers', icon: <Users size={20} />, moduleId: 'customers' },
    { path: ROUTES.SUPPLIERS, labelKey: 'nav.suppliers', icon: <Truck size={20} />, moduleId: 'suppliers' },
    { path: ROUTES.PRINT, labelKey: 'nav.print', icon: <Printer size={20} />, moduleId: 'print' },
    { path: ROUTES.REPORTS, labelKey: 'nav.reports', icon: <BarChart3 size={20} />, moduleId: 'reports' },
    { path: ROUTES.CIRCULARITY, labelKey: 'nav.circularity', icon: <Leaf size={20} />, moduleId: 'circularity' },
    { path: ROUTES.COPILOT, labelKey: 'nav.copilot', icon: <Brain size={20} />, moduleId: 'copilot' },
    { path: ROUTES.USERS, labelKey: 'nav.users', icon: <UserCog size={20} />, moduleId: 'users' },
    { path: ROUTES.SETTINGS, labelKey: 'nav.settings', icon: <Settings size={20} />, moduleId: 'settings' },
    { path: ROUTES.HELP, labelKey: 'nav.help', icon: <HelpCircle size={20} />, moduleId: 'help' },
];

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
    isOnline?: boolean;
    isSyncing?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
    isCollapsed,
    onToggle,
    isOnline = true,
    isSyncing = false,
}) => {
    const { t, i18n } = useTranslation();
    const { canAccessModule } = useAuthStore();
    const isRTL = i18n.language === 'ar';

    // Filter nav items based on module access
    const visibleNavItems = navItems.filter(item => canAccessModule(item.moduleId));

    const sidebarClasses = [
        styles.sidebar,
        isCollapsed ? styles.collapsed : '',
    ].filter(Boolean).join(' ');

    return (
        <aside className={sidebarClasses}>
            {/* Logo */}
            <div className={styles.logo}>
                <div className={styles.logoIcon}>
                    <img src={igoLogo} alt="IGO" style={{ width: 28, height: 28 }} />
                </div>
                {!isCollapsed && (
                    <div className={styles.logoText}>
                        <span className={styles.logoTitle}>{t('app.name')}</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    {visibleNavItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `${styles.navLink} ${isActive ? styles.active : ''}`
                                }
                                title={isCollapsed ? t(item.labelKey) : undefined}
                            >
                                <span className={styles.navIcon}>{item.icon}</span>
                                {!isCollapsed && (
                                    <span className={styles.navLabel}>{t(item.labelKey)}</span>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>



            {/* Network Sync Indicator */}
            {!isCollapsed && (
                <div style={{ padding: '0 1rem', marginBottom: '1rem' }}>
                    <NetworkSyncIndicator />
                </div>
            )}

            {/* Collapse Toggle */}
            <button
                className={styles.toggleButton}
                onClick={onToggle}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {isRTL ? (
                    isCollapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />
                ) : (
                    isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />
                )}
            </button>
        </aside>
    );
};

export default Sidebar;

import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    Layers,
    LayoutTemplate,
    Package,
    Printer,
    Settings,
    ChevronLeft,
    ChevronRight,
    Sparkles,
} from 'lucide-react';
import styles from './Sidebar.module.css';

interface NavItem {
    path: string;
    label: string;
    icon: React.ReactNode;
    badge?: string;
}

const navItems: NavItem[] = [
    { path: '/', label: 'Designer', icon: <Layers size={20} /> },
    { path: '/templates', label: 'Templates', icon: <LayoutTemplate size={20} /> },
    { path: '/products', label: 'Produits', icon: <Package size={20} /> },
    { path: '/print', label: 'Impression', icon: <Printer size={20} /> },
    { path: '/settings', label: 'Paramètres', icon: <Settings size={20} /> },
];

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const location = useLocation();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    return (
        <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
            {/* Logo */}
            <div className={styles.logo}>
                <div className={styles.logoIcon}>
                    <Sparkles size={24} />
                </div>
                {!isCollapsed && (
                    <div className={styles.logoText}>
                        <span className={styles.brand}>IGO</span>
                        <span className={styles.product}>Print Studio</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className={styles.nav}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const isHovered = hoveredItem === item.path;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                            onMouseEnter={() => setHoveredItem(item.path)}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            {!isCollapsed && <span className={styles.navLabel}>{item.label}</span>}
                            {isActive && <div className={styles.activeGlow} />}

                            {/* Tooltip when collapsed */}
                            {isCollapsed && isHovered && (
                                <div className={styles.tooltip}>{item.label}</div>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Pro Badge */}
            {!isCollapsed && (
                <div className={styles.proBadge}>
                    <Sparkles size={16} />
                    <span>Pro Features</span>
                </div>
            )}

            {/* Toggle */}
            <button className={styles.toggle} onClick={onToggle}>
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
        </aside>
    );
}

export default Sidebar;

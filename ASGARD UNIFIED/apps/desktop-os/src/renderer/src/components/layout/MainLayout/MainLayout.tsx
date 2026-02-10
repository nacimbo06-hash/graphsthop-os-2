import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';
import { PageTransition } from '../../animations';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
    children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const location = useLocation();

    // Simulated states - will be connected to stores later
    const isOnline = true;
    const isSyncing = false;

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const toggleMobileSidebar = () => {
        setMobileSidebarOpen(!mobileSidebarOpen);
    };

    const mainClasses = [
        styles.main,
        sidebarCollapsed ? styles.sidebarCollapsed : '',
    ].filter(Boolean).join(' ');

    return (
        <div className={styles.layout}>
            <Sidebar
                isCollapsed={sidebarCollapsed}
                onToggle={toggleSidebar}
                isOnline={isOnline}
                isSyncing={isSyncing}
            />

            <div className={mainClasses}>
                <Header
                    showMenuButton={true}
                    onMenuClick={toggleMobileSidebar}
                />

                <main className={styles.content}>
                    <AnimatePresence mode="wait">
                        <PageTransition key={location.pathname}>
                            {children || <Outlet />}
                        </PageTransition>
                    </AnimatePresence>
                </main>
            </div>

            {/* Mobile sidebar overlay */}
            {mobileSidebarOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default MainLayout;

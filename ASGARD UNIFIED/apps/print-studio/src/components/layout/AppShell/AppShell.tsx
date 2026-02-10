import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import styles from './AppShell.module.css';

export function AppShell() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className={styles.shell}>
            <Sidebar
                isCollapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <main className={`${styles.main} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
                <Outlet />
            </main>
        </div>
    );
}

export default AppShell;

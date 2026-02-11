import React, { useState, useMemo } from 'react';
import {
    Users,
    Gift,
    Star,
    TrendingUp,
    Wallet,
} from 'lucide-react';
import { CustomersList } from './tabs/CustomersList';
import { CreditManagement } from './tabs/CreditManagement';
import { LoyaltyProgram } from './tabs/LoyaltyProgram';
import { useCustomersStore } from '@bonilo/shared/stores';
import { useSettings } from '../../contexts/SettingsContext';
import styles from './CustomersHub.module.css';

interface Tab {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    component: React.ReactNode;
}

export const CustomersHub: React.FC = () => {
    const { formatCurrency } = useSettings();
    const { customers, getTotalCredit, getLoyalCustomers } = useCustomersStore();
    const [activeTab, setActiveTab] = useState('customers');

    // Stats
    const totalCredit = getTotalCredit();
    const loyalCustomersCount = getLoyalCustomers(1000).length;
    const creditAlerts = customers.filter(c => c.currentCredit > c.creditLimit * 0.8).length;

    const tabs: Tab[] = [
        { id: 'customers', label: 'Liste Clients', icon: <Users size={20} />, component: <CustomersList /> },
        { id: 'credit', label: 'Crédit / Ardoise', icon: <Wallet size={20} />, badge: creditAlerts > 0 ? creditAlerts : undefined, component: <CreditManagement /> },
        { id: 'loyalty', label: 'Fidélité', icon: <Gift size={20} />, component: <LoyaltyProgram /> },
    ];

    const activeTabData = useMemo(() => tabs.find(t => t.id === activeTab), [activeTab, tabs]);

    return (
        <div className={styles.customersHub}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Users size={32} className={styles.headerIcon} />
                    <div>
                        <h1>Gestion Clients</h1>
                        <p>Fidélisation et suivi des clients</p>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    {/* Add button is now in CustomersList tab */}
                </div>
            </div>

            {/* Stats Row */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <Users size={24} />
                    <div>
                        <span className={styles.statValue}>{customers.length}</span>
                        <span className={styles.statLabel}>Clients enregistrés</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <Star size={24} />
                    <div>
                        <span className={styles.statValue}>{loyalCustomersCount}</span>
                        <span className={styles.statLabel}>Clients fidèles</span>
                    </div>
                </div>
                <div className={`${styles.statCard} ${totalCredit > 0 ? styles.warning : ''}`}>
                    <Wallet size={24} />
                    <div>
                        <span className={styles.statValue}>{formatCurrency(totalCredit)}</span>
                        <span className={styles.statLabel}>Crédit total en cours</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <TrendingUp size={24} />
                    <div>
                        <span className={styles.statValue}>+0%</span>
                        <span className={styles.statLabel}>Croissance mensuelle</span>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className={styles.tabsNav}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                        {tab.badge && <span className={styles.badge}>{tab.badge}</span>}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
                {activeTabData?.component}
            </div>
        </div>
    );
};

export default CustomersHub;

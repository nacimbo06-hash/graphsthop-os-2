import React, { useState } from 'react';
import {
    Wallet,
    Package,
    PiggyBank,
    Receipt,
    FileBarChart,
    DollarSign,
} from 'lucide-react';
import { CashRegister } from './tabs/CashRegister';
import { GoodsReceiptTab } from './tabs/GoodsReceiptTab';
import { Savings } from './tabs/Savings';
import { Expenses } from './tabs/Expenses';
import { ZReport } from './tabs/ZReport';
import styles from './TreasuryHub.module.css';

// Tab definitions
interface Tab {
    id: string;
    label: string;
    icon: React.ReactNode;
    component: React.ReactNode;
}

export const TreasuryHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState('cash-register');

    const tabs: Tab[] = [
        { id: 'cash-register', label: 'Caisse', icon: <Wallet size={20} />, component: <CashRegister /> },
        { id: 'goods-receipt', label: 'Bon d\'Entrée', icon: <Package size={20} />, component: <GoodsReceiptTab /> },
        { id: 'savings', label: 'Épargne / Coffre', icon: <PiggyBank size={20} />, component: <Savings /> },
        { id: 'expenses', label: 'Dépenses & Charges', icon: <Receipt size={20} />, component: <Expenses /> },
        { id: 'z-report', label: 'Rapport Z', icon: <FileBarChart size={20} />, component: <ZReport /> },
    ];

    const activeTabData = tabs.find(t => t.id === activeTab);

    return (
        <div className={styles.treasuryHub}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <DollarSign size={32} className={styles.headerIcon} />
                    <div>
                        <h1>Trésorerie</h1>
                        <p>Gestion financière complète</p>
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

export default TreasuryHub;

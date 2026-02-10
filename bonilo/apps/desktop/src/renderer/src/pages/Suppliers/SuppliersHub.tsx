import React, { useState } from 'react';
import {
    Truck,
    FileText,
    CreditCard,
    TrendingUp,
    Zap,
    Activity,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    ReferenceLine,
    Label
} from 'recharts';
import { SuppliersList } from './tabs/SuppliersList';
import { PurchaseOrders } from './tabs/PurchaseOrders';
import { SupplierPayments } from './tabs/SupplierPayments';
import { usePurchasesStore } from '@asgard/shared/stores';
import { useSettings } from '../../contexts/SettingsContext';
import styles from './SuppliersHub.module.css';

interface Tab {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    component: React.ReactNode;
}

export const SuppliersHub: React.FC = () => {
    const { formatCurrency } = useSettings();
    const { suppliers, purchaseOrders, goodsReceipts, getMonthlyStats, getTotalDebt } = usePurchasesStore();
    const [activeTab, setActiveTab] = useState('suppliers');

    // Stats from real data
    const totalSuppliers = suppliers.length;
    const activeOrders = purchaseOrders.filter(o => o.status === 'sent' || o.status === 'partial').length;
    const unpaidReceipts = goodsReceipts.filter(r => !r.isPaid).length;
    const totalDebt = getTotalDebt();

    const tabs: Tab[] = [
        { id: 'suppliers', label: 'Liste Fournisseurs', icon: <Truck size={20} />, component: <SuppliersList /> },
        { id: 'orders', label: 'Bons de Commande', icon: <FileText size={20} />, badge: activeOrders > 0 ? activeOrders : undefined, component: <PurchaseOrders /> },
        { id: 'payments', label: 'Paiements / Dettes', icon: <CreditCard size={20} />, badge: unpaidReceipts > 0 ? unpaidReceipts : undefined, component: <SupplierPayments /> },
    ];

    const activeTabData = tabs.find(t => t.id === activeTab);

    // Get real monthly data from store
    const monthlyData = getMonthlyStats();

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className={styles.customTooltip}>
                    <p className={styles.tooltipLabel}>{label}</p>
                    <p className={styles.tooltipValue}>
                        Total: <strong>{formatCurrency(payload[0].value)}</strong>
                    </p>
                    <p className={styles.tooltipSub}>
                        {payload[0].payload.orders} livraisons reçues
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={styles.suppliersHub}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Truck size={32} className={styles.headerIcon} />
                    <div>
                        <h1>Gestion Fournisseurs</h1>
                        <p>Gestion des partenaires et approvisionnements</p>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    {/* Add button is now in SuppliersList tab */}
                </div>
            </div>

            {/* Stats Row */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}><Truck size={24} /></div>
                    <div>
                        <span className={styles.statValue}>{totalSuppliers}</span>
                        <span className={styles.statLabel}>Fournisseurs</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}><Activity size={24} /></div>
                    <div>
                        <span className={styles.statValue}>{activeOrders}</span>
                        <span className={styles.statLabel}>Commandes en cours</span>
                    </div>
                </div>
                <div className={`${styles.statCard} ${totalDebt > 0 ? styles.dangerCard : ''}`}>
                    <div className={styles.statIcon}><CreditCard size={24} /></div>
                    <div>
                        <span className={styles.statValue}>{formatCurrency(totalDebt)}</span>
                        <span className={styles.statLabel}>Dette fournisseurs</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}><TrendingUp size={24} /></div>
                    <div>
                        <span className={styles.statValue}>{goodsReceipts.length}</span>
                        <span className={styles.statLabel}>Réceptions totales</span>
                    </div>
                </div>
            </div>

            {/* Performance Chart */}
            <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                    <div className={styles.chartTitle}>
                        <h3>Performance Approvisionnement</h3>
                        <p>Évolution du volume d'achats sur les 6 derniers mois</p>
                    </div>
                    <div className={styles.chartLegend}>
                        <div className={styles.legendItem}>
                            <span className={styles.legendDot}></span>
                            Volume d'achat (DA)
                        </div>
                    </div>
                </div>
                <div className={styles.chartBody}>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                                dy={10}
                            />
                            <YAxis
                                hide
                                domain={['dataMin - 5000', 'dataMax + 5000']}
                            />
                            <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="var(--color-primary)"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorTotal)"
                                activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--color-primary)' }}
                            />
                            <ReferenceLine y={50000} stroke="var(--color-warning)" strokeDasharray="3 3" opacity={0.5}>
                                <Label value="Objectif Mensuel" position="insideBottomLeft" fill="var(--color-warning)" fontSize={10} />
                            </ReferenceLine>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className={styles.chartFooter}>
                    <div className={styles.insightTag}>
                        <Zap size={14} />
                        Volume en hausse de 12% ce mois-ci
                    </div>
                    <div className={styles.insightTag}>
                        <Activity size={14} />
                        Moyenne mensuelle: {formatCurrency(52000)}
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

export default SuppliersHub;

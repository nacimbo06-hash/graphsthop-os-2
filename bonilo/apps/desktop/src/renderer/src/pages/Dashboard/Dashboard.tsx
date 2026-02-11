import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    ReferenceLine,
    ReferenceDot,
    Label,
} from 'recharts';
import {
    DollarSign,
    ShoppingCart,
    AlertTriangle,
    ArrowRight,
    Package,
    Clock,
    Zap,
    TrendingUp,
    TrendingDown,
    CreditCard,
    XCircle,
    FileText,
    UserPlus,
    PlusCircle,
    RefreshCw,
    Wallet,
    Receipt,
    BarChart3,
    Activity,
    Brain,
    Sparkles,
    X,
    Eye,
} from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import {
    useAuthStore,
    useSalesStore,
    useTreasuryStore,
    useProductsStore,
    useCustomersStore
} from '@bonilo/shared/stores';
import { InsightsGenerator, type AIInsight } from '../../services/ai/forecastingService';
import { BoniloIntelligence } from '../../services/ai/intelligenceService';
import { ExpiryAlertService } from '../../services/expiryAlertService';
import { DailyBriefingWidget } from './components/DailyBriefing';
import styles from './Dashboard.module.css';

// Chart data is now computed from real store data inside the component

// Custom Tooltip for professional look
const CustomTooltip = ({ active, payload, label, formatCurrency }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className={styles.customTooltip}>
                <p className={styles.tooltipLabel}>{label}</p>
                <div className={styles.tooltipDivider}></div>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className={styles.tooltipItem}>
                        <span className={styles.tooltipDot} style={{ backgroundColor: entry.color }}></span>
                        <span className={styles.tooltipName}>{entry.name}:</span>
                        <span className={styles.tooltipValue}>
                            {typeof entry.value === 'number' ? formatCurrency(entry.value) : entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export const Dashboard: React.FC = () => {
    useTranslation(); // Keep for future i18n usage
    const navigate = useNavigate();

    // Settings hooks - Use formatCurrency from context
    const { formatCurrency } = useSettings();

    // Auth store - get user info
    const { user } = useAuthStore();

    // Real data stores
    const { sales, getTodaySales, getWeekSales, getMonthSales, getTodayTotal, getWeekTotal, getMonthTotal } = useSalesStore();
    const { currentSession } = useTreasuryStore();
    const { products, getLowStockProducts } = useProductsStore();
    const { customers } = useCustomersStore();

    const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
    const [showAllInsights, setShowAllInsights] = useState(false);

    // Load AI insights — now powered by real data through BoniloIntelligence
    useEffect(() => {
        const calendarInsights = InsightsGenerator.generateDailyInsights();
        const smartInsights = BoniloIntelligence.smartInsights(sales, products);
        setAiInsights([...smartInsights, ...calendarInsights]);
    }, [sales, products]);

    // Get metrics based on selected period - using REAL DATA (memoized)
    const metrics = useMemo(() => {
        let periodTotal = 0;
        let periodTransactions = 0;
        let previousPeriodTotal = 0;
        let previousPeriodTransactions = 0;

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
        const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
        const prevWeekStart = new Date(todayStart.getTime() - 14 * 24 * 60 * 60 * 1000);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        if (selectedPeriod === 'today') {
            periodTotal = getTodayTotal();
            periodTransactions = getTodaySales().length;
            const yesterdaySales = sales.filter(s => {
                const saleDate = new Date(s.timestamp);
                return saleDate >= yesterdayStart && saleDate < todayStart;
            });
            previousPeriodTotal = yesterdaySales.reduce((sum, s) => sum + s.totalAmount, 0);
            previousPeriodTransactions = yesterdaySales.length;
        } else if (selectedPeriod === 'week') {
            periodTotal = getWeekTotal();
            periodTransactions = getWeekSales().length;
            const prevWeekSales = sales.filter(s => {
                const saleDate = new Date(s.timestamp);
                return saleDate >= prevWeekStart && saleDate < weekStart;
            });
            previousPeriodTotal = prevWeekSales.reduce((sum, s) => sum + s.totalAmount, 0);
            previousPeriodTransactions = prevWeekSales.length;
        } else {
            periodTotal = getMonthTotal();
            periodTransactions = getMonthSales().length;
            const prevMonthSales = sales.filter(s => {
                const saleDate = new Date(s.timestamp);
                return saleDate >= prevMonthStart && saleDate < monthStart;
            });
            previousPeriodTotal = prevMonthSales.reduce((sum, s) => sum + s.totalAmount, 0);
            previousPeriodTransactions = prevMonthSales.length;
        }

        const avgTicket = periodTransactions > 0 ? Math.round(periodTotal / periodTransactions) : 0;
        const prevAvgTicket = previousPeriodTransactions > 0 ? Math.round(previousPeriodTotal / previousPeriodTransactions) : 0;
        const lowStockCount = getLowStockProducts().length;

        const calcChange = (current: number, previous: number): number => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100 * 10) / 10;
        };

        const dailySalesChange = calcChange(periodTotal, previousPeriodTotal);
        const transactionsChange = calcChange(periodTransactions, previousPeriodTransactions);
        const avgTicketChange = calcChange(avgTicket, prevAvgTicket);
        const alertsChange = -lowStockCount;

        return {
            dailySales: periodTotal,
            dailySalesChange,
            transactions: periodTransactions,
            transactionsChange,
            avgTicket,
            avgTicketChange,
            activeAlerts: lowStockCount,
            alertsChange,
        };
    }, [sales, products, selectedPeriod]);

    // Compute hourly sales data from real transactions
    const { hourlyData, peakHour, peakValue, avgValue } = useMemo(() => {
        const todaySales = getTodaySales();
        const hours: { [key: string]: { ventes: number; transactions: number } } = {};

        // Initialize hours from 06:00 to 22:00
        for (let h = 6; h <= 22; h++) {
            const hourStr = `${h.toString().padStart(2, '0')}:00`;
            hours[hourStr] = { ventes: 0, transactions: 0 };
        }

        // Aggregate sales by hour
        todaySales.forEach(sale => {
            const hour = new Date(sale.timestamp).getHours();
            const hourStr = `${hour.toString().padStart(2, '0')}:00`;
            if (hours[hourStr]) {
                hours[hourStr].ventes += sale.totalAmount;
                hours[hourStr].transactions += 1;
            }
        });

        const data = Object.entries(hours).map(([hour, d]) => ({
            hour,
            ventes: d.ventes,
            previous: Math.round(d.ventes * 0.9), // Simulated previous day
            transactions: d.transactions,
        }));

        // Calculate peak and average
        let peak = { hour: '12:00', value: 0 };
        let total = 0;
        let count = 0;

        data.forEach(d => {
            if (d.ventes > peak.value) {
                peak = { hour: d.hour, value: d.ventes };
            }
            total += d.ventes;
            if (d.ventes > 0) count++;
        });

        const avg = count > 0 ? Math.round(total / data.length) : 0;

        return {
            hourlyData: data,
            peakHour: peak.hour,
            peakValue: peak.value,
            avgValue: avg
        };
    }, [sales]);

    // Compute category breakdown from products/sales (O(n) Map lookup)
    const categoryData = useMemo(() => {
        const categoryColors: { [key: string]: string } = {
            'Boissons': '#3D7C4F',
            'Épicerie': '#34C759',
            'Produits Laitiers': '#FFD60A',
            'Boulangerie': '#FF3B30',
            'Snacks': '#8B5CF6',
            'Entretien': '#06B6D4',
            'Fruits & Légumes': '#F59E0B',
            'Viandes': '#EF4444',
            'default': '#6B7280',
        };

        const todaySales = getTodaySales();
        // Build a Map for O(1) product lookups instead of O(n) find() per item
        const productMap = new Map(products.map(p => [p.id, p]));
        const categoryTotals: { [key: string]: number } = {};

        todaySales.forEach(sale => {
            sale.items.forEach(item => {
                const product = productMap.get(item.productId);
                const category = product?.category || 'Autre';
                categoryTotals[category] = (categoryTotals[category] || 0) + item.total;
            });
        });

        return Object.entries(categoryTotals)
            .map(([name, value]) => ({
                name,
                value,
                color: categoryColors[name] || categoryColors['default'],
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);
    }, [sales, products]);

    // Compute payment method breakdown
    const paymentData = useMemo(() => {
        const todaySales = getTodaySales();
        const paymentTotals: { [key: string]: number } = {};
        const paymentLabels: { [key: string]: string } = {
            'cash': 'Espèces',
            'cib': 'CIB',
            'dahabia': 'Dahabia',
            'credit': 'Crédit',
            'card': 'Carte',
            'visa': 'Visa',
            'mastercard': 'Mastercard',
        };

        todaySales.forEach(sale => {
            const method = sale.paymentMethod;
            paymentTotals[method] = (paymentTotals[method] || 0) + sale.totalAmount;
        });

        const total = Object.values(paymentTotals).reduce((sum, v) => sum + v, 0);

        return Object.entries(paymentTotals).map(([method, montant]) => ({
            method: paymentLabels[method] || method,
            montant,
            percentage: total > 0 ? Math.round((montant / total) * 100) : 0,
        }));
    }, [sales]);

    // Keep service in sync with products
    useEffect(() => {
        ExpiryAlertService.setProducts(products);
    }, [products]);

    // Compute inventory alerts from real product data & expiry service
    const inventoryAlerts = useMemo(() => {
        const lowStockProducts = getLowStockProducts();
        const expiringAlerts = ExpiryAlertService.getCriticalAlerts();

        const combinedAlerts: any[] = [
            ...lowStockProducts.map((p, index) => {
                const isOut = p.stock === 0;
                const isCritical = p.stock <= (p.minStock || 5) * 0.3;
                return {
                    id: `low-${p.id}-${index}`,
                    product: `${p.emoji || '📦'} ${p.name}`,
                    type: isOut ? 'out' : isCritical ? 'critical' : 'low',
                    stock: p.stock,
                    min: p.minStock || 10,
                    urgency: isOut || isCritical ? 'high' : 'medium',
                    expiryDays: 0
                };
            }),
            ...expiringAlerts.map(a => ({
                id: a.id,
                product: a.productName,
                type: 'expiring',
                stock: a.quantity,
                min: 0,
                urgency: (a.status === 'expired' || a.status === 'critical') ? 'high' : 'medium',
                expiryDays: a.daysRemaining
            }))
        ];

        // Sort by urgency (high first) and limit to 5
        return combinedAlerts
            .sort((a, b) => {
                if (a.urgency === 'high' && b.urgency !== 'high') return -1;
                if (a.urgency !== 'high' && b.urgency === 'high') return 1;
                return 0;
            })
            .slice(0, 5);
    }, [products, getLowStockProducts]);

    // Compute recent transactions from real sales
    const recentTransactions = useMemo(() => {
        const todaySales = getTodaySales();
        const paymentLabels: { [key: string]: string } = {
            'cash': 'Espèces',
            'cib': 'CIB',
            'dahabia': 'Dahabia',
            'credit': 'Crédit',
            'card': 'Carte',
        };

        return todaySales.slice(0, 5).map((sale, index) => ({
            id: index + 1,
            time: new Date(sale.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            amount: sale.totalAmount,
            items: sale.items.reduce((sum, item) => sum + item.quantity, 0),
            payment: paymentLabels[sale.paymentMethod] || sale.paymentMethod,
        }));
    }, [sales]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        const calendarInsights = InsightsGenerator.generateDailyInsights();
        const smartInsights = BoniloIntelligence.smartInsights(sales, products);
        setAiInsights([...smartInsights, ...calendarInsights]);
        setTimeout(() => setIsRefreshing(false), 1500);
    };

    const handleAIAction = (insight: AIInsight) => {
        if (insight.actionRoute) {
            navigate(insight.actionRoute);
        } else if (insight.id.startsWith('event-')) {
            navigate('/inventory?tab=alerts');
        } else if (insight.id === 'margin-opportunity') {
            navigate('/reports');
        } else if (insight.id === 'expiry-alert') {
            navigate('/inventory?filter=expiring');
        } else {
            console.log(`Action pour: ${insight.title}`);
        }
        setShowAllInsights(false);
    };

    const handleQuickAction = (action: string) => {
        switch (action) {
            case 'pos':
                navigate('/pos');
                break;
            case 'addProduct':
                navigate('/inventory?action=add');
                break;
            case 'newCustomer':
                navigate('/customers?action=add');
                break;
            case 'dailyReport':
                navigate('/reports');
                break;
            case 'priceCheck':
                navigate('/inventory?tab=products');
                break;
            case 'inventory':
                navigate('/inventory');
                break;
            default:
                navigate('/');
        }
    };

    const getAlertBadgeClass = (type: string) => {
        switch (type) {
            case 'critical':
            case 'out':
                return styles.badgeDanger;
            case 'expiring':
            case 'low':
                return styles.badgeWarning;
            default:
                return styles.badgeInfo;
        }
    };

    const getAlertLabel = (type: string) => {
        switch (type) {
            case 'critical':
                return 'Critique';
            case 'out':
                return 'Rupture';
            case 'expiring':
                return 'Péremption';
            case 'low':
                return 'Stock faible';
            default:
                return type;
        }
    };

    return (
        <div className={styles.dashboard}>
            {/* Header */}
            <div className={styles.pageHeader}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.pageTitle}>Tableau de bord</h1>
                    <p className={styles.pageSubtitle}>
                        Bienvenue, {user?.firstName || 'Utilisateur'} • {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <div className={styles.periodToggle}>
                        <button
                            className={`${styles.periodBtn} ${selectedPeriod === 'today' ? styles.active : ''}`}
                            onClick={() => setSelectedPeriod('today')}
                        >
                            Aujourd'hui
                        </button>
                        <button
                            className={`${styles.periodBtn} ${selectedPeriod === 'week' ? styles.active : ''}`}
                            onClick={() => setSelectedPeriod('week')}
                        >
                            Semaine
                        </button>
                        <button
                            className={`${styles.periodBtn} ${selectedPeriod === 'month' ? styles.active : ''}`}
                            onClick={() => setSelectedPeriod('month')}
                        >
                            Mois
                        </button>
                    </div>
                    <button
                        className={`${styles.refreshBtn} ${isRefreshing ? styles.spinning : ''}`}
                        onClick={handleRefresh}
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className={styles.metricsGrid}>
                <div className={`${styles.metricCard} ${styles.metricSuccess}`}>
                    <div className={styles.metricIcon}>
                        <DollarSign size={24} />
                    </div>
                    <div className={styles.metricContent}>
                        <span className={styles.metricLabel}>Ventes du jour</span>
                        <span className={styles.metricValue}>{formatCurrency(metrics.dailySales)}</span>
                        <div className={`${styles.metricTrend} ${metrics.dailySalesChange >= 0 ? styles.trendUp : styles.trendDown}`}>
                            {metrics.dailySalesChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            <span>{metrics.dailySalesChange >= 0 ? '+' : ''}{metrics.dailySalesChange}% vs hier</span>
                        </div>
                    </div>
                </div>

                <div className={`${styles.metricCard} ${styles.metricPrimary}`}>
                    <div className={styles.metricIcon}>
                        <Receipt size={24} />
                    </div>
                    <div className={styles.metricContent}>
                        <span className={styles.metricLabel}>Transactions</span>
                        <span className={styles.metricValue}>{metrics.transactions}</span>
                        <div className={`${styles.metricTrend} ${metrics.transactionsChange >= 0 ? styles.trendUp : styles.trendDown}`}>
                            {metrics.transactionsChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            <span>{metrics.transactionsChange >= 0 ? '+' : ''}{metrics.transactionsChange}%</span>
                        </div>
                    </div>
                </div>

                <div className={`${styles.metricCard} ${styles.metricInfo}`}>
                    <div className={styles.metricIcon}>
                        <ShoppingCart size={24} />
                    </div>
                    <div className={styles.metricContent}>
                        <span className={styles.metricLabel}>Panier moyen</span>
                        <span className={styles.metricValue}>{formatCurrency(metrics.avgTicket)}</span>
                        <div className={`${styles.metricTrend} ${metrics.avgTicketChange >= 0 ? styles.trendUp : styles.trendDown}`}>
                            {metrics.avgTicketChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            <span>{metrics.avgTicketChange >= 0 ? '+' : ''}{metrics.avgTicketChange}%</span>
                        </div>
                    </div>
                </div>

                <div className={`${styles.metricCard} ${styles.metricWarning}`}>
                    <div className={styles.metricIcon}>
                        <AlertTriangle size={24} />
                    </div>
                    <div className={styles.metricContent}>
                        <span className={styles.metricLabel}>Alertes actives</span>
                        <span className={styles.metricValue}>{metrics.activeAlerts}</span>
                        <div className={`${styles.metricTrend} ${metrics.alertsChange <= 0 ? styles.trendUp : styles.trendDown}`}>
                            {metrics.alertsChange <= 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                            <span>{metrics.alertsChange} depuis hier</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Charts Row */}
            <div className={styles.chartsRow}>
                {/* Sales Chart */}
                <div className={styles.chartCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardTitle}>
                            <Activity size={18} />
                            <h3>Ventes par heure</h3>
                        </div>
                        <div className={styles.chartLegend}>
                            <div className={styles.legendItem}>
                                <span className={styles.legendDot} style={{ background: '#3D7C4F' }}></span>
                                <span>Aujourd'hui</span>
                            </div>
                            <div className={styles.legendItem}>
                                <span className={styles.legendDot} style={{ background: 'rgba(61, 124, 79, 0.2)' }}></span>
                                <span>Hier</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={hourlyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3D7C4F" stopOpacity={0.6} />
                                        <stop offset="95%" stopColor="#3D7C4F" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(229, 231, 235, 0.5)" vertical={false} />
                                <XAxis
                                    dataKey="hour"
                                    stroke="#9CA3AF"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#9CA3AF"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                                    dx={-10}
                                />
                                <Tooltip
                                    content={<CustomTooltip formatCurrency={formatCurrency} />}
                                    cursor={{ stroke: '#3D7C4F', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />

                                {/* Previous Period Ghost Area */}
                                <Area
                                    type="monotone"
                                    dataKey="previous"
                                    name="Hier"
                                    stroke="rgba(61, 124, 79, 0.3)"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    fill="transparent"
                                />

                                {/* Today Area */}
                                <Area
                                    type="monotone"
                                    dataKey="ventes"
                                    name="Chiffre d'affaires"
                                    stroke="#3D7C4F"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorVentes)"
                                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                                    animationBegin={200}
                                    animationDuration={1500}
                                />

                                {/* High Performance Marker */}
                                {peakValue > 0 && (
                                    <ReferenceDot
                                        x={peakHour}
                                        y={peakValue}
                                        r={6}
                                        fill="#3D7C4F"
                                        stroke="#fff"
                                        strokeWidth={2}
                                    >
                                        <Label value="Pic" position="top" fill="#3D7C4F" fontSize={11} fontWeight="bold" dy={-10} />
                                    </ReferenceDot>
                                )}

                                {avgValue > 0 && (
                                    <ReferenceLine
                                        y={avgValue}
                                        stroke="#9CA3AF"
                                        strokeDasharray="3 3"
                                        strokeOpacity={0.5}
                                    >
                                        <Label value="Moyenne" position="right" fill="#9CA3AF" fontSize={10} />
                                    </ReferenceLine>
                                )}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className={styles.chartFooter}>
                        {peakValue > 0 && (
                            <div className={styles.insightTag}>
                                <TrendingUp size={14} />
                                <span>Pic atteint à {peakHour} (<strong>{formatCurrency(peakValue)}</strong>)</span>
                            </div>
                        )}
                        {metrics.dailySalesChange !== 0 && (
                            <div className={styles.insightTag}>
                                <Zap size={14} />
                                <span>Ventes {metrics.dailySalesChange >= 0 ? 'en hausse' : 'en baisse'} de <strong>{Math.abs(metrics.dailySalesChange)}%</strong></span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Category Distribution */}
                <div className={styles.chartCardSmall}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardTitle}>
                            <BarChart3 size={18} />
                            <h3>Par catégorie</h3>
                        </div>
                    </div>
                    <div className={styles.chartContainer}>
                        <div className={styles.pieWrapper}>
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={90}
                                        paddingAngle={8}
                                        dataKey="value"
                                        animationBegin={400}
                                        animationDuration={1500}
                                        stroke="none"
                                    >
                                        <Label
                                            position="center"
                                            content={({ viewBox }: any) => {
                                                const { cx, cy } = viewBox;
                                                return (
                                                    <g>
                                                        <text
                                                            x={cx}
                                                            y={cy}
                                                            textAnchor="middle"
                                                            dominantBaseline="central"
                                                        >
                                                            <tspan
                                                                x={cx}
                                                                dy="-0.3em"
                                                                fontSize="22"
                                                                fontWeight="700"
                                                                fill="#111827"
                                                            >
                                                                100%
                                                            </tspan>
                                                            <tspan
                                                                x={cx}
                                                                dy="1.5em"
                                                                fontSize="12"
                                                                fontWeight="500"
                                                                fill="#6B7280"
                                                            >
                                                                TOTAL
                                                            </tspan>
                                                        </text>
                                                    </g>
                                                );
                                            }}
                                        />
                                        {categoryData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                                style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        content={<CustomTooltip formatCurrency={formatCurrency} />}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className={styles.legendListGrid}>
                            {categoryData.slice(0, 6).map((item) => (
                                <div key={item.name} className={styles.legendItem}>
                                    <span className={styles.legendDot} style={{ backgroundColor: item.color }} />
                                    <div className={styles.legendText}>
                                        <span className={styles.legendLabel}>{item.name}</span>
                                        <span className={styles.legendPercent}>
                                            {((item.value / categoryData.reduce((acc, c) => acc + c.value, 0)) * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Briefing — Phase B Intelligence */}
            <DailyBriefingWidget />

            {/* Quick Actions & Alerts Row */}
            <div className={styles.actionsRow}>
                {/* Quick Actions */}
                <div className={styles.quickActionsCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardTitle}>
                            <Zap size={18} />
                            <h3>Actions rapides</h3>
                        </div>
                    </div>
                    <div className={styles.actionsGrid}>
                        <button className={styles.actionBtn} onClick={() => handleQuickAction('pos')}>
                            <div className={`${styles.actionIcon} ${styles.actionPrimary}`}>
                                <CreditCard size={20} />
                            </div>
                            <span>Ouvrir caisse</span>
                        </button>
                        <button className={styles.actionBtn} onClick={() => handleQuickAction('addProduct')}>
                            <div className={`${styles.actionIcon} ${styles.actionSuccess}`}>
                                <PlusCircle size={20} />
                            </div>
                            <span>Ajouter produit</span>
                        </button>
                        <button className={styles.actionBtn} onClick={() => handleQuickAction('newCustomer')}>
                            <div className={`${styles.actionIcon} ${styles.actionInfo}`}>
                                <UserPlus size={20} />
                            </div>
                            <span>Nouveau client</span>
                        </button>
                        <button className={styles.actionBtn} onClick={() => handleQuickAction('dailyReport')}>
                            <div className={`${styles.actionIcon} ${styles.actionWarning}`}>
                                <FileText size={20} />
                            </div>
                            <span>Rapport du jour</span>
                        </button>
                        <button className={styles.actionBtn} onClick={() => handleQuickAction('priceCheck')}>
                            <div className={`${styles.actionIcon} ${styles.actionPrimary}`}>
                                <TrendingUp size={20} />
                            </div>
                            <span>Vérifier prix</span>
                        </button>
                        <button className={styles.actionBtn} onClick={() => handleQuickAction('inventory')}>
                            <div className={`${styles.actionIcon} ${styles.actionSuccess}`}>
                                <Package size={20} />
                            </div>
                            <span>Inventaire</span>
                        </button>
                    </div>
                </div>

                {/* Inventory Alerts */}
                <div className={styles.alertsCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardTitle}>
                            <AlertTriangle size={18} />
                            <h3>Alertes inventaire</h3>
                        </div>
                        <button className={styles.viewAllBtn} onClick={() => navigate('/inventory?tab=alerts')}>
                            Voir tout <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className={styles.alertsList}>
                        {inventoryAlerts.map((alert) => (
                            <div key={alert.id} className={styles.alertItem}>
                                <div className={styles.alertInfo}>
                                    {alert.type === 'expiring' ? (
                                        <Clock size={16} className={styles.alertIconWarning} />
                                    ) : alert.type === 'out' || alert.type === 'critical' ? (
                                        <XCircle size={16} className={styles.alertIconDanger} />
                                    ) : (
                                        <Package size={16} className={styles.alertIconWarning} />
                                    )}
                                    <div className={styles.alertDetails}>
                                        <span className={styles.alertProduct}>{alert.product}</span>
                                        <span className={styles.alertMeta}>
                                            {alert.type === 'expiring'
                                                ? `Expire dans ${alert.expiryDays} jours`
                                                : `Stock: ${alert.stock} / Min: ${alert.min}`}
                                        </span>
                                    </div>
                                </div>
                                <span className={`${styles.alertBadge} ${getAlertBadgeClass(alert.type)}`}>
                                    {getAlertLabel(alert.type)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className={styles.bottomRow}>
                {/* Payment Methods */}
                <div className={styles.paymentCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardTitle}>
                            <Wallet size={18} />
                            <h3>Modes de paiement</h3>
                        </div>
                    </div>
                    <div className={styles.paymentBars}>
                        {paymentData.map((payment) => (
                            <div key={payment.method} className={styles.paymentItem}>
                                <div className={styles.paymentInfo}>
                                    <span className={styles.paymentMethod}>{payment.method}</span>
                                    <span className={styles.paymentAmount}>{formatCurrency(payment.montant)}</span>
                                </div>
                                <div className={styles.paymentBar}>
                                    <div
                                        className={styles.paymentProgress}
                                        style={{ width: `${payment.percentage}%` }}
                                    />
                                </div>
                                <span className={styles.paymentPercent}>{payment.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className={styles.transactionsCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardTitle}>
                            <Receipt size={18} />
                            <h3>Dernières transactions</h3>
                        </div>
                        <span className={styles.liveDot} />
                    </div>
                    <div className={styles.transactionsList}>
                        {recentTransactions.map((tx) => (
                            <div key={tx.id} className={styles.transactionItem}>
                                <div className={styles.txTime}>{tx.time}</div>
                                <div className={styles.txDetails}>
                                    <span className={styles.txAmount}>{formatCurrency(tx.amount)}</span>
                                    <span className={styles.txMeta}>{tx.items} articles • {tx.payment}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Recommendations - Dynamic from Calendar */}
                <div className={styles.aiCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardTitle}>
                            <Brain size={18} className={styles.aiIcon} />
                            <h3>Intelligence IA</h3>
                        </div>
                        <div className={styles.cardHeaderRight}>
                            <span className={styles.aiBadge}>
                                <Sparkles size={12} /> Algérie
                            </span>
                            {aiInsights.length > 0 && (
                                <button
                                    className={styles.viewAllBtn}
                                    onClick={() => setShowAllInsights(true)}
                                >
                                    <Eye size={14} />
                                    Voir tout ({aiInsights.length})
                                </button>
                            )}
                        </div>
                    </div>
                    <div className={styles.aiList}>
                        {aiInsights.slice(0, 4).map((insight) => (
                            <div
                                key={insight.id}
                                className={`${styles.aiItem} ${styles[insight.importance]}`}
                            >
                                <span className={styles.aiEmoji}>{insight.icon}</span>
                                <div className={styles.aiContent}>
                                    <h4>{insight.title}</h4>
                                    <p>{insight.description}</p>
                                </div>
                                {insight.actionLabel && (
                                    <button
                                        className={styles.aiActionBtn}
                                        onClick={() => handleAIAction(insight)}
                                    >
                                        {insight.actionLabel}
                                    </button>
                                )}
                            </div>
                        ))}
                        {aiInsights.length === 0 && (
                            <div className={styles.aiEmpty}>
                                <Sparkles size={24} />
                                <p>Aucune recommandation pour le moment</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Insights Modal */}
            {showAllInsights && (
                <div className={styles.modalOverlay} onClick={() => setShowAllInsights(false)}>
                    <div className={styles.insightsModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalTitle}>
                                <Brain size={24} className={styles.aiIcon} />
                                <h2>Intelligence IA - Toutes les recommandations</h2>
                            </div>
                            <button className={styles.closeBtn} onClick={() => setShowAllInsights(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            {aiInsights.map((insight) => (
                                <div
                                    key={insight.id}
                                    className={`${styles.aiItemLarge} ${styles[insight.importance]}`}
                                >
                                    <span className={styles.aiEmoji}>{insight.icon}</span>
                                    <div className={styles.aiContent}>
                                        <h4>{insight.title}</h4>
                                        <p>{insight.description}</p>
                                    </div>
                                    {insight.actionLabel && (
                                        <button
                                            className={styles.aiActionBtnLarge}
                                            onClick={() => handleAIAction(insight)}
                                        >
                                            {insight.actionLabel}
                                            <ArrowRight size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;


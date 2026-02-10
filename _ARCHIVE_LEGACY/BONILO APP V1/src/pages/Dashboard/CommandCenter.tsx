import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    ShoppingCart,
    Target,
    Package,
    Users,
    Printer,
    ArrowUp,
    ArrowDown,
    ChevronRight,
    Bell,
    Settings,
    RefreshCw,
    Brain,
    Calendar,
    AlertTriangle,
    Zap,
    Clock,
    BarChart3,
    Activity,
    Sparkles,
    Sun,
    Moon,
    Coffee,
    Gift,
} from 'lucide-react';
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
import { InsightsGenerator, type AIInsight } from '../../services/ai/forecastingService';
import { 
    useSalesStore,
    useTreasuryStore,
    useProductsStore,
    useAuthStore
} from '@core/stores';
import { formatCurrencyCompact } from '../../utils/formatters';
import styles from './CommandCenter.module.css';

// Category colors for pie chart
const CATEGORY_COLORS: { [key: string]: string } = {
    'Épicerie': '#34C759',
    'Boissons': '#007AFF',
    'Produits Laitiers': '#AF52DE',
    'Laitiers': '#AF52DE',
    'Boulangerie': '#FF9500',
    'Pain': '#FF9500',
    'Snacks': '#EC4899',
    'Entretien': '#10B981',
    'default': '#8E8E93',
};

// ===== COMPONENT =====

// Custom dark-mode tooltip for premium look
const CustomTooltip = ({ active, payload, label, formatCurrency }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className={styles.customTooltip}>
                <p className={styles.tooltipLabel}>{label}</p>
                <div className={styles.tooltipDivider}></div>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className={styles.tooltipItem}>
                        <span className={styles.tooltipDot} style={{ backgroundColor: entry.color || entry.payload.color }}></span>
                        <span className={styles.tooltipName}>{entry.name}:</span>
                        <span className={styles.tooltipValue}>
                            {typeof entry.value === 'number' ? formatCurrencyCompact(entry.value) : entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export const CommandCenter: React.FC = () => {
    const navigate = useNavigate();
    const [dateRange, setDateRange] = useState('today');
    const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Real data from stores
    const { sales, getTodaySales, getTodayTotal } = useSalesStore();
    const { currentSession, getTodaySales: getTreasurySales } = useTreasuryStore();
    const { products } = useProductsStore();
    const { user } = useAuthStore();

    // Load AI insights
    useEffect(() => {
        setAiInsights(InsightsGenerator.generateDailyInsights());
    }, []);

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const formatNumber = (value: number) =>
        new Intl.NumberFormat('fr-DZ').format(value);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return { text: 'Bonjour', icon: <Coffee size={20} /> };
        if (hour < 18) return { text: 'Bon après-midi', icon: <Sun size={20} /> };
        return { text: 'Bonsoir', icon: <Moon size={20} /> };
    };

    const refreshData = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setAiInsights(InsightsGenerator.generateDailyInsights());
            setIsRefreshing(false);
        }, 800);
    };

    // Calculate REAL metrics from stores
    const todaySalesData = getTodaySales();
    const todaySales = getTodayTotal();
    const todayOrders = todaySalesData.length;
    const todayProfit = Math.round(todaySales * 0.15); // Estimate 15% profit margin
    const avgBasket = todayOrders > 0 ? Math.round(todaySales / todayOrders) : 0;
    const greeting = getGreeting();

    // Compute hourly sales data from real transactions
    const salesData = useMemo(() => {
        const hours: { [key: string]: { sales: number; orders: number } } = {};

        // Initialize hours from 08:00 to 20:00
        for (let h = 8; h <= 20; h++) {
            const hourStr = `${h.toString().padStart(2, '0')}h`;
            hours[hourStr] = { sales: 0, orders: 0 };
        }

        // Aggregate sales by hour
        todaySalesData.forEach(sale => {
            const hour = new Date(sale.timestamp).getHours();
            const hourStr = `${hour.toString().padStart(2, '0')}h`;
            if (hours[hourStr]) {
                hours[hourStr].sales += sale.totalAmount;
                hours[hourStr].orders += 1;
            }
        });

        return Object.entries(hours).map(([time, data]) => ({
            time,
            sales: data.sales,
            prev: Math.round(data.sales * 0.9), // Simulated previous day
            orders: data.orders,
        }));
    }, [todaySalesData]);

    // Compute category breakdown from real sales
    const categoryData = useMemo(() => {
        const categoryTotals: { [key: string]: number } = {};

        todaySalesData.forEach(sale => {
            sale.items.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                const category = product?.category || 'Autres';
                categoryTotals[category] = (categoryTotals[category] || 0) + item.total;
            });
        });

        const total = Object.values(categoryTotals).reduce((sum, v) => sum + v, 0);

        return Object.entries(categoryTotals)
            .map(([name, value]) => ({
                name,
                value: total > 0 ? Math.round((value / total) * 100) : 0,
                color: CATEGORY_COLORS[name] || CATEGORY_COLORS['default'],
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [todaySalesData, products]);

    // Compute top products from real sales
    const topProducts = useMemo(() => {
        const productSales: { [key: string]: { name: string; emoji: string; sales: number } } = {};

        todaySalesData.forEach(sale => {
            sale.items.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                if (!productSales[item.productId]) {
                    productSales[item.productId] = {
                        name: item.productName || product?.name || 'Inconnu',
                        emoji: product?.emoji || '📦',
                        sales: 0,
                    };
                }
                productSales[item.productId].sales += item.quantity;
            });
        });

        return Object.entries(productSales)
            .map(([id, data]) => ({
                id,
                name: data.name,
                emoji: data.emoji,
                sales: data.sales,
                trend: Math.round((Math.random() - 0.3) * 20), // Simulated trend
            }))
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5);
    }, [todaySalesData, products]);

    // Compute recent sales from real data
    const recentSales = useMemo(() => {
        const paymentLabels: { [key: string]: string } = {
            'cash': 'Espèces',
            'cib': 'CIB',
            'dahabia': 'Dahabia',
            'credit': 'Crédit',
            'card': 'Carte',
        };

        return todaySalesData.slice(0, 4).map(sale => {
            const now = new Date();
            const saleTime = new Date(sale.timestamp);
            const diffMinutes = Math.round((now.getTime() - saleTime.getTime()) / 60000);

            return {
                id: sale.id,
                items: sale.items.reduce((sum, item) => sum + item.quantity, 0),
                total: sale.totalAmount,
                time: diffMinutes < 60 ? `Il y a ${diffMinutes} min` : `Il y a ${Math.round(diffMinutes / 60)}h`,
                method: paymentLabels[sale.paymentMethod] || sale.paymentMethod,
            };
        });
    }, [todaySalesData]);

    // Critical insights
    const criticalInsights = aiInsights.filter(i =>
        i.importance === 'critical' || i.importance === 'high'
    ).slice(0, 3);

    return (
        <div className={styles.commandCenter}>
            {/* ===== HEADER ===== */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.greeting}>
                        {greeting.icon}
                        <span>{greeting.text}</span>
                    </div>
                    <h1 className={styles.title}>Command Center</h1>
                </div>
                <div className={styles.headerRight}>
                    <select
                        className={styles.periodSelector}
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                    >
                        <option value="today">Aujourd'hui</option>
                        <option value="week">Cette semaine</option>
                        <option value="month">Ce mois</option>
                    </select>
                    <button
                        className={styles.iconBtn}
                        onClick={refreshData}
                        disabled={isRefreshing}
                    >
                        <RefreshCw size={18} className={isRefreshing ? styles.spinning : ''} />
                    </button>
                    <button className={styles.iconBtn}>
                        <Bell size={18} />
                        {criticalInsights.length > 0 && (
                            <span className={styles.notifBadge}>{criticalInsights.length}</span>
                        )}
                    </button>
                    <button className={styles.iconBtn} onClick={() => navigate('/settings')}>
                        <Settings size={18} />
                    </button>
                </div>
            </header>

            {/* ===== METRICS STRIP ===== */}
            <div className={styles.metricsStrip}>
                <div className={styles.metricCard}>
                    <div className={styles.metricIcon} style={{ background: 'linear-gradient(135deg, #34C759, #30B350)' }}>
                        <DollarSign size={22} />
                    </div>
                    <div className={styles.metricContent}>
                        <span className={styles.metricValue}>{formatCurrencyCompact(todaySales)}</span>
                        <span className={styles.metricLabel}>Chiffre d'affaires</span>
                    </div>
                    <span className={`${styles.metricTrend} ${styles.positive}`}>
                        <ArrowUp size={14} /> 8.5%
                    </span>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon} style={{ background: 'linear-gradient(135deg, #007AFF, #0062CC)' }}>
                        <TrendingUp size={22} />
                    </div>
                    <div className={styles.metricContent}>
                        <span className={styles.metricValue}>{formatCurrencyCompact(todayProfit)}</span>
                        <span className={styles.metricLabel}>Bénéfice</span>
                    </div>
                    <span className={`${styles.metricTrend} ${styles.positive}`}>
                        <ArrowUp size={14} /> 5.2%
                    </span>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon} style={{ background: 'linear-gradient(135deg, #FF9500, #E68A00)' }}>
                        <ShoppingCart size={22} />
                    </div>
                    <div className={styles.metricContent}>
                        <span className={styles.metricValue}>{formatNumber(todayOrders)}</span>
                        <span className={styles.metricLabel}>Commandes</span>
                    </div>
                    <span className={`${styles.metricTrend} ${styles.negative}`}>
                        <ArrowDown size={14} /> 2.1%
                    </span>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon} style={{ background: 'linear-gradient(135deg, #AF52DE, #9B3DC9)' }}>
                        <Target size={22} />
                    </div>
                    <div className={styles.metricContent}>
                        <span className={styles.metricValue}>{formatCurrencyCompact(avgBasket)}</span>
                        <span className={styles.metricLabel}>Panier moyen</span>
                    </div>
                    <span className={`${styles.metricTrend} ${styles.positive}`}>
                        <ArrowUp size={14} /> 10.8%
                    </span>
                </div>
            </div>

            {/* ===== AI INTELLIGENCE BAR ===== */}
            {criticalInsights.length > 0 && (
                <div className={styles.aiBar}>
                    <div className={styles.aiBarHeader}>
                        <Brain size={18} />
                        <span>Intelligence IA</span>
                    </div>
                    <div className={styles.aiInsights}>
                        {criticalInsights.map((insight, idx) => (
                            <div
                                key={insight.id}
                                className={`${styles.aiInsight} ${styles[insight.importance]}`}
                            >
                                <span className={styles.aiIcon}>{insight.icon}</span>
                                <div className={styles.aiContent}>
                                    <strong>{insight.title}</strong>
                                    <p>{insight.description}</p>
                                </div>
                                {insight.actionLabel && (
                                    <button className={styles.aiAction}>
                                        {insight.actionLabel}
                                        <ChevronRight size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ===== MAIN CONTENT ===== */}
            <div className={styles.mainContent}>
                {/* Left Column: Charts */}
                <div className={styles.chartsColumn}>
                    {/* Sales Chart */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardTitle}>
                                <Activity size={18} />
                                <span>Ventes en direct</span>
                            </div>
                            <div className={styles.chartLegend}>
                                <div className={styles.legendItem}>
                                    <span className={styles.legendDot} style={{ background: '#34C759' }}></span>
                                    <span>Aujourd'hui</span>
                                </div>
                                <div className={styles.legendItem}>
                                    <span className={styles.legendDot} style={{ background: 'rgba(52, 199, 89, 0.2)' }}></span>
                                    <span>Hier</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height={260}>
                                <AreaChart data={salesData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#34C759" stopOpacity={0.6} />
                                            <stop offset="100%" stopColor="#34C759" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis
                                        dataKey="time"
                                        stroke="rgba(255,255,255,0.4)"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="rgba(255,255,255,0.4)"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(v) => `${v / 1000}k`}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        content={<CustomTooltip formatCurrency={formatCurrencyCompact} />}
                                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                                    />

                                    {/* Previous Period */}
                                    <Area
                                        type="monotone"
                                        dataKey="prev"
                                        name="Hier"
                                        stroke="rgba(52, 199, 89, 0.3)"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        fill="transparent"
                                        animationDuration={1500}
                                    />

                                    {/* Current Period */}
                                    <Area
                                        type="monotone"
                                        dataKey="sales"
                                        name="Ventes"
                                        stroke="#34C759"
                                        strokeWidth={4}
                                        fill="url(#salesGradient)"
                                        activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                                        animationDuration={1500}
                                    />

                                    {/* Markers */}
                                    <ReferenceDot
                                        x="16h"
                                        y={42100}
                                        r={6}
                                        fill="#34C759"
                                        stroke="#fff"
                                        strokeWidth={2}
                                    >
                                        <Label value="PIC" position="top" fill="#34C759" fontSize={10} fontWeight="900" dy={-10} />
                                    </ReferenceDot>

                                    <ReferenceLine
                                        y={28000}
                                        stroke="rgba(255,255,255,0.2)"
                                        strokeDasharray="3 3"
                                    >
                                        <Label value="MOYENNE" position="right" fill="rgba(255,255,255,0.3)" fontSize={9} />
                                    </ReferenceLine>
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className={styles.chartFooter}>
                            <div className={styles.insightTag}>
                                <Activity size={12} />
                                <span>Pic atteint à 16:00 (<strong>42k DA</strong>)</span>
                            </div>
                            <div className={styles.insightTag}>
                                <TrendingUp size={12} />
                                <span>+8.5% vs hier</span>
                            </div>
                        </div>
                    </div>


                    {/* Category Chart */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardTitle}>
                                <BarChart3 size={18} />
                                <span>Par catégorie</span>
                            </div>
                        </div>
                        <div className={styles.categoryContent}>
                            <div className={styles.pieWrapper}>
                                <ResponsiveContainer width="100%" height={180}>
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={6}
                                            dataKey="value"
                                            animationDuration={1500}
                                            stroke="none"
                                        >
                                            <Label
                                                position="center"
                                                content={({ viewBox }: any) => {
                                                    const { cx, cy } = viewBox;
                                                    return (
                                                        <g style={{ pointerEvents: 'none' }}>
                                                            <text
                                                                x={cx}
                                                                y={cy}
                                                                textAnchor="middle"
                                                                dominantBaseline="central"
                                                            >
                                                                <tspan
                                                                    x={cx}
                                                                    dy="-0.3em"
                                                                    fontSize="20"
                                                                    fontWeight="700"
                                                                    fill="#FFFFFF"
                                                                >
                                                                    100%
                                                                </tspan>
                                                                <tspan
                                                                    x={cx}
                                                                    dy="1.5em"
                                                                    fontSize="10"
                                                                    fontWeight="500"
                                                                    fill="rgba(255, 255, 255, 0.4)"
                                                                    style={{ letterSpacing: '0.1em' }}
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
                                                    style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            content={<CustomTooltip formatCurrency={(v: number) => `${v}%`} />}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className={styles.categoryLegend}>
                                {categoryData.map((cat, idx) => (
                                    <div key={idx} className={styles.legendItem}>
                                        <span className={styles.legendDot} style={{ background: cat.color }}></span>
                                        <div className={styles.legendText}>
                                            <span className={styles.legendName}>{cat.name}</span>
                                            <span className={styles.legendValue}>{cat.value}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Activity */}
                <div className={styles.activityColumn}>
                    {/* Top Products */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardTitle}>
                                <Zap size={18} />
                                <span>Top ventes</span>
                            </div>
                        </div>
                        <div className={styles.topProducts}>
                            {topProducts.map((product, idx) => (
                                <div key={product.id} className={styles.productItem}>
                                    <span className={styles.productRank}>{idx + 1}</span>
                                    <span className={styles.productEmoji}>{product.emoji}</span>
                                    <div className={styles.productInfo}>
                                        <span className={styles.productName}>{product.name}</span>
                                        <span className={styles.productSales}>{product.sales} vendus</span>
                                    </div>
                                    <span className={`${styles.productTrend} ${product.trend >= 0 ? styles.positive : styles.negative}`}>
                                        {product.trend >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                                        {Math.abs(product.trend)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Sales */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardTitle}>
                                <Clock size={18} />
                                <span>Dernières ventes</span>
                            </div>
                        </div>
                        <div className={styles.recentSales}>
                            {recentSales.map((sale) => (
                                <div key={sale.id} className={styles.saleItem}>
                                    <div className={styles.saleInfo}>
                                        <span className={styles.saleItems}>{sale.items} articles</span>
                                        <span className={styles.saleTime}>{sale.time}</span>
                                    </div>
                                    <div className={styles.saleRight}>
                                        <span className={styles.saleTotal}>{formatCurrencyCompact(sale.total)}</span>
                                        <span className={styles.saleMethod}>{sale.method}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== QUICK ACTIONS DOCK ===== */}
            <div className={styles.dock}>
                <button className={styles.dockItem} onClick={() => navigate('/pos')}>
                    <div className={styles.dockIcon} style={{ background: 'linear-gradient(135deg, #007AFF, #0051D4)' }}>
                        <ShoppingCart size={24} />
                    </div>
                    <span>Point de vente</span>
                </button>
                <button className={styles.dockItem} onClick={() => navigate('/inventory')}>
                    <div className={styles.dockIcon} style={{ background: 'linear-gradient(135deg, #34C759, #248A3D)' }}>
                        <Package size={24} />
                    </div>
                    <span>Inventaire</span>
                </button>
                <button className={styles.dockItem} onClick={() => navigate('/print')}>
                    <div className={styles.dockIcon} style={{ background: 'linear-gradient(135deg, #FF9500, #CC7700)' }}>
                        <Printer size={24} />
                    </div>
                    <span>Imprimer</span>
                </button>
                <button className={styles.dockItem} onClick={() => navigate('/customers')}>
                    <div className={styles.dockIcon} style={{ background: 'linear-gradient(135deg, #AF52DE, #8B3FC4)' }}>
                        <Users size={24} />
                    </div>
                    <span>Clients</span>
                </button>
                <button className={styles.dockItem} onClick={() => navigate('/treasury')}>
                    <div className={styles.dockIcon} style={{ background: 'linear-gradient(135deg, #FF3B30, #D62D24)' }}>
                        <DollarSign size={24} />
                    </div>
                    <span>Trésorerie</span>
                </button>
            </div>
        </div>
    );
};

export default CommandCenter;

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp,
    Calendar,
    Download,
    RefreshCw,
    Brain,
    Sparkles,
    ArrowUp,
    ArrowDown,
    FileSpreadsheet,
    FileText,
    Printer,
    ArrowLeft,
    Target,
    Zap,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { useSettings } from '../../contexts/SettingsContext';
import { useSalesStore, useProductsStore } from '@bonilo/shared/stores';
import { ForecastingEngine, type AIInsight, getAlgerianCalendarEvents } from '../../services/ai/forecastingService';
import { BoniloIntelligence } from '../../services/ai/intelligenceService';
import styles from './ReportsHub.module.css';
import { formatCurrencyCompact } from '../../utils/formatters';

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

export const ReportsHub: React.FC = () => {
    const navigate = useNavigate();
    const { formatCurrency: settingsFormatCurrency } = useSettings();
    const { sales } = useSalesStore();
    const { products } = useProductsStore();

    const [comparisonPeriod, setComparisonPeriod] = useState<'day' | 'week' | 'month'>('day');
    const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    // Use smart insights powered by real data
    useEffect(() => {
        setAiInsights(BoniloIntelligence.smartInsights(sales, products));
    }, [sales, products]);

    // Helper: Calculate data for a specific range
    const getRangeData = (start: Date, end: Date) => {
        const periodSales = sales.filter(s => {
            const d = new Date(s.timestamp);
            return d >= start && d <= end;
        });

        const revenue = periodSales.reduce((sum, s) => sum + s.totalAmount, 0);
        const orders = periodSales.length;
        const avgBasket = orders > 0 ? revenue / orders : 0;

        // Calculate real margin from sales data
        let totalCost = 0;
        let totalRevenue = 0;

        periodSales.forEach(sale => {
            sale.items.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                if (product) {
                    totalCost += (product.purchasePrice || product.buyPrice || 0) * item.quantity;
                    totalRevenue += item.total;
                }
            });
        });

        const margin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;

        return { revenue, orders, avgBasket, margin };
    };

    const comparisonData = useMemo(() => {
        const now = new Date();
        let currentStart: Date, currentEnd: Date, prevStart: Date, prevEnd: Date;

        if (comparisonPeriod === 'day') {
            currentStart = new Date(now.setHours(0, 0, 0, 0));
            currentEnd = new Date(now.setHours(23, 59, 59, 999));
            prevStart = new Date(currentStart);
            prevStart.setDate(prevStart.getDate() - 1);
            prevEnd = new Date(currentEnd);
            prevEnd.setDate(prevEnd.getDate() - 1);
        } else if (comparisonPeriod === 'week') {
            currentStart = new Date(now);
            currentStart.setDate(now.getDate() - 7);
            currentEnd = new Date();
            prevStart = new Date(currentStart);
            prevStart.setDate(prevStart.getDate() - 7);
            prevEnd = new Date(currentStart);
        } else {
            currentStart = new Date(now);
            currentStart.setMonth(now.getMonth() - 1);
            currentEnd = new Date();
            prevStart = new Date(currentStart);
            prevStart.setMonth(prevStart.getMonth() - 1);
            prevEnd = new Date(currentStart);
        }

        return {
            currentPeriod: getRangeData(currentStart, currentEnd),
            previousPeriod: getRangeData(prevStart, prevEnd),
        };
    }, [sales, comparisonPeriod]);

    // Top performers logic — with real growth comparison
    const topPerformers = useMemo(() => {
        const now = new Date();
        const midpoint = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);

        const recentMap: Record<string, { revenue: number; count: number }> = {};
        const olderMap: Record<string, { revenue: number }> = {};

        sales.forEach(s => {
            const d = new Date(s.timestamp);
            s.items.forEach(item => {
                const name = item.productName || item.productId;
                if (d >= midpoint) {
                    if (!recentMap[name]) recentMap[name] = { revenue: 0, count: 0 };
                    recentMap[name].revenue += item.total;
                    recentMap[name].count += item.quantity;
                } else {
                    if (!olderMap[name]) olderMap[name] = { revenue: 0 };
                    olderMap[name].revenue += item.total;
                }
            });
        });

        return Object.entries(recentMap)
            .sort((a, b) => b[1].revenue - a[1].revenue)
            .slice(0, 3)
            .map(([name, data], idx) => {
                const older = olderMap[name]?.revenue || 0;
                const growth = older > 0
                    ? Math.round(((data.revenue - older) / older) * 100)
                    : (data.revenue > 0 ? 100 : 0);
                return {
                    name,
                    revenue: data.revenue,
                    growth,
                    rank: idx + 1,
                };
            });
    }, [sales]);

    // Using centralized formatCurrencyCompact for compact display
    const formatCurrency = formatCurrencyCompact;

    const formatFullCurrency = (value: number) => settingsFormatCurrency(value);

    const calcChange = (current: number, previous: number) => {
        if (previous === 0) return { value: current > 0 ? '100' : '0', positive: current > 0 };
        const change = ((current - previous) / previous) * 100;
        return { value: change.toFixed(1), positive: change >= 0 };
    };

    const data = comparisonData;
    const revenueChange = calcChange(data.currentPeriod.revenue, data.previousPeriod.revenue);
    const ordersChange = calcChange(data.currentPeriod.orders, data.previousPeriod.orders);
    const basketChange = calcChange(data.currentPeriod.avgBasket, data.previousPeriod.avgBasket);
    const marginChange = calcChange(data.currentPeriod.margin, data.previousPeriod.margin);

    const refreshData = () => {
        setIsLoading(true);
        setTimeout(() => {
            setAiInsights(BoniloIntelligence.smartInsights(sales, products));
            setIsLoading(false);
        }, 800);
    };

    const handleExport = (type: 'pdf' | 'excel' | 'print') => {
        setShowExportMenu(false);
        if (type === 'excel') {
            const headers = ['Métrique', 'Période Actuelle', 'Période Précédente', 'Variation'];
            const rows = [
                ['Chiffre d\'affaires', data.currentPeriod.revenue, data.previousPeriod.revenue, `${revenueChange.value}%`],
                ['Commandes', data.currentPeriod.orders, data.previousPeriod.orders, `${ordersChange.value}%`],
                ['Panier moyen', data.currentPeriod.avgBasket, data.previousPeriod.avgBasket, `${basketChange.value}%`],
                ['Marge', `${data.currentPeriod.margin}%`, `${data.previousPeriod.margin}%`, `${marginChange.value}%`],
            ];
            const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `rapport_${comparisonPeriod}_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            URL.revokeObjectURL(link.href);
        } else {
            window.print();
        }
    };

    // AI Forecast — powered by real sales data via ForecastingEngine
    const revenueForecast = useMemo(() =>
        ForecastingEngine.forecastRevenue(sales, 7),
        [sales]
    );

    const forecastData = revenueForecast.forecasts.map((f, i) => ({
        ...f,
        actual: i === 0 ? data.currentPeriod.revenue : undefined,
    }));

    const events = getAlgerianCalendarEvents(new Date().getFullYear());
    const today = new Date();
    const nextEvent = events.find(e => e.startDate > today);
    const daysUntilEvent = nextEvent ? Math.ceil((nextEvent.startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;

    const trendEmoji = revenueForecast.trend === 'rising' ? '📈' : revenueForecast.trend === 'falling' ? '📉' : '➡️';
    const trendLabel = revenueForecast.trend === 'rising' ? 'Hausse' : revenueForecast.trend === 'falling' ? 'Baisse' : 'Stable';

    const criticalCount = aiInsights.filter(i => i.importance === 'critical' || i.importance === 'high').length;

    const periodLabels = {
        day: { current: "Aujourd'hui", previous: 'Hier' },
        week: { current: 'Cette semaine', previous: 'Semaine dernière' },
        month: { current: 'Ce mois', previous: 'Mois dernier' },
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerMain}>
                    <button className={styles.backBtn} onClick={() => navigate('/')}>
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1>Analyse & Prévisions</h1>
                        <p>Intelligence IA • Calendrier Algérien</p>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    <div className={styles.periodToggle}>
                        {(['day', 'week', 'month'] as const).map(p => (
                            <button
                                key={p}
                                className={`${styles.periodBtn} ${comparisonPeriod === p ? styles.active : ''}`}
                                onClick={() => setComparisonPeriod(p)}
                            >
                                {p === 'day' ? 'Jour' : p === 'week' ? 'Semaine' : 'Mois'}
                            </button>
                        ))}
                    </div>
                    <button className={styles.iconBtn} onClick={refreshData} disabled={isLoading}>
                        <RefreshCw size={18} className={isLoading ? styles.spinning : ''} />
                    </button>
                    <div className={styles.exportWrapper}>
                        <button className={styles.exportBtn} onClick={() => setShowExportMenu(!showExportMenu)}>
                            <Download size={18} />
                            Exporter
                        </button>
                        {showExportMenu && (
                            <div className={styles.exportMenu}>
                                <button onClick={() => handleExport('pdf')}>
                                    <FileText size={16} /> PDF
                                </button>
                                <button onClick={() => handleExport('excel')}>
                                    <FileSpreadsheet size={16} /> Excel
                                </button>
                                <button onClick={() => handleExport('print')}>
                                    <Printer size={16} /> Imprimer
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className={styles.main}>
                {/* SECTION 1: Comparison Metrics */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>
                            <TrendingUp size={20} />
                            {periodLabels[comparisonPeriod].current} vs {periodLabels[comparisonPeriod].previous}
                        </h2>
                    </div>
                    <div className={styles.comparisonGrid}>
                        <div className={styles.comparisonCard}>
                            <span className={styles.comparisonLabel}>Chiffre d'affaires</span>
                            <span className={styles.comparisonValue}>{formatCurrency(data.currentPeriod.revenue)}</span>
                            <div className={styles.comparisonChange}>
                                <span className={styles.previousValue}>{formatCurrency(data.previousPeriod.revenue)}</span>
                                <span className={`${styles.changeBadge} ${revenueChange.positive ? styles.positive : styles.negative}`}>
                                    {revenueChange.positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                                    {revenueChange.value}%
                                </span>
                            </div>
                        </div>
                        <div className={styles.comparisonCard}>
                            <span className={styles.comparisonLabel}>Commandes</span>
                            <span className={styles.comparisonValue}>{data.currentPeriod.orders}</span>
                            <div className={styles.comparisonChange}>
                                <span className={styles.previousValue}>{data.previousPeriod.orders}</span>
                                <span className={`${styles.changeBadge} ${ordersChange.positive ? styles.positive : styles.negative}`}>
                                    {ordersChange.positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                                    {ordersChange.value}%
                                </span>
                            </div>
                        </div>
                        <div className={styles.comparisonCard}>
                            <span className={styles.comparisonLabel}>Panier moyen</span>
                            <span className={styles.comparisonValue}>{formatFullCurrency(data.currentPeriod.avgBasket)}</span>
                            <div className={styles.comparisonChange}>
                                <span className={styles.previousValue}>{formatFullCurrency(data.previousPeriod.avgBasket)}</span>
                                <span className={`${styles.changeBadge} ${basketChange.positive ? styles.positive : styles.negative}`}>
                                    {basketChange.positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                                    {basketChange.value}%
                                </span>
                            </div>
                        </div>
                        <div className={styles.comparisonCard}>
                            <span className={styles.comparisonLabel}>Marge</span>
                            <span className={styles.comparisonValue}>{data.currentPeriod.margin}%</span>
                            <div className={styles.comparisonChange}>
                                <span className={styles.previousValue}>{data.previousPeriod.margin}%</span>
                                <span className={`${styles.changeBadge} ${marginChange.positive ? styles.positive : styles.negative}`}>
                                    {marginChange.positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                                    {marginChange.value}%
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: AI Forecast */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>
                            <Brain size={20} />
                            Prévisions IA - 7 jours
                        </h2>
                        {nextEvent && (
                            <div className={styles.eventAlert}>
                                <span className={styles.eventEmoji}>
                                    {nextEvent.type === 'religious' ? '🌙' : '📅'}
                                </span>
                                <span>{nextEvent.nameAr} dans {daysUntilEvent}j</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.forecastRow}>
                        <div className={styles.forecastChart}>
                            <ResponsiveContainer width="100%" height={240}>
                                <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6} />
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#34C759" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#34C759" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(229, 231, 235, 0.5)" vertical={false} />
                                    <XAxis
                                        dataKey="day"
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
                                        tickFormatter={(v) => `${v / 1000}k`}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        content={<CustomTooltip formatCurrency={formatFullCurrency} />}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="predicted"
                                        name="Prédiction IA"
                                        stroke="#8B5CF6"
                                        strokeWidth={4}
                                        fill="url(#forecastGradient)"
                                        activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                                        animationDuration={1500}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="actual"
                                        name="Réel"
                                        stroke="#34C759"
                                        strokeWidth={3}
                                        strokeDasharray="5 5"
                                        fill="url(#actualGradient)"
                                        activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }}
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className={styles.forecastStats}>
                            <div className={styles.statCard}>
                                <Sparkles size={18} />
                                <div>
                                    <span>Prévu 7 jours</span>
                                    <strong>{formatCurrency(revenueForecast.forecasts.reduce((s, f) => s + f.predicted, 0))}</strong>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <Target size={18} />
                                <div>
                                    <span>Confiance IA</span>
                                    <strong>{Math.round(revenueForecast.confidence * 100)}%</strong>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <Calendar size={18} />
                                <div>
                                    <span>Tendance</span>
                                    <strong>{trendEmoji} {trendLabel}</strong>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <Calendar size={18} />
                                <div>
                                    <span>Pic prévu</span>
                                    <strong>{revenueForecast.peakDay}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: Insights + Performance */}
                <section className={styles.section}>
                    <div className={styles.twoColumns}>
                        <div className={styles.insightsPanel}>
                            <div className={styles.panelHeader}>
                                <h3>
                                    <Zap size={18} />
                                    Actions recommandées
                                </h3>
                                {criticalCount > 0 && <span className={styles.alertBadge}>{criticalCount}</span>}
                            </div>
                            <div className={styles.insightsList}>
                                {aiInsights.slice(0, 4).map(insight => (
                                    <div key={insight.id} className={`${styles.insightItem} ${styles[insight.importance]}`}>
                                        <span className={styles.insightEmoji}>{insight.icon}</span>
                                        <div className={styles.insightContent}>
                                            <strong>{insight.title}</strong>
                                            <p>{insight.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.performancePanel}>
                            <div className={styles.performanceSection}>
                                <h4>🔥 Top Produits</h4>
                                {topPerformers.map(p => (
                                    <div key={p.name} className={styles.performerItem}>
                                        <span className={styles.performerRank}>{p.rank}</span>
                                        <span className={styles.performerName}>{p.name}</span>
                                        <span className={styles.performerValue}>{formatCurrency(p.revenue)}</span>
                                        <span className={`${styles.performerGrowth} ${p.growth >= 0 ? styles.positive : styles.negative}`}>{p.growth >= 0 ? '+' : ''}{p.growth}%</span>
                                    </div>
                                ))}
                                {topPerformers.length === 0 && <p className={styles.empty}>Aucune vente enregistrée</p>}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ReportsHub;

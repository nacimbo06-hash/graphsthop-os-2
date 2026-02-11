/**
 * Bonilo Intelligence Service — Phase B
 *
 * Connects the forecasting engine to REAL data from Zustand stores.
 * Provides:
 *   1. ABC Analysis (revenue-based product classification)
 *   2. Margin Analysis (per-product & per-category)
 *   3. Daily Briefing (yesterday summary + today forecast)
 *   4. Smart Reorder Points (velocity-based, not guesswork)
 *   5. Anomaly Detection (Z-score on daily totals)
 */

import type { Product } from '@bonilo/shared/types/product';
import type { Sale } from '@bonilo/shared/types/sales';
import {
    ForecastingEngine,
    AnomalyDetector,
    getActiveEvents,
    isInSalaryPeriod,
    isFriday,
    type ForecastResult,
    type AIInsight,
    type ReorderSuggestion,
    type AnomalyResult,
    type TrendDirection,
} from './forecastingService';

// ═══════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════

export interface ABCProduct {
    id: string;
    name: string;
    emoji: string;
    category: string;
    revenue: number;
    unitsSold: number;
    margin: number;
    marginPercent: number;
    cumulativePercent: number;
    tier: 'A' | 'B' | 'C';
}

export interface CategoryInsight {
    category: string;
    revenue: number;
    cost: number;
    margin: number;
    marginPercent: number;
    productCount: number;
    avgVelocity: number; // units/day
}

export interface DailyBriefing {
    // Yesterday summary
    yesterday: {
        revenue: number;
        transactions: number;
        avgBasket: number;
        topProduct: { name: string; emoji: string; units: number; revenue: number } | null;
        marginTotal: number;
        marginPercent: number;
        comparedToLastWeek: number; // percent change
    };
    // Today forecast
    today: {
        predictedRevenue: number;
        confidence: number;
        factors: string[];
        isPayDay: boolean;
        isFriday: boolean;
        activeEvents: string[];
        trend: TrendDirection;
    };
    // Actions to take
    actions: BriefingAction[];
    // Score (0-100)
    healthScore: number;
    generatedAt: Date;
}

export interface BriefingAction {
    id: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    icon: string;
    title: string;
    description: string;
    route?: string;
}

export interface VelocityData {
    productId: string;
    avgDailyUnits: number;
    daysOfStock: number;
    suggestedReorderQty: number;
}

// ═══════════════════════════════════════════════════
// ABC ANALYSIS ENGINE
// ═══════════════════════════════════════════════════

function performABCAnalysis(sales: Sale[], products: Product[], days: number = 30): ABCProduct[] {
    const now = new Date();
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Aggregate revenue per product from sale items
    const revenueMap = new Map<string, { revenue: number; units: number; cost: number }>();
    const productMap = new Map<string, Product>();
    products.forEach(p => productMap.set(p.id, p));

    const recentSales = sales.filter(s => new Date(s.timestamp) >= cutoff);

    for (const sale of recentSales) {
        for (const item of sale.items) {
            const existing = revenueMap.get(item.productId) || { revenue: 0, units: 0, cost: 0 };
            const product = productMap.get(item.productId);
            const cost = product?.purchasePrice ?? product?.buyPrice ?? 0;
            existing.revenue += item.total;
            existing.units += item.quantity;
            existing.cost += cost * item.quantity;
            revenueMap.set(item.productId, existing);
        }
    }

    // Sort by revenue descending
    const entries = Array.from(revenueMap.entries())
        .map(([productId, data]) => {
            const product = productMap.get(productId);
            return {
                id: productId,
                name: product?.name || 'Produit inconnu',
                emoji: product?.emoji || '📦',
                category: product?.category || 'autre',
                revenue: data.revenue,
                unitsSold: data.units,
                margin: data.revenue - data.cost,
                marginPercent: data.revenue > 0 ? ((data.revenue - data.cost) / data.revenue) * 100 : 0,
                cumulativePercent: 0,
                tier: 'C' as 'A' | 'B' | 'C',
            };
        })
        .sort((a, b) => b.revenue - a.revenue);

    // Calculate cumulative percentages and assign tiers
    const totalRevenue = entries.reduce((sum, e) => sum + e.revenue, 0);
    let cumulative = 0;

    for (const entry of entries) {
        cumulative += entry.revenue;
        entry.cumulativePercent = totalRevenue > 0 ? (cumulative / totalRevenue) * 100 : 0;

        if (entry.cumulativePercent <= 80) {
            entry.tier = 'A';
        } else if (entry.cumulativePercent <= 95) {
            entry.tier = 'B';
        } else {
            entry.tier = 'C';
        }
    }

    return entries;
}

// ═══════════════════════════════════════════════════
// CATEGORY INSIGHTS
// ═══════════════════════════════════════════════════

function getCategoryInsights(sales: Sale[], products: Product[], days: number = 30): CategoryInsight[] {
    const now = new Date();
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const recentSales = sales.filter(s => new Date(s.timestamp) >= cutoff);

    const productMap = new Map<string, Product>();
    products.forEach(p => productMap.set(p.id, p));

    const catMap = new Map<string, { revenue: number; cost: number; units: number; products: Set<string> }>();

    for (const sale of recentSales) {
        for (const item of sale.items) {
            const product = productMap.get(item.productId);
            const category = product?.category || 'autre';
            const cost = (product?.purchasePrice ?? product?.buyPrice ?? 0) * item.quantity;
            const existing = catMap.get(category) || { revenue: 0, cost: 0, units: 0, products: new Set<string>() };
            existing.revenue += item.total;
            existing.cost += cost;
            existing.units += item.quantity;
            existing.products.add(item.productId);
            catMap.set(category, existing);
        }
    }

    return Array.from(catMap.entries())
        .map(([category, data]) => ({
            category,
            revenue: data.revenue,
            cost: data.cost,
            margin: data.revenue - data.cost,
            marginPercent: data.revenue > 0 ? ((data.revenue - data.cost) / data.revenue) * 100 : 0,
            productCount: data.products.size,
            avgVelocity: days > 0 ? data.units / days : 0,
        }))
        .sort((a, b) => b.revenue - a.revenue);
}

// ═══════════════════════════════════════════════════
// PRODUCT VELOCITY & SMART REORDER
// ═══════════════════════════════════════════════════

function calculateVelocities(sales: Sale[], products: Product[], days: number = 30): VelocityData[] {
    const now = new Date();
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const recentSales = sales.filter(s => new Date(s.timestamp) >= cutoff);

    const unitsSoldMap = new Map<string, number>();

    for (const sale of recentSales) {
        for (const item of sale.items) {
            unitsSoldMap.set(item.productId, (unitsSoldMap.get(item.productId) || 0) + item.quantity);
        }
    }

    return products
        .filter(p => p.isActive !== false)
        .map(p => {
            const totalUnits = unitsSoldMap.get(p.id) || 0;
            const avgDaily = days > 0 ? totalUnits / days : 0;
            const daysOfStock = avgDaily > 0 ? p.stock / avgDaily : 999;
            const leadTime = 3; // default 3-day lead time
            const safetyBuffer = 2; // 2-day safety stock
            const suggestedReorderQty = Math.max(0, Math.ceil(avgDaily * (leadTime + safetyBuffer) - p.stock));

            return {
                productId: p.id,
                avgDailyUnits: Math.round(avgDaily * 100) / 100,
                daysOfStock: Math.round(daysOfStock),
                suggestedReorderQty,
            };
        })
        .filter(v => v.avgDailyUnits > 0)
        .sort((a, b) => a.daysOfStock - b.daysOfStock);
}

// ═══════════════════════════════════════════════════
// DAILY BRIEFING GENERATOR
// ═══════════════════════════════════════════════════

function generateDailyBriefing(sales: Sale[], products: Product[]): DailyBriefing {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
    const lastWeekSameDay = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastWeekDayEnd = new Date(lastWeekSameDay.getTime() + 24 * 60 * 60 * 1000);

    const productMap = new Map<string, Product>();
    products.forEach(p => productMap.set(p.id, p));

    // ── Yesterday's Performance ──
    const yesterdaySales = sales.filter(s => {
        const d = new Date(s.timestamp);
        return d >= yesterdayStart && d < todayStart;
    });

    const yesterdayRevenue = yesterdaySales.reduce((sum, s) => sum + s.totalAmount, 0);
    const yesterdayTransactions = yesterdaySales.length;
    const yesterdayAvgBasket = yesterdayTransactions > 0 ? yesterdayRevenue / yesterdayTransactions : 0;

    // Top product yesterday
    const productSalesMap = new Map<string, { units: number; revenue: number }>();
    for (const sale of yesterdaySales) {
        for (const item of sale.items) {
            const existing = productSalesMap.get(item.productId) || { units: 0, revenue: 0 };
            existing.units += item.quantity;
            existing.revenue += item.total;
            productSalesMap.set(item.productId, existing);
        }
    }

    let topProduct: DailyBriefing['yesterday']['topProduct'] = null;
    let maxRev = 0;
    for (const [pid, data] of productSalesMap) {
        if (data.revenue > maxRev) {
            maxRev = data.revenue;
            const product = productMap.get(pid);
            topProduct = {
                name: product?.name || 'Inconnu',
                emoji: product?.emoji || '📦',
                units: data.units,
                revenue: data.revenue,
            };
        }
    }

    // Margin calculation
    let totalCost = 0;
    for (const sale of yesterdaySales) {
        for (const item of sale.items) {
            const product = productMap.get(item.productId);
            const cost = product?.purchasePrice ?? product?.buyPrice ?? 0;
            totalCost += cost * item.quantity;
        }
    }
    const marginTotal = yesterdayRevenue - totalCost;
    const marginPercent = yesterdayRevenue > 0 ? (marginTotal / yesterdayRevenue) * 100 : 0;

    // Compare to last week same day
    const lastWeekDaySales = sales.filter(s => {
        const d = new Date(s.timestamp);
        return d >= lastWeekSameDay && d < lastWeekDayEnd;
    });
    const lastWeekRevenue = lastWeekDaySales.reduce((sum, s) => sum + s.totalAmount, 0);
    const comparedToLastWeek = lastWeekRevenue > 0
        ? ((yesterdayRevenue - lastWeekRevenue) / lastWeekRevenue) * 100
        : (yesterdayRevenue > 0 ? 100 : 0);

    // ── Today's Forecast ──
    const events = getActiveEvents(now);
    const eventNames = events.map(e => e.nameAr || e.name);
    const todayIsFriday = isFriday(now);
    const todayIsPayDay = isInSalaryPeriod(now);

    // Estimate today's revenue from recent 7-day average + multipliers
    const last7Start = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last7Sales = sales.filter(s => {
        const d = new Date(s.timestamp);
        return d >= last7Start && d < todayStart;
    });
    const avgDailyRevenue = last7Sales.length > 0
        ? last7Sales.reduce((sum, s) => sum + s.totalAmount, 0) / 7
        : 0;

    let multiplier = 1.0;
    const factors: string[] = [];

    if (todayIsFriday) {
        multiplier *= 1.25;
        factors.push('Vendredi (+25%)');
    }
    if (todayIsPayDay) {
        multiplier *= 1.15;
        factors.push('Période de salaire (+15%)');
    }
    for (const event of events) {
        const avgMult = Object.values(event.demandMultipliers).reduce((a, b) => a + b, 0) /
            Object.values(event.demandMultipliers).length;
        if (avgMult > 1) {
            multiplier *= avgMult;
            factors.push(`${event.nameAr || event.name} (+${Math.round((avgMult - 1) * 100)}%)`);
        }
    }

    const predictedRevenue = Math.round(avgDailyRevenue * multiplier);

    // Dynamic confidence from ForecastingEngine
    const trend = ForecastingEngine.detectRevenueTrend(sales, 14);
    // Build actual daily revenue for confidence computation
    const dailyRevBuckets = ForecastingEngine.buildDailyRevenue(sales, 21);
    const hasEvent = events.length > 0;
    // Base confidence from data characteristics
    let confidence: number;
    if (dailyRevBuckets.filter(v => v > 0).length >= 14) {
        // Enough data for real confidence
        const mean = dailyRevBuckets.reduce((a, b) => a + b, 0) / dailyRevBuckets.length;
        const cv = mean > 0
            ? Math.sqrt(dailyRevBuckets.reduce((s, x) => s + Math.pow(x - mean, 2), 0) / dailyRevBuckets.length) / mean
            : 1;
        const volumeScore = Math.min(1, dailyRevBuckets.filter(v => v > 0).length / 21);
        const cvScore = Math.max(0, Math.min(1, 1 - cv));
        confidence = volumeScore * 0.4 + cvScore * 0.35 + (hasEvent ? 0.85 : 0.6) * 0.25;
        confidence = Math.round(Math.max(0.20, Math.min(0.95, confidence)) * 100) / 100;
    } else if (sales.length > 7) {
        confidence = 0.55;
    } else {
        confidence = 0.30;
    }

    // ── Actions to Take ──
    const actions: BriefingAction[] = [];
    const velocities = calculateVelocities(sales, products);

    // Critical stock alerts
    const criticalProducts = products.filter(p =>
        p.isActive !== false && p.stock <= (p.minStock || 5) * 0.3 && p.stock > 0
    );
    const outOfStock = products.filter(p => p.isActive !== false && p.stock === 0);

    if (outOfStock.length > 0) {
        actions.push({
            id: 'out-of-stock',
            priority: 'critical',
            icon: '🚨',
            title: `${outOfStock.length} produit${outOfStock.length > 1 ? 's' : ''} en rupture`,
            description: outOfStock.slice(0, 3).map(p => p.name).join(', ') +
                (outOfStock.length > 3 ? ` et ${outOfStock.length - 3} autres` : ''),
            route: '/inventory?tab=alerts',
        });
    }

    if (criticalProducts.length > 0) {
        actions.push({
            id: 'critical-stock',
            priority: 'high',
            icon: '⚠️',
            title: `${criticalProducts.length} produit${criticalProducts.length > 1 ? 's' : ''} stock critique`,
            description: criticalProducts.slice(0, 3).map(p => `${p.name} (${p.stock} restant)`).join(', '),
            route: '/inventory?tab=alerts',
        });
    }

    // Fast movers low on stock (from velocity analysis)
    const fastMoversLow = velocities.filter(v => v.daysOfStock <= 5 && v.daysOfStock > 0);
    if (fastMoversLow.length > 0) {
        const names = fastMoversLow.slice(0, 3).map(v => {
            const p = productMap.get(v.productId);
            return `${p?.name || '?'} (${v.daysOfStock}j)`;
        });
        actions.push({
            id: 'fast-movers-low',
            priority: 'high',
            icon: '🔥',
            title: `${fastMoversLow.length} produit${fastMoversLow.length > 1 ? 's' : ''} rapide${fastMoversLow.length > 1 ? 's' : ''} bientôt en rupture`,
            description: names.join(', '),
            route: '/inventory?tab=movements',
        });
    }

    // Event preparation
    if (events.length > 0) {
        actions.push({
            id: 'event-prep',
            priority: 'medium',
            icon: '📅',
            title: `Événement actif: ${events[0].nameAr || events[0].name}`,
            description: 'Vérifiez que vos stocks sont prêts pour la demande accrue',
            route: '/inventory',
        });
    }

    // ── Health Score ──
    let healthScore = 100;

    // Deduct for out-of-stock
    healthScore -= Math.min(30, outOfStock.length * 5);

    // Deduct for critical stock
    healthScore -= Math.min(20, criticalProducts.length * 3);

    // Deduct for no recent sales (inactive store)
    if (yesterdayTransactions === 0) healthScore -= 15;

    // Bonus for good margins
    if (marginPercent >= 20) healthScore = Math.min(100, healthScore + 5);

    // Clamp
    healthScore = Math.max(0, Math.min(100, healthScore));

    return {
        yesterday: {
            revenue: yesterdayRevenue,
            transactions: yesterdayTransactions,
            avgBasket: Math.round(yesterdayAvgBasket),
            topProduct,
            marginTotal,
            marginPercent: Math.round(marginPercent * 10) / 10,
            comparedToLastWeek: Math.round(comparedToLastWeek * 10) / 10,
        },
        today: {
            predictedRevenue,
            confidence,
            factors,
            isPayDay: todayIsPayDay,
            isFriday: todayIsFriday,
            activeEvents: eventNames,
            trend,
        },
        actions: actions.sort((a, b) => {
            const order = { critical: 0, high: 1, medium: 2, low: 3 };
            return order[a.priority] - order[b.priority];
        }),
        healthScore,
        generatedAt: now,
    };
}

// ═══════════════════════════════════════════════════
// ENHANCED INSIGHTS (replaces mock-based InsightsGenerator)
// ═══════════════════════════════════════════════════

function generateSmartInsights(sales: Sale[], products: Product[]): AIInsight[] {
    const insights: AIInsight[] = [];
    const now = new Date();
    const abcData = performABCAnalysis(sales, products, 30);
    const categories = getCategoryInsights(sales, products, 30);

    // ABC insight: how many A-tier products drive revenue?
    const aTier = abcData.filter(p => p.tier === 'A');
    if (aTier.length > 0 && abcData.length > 0) {
        const aPercent = Math.round((aTier.length / abcData.length) * 100);
        insights.push({
            id: 'abc-summary',
            type: 'recommendation',
            title: `${aTier.length} produits génèrent 80% du CA`,
            description: `Seulement ${aPercent}% de vos produits (Tier A) représentent 80% de votre chiffre d'affaires. Assurez-vous qu'ils ne manquent jamais.`,
            importance: 'high',
            icon: '📊',
            actionLabel: 'Voir analyse',
            actionRoute: '/reports',
            timestamp: now,
        });
    }

    // Margin alert: any category below 15%?
    const lowMarginCats = categories.filter(c => c.marginPercent < 15 && c.revenue > 0);
    if (lowMarginCats.length > 0) {
        insights.push({
            id: 'low-margin-alert',
            type: 'alert',
            title: `Marges faibles sur ${lowMarginCats.length} catégorie${lowMarginCats.length > 1 ? 's' : ''}`,
            description: lowMarginCats.map(c => `${c.category} (${c.marginPercent.toFixed(1)}%)`).join(', '),
            importance: 'medium',
            icon: '💰',
            actionLabel: 'Analyser',
            actionRoute: '/reports',
            timestamp: now,
        });
    }

    // Dead stock: products with zero sales in 30 days
    const soldProductIds = new Set(abcData.map(p => p.id));
    const deadStock = products.filter(p => p.isActive !== false && p.stock > 0 && !soldProductIds.has(p.id));
    if (deadStock.length > 0) {
        insights.push({
            id: 'dead-stock',
            type: 'alert',
            title: `${deadStock.length} produit${deadStock.length > 1 ? 's' : ''} sans vente depuis 30 jours`,
            description: `Stock dormant: ${deadStock.slice(0, 3).map(p => p.name).join(', ')}${deadStock.length > 3 ? '...' : ''}`,
            importance: deadStock.length > 10 ? 'high' : 'medium',
            icon: '💤',
            actionLabel: 'Voir produits',
            actionRoute: '/inventory?tab=products',
            timestamp: now,
        });
    }

    // Top performer
    if (aTier.length > 0) {
        const top = aTier[0];
        insights.push({
            id: 'top-performer',
            type: 'opportunity',
            title: `Star: ${top.emoji} ${top.name}`,
            description: `${top.unitsSold} unités vendues, ${Math.round(top.marginPercent)}% de marge. Envisagez d'en augmenter le stock.`,
            importance: 'low',
            icon: '⭐',
            timestamp: now,
        });
    }

    return insights.sort((a, b) => {
        const order = { critical: 0, high: 1, medium: 2, low: 3 };
        return order[a.importance] - order[b.importance];
    });
}

// ═══════════════════════════════════════════════════
// PUBLIC API (singleton-style)
// ═══════════════════════════════════════════════════

export const BoniloIntelligence = {
    /** ABC Analysis: classify products by revenue contribution */
    abcAnalysis: performABCAnalysis,

    /** Category-level margin and velocity insights */
    categoryInsights: getCategoryInsights,

    /** Product velocity and smart reorder suggestions */
    velocities: calculateVelocities,

    /** Full daily briefing (yesterday + today + actions) */
    dailyBriefing: generateDailyBriefing,

    /** Smart insights powered by real data (replaces mock InsightsGenerator) */
    smartInsights: generateSmartInsights,
};

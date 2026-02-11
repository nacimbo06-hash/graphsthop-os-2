import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Sun,
    TrendingUp,
    TrendingDown,
    ArrowRight,
    AlertTriangle,
    Star,
    Calendar,
    Target,
    Sparkles,
    DollarSign,
    ShoppingBag,
    Percent,
} from 'lucide-react';
import { useProductsStore, useSalesStore } from '@bonilo/shared/stores';
import { BoniloIntelligence } from '../../../services/ai/intelligenceService';
import type { DailyBriefing as DailyBriefingType, ABCProduct } from '../../../services/ai/intelligenceService';
import { useSettings } from '../../../contexts/SettingsContext';
import styles from './DailyBriefing.module.css';

export const DailyBriefingWidget: React.FC = () => {
    const navigate = useNavigate();
    const { formatCurrency } = useSettings();
    const { products } = useProductsStore();
    const { sales } = useSalesStore();

    const briefing: DailyBriefingType = useMemo(() =>
        BoniloIntelligence.dailyBriefing(sales, products),
        [sales, products]
    );

    const abcData: ABCProduct[] = useMemo(() =>
        BoniloIntelligence.abcAnalysis(sales, products, 30),
        [sales, products]
    );

    const aTierCount = abcData.filter(p => p.tier === 'A').length;
    const bTierCount = abcData.filter(p => p.tier === 'B').length;
    const cTierCount = abcData.filter(p => p.tier === 'C').length;

    // Health score color
    const getHealthColor = (score: number) => {
        if (score >= 80) return '#3D7C4F';
        if (score >= 60) return '#E8A05D';
        if (score >= 40) return '#D97706';
        return '#EF4444';
    };

    const getHealthLabel = (score: number) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Bon';
        if (score >= 40) return 'À surveiller';
        return 'Critique';
    };

    const hasSalesData = sales.length > 0;

    return (
        <div className={styles.briefingCard}>
            {/* Header */}
            <div className={styles.briefingHeader}>
                <div className={styles.briefingTitle}>
                    <Sun size={20} className={styles.sunIcon} />
                    <div>
                        <h3>Briefing du jour</h3>
                        <span className={styles.briefingDate}>
                            {new Date().toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                            })}
                        </span>
                    </div>
                </div>
                <div className={styles.healthBadge} style={{ borderColor: getHealthColor(briefing.healthScore) }}>
                    <div
                        className={styles.healthDot}
                        style={{ background: getHealthColor(briefing.healthScore) }}
                    />
                    <span style={{ color: getHealthColor(briefing.healthScore) }}>
                        {briefing.healthScore}/100 — {getHealthLabel(briefing.healthScore)}
                    </span>
                </div>
            </div>

            {/* Two-column: Yesterday + Today */}
            <div className={styles.briefingGrid}>
                {/* ── Yesterday ── */}
                <div className={styles.briefingSection}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionLabel}>📊 Hier</span>
                        {briefing.yesterday.comparedToLastWeek !== 0 && (
                            <span className={`${styles.changeBadge} ${briefing.yesterday.comparedToLastWeek >= 0 ? styles.positive : styles.negative}`}>
                                {briefing.yesterday.comparedToLastWeek >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                {briefing.yesterday.comparedToLastWeek >= 0 ? '+' : ''}{briefing.yesterday.comparedToLastWeek}% vs sem. dern.
                            </span>
                        )}
                    </div>

                    <div className={styles.miniMetrics}>
                        <div className={styles.miniMetric}>
                            <DollarSign size={14} className={styles.miniIcon} />
                            <span className={styles.miniValue}>{formatCurrency(briefing.yesterday.revenue)}</span>
                            <span className={styles.miniLabel}>CA</span>
                        </div>
                        <div className={styles.miniMetric}>
                            <ShoppingBag size={14} className={styles.miniIcon} />
                            <span className={styles.miniValue}>{briefing.yesterday.transactions}</span>
                            <span className={styles.miniLabel}>tickets</span>
                        </div>
                        <div className={styles.miniMetric}>
                            <Percent size={14} className={styles.miniIcon} />
                            <span className={styles.miniValue}>{briefing.yesterday.marginPercent}%</span>
                            <span className={styles.miniLabel}>marge</span>
                        </div>
                    </div>

                    {briefing.yesterday.topProduct && (
                        <div className={styles.topProduct}>
                            <Star size={14} />
                            <span>
                                {briefing.yesterday.topProduct.emoji} {briefing.yesterday.topProduct.name}
                                <span className={styles.topProductDetail}>
                                    {' '}— {briefing.yesterday.topProduct.units} unités, {formatCurrency(briefing.yesterday.topProduct.revenue)}
                                </span>
                            </span>
                        </div>
                    )}

                    {!hasSalesData && (
                        <div className={styles.emptyState}>
                            <Sparkles size={16} />
                            <span>Aucune vente enregistrée. Commencez à vendre pour activer l'intelligence.</span>
                        </div>
                    )}
                </div>

                {/* ── Today Forecast ── */}
                <div className={styles.briefingSection}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionLabel}>🔮 Prévisions</span>
                        <span className={styles.confidenceBadge}>
                            {Math.round(briefing.today.confidence * 100)}% confiance
                        </span>
                    </div>

                    <div className={styles.forecastRevenue}>
                        <span className={styles.forecastValue}>{formatCurrency(briefing.today.predictedRevenue)}</span>
                        <span className={styles.forecastLabel}>CA prévu aujourd'hui</span>
                    </div>

                    {briefing.today.factors.length > 0 && (
                        <div className={styles.factorsList}>
                            {briefing.today.factors.map((factor, i) => (
                                <span key={i} className={styles.factorTag}>
                                    {factor}
                                </span>
                            ))}
                        </div>
                    )}

                    {briefing.today.activeEvents.length > 0 && (
                        <div className={styles.eventTag}>
                            <Calendar size={12} />
                            {briefing.today.activeEvents.join(', ')}
                        </div>
                    )}
                </div>
            </div>

            {/* ABC Analysis Overview */}
            {abcData.length > 0 && (
                <div className={styles.abcSection}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionLabel}>📊 Analyse ABC (30j)</span>
                        <button className={styles.viewMore} onClick={() => navigate('/reports')}>
                            Détails <ArrowRight size={12} />
                        </button>
                    </div>
                    <div className={styles.abcBar}>
                        <div
                            className={`${styles.abcSegment} ${styles.abcA}`}
                            style={{ width: `${abcData.length > 0 ? (aTierCount / abcData.length) * 100 : 0}%` }}
                            title={`Tier A: ${aTierCount} produits`}
                        >
                            <span>A</span>
                        </div>
                        <div
                            className={`${styles.abcSegment} ${styles.abcB}`}
                            style={{ width: `${abcData.length > 0 ? (bTierCount / abcData.length) * 100 : 0}%` }}
                            title={`Tier B: ${bTierCount} produits`}
                        >
                            <span>B</span>
                        </div>
                        <div
                            className={`${styles.abcSegment} ${styles.abcC}`}
                            style={{ width: `${abcData.length > 0 ? (cTierCount / abcData.length) * 100 : 0}%` }}
                            title={`Tier C: ${cTierCount} produits`}
                        >
                            <span>C</span>
                        </div>
                    </div>
                    <div className={styles.abcLegend}>
                        <span><strong className={styles.tierA}>A</strong> {aTierCount} produits = 80% CA</span>
                        <span><strong className={styles.tierB}>B</strong> {bTierCount} = 15%</span>
                        <span><strong className={styles.tierC}>C</strong> {cTierCount} = 5%</span>
                    </div>
                </div>
            )}

            {/* Actions */}
            {briefing.actions.length > 0 && (
                <div className={styles.actionsSection}>
                    <span className={styles.sectionLabel}>⚡ Actions prioritaires</span>
                    <div className={styles.actionsList}>
                        {briefing.actions.slice(0, 3).map(action => (
                            <button
                                key={action.id}
                                className={`${styles.actionItem} ${styles[action.priority]}`}
                                onClick={() => action.route && navigate(action.route)}
                            >
                                <span className={styles.actionEmoji}>{action.icon}</span>
                                <div className={styles.actionContent}>
                                    <strong>{action.title}</strong>
                                    <span>{action.description}</span>
                                </div>
                                {action.route && <ArrowRight size={14} className={styles.actionArrow} />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DailyBriefingWidget;

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AlertTriangle,
    Clock,
    Package,
    ChevronRight,
    Tag,
    Trash2,
    Gift,
    RotateCcw,
    Check,
} from 'lucide-react';
import {
    type ExpiryAlert,
    type ExpiryStatus,
    getExpiryStatusConfig,
    formatDaysRemaining,
} from '@asgard/shared';
import styles from './ExpiryAlertWidget.module.css';

interface ExpiryAlertWidgetProps {
    alerts: ExpiryAlert[];
    onAction?: (alertId: string, action: 'discount' | 'return' | 'donate' | 'dispose') => void;
    onAcknowledge?: (alertId: string) => void;
    maxVisible?: number;
}

export const ExpiryAlertWidget: React.FC<ExpiryAlertWidgetProps> = ({
    alerts,
    onAction,
    onAcknowledge,
    maxVisible = 5,
}) => {
    const navigate = useNavigate();
    const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

    // Group alerts by status
    const groupedAlerts = useMemo(() => {
        const groups: Record<ExpiryStatus, ExpiryAlert[]> = {
            expired: [],
            critical: [],
            warning: [],
            attention: [],
            ok: [],
        };

        alerts.forEach(alert => {
            groups[alert.status].push(alert);
        });

        return groups;
    }, [alerts]);

    // Summary counts
    const summary = useMemo(() => ({
        expired: groupedAlerts.expired.length,
        critical: groupedAlerts.critical.length,
        warning: groupedAlerts.warning.length,
        attention: groupedAlerts.attention.length,
        total: alerts.length,
    }), [groupedAlerts, alerts]);

    const visibleAlerts = alerts.slice(0, maxVisible);

    const handleActionClick = (alertId: string, action: 'discount' | 'return' | 'donate' | 'dispose') => {
        if (onAction) {
            onAction(alertId, action);
        }
        setExpandedAlert(null);
    };

    const getActionButtons = (alert: ExpiryAlert) => {
        const actions: React.ReactNode[] = [];

        if (alert.status === 'critical' || alert.status === 'warning') {
            actions.push(
                <button
                    key="discount"
                    className={`${styles.actionBtn} ${styles.discount}`}
                    onClick={() => handleActionClick(alert.id, 'discount')}
                >
                    <Tag size={14} />
                    -{alert.suggestedDiscount}%
                </button>
            );
        }

        if (alert.status === 'expired' || alert.status === 'critical') {
            actions.push(
                <button
                    key="return"
                    className={`${styles.actionBtn} ${styles.return}`}
                    onClick={() => handleActionClick(alert.id, 'return')}
                >
                    <RotateCcw size={14} />
                    Retour
                </button>
            );
            actions.push(
                <button
                    key="donate"
                    className={`${styles.actionBtn} ${styles.donate}`}
                    onClick={() => handleActionClick(alert.id, 'donate')}
                >
                    <Gift size={14} />
                    Don
                </button>
            );
        }

        if (alert.status === 'expired') {
            actions.push(
                <button
                    key="dispose"
                    className={`${styles.actionBtn} ${styles.dispose}`}
                    onClick={() => handleActionClick(alert.id, 'dispose')}
                >
                    <Trash2 size={14} />
                    Jeter
                </button>
            );
        }

        return actions;
    };

    if (alerts.length === 0) {
        return (
            <div className={styles.widget}>
                <div className={styles.header}>
                    <Clock size={18} />
                    <h3>Alertes Expiration</h3>
                </div>
                <div className={styles.empty}>
                    <Check size={32} />
                    <p>Aucune alerte d'expiration</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.widget}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerTitle}>
                    <Clock size={18} />
                    <h3>Alertes Expiration</h3>
                </div>
                <button
                    className={styles.viewAllBtn}
                    onClick={() => navigate('/inventory?tab=expiry')}
                >
                    Voir tout <ChevronRight size={14} />
                </button>
            </div>

            {/* Summary Badges */}
            <div className={styles.summaryRow}>
                {summary.expired > 0 && (
                    <span className={`${styles.summaryBadge} ${styles.expired}`}>
                        {summary.expired} expiré{summary.expired > 1 ? 's' : ''}
                    </span>
                )}
                {summary.critical > 0 && (
                    <span className={`${styles.summaryBadge} ${styles.critical}`}>
                        {summary.critical} critique{summary.critical > 1 ? 's' : ''}
                    </span>
                )}
                {summary.warning > 0 && (
                    <span className={`${styles.summaryBadge} ${styles.warning}`}>
                        {summary.warning} alerte{summary.warning > 1 ? 's' : ''}
                    </span>
                )}
                {summary.attention > 0 && (
                    <span className={`${styles.summaryBadge} ${styles.attention}`}>
                        {summary.attention} attention
                    </span>
                )}
            </div>

            {/* Alert List */}
            <div className={styles.alertList}>
                {visibleAlerts.map(alert => {
                    const config = getExpiryStatusConfig(alert.status);
                    const isExpanded = expandedAlert === alert.id;

                    return (
                        <div
                            key={alert.id}
                            className={`${styles.alertItem} ${styles[alert.status]}`}
                            onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                        >
                            <div className={styles.alertMain}>
                                <div
                                    className={styles.alertIcon}
                                    style={{ color: config.color, background: config.bgColor }}
                                >
                                    <Package size={16} />
                                </div>
                                <div className={styles.alertInfo}>
                                    <span className={styles.alertProduct}>{alert.productName}</span>
                                    <span className={styles.alertMeta}>
                                        {alert.quantity} unités • {formatDaysRemaining(alert.daysRemaining)}
                                    </span>
                                </div>
                                <span
                                    className={styles.alertStatus}
                                    style={{ color: config.color, background: config.bgColor }}
                                >
                                    {config.label}
                                </span>
                            </div>

                            {/* Expanded Actions */}
                            {isExpanded && (
                                <div className={styles.alertActions}>
                                    {getActionButtons(alert)}
                                    {onAcknowledge && (
                                        <button
                                            className={`${styles.actionBtn} ${styles.acknowledge}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAcknowledge(alert.id);
                                            }}
                                        >
                                            <Check size={14} />
                                            OK
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Show more link */}
            {alerts.length > maxVisible && (
                <button
                    className={styles.showMoreBtn}
                    onClick={() => navigate('/inventory?tab=expiry')}
                >
                    +{alerts.length - maxVisible} autres alertes
                </button>
            )}
        </div>
    );
};

export default ExpiryAlertWidget;

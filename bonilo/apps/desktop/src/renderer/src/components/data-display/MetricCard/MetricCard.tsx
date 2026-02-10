import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import styles from './MetricCard.module.css';

export type MetricCardVariant = 'primary' | 'success' | 'warning' | 'danger';
export type TrendDirection = 'up' | 'down' | 'neutral';

interface MetricCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    change?: number;
    trend?: TrendDirection;
    variant?: MetricCardVariant;
    subtitle?: string;
    className?: string;
    onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
    icon,
    label,
    value,
    change,
    trend = 'neutral',
    variant = 'primary',
    subtitle,
    className = '',
    onClick,
}) => {
    const cardClasses = [
        styles.metricCard,
        styles[variant],
        onClick ? styles.clickable : '',
        className,
    ].filter(Boolean).join(' ');

    const formatChange = (val: number): string => {
        const sign = val > 0 ? '+' : '';
        return `${sign}${val.toFixed(1)}%`;
    };

    const getTrendIcon = () => {
        switch (trend) {
            case 'up':
                return <TrendingUp size={14} />;
            case 'down':
                return <TrendingDown size={14} />;
            default:
                return <Minus size={14} />;
        }
    };

    return (
        <div className={cardClasses} onClick={onClick} role={onClick ? 'button' : undefined}>
            <div className={styles.iconContainer}>
                {icon}
            </div>

            <div className={styles.content}>
                <span className={styles.label}>{label}</span>
                <span className={styles.value}>{value}</span>

                {(change !== undefined || subtitle) && (
                    <div className={styles.footer}>
                        {change !== undefined && (
                            <span className={`${styles.trend} ${styles[`trend-${trend}`]}`}>
                                {getTrendIcon()}
                                <span>{formatChange(change)}</span>
                            </span>
                        )}
                        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MetricCard;

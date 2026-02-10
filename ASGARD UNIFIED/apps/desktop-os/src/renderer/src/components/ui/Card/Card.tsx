import React from 'react';
import styles from './Card.module.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    shadow?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
    onClick?: () => void;
}

interface CardHeaderProps {
    children: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}

interface CardBodyProps {
    children: React.ReactNode;
    className?: string;
}

interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    padding = 'md',
    shadow = 'sm',
    hover = false,
    onClick,
}) => {
    const cardClasses = [
        styles.card,
        styles[`padding-${padding}`],
        styles[`shadow-${shadow}`],
        hover ? styles.hover : '',
        onClick ? styles.clickable : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={cardClasses} onClick={onClick} role={onClick ? 'button' : undefined}>
            {children}
        </div>
    );
};

export const CardHeader: React.FC<CardHeaderProps> = ({
    children,
    action,
    className = '',
}) => {
    return (
        <div className={`${styles.header} ${className}`}>
            <div className={styles.headerContent}>{children}</div>
            {action && <div className={styles.headerAction}>{action}</div>}
        </div>
    );
};

export const CardBody: React.FC<CardBodyProps> = ({
    children,
    className = '',
}) => {
    return <div className={`${styles.body} ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<CardFooterProps> = ({
    children,
    className = '',
}) => {
    return <div className={`${styles.footer} ${className}`}>{children}</div>;
};

export default Card;

import React from 'react';
import { AlertTriangle, Tag, X, Clock, Check } from 'lucide-react';
import {
    type ExpiryStatus,
    getExpiryStatusConfig,
    formatDaysRemaining,
    getSuggestedDiscount
} from '@asgard/shared';
import styles from './ExpiryWarningModal.module.css';

interface ExpiryWarningModalProps {
    isOpen: boolean;
    productName: string;
    daysRemaining: number;
    status: ExpiryStatus;
    quantity: number;
    suggestedDiscount: number;
    onProceed: () => void;
    onApplyDiscount: (discountPercent: number) => void;
    onCancel: () => void;
}

export const ExpiryWarningModal: React.FC<ExpiryWarningModalProps> = ({
    isOpen,
    productName,
    daysRemaining,
    status,
    quantity,
    suggestedDiscount,
    onProceed,
    onApplyDiscount,
    onCancel,
}) => {
    if (!isOpen) return null;

    const config = getExpiryStatusConfig(status);

    const handleApplyDiscount = () => {
        onApplyDiscount(suggestedDiscount);
    };

    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div
                    className={styles.header}
                    style={{ background: config.bgColor, borderColor: config.color }}
                >
                    <div className={styles.icon} style={{ color: config.color }}>
                        <AlertTriangle size={32} />
                    </div>
                    <h2>Produit proche de l'expiration</h2>
                    <button className={styles.closeBtn} onClick={onCancel}>
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    <div className={styles.productInfo}>
                        <strong>{productName}</strong>
                        <span className={styles.quantity}>Quantité: {quantity}</span>
                    </div>

                    <div
                        className={styles.expiryInfo}
                        style={{ background: config.bgColor, borderColor: config.color }}
                    >
                        <Clock size={20} style={{ color: config.color }} />
                        <div>
                            <span className={styles.statusLabel} style={{ color: config.color }}>
                                {config.label}
                            </span>
                            <span className={styles.daysText}>
                                {formatDaysRemaining(daysRemaining)}
                            </span>
                        </div>
                    </div>

                    {suggestedDiscount > 0 && (
                        <div className={styles.discountSuggestion}>
                            <Tag size={18} />
                            <span>
                                Réduction suggérée: <strong>-{suggestedDiscount}%</strong>
                            </span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <button
                        className={styles.cancelBtn}
                        onClick={onCancel}
                    >
                        Annuler
                    </button>

                    {suggestedDiscount > 0 && (
                        <button
                            className={styles.discountBtn}
                            onClick={handleApplyDiscount}
                        >
                            <Tag size={16} />
                            Appliquer -{suggestedDiscount}%
                        </button>
                    )}

                    <button
                        className={styles.proceedBtn}
                        onClick={onProceed}
                    >
                        <Check size={16} />
                        Continuer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpiryWarningModal;

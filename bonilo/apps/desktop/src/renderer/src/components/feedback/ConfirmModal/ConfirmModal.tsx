import React from 'react';
import { AlertTriangle, Trash2, X, Check } from 'lucide-react';
import styles from './ConfirmModal.module.css';

export interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    variant = 'danger',
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (variant) {
            case 'danger':
                return <Trash2 size={28} />;
            case 'warning':
                return <AlertTriangle size={28} />;
            default:
                return <AlertTriangle size={28} />;
        }
    };

    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={`${styles.iconContainer} ${styles[variant]}`}>
                    {getIcon()}
                </div>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.message}>{message}</p>
                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onCancel}>
                        <X size={18} />
                        {cancelText}
                    </button>
                    <button
                        className={`${styles.confirmBtn} ${styles[variant]}`}
                        onClick={onConfirm}
                    >
                        <Check size={18} />
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;

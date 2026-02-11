import React, { useState, useMemo } from 'react';
import { Calendar, Clock, X, Check, Infinity } from 'lucide-react';
import {
    EXPIRY_PRESETS,
    getExpiryPresetsForCategory,
    calculateExpiryDate,
    calculateDaysRemaining,
    formatDaysRemaining,
    getExpiryStatus,
    getExpiryStatusConfig,
    type ShelfLifeCategory,
    type QuickDatePreset,
} from '@bonilo/shared';
import styles from './ExpiryQuickInput.module.css';

interface ExpiryQuickInputProps {
    productCategory?: string;
    value: Date | null;
    onChange: (date: Date | null) => void;
    lotNumber?: string;
    onLotNumberChange?: (lotNumber: string) => void;
    showLotNumber?: boolean;
    compact?: boolean;
}

export const ExpiryQuickInput: React.FC<ExpiryQuickInputProps> = ({
    productCategory = 'grocery',
    value,
    onChange,
    lotNumber = '',
    onLotNumberChange,
    showLotNumber = false,
    compact = false,
}) => {
    const [manualDate, setManualDate] = useState<string>('');
    const [showAllPresets, setShowAllPresets] = useState(false);

    // Get appropriate presets based on product category
    const presets = useMemo(() => {
        return getExpiryPresetsForCategory(productCategory);
    }, [productCategory]);

    // Calculate display info
    const daysRemaining = calculateDaysRemaining(value);
    const status = getExpiryStatus(daysRemaining);
    const statusConfig = getExpiryStatusConfig(status);

    const handlePresetClick = (preset: QuickDatePreset) => {
        const newDate = calculateExpiryDate(preset.days);
        onChange(newDate);
    };

    const handleManualDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateStr = e.target.value;
        setManualDate(dateStr);
        if (dateStr) {
            onChange(new Date(dateStr));
        }
    };

    const handleNoExpiry = () => {
        onChange(null);
    };

    const handleClear = () => {
        onChange(null);
        setManualDate('');
    };

    // All presets for expanded view
    const allPresets = useMemo(() => {
        return [
            ...EXPIRY_PRESETS.dairy,
            ...EXPIRY_PRESETS.short,
            ...EXPIRY_PRESETS.medium,
            ...EXPIRY_PRESETS.long.filter(p => p.days !== 9999),
        ];
    }, []);

    if (compact) {
        return (
            <div className={styles.compactContainer}>
                <div className={styles.presetRow}>
                    {presets.slice(0, 4).map((preset, idx) => (
                        <button
                            key={idx}
                            type="button"
                            className={`${styles.presetBtn} ${styles.compact}`}
                            onClick={() => handlePresetClick(preset)}
                        >
                            {preset.label}
                        </button>
                    ))}
                    <button
                        type="button"
                        className={`${styles.presetBtn} ${styles.compact} ${styles.noExpiry}`}
                        onClick={handleNoExpiry}
                        title="Sans expiration"
                    >
                        <Infinity size={14} />
                    </button>
                </div>
                {value && (
                    <div
                        className={styles.compactStatus}
                        style={{ color: statusConfig.color, background: statusConfig.bgColor }}
                    >
                        {formatDaysRemaining(daysRemaining)}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Quick Presets */}
            <div className={styles.presetsSection}>
                <label className={styles.label}>
                    <Clock size={14} />
                    Expiration rapide
                </label>
                <div className={styles.presetsGrid}>
                    {presets.map((preset, idx) => (
                        <button
                            key={idx}
                            type="button"
                            className={`${styles.presetBtn} ${value && calculateDaysRemaining(value) === preset.days ? styles.active : ''
                                }`}
                            onClick={() => handlePresetClick(preset)}
                        >
                            {preset.label}
                        </button>
                    ))}
                    <button
                        type="button"
                        className={`${styles.presetBtn} ${styles.noExpiry} ${value === null ? styles.active : ''}`}
                        onClick={handleNoExpiry}
                    >
                        <Infinity size={14} />
                        Sans exp.
                    </button>
                </div>

                {/* Expand to show all presets */}
                {!showAllPresets && (
                    <button
                        type="button"
                        className={styles.showMoreBtn}
                        onClick={() => setShowAllPresets(true)}
                    >
                        Plus d'options...
                    </button>
                )}

                {showAllPresets && (
                    <div className={styles.allPresetsGrid}>
                        {allPresets.map((preset, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className={styles.presetBtnSmall}
                                onClick={() => handlePresetClick(preset)}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Manual Date Input */}
            <div className={styles.manualSection}>
                <label className={styles.label}>
                    <Calendar size={14} />
                    Date exacte
                </label>
                <div className={styles.dateInputRow}>
                    <input
                        type="date"
                        className={styles.dateInput}
                        value={manualDate || (value ? value.toISOString().split('T')[0] : '')}
                        onChange={handleManualDateChange}
                        min={new Date().toISOString().split('T')[0]}
                    />
                    {value && (
                        <button
                            type="button"
                            className={styles.clearBtn}
                            onClick={handleClear}
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Lot Number (optional) */}
            {showLotNumber && onLotNumberChange && (
                <div className={styles.lotSection}>
                    <label className={styles.label}>
                        Numéro de lot (optionnel)
                    </label>
                    <input
                        type="text"
                        className={styles.lotInput}
                        placeholder="Ex: LOT2024-001"
                        value={lotNumber}
                        onChange={(e) => onLotNumberChange(e.target.value)}
                    />
                </div>
            )}

            {/* Status Display */}
            {value !== undefined && (
                <div
                    className={styles.statusDisplay}
                    style={{
                        color: statusConfig.color,
                        background: statusConfig.bgColor,
                        borderColor: statusConfig.color
                    }}
                >
                    <Check size={16} />
                    <div className={styles.statusInfo}>
                        <span className={styles.statusLabel}>{statusConfig.label}</span>
                        <span className={styles.statusDays}>{formatDaysRemaining(daysRemaining)}</span>
                    </div>
                    {value && (
                        <span className={styles.statusDate}>
                            {value.toLocaleDateString('fr-FR')}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExpiryQuickInput;

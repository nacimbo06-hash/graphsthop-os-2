import React, { useEffect, useState } from 'react';
import {
    Cloud,
    CloudOff,
    RefreshCw,
    Check,
    AlertCircle,
    Upload,
    Wifi,
    WifiOff,
} from 'lucide-react';
import { useSyncStore } from '@core/stores';
import styles from './SyncIndicator.module.css';

export const SyncIndicator: React.FC = () => {
    const {
        isOnline,
        syncStatus,
        pendingOperations,
        lastSyncTime,
        syncNow,
    } = useSyncStore();

    const [showDetails, setShowDetails] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Animate when syncing
    useEffect(() => {
        let timer: any;
        if (syncStatus === 'syncing') {
            setIsAnimating(true);
        } else {
            timer = setTimeout(() => setIsAnimating(false), 500);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [syncStatus]);

    const pendingCount = pendingOperations.length;
    const hasPending = pendingCount > 0;

    const formatLastSync = () => {
        if (!lastSyncTime) return 'Jamais synchronisé';
        const date = new Date(lastSyncTime);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'À l\'instant';
        if (diffMins < 60) return `Il y a ${diffMins} min`;
        if (diffMins < 1440) return `Il y a ${Math.floor(diffMins / 60)}h`;
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    const getStatusIcon = () => {
        if (!isOnline) return <WifiOff size={16} />;
        if (syncStatus === 'syncing') return <RefreshCw size={16} className={styles.spinning} />;
        if (syncStatus === 'success') return <Check size={16} />;
        if (syncStatus === 'error') return <AlertCircle size={16} />;
        if (hasPending) return <Upload size={16} />;
        return <Cloud size={16} />;
    };

    const getStatusClass = () => {
        if (!isOnline) return styles.offline;
        if (syncStatus === 'syncing') return styles.syncing;
        if (syncStatus === 'success') return styles.success;
        if (syncStatus === 'error') return styles.error;
        if (hasPending) return styles.pending;
        return styles.online;
    };

    const getStatusText = () => {
        if (!isOnline) return 'Hors ligne';
        if (syncStatus === 'syncing') return 'Synchronisation...';
        if (syncStatus === 'success') return 'Synchronisé';
        if (syncStatus === 'error') return 'Erreur sync';
        if (hasPending) return `${pendingCount} en attente`;
        return 'En ligne';
    };

    const handleManualSync = () => {
        if (isOnline && hasPending) {
            syncNow();
        }
    };

    return (
        <div className={styles.syncIndicator}>
            <button
                className={`${styles.statusBtn} ${getStatusClass()}`}
                onClick={() => setShowDetails(!showDetails)}
                title={getStatusText()}
            >
                {getStatusIcon()}
                {hasPending && (
                    <span className={styles.badge}>{pendingCount}</span>
                )}
            </button>

            {showDetails && (
                <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                        <div className={styles.connectionStatus}>
                            {isOnline ? (
                                <>
                                    <Wifi size={18} className={styles.onlineIcon} />
                                    <span>Connecté</span>
                                </>
                            ) : (
                                <>
                                    <WifiOff size={18} className={styles.offlineIcon} />
                                    <span>Hors ligne</span>
                                </>
                            )}
                        </div>
                        <span className={styles.lastSync}>{formatLastSync()}</span>
                    </div>

                    {hasPending && (
                        <div className={styles.pendingSection}>
                            <div className={styles.pendingHeader}>
                                <Upload size={16} />
                                <span>{pendingCount} opération(s) en attente</span>
                            </div>
                            <div className={styles.pendingList}>
                                {pendingOperations.slice(0, 5).map(op => (
                                    <div key={op.id} className={styles.pendingItem}>
                                        <span className={styles.opType}>{op.resource}</span>
                                        <span className={styles.opAction}>{op.type}</span>
                                        {op.retryCount > 0 && (
                                            <span className={styles.retryBadge}>
                                                Retry {op.retryCount}
                                            </span>
                                        )}
                                    </div>
                                ))}
                                {pendingCount > 5 && (
                                    <div className={styles.moreItems}>
                                        +{pendingCount - 5} autres
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className={styles.dropdownActions}>
                        <button
                            className={styles.syncBtn}
                            onClick={handleManualSync}
                            disabled={!isOnline || !hasPending || syncStatus === 'syncing'}
                        >
                            <RefreshCw size={16} className={syncStatus === 'syncing' ? styles.spinning : ''} />
                            {syncStatus === 'syncing' ? 'Synchronisation...' : 'Synchroniser maintenant'}
                        </button>
                    </div>

                    {!isOnline && (
                        <div className={styles.offlineNotice}>
                            <CloudOff size={14} />
                            <span>Les modifications seront synchronisées automatiquement quand la connexion sera rétablie.</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SyncIndicator;

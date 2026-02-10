import React, { useState, useMemo } from 'react';
import {
    TrendingUp,
    TrendingDown,
    Package,
    Filter,
    Calendar,
    ArrowUpRight,
    ArrowDownLeft,
} from 'lucide-react';
import { useStockMovementsStore, type StockMovement } from '@asgard/shared/stores';
import styles from './StockMovements.module.css';

export const StockMovements: React.FC = () => {
    const [filterType, setFilterType] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<string>('today');

    // Get movements from store
    const { movements, getTodayEntries, getTodayExits } = useStockMovementsStore();

    const formatDate = (date: Date | string) => new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    const formatTime = (date: Date | string) => new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const getTypeIcon = (type: StockMovement['type']) => {
        switch (type) {
            case 'entry': return <ArrowUpRight size={16} className={styles.entryIcon} />;
            case 'exit': return <ArrowDownLeft size={16} className={styles.exitIcon} />;
            case 'sale': return <ArrowDownLeft size={16} className={styles.saleIcon} />;
            case 'adjustment': return <TrendingDown size={16} className={styles.adjustIcon} />;
        }
    };

    const getTypeBadge = (type: StockMovement['type']) => {
        const labels = {
            entry: 'Entrée',
            exit: 'Sortie',
            sale: 'Vente',
            adjustment: 'Ajustement'
        };
        return <span className={`${styles.typeBadge} ${styles[type]}`}>{labels[type]}</span>;
    };

    // Filter movements by type and date
    const filteredMovements = useMemo(() => {
        const now = new Date();
        const today = now.toDateString();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);

        return movements.filter(m => {
            // Type filter
            if (filterType !== 'all' && m.type !== filterType) return false;

            // Date filter
            const moveDate = new Date(m.date);
            switch (dateFilter) {
                case 'today':
                    return moveDate.toDateString() === today;
                case 'week':
                    return moveDate >= weekAgo;
                case 'month':
                    return moveDate >= monthAgo;
                default:
                    return true;
            }
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [movements, filterType, dateFilter]);

    // Stats from store
    const todayEntries = getTodayEntries();
    const todayExits = getTodayExits();

    return (
        <div className={styles.stockMovements}>
            {/* Stats */}
            <div className={styles.statsRow}>
                <div className={`${styles.statCard} ${styles.entry}`}>
                    <TrendingUp size={24} />
                    <div>
                        <span className={styles.statValue}>+{todayEntries}</span>
                        <span className={styles.statLabel}>Entrées aujourd'hui</span>
                    </div>
                </div>
                <div className={`${styles.statCard} ${styles.exit}`}>
                    <TrendingDown size={24} />
                    <div>
                        <span className={styles.statValue}>-{todayExits}</span>
                        <span className={styles.statLabel}>Sorties (ventes)</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.toolbar}>
                <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                    <option value="all">Tous les types</option>
                    <option value="entry">Entrées</option>
                    <option value="exit">Sorties</option>
                    <option value="sale">Ventes</option>
                    <option value="adjustment">Ajustements</option>
                </select>
                <select value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
                    <option value="today">Aujourd'hui</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                </select>
            </div>

            {/* Movements List */}
            <div className={styles.movementsList}>
                {filteredMovements.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>Aucun mouvement de stock pour cette période</p>
                    </div>
                ) : (
                    filteredMovements.map(movement => (
                        <div key={movement.id} className={styles.movementItem}>
                            <div className={styles.movementLeft}>
                                {getTypeIcon(movement.type)}
                                <div className={styles.movementProduct}>
                                    <span className={styles.emoji}>{movement.productEmoji}</span>
                                    <div>
                                        <span className={styles.productName}>{movement.productName}</span>
                                        <span className={styles.movementMeta}>
                                            {movement.reason} • {movement.performedBy}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.movementCenter}>
                                {getTypeBadge(movement.type)}
                            </div>
                            <div className={styles.movementQuantity}>
                                <span className={movement.type === 'entry' ? styles.positive : styles.negative}>
                                    {movement.type === 'entry' ? '+' : '-'}{Math.abs(movement.quantity)}
                                </span>
                                <span className={styles.stockChange}>
                                    {movement.previousStock} → {movement.newStock}
                                </span>
                            </div>
                            <div className={styles.movementTime}>
                                <span>{formatDate(movement.date)}</span>
                                <span className={styles.time}>{formatTime(movement.date)}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StockMovements;

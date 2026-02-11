import React, { useState, useMemo } from 'react';
import {
    ClipboardList,
    Plus,
    Play,
    Pause,
    CheckCircle,
    XCircle,
    Search,
    Save,
    FileText,
    AlertTriangle,
    RotateCcw,
    X,
    PieChart as PieChartIcon,
    Printer,
    Download,
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    Legend
} from 'recharts';
import { useProductsStore } from '@bonilo/shared/stores';
import { useToast } from '../../../components/feedback/Toast';
import { ConfirmModal } from '../../../components/feedback/ConfirmModal';
import styles from './PhysicalInventory.module.css';

interface InventorySession {
    id: string;
    date: Date;
    status: 'idle' | 'in_progress' | 'paused' | 'completed' | 'cancelled';
    itemsCounted: number;
    totalItems: number;
    discrepancies: number;
    createdBy: string;
}

interface InventoryLine {
    id: string;
    productId: string;
    product: {
        name: string;
        emoji: string;
        barcode: string;
    };
    systemStock: number;
    countedStock: number | null;
    difference: number | null;
    status: 'pending' | 'counted' | 'discrepancy';
}

export const PhysicalInventory: React.FC = () => {
    const { products, updateStock } = useProductsStore();
    const toast = useToast();

    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [countValue, setCountValue] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const countInputRef = React.useRef<HTMLInputElement>(null);

    // Session state
    const [session, setSession] = useState<InventorySession>({
        id: crypto.randomUUID(),
        date: new Date(),
        status: 'idle',
        itemsCounted: 0,
        totalItems: products.length,
        discrepancies: 0,
        createdBy: 'Utilisateur',
    });

    // Convert products to inventory lines
    const [lines, setLines] = useState<InventoryLine[]>(() =>
        products.map(p => ({
            id: p.id,
            productId: p.id,
            product: {
                name: p.name,
                emoji: p.emoji || '📦',
                barcode: p.barcode,
            },
            systemStock: p.stock,
            countedStock: null,
            difference: null,
            status: 'pending' as const
        }))
    );

    // Calculate progress
    const countedItems = lines.filter(l => l.status !== 'pending').length;
    const discrepancies = lines.filter(l => l.status === 'discrepancy').length;
    const progress = lines.length > 0 ? Math.round((countedItems / lines.length) * 100) : 0;

    // Start inventory
    const handleStart = () => {
        setSession(prev => ({
            ...prev,
            status: 'in_progress',
            date: new Date(),
        }));
    };

    // Pause inventory
    const handlePause = () => {
        setSession(prev => ({
            ...prev,
            status: 'paused',
        }));
    };

    // Resume inventory
    const handleResume = () => {
        setSession(prev => ({
            ...prev,
            status: 'in_progress',
        }));
    };

    // Cancel inventory
    const handleCancel = () => {
        setShowCancelConfirm(true);
    };

    const confirmCancel = () => {
        setLines(products.map(p => ({
            id: p.id,
            productId: p.id,
            product: { name: p.name, emoji: p.emoji || '📦', barcode: p.barcode },
            systemStock: p.stock,
            countedStock: null,
            difference: null,
            status: 'pending'
        })));
        setSession({
            id: crypto.randomUUID(),
            date: new Date(),
            status: 'idle',
            itemsCounted: 0,
            totalItems: products.length,
            discrepancies: 0,
            createdBy: 'Utilisateur',
        });
        setShowCancelConfirm(false);
    };

    const handleComplete = () => {
        setShowConfirmModal(true);
    };

    // Confirm and apply stock adjustments
    const handleConfirmAdjustments = () => {
        // Apply all counted stocks to the real inventory
        lines.forEach(line => {
            if (line.countedStock !== null && line.countedStock !== line.systemStock) {
                // Use 'set' to directly set the new stock value
                updateStock(line.productId, line.countedStock, 'set');
            }
        });

        // Mark session as completed
        setSession(prev => ({
            ...prev,
            status: 'completed',
            itemsCounted: countedItems,
            discrepancies,
        }));

        // Update lines to reflect new system stock and clear differences
        setLines(prev => prev.map(line => {
            const finalCount = line.countedStock !== null ? line.countedStock : line.systemStock;
            return {
                ...line,
                systemStock: finalCount,
                countedStock: null,
                difference: null,
                status: 'counted'
            };
        }));

        setShowConfirmModal(false);
        toast.success(`Inventaire terminé! ${countedItems} articles comptés, ${discrepancies} écarts corrigés`);
    };

    // Handle count
    const handleCount = (lineId: string, count: number) => {
        setLines(prev => prev.map(line => {
            if (line.id === lineId) {
                const diff = count - line.systemStock;
                return {
                    ...line,
                    countedStock: count,
                    difference: diff,
                    status: diff === 0 ? 'counted' : 'discrepancy'
                };
            }
            return line;
        }));
        setEditingId(null);
        setCountValue('');
    };

    // Filter lines
    const filteredLines = useMemo(() => lines.filter(l =>
        l.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.product.barcode.includes(searchQuery)
    ), [lines, searchQuery]);

    // Scanner Optimization: Auto-select if exact barcode match
    React.useEffect(() => {
        if (!searchQuery) return;

        // precise match on barcode?
        const exactMatch = filteredLines.find(l => l.product.barcode === searchQuery);
        if (exactMatch && filteredLines.length === 1) {
            setEditingId(exactMatch.id);
            setCountValue(exactMatch.countedStock?.toString() || '');
            // Small delay to allow render then focus
            setTimeout(() => {
                countInputRef.current?.focus();
            }, 10);
        }
    }, [searchQuery, filteredLines]);

    const handleCountSubmit = (lineId: string) => {
        if (countValue === '') return;
        const count = parseInt(countValue);
        if (isNaN(count)) return;

        handleCount(lineId, count);

        // After counting, clear search to be ready for next scan
        setSearchQuery('');
        setEditingId(null);
        searchInputRef.current?.focus();
    };

    const isActive = session.status === 'in_progress';
    const isPaused = session.status === 'paused';
    const isIdle = session.status === 'idle';
    const isCompleted = session.status === 'completed';

    // Chart data
    const statusData = [
        { name: 'OK', value: lines.filter(l => l.status === 'counted').length, color: 'var(--color-success)' },
        { name: 'Écarts', value: discrepancies, color: 'var(--color-danger)' },
        { name: 'En attente', value: lines.filter(l => l.status === 'pending').length, color: 'var(--color-text-muted)' },
    ].filter(d => d.value > 0);

    const handlePrintSheet = () => {
        window.print(); // In real app, we'd open a print template
        toast.info('Génération de la fiche d\'inventaire...');
    };

    return (
        <div className={styles.physicalInventory}>
            {/* Session Header */}
            <div className={styles.sessionHeader}>
                <div className={styles.sessionInfo}>
                    <h3><ClipboardList size={20} />
                        {isIdle && 'Nouvel inventaire'}
                        {isActive && 'Inventaire en cours'}
                        {isPaused && '⏸️ Inventaire en pause'}
                        {isCompleted && '✅ Inventaire terminé'}
                    </h3>
                    {!isIdle && (
                        <span className={styles.sessionMeta}>
                            Démarré le {session.date.toLocaleDateString('fr-FR')} par {session.createdBy}
                        </span>
                    )}
                </div>
                {!isIdle && !isCompleted && (
                    <div className={styles.progressSection}>
                        <div className={styles.progressInfo}>
                            <span>{countedItems} / {lines.length} articles</span>
                            <span className={styles.progressPercent}>{progress}%</span>
                        </div>
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                )}
                <div className={styles.sessionActions}>
                    {isIdle && (
                        <button className={styles.startBtn} onClick={handleStart}>
                            <Play size={16} /> Démarrer l'inventaire
                        </button>
                    )}
                    {isActive && (
                        <>
                            <button className={styles.pauseBtn} onClick={handlePause}>
                                <Pause size={16} /> Pause
                            </button>
                            <button className={styles.completeBtn} onClick={handleComplete}>
                                <CheckCircle size={16} /> Terminer
                            </button>
                        </>
                    )}
                    {isPaused && (
                        <>
                            <button className={styles.resumeBtn} onClick={handleResume}>
                                <Play size={16} /> Reprendre
                            </button>
                            <button className={styles.completeBtn} onClick={handleComplete}>
                                <CheckCircle size={16} /> Terminer
                            </button>
                            <button className={styles.cancelBtn} onClick={handleCancel}>
                                <XCircle size={16} /> Annuler
                            </button>
                        </>
                    )}
                    {isCompleted && (
                        <button className={styles.startBtn} onClick={() => {
                            setLines(products.map(p => ({
                                id: p.id,
                                productId: p.id,
                                product: { name: p.name, emoji: p.emoji || '📦', barcode: p.barcode },
                                systemStock: p.stock,
                                countedStock: null,
                                difference: null,
                                status: 'pending'
                            })));
                            setSession({
                                id: crypto.randomUUID(),
                                date: new Date(),
                                status: 'idle',
                                itemsCounted: 0,
                                totalItems: products.length,
                                discrepancies: 0,
                                createdBy: 'Utilisateur',
                            });
                        }}>
                            <RotateCcw size={16} /> Nouveau inventaire
                        </button>
                    )}
                </div>
            </div>

            {/* Stats & Chart Row */}
            <div className={styles.statsLayout}>
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <CheckCircle size={20} />
                        <div>
                            <span className={styles.statValue}>{lines.filter(l => l.status === 'counted').length}</span>
                            <span className={styles.statLabel}>Comptés OK</span>
                        </div>
                    </div>
                    <div className={`${styles.statCard} ${styles.warning}`}>
                        <AlertTriangle size={20} />
                        <div>
                            <span className={styles.statValue}>{discrepancies}</span>
                            <span className={styles.statLabel}>Écarts</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <RotateCcw size={20} />
                        <div>
                            <span className={styles.statValue}>{lines.filter(l => l.status === 'pending').length}</span>
                            <span className={styles.statLabel}>En attente</span>
                        </div>
                    </div>
                </div>

                <div className={styles.chartSection}>
                    {statusData.length > 0 ? (
                        <div className={styles.miniChart}>
                            <ResponsiveContainer width="100%" height={120}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        innerRadius={30}
                                        outerRadius={50}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className={styles.chartLegend}>
                                {statusData.map((d, i) => (
                                    <div key={i} className={styles.legendItem}>
                                        <span style={{ background: d.color }}></span>
                                        {d.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.chartPlaceholder}>
                            <PieChartIcon size={24} opacity={0.3} />
                            <span>Statut d'avancement</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Scanner un code-barres (ou taper un nom)..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        disabled={!isActive && !isPaused}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && filteredLines.length === 1) {
                                setEditingId(filteredLines[0].id);
                                setCountValue(filteredLines[0].countedStock?.toString() || '');
                                setTimeout(() => countInputRef.current?.focus(), 10);
                            }
                        }}
                    />
                    {searchQuery && (
                        <button
                            className={styles.clearSearchBtn}
                            onClick={() => {
                                setSearchQuery('');
                                searchInputRef.current?.focus();
                            }}
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
                <div className={styles.toolbarActions}>
                    <button className={styles.outlineBtn} onClick={handlePrintSheet}>
                        <Printer size={16} /> Fiche d'inventaire
                    </button>
                    <button className={styles.outlineBtn}>
                        <Download size={16} /> Exporter
                    </button>
                </div>
            </div>

            {/* Inventory Lines */}
            <div className={styles.linesTable}>
                <div className={styles.tableHeader}>
                    <span>Produit</span>
                    <span>Code-barres</span>
                    <span>Stock système</span>
                    <span>Stock compté</span>
                    <span>Écart</span>
                    <span>Action</span>
                </div>
                {filteredLines.map(line => (
                    <div
                        key={line.id}
                        className={`${styles.tableRow} ${line.status === 'discrepancy' ? styles.discrepancyRow : ''}`}
                    >
                        <div className={styles.productCell}>
                            <span className={styles.emoji}>{line.product.emoji}</span>
                            <span>{line.product.name}</span>
                        </div>
                        <code className={styles.barcode}>{line.product.barcode}</code>
                        <span className={styles.systemStock}>{line.systemStock}</span>
                        <div className={styles.countedCell}>
                            {editingId === line.id ? (
                                <input
                                    ref={countInputRef}
                                    type="number"
                                    className={styles.countInput}
                                    value={countValue}
                                    onChange={e => setCountValue(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            handleCountSubmit(line.id);
                                        }
                                        if (e.key === 'Escape') {
                                            setEditingId(null);
                                            setSearchQuery('');
                                            searchInputRef.current?.focus();
                                        }
                                    }}
                                    onBlur={() => {
                                        // Optional: Auto-submit on blur? Maybe annoying if just looking away.
                                        // Let's stick to Enter to confirm.
                                        if (!countValue && editingId === line.id) {
                                            setEditingId(null);
                                        }
                                    }}
                                    autoFocus
                                />
                            ) : (
                                <span className={line.countedStock !== null ? styles.counted : styles.pending}>
                                    {line.countedStock !== null ? line.countedStock : '-'}
                                </span>
                            )}
                        </div>
                        <span className={`${styles.difference} ${line.difference === null ? '' :
                            line.difference === 0 ? styles.ok :
                                line.difference > 0 ? styles.positive : styles.negative
                            }`}>
                            {line.difference !== null ? (line.difference > 0 ? `+${line.difference}` : line.difference) : '-'}
                        </span>
                        <div className={styles.actions}>
                            {(isActive || isPaused) && (
                                line.status === 'pending' ? (
                                    <button
                                        className={styles.countBtn}
                                        onClick={() => {
                                            setEditingId(line.id);
                                            setCountValue(line.systemStock.toString());
                                        }}
                                    >
                                        Compter
                                    </button>
                                ) : (
                                    <button
                                        className={styles.recountBtn}
                                        onClick={() => {
                                            setEditingId(line.id);
                                            setCountValue(line.countedStock?.toString() || '');
                                        }}
                                    >
                                        Recompter
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className={styles.overlay} onClick={() => setShowConfirmModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>✅ Confirmer l'inventaire</h2>
                            <button onClick={() => setShowConfirmModal(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <p>Résumé de l'inventaire :</p>
                            <div className={styles.summaryGrid}>
                                <div>
                                    <span>{countedItems}</span>
                                    <label>Articles comptés</label>
                                </div>
                                <div>
                                    <span>{discrepancies}</span>
                                    <label>Écarts détectés</label>
                                </div>
                                <div>
                                    <span>{lines.filter(l => l.status === 'pending').length}</span>
                                    <label>Non comptés</label>
                                </div>
                            </div>

                            {discrepancies > 0 && (
                                <div className={styles.discrepancyList}>
                                    <h4>Écarts à corriger :</h4>
                                    {lines.filter(l => l.status === 'discrepancy').slice(0, 5).map(l => (
                                        <div key={l.id} className={styles.discrepancyItem}>
                                            <span>{l.product.emoji} {l.product.name}</span>
                                            <span className={l.difference! > 0 ? styles.positive : styles.negative}>
                                                {l.systemStock} → {l.countedStock} ({l.difference! > 0 ? '+' : ''}{l.difference})
                                            </span>
                                        </div>
                                    ))}
                                    {discrepancies > 5 && <p>...et {discrepancies - 5} autres écarts</p>}
                                </div>
                            )}

                            {lines.filter(l => l.status === 'pending').length > 0 && (
                                <p className={styles.pendingWarning}>
                                    ⚠️ {lines.filter(l => l.status === 'pending').length} articles n'ont pas été comptés. Leur stock restera inchangé.
                                </p>
                            )}

                            <p className={styles.warning}>
                                ⚠️ Cette action mettra à jour le stock de tous les articles avec écarts.
                            </p>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowConfirmModal(false)}>Annuler</button>
                            <button className={styles.confirmBtn} onClick={handleConfirmAdjustments}>
                                <CheckCircle size={18} /> Terminer l'inventaire
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            <ConfirmModal
                isOpen={showCancelConfirm}
                title="Annuler l'inventaire"
                message="Êtes-vous sûr de vouloir annuler cet inventaire ? Toutes les données seront perdues."
                confirmText="Annuler l'inventaire"
                cancelText="Retour"
                variant="warning"
                onConfirm={confirmCancel}
                onCancel={() => setShowCancelConfirm(false)}
            />
        </div>
    );
};

export default PhysicalInventory;

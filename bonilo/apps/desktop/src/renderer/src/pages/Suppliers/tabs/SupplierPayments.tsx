import React, { useState, useMemo } from 'react';
import {
    CreditCard,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownLeft,
    Calendar,
    CheckCircle,
    AlertCircle,
    Truck,
    Clock,
    X,
    Eye,
} from 'lucide-react';
import { usePurchasesStore, type GoodsReceipt } from '@bonilo/shared/stores';
import { useSettings } from '../../../contexts/SettingsContext';
import { useToast } from '../../../components/feedback/Toast';
import styles from './SupplierPayments.module.css';

export const SupplierPayments: React.FC = () => {
    const { formatCurrency } = useSettings();
    const { goodsReceipts, suppliers, payGoodsReceipt } = usePurchasesStore();
    const toast = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'unpaid' | 'paid'>('all');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState<GoodsReceipt | null>(null);

    const unpaidReceipts = useMemo(() =>
        goodsReceipts.filter(r =>
            (filterStatus === 'all' || (filterStatus === 'unpaid' ? !r.isPaid : r.isPaid)) &&
            (r.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.grNumber.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        , [goodsReceipts, filterStatus, searchQuery]);

    const stats = useMemo(() => {
        const unpaid = goodsReceipts.filter(r => !r.isPaid);
        const totalDebt = unpaid.reduce((sum, r) => sum + r.total, 0);
        const criticalDebt = unpaid.filter(r => {
            const daysSinceReception = (Date.now() - new Date(r.date).getTime()) / (1000 * 60 * 60 * 24);
            return daysSinceReception > 30;
        }).length;

        return {
            totalDebt,
            unpaidCount: unpaid.length,
            criticalDebt,
        };
    }, [goodsReceipts]);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const handlePayReceipt = (receipt: GoodsReceipt) => {
        setSelectedReceipt(receipt);
        setShowPaymentModal(true);
    };

    const handleViewDetail = (receipt: GoodsReceipt) => {
        setSelectedReceipt(receipt);
        setShowDetailModal(true);
    };

    const confirmPayment = (paymentSource: 'cash' | 'safe' | 'provision') => {
        if (!selectedReceipt) return;

        payGoodsReceipt(selectedReceipt.id, paymentSource);
        toast.success(`Paiement de ${formatCurrency(selectedReceipt.total)} enregistré depuis ${paymentSource === 'cash' ? 'la caisse' : paymentSource === 'safe' ? 'le coffre' : 'la provision'}`);
        setShowPaymentModal(false);
        setSelectedReceipt(null);
    };

    return (
        <div className={styles.supplierPayments}>
            {/* Stats Overview */}
            <div className={styles.statsOverview}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}><CreditCard size={24} /></div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Dette totale fournisseurs</span>
                        <span className={styles.statValue}>{formatCurrency(stats.totalDebt)}</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}><Clock size={24} /></div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Bons non payés</span>
                        <span className={styles.statValue}>{stats.unpaidCount}</span>
                    </div>
                </div>
                <div className={`${styles.statCard} ${stats.criticalDebt > 0 ? styles.critical : ''}`}>
                    <div className={styles.statIcon}><AlertCircle size={24} /></div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Dettes critiques (+30j)</span>
                        <span className={styles.statValue}>{stats.criticalDebt}</span>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Chercher par fournisseur ou N° de bon..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className={styles.filters}>
                    <div className={styles.filterGroup}>
                        <Filter size={16} />
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as 'all' | 'unpaid' | 'paid')}>
                            <option value="all">Tous les bons</option>
                            <option value="unpaid">À payer (Dettes)</option>
                            <option value="paid">Payés</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Debt List */}
            <div className={styles.debtList}>
                <div className={styles.listHeader}>
                    <span>Fournisseur</span>
                    <span>N° Réception</span>
                    <span>Date Réception</span>
                    <span>Montant Total</span>
                    <span>Statut</span>
                    <span>Action</span>
                </div>
                {unpaidReceipts.length === 0 ? (
                    <div className={styles.emptyState}>
                        <CheckCircle size={48} />
                        <p>Félicitations ! Vous n'avez aucune dette fournisseur en cours.</p>
                    </div>
                ) : (
                    unpaidReceipts.map(receipt => (
                        <div key={receipt.id} className={styles.listItem}>
                            <div className={styles.supplierInfo}>
                                <div className={styles.supplierAvatar}><Truck size={14} /></div>
                                <span>{receipt.supplierName}</span>
                            </div>
                            <span className={styles.grNumber}>{receipt.grNumber}</span>
                            <span className={styles.date}>
                                <Calendar size={14} /> {formatDate(receipt.date)}
                            </span>
                            <span className={styles.amount}>{formatCurrency(receipt.total)}</span>
                            <div className={styles.status}>
                                {receipt.isPaid ? (
                                    <span className={styles.paidBadge}><CheckCircle size={12} /> Payé</span>
                                ) : (
                                    <span className={styles.unpaidBadge}><AlertCircle size={12} /> À payer</span>
                                )}
                            </div>
                            <div className={styles.actions}>
                                {!receipt.isPaid && (
                                    <button
                                        className={styles.payBtn}
                                        onClick={() => handlePayReceipt(receipt)}
                                    >
                                        Régler
                                    </button>
                                )}
                                <button
                                    className={styles.viewBtn}
                                    onClick={() => handleViewDetail(receipt)}
                                >
                                    Détail
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Payment Modal */}
            {showPaymentModal && selectedReceipt && (
                <div className={styles.overlay} onClick={() => setShowPaymentModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>💳 Régler le Bon d'Entrée</h3>
                            <button onClick={() => setShowPaymentModal(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.receiptSummary}>
                                <p><strong>Fournisseur:</strong> {selectedReceipt.supplierName}</p>
                                <p><strong>N° Bon:</strong> {selectedReceipt.grNumber}</p>
                                <p><strong>Montant:</strong> <span className={styles.amount}>{formatCurrency(selectedReceipt.total)}</span></p>
                            </div>
                            <div className={styles.paymentOptions}>
                                <h4>Payer depuis:</h4>
                                <button
                                    className={styles.paymentBtn}
                                    onClick={() => confirmPayment('cash')}
                                >
                                    <CreditCard size={20} />
                                    Caisse
                                </button>
                                <button
                                    className={styles.paymentBtn}
                                    onClick={() => confirmPayment('safe')}
                                >
                                    <CreditCard size={20} />
                                    Coffre
                                </button>
                                <button
                                    className={styles.paymentBtn}
                                    onClick={() => confirmPayment('provision')}
                                >
                                    <CreditCard size={20} />
                                    Provision
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedReceipt && (
                <div className={styles.overlay} onClick={() => setShowDetailModal(false)}>
                    <div className={styles.detailModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3><Eye size={20} /> Détail du Bon d'Entrée</h3>
                            <button onClick={() => setShowDetailModal(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.receiptInfo}>
                                <div className={styles.infoRow}>
                                    <span>N° Bon:</span>
                                    <strong>{selectedReceipt.grNumber}</strong>
                                </div>
                                <div className={styles.infoRow}>
                                    <span>Fournisseur:</span>
                                    <strong>{selectedReceipt.supplierName}</strong>
                                </div>
                                <div className={styles.infoRow}>
                                    <span>Date:</span>
                                    <strong>{formatDate(selectedReceipt.date)}</strong>
                                </div>
                                {selectedReceipt.invoiceNumber && (
                                    <div className={styles.infoRow}>
                                        <span>N° Facture:</span>
                                        <strong>{selectedReceipt.invoiceNumber}</strong>
                                    </div>
                                )}
                                <div className={styles.infoRow}>
                                    <span>Statut:</span>
                                    <strong>{selectedReceipt.isPaid ? '✅ Payé' : '⏳ À payer'}</strong>
                                </div>
                                {selectedReceipt.isPaid && selectedReceipt.paidFrom && (
                                    <div className={styles.infoRow}>
                                        <span>Payé depuis:</span>
                                        <strong>{selectedReceipt.paidFrom === 'cash' ? 'Caisse' : selectedReceipt.paidFrom === 'safe' ? 'Coffre' : 'Provision'}</strong>
                                    </div>
                                )}
                            </div>
                            <div className={styles.itemsList}>
                                <h4>Articles ({selectedReceipt.items.length})</h4>
                                {selectedReceipt.items.map(item => (
                                    <div key={item.id} className={styles.itemRow}>
                                        <span>{item.productEmoji} {item.productName}</span>
                                        <span>{item.receivedQty} {item.unit}</span>
                                        <span>{formatCurrency(item.total)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.totalRow}>
                                <strong>Total:</strong>
                                <strong className={styles.totalAmount}>{formatCurrency(selectedReceipt.total)}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

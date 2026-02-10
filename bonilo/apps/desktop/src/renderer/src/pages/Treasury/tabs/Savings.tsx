import React, { useState } from 'react';
import {
    PiggyBank,
    Plus,
    Minus,
    ArrowUpRight,
    ArrowDownLeft,
    History,
    Lock,
    X,
    TrendingUp,
    Target,
    Calendar,
    AlertCircle,
    CheckCircle,
    Edit2,
    Banknote,
} from 'lucide-react';
import { useTreasuryStore, useAuthStore, type SinkingFund } from '@asgard/shared/stores';
import { useSettings } from '../../../contexts/SettingsContext';
import styles from './Savings.module.css';

export const Savings: React.FC = () => {
    const { formatCurrency } = useSettings();
    const { user } = useAuthStore();
    const userName = user ? `${user.firstName} ${user.lastName}` : 'Caissier';

    // Treasury store - real data
    const {
        safeBalance,
        safeTransactions,
        sinkingFunds,
        depositToSafe,
        withdrawFromSafe,
        contributeToFund,
        withdrawFromFund,
        updateFundTarget,
        addSinkingFund,
        getDailyProvisionTarget,
        getTotalSafeAndProvisions,
    } = useTreasuryStore();

    // Modal states
    const [showSafeDepositModal, setShowSafeDepositModal] = useState(false);
    const [showSafeWithdrawModal, setShowSafeWithdrawModal] = useState(false);
    const [showFundModal, setShowFundModal] = useState(false);
    const [showEditTargetModal, setShowEditTargetModal] = useState(false);
    const [showNewFundModal, setShowNewFundModal] = useState(false);
    const [selectedFund, setSelectedFund] = useState<SinkingFund | null>(null);
    const [modalMode, setModalMode] = useState<'contribute' | 'withdraw'>('contribute');

    // Form states
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [newTarget, setNewTarget] = useState('');

    // New fund form states
    const [newFundName, setNewFundName] = useState('');
    const [newFundIcon, setNewFundIcon] = useState('💰');
    const [newFundTarget, setNewFundTarget] = useState('');
    const [newFundDueDay, setNewFundDueDay] = useState('25');

    // Calculated values
    const dailyTargets = getDailyProvisionTarget();
    const totalReserves = getTotalSafeAndProvisions();
    const totalProvisions = sinkingFunds.reduce((sum, f) => sum + f.currentBalance, 0);

    const formatDate = (date: Date | string) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // Get days remaining until fund due date
    const getDaysUntilDue = (dueDay: number) => {
        const today = new Date();
        const currentDay = today.getDate();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

        if (currentDay <= dueDay) {
            return dueDay - currentDay;
        } else {
            return daysInMonth - currentDay + dueDay;
        }
    };

    // Get fund status
    const getFundStatus = (fund: SinkingFund) => {
        const currentDay = new Date().getDate();
        const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        const expectedProgress = currentDay / daysInMonth;
        const expectedAmount = fund.targetAmount * expectedProgress;

        if (fund.currentBalance >= fund.targetAmount) return 'complete';
        if (fund.currentBalance >= expectedAmount * 0.9) return 'ontrack';
        if (fund.currentBalance >= expectedAmount * 0.5) return 'behind';
        return 'critical';
    };

    // Handle safe deposit
    const handleSafeDeposit = () => {
        const amountValue = parseFloat(amount);
        if (isNaN(amountValue) || amountValue <= 0) return;
        depositToSafe(amountValue, reason || 'Dépôt au coffre', userName);
        setShowSafeDepositModal(false);
        setAmount('');
        setReason('');
    };

    // Handle safe withdrawal
    const handleSafeWithdraw = () => {
        const amountValue = parseFloat(amount);
        if (isNaN(amountValue) || amountValue <= 0 || amountValue > safeBalance) return;
        withdrawFromSafe(amountValue, reason || 'Retrait du coffre', userName);
        setShowSafeWithdrawModal(false);
        setAmount('');
        setReason('');
    };

    // Handle fund contribution
    const handleFundContribution = () => {
        if (!selectedFund) return;
        const amountValue = parseFloat(amount);
        if (isNaN(amountValue) || amountValue <= 0) return;
        contributeToFund(selectedFund.id, amountValue, reason || 'Provision', userName);
        setShowFundModal(false);
        setSelectedFund(null);
        setAmount('');
        setReason('');
    };

    // Handle fund withdrawal
    const handleFundWithdrawal = () => {
        if (!selectedFund) return;
        const amountValue = parseFloat(amount);
        if (isNaN(amountValue) || amountValue <= 0 || amountValue > selectedFund.currentBalance) return;
        withdrawFromFund(selectedFund.id, amountValue, reason || 'Paiement', userName);
        setShowFundModal(false);
        setSelectedFund(null);
        setAmount('');
        setReason('');
    };

    // Handle target update
    const handleUpdateTarget = () => {
        if (!selectedFund) return;
        const targetValue = parseFloat(newTarget);
        if (isNaN(targetValue) || targetValue <= 0) return;
        updateFundTarget(selectedFund.id, targetValue);
        setShowEditTargetModal(false);
        setSelectedFund(null);
        setNewTarget('');
    };

    // Open fund modal
    const openFundModal = (fund: SinkingFund, mode: 'contribute' | 'withdraw') => {
        setSelectedFund(fund);
        setModalMode(mode);
        setShowFundModal(true);
    };

    // Open edit target modal
    const openEditTargetModal = (fund: SinkingFund) => {
        setSelectedFund(fund);
        setNewTarget(fund.targetAmount.toString());
        setShowEditTargetModal(true);
    };

    // Create new fund
    const handleCreateFund = () => {
        const targetValue = parseFloat(newFundTarget);
        if (!newFundName || isNaN(targetValue) || targetValue <= 0) return;

        addSinkingFund({
            name: newFundName,
            icon: newFundIcon,
            color: '#10b981',
            targetAmount: targetValue,
            dueDay: parseInt(newFundDueDay) || 25,
            isRecurring: true,
            category: 'custom',
        });

        setShowNewFundModal(false);
        setNewFundName('');
        setNewFundIcon('💰');
        setNewFundTarget('');
        setNewFundDueDay('25');
    };

    return (
        <div className={styles.savings}>
            {/* Overview Cards */}
            <div className={styles.overviewGrid}>
                {/* Safe Balance */}
                <div className={styles.safeCard}>
                    <div className={styles.safeIcon}>
                        <Lock size={32} />
                    </div>
                    <div className={styles.safeInfo}>
                        <span className={styles.safeLabel}>Coffre</span>
                        <span className={styles.safeValue}>{formatCurrency(safeBalance)}</span>
                    </div>
                    <div className={styles.safeActions}>
                        <button className={styles.depositBtn} onClick={() => setShowSafeDepositModal(true)}>
                            <Plus size={16} /> Dépôt
                        </button>
                        <button className={styles.withdrawBtn} onClick={() => setShowSafeWithdrawModal(true)}>
                            <Minus size={16} /> Retrait
                        </button>
                    </div>
                </div>

                {/* Total Provisions */}
                <div className={styles.provisionsCard}>
                    <div className={styles.provisionsIcon}>
                        <Banknote size={32} />
                    </div>
                    <div className={styles.provisionsInfo}>
                        <span className={styles.provisionsLabel}>Total Provisions</span>
                        <span className={styles.provisionsValue}>{formatCurrency(totalProvisions)}</span>
                    </div>
                    <div className={styles.dailyTarget}>
                        <Target size={16} />
                        <span>Objectif quotidien: <strong>{formatCurrency(dailyTargets.total)}</strong></span>
                    </div>
                </div>

                {/* Total Reserves */}
                <div className={styles.totalCard}>
                    <div className={styles.totalIcon}>
                        <PiggyBank size={32} />
                    </div>
                    <div className={styles.totalInfo}>
                        <span className={styles.totalLabel}>Réserves Totales</span>
                        <span className={styles.totalValue}>{formatCurrency(totalReserves)}</span>
                    </div>
                    <div className={styles.totalBreakdown}>
                        <span>Coffre + Provisions</span>
                    </div>
                </div>
            </div>

            {/* Sinking Funds */}
            <div className={styles.fundsSection}>
                <div className={styles.fundsSectionHeader}>
                    <div>
                        <h3>Cagnottes & Provisions</h3>
                        <p className={styles.sectionHint}>
                            Mettez de l'argent de côté chaque jour pour vos charges fixes
                        </p>
                    </div>
                    <button className={styles.addFundBtn} onClick={() => setShowNewFundModal(true)}>
                        <Plus size={16} /> Nouvelle cagnotte
                    </button>
                </div>

                <div className={styles.fundsGrid}>
                    {sinkingFunds.map(fund => {
                        const status = getFundStatus(fund);
                        const daysUntilDue = getDaysUntilDue(fund.dueDay);
                        const progressPercent = Math.min(100, (fund.currentBalance / fund.targetAmount) * 100);

                        return (
                            <div key={fund.id} className={`${styles.fundCard} ${styles[status]}`}>
                                <div className={styles.fundHeader}>
                                    <div className={styles.fundIcon}>
                                        <span>{fund.icon}</span>
                                    </div>
                                    <div className={styles.fundInfo}>
                                        <span className={styles.fundName}>{fund.name}</span>
                                        <span className={styles.fundDue}>
                                            <Calendar size={12} />
                                            Échéance: {daysUntilDue}j
                                        </span>
                                    </div>
                                    <button
                                        className={styles.editBtn}
                                        onClick={() => openEditTargetModal(fund)}
                                        title="Modifier l'objectif"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                </div>

                                <div className={styles.fundProgress}>
                                    <div className={styles.fundAmounts}>
                                        <span className={styles.currentAmount}>{formatCurrency(fund.currentBalance)}</span>
                                        <span className={styles.targetAmount}>/ {formatCurrency(fund.targetAmount)}</span>
                                    </div>
                                    <div className={styles.progressWrapper}>
                                        <div
                                            className={styles.progressBar}
                                            style={{ width: `${progressPercent}%` }}
                                        ></div>
                                    </div>
                                    <span className={styles.progressPercent}>{Math.round(progressPercent)}%</span>
                                </div>

                                <div className={styles.fundStatus}>
                                    {status === 'complete' && (
                                        <span className={styles.statusComplete}>
                                            <CheckCircle size={14} /> Objectif atteint
                                        </span>
                                    )}
                                    {status === 'ontrack' && (
                                        <span className={styles.statusOntrack}>
                                            <TrendingUp size={14} /> En bonne voie
                                        </span>
                                    )}
                                    {status === 'behind' && (
                                        <span className={styles.statusBehind}>
                                            <AlertCircle size={14} /> En retard
                                        </span>
                                    )}
                                    {status === 'critical' && (
                                        <span className={styles.statusCritical}>
                                            <AlertCircle size={14} /> Critique
                                        </span>
                                    )}
                                </div>

                                <div className={styles.fundActions}>
                                    <button onClick={() => openFundModal(fund, 'contribute')}>
                                        <Plus size={14} /> Ajouter
                                    </button>
                                    <button
                                        onClick={() => openFundModal(fund, 'withdraw')}
                                        disabled={fund.currentBalance === 0}
                                    >
                                        <Minus size={14} /> Utiliser
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Recent Transactions */}
            <div className={styles.historyCard}>
                <div className={styles.cardHeader}>
                    <h3><History size={18} /> Historique récent</h3>
                </div>
                <div className={styles.historyList}>
                    {safeTransactions.length === 0 && sinkingFunds.every(f => f.history.length === 0) ? (
                        <div className={styles.emptyState}>
                            <PiggyBank size={48} />
                            <p>Aucune transaction pour le moment</p>
                        </div>
                    ) : (
                        <>
                            {/* Safe transactions */}
                            {safeTransactions.slice(0, 5).map(t => (
                                <div key={t.id} className={styles.historyItem}>
                                    <div className={styles.historyLeft}>
                                        {t.type === 'deposit' ? (
                                            <ArrowUpRight size={20} className={styles.depositIcon} />
                                        ) : (
                                            <ArrowDownLeft size={20} className={styles.withdrawIcon} />
                                        )}
                                        <div>
                                            <span className={styles.historyReason}>{t.reason}</span>
                                            <span className={styles.historyMeta}>
                                                Coffre • {formatDate(t.date)} • {t.performedBy}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`${styles.historyAmount} ${t.type === 'deposit' ? styles.positive : styles.negative}`}>
                                        {t.type === 'deposit' ? '+' : '-'}{formatCurrency(t.amount)}
                                    </span>
                                </div>
                            ))}

                            {/* Fund transactions */}
                            {sinkingFunds.flatMap(f =>
                                f.history.slice(0, 3).map(t => ({
                                    ...t,
                                    fundName: f.name,
                                    fundIcon: f.icon,
                                }))
                            ).slice(0, 5).map(t => (
                                <div key={t.id} className={styles.historyItem}>
                                    <div className={styles.historyLeft}>
                                        {t.type === 'contribution' ? (
                                            <ArrowUpRight size={20} className={styles.depositIcon} />
                                        ) : (
                                            <ArrowDownLeft size={20} className={styles.withdrawIcon} />
                                        )}
                                        <div>
                                            <span className={styles.historyReason}>
                                                {t.fundIcon} {t.reason}
                                            </span>
                                            <span className={styles.historyMeta}>
                                                {t.fundName} • {formatDate(t.date)} • {t.performedBy}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`${styles.historyAmount} ${t.type === 'contribution' ? styles.positive : styles.negative}`}>
                                        {t.type === 'contribution' ? '+' : '-'}{formatCurrency(t.amount)}
                                    </span>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>

            {/* MODALS */}

            {/* Safe Deposit Modal */}
            {showSafeDepositModal && (
                <div className={styles.overlay} onClick={() => setShowSafeDepositModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Dépôt au coffre</h2>
                            <button onClick={() => setShowSafeDepositModal(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <label>Montant (DA)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                placeholder="0"
                                autoFocus
                            />
                            <label>Motif (optionnel)</label>
                            <input
                                type="text"
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                placeholder="Ex: Bénéfices du jour"
                            />
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowSafeDepositModal(false)}>Annuler</button>
                            <button
                                className={styles.confirmBtn}
                                onClick={handleSafeDeposit}
                                disabled={!amount || parseFloat(amount) <= 0}
                            >
                                <Plus size={18} /> Déposer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Safe Withdraw Modal */}
            {showSafeWithdrawModal && (
                <div className={styles.overlay} onClick={() => setShowSafeWithdrawModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Retrait du coffre</h2>
                            <button onClick={() => setShowSafeWithdrawModal(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.currentBalance}>
                                <Lock size={16} /> Solde actuel: <strong>{formatCurrency(safeBalance)}</strong>
                            </div>
                            <label>Montant (DA)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                placeholder="0"
                                autoFocus
                            />
                            <label>Motif</label>
                            <input
                                type="text"
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                placeholder="Ex: Paiement fournisseur"
                            />
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowSafeWithdrawModal(false)}>Annuler</button>
                            <button
                                className={styles.dangerBtn}
                                onClick={handleSafeWithdraw}
                                disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > safeBalance}
                            >
                                <Minus size={18} /> Retirer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Fund Modal (Contribute/Withdraw) */}
            {showFundModal && selectedFund && (
                <div className={styles.overlay} onClick={() => setShowFundModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>
                                {selectedFund.icon} {modalMode === 'contribute' ? 'Ajouter à' : 'Utiliser depuis'} {selectedFund.name}
                            </h2>
                            <button onClick={() => setShowFundModal(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.currentBalance}>
                                <Banknote size={16} /> Solde actuel: <strong>{formatCurrency(selectedFund.currentBalance)}</strong>
                            </div>
                            <label>Montant (DA)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                placeholder="0"
                                autoFocus
                            />
                            <label>Motif</label>
                            <input
                                type="text"
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                placeholder={modalMode === 'contribute' ? 'Ex: Provision journalière' : 'Ex: Paiement salaires'}
                            />
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowFundModal(false)}>Annuler</button>
                            {modalMode === 'contribute' ? (
                                <button
                                    className={styles.confirmBtn}
                                    onClick={handleFundContribution}
                                    disabled={!amount || parseFloat(amount) <= 0}
                                >
                                    <Plus size={18} /> Ajouter
                                </button>
                            ) : (
                                <button
                                    className={styles.dangerBtn}
                                    onClick={handleFundWithdrawal}
                                    disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > selectedFund.currentBalance}
                                >
                                    <Minus size={18} /> Utiliser
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Target Modal */}
            {showEditTargetModal && selectedFund && (
                <div className={styles.overlay} onClick={() => setShowEditTargetModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{selectedFund.icon} Modifier l'objectif</h2>
                            <button onClick={() => setShowEditTargetModal(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <p className={styles.hint}>
                                Définissez le montant mensuel à provisionner pour "{selectedFund.name}"
                            </p>
                            <label>Objectif mensuel (DA)</label>
                            <input
                                type="number"
                                value={newTarget}
                                onChange={e => setNewTarget(e.target.value)}
                                placeholder="0"
                                autoFocus
                            />
                            <p className={styles.dailyCalc}>
                                = {formatCurrency(Math.round((parseFloat(newTarget) || 0) / 30))}/jour
                            </p>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowEditTargetModal(false)}>Annuler</button>
                            <button
                                className={styles.confirmBtn}
                                onClick={handleUpdateTarget}
                                disabled={!newTarget || parseFloat(newTarget) <= 0}
                            >
                                <CheckCircle size={18} /> Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* New Fund Modal */}
            {showNewFundModal && (
                <div className={styles.overlay} onClick={() => setShowNewFundModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>💰 Nouvelle cagnotte</h2>
                            <button onClick={() => setShowNewFundModal(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <label>Nom de la cagnotte</label>
                            <input
                                type="text"
                                value={newFundName}
                                onChange={e => setNewFundName(e.target.value)}
                                placeholder="Ex: Impôts, Assurance, Maintenance..."
                                autoFocus
                            />
                            <label>Icône (emoji)</label>
                            <div className={styles.emojiPicker}>
                                {['💰', '🏠', '📱', '🚗', '💼', '🎓', '🏥', '⚡', '🛠️', '📊'].map(emoji => (
                                    <button
                                        key={emoji}
                                        className={newFundIcon === emoji ? styles.selectedEmoji : ''}
                                        onClick={() => setNewFundIcon(emoji)}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                            <label>Objectif mensuel (DA)</label>
                            <input
                                type="number"
                                value={newFundTarget}
                                onChange={e => setNewFundTarget(e.target.value)}
                                placeholder="50000"
                            />
                            <p className={styles.dailyCalc}>
                                = {formatCurrency(Math.round((parseFloat(newFundTarget) || 0) / 30))}/jour
                            </p>
                            <label>Jour d'échéance (1-31)</label>
                            <input
                                type="number"
                                value={newFundDueDay}
                                onChange={e => setNewFundDueDay(e.target.value)}
                                min="1"
                                max="31"
                            />
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowNewFundModal(false)}>Annuler</button>
                            <button
                                className={styles.confirmBtn}
                                onClick={handleCreateFund}
                                disabled={!newFundName || !newFundTarget || parseFloat(newFundTarget) <= 0}
                            >
                                <Plus size={18} /> Créer la cagnotte
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Savings;

import React, { useState, useMemo, useCallback } from 'react';
import {
    Clock,
    Plus,
    Minus,
    X,
    CheckCircle,
    AlertCircle,
    Wallet,
    ArrowUpCircle,
    ArrowDownCircle,
    Printer,
    Lock,
    Unlock,
    TrendingUp,
    TrendingDown,
    PiggyBank,
    ArrowRight,
    Banknote,
} from 'lucide-react';
import { useTreasuryStore, useAuthStore, type CashMovement } from '@asgard/shared/stores';
import { useSettings } from '../../../contexts/SettingsContext';
import { useToast } from '../../../components/feedback/Toast';
import styles from './CashRegister.module.css';

export const CashRegister: React.FC = () => {
    // Settings for currency formatting
    const { formatCurrency, settings } = useSettings();
    const toast = useToast();
    const { user } = useAuthStore();
    const userName = user ? `${user.firstName} ${user.lastName}` : 'Caissier';

    // Treasury store - real data, no mocks
    const {
        currentSession,
        movements,
        safeBalance,
        openSession,
        closeSession,
        addMovement,
        depositToSafe,
        contributeToFund,
        getCurrentBalance,
        getDailyProvisionTarget,
        getProvisionProgress,
    } = useTreasuryStore();

    // Modal states
    const [showOpenModal, setShowOpenModal] = useState(false);
    const [showCloseModal, setShowCloseModal] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);

    // Form states
    const [openingAmount, setOpeningAmount] = useState('');
    const [closingAmount, setClosingAmount] = useState('');
    const [closingNotes, setClosingNotes] = useState('');
    const [movementAmount, setMovementAmount] = useState('');
    const [movementReason, setMovementReason] = useState('');

    // Transfer modal states
    const [transferToSafe, setTransferToSafe] = useState('');
    const [transferSalaries, setTransferSalaries] = useState('');
    const [transferBankCredit, setTransferBankCredit] = useState('');
    const [transferCharges, setTransferCharges] = useState('');

    // Print states
    const [isPrinting, setIsPrinting] = useState(false);

    // Calculated values
    const currentBalance = getCurrentBalance();
    const dailyTargets = getDailyProvisionTarget();
    const provisionProgress = getProvisionProgress();
    const isSessionOpen = currentSession && currentSession.status === 'open';

    // Filter today's movements from the current session
    const todayMovements = useMemo(() => {
        if (!currentSession) return [];
        return (movements as CashMovement[])
            .filter((m: CashMovement) => m.sessionId === currentSession.id)
            .sort((a: CashMovement, b: CashMovement) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [movements, currentSession]);

    // Calculate session totals
    const sessionTotals = useMemo(() => {
        const sales = todayMovements.filter((m: CashMovement) => m.type === 'sale').reduce((s: number, m: CashMovement) => s + m.amount, 0);
        const expenses = todayMovements.filter((m: CashMovement) => m.type === 'expense').reduce((s: number, m: CashMovement) => s + m.amount, 0);
        const withdrawals = todayMovements.filter((m: CashMovement) => m.type === 'withdrawal').reduce((s: number, m: CashMovement) => s + m.amount, 0);
        const deposits = todayMovements.filter((m: CashMovement) => m.type === 'deposit').reduce((s: number, m: CashMovement) => s + m.amount, 0);
        const toSafe = todayMovements.filter((m: CashMovement) => m.type === 'transfer_to_safe').reduce((s: number, m: CashMovement) => s + m.amount, 0);
        const toProvisions = todayMovements.filter((m: CashMovement) => m.type === 'transfer_to_provision').reduce((s: number, m: CashMovement) => s + m.amount, 0);
        return { sales, expenses, withdrawals, deposits, toSafe, toProvisions };
    }, [todayMovements]);

    // Format time
    const formatTime = (date: Date | string) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    // Handle session open
    const handleOpenSession = () => {
        const amount = parseFloat(openingAmount);
        if (isNaN(amount) || amount < 0) return;
        openSession(amount, userName);
        setShowOpenModal(false);
        setOpeningAmount('');
    };

    // Handle session close with transfers
    const handleCloseSession = () => {
        const amount = parseFloat(closingAmount);
        if (isNaN(amount) || amount < 0) return;
        closeSession(amount, closingNotes);
        setShowCloseModal(false);
        setClosingAmount('');
        setClosingNotes('');
    };

    // Handle deposit
    const handleDeposit = () => {
        const amount = parseFloat(movementAmount);
        if (isNaN(amount) || amount <= 0 || !movementReason) return;
        addMovement({
            type: 'deposit',
            amount,
            reason: movementReason,
            createdBy: userName,
        });
        setShowDepositModal(false);
        setMovementAmount('');
        setMovementReason('');
    };

    // Handle withdrawal
    const handleWithdraw = () => {
        const amount = parseFloat(movementAmount);
        if (isNaN(amount) || amount <= 0 || !movementReason) return;
        addMovement({
            type: 'withdrawal',
            amount,
            reason: movementReason,
            createdBy: userName,
        });
        setShowWithdrawModal(false);
        setMovementAmount('');
        setMovementReason('');
    };

    // Handle transfers to safe and provisions
    const handleTransfers = () => {
        const safeAmount = parseFloat(transferToSafe) || 0;
        const salariesAmount = parseFloat(transferSalaries) || 0;
        const bankCreditAmount = parseFloat(transferBankCredit) || 0;
        const chargesAmount = parseFloat(transferCharges) || 0;

        // Transfer to safe
        if (safeAmount > 0) {
            depositToSafe(safeAmount, 'Transfert fin de journée', userName);
        }

        // Contribute to provisions
        if (salariesAmount > 0) {
            contributeToFund('salaries', salariesAmount, 'Provision journalière', userName);
        }
        if (bankCreditAmount > 0) {
            contributeToFund('bankCredit', bankCreditAmount, 'Provision journalière', userName);
        }
        if (chargesAmount > 0) {
            contributeToFund('fixedCharges', chargesAmount, 'Provision journalière', userName);
        }

        setShowTransferModal(false);
        setTransferToSafe('');
        setTransferSalaries('');
        setTransferBankCredit('');
        setTransferCharges('');
    };

    // Get movement icon
    const getMovementIcon = (type: CashMovement['type']) => {
        switch (type) {
            case 'sale': return <ArrowUpCircle size={18} className={styles.saleIcon} />;
            case 'deposit': return <Plus size={18} className={styles.depositIcon} />;
            case 'withdrawal': return <Minus size={18} className={styles.withdrawIcon} />;
            case 'expense': return <ArrowDownCircle size={18} className={styles.expenseIcon} />;
            case 'transfer_to_safe': return <PiggyBank size={18} className={styles.safeIcon} />;
            case 'transfer_to_provision': return <Banknote size={18} className={styles.provisionIcon} />;
            default: return <Wallet size={18} />;
        }
    };

    // Get movement label
    const getMovementLabel = (type: CashMovement['type']) => {
        const labels: Record<string, string> = {
            sale: 'Vente',
            deposit: 'Entrée',
            withdrawal: 'Retrait',
            expense: 'Dépense',
            refund: 'Remboursement',
            transfer_to_safe: 'Vers Coffre',
            transfer_to_provision: 'Vers Provision',
        };
        return labels[type] || type;
    };

    // Print ticket function - fixed version
    const handlePrintTicket = useCallback((movement?: CashMovement) => {
        const ticketData = movement || todayMovements.find(m => m.type === 'sale');
        if (!ticketData) {
            toast.warning('Aucune vente à imprimer');
            return;
        }

        setIsPrinting(true);

        // Get type label inline to avoid dependency issues
        const typeLabels: Record<string, string> = {
            sale: 'Vente',
            deposit: 'Entrée',
            withdrawal: 'Retrait',
            expense: 'Dépense',
            refund: 'Remboursement',
            transfer_to_safe: 'Vers Coffre',
            transfer_to_provision: 'Vers Provision',
        };
        const typeLabel = typeLabels[ticketData.type] || ticketData.type;

        const storeName = settings?.store?.name || 'Bonilo';
        const dateStr = new Date(ticketData.createdAt).toLocaleDateString('fr-FR');
        const timeStr = new Date(ticketData.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        const amount = ticketData.amount.toLocaleString('fr-FR') + ' DA';

        const ticketHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Ticket - ${ticketData.id.slice(-8)}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Courier New', monospace; 
                        padding: 20px; 
                        max-width: 280px;
                        margin: 0 auto;
                    }
                    .ticket { border: 1px dashed #000; padding: 15px; }
                    .header { text-align: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px dashed #000; }
                    .store-name { font-size: 16px; font-weight: bold; }
                    .date { font-size: 12px; margin-top: 5px; }
                    .ticket-number { font-size: 11px; color: #666; margin-top: 5px; }
                    .content { padding: 10px 0; border-bottom: 1px dashed #000; }
                    .row { display: flex; justify-content: space-between; padding: 3px 0; }
                    .label { font-size: 12px; }
                    .value { font-size: 12px; font-weight: bold; }
                    .total { font-size: 16px !important; margin-top: 10px; padding-top: 10px; border-top: 2px solid #000; }
                    .footer { text-align: center; margin-top: 15px; font-size: 11px; }
                    .thanks { font-size: 12px; font-weight: bold; margin-top: 10px; }
                    @media print { body { padding: 0; } .ticket { border: none; } }
                </style>
            </head>
            <body>
                <div class="ticket">
                    <div class="header">
                        <div class="store-name">${storeName}</div>
                        <div class="date">${dateStr} - ${timeStr}</div>
                        <div class="ticket-number">Ticket N° ${ticketData.id.slice(-8).toUpperCase()}</div>
                    </div>
                    <div class="content">
                        <div class="row">
                            <span class="label">Type:</span>
                            <span class="value">${typeLabel}</span>
                        </div>
                        <div class="row">
                            <span class="label">Description:</span>
                            <span class="value">${ticketData.reason}</span>
                        </div>
                        <div class="row total">
                            <span class="label">MONTANT:</span>
                            <span class="value">${amount}</span>
                        </div>
                    </div>
                    <div class="footer">
                        <div class="thanks">Merci de votre visite! 🙏</div>
                        <div style="margin-top: 10px;">Caissier: ${currentSession?.cashierName || 'N/A'}</div>
                    </div>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(function() { window.close(); }, 500);
                    };
                </script>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank', 'width=350,height=500');
        if (printWindow) {
            printWindow.document.write(ticketHTML);
            printWindow.document.close();
        }

        setIsPrinting(false);
    }, [todayMovements, settings, currentSession]);

    return (
        <div className={styles.cashRegister}>
            {/* Session Bar */}
            {isSessionOpen ? (
                <div className={styles.sessionBar}>
                    <div className={styles.sessionInfo}>
                        <span className={styles.sessionStatus}>
                            <span className={styles.statusDot}></span>
                            Caisse ouverte
                        </span>
                        <span className={styles.sessionMeta}>
                            <Clock size={14} />
                            Ouverte à {formatTime(currentSession.openedAt)} par {currentSession.cashierName}
                        </span>
                    </div>
                    <div className={styles.sessionActions}>
                        <span className={styles.openingBalance}>
                            Fond: <strong>{formatCurrency(currentSession.openingBalance)}</strong>
                        </span>
                        <button className={styles.transferBtn} onClick={() => setShowTransferModal(true)}>
                            <ArrowRight size={16} />
                            Transférer
                        </button>
                        <button className={styles.closeBtn} onClick={() => setShowCloseModal(true)}>
                            <Lock size={16} />
                            Clôturer
                        </button>
                    </div>
                </div>
            ) : (
                <div className={styles.closedBar}>
                    <span>⚠️ Caisse fermée</span>
                    <button className={styles.openBtn} onClick={() => setShowOpenModal(true)}>
                        <Unlock size={16} />
                        Ouvrir la caisse
                    </button>
                </div>
            )}

            {/* Metrics Grid */}
            <div className={styles.metricsGrid}>
                <div className={`${styles.metric} ${styles.balance}`}>
                    <Wallet size={24} />
                    <div>
                        <span className={styles.metricLabel}>Solde en caisse</span>
                        <span className={styles.metricValue}>{formatCurrency(currentBalance)}</span>
                    </div>
                </div>
                <div className={`${styles.metric} ${styles.sales}`}>
                    <TrendingUp size={24} />
                    <div>
                        <span className={styles.metricLabel}>Ventes</span>
                        <span className={styles.metricValue}>{formatCurrency(sessionTotals.sales)}</span>
                    </div>
                </div>
                <div className={`${styles.metric} ${styles.expenses}`}>
                    <TrendingDown size={24} />
                    <div>
                        <span className={styles.metricLabel}>Sorties</span>
                        <span className={styles.metricValue}>{formatCurrency(sessionTotals.expenses + sessionTotals.withdrawals)}</span>
                    </div>
                </div>
                <div className={`${styles.metric} ${styles.safe}`}>
                    <PiggyBank size={24} />
                    <div>
                        <span className={styles.metricLabel}>Au coffre</span>
                        <span className={styles.metricValue}>{formatCurrency(safeBalance)}</span>
                    </div>
                </div>
            </div>

            {/* Daily Provision Targets */}
            {isSessionOpen && (
                <div className={styles.provisionsCard}>
                    <h4>Objectif Provisions Journalier</h4>
                    <div className={styles.provisionTargets}>
                        <div className={styles.provisionItem}>
                            <span className={styles.provisionIcon}>👥</span>
                            <div className={styles.provisionInfo}>
                                <span>Salaires</span>
                                <strong>{formatCurrency(dailyTargets.salaries)}/jour</strong>
                            </div>
                            <div className={styles.provisionProgress}>
                                <div className={styles.progressBar} style={{ width: `${provisionProgress.salaries}%` }}></div>
                            </div>
                        </div>
                        <div className={styles.provisionItem}>
                            <span className={styles.provisionIcon}>🏦</span>
                            <div className={styles.provisionInfo}>
                                <span>Crédit</span>
                                <strong>{formatCurrency(dailyTargets.bankCredit)}/jour</strong>
                            </div>
                            <div className={styles.provisionProgress}>
                                <div className={styles.progressBar} style={{ width: `${provisionProgress.bankCredit}%` }}></div>
                            </div>
                        </div>
                        <div className={styles.provisionItem}>
                            <span className={styles.provisionIcon}>⚡</span>
                            <div className={styles.provisionInfo}>
                                <span>Charges</span>
                                <strong>{formatCurrency(dailyTargets.fixedCharges)}/jour</strong>
                            </div>
                            <div className={styles.provisionProgress}>
                                <div className={styles.progressBar} style={{ width: `${provisionProgress.fixedCharges}%` }}></div>
                            </div>
                        </div>
                        <div className={styles.totalTarget}>
                            Total à provisionner: <strong>{formatCurrency(dailyTargets.total)}</strong>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className={styles.quickActions}>
                <button onClick={() => setShowDepositModal(true)} disabled={!isSessionOpen}>
                    <Plus size={18} /> Entrée de fonds
                </button>
                <button onClick={() => setShowWithdrawModal(true)} disabled={!isSessionOpen}>
                    <Minus size={18} /> Retrait
                </button>
                <button
                    className={styles.printBtn}
                    onClick={() => handlePrintTicket()}
                    disabled={!isSessionOpen || todayMovements.filter(m => m.type === 'sale').length === 0 || isPrinting}
                >
                    <Printer size={18} /> {isPrinting ? 'Impression...' : 'Imprimer dernier ticket'}
                </button>
            </div>

            {/* Movements List */}
            <div className={styles.movementsCard}>
                <div className={styles.cardHeader}>
                    <h3>Mouvements du jour</h3>
                    <span>{todayMovements.length} opérations</span>
                </div>
                <div className={styles.movementsList}>
                    {todayMovements.length === 0 ? (
                        <div className={styles.emptyState}>
                            <Wallet size={48} />
                            <p>Aucun mouvement pour cette session</p>
                        </div>
                    ) : (
                        todayMovements.map((m: CashMovement) => (
                            <div key={m.id} className={styles.movementItem}>
                                <div className={styles.movementLeft}>
                                    {getMovementIcon(m.type)}
                                    <div>
                                        <span className={styles.movementReason}>{m.reason}</span>
                                        <span className={styles.movementTime}>
                                            {getMovementLabel(m.type)} • {formatTime(m.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.movementRight}>
                                    <span className={`${styles.movementAmount} ${m.type === 'sale' || m.type === 'deposit' ? styles.positive : styles.negative}`}>
                                        {m.type === 'sale' || m.type === 'deposit' ? '+' : '-'}
                                        {formatCurrency(m.amount)}
                                    </span>
                                    <button
                                        className={styles.printMovementBtn}
                                        onClick={() => handlePrintTicket(m)}
                                        title="Imprimer ce ticket"
                                    >
                                        <Printer size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* MODALS */}

            {/* Open Session Modal */}
            {showOpenModal && (
                <div className={styles.overlay} onClick={() => setShowOpenModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Ouvrir la caisse</h2>
                            <button onClick={() => setShowOpenModal(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <label>Fond de caisse (DA)</label>
                            <input
                                type="number"
                                value={openingAmount}
                                onChange={(e) => setOpeningAmount(e.target.value)}
                                placeholder="5000"
                                autoFocus
                            />
                            <p className={styles.hint}>Comptez les espèces dans la caisse avant de commencer.</p>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowOpenModal(false)}>Annuler</button>
                            <button
                                className={styles.confirmBtn}
                                onClick={handleOpenSession}
                                disabled={!openingAmount || parseFloat(openingAmount) < 0}
                            >
                                <Unlock size={18} /> Ouvrir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Close Session Modal */}
            {showCloseModal && (
                <div className={styles.overlay} onClick={() => setShowCloseModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Clôturer la caisse</h2>
                            <button onClick={() => setShowCloseModal(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.expectedBalance}>
                                <span>Solde théorique:</span>
                                <strong>{formatCurrency(currentBalance)}</strong>
                            </div>
                            <label>Montant réel compté (DA)</label>
                            <input
                                type="number"
                                value={closingAmount}
                                onChange={(e) => setClosingAmount(e.target.value)}
                                placeholder={currentBalance.toString()}
                                autoFocus
                            />
                            {closingAmount && (
                                <div className={`${styles.difference} ${parseFloat(closingAmount) === currentBalance ? styles.exact :
                                    parseFloat(closingAmount) > currentBalance ? styles.surplus : styles.deficit
                                    }`}>
                                    {parseFloat(closingAmount) === currentBalance ? (
                                        <><CheckCircle size={16} /> Caisse équilibrée</>
                                    ) : (
                                        <><AlertCircle size={16} /> Écart: {formatCurrency(parseFloat(closingAmount) - currentBalance)}</>
                                    )}
                                </div>
                            )}
                            <label>Notes (optionnel)</label>
                            <textarea
                                value={closingNotes}
                                onChange={(e) => setClosingNotes(e.target.value)}
                                placeholder="Observations de fin de journée..."
                                rows={2}
                            />
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowCloseModal(false)}>Annuler</button>
                            <button
                                className={styles.dangerBtn}
                                onClick={handleCloseSession}
                                disabled={!closingAmount || parseFloat(closingAmount) < 0}
                            >
                                <Lock size={18} /> Clôturer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Deposit Modal */}
            {showDepositModal && (
                <div className={styles.overlay} onClick={() => setShowDepositModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Entrée de fonds</h2>
                            <button onClick={() => setShowDepositModal(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <label>Montant (DA)</label>
                            <input
                                type="number"
                                value={movementAmount}
                                onChange={(e) => setMovementAmount(e.target.value)}
                                placeholder="0"
                                autoFocus
                            />
                            <label>Motif</label>
                            <input
                                type="text"
                                value={movementReason}
                                onChange={(e) => setMovementReason(e.target.value)}
                                placeholder="Ex: Apport de monnaie"
                            />
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowDepositModal(false)}>Annuler</button>
                            <button
                                className={styles.confirmBtn}
                                onClick={handleDeposit}
                                disabled={!movementAmount || !movementReason}
                            >
                                <Plus size={18} /> Ajouter
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Withdraw Modal */}
            {showWithdrawModal && (
                <div className={styles.overlay} onClick={() => setShowWithdrawModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Retrait</h2>
                            <button onClick={() => setShowWithdrawModal(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <label>Montant (DA)</label>
                            <input
                                type="number"
                                value={movementAmount}
                                onChange={(e) => setMovementAmount(e.target.value)}
                                placeholder="0"
                                autoFocus
                            />
                            <label>Motif</label>
                            <input
                                type="text"
                                value={movementReason}
                                onChange={(e) => setMovementReason(e.target.value)}
                                placeholder="Ex: Retrait patron"
                            />
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowWithdrawModal(false)}>Annuler</button>
                            <button
                                className={styles.dangerBtn}
                                onClick={handleWithdraw}
                                disabled={!movementAmount || !movementReason}
                            >
                                <Minus size={18} /> Retirer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Transfer Modal - Key feature for financial management */}
            {showTransferModal && (
                <div className={styles.overlay} onClick={() => setShowTransferModal(false)}>
                    <div className={styles.transferModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Transférer vers Coffre & Provisions</h2>
                            <button onClick={() => setShowTransferModal(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.currentCash}>
                                <Wallet size={24} />
                                <span>En caisse:</span>
                                <strong>{formatCurrency(currentBalance)}</strong>
                            </div>

                            <div className={styles.transferSection}>
                                <h4><PiggyBank size={18} /> Vers le Coffre</h4>
                                <input
                                    type="number"
                                    value={transferToSafe}
                                    onChange={(e) => setTransferToSafe(e.target.value)}
                                    placeholder="0"
                                />
                            </div>

                            <div className={styles.transferSection}>
                                <h4>📊 Vers les Provisions</h4>
                                <p className={styles.hint}>Objectif quotidien: {formatCurrency(dailyTargets.total)}</p>

                                <div className={styles.provisionInputs}>
                                    <div className={styles.provisionRow}>
                                        <span>👥 Salaires ({formatCurrency(dailyTargets.salaries)}/j)</span>
                                        <input
                                            type="number"
                                            value={transferSalaries}
                                            onChange={(e) => setTransferSalaries(e.target.value)}
                                            placeholder={dailyTargets.salaries.toString()}
                                        />
                                    </div>
                                    <div className={styles.provisionRow}>
                                        <span>🏦 Crédit ({formatCurrency(dailyTargets.bankCredit)}/j)</span>
                                        <input
                                            type="number"
                                            value={transferBankCredit}
                                            onChange={(e) => setTransferBankCredit(e.target.value)}
                                            placeholder={dailyTargets.bankCredit.toString()}
                                        />
                                    </div>
                                    <div className={styles.provisionRow}>
                                        <span>⚡ Charges ({formatCurrency(dailyTargets.fixedCharges)}/j)</span>
                                        <input
                                            type="number"
                                            value={transferCharges}
                                            onChange={(e) => setTransferCharges(e.target.value)}
                                            placeholder={dailyTargets.fixedCharges.toString()}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.transferTotal}>
                                <span>Total à transférer:</span>
                                <strong>
                                    {formatCurrency(
                                        (parseFloat(transferToSafe) || 0) +
                                        (parseFloat(transferSalaries) || 0) +
                                        (parseFloat(transferBankCredit) || 0) +
                                        (parseFloat(transferCharges) || 0)
                                    )}
                                </strong>
                            </div>

                            <button className={styles.quickFillBtn} onClick={() => {
                                setTransferSalaries(dailyTargets.salaries.toString());
                                setTransferBankCredit(dailyTargets.bankCredit.toString());
                                setTransferCharges(dailyTargets.fixedCharges.toString());
                            }}>
                                ⚡ Remplir avec objectifs quotidiens
                            </button>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowTransferModal(false)}>Annuler</button>
                            <button className={styles.confirmBtn} onClick={handleTransfers}>
                                <ArrowRight size={18} /> Transférer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CashRegister;

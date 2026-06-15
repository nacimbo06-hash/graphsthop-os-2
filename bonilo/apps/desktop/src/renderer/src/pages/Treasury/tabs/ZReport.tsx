import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    FileBarChart,
    Calendar,
    Printer,
    Download,
    CheckCircle,
    Clock,
    TrendingUp,
    TrendingDown,
    DollarSign,
    CreditCard,
    Banknote,
    Smartphone,
    ShoppingCart,
    AlertTriangle,
    Lock,
    PiggyBank,
    ArrowRight,
} from 'lucide-react';
import { useTreasuryStore, useAuthStore, type CashSession, type CashMovement, type SessionTotals } from '@bonilo/shared/stores';
import { useSettings } from '../../../contexts/SettingsContext';
import { useToast } from '../../../components/feedback/Toast';
import styles from './ZReport.module.css';
import { commandErrorMessage } from '../../../utils/commandError';

export const ZReport: React.FC = () => {
    const { formatCurrency, storeSettings } = useSettings();
    const toast = useToast();
    const { user } = useAuthStore();
    const userName = user ? `${user.firstName} ${user.lastName}` : 'Caissier';
    const reportRef = useRef<HTMLDivElement>(null);

    // Treasury store - real data
    const {
        currentSession,
        sessions,
        movements,
        sinkingFunds,
        safeBalance,
        getCurrentBalance,
        closeSession,
        depositToSafe,
        contributeToFund,
        getDailyProvisionTarget,
        closeSessionWithTransfers,
        getSessionTotals,
    } = useTreasuryStore();

    // Z-report totals aggregated straight from SQL, so the printed figures match
    // the DB even when the in-memory movement cache is behind (money-core
    // commands write movements without always pushing them into the store).
    // Re-fetched whenever the session or the movement cache changes.
    const [sqlTotals, setSqlTotals] = useState<SessionTotals | null>(null);
    useEffect(() => {
        if (!currentSession) {
            setSqlTotals(null);
            return;
        }
        let cancelled = false;
        getSessionTotals(currentSession.id)
            .then(t => { if (!cancelled) setSqlTotals(t); })
            .catch(err => console.error('[ZReport] getSessionTotals failed:', err));
        return () => { cancelled = true; };
    }, [currentSession, movements, getSessionTotals]);

    // Modal states
    const [showCloseModal, setShowCloseModal] = useState(false);
    const [closingAmount, setClosingAmount] = useState('');
    const [closingNotes, setClosingNotes] = useState('');
    const [isPrinting, setIsPrinting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Transfer states for closing
    const [transferToSafe, setTransferToSafe] = useState('');
    const [transferSalaries, setTransferSalaries] = useState('');
    const [transferBankCredit, setTransferBankCredit] = useState('');
    const [transferCharges, setTransferCharges] = useState('');

    // Today's report. Totals come from the SQL aggregate (sqlTotals) when it has
    // resolved; until then (and in browser dev) we fall back to the in-memory
    // movement cache so the panel still renders.
    const todayReport = useMemo(() => {
        if (!currentSession) return null;

        const sessionMovements = movements.filter(m => m.sessionId === currentSession.id);
        const sumByType = (type: string) =>
            sessionMovements.filter(m => m.type === type).reduce((s, m) => s + m.amount, 0);
        const sales = sessionMovements.filter(m => m.type === 'sale');

        const fallback: SessionTotals = {
            totalSales: sales.reduce((s, m) => s + m.amount, 0),
            salesCount: sales.length,
            cashSales: sales.filter(m => !m.paymentMethod || m.paymentMethod === 'cash').reduce((s, m) => s + m.amount, 0),
            cardSales: sales.filter(m => m.paymentMethod === 'card').reduce((s, m) => s + m.amount, 0),
            dahabiaSales: sales.filter(m => m.paymentMethod === 'dahabia').reduce((s, m) => s + m.amount, 0),
            creditSales: sales.filter(m => m.paymentMethod === 'credit').reduce((s, m) => s + m.amount, 0),
            refunds: sumByType('refund'),
            refundsCount: sessionMovements.filter(m => m.type === 'refund').length,
            expenses: sumByType('expense'),
            expensesCount: sessionMovements.filter(m => m.type === 'expense').length,
            deposits: sumByType('deposit'),
            withdrawals: sumByType('withdrawal'),
            transfersToSafe: sumByType('transfer_to_safe'),
            transfersToProvisions: sumByType('transfer_to_provision'),
        };

        const t = sqlTotals ?? fallback;

        return {
            date: new Date(currentSession.openedAt),
            openingBalance: currentSession.openingBalance,
            totalSales: t.totalSales,
            salesCount: t.salesCount,
            averageTicket: t.salesCount > 0 ? Math.round(t.totalSales / t.salesCount) : 0,
            cashSales: t.cashSales,
            cardSales: t.cardSales,
            dahabiaSales: t.dahabiaSales,
            creditSales: t.creditSales,
            refunds: t.refunds,
            refundsCount: t.refundsCount,
            expenses: t.expenses,
            expensesCount: t.expensesCount,
            deposits: t.deposits,
            withdrawals: t.withdrawals,
            transfersToSafe: t.transfersToSafe,
            transfersToProvisions: t.transfersToProvisions,
            status: currentSession.status,
            cashierName: currentSession.cashierName,
        };
    }, [currentSession, movements, sqlTotals]);

    // Past closed sessions
    const pastReports = useMemo(() => {
        return sessions
            .filter((s: CashSession) => s.status === 'closed')
            .slice(0, 7)
            .map((s: CashSession) => {
                const sessionMovements = movements.filter((m: CashMovement) => m.sessionId === s.id);
                const totalSales = sessionMovements
                    .filter((m: CashMovement) => m.type === 'sale')
                    .reduce((sum: number, m: CashMovement) => sum + m.amount, 0);
                const salesCount = sessionMovements.filter((m: CashMovement) => m.type === 'sale').length;

                return {
                    id: s.id,
                    date: new Date(s.openedAt),
                    closedAt: s.closedAt ? new Date(s.closedAt) : null,
                    closedBy: s.cashierName,
                    totalSales,
                    salesCount,
                    difference: s.difference || 0,
                    openingBalance: s.openingBalance,
                    closingBalance: s.closingBalance || 0,
                };
            });
    }, [sessions, movements]);

    // Calculate theoretical balance
    const theoreticalBalance = getCurrentBalance();
    const dailyTargets = getDailyProvisionTarget();

    const formatDate = (date: Date) =>
        date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const formatDateShort = (date: Date) =>
        date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');

    const formatTime = (date: Date) =>
        date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    // Print function
    const handlePrint = () => {
        setIsPrinting(true);
        setTimeout(() => {
            window.print();
            setIsPrinting(false);
        }, 100);
    };

    // Export PDF function - creates downloadable HTML file
    const handleExportPDF = async () => {
        setIsExporting(true);

        try {
            const storeName = storeSettings.name || 'Bonilo';
            const dateStr = formatDateShort(new Date());
            const filename = `RapportZ_${dateStr}_${storeName.replace(/\s+/g, '-')}`;

            // Build the complete HTML report
            const reportHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport Z - ${dateStr}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #3D7C4F;
            --primary-light: #E8F0FE;
            --success: #34C759;
            --success-light: #EBF7EE;
            --warning: #FBBC04;
            --danger: #EA4335;
            --text-dark: #1F2937;
            --text-gray: #6B7280;
            --text-light: #9CA3AF;
            --bg-light: #F9FAFB;
            --border: #E5E7EB;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', -apple-system, sans-serif; 
            background: #F3F4F6; 
            color: var(--text-dark);
            line-height: 1.5;
            -webkit-print-color-adjust: exact;
        }

        .page {
            max-width: 800px;
            margin: 40px auto;
            background: white;
            min-height: 297mm;
            padding: 50px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            position: relative;
            overflow: hidden;
            border-radius: 12px;
        }

        .gradient-top {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 8px;
            background: linear-gradient(to right, var(--primary), var(--success));
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 1px solid var(--border);
        }

        .brand h1 {
            font-size: 24px;
            font-weight: 800;
            color: var(--primary);
            letter-spacing: -0.5px;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .brand .subtitle {
            color: var(--text-gray);
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
        }

        .report-info { text-align: right; }
        .report-info .title {
            font-size: 14px;
            font-weight: 700;
            color: var(--text-gray);
            margin-bottom: 4px;
            text-transform: uppercase;
        }
        .report-info .date { font-size: 16px; font-weight: 600; color: var(--text-dark); }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        }

        .metric-card {
            background: var(--bg-light);
            padding: 24px;
            border-radius: 16px;
            border: 1px solid var(--border);
        }
        .metric-card .label {
            font-size: 12px;
            font-weight: 600;
            color: var(--text-gray);
            text-transform: uppercase;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .metric-card .value {
            font-size: 24px;
            font-weight: 800;
            color: var(--text-dark);
        }
        .metric-card.highlight {
            background: var(--primary-light);
            border-color: rgba(66, 133, 244, 0.2);
        }
        .metric-card.highlight .value { color: var(--primary); }

        .section-title {
            font-size: 14px;
            font-weight: 700;
            color: var(--text-gray);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .section-title::after {
            content: '';
            flex: 1;
            height: 1px;
            background: var(--border);
        }

        .table-container { margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 12px; color: var(--text-gray); font-size: 12px; font-weight: 600; border-bottom: 1px solid var(--border); }
        td { padding: 16px 12px; border-bottom: 1px solid var(--bg-light); font-size: 14px; }
        .row-label { font-weight: 500; color: var(--text-dark); }
        .row-value { font-weight: 600; text-align: right; }
        .row-value.positive { color: var(--success); }
        .row-value.negative { color: var(--danger); }

        .balance-footer {
            margin-top: 40px;
            padding: 30px;
            background: var(--text-dark);
            border-radius: 20px;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .balance-footer .label { font-size: 16px; font-weight: 500; opacity: 0.8; }
        .balance-footer .amount { font-size: 32px; font-weight: 800; }

        .footer-note {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding-top: 20px;
            border-top: 1px solid var(--border);
        }
        .signature-box { width: 180px; text-align: center; }
        .signature-line { border-top: 1px solid var(--text-light); margin-top: 40px; padding-top: 8px; font-size: 11px; color: var(--text-gray); }
        .legal { font-size: 11px; color: var(--text-light); max-width: 300px; }

        @media print {
            body { background: white; }
            .page { margin: 0; box-shadow: none; border-radius: 0; width: 100%; }
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="gradient-top"></div>
        
        <div class="header">
            <div class="brand">
                <h1>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    ASGARD PRO
                </h1>
                <div class="subtitle">${storeName}</div>
            </div>
            <div class="report-info">
                <div class="title">Rapport Z de Clôture</div>
                <div class="date">${formatDate(new Date())}</div>
                <div class="date" style="font-size: 12px; margin-top: 4px; opacity: 0.7;">Généré à ${formatTime(new Date())}</div>
            </div>
        </div>

        ${todayReport ? `
        <div class="summary-grid">
            <div class="metric-card highlight">
                <div class="label">Ventes Totales</div>
                <div class="value">${formatCurrency(todayReport.totalSales)}</div>
            </div>
            <div class="metric-card">
                <div class="label">Volume Transactions</div>
                <div class="value">${todayReport.salesCount} Tickets</div>
            </div>
            <div class="metric-card">
                <div class="label">Panier Moyen</div>
                <div class="value">${formatCurrency(todayReport.averageTicket)}</div>
            </div>
        </div>

        <div class="section-title">Analyse Financière</div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th style="width: 70%">Désignation</th>
                        <th style="text-align: right">Montant (DA)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="row-label">Fond de Caisse (Ouverture)</td>
                        <td class="row-value">${formatCurrency(todayReport.openingBalance)}</td>
                    </tr>
                    <tr>
                        <td class="row-label">Ventes Espèces</td>
                        <td class="row-value positive">+ ${formatCurrency(todayReport.cashSales)}</td>
                    </tr>
                    <tr>
                        <td class="row-label">Ventes Carte (CIB)</td>
                        <td class="row-value positive">+ ${formatCurrency(todayReport.cardSales)}</td>
                    </tr>
                    <tr>
                        <td class="row-label">Ventes Dahabia</td>
                        <td class="row-value positive">+ ${formatCurrency(todayReport.dahabiaSales)}</td>
                    </tr>
                    <tr>
                        <td class="row-label">Ventes à Crédit</td>
                        <td class="row-value positive">+ ${formatCurrency(todayReport.creditSales)}</td>
                    </tr>
                    <tr>
                        <td class="row-label">Autres Entrées (Dépôts)</td>
                        <td class="row-value positive">+ ${formatCurrency(todayReport.deposits)}</td>
                    </tr>
                    <tr>
                        <td class="row-label">Remboursements Articles</td>
                        <td class="row-value negative">- ${formatCurrency(todayReport.refunds)}</td>
                    </tr>
                    <tr>
                        <td class="row-label">Dépenses de Caisse</td>
                        <td class="row-value negative">- ${formatCurrency(todayReport.expenses)}</td>
                    </tr>
                    <tr>
                        <td class="row-label">Retraits Ponctualisés</td>
                        <td class="row-value negative">- ${formatCurrency(todayReport.withdrawals)}</td>
                    </tr>
                    <tr>
                        <td class="row-label">Transferts (Coffre & Provisions)</td>
                        <td class="row-value">- ${formatCurrency(todayReport.transfersToSafe + todayReport.transfersToProvisions)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="balance-footer">
            <div>
                <div class="label">SOLDE THÉORIQUE EN CAISSE</div>
                <div style="font-size: 11px; opacity: 0.6; margin-top: 4px;">À vérifier avec le montant réel compté</div>
            </div>
            <div class="amount">${formatCurrency(theoreticalBalance)}</div>
        </div>

        <div class="section-title" style="margin-top: 40px;">État des Réserves & Fonds</div>
        <div class="summary-grid" style="grid-template-columns: repeat(2, 1fr); margin-bottom: 20px;">
            <div class="metric-card">
                <div class="label">🔒 Coffre Fort</div>
                <div class="value" style="font-size: 20px;">${formatCurrency(safeBalance)}</div>
            </div>
            ${sinkingFunds.map(fund => `
                <div class="metric-card">
                    <div class="label">${fund.icon} ${fund.name}</div>
                    <div class="value" style="font-size: 20px;">${formatCurrency(fund.currentBalance)}</div>
                    <div style="font-size: 11px; color: var(--text-gray); margin-top: 4px;">Objectif: ${formatCurrency(fund.targetAmount)}</div>
                </div>
            `).join('')}
        </div>
        ` : `
        <div style="text-align: center; padding: 100px 0; color: var(--text-gray);">
            <p>Aucune donnée disponible pour cette session.</p>
        </div>
        `}

        <div class="footer-note">
            <div class="legal">
                Ce document est un rapport officiel de clôture de journée généré par Asgard Pro. 
                Il doit être conservé pour la comptabilité et les audits de caisse.
                <br><br>
                <strong>Boutique:</strong> ${storeSettings.name || 'Bonilo'} | <strong>Opérateur:</strong> ${todayReport?.cashierName || 'Admin'}
            </div>
            <div class="signature-box">
                <div class="signature-line">Signature du Caissier</div>
            </div>
            <div class="signature-box">
                <div class="signature-line">Validation Responsable</div>
            </div>
        </div>
    </div>
</body>
</html>`;

            // Create a Blob and download it
            const blob = new Blob([reportHTML], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${filename}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            // Also open for printing (user can save as PDF from print dialog)
            const printWindow = window.open('', '_blank', 'width=800,height=900');
            if (printWindow) {
                printWindow.document.write(reportHTML);
                printWindow.document.close();
                setTimeout(() => {
                    printWindow.print();
                    // printWindow.close(); // Don't close immediately so they can see the result if print fails
                }, 800);
            }
        } catch (error) {
            console.error('Error exporting PDF:', error);
            toast.error('Erreur lors de l\'export');
        } finally {
            setIsExporting(false);
        }
    };


    // Handle close with atomic transfers
    const handleClose = async () => {
        const amount = parseFloat(closingAmount);
        if (isNaN(amount) || amount < 0) return;

        const safeAmount = parseFloat(transferToSafe) || 0;
        const salariesAmount = parseFloat(transferSalaries) || 0;
        const bankCreditAmount = parseFloat(transferBankCredit) || 0;
        const chargesAmount = parseFloat(transferCharges) || 0;

        try {
            await closeSessionWithTransfers(
                amount,
                closingNotes,
                {
                    safe: safeAmount,
                    funds: {
                        salaries: salariesAmount,
                        bankCredit: bankCreditAmount,
                        fixedCharges: chargesAmount,
                    },
                },
                userName
            );

            toast.success('Session clôturée avec succès');
            setShowCloseModal(false);
            setClosingAmount('');
            setClosingNotes('');
            setTransferToSafe('');
            setTransferSalaries('');
            setTransferBankCredit('');
            setTransferCharges('');
        } catch (err) {
            console.error('Error closing session:', err);
            toast.error(commandErrorMessage(err, 'Erreur lors de la clôture de session'));
        }
    };

    // No session state
    if (!currentSession && sessions.length === 0) {
        return (
            <div className={styles.zReport}>
                <div className={styles.emptyState}>
                    <FileBarChart size={64} />
                    <h3>Aucune session de caisse</h3>
                    <p>Ouvrez une session de caisse pour générer un rapport Z</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.zReport}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h2><FileBarChart size={24} /> Rapport Z - Clôture de journée</h2>
                    <span className={styles.date}>{formatDate(new Date())}</span>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.printBtn} onClick={handlePrint} disabled={isPrinting}>
                        <Printer size={18} /> {isPrinting ? 'Impression...' : 'Imprimer'}
                    </button>
                    <button className={styles.downloadBtn} onClick={handleExportPDF} disabled={isExporting}>
                        <Download size={18} /> {isExporting ? 'Export...' : 'Exporter PDF'}
                    </button>
                    {currentSession?.status === 'open' && (
                        <button className={styles.closeBtn} onClick={() => setShowCloseModal(true)}>
                            <Lock size={18} /> Clôturer la journée
                        </button>
                    )}
                </div>
            </div>

            {/* Status Banner */}
            {currentSession ? (
                <div className={`${styles.statusBanner} ${currentSession.status === 'open' ? styles.open : styles.closed}`}>
                    {currentSession.status === 'open' ? (
                        <>
                            <Clock size={20} />
                            <span>Journée en cours depuis {formatTime(new Date(currentSession.openedAt))} - Ouverte par {currentSession.cashierName}</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle size={20} />
                            <span>Journée clôturée</span>
                        </>
                    )}
                </div>
            ) : (
                <div className={`${styles.statusBanner} ${styles.closed}`}>
                    <CheckCircle size={20} />
                    <span>Dernière session clôturée</span>
                </div>
            )}

            {/* Main Grid - Only show if we have report data */}
            {todayReport && (
                <>
                    <div className={styles.reportGrid}>
                        {/* Sales Summary */}
                        <div className={styles.reportCard}>
                            <h3><ShoppingCart size={18} /> Ventes</h3>
                            <div className={styles.bigNumber}>
                                <span className={styles.value}>{formatCurrency(todayReport.totalSales)}</span>
                                <span className={styles.subtext}>
                                    {todayReport.salesCount} ventes • Ticket moyen: {formatCurrency(todayReport.averageTicket)}
                                </span>
                            </div>
                            <div className={styles.breakdown}>
                                <div className={styles.breakdownRow}>
                                    <span><Banknote size={14} /> Espèces</span>
                                    <span>{formatCurrency(todayReport.cashSales)}</span>
                                </div>
                                {todayReport.cardSales > 0 && (
                                    <div className={styles.breakdownRow}>
                                        <span><CreditCard size={14} /> CIB</span>
                                        <span>{formatCurrency(todayReport.cardSales)}</span>
                                    </div>
                                )}
                                {todayReport.dahabiaSales > 0 && (
                                    <div className={styles.breakdownRow}>
                                        <span><Smartphone size={14} /> Dahabia</span>
                                        <span>{formatCurrency(todayReport.dahabiaSales)}</span>
                                    </div>
                                )}
                                {todayReport.creditSales > 0 && (
                                    <div className={styles.breakdownRow}>
                                        <span><DollarSign size={14} /> Crédit Client</span>
                                        <span>{formatCurrency(todayReport.creditSales)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Refunds */}
                        <div className={styles.reportCard}>
                            <h3><TrendingDown size={18} /> Remboursements</h3>
                            <div className={styles.bigNumber}>
                                <span className={`${styles.value} ${styles.negative}`}>
                                    -{formatCurrency(todayReport.refunds)}
                                </span>
                                <span className={styles.subtext}>{todayReport.refundsCount} remboursement(s)</span>
                            </div>
                        </div>

                        {/* Expenses */}
                        <div className={styles.reportCard}>
                            <h3><TrendingDown size={18} /> Dépenses</h3>
                            <div className={styles.bigNumber}>
                                <span className={`${styles.value} ${styles.negative}`}>
                                    -{formatCurrency(todayReport.expenses)}
                                </span>
                                <span className={styles.subtext}>{todayReport.expensesCount} dépense(s)</span>
                            </div>
                        </div>

                        {/* Cash Movements */}
                        <div className={styles.reportCard}>
                            <h3><DollarSign size={18} /> Mouvements de caisse</h3>
                            <div className={styles.breakdown}>
                                <div className={styles.breakdownRow}>
                                    <span><TrendingUp size={14} /> Dépôts</span>
                                    <span className={styles.positive}>+{formatCurrency(todayReport.deposits)}</span>
                                </div>
                                <div className={styles.breakdownRow}>
                                    <span><TrendingDown size={14} /> Retraits</span>
                                    <span className={styles.negative}>-{formatCurrency(todayReport.withdrawals)}</span>
                                </div>
                                {todayReport.transfersToSafe > 0 && (
                                    <div className={styles.breakdownRow}>
                                        <span><PiggyBank size={14} /> Vers coffre</span>
                                        <span className={styles.neutral}>-{formatCurrency(todayReport.transfersToSafe)}</span>
                                    </div>
                                )}
                                {todayReport.transfersToProvisions > 0 && (
                                    <div className={styles.breakdownRow}>
                                        <span><ArrowRight size={14} /> Vers provisions</span>
                                        <span className={styles.neutral}>-{formatCurrency(todayReport.transfersToProvisions)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Balance Summary */}
                    <div className={styles.balanceSummary}>
                        <div className={styles.balanceRow}>
                            <span>Fond de caisse (ouverture)</span>
                            <span>{formatCurrency(todayReport.openingBalance)}</span>
                        </div>
                        <div className={styles.balanceRow}>
                            <span>+ Ventes espèces</span>
                            <span className={styles.positive}>+{formatCurrency(todayReport.cashSales)}</span>
                        </div>
                        <div className={styles.balanceRow}>
                            <span>+ Dépôts</span>
                            <span className={styles.positive}>+{formatCurrency(todayReport.deposits)}</span>
                        </div>
                        <div className={styles.balanceRow}>
                            <span>- Remboursements</span>
                            <span className={styles.negative}>-{formatCurrency(todayReport.refunds)}</span>
                        </div>
                        <div className={styles.balanceRow}>
                            <span>- Dépenses</span>
                            <span className={styles.negative}>-{formatCurrency(todayReport.expenses)}</span>
                        </div>
                        <div className={styles.balanceRow}>
                            <span>- Retraits</span>
                            <span className={styles.negative}>-{formatCurrency(todayReport.withdrawals)}</span>
                        </div>
                        <div className={styles.balanceRow}>
                            <span>- Transferts (coffre + provisions)</span>
                            <span className={styles.neutral}>
                                -{formatCurrency(todayReport.transfersToSafe + todayReport.transfersToProvisions)}
                            </span>
                        </div>
                        <div className={`${styles.balanceRow} ${styles.total}`}>
                            <span>= Solde théorique en caisse</span>
                            <span>{formatCurrency(theoreticalBalance)}</span>
                        </div>
                    </div>
                </>
            )}

            {/* Provisions Status */}
            <div className={styles.provisionsStatus}>
                <h3><PiggyBank size={18} /> État des réserves</h3>
                <div className={styles.provisionsGrid}>
                    <div className={styles.provisionItem}>
                        <span>🔒 Coffre</span>
                        <strong>{formatCurrency(safeBalance)}</strong>
                    </div>
                    {sinkingFunds.map(fund => (
                        <div key={fund.id} className={styles.provisionItem}>
                            <span>{fund.icon} {fund.name}</span>
                            <strong>{formatCurrency(fund.currentBalance)}</strong>
                            <small>/ {formatCurrency(fund.targetAmount)}</small>
                        </div>
                    ))}
                </div>
            </div>

            {/* Past Reports */}
            {pastReports.length > 0 && (
                <div className={styles.pastReports}>
                    <h3>Historique des clôtures</h3>
                    <div className={styles.reportsList}>
                        {pastReports.map(report => (
                            <div key={report.id} className={styles.pastReportRow}>
                                <div className={styles.reportDate}>
                                    <Calendar size={16} />
                                    {formatDate(report.date)}
                                </div>
                                <div className={styles.reportStats}>
                                    <span>{report.salesCount} ventes</span>
                                    <span className={styles.highlight}>{formatCurrency(report.totalSales)}</span>
                                </div>
                                <div className={styles.reportDiff}>
                                    {report.difference === 0 ? (
                                        <span className={styles.balanced}><CheckCircle size={14} /> Équilibré</span>
                                    ) : report.difference > 0 ? (
                                        <span className={styles.surplus}><TrendingUp size={14} /> +{report.difference} DA</span>
                                    ) : (
                                        <span className={styles.deficit}><AlertTriangle size={14} /> {report.difference} DA</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Close Modal */}
            {showCloseModal && (
                <div className={styles.overlay} onClick={() => setShowCloseModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Clôturer la journée</h2>
                        </div>
                        <div className={styles.modalBody}>
                            {todayReport && (
                                <div className={styles.summaryBox}>
                                    <p><strong>Solde théorique:</strong> {formatCurrency(theoreticalBalance)}</p>
                                    <p><strong>Ventes du jour:</strong> {formatCurrency(todayReport.totalSales)}</p>
                                    <p><strong>Nombre de ventes:</strong> {todayReport.salesCount}</p>
                                </div>
                            )}

                            <div className={styles.formGroup}>
                                <label>Montant réel compté en caisse (DA)</label>
                                <input
                                    type="number"
                                    value={closingAmount}
                                    onChange={(e) => setClosingAmount(e.target.value)}
                                    placeholder={theoreticalBalance.toString()}
                                    autoFocus
                                />
                            </div>

                            {closingAmount && (
                                <div className={`${styles.diffResult} ${parseFloat(closingAmount) === theoreticalBalance ? styles.ok :
                                    Math.abs(parseFloat(closingAmount) - theoreticalBalance) <= 100 ? styles.warn : styles.error
                                    }`}>
                                    Écart: {formatCurrency(parseFloat(closingAmount) - theoreticalBalance)}
                                </div>
                            )}

                            <div className={styles.transfersSection}>
                                <h4>Transferts de fin de journée (optionnel)</h4>
                                <p className={styles.hint}>
                                    Objectif quotidien: {formatCurrency(dailyTargets.total)}
                                </p>

                                <div className={styles.transferRow}>
                                    <span>🔒 Coffre</span>
                                    <input
                                        type="number"
                                        value={transferToSafe}
                                        onChange={(e) => setTransferToSafe(e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                                <div className={styles.transferRow}>
                                    <span>👥 Salaires ({formatCurrency(dailyTargets.salaries)}/j)</span>
                                    <input
                                        type="number"
                                        value={transferSalaries}
                                        onChange={(e) => setTransferSalaries(e.target.value)}
                                        placeholder={dailyTargets.salaries.toString()}
                                    />
                                </div>
                                <div className={styles.transferRow}>
                                    <span>🏦 Crédit ({formatCurrency(dailyTargets.bankCredit)}/j)</span>
                                    <input
                                        type="number"
                                        value={transferBankCredit}
                                        onChange={(e) => setTransferBankCredit(e.target.value)}
                                        placeholder={dailyTargets.bankCredit.toString()}
                                    />
                                </div>
                                <div className={styles.transferRow}>
                                    <span>⚡ Charges ({formatCurrency(dailyTargets.fixedCharges)}/j)</span>
                                    <input
                                        type="number"
                                        value={transferCharges}
                                        onChange={(e) => setTransferCharges(e.target.value)}
                                        placeholder={dailyTargets.fixedCharges.toString()}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Notes (optionnel)</label>
                                <textarea
                                    value={closingNotes}
                                    onChange={(e) => setClosingNotes(e.target.value)}
                                    placeholder="Observations de fin de journée..."
                                    rows={2}
                                />
                            </div>

                            <p className={styles.warning}>
                                <AlertTriangle size={16} />
                                Cette action est irréversible. Assurez-vous d'avoir compté la caisse.
                            </p>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowCloseModal(false)}>Annuler</button>
                            <button
                                className={styles.confirmBtn}
                                onClick={handleClose}
                                disabled={!closingAmount || parseFloat(closingAmount) < 0}
                            >
                                <Lock size={18} /> Clôturer la journée
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ZReport;

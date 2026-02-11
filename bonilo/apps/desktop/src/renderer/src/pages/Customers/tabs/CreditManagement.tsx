import React, { useState, useMemo } from 'react';
import {
    Wallet,
    AlertTriangle,
    Clock,
    CheckCircle,
    Phone,
    Plus,
    DollarSign,
    X,
    Calendar,
} from 'lucide-react';
import { useCustomersStore, type Customer } from '@bonilo/shared/stores';
import { useSettings } from '../../../contexts/SettingsContext';
import { useToast } from '../../../components/feedback/Toast/Toast';
import styles from './CreditManagement.module.css';

export const CreditManagement: React.FC = () => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [paymentAmount, setPaymentAmount] = useState('');

    // Store connections
    const {
        customers,
        transactions,
        updateCredit,
        getCustomersWithCredit,
        getOverdueCustomers,
        getTotalOutstandingCredit,
    } = useCustomersStore();
    const { formatCurrency } = useSettings();
    const toast = useToast();

    const formatDate = (date: Date | string) => new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

    // Derived data
    const customersWithCredit = useMemo(() => getCustomersWithCredit(), [customers]);
    const totalCredit = getTotalOutstandingCredit();
    const overdueCount = getOverdueCustomers(7).length;
    const atLimitCount = customers.filter(c => c.currentCredit >= c.creditLimit).length;

    // Calculate days since last payment
    const getDaysOverdue = (customer: Customer): number => {
        if (customer.currentCredit <= 0) return 0;
        if (!customer.lastPaymentDate) return 999; // Never paid
        const lastPayment = new Date(customer.lastPaymentDate);
        return Math.floor((new Date().getTime() - lastPayment.getTime()) / (1000 * 60 * 60 * 24));
    };

    const getStatusClass = (customer: Customer) => {
        if (customer.currentCredit >= customer.creditLimit) return styles.critical;
        const daysOverdue = getDaysOverdue(customer);
        if (daysOverdue > 14) return styles.overdue;
        if (daysOverdue > 7) return styles.warning;
        return '';
    };

    const handlePayment = (customer: Customer) => {
        setSelectedCustomer(customer);
        setPaymentAmount('');
        setShowPaymentModal(true);
    };

    const confirmPayment = () => {
        if (!selectedCustomer || !paymentAmount) return;
        const amount = parseFloat(paymentAmount);
        if (isNaN(amount) || amount <= 0) return;

        // Negative amount for payment (reduces debt)
        updateCredit(selectedCustomer.id, -amount, 'payment', undefined, 'Règlement espèces');
        toast.success(`Paiement de ${formatCurrency(amount)} enregistré pour ${selectedCustomer.name}`);
        setShowPaymentModal(false);
        setSelectedCustomer(null);
        setPaymentAmount('');
    };

    return (
        <div className={styles.creditManagement}>
            {/* Summary */}
            <div className={styles.summaryRow}>
                <div className={styles.summaryCard}>
                    <Wallet size={24} />
                    <div>
                        <span className={styles.summaryValue}>{formatCurrency(totalCredit)}</span>
                        <span className={styles.summaryLabel}>Crédit total en cours</span>
                    </div>
                </div>
                <div className={`${styles.summaryCard} ${styles.warning}`}>
                    <Clock size={24} />
                    <div>
                        <span className={styles.summaryValue}>{overdueCount}</span>
                        <span className={styles.summaryLabel}>En retard (+7 jours)</span>
                    </div>
                </div>
                <div className={`${styles.summaryCard} ${styles.danger}`}>
                    <AlertTriangle size={24} />
                    <div>
                        <span className={styles.summaryValue}>{atLimitCount}</span>
                        <span className={styles.summaryLabel}>Limite atteinte</span>
                    </div>
                </div>
            </div>

            {/* Credit List */}
            <div className={styles.creditList}>
                <div className={styles.listHeader}>
                    <span>Client</span>
                    <span>Solde</span>
                    <span>Limite</span>
                    <span>Utilisation</span>
                    <span>Dernier paiement</span>
                    <span>Action</span>
                </div>
                {customersWithCredit.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>Aucun client avec crédit en cours</p>
                    </div>
                ) : (
                    customersWithCredit.map(customer => {
                        const daysOverdue = getDaysOverdue(customer);
                        return (
                            <div key={customer.id} className={`${styles.creditRow} ${getStatusClass(customer)}`}>
                                <div className={styles.customerInfo}>
                                    <span className={styles.customerName}>{customer.name}</span>
                                    <span className={styles.customerPhone}><Phone size={12} /> {customer.phone}</span>
                                </div>
                                <div className={styles.balance}>
                                    <span className={styles.balanceValue}>{formatCurrency(customer.currentCredit)}</span>
                                </div>
                                <div className={styles.limit}>
                                    {formatCurrency(customer.creditLimit)}
                                </div>
                                <div className={styles.usage}>
                                    <div className={styles.usageBar}>
                                        <div
                                            className={styles.usageFill}
                                            style={{
                                                width: `${Math.min((customer.currentCredit / customer.creditLimit) * 100, 100)}%`,
                                                background: customer.currentCredit >= customer.creditLimit ? 'var(--color-danger)' :
                                                    customer.currentCredit > customer.creditLimit * 0.8 ? 'var(--color-warning)' : 'var(--color-success)'
                                            }}
                                        ></div>
                                    </div>
                                    <span>{Math.round((customer.currentCredit / customer.creditLimit) * 100)}%</span>
                                </div>
                                <div className={styles.lastPayment}>
                                    {customer.lastPaymentDate ? (
                                        <>
                                            <Calendar size={12} /> {formatDate(customer.lastPaymentDate)}
                                            {daysOverdue > 7 && (
                                                <span className={styles.overdueBadge}>+{daysOverdue}j</span>
                                            )}
                                        </>
                                    ) : (
                                        <span className={styles.neverPaid}>Jamais</span>
                                    )}
                                </div>
                                <div className={styles.actions}>
                                    <button className={styles.payBtn} onClick={() => handlePayment(customer)}>
                                        <DollarSign size={14} /> Encaisser
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Payment Modal */}
            {showPaymentModal && selectedCustomer && (
                <div className={styles.overlay} onClick={() => setShowPaymentModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Enregistrer un paiement</h2>
                            <button onClick={() => setShowPaymentModal(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.paymentInfo}>
                                <p><strong>Client:</strong> {selectedCustomer.name}</p>
                                <p><strong>Solde actuel:</strong>
                                    <span className={styles.currentBalance}>{formatCurrency(selectedCustomer.currentCredit)}</span>
                                </p>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Montant du paiement (DA)</label>
                                <input
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    placeholder="0"
                                    autoFocus
                                />
                            </div>
                            {paymentAmount && (
                                <div className={styles.newBalance}>
                                    Nouveau solde: <strong>{formatCurrency(selectedCustomer.currentCredit - parseFloat(paymentAmount || '0'))}</strong>
                                </div>
                            )}
                            <div className={styles.quickAmounts}>
                                {[1000, 2000, 5000, 10000].map(amount => (
                                    <button
                                        key={amount}
                                        onClick={() => setPaymentAmount(amount.toString())}
                                        className={paymentAmount === amount.toString() ? styles.selected : ''}
                                    >
                                        {formatCurrency(amount)}
                                    </button>
                                ))}
                                <button onClick={() => setPaymentAmount(selectedCustomer.currentCredit.toString())}>
                                    Tout payer
                                </button>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowPaymentModal(false)}>Annuler</button>
                            <button className={styles.confirmBtn} onClick={confirmPayment}>
                                <CheckCircle size={18} /> Confirmer le paiement
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreditManagement;

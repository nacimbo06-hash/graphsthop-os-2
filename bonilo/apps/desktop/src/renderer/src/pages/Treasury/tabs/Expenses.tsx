import React, { useState, useMemo } from 'react';
import {
    Search,
    Plus,
    Receipt,
    Calendar,
    Trash2,
    X,
    Check,
    FileText,
    ShoppingBag,
    Truck,
    Zap,
    Home,
    Wrench,
    Users,
    Briefcase,
    CreditCard,
    Banknote,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import { useTreasuryStore, type Expense } from '@bonilo/shared/stores';
import { useSettings } from '../../../contexts/SettingsContext';
import { useToast } from '../../../components/feedback/Toast';
import { commandErrorMessage } from '../../../utils/commandError';
import { ConfirmModal } from '../../../components/feedback/ConfirmModal';
import styles from './Expenses.module.css';

const EXPENSE_CATEGORIES = [
    { id: 'supplies', name: 'Fournitures', icon: '📦', emoji: <ShoppingBag size={20} /> },
    { id: 'utilities', name: 'Charges', icon: '⚡', emoji: <Zap size={20} /> },
    { id: 'rent', name: 'Loyer', icon: '🏠', emoji: <Home size={20} /> },
    { id: 'transport', name: 'Transport', icon: '🚛', emoji: <Truck size={20} /> },
    { id: 'maintenance', name: 'Entretien', icon: '🔧', emoji: <Wrench size={20} /> },
    { id: 'salary', name: 'Salaires', icon: '👥', emoji: <Users size={20} /> },
    { id: 'admin', name: 'Administratif', icon: '📋', emoji: <Briefcase size={20} /> },
    { id: 'other', name: 'Autres', icon: '📄', emoji: <FileText size={20} /> },
];

export const Expenses: React.FC = () => {
    const { formatCurrency } = useSettings();
    const toast = useToast();

    const {
        expenses,
        addExpense,
        markExpenseAsPaid,
        deleteExpense,
        sinkingFunds,
        safeBalance,
    } = useTreasuryStore();

    // UI state
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'unpaid'>('all');
    const [showNewModal, setShowNewModal] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

    // Form state
    const [newExpense, setNewExpense] = useState({
        description: '',
        amount: '',
        category: 'supplies',
        paymentMethod: 'cash' as 'cash' | 'bank' | 'check',
        reference: '',
    });

    // Calculated values
    const totalExpenses = useMemo(() =>
        expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);

    const unpaidExpenses = useMemo(() =>
        expenses.filter(e => !e.isPaid), [expenses]);

    const paidExpenses = useMemo(() =>
        expenses.filter(e => e.isPaid), [expenses]);

    const categoryTotals = useMemo(() =>
        EXPENSE_CATEGORIES.map(cat => ({
            ...cat,
            total: expenses.filter(e => e.category === cat.id).reduce((sum, e) => sum + e.amount, 0),
            count: expenses.filter(e => e.category === cat.id).length,
        })).filter(cat => cat.total > 0), [expenses]);

    // Month totals
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyTotal = useMemo(() =>
        expenses
            .filter(e => {
                const date = new Date(e.date);
                return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            })
            .reduce((sum, e) => sum + e.amount, 0), [expenses, currentMonth, currentYear]);

    // Filter expenses
    const filteredExpenses = useMemo(() =>
        expenses.filter(e => {
            const matchesSearch = e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (e.reference?.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = filterCategory === 'all' || e.category === filterCategory;
            const matchesStatus = filterStatus === 'all' ||
                (filterStatus === 'paid' && e.isPaid) ||
                (filterStatus === 'unpaid' && !e.isPaid);
            return matchesSearch && matchesCategory && matchesStatus;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        [expenses, searchQuery, filterCategory, filterStatus]);

    const getCategoryInfo = (categoryId: string) => {
        return EXPENSE_CATEGORIES.find(c => c.id === categoryId) || EXPENSE_CATEGORIES[7];
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const handleAddExpense = async () => {
        if (!newExpense.description || !newExpense.amount) return;

        try {
            await addExpense({
                description: newExpense.description,
                amount: parseFloat(newExpense.amount),
                category: newExpense.category,
                date: new Date().toISOString().split('T')[0],
                paymentMethod: newExpense.paymentMethod,
                reference: newExpense.reference || undefined,
            });
        } catch (err) {
            toast.error(commandErrorMessage(err, 'Échec de l\'enregistrement de la dépense'));
            return;
        }

        setNewExpense({ description: '', amount: '', category: 'supplies', paymentMethod: 'cash', reference: '' });
        setShowNewModal(false);
    };

    const handleMarkAsPaid = async (paidFrom: 'cash' | 'safe' | 'provision') => {
        if (!selectedExpense) return;
        try {
            await markExpenseAsPaid(selectedExpense.id, paidFrom);
        } catch (err) {
            toast.error(commandErrorMessage(err, 'Échec du marquage comme payé'));
            return;
        }
        setShowPayModal(false);
        setSelectedExpense(null);
    };

    // Handle delete
    const handleDeleteExpense = (id: string) => {
        setExpenseToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (expenseToDelete) {
            try {
                await deleteExpense(expenseToDelete);
            } catch (err) {
                toast.error(commandErrorMessage(err, 'Échec de la suppression'));
            }
        }
        setShowDeleteConfirm(false);
        setExpenseToDelete(null);
    };

    // Open pay modal
    const openPayModal = (expense: Expense) => {
        setSelectedExpense(expense);
        setShowPayModal(true);
    };

    // Get available funds for payment
    const getSalariesFund = sinkingFunds.find(f => f.category === 'salaries');
    const getChargesFund = sinkingFunds.find(f => f.category === 'fixedCharges');

    return (
        <div className={styles.expenses}>
            {/* Summary Row */}
            <div className={styles.summaryRow}>
                <div className={styles.summaryCard}>
                    <div className={styles.expenseIcon}>
                        <Receipt size={24} />
                    </div>
                    <div>
                        <span className={styles.summaryLabel}>Total des dépenses</span>
                        <span className={styles.summaryValue}>{formatCurrency(totalExpenses)}</span>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.monthIcon}>
                        <Calendar size={24} />
                    </div>
                    <div>
                        <span className={styles.summaryLabel}>Ce mois-ci</span>
                        <span className={styles.summaryValue}>{formatCurrency(monthlyTotal)}</span>
                    </div>
                </div>
                <div className={styles.statusCards}>
                    <div className={`${styles.statusCard} ${styles.unpaid}`}>
                        <AlertCircle size={18} />
                        <span>{unpaidExpenses.length} impayées</span>
                        <strong>{formatCurrency(unpaidExpenses.reduce((s, e) => s + e.amount, 0))}</strong>
                    </div>
                    <div className={`${styles.statusCard} ${styles.paid}`}>
                        <CheckCircle size={18} />
                        <span>{paidExpenses.length} payées</span>
                    </div>
                </div>
            </div>

            {/* Categories Breakdown */}
            {categoryTotals.length > 0 && (
                <div className={styles.categoriesBreakdown}>
                    {categoryTotals.slice(0, 5).map(cat => (
                        <div key={cat.id} className={styles.categoryChip}>
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                            <strong>{formatCurrency(cat.total)}</strong>
                        </div>
                    ))}
                </div>
            )}

            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher une dépense..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="all">Toutes les catégories</option>
                    {EXPENSE_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                    ))}
                </select>
                <div className={styles.statusFilter}>
                    <button
                        className={filterStatus === 'all' ? styles.active : ''}
                        onClick={() => setFilterStatus('all')}
                    >
                        Toutes
                    </button>
                    <button
                        className={filterStatus === 'unpaid' ? styles.active : ''}
                        onClick={() => setFilterStatus('unpaid')}
                    >
                        Impayées
                    </button>
                    <button
                        className={filterStatus === 'paid' ? styles.active : ''}
                        onClick={() => setFilterStatus('paid')}
                    >
                        Payées
                    </button>
                </div>
                <button className={styles.newBtn} onClick={() => setShowNewModal(true)}>
                    <Plus size={18} />
                    Nouvelle dépense
                </button>
            </div>

            {/* Expenses List */}
            <div className={styles.expensesList}>
                {filteredExpenses.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Receipt size={48} />
                        <p>Aucune dépense trouvée</p>
                    </div>
                ) : (
                    filteredExpenses.map(expense => {
                        const category = getCategoryInfo(expense.category);
                        return (
                            <div key={expense.id} className={`${styles.expenseCard} ${expense.isPaid ? styles.paid : ''}`}>
                                <div className={styles.expenseLeft}>
                                    <div className={styles.categoryIcon}>{category.icon}</div>
                                    <div className={styles.expenseInfo}>
                                        <span className={styles.expenseDesc}>{expense.description}</span>
                                        <span className={styles.expenseMeta}>
                                            <Calendar size={12} />
                                            {formatDate(expense.date)}
                                            {expense.reference && ` • ${expense.reference}`}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.expenseRight}>
                                    <span className={styles.expenseAmount}>-{formatCurrency(expense.amount)}</span>
                                    <span className={`${styles.paymentBadge} ${styles[expense.paymentMethod]}`}>
                                        {expense.paymentMethod === 'cash' ? 'Espèces' : expense.paymentMethod === 'bank' ? 'Virement' : 'Chèque'}
                                    </span>
                                </div>
                                <div className={styles.expenseStatus}>
                                    {expense.isPaid ? (
                                        <span className={styles.paidBadge}>
                                            <CheckCircle size={14} /> Payée
                                            {expense.paidFrom && ` (${expense.paidFrom === 'safe' ? 'Coffre' : expense.paidFrom === 'provision' ? 'Provision' : 'Caisse'})`}
                                        </span>
                                    ) : (
                                        <button
                                            className={styles.payBtn}
                                            onClick={() => openPayModal(expense)}
                                        >
                                            <CreditCard size={14} /> Payer
                                        </button>
                                    )}
                                </div>
                                <div className={styles.expenseActions}>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleDeleteExpense(expense.id)}
                                        title="Supprimer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* MODALS */}

            {/* New Expense Modal */}
            {showNewModal && (
                <div className={styles.overlay} onClick={() => setShowNewModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Nouvelle dépense</h2>
                            <button onClick={() => setShowNewModal(false)}><X size={20} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label>Description</label>
                                <input
                                    type="text"
                                    value={newExpense.description}
                                    onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
                                    placeholder="Ex: Facture électricité"
                                    autoFocus
                                />
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Montant (DA)</label>
                                    <input
                                        type="number"
                                        value={newExpense.amount}
                                        onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                                        placeholder="0"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Mode de paiement</label>
                                    <select
                                        value={newExpense.paymentMethod}
                                        onChange={e => setNewExpense({ ...newExpense, paymentMethod: e.target.value as 'cash' | 'bank' | 'check' })}
                                    >
                                        <option value="cash">Espèces</option>
                                        <option value="bank">Virement</option>
                                        <option value="check">Chèque</option>
                                    </select>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Catégorie</label>
                                <div className={styles.categoryGrid}>
                                    {EXPENSE_CATEGORIES.map(cat => (
                                        <button
                                            key={cat.id}
                                            className={`${styles.categoryBtn} ${newExpense.category === cat.id ? styles.selected : ''}`}
                                            onClick={() => setNewExpense({ ...newExpense, category: cat.id })}
                                        >
                                            <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                                            <span>{cat.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Référence (optionnel)</label>
                                <input
                                    type="text"
                                    value={newExpense.reference}
                                    onChange={e => setNewExpense({ ...newExpense, reference: e.target.value })}
                                    placeholder="Ex: FAC-2026-001"
                                />
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowNewModal(false)}>Annuler</button>
                            <button
                                className={styles.confirmBtn}
                                onClick={handleAddExpense}
                                disabled={!newExpense.description || !newExpense.amount}
                            >
                                <Check size={18} />
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pay Modal */}
            {showPayModal && selectedExpense && (
                <div className={styles.overlay} onClick={() => setShowPayModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Payer la dépense</h2>
                            <button onClick={() => setShowPayModal(false)}><X size={20} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.expensePreview}>
                                <span>{getCategoryInfo(selectedExpense.category).icon}</span>
                                <div>
                                    <strong>{selectedExpense.description}</strong>
                                    <span className={styles.previewAmount}>{formatCurrency(selectedExpense.amount)}</span>
                                </div>
                            </div>

                            <p className={styles.hint}>Choisissez la source de paiement:</p>

                            <div className={styles.paymentOptions}>
                                <button
                                    className={styles.paymentOption}
                                    onClick={() => handleMarkAsPaid('cash')}
                                >
                                    <Banknote size={24} />
                                    <div>
                                        <span>Caisse</span>
                                        <small>Payer depuis la caisse</small>
                                    </div>
                                </button>
                                <button
                                    className={styles.paymentOption}
                                    onClick={() => handleMarkAsPaid('safe')}
                                    disabled={safeBalance < selectedExpense.amount}
                                >
                                    <Receipt size={24} />
                                    <div>
                                        <span>Coffre ({formatCurrency(safeBalance)})</span>
                                        <small>{safeBalance >= selectedExpense.amount ? 'Disponible' : 'Insuffisant'}</small>
                                    </div>
                                </button>
                                {selectedExpense.category === 'salary' && getSalariesFund && (
                                    <button
                                        className={styles.paymentOption}
                                        onClick={() => handleMarkAsPaid('provision')}
                                        disabled={getSalariesFund.currentBalance < selectedExpense.amount}
                                    >
                                        <Users size={24} />
                                        <div>
                                            <span>Provision Salaires ({formatCurrency(getSalariesFund.currentBalance)})</span>
                                            <small>{getSalariesFund.currentBalance >= selectedExpense.amount ? 'Disponible' : 'Insuffisant'}</small>
                                        </div>
                                    </button>
                                )}
                                {['utilities', 'rent'].includes(selectedExpense.category) && getChargesFund && (
                                    <button
                                        className={styles.paymentOption}
                                        onClick={() => handleMarkAsPaid('provision')}
                                        disabled={getChargesFund.currentBalance < selectedExpense.amount}
                                    >
                                        <Zap size={24} />
                                        <div>
                                            <span>Provision Charges ({formatCurrency(getChargesFund.currentBalance)})</span>
                                            <small>{getChargesFund.currentBalance >= selectedExpense.amount ? 'Disponible' : 'Insuffisant'}</small>
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowPayModal(false)}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Supprimer la dépense"
                message="Êtes-vous sûr de vouloir supprimer cette dépense ?"
                confirmText="Supprimer"
                cancelText="Annuler"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </div>
    );
};

export default Expenses;

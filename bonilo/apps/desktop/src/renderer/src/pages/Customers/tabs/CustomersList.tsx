import React, { useState } from 'react';
import {
    Search,
    Phone,
    Mail,
    MapPin,
    Star,
    Eye,
    Edit,
    Trash2,
    CreditCard,
    ShoppingBag,
    Calendar,
    X,
    UserPlus,
    Save,
} from 'lucide-react';
import { useCustomersStore, type Customer } from '@bonilo/shared/stores';
import { useSettings } from '../../../contexts/SettingsContext';
import { useToast } from '../../../components/feedback/Toast';
import { commandErrorMessage } from '../../../utils/commandError';
import { ConfirmModal } from '../../../components/feedback/ConfirmModal';
import styles from './CustomersList.module.css';

export const CustomersList: React.FC = () => {
    const { formatCurrency } = useSettings();
    const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomersStore();
    const toast = useToast();

    const [searchQuery, setSearchQuery] = useState('');
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentNotes, setPaymentNotes] = useState('');
    const { updateCredit } = useCustomersStore();

    // Form state for add/edit
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        creditLimit: 50000,
    });

    const formatDate = (date: string | null) => {
        if (!date) return 'Jamais';
        return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    );

    const handleViewCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setShowViewModal(true);
    };

    const handleEditCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setFormData({
            name: customer.name,
            phone: customer.phone,
            email: customer.email || '',
            address: customer.address || '',
            city: customer.city || '',
            creditLimit: customer.creditLimit,
        });
        setShowEditModal(true);
    };

    const handleNewCustomer = () => {
        setSelectedCustomer(null);
        setFormData({
            name: '',
            phone: '',
            email: '',
            address: '',
            city: '',
            creditLimit: 50000,
        });
        setShowEditModal(true);
    };

    const handleSaveCustomer = async () => {
        if (!formData.name.trim() || !formData.phone.trim()) {
            toast.warning('Le nom et le téléphone sont obligatoires');
            return;
        }

        const fields = {
            name: formData.name,
            phone: formData.phone,
            email: formData.email || undefined,
            address: formData.address || undefined,
            city: formData.city || undefined,
            creditLimit: formData.creditLimit,
        };

        try {
            if (selectedCustomer) {
                await updateCustomer(selectedCustomer.id, fields);
                toast.success(`Client "${formData.name}" modifié avec succès`);
            } else {
                await addCustomer(fields);
                toast.success(`Client "${formData.name}" ajouté avec succès`);
            }
        } catch (err) {
            toast.error(commandErrorMessage(err, 'Échec de la sauvegarde du client'));
            return;
        }

        setShowEditModal(false);
        setSelectedCustomer(null);
    };

    const handleDeleteCustomer = (customer: Customer) => {
        setCustomerToDelete(customer);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (customerToDelete) {
            try {
                await deleteCustomer(customerToDelete.id);
                toast.success(`Client "${customerToDelete.name}" supprimé`);
            } catch (err) {
                toast.error(commandErrorMessage(err, 'Échec de la suppression'));
            }
        }
        setShowDeleteConfirm(false);
        setCustomerToDelete(null);
    };

    const handleOpenPayment = () => {
        setPaymentAmount(selectedCustomer?.currentCredit.toString() || '');
        setPaymentNotes('');
        setShowPaymentModal(true);
    };

    const handleSavePayment = () => {
        const amount = parseFloat(paymentAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.warning('Veuillez entrer un montant valide');
            return;
        }

        if (selectedCustomer) {
            // Payment decreases credit, so we pass negative amount
            updateCredit(
                selectedCustomer.id,
                -amount,
                'payment',
                undefined,
                paymentNotes || 'Paiement de crédit'
            );
            toast.success(`Paiement de ${formatCurrency(amount)} enregistré pour ${selectedCustomer.name}`);
            setShowPaymentModal(false);
            setShowViewModal(false);
        }
    };

    return (
        <div className={styles.customersList}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou téléphone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className={styles.addBtn} onClick={handleNewCustomer}>
                    <UserPlus size={18} /> Nouveau client
                </button>
            </div>

            <span className={styles.resultsCount}>{filteredCustomers.length} clients</span>

            {/* Customers Grid */}
            <div className={styles.grid}>
                {filteredCustomers.map(customer => (
                    <div key={customer.id} className={`${styles.customerCard} ${customer.loyaltyPoints >= 5000 ? styles.vip : ''}`}>
                        <div className={styles.cardHeader}>
                            <div className={styles.avatar}>
                                {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            {customer.loyaltyPoints >= 5000 && <Star size={16} className={styles.vipBadge} />}
                        </div>
                        <h3 className={styles.customerName}>{customer.name}</h3>
                        <div className={styles.contactInfo}>
                            <span><Phone size={12} /> {customer.phone}</span>
                            {customer.email && <span><Mail size={12} /> {customer.email}</span>}
                            {customer.city && <span><MapPin size={12} /> {customer.city}</span>}
                        </div>
                        <div className={styles.statsGrid}>
                            <div>
                                <span className={styles.statValue}>{customer.loyaltyPoints}</span>
                                <span className={styles.statLabel}>Points</span>
                            </div>
                            <div>
                                <span className={styles.statValue}>{formatCurrency(customer.currentCredit)}</span>
                                <span className={styles.statLabel}>Crédit</span>
                            </div>
                        </div>
                        {customer.currentCredit > 0 && (
                            <div className={styles.creditAlert}>
                                <CreditCard size={14} /> Crédit: {formatCurrency(customer.currentCredit)}
                            </div>
                        )}
                        <div className={styles.cardFooter}>
                            <span className={styles.lastVisit}>
                                <Calendar size={12} /> Dernière visite: {formatDate(customer.lastVisit)}
                            </span>
                        </div>
                        <div className={styles.cardActions}>
                            <button onClick={() => handleViewCustomer(customer)}><Eye size={14} /> Voir</button>
                            <button onClick={() => handleEditCustomer(customer)}><Edit size={14} /> Modifier</button>
                            <button className={styles.deleteBtn} onClick={() => handleDeleteCustomer(customer)}>
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Customer Detail Modal */}
            {showViewModal && selectedCustomer && (
                <div className={styles.overlay} onClick={() => setShowViewModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalCustomer}>
                                <div className={styles.modalAvatar}>
                                    {selectedCustomer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <div>
                                    <h2>{selectedCustomer.name}</h2>
                                    {selectedCustomer.loyaltyPoints >= 5000 && <span className={styles.vipTag}>⭐ Client VIP</span>}
                                </div>
                            </div>
                            <button onClick={() => setShowViewModal(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.infoSection}>
                                <h4>Informations</h4>
                                <div className={styles.infoGrid}>
                                    <div><Phone size={14} /> {selectedCustomer.phone}</div>
                                    {selectedCustomer.email && <div><Mail size={14} /> {selectedCustomer.email}</div>}
                                    {selectedCustomer.address && <div><MapPin size={14} /> {selectedCustomer.address}</div>}
                                    {selectedCustomer.city && <div><MapPin size={14} /> {selectedCustomer.city}</div>}
                                    <div><Calendar size={14} /> Client depuis {formatDate(selectedCustomer.createdAt)}</div>
                                </div>
                            </div>
                            <div className={styles.statsSection}>
                                <div className={styles.statBox}>
                                    <Star size={20} />
                                    <span className={styles.statBoxValue}>{selectedCustomer.loyaltyPoints}</span>
                                    <span className={styles.statBoxLabel}>Points fidélité</span>
                                </div>
                                <div className={styles.statBox}>
                                    <CreditCard size={20} />
                                    <span className={styles.statBoxValue}>{formatCurrency(selectedCustomer.currentCredit)}</span>
                                    <span className={styles.statBoxLabel}>Crédit en cours</span>
                                </div>
                                <div className={styles.statBox}>
                                    <ShoppingBag size={20} />
                                    <span className={styles.statBoxValue}>{formatCurrency(selectedCustomer.creditLimit)}</span>
                                    <span className={styles.statBoxLabel}>Limite de crédit</span>
                                </div>
                            </div>
                            {selectedCustomer.currentCredit > 0 && (
                                <div className={styles.creditSection}>
                                    <h4>Crédit en cours</h4>
                                    <div className={styles.creditAmount}>{formatCurrency(selectedCustomer.currentCredit)}</div>
                                    <button className={styles.payBtn} onClick={handleOpenPayment}>
                                        Enregistrer un paiement
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && selectedCustomer && (
                <div className={styles.overlay} onClick={() => setShowPaymentModal(false)}>
                    <div className={styles.modalSmall} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Enregistrer un paiement</h2>
                            <button onClick={() => setShowPaymentModal(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.paymentInfo}>
                                <h3 className={styles.customerPaymentName}>{selectedCustomer.name}</h3>
                                <div className={styles.currentBalanceInfo}>
                                    Crédit actuel: <strong>{formatCurrency(selectedCustomer.currentCredit)}</strong>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Montant du paiement (DA)</label>
                                <input
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    placeholder="Ex: 5000"
                                    autoFocus
                                />
                                <div className={styles.newBalanceInfo}>
                                    Nouveau solde: <strong>
                                        {formatCurrency(Math.max(0, selectedCustomer.currentCredit - (parseFloat(paymentAmount) || 0)))}
                                    </strong>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Notes / Référence (optionnel)</label>
                                <textarea
                                    className={styles.notesArea}
                                    value={paymentNotes}
                                    onChange={(e) => setPaymentNotes(e.target.value)}
                                    placeholder="Ex: Paiement en espèces, Chèque N°..."
                                    rows={3}
                                />
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowPaymentModal(false)}>Annuler</button>
                            <button className={styles.confirmBtn} onClick={handleSavePayment}>
                                <Save size={18} /> Valider le paiement
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Customer Modal */}
            {showEditModal && (
                <div className={styles.overlay} onClick={() => setShowEditModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{selectedCustomer ? 'Modifier le client' : 'Nouveau client'}</h2>
                            <button onClick={() => setShowEditModal(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label>Nom complet *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ex: Ahmed Benali"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Téléphone *</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="Ex: 0555112233"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Ex: email@exemple.com"
                                />
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Adresse</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Ex: 45 Rue Didouche Mourad"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Ville</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        placeholder="Ex: Alger"
                                    />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Limite de crédit (DA)</label>
                                <input
                                    type="number"
                                    value={formData.creditLimit}
                                    onChange={(e) => setFormData({ ...formData, creditLimit: parseInt(e.target.value) || 0 })}
                                    placeholder="50000"
                                />
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowEditModal(false)}>Annuler</button>
                            <button className={styles.confirmBtn} onClick={handleSaveCustomer}>
                                <Save size={18} /> {selectedCustomer ? 'Enregistrer' : 'Créer le client'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Supprimer le client"
                message={`Êtes-vous sûr de vouloir supprimer "${customerToDelete?.name}" ? Cette action est irréversible.`}
                confirmText="Supprimer"
                cancelText="Annuler"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </div>
    );
};

export default CustomersList;

import React, { useState } from 'react';
import {
    Search,
    Phone,
    Mail,
    MapPin,
    Eye,
    Edit,
    Trash2,
    Truck,
    ShoppingBag,
    X,
    FileText,
    Activity,
    CreditCard,
    UserPlus,
    Save,
} from 'lucide-react';
import { usePurchasesStore, type Supplier } from '@bonilo/shared/stores';
import { useSettings } from '../../../contexts/SettingsContext';
import { useToast } from '../../../components/feedback/Toast';
import { commandErrorMessage } from '../../../utils/commandError';
import { ConfirmModal } from '../../../components/feedback/ConfirmModal';
import styles from './SuppliersList.module.css';

export const SuppliersList: React.FC = () => {
    const { formatCurrency } = useSettings();
    const { suppliers, goodsReceipts, addSupplier, updateSupplier, deleteSupplier } = usePurchasesStore();
    const toast = useToast();

    const [searchQuery, setSearchQuery] = useState('');
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        ice: '',
        nif: '',
    });

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery) ||
        (s.city && s.city.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getSupplierStats = (supplierId: string) => {
        const supplierReceipts = goodsReceipts.filter(r => r.supplierId === supplierId);
        const totalPurchased = supplierReceipts.reduce((sum, r) => sum + r.total, 0);
        const unpaidAmount = supplierReceipts.filter(r => !r.isPaid).reduce((sum, r) => sum + r.total, 0);
        return {
            receiptCount: supplierReceipts.length,
            totalPurchased,
            unpaidAmount,
        };
    };

    const handleViewSupplier = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setShowViewModal(true);
    };

    const handleEditSupplier = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setFormData({
            name: supplier.name,
            phone: supplier.phone,
            email: supplier.email || '',
            address: supplier.address || '',
            city: supplier.city || '',
            ice: supplier.ice || '',
            nif: supplier.nif || '',
        });
        setShowEditModal(true);
    };

    const handleNewSupplier = () => {
        setSelectedSupplier(null);
        setFormData({
            name: '',
            phone: '',
            email: '',
            address: '',
            city: '',
            ice: '',
            nif: '',
        });
        setShowEditModal(true);
    };

    const handleSaveSupplier = async () => {
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
            ice: formData.ice || undefined,
            nif: formData.nif || undefined,
        };

        try {
            if (selectedSupplier) {
                await updateSupplier(selectedSupplier.id, fields);
                toast.success(`Fournisseur "${formData.name}" modifié avec succès`);
            } else {
                await addSupplier(fields);
                toast.success(`Fournisseur "${formData.name}" ajouté avec succès`);
            }
        } catch (err) {
            toast.error(commandErrorMessage(err, 'Échec de la sauvegarde du fournisseur'));
            return;
        }

        setShowEditModal(false);
        setSelectedSupplier(null);
    };

    const handleDeleteSupplier = (supplier: Supplier) => {
        const stats = getSupplierStats(supplier.id);
        if (stats.unpaidAmount > 0) {
            toast.warning(`Ce fournisseur a une dette de ${formatCurrency(stats.unpaidAmount)}. Réglez d'abord les paiements.`);
            return;
        }
        setSupplierToDelete(supplier);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (supplierToDelete) {
            try {
                await deleteSupplier(supplierToDelete.id);
                toast.success(`Fournisseur "${supplierToDelete.name}" supprimé`);
            } catch (err) {
                toast.error(commandErrorMessage(err, 'Échec de la suppression'));
            }
        }
        setShowDeleteConfirm(false);
        setSupplierToDelete(null);
    };

    return (
        <div className={styles.suppliersList}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, téléphone ou ville..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className={styles.addBtn} onClick={handleNewSupplier}>
                    <UserPlus size={18} /> Nouveau fournisseur
                </button>
            </div>

            <span className={styles.resultsCount}>{filteredSuppliers.length} fournisseurs</span>

            {/* Suppliers Grid */}
            <div className={styles.grid}>
                {filteredSuppliers.map(supplier => {
                    const stats = getSupplierStats(supplier.id);
                    return (
                        <div key={supplier.id} className={styles.supplierCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.avatar}>
                                    <Truck size={24} />
                                </div>
                                {stats.unpaidAmount > 0 && (
                                    <div className={styles.debtIndicator} title="Dette en cours">
                                        <CreditCard size={14} />
                                    </div>
                                )}
                            </div>
                            <h3 className={styles.supplierName}>{supplier.name}</h3>
                            <div className={styles.contactInfo}>
                                <span><Phone size={12} /> {supplier.phone}</span>
                                {supplier.city && <span><MapPin size={12} /> {supplier.city}</span>}
                            </div>
                            <div className={styles.statsGrid}>
                                <div>
                                    <span className={styles.statValue}>{stats.receiptCount}</span>
                                    <span className={styles.statLabel}>Bons</span>
                                </div>
                                <div>
                                    <span className={styles.statValue}>{formatCurrency(stats.totalPurchased)}</span>
                                    <span className={styles.statLabel}>Total achats</span>
                                </div>
                            </div>
                            {stats.unpaidAmount > 0 && (
                                <div className={styles.debtAlert}>
                                    Dette: {formatCurrency(stats.unpaidAmount)}
                                </div>
                            )}
                            <div className={styles.cardActions}>
                                <button onClick={() => handleViewSupplier(supplier)}><Eye size={14} /> Voir</button>
                                <button onClick={() => handleEditSupplier(supplier)}><Edit size={14} /> Modifier</button>
                                <button className={styles.deleteBtn} onClick={() => handleDeleteSupplier(supplier)}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Supplier Detail Modal */}
            {showViewModal && selectedSupplier && (
                <div className={styles.overlay} onClick={() => setShowViewModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalProfile}>
                                <div className={styles.modalAvatar}>
                                    <Truck size={32} />
                                </div>
                                <div>
                                    <h2>{selectedSupplier.name}</h2>
                                    <span className={styles.cityTag}>{selectedSupplier.city || 'Ville non spécifiée'}</span>
                                </div>
                            </div>
                            <button className={styles.closeBtn} onClick={() => setShowViewModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.infoSection}>
                                <h4>Informations de contact</h4>
                                <div className={styles.infoGrid}>
                                    <div><Phone size={14} /> {selectedSupplier.phone}</div>
                                    {selectedSupplier.email && <div><Mail size={14} /> {selectedSupplier.email}</div>}
                                    {selectedSupplier.address && <div><MapPin size={14} /> {selectedSupplier.address}</div>}
                                    {selectedSupplier.ice && <div><Activity size={14} /> ICE: {selectedSupplier.ice}</div>}
                                    {selectedSupplier.nif && <div><FileText size={14} /> NIF: {selectedSupplier.nif}</div>}
                                </div>
                            </div>

                            <div className={styles.statsSection}>
                                <div className={styles.statBox}>
                                    <FileText size={20} />
                                    <span className={styles.statBoxValue}>{getSupplierStats(selectedSupplier.id).receiptCount}</span>
                                    <span className={styles.statBoxLabel}>Réceptions</span>
                                </div>
                                <div className={styles.statBox}>
                                    <ShoppingBag size={20} />
                                    <span className={styles.statBoxValue}>{formatCurrency(getSupplierStats(selectedSupplier.id).totalPurchased)}</span>
                                    <span className={styles.statBoxLabel}>Montant global</span>
                                </div>
                                <div className={`${styles.statBox} ${getSupplierStats(selectedSupplier.id).unpaidAmount > 0 ? styles.alertStat : ''}`}>
                                    <CreditCard size={20} />
                                    <span className={styles.statBoxValue}>{formatCurrency(getSupplierStats(selectedSupplier.id).unpaidAmount)}</span>
                                    <span className={styles.statBoxLabel}>Reliquat / Dette</span>
                                </div>
                            </div>

                            <div className={styles.recentActivity}>
                                <h4>Activité récente</h4>
                                <div className={styles.emptyActivity}>
                                    Consultez l'historique des bons dans l'onglet des commandes.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Supplier Modal */}
            {showEditModal && (
                <div className={styles.overlay} onClick={() => setShowEditModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{selectedSupplier ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}</h2>
                            <button className={styles.closeBtn} onClick={() => setShowEditModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label>Nom du fournisseur *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ex: SARL Distrib Plus"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Téléphone *</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="Ex: 0555123456"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Ex: contact@fournisseur.dz"
                                />
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Adresse</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Ex: Zone Industrielle"
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
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>ICE</label>
                                    <input
                                        type="text"
                                        value={formData.ice}
                                        onChange={(e) => setFormData({ ...formData, ice: e.target.value })}
                                        placeholder="Ex: 001234567890123"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>NIF</label>
                                    <input
                                        type="text"
                                        value={formData.nif}
                                        onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                                        placeholder="Ex: 19801234567890"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowEditModal(false)}>Annuler</button>
                            <button className={styles.confirmBtn} onClick={handleSaveSupplier}>
                                <Save size={18} /> {selectedSupplier ? 'Enregistrer' : 'Créer le fournisseur'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Supprimer le fournisseur"
                message={`Êtes-vous sûr de vouloir supprimer "${supplierToDelete?.name}" ? Cette action est irréversible.`}
                confirmText="Supprimer"
                cancelText="Annuler"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </div>
    );
};

export default SuppliersList;

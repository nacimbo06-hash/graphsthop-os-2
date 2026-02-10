import React, { useState } from 'react';
import {
    Gift,
    Star,
    Award,
    TrendingUp,
    Users,
    Percent,
    Trophy,
    Crown,
    ShoppingBag,
    Settings,
    Edit,
    Save,
    X,
    Plus,
    Trash2,
} from 'lucide-react';
import { useCustomersStore } from '@core/stores';
import { useSettings } from '../../../contexts/SettingsContext';
import { useToast } from '../../../components/feedback/Toast';
import { ConfirmModal } from '../../../components/feedback/ConfirmModal';
import styles from './LoyaltyProgram.module.css';

interface LoyaltyTier {
    id: string;
    name: string;
    icon: string;
    minPoints: number;
    discount: number;
    color: string;
    benefits: string[];
}

interface LoyaltySettings {
    pointsPerAmount: number; // How much to spend for 1 point
    currency: string;
    enabled: boolean;
}

const defaultTiers: LoyaltyTier[] = [
    { id: 'bronze', name: 'Bronze', icon: '🥉', minPoints: 0, discount: 0, color: '#CD7F32', benefits: ['Accumulation de points'] },
    { id: 'silver', name: 'Argent', icon: '🥈', minPoints: 1000, discount: 3, color: '#C0C0C0', benefits: ['3% de remise', 'Offres exclusives'] },
    { id: 'gold', name: 'Or', icon: '🥇', minPoints: 5000, discount: 5, color: '#FFD700', benefits: ['5% de remise', 'Livraison gratuite', 'Accès anticipé promos'] },
    { id: 'platinum', name: 'Platine', icon: '💎', minPoints: 10000, discount: 10, color: '#E5E4E2', benefits: ['10% de remise', 'Service prioritaire', 'Cadeaux anniversaire'] },
];

const LOYALTY_STORAGE_KEY = 'loyalty_settings';
const TIERS_STORAGE_KEY = 'loyalty_tiers';

export const LoyaltyProgram: React.FC = () => {
    const { customers } = useCustomersStore();
    const { formatCurrency } = useSettings();
    const toast = useToast();

    // Load settings from localStorage
    const loadSettings = (): LoyaltySettings => {
        try {
            const saved = localStorage.getItem(LOYALTY_STORAGE_KEY);
            if (saved) return JSON.parse(saved);
        } catch (e) { }
        return { pointsPerAmount: 100, currency: 'DA', enabled: true };
    };

    const loadTiers = (): LoyaltyTier[] => {
        try {
            const saved = localStorage.getItem(TIERS_STORAGE_KEY);
            if (saved) return JSON.parse(saved);
        } catch (e) { }
        return defaultTiers;
    };

    const [settings, setSettings] = useState<LoyaltySettings>(loadSettings);
    const [tiers, setTiers] = useState<LoyaltyTier[]>(loadTiers);
    const [selectedTier, setSelectedTier] = useState<LoyaltyTier | null>(null);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showTierModal, setShowTierModal] = useState(false);
    const [editingTier, setEditingTier] = useState<LoyaltyTier | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [tierToDelete, setTierToDelete] = useState<string | null>(null);

    // Form state for tier editing
    const [tierForm, setTierForm] = useState({
        name: '',
        icon: '',
        minPoints: 0,
        discount: 0,
        color: '#FFD700',
        benefits: '',
    });

    // Stats
    const totalMembers = customers.length;
    const totalPointsIssued = customers.reduce((sum, c) => sum + c.loyaltyPoints, 0);
    const avgPointsPerCustomer = totalMembers > 0 ? Math.round(totalPointsIssued / totalMembers) : 0;

    // Get customer tier
    const getCustomerTier = (points: number): LoyaltyTier => {
        const sortedTiers = [...tiers].sort((a, b) => b.minPoints - a.minPoints);
        return sortedTiers.find(t => points >= t.minPoints) || tiers[0];
    };

    // Top customers
    const topCustomers = [...customers]
        .sort((a, b) => b.loyaltyPoints - a.loyaltyPoints)
        .slice(0, 5)
        .map(c => ({
            ...c,
            tier: getCustomerTier(c.loyaltyPoints),
        }));

    const saveSettings = (newSettings: LoyaltySettings) => {
        setSettings(newSettings);
        localStorage.setItem(LOYALTY_STORAGE_KEY, JSON.stringify(newSettings));
        toast.success('Paramètres de fidélité enregistrés');
        setShowSettingsModal(false);
    };

    const saveTiers = (newTiers: LoyaltyTier[]) => {
        setTiers(newTiers);
        localStorage.setItem(TIERS_STORAGE_KEY, JSON.stringify(newTiers));
    };

    const handleEditTier = (tier: LoyaltyTier) => {
        setEditingTier(tier);
        setTierForm({
            name: tier.name,
            icon: tier.icon,
            minPoints: tier.minPoints,
            discount: tier.discount,
            color: tier.color,
            benefits: tier.benefits.join(', '),
        });
        setShowTierModal(true);
    };

    const handleNewTier = () => {
        setEditingTier(null);
        setTierForm({
            name: '',
            icon: '⭐',
            minPoints: 0,
            discount: 0,
            color: '#FFD700',
            benefits: '',
        });
        setShowTierModal(true);
    };

    const handleSaveTier = () => {
        if (!tierForm.name.trim()) {
            toast.warning('Le nom du niveau est obligatoire');
            return;
        }

        const newTier: LoyaltyTier = {
            id: editingTier?.id || `tier_${Date.now()}`,
            name: tierForm.name,
            icon: tierForm.icon || '⭐',
            minPoints: tierForm.minPoints,
            discount: tierForm.discount,
            color: tierForm.color,
            benefits: tierForm.benefits.split(',').map(b => b.trim()).filter(b => b),
        };

        let newTiers: LoyaltyTier[];
        if (editingTier) {
            newTiers = tiers.map(t => t.id === editingTier.id ? newTier : t);
        } else {
            newTiers = [...tiers, newTier];
        }

        // Sort by minPoints
        newTiers.sort((a, b) => a.minPoints - b.minPoints);
        saveTiers(newTiers);
        toast.success(editingTier ? 'Niveau modifié' : 'Niveau créé');
        setShowTierModal(false);
    };

    const handleDeleteTier = (tierId: string) => {
        if (tiers.length <= 1) {
            toast.warning('Vous devez avoir au moins un niveau');
            return;
        }
        setTierToDelete(tierId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteTier = () => {
        if (tierToDelete) {
            const newTiers = tiers.filter(t => t.id !== tierToDelete);
            saveTiers(newTiers);
            toast.success('Niveau supprimé');
        }
        setShowDeleteConfirm(false);
        setTierToDelete(null);
    };

    const formatNumber = (val: number) => new Intl.NumberFormat('fr-FR').format(val);

    return (
        <div className={styles.loyaltyProgram}>
            {/* Header with Settings */}
            <div className={styles.headerActions}>
                <button className={styles.settingsBtn} onClick={() => setShowSettingsModal(true)}>
                    <Settings size={18} /> Paramètres du système
                </button>
            </div>

            {/* Stats */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <Users size={24} />
                    <div>
                        <span className={styles.statValue}>{totalMembers}</span>
                        <span className={styles.statLabel}>Membres fidélité</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <Star size={24} />
                    <div>
                        <span className={styles.statValue}>{formatNumber(totalPointsIssued)}</span>
                        <span className={styles.statLabel}>Points distribués</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <TrendingUp size={24} />
                    <div>
                        <span className={styles.statValue}>{avgPointsPerCustomer}</span>
                        <span className={styles.statLabel}>Moyenne/client</span>
                    </div>
                </div>
            </div>

            {/* Points Conversion */}
            <div className={styles.conversionBox}>
                <Gift size={24} />
                <div>
                    <strong>Système de points:</strong> 1 point = {settings.pointsPerAmount} {settings.currency} dépensés
                    <span className={styles.conversionNote}>Les points sont crédités automatiquement à chaque achat</span>
                </div>
                <button className={styles.editConversionBtn} onClick={() => setShowSettingsModal(true)}>
                    <Edit size={16} />
                </button>
            </div>

            {/* Tiers */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3><Award size={20} /> Niveaux de fidélité</h3>
                    <button className={styles.addTierBtn} onClick={handleNewTier}>
                        <Plus size={16} /> Ajouter un niveau
                    </button>
                </div>
                <div className={styles.tiersGrid}>
                    {tiers.map(tier => (
                        <div
                            key={tier.id}
                            className={styles.tierCard}
                            style={{ borderTopColor: tier.color }}
                            onClick={() => setSelectedTier(selectedTier?.id === tier.id ? null : tier)}
                        >
                            <div className={styles.tierActions}>
                                <button onClick={(e) => { e.stopPropagation(); handleEditTier(tier); }}>
                                    <Edit size={14} />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteTier(tier.id); }}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <span className={styles.tierIcon}>{tier.icon}</span>
                            <h4 className={styles.tierName}>{tier.name}</h4>
                            <span className={styles.tierPoints}>
                                {tier.minPoints > 0 ? `${formatNumber(tier.minPoints)}+ pts` : 'Départ'}
                            </span>
                            {tier.discount > 0 && (
                                <span className={styles.tierDiscount}>
                                    <Percent size={12} /> {tier.discount}% remise
                                </span>
                            )}
                            {selectedTier?.id === tier.id && (
                                <div className={styles.tierBenefits}>
                                    <strong>Avantages:</strong>
                                    <ul>
                                        {tier.benefits.map((b, i) => <li key={i}>{b}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Customers */}
            <div className={styles.section}>
                <h3><Trophy size={20} /> Top clients fidèles</h3>
                <div className={styles.leaderboard}>
                    {topCustomers.length === 0 ? (
                        <div className={styles.emptyState}>Aucun client avec des points</div>
                    ) : (
                        topCustomers.map((customer, index) => (
                            <div key={customer.id} className={styles.leaderRow}>
                                <div className={styles.rank}>
                                    {index === 0 ? <Crown size={20} className={styles.crown} /> : `#${index + 1}`}
                                </div>
                                <div className={styles.customerInfo}>
                                    <span className={styles.customerName}>{customer.name}</span>
                                    <span className={styles.customerTier}>
                                        {customer.tier.icon} {customer.tier.name}
                                    </span>
                                </div>
                                <div className={styles.customerPoints}>
                                    <span className={styles.pointsValue}>{formatNumber(customer.loyaltyPoints)}</span>
                                    <span className={styles.pointsLabel}>points</span>
                                </div>
                                <div className={styles.customerSpent}>
                                    <ShoppingBag size={14} />
                                    {formatCurrency(customer.creditLimit)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Settings Modal */}
            {showSettingsModal && (
                <div className={styles.overlay} onClick={() => setShowSettingsModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2><Settings size={20} /> Paramètres du système de fidélité</h2>
                            <button onClick={() => setShowSettingsModal(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label>Montant pour 1 point ({settings.currency})</label>
                                <input
                                    type="number"
                                    value={settings.pointsPerAmount}
                                    onChange={(e) => setSettings({ ...settings, pointsPerAmount: parseInt(e.target.value) || 100 })}
                                    min="1"
                                />
                                <span className={styles.hint}>
                                    Ex: Si vous entrez 100, le client gagne 1 point pour chaque 100 DA dépensés
                                </span>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Devise</label>
                                <input
                                    type="text"
                                    value={settings.currency}
                                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                    placeholder="DA"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={settings.enabled}
                                        onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                                    />
                                    Activer le système de fidélité
                                </label>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowSettingsModal(false)}>Annuler</button>
                            <button className={styles.confirmBtn} onClick={() => saveSettings(settings)}>
                                <Save size={18} /> Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tier Edit Modal */}
            {showTierModal && (
                <div className={styles.overlay} onClick={() => setShowTierModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{editingTier ? 'Modifier le niveau' : 'Nouveau niveau'}</h2>
                            <button onClick={() => setShowTierModal(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Nom du niveau *</label>
                                    <input
                                        type="text"
                                        value={tierForm.name}
                                        onChange={(e) => setTierForm({ ...tierForm, name: e.target.value })}
                                        placeholder="Ex: Or"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Icône (emoji)</label>
                                    <input
                                        type="text"
                                        value={tierForm.icon}
                                        onChange={(e) => setTierForm({ ...tierForm, icon: e.target.value })}
                                        placeholder="🥇"
                                    />
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Points minimum</label>
                                    <input
                                        type="number"
                                        value={tierForm.minPoints}
                                        onChange={(e) => setTierForm({ ...tierForm, minPoints: parseInt(e.target.value) || 0 })}
                                        min="0"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Remise (%)</label>
                                    <input
                                        type="number"
                                        value={tierForm.discount}
                                        onChange={(e) => setTierForm({ ...tierForm, discount: parseInt(e.target.value) || 0 })}
                                        min="0"
                                        max="100"
                                    />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Couleur</label>
                                <input
                                    type="color"
                                    value={tierForm.color}
                                    onChange={(e) => setTierForm({ ...tierForm, color: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Avantages (séparés par des virgules)</label>
                                <input
                                    type="text"
                                    value={tierForm.benefits}
                                    onChange={(e) => setTierForm({ ...tierForm, benefits: e.target.value })}
                                    placeholder="Ex: 5% de remise, Livraison gratuite, Cadeaux"
                                />
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowTierModal(false)}>Annuler</button>
                            <button className={styles.confirmBtn} onClick={handleSaveTier}>
                                <Save size={18} /> {editingTier ? 'Enregistrer' : 'Créer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Tier Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Supprimer le niveau"
                message="Êtes-vous sûr de vouloir supprimer ce niveau de fidélité ?"
                confirmText="Supprimer"
                cancelText="Annuler"
                variant="danger"
                onConfirm={confirmDeleteTier}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </div>
    );
};

export default LoyaltyProgram;

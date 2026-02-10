import React, { useState } from 'react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Box,
    Layers,
    ArrowRight,
    Percent,
    AlertTriangle,
    CheckCircle,
    X,
    Save,
} from 'lucide-react';
import type { Product } from '@core/types/product';
import { useToast } from '../../../components/feedback/Toast';
import { ConfirmModal } from '../../../components/feedback/ConfirmModal';
import { useProductsStore } from '@core/stores';
import { formatCurrency } from '../../../utils/formatters';
import styles from './BundleManagement.module.css';

// Derived Bundle type mapping to Product
interface BundleView {
    id: string;
    name: string;
    sku: string;
    barcode?: string;
    bundlePrice: number;
    totalUnitPrice: number;
    discount: number;
    stock: number;
    componentName: string;
    quantity: number;
}

export const BundleManagement: React.FC = () => {
    const toast = useToast();
    const { products, addProduct, updateProduct, deleteProduct } = useProductsStore();

    // Filter only bundle type products
    const bundles: BundleView[] = products
        .filter(p => p.productType === 'bundle')
        .map(p => {
            // Find base product based on name or metadata if it exists
            // For now, let's assume we store the base product name in nature or similar
            // or just parse it from the name for this demo logic
            const basePrefix = p.name.split(' x')[0];
            const baseProduct = products.find(bp => bp.name === basePrefix && bp.productType !== 'bundle');

            const totalUnitPrice = baseProduct ? baseProduct.sellingPrice * (p.unitsPerPack || 1) : p.sellingPrice;
            const savings = totalUnitPrice - p.sellingPrice;
            const discount = totalUnitPrice > 0 ? Math.round((savings / totalUnitPrice) * 100) : 0;

            return {
                id: p.id,
                name: p.name,
                sku: p.sku || '',
                barcode: p.barcode,
                bundlePrice: p.sellingPrice,
                totalUnitPrice: totalUnitPrice,
                discount: discount,
                stock: baseProduct ? Math.floor(baseProduct.stock / (p.unitsPerPack || 1)) : 0,
                componentName: baseProduct ? baseProduct.name : 'Produit inconnu',
                quantity: p.unitsPerPack || 1
            };
        });

    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    // Use specific type for edit bundle
    const [editBundle, setEditBundle] = useState<Product | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [bundleToDelete, setBundleToDelete] = useState<string | null>(null);

    const filteredBundles = bundles.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteBundle = (bundleId: string) => {
        setBundleToDelete(bundleId);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (bundleToDelete) {
            deleteProduct(bundleToDelete);
        }
        setShowDeleteConfirm(false);
        setBundleToDelete(null);
    };

    return (
        <div className={styles.bundleManagement}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Layers size={24} />
                    <div>
                        <h2>Gestion des Packs / Bundles</h2>
                        <p>Créez et gérez les packs produits avec prix réduit</p>
                    </div>
                </div>
                <button
                    className={styles.createBtn}
                    onClick={() => setShowCreateModal(true)}
                >
                    <Plus size={18} /> Créer un Pack
                </button>
            </div>

            {/* Search */}
            <div className={styles.searchBar}>
                <Search size={20} />
                <input
                    type="text"
                    placeholder="Rechercher un pack..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Bundles Grid */}
            <div className={styles.bundlesGrid}>
                {filteredBundles.map(bundle => (
                    <div key={bundle.id} className={styles.bundleCard}>
                        <div className={styles.bundleHeader}>
                            <div className={styles.bundleIcon}>
                                <Layers size={24} />
                            </div>
                            <div className={styles.bundleInfo}>
                                <h3>{bundle.name}</h3>
                                <span className={styles.bundleSku}>SKU: {bundle.sku}</span>
                            </div>
                            {bundle.discount > 0 && (
                                <div className={styles.discountBadge}>
                                    -{bundle.discount}%
                                </div>
                            )}
                        </div>

                        <div className={styles.bundleComponents}>
                            <span className={styles.componentsLabel}>Contenu du pack:</span>
                            <div className={styles.componentRow}>
                                <span className={styles.componentQty}>{bundle.quantity}x</span>
                                <span className={styles.componentName}>{bundle.componentName}</span>
                            </div>
                        </div>

                        <div className={styles.bundlePricing}>
                            <div className={styles.priceRow}>
                                <span>Prix total (unités):</span>
                                <span className={styles.strikethrough}>{formatCurrency(bundle.totalUnitPrice)}</span>
                            </div>
                            <div className={styles.priceRow}>
                                <span style={{ fontWeight: 600 }}>Prix du Pack:</span>
                                <span className={styles.bundlePriceValue}>{formatCurrency(bundle.bundlePrice)}</span>
                            </div>
                            {bundle.totalUnitPrice > bundle.bundlePrice && (
                                <div className={styles.savingsRow}>
                                    <Percent size={12} />
                                    Économie de {formatCurrency(bundle.totalUnitPrice - bundle.bundlePrice)}
                                </div>
                            )}
                        </div>

                        <div className={styles.bundleStock}>
                            <div className={bundle.stock > 5 ? styles.stockOk : styles.stockLow}>
                                <Box size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                {bundle.stock > 0
                                    ? `${bundle.stock} packs disponibles`
                                    : 'En rupture de stock'
                                }
                            </div>
                        </div>

                        <div className={styles.bundleActions}>
                            <button
                                className={styles.editBtn}
                                onClick={() => {
                                    const product = products.find(p => p.id === bundle.id);
                                    if (product) {
                                        setEditBundle(product);
                                        setShowCreateModal(true);
                                    }
                                }}
                            >
                                <Edit size={16} /> Modifier
                            </button>
                            <button
                                className={styles.deleteBtn}
                                onClick={() => handleDeleteBundle(bundle.id)}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <CreateBundleModal
                    products={products}
                    initialData={editBundle}
                    onClose={() => {
                        setShowCreateModal(false);
                        setEditBundle(null);
                    }}
                    onSave={(data) => {
                        if (editBundle) {
                            updateProduct(editBundle.id, data);
                        } else {
                            addProduct({
                                ...data,
                                productType: 'bundle',
                                isActive: true,
                                isFavorite: false,
                                priceHistory: [],
                                stock: 0,
                                minStock: 5,
                                unit: 'pack',
                                purchasePrice: 0,
                                category: 'Packs'
                            });
                        }
                        setShowCreateModal(false);
                        setEditBundle(null);
                    }}
                />
            )}

            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Supprimer le pack"
                message="Êtes-vous sûr de vouloir supprimer ce pack ?"
                confirmText="Supprimer"
                cancelText="Annuler"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </div>
    );
};

// Simplified Create Modal
interface CreateBundleModalProps {
    products: Product[];
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: any;
}

const CreateBundleModal: React.FC<CreateBundleModalProps> = ({ products, onClose, onSave, initialData }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [sku, setSku] = useState(initialData?.sku || '');
    const [quantity, setQuantity] = useState(initialData?.unitsPerPack || initialData?.quantity || 6);
    const [price, setPrice] = useState(initialData?.sellingPrice || initialData?.bundlePrice || 0);
    const [selectedProductId, setSelectedProductId] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);

    // Filter products for search
    const results = products.filter(p =>
        p.productType !== 'bundle' &&
        (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode.includes(searchQuery))
    ).slice(0, 5);

    const selectedProduct = products.find(p => p.id === selectedProductId);
    const totalUnitPrice = selectedProduct ? selectedProduct.sellingPrice * quantity : 0;
    const savings = totalUnitPrice - price;
    const discount = totalUnitPrice > 0 ? Math.round((savings / totalUnitPrice) * 100) : 0;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>
                        <Layers size={20} />
                        {initialData ? 'Modifier le Pack' : 'Créer un nouveau Pack'}
                    </h3>
                    <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
                </div>

                <div className={styles.modalContent}>
                    {!initialData && (
                        <div className={styles.formGroup}>
                            <label>Sélectionner le produit de base</label>
                            <div className={styles.searchBar} style={{ position: 'relative' }}>
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom ou code-barres..."
                                    value={searchQuery}
                                    onChange={e => {
                                        setSearchQuery(e.target.value);
                                        setShowResults(true);
                                    }}
                                />
                                {showResults && searchQuery && (
                                    <div style={{
                                        position: 'absolute', top: '100%', left: 0, right: 0,
                                        background: 'white', border: '1px solid #ddd', borderRadius: '8px',
                                        zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginTop: '4px'
                                    }}>
                                        {results.map(p => (
                                            <div
                                                key={p.id}
                                                onClick={() => {
                                                    setSelectedProductId(p.id);
                                                    setName(`${p.name} x${quantity}`);
                                                    setPrice(Math.round(p.sellingPrice * quantity * 0.9)); // Default 10% discount
                                                    setSearchQuery(p.name);
                                                    setShowResults(false);
                                                }}
                                                style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}
                                            >
                                                <span style={{ fontWeight: 500 }}>{p.name}</span>
                                                <span style={{ float: 'right', color: '#666' }}>{formatCurrency(p.sellingPrice)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Nom du Pack</label>
                            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Pack Eau x6" />
                        </div>
                        <div className={styles.formGroup}>
                            <label>SKU / Barcode Pack</label>
                            <input value={sku} onChange={e => setSku(e.target.value)} placeholder="001-P6" />
                        </div>
                    </div>

                    <div className={styles.bundleConfig}>
                        <div className={styles.configRow}>
                            <div className={styles.formGroup} style={{ width: '100px' }}>
                                <label>Quantité</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={e => {
                                        const q = Number(e.target.value);
                                        setQuantity(q);
                                        if (selectedProduct) setName(`${selectedProduct.name} x${q}`);
                                    }}
                                />
                            </div>
                            <div className={styles.configArrow}><ArrowRight size={24} /></div>
                            <div className={styles.priceCalc}>
                                <div className={styles.calcRow}>
                                    <span>Prix cumulé:</span>
                                    <span>{formatCurrency(totalUnitPrice)}</span>
                                </div>
                                <div className={styles.formGroup} style={{ marginTop: '8px' }}>
                                    <label>Prix de vente du Pack</label>
                                    <div className={styles.priceInputWrapper}>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={e => setPrice(Number(e.target.value))}
                                        />
                                        <span className={styles.currency}>DA</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {totalUnitPrice > 0 && (
                            <div className={styles.discountPreview}>
                                <div className={`${styles.discountBadgeLarge} ${discount >= 0 ? styles.positive : styles.negative}`}>
                                    <Percent size={18} />
                                    {discount >= 0 ? `Réduction de ${discount}%` : `Majoration de ${Math.abs(discount)}%`}
                                </div>
                                {savings > 0 && (
                                    <span className={styles.savingAmount}>
                                        L'acheteur économise {formatCurrency(savings)}
                                    </span>
                                )}
                                <div className={styles.stockInfo}>
                                    Stock estimé: <strong>{selectedProduct ? Math.floor(selectedProduct.stock / quantity) : 0}</strong> packs
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.cancelBtn} onClick={onClose}>Annuler</button>
                    <button
                        onClick={() => onSave({
                            name,
                            sku,
                            unitsPerPack: quantity,
                            sellingPrice: price,
                            barcode: sku, // Use SKU as barcode if not provided
                            emoji: selectedProduct?.emoji || '📦'
                        })}
                        className={styles.saveBtn}
                        disabled={!name || !price || (!selectedProductId && !initialData)}
                    >
                        <Save size={18} />
                        {initialData ? 'Mettre à jour' : 'Créer le Pack'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BundleManagement;

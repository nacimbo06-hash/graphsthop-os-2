import React, { useState, useMemo } from 'react';
import {
    Tag,
    Plus,
    Edit,
    Trash2,
    Package,
    ChevronRight,
    X,
    ChevronLeft,
    Search,
} from 'lucide-react';
import { useProductsStore } from '@bonilo/shared/stores';
import { CATEGORIES } from '@bonilo/shared';
import { useSettings } from '../../../contexts/SettingsContext';
import { useToast } from '../../../components/feedback/Toast';
import { ConfirmModal } from '../../../components/feedback/ConfirmModal';
import styles from './Categories.module.css';

interface Category {
    id: string;
    name: string;
    emoji: string;
    color: string;
}

// Map shared CATEGORIES to the local shape (icon → emoji)
const defaultCategories: Category[] = CATEGORIES.map(c => ({
    id: c.id,
    name: c.name,
    emoji: c.icon,
    color: c.color,
}));

export const Categories: React.FC = () => {
    const { products } = useProductsStore();
    const { formatCurrency } = useSettings();
    const toast = useToast();

    const [categories, setCategories] = useState<Category[]>(defaultCategories);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [newCategory, setNewCategory] = useState({ name: '', emoji: '', color: '#4A7B8C' });

    // View products state
    const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    // Calculate product counts for each category
    const categoryStats = useMemo(() => {
        const stats: Record<string, number> = {};
        categories.forEach(cat => {
            stats[cat.id] = products.filter(p =>
                p.category?.toLowerCase() === cat.name.toLowerCase() ||
                p.categoryId === cat.id
            ).length;
        });
        return stats;
    }, [products, categories]);

    const totalProducts = products.length;

    // Get products for the viewing category
    const categoryProducts = useMemo(() => {
        if (!viewingCategory) return [];
        return products.filter(p =>
            p.category?.toLowerCase() === viewingCategory.name.toLowerCase() ||
            p.categoryId === viewingCategory.id
        ).filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.barcode?.includes(searchQuery)
        );
    }, [viewingCategory, products, searchQuery]);

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setNewCategory({ name: category.name, emoji: category.emoji, color: category.color });
        setShowModal(true);
    };

    const handleAddNew = () => {
        setEditingCategory(null);
        setNewCategory({ name: '', emoji: '', color: '#4A7B8C' });
        setShowModal(true);
    };

    const handleSave = () => {
        if (!newCategory.name.trim()) {
            toast.warning('Le nom de la catégorie est requis');
            return;
        }

        if (editingCategory) {
            // Update existing category
            setCategories(prev => prev.map(cat =>
                cat.id === editingCategory.id
                    ? { ...cat, name: newCategory.name, emoji: newCategory.emoji || '🏷️', color: newCategory.color }
                    : cat
            ));
        } else {
            // Add new category
            const newCat: Category = {
                id: crypto.randomUUID(),
                name: newCategory.name,
                emoji: newCategory.emoji || '🏷️',
                color: newCategory.color,
            };
            setCategories(prev => [...prev, newCat]);
        }
        setShowModal(false);
    };

    const handleDelete = (category: Category) => {
        setCategoryToDelete(category);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (categoryToDelete) {
            setCategories(prev => prev.filter(cat => cat.id !== categoryToDelete.id));
            toast.success(`Catégorie "${categoryToDelete.name}" supprimée`);
        }
        setShowDeleteConfirm(false);
        setCategoryToDelete(null);
    };

    const getDeleteMessage = () => {
        if (!categoryToDelete) return '';
        const productCount = categoryStats[categoryToDelete.id] || 0;
        if (productCount > 0) {
            return `Cette catégorie contient ${productCount} produit(s). Êtes-vous sûr de vouloir la supprimer?`;
        }
        return `Supprimer la catégorie "${categoryToDelete.name}"?`;
    };

    const handleViewProducts = (category: Category) => {
        setViewingCategory(category);
        setSearchQuery('');
    };

    // If viewing a category, show products list
    if (viewingCategory) {
        return (
            <div className={styles.categories}>
                <div className={styles.header}>
                    <div className={styles.backHeader}>
                        <button className={styles.backBtn} onClick={() => setViewingCategory(null)}>
                            <ChevronLeft size={20} />
                            Retour
                        </button>
                        <div>
                            <h3>
                                <span className={styles.catEmoji}>{viewingCategory.emoji}</span>
                                {viewingCategory.name}
                            </h3>
                            <p>{categoryProducts.length} produit(s) dans cette catégorie</p>
                        </div>
                    </div>
                </div>

                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                {categoryProducts.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Package size={48} />
                        <h4>Aucun produit</h4>
                        <p>Cette catégorie ne contient pas encore de produits.</p>
                    </div>
                ) : (
                    <div className={styles.productGrid}>
                        {categoryProducts.map(product => (
                            <div key={product.id} className={styles.productCard}>
                                <div className={styles.productHeader}>
                                    <span className={styles.productEmoji}>{product.emoji || '📦'}</span>
                                    <span className={`${styles.stockBadge} ${product.stock === 0 ? styles.outOfStock :
                                        product.stock <= product.minStock ? styles.lowStock :
                                            styles.inStock
                                        }`}>
                                        {product.stock === 0 ? 'Rupture' :
                                            product.stock <= product.minStock ? 'Stock bas' :
                                                'En stock'}
                                    </span>
                                </div>
                                <h4 className={styles.productName}>{product.name}</h4>
                                <code className={styles.productBarcode}>{product.barcode}</code>
                                <div className={styles.productPrices}>
                                    <span className={styles.sellPrice}>{formatCurrency(product.sellingPrice)}</span>
                                    <span className={styles.buyPrice}>Achat: {formatCurrency(product.purchasePrice)}</span>
                                </div>
                                <div className={styles.productStock}>
                                    <Package size={14} />
                                    <span>{product.stock} {product.unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={styles.categories}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h3>{categories.length} catégories</h3>
                    <p>{totalProducts} produits au total</p>
                </div>
                <button className={styles.addBtn} onClick={handleAddNew}>
                    <Plus size={18} /> Nouvelle catégorie
                </button>
            </div>

            {/* Categories Grid */}
            <div className={styles.grid}>
                {categories.map(category => (
                    <div
                        key={category.id}
                        className={styles.categoryCard}
                        style={{ borderLeftColor: category.color }}
                    >
                        <div className={styles.cardTop}>
                            <span className={styles.emoji}>{category.emoji}</span>
                            <div className={styles.cardActions}>
                                <button onClick={() => handleEdit(category)} title="Modifier">
                                    <Edit size={14} />
                                </button>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => handleDelete(category)}
                                    title="Supprimer"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        <h4 className={styles.categoryName}>{category.name}</h4>
                        <div className={styles.cardFooter}>
                            <span className={styles.productCount}>
                                <Package size={14} /> {categoryStats[category.id] || 0} produits
                            </span>
                            <button
                                className={styles.viewBtn}
                                onClick={() => handleViewProducts(category)}
                            >
                                Voir <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className={styles.overlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h2>
                            <button onClick={() => setShowModal(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label>Emoji</label>
                                <input
                                    type="text"
                                    value={newCategory.emoji}
                                    onChange={e => setNewCategory({ ...newCategory, emoji: e.target.value })}
                                    placeholder="🏷️"
                                    className={styles.emojiInput}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Nom de la catégorie</label>
                                <input
                                    type="text"
                                    value={newCategory.name}
                                    onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                                    placeholder="Ex: Boissons"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Couleur</label>
                                <input
                                    type="color"
                                    value={newCategory.color}
                                    onChange={e => setNewCategory({ ...newCategory, color: e.target.value })}
                                    className={styles.colorInput}
                                />
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowModal(false)}>Annuler</button>
                            <button className={styles.confirmBtn} onClick={handleSave}>
                                {editingCategory ? 'Enregistrer' : 'Créer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Supprimer la catégorie"
                message={getDeleteMessage()}
                confirmText="Supprimer"
                cancelText="Annuler"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </div>
    );
};

export default Categories;

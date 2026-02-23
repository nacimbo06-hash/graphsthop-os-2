import React, { useState, useMemo, useCallback, memo } from 'react';
import {
    Search,
    Grid,
    List,
    Edit,
    Trash2,
    Eye,
    Star,
    X,
    Save,
    CheckSquare,
    Square,
    Printer,
    Tags,
    MoreHorizontal,
    MinusSquare,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TableVirtuoso } from 'react-virtuoso';
import { useSettings } from '../../../contexts/SettingsContext';
import { useProductsStore, type Product } from '@bonilo/shared/stores';
import { CATEGORIES } from '@bonilo/shared';
import { ConfirmModal } from '../../../components/feedback/ConfirmModal';
import styles from './ProductsList.module.css';

// Build category filter list from SSOT
const categoryFilters = [
    { id: 'all', name: 'Toutes' },
    ...CATEGORIES.map(c => ({ id: c.id, name: c.name })),
];

interface ProductsListProps {
    onEdit?: (product: Product) => void;
}

export const ProductsList: React.FC<ProductsListProps> = ({ onEdit }) => {
    // Settings hooks - Use formatCurrency from context
    const { formatCurrency } = useSettings();

    // Products from store (persistent)
    const { products, deleteProduct, toggleFavorite, updateProduct } = useProductsStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [sortBy, setSortBy] = useState<string>('name');
    const navigate = useNavigate();

    // Bulk Selection State
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showBulkCategoryModal, setShowBulkCategoryModal] = useState(false);
    const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
    const [targetCategory, setTargetCategory] = useState('');

    // Modal states
    const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editForm, setEditForm] = useState<Partial<Product>>({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState<{ id: string, name: string } | null>(null);

    const filteredProducts = useMemo(() => products.filter(p =>
        (selectedCategory === 'all' || p.categoryId === selectedCategory || p.category === CATEGORIES.find(c => c.id === selectedCategory)?.name) &&
        (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.variety?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.shortName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.barcode.includes(searchQuery))
    ), [products, selectedCategory, searchQuery]);

    const getStockStatus = useCallback((product: typeof products[0]) => {
        if (product.stock === 0) return 'outOfStock';
        if (product.stock <= product.minStock) return 'lowStock';
        return 'inStock';
    }, []);

    const getStockBadge = useCallback((product: typeof products[0]) => {
        const status = getStockStatus(product);
        if (status === 'outOfStock') return <span className={`${styles.stockBadge} ${styles.outOfStock}`}>Rupture</span>;
        if (status === 'lowStock') return <span className={`${styles.stockBadge} ${styles.lowStock}`}>Stock bas</span>;
        return <span className={`${styles.stockBadge} ${styles.inStock}`}>En stock</span>;
    }, [getStockStatus]);

    const getMargin = useCallback((product: typeof products[0]) => {
        const margin = ((product.sellingPrice - product.purchasePrice) / product.purchasePrice) * 100;
        return Math.round(margin);
    }, []);

    const handleDelete = (id: string, name: string) => {
        setProductToDelete({ id, name });
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (productToDelete) {
            deleteProduct(productToDelete.id);
        }
        setShowDeleteConfirm(false);
        setProductToDelete(null);
    };

    const handleToggleFavorite = (id: string) => {
        toggleFavorite(id);
    };

    const handleView = (product: Product) => {
        setViewingProduct(product);
    };

    const handleEdit = (product: Product) => {
        if (onEdit) {
            onEdit(product);
        }
    };

    // Bulk Actions Handlers
    const handleSelectAll = () => {
        if (selectedIds.size === filteredProducts.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredProducts.map(p => p.id)));
        }
    };

    const handleSelectOne = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const handleBulkDelete = () => {
        setShowBulkDeleteConfirm(true);
    };

    const confirmBulkDelete = () => {
        selectedIds.forEach(id => deleteProduct(id));
        setSelectedIds(new Set());
        setShowBulkDeleteConfirm(false);
    };

    const handleBulkCategory = () => {
        if (!targetCategory) return;
        selectedIds.forEach(id => {
            const cat = CATEGORIES.find(c => c.id === targetCategory);
            updateProduct(id, { category: cat?.name || targetCategory, categoryId: targetCategory });
        });
        setSelectedIds(new Set());
        setShowBulkCategoryModal(false);
    };

    const handleBulkPrint = () => {
        // Navigate to print center with selected IDs in state or query
        // For now, we'll assume Print Center can read from a simple localStorage key or just mock it
        // A better way is to pass state via router, but let's try direct navigation for now
        navigate('/print', { state: { selectedProductIds: Array.from(selectedIds) } });
    };

    return (
        <div className={styles.productsList}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou code-barres..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className={styles.filters}>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categoryFilters.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="name">Trier par nom</option>
                        <option value="stock">Trier par stock</option>
                        <option value="price">Trier par prix</option>
                        <option value="category">Trier par catégorie</option>
                    </select>
                </div>

                <div className={styles.viewToggle}>
                    <button
                        className={viewMode === 'list' ? styles.active : ''}
                        onClick={() => setViewMode('list')}
                    >
                        <List size={18} />
                    </button>
                    <button
                        className={viewMode === 'grid' ? styles.active : ''}
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid size={18} />
                    </button>
                </div>
            </div>

            {/* Results Count */}
            <div className={styles.resultsInfo}>
                <span>{filteredProducts.length} produits trouvés</span>
            </div>

            {/* List View - Virtualized */}
            {viewMode === 'list' && (
                <div className={styles.tableContainer} style={{ height: 'calc(100vh - 280px)' }}>
                    <TableVirtuoso
                        data={filteredProducts}
                        fixedHeaderContent={() => (
                            <tr>
                                <th style={{ width: '40px' }}>
                                    <div
                                        className={styles.checkboxWrapper}
                                        onClick={handleSelectAll}
                                    >
                                        {selectedIds.size === 0 ? <Square size={18} /> :
                                            selectedIds.size === filteredProducts.length ? <CheckSquare size={18} /> :
                                                <MinusSquare size={18} />}
                                    </div>
                                </th>
                                <th>Produit</th>
                                <th>Catégorie</th>
                                <th>Code-barres</th>
                                <th>Prix achat</th>
                                <th>Prix vente</th>
                                <th>Marge</th>
                                <th>Stock</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        )}
                        itemContent={(_, product) => (
                            <>
                                <td>
                                    <div
                                        className={styles.checkboxWrapper}
                                        onClick={() => handleSelectOne(product.id)}
                                    >
                                        {selectedIds.has(product.id) ?
                                            <CheckSquare size={18} className={styles.checked} /> :
                                            <Square size={18} className={styles.unchecked} />
                                        }
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.productCell}>
                                        <span className={styles.emoji}>{product.emoji}</span>
                                        <div>
                                            <span className={styles.productName}>{product.designation || product.name}</span>
                                            {product.variety && <span className={styles.varietyTag}>{product.variety}</span>}
                                            {product.isFavorite && <Star size={12} className={styles.favIcon} />}
                                        </div>
                                    </div>
                                </td>
                                <td><span className={styles.categoryTag}>{product.category}</span></td>
                                <td><code className={styles.barcode}>{product.barcode}</code></td>
                                <td>{formatCurrency(product.purchasePrice)}</td>
                                <td className={styles.sellPrice}>{formatCurrency(product.sellingPrice)}</td>
                                <td>
                                    <span className={`${styles.margin} ${getMargin(product) >= 20 ? styles.good : styles.low}`}>
                                        {getMargin(product)}%
                                    </span>
                                </td>
                                <td>
                                    <span className={styles.stockQty}>
                                        {product.stock} <small>{product.unit}</small>
                                    </span>
                                </td>
                                <td>{getStockBadge(product)}</td>
                                <td>
                                    <div className={styles.actions}>
                                        <button title="Voir" onClick={() => handleView(product)}>
                                            <Eye size={16} />
                                        </button>
                                        <button title="Modifier" onClick={() => handleEdit(product)}>
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            title="Supprimer"
                                            className={styles.deleteBtn}
                                            onClick={() => handleDelete(product.id, product.name)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </>
                        )}
                        components={{
                            Table: ({ style, ...props }) => (
                                <table {...props} className={styles.table} style={style} />
                            ),
                            TableHead: React.forwardRef(({ style, ...props }, ref) => (
                                <thead {...props} ref={ref} style={style} />
                            )),
                            TableBody: React.forwardRef(({ style, ...props }, ref) => (
                                <tbody {...props} ref={ref} style={style} />
                            )),
                            TableRow: ({ style, ...props }) => (
                                <tr {...props} style={style} />
                            ),
                        }}
                    />
                </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className={styles.gridContainer}>
                    {filteredProducts.map(product => (
                        <div key={product.id} className={`${styles.productCard} ${getStockStatus(product) !== 'inStock' ? styles.lowStockCard : ''}`}>
                            <div className={styles.cardHeader}>
                                <span className={styles.cardEmoji}>{product.emoji}</span>
                                {product.isFavorite && <Star size={16} className={styles.favIcon} />}
                            </div>
                            <h3 className={styles.cardName}>{product.name}</h3>
                            <span className={styles.cardCategory}>{product.category}</span>
                            <div className={styles.cardPrices}>
                                <span className={styles.cardPrice}>{formatCurrency(product.sellingPrice)}</span>
                                <span className={styles.cardMargin}>+{getMargin(product)}%</span>
                            </div>
                            <div className={styles.cardStock}>
                                {getStockBadge(product)}
                                <span>{product.stock} {product.unit}</span>
                            </div>
                            <div className={styles.cardActions}>
                                <button onClick={() => handleView(product)}><Eye size={14} /> Voir</button>
                                <button onClick={() => handleEdit(product)}><Edit size={14} /> Modifier</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* View Product Modal */}
            {viewingProduct && (
                <div className={styles.overlay} onClick={() => setViewingProduct(null)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Détails du produit</h2>
                            <button onClick={() => setViewingProduct(null)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.productDetail}>
                                <span className={styles.detailEmoji}>{viewingProduct.emoji}</span>
                                <h3>{viewingProduct.name}</h3>
                                {viewingProduct.isFavorite && <span className={styles.favBadge}>⭐ Favori</span>}
                            </div>
                            <div className={styles.detailGrid}>
                                <div className={styles.detailItem}>
                                    <label>Code-barres</label>
                                    <code>{viewingProduct.barcode}</code>
                                </div>
                                <div className={styles.detailItem}>
                                    <label>SKU</label>
                                    <span>{viewingProduct.sku || '-'}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <label>Catégorie</label>
                                    <span>{viewingProduct.category}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <label>Marque</label>
                                    <span>{viewingProduct.brand || '-'}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <label>Prix d'achat</label>
                                    <span>{formatCurrency(viewingProduct.purchasePrice)}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <label>Prix de vente</label>
                                    <span className={styles.priceHighlight}>{formatCurrency(viewingProduct.sellingPrice)}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <label>Marge</label>
                                    <span className={styles.marginHighlight}>{getMargin(viewingProduct)}%</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <label>Stock actuel</label>
                                    <span>{viewingProduct.stock} {viewingProduct.unit}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <label>Stock minimum</label>
                                    <span>{viewingProduct.minStock} {viewingProduct.unit}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <label>Statut</label>
                                    {getStockBadge(viewingProduct)}
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setViewingProduct(null)}>Fermer</button>
                            <button
                                className={styles.editBtn}
                                onClick={() => { setViewingProduct(null); handleEdit(viewingProduct); }}
                            >
                                <Edit size={16} /> Modifier
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit modal is now handled by parent via onEdit prop to unify logic */}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Supprimer le produit"
                message={`Êtes-vous sûr de vouloir supprimer "${productToDelete?.name}" ?`}
                confirmText="Supprimer"
                cancelText="Annuler"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteConfirm(false)}
            />

            {/* Bulk Actions Bar */}
            {selectedIds.size > 0 && (
                <div className={styles.bulkActionBar}>
                    <div className={styles.bulkSelectionInfo}>
                        <CheckSquare size={20} />
                        <span>{selectedIds.size} sélectionné(s)</span>
                    </div>
                    <div className={styles.bulkActions}>
                        <button onClick={() => setShowBulkCategoryModal(true)}>
                            <Tags size={16} /> Changer catégorie
                        </button>
                        <button onClick={handleBulkPrint}>
                            <Printer size={16} /> Imprimer étiquettes
                        </button>
                        <div className={styles.bulkDivider} />
                        <button className={styles.bulkDeleteBtn} onClick={handleBulkDelete}>
                            <Trash2 size={16} /> Supprimer
                        </button>
                    </div>
                </div>
            )
            }

            {/* Bulk Category Modal */}
            {
                showBulkCategoryModal && (
                    <div className={styles.overlay} onClick={() => setShowBulkCategoryModal(false)}>
                        <div className={styles.modal} onClick={e => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h2>Changer la catégorie ({selectedIds.size} produits)</h2>
                                <button onClick={() => setShowBulkCategoryModal(false)}><X size={24} /></button>
                            </div>
                            <div className={styles.modalBody}>
                                <label>Nouvelle catégorie :</label>
                                <select
                                    value={targetCategory}
                                    onChange={e => setTargetCategory(e.target.value)}
                                    className={styles.categorySelect}
                                >
                                    <option value="">Choisir une catégorie...</option>
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.modalFooter}>
                                <button onClick={() => setShowBulkCategoryModal(false)}>Annuler</button>
                                <button
                                    className={styles.saveBtn}
                                    onClick={handleBulkCategory}
                                    disabled={!targetCategory}
                                >
                                    <Save size={16} /> Appliquer
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Bulk Delete Confirm */}
            <ConfirmModal
                isOpen={showBulkDeleteConfirm}
                title="Suppression multiple"
                message={`Êtes-vous sûr de vouloir supprimer ces ${selectedIds.size} produits ? Cette action est irréversible.`}
                confirmText={`Supprimer ${selectedIds.size} produits`}
                cancelText="Annuler"
                variant="danger"
                onConfirm={confirmBulkDelete}
                onCancel={() => setShowBulkDeleteConfirm(false)}
            />
        </div >
    );
};

export default ProductsList;

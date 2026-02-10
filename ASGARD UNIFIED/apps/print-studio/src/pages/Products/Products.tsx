import { useState } from 'react';
import {
    Plus,
    Search,
    FileUp,
    Trash2,
    Edit2,
    Printer,
    Filter,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { usePrintStore, Product } from '../../store/usePrintStore';
import styles from './Products.module.css';

export function Products() {
    const { products, setProducts, addProduct, removeProduct, addToQueue } = usePrintStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [showImportModal, setShowImportModal] = useState(false);
    const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.barcode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                const rows = text.split('\n').filter(row => row.trim() !== '');

                // Skip header if it exists
                const startIdx = rows[0].toLowerCase().includes('name') ? 1 : 0;

                const newProducts: Product[] = rows.slice(startIdx).map(row => {
                    const [name, sku, price, barcode, category] = row.split(',').map(s => s.trim());
                    return {
                        id: Math.random().toString(36).substr(2, 9),
                        name: name || 'Produit Inconnu',
                        sku: sku || '',
                        price: parseFloat(price) || 0,
                        currency: 'DA',
                        barcode: barcode || '',
                        category: category || 'Général'
                    };
                });

                setProducts([...products, ...newProducts]);
                setImportStatus({ type: 'success', message: `${newProducts.length} produits importés !` });
            } catch (err) {
                setImportStatus({ type: 'error', message: "Erreur lors de l'importation. Vérifiez le format CSV." });
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>Gestion des Produits</h1>
                    <p>{products.length} produits enregistrés</p>
                </div>

                <div className={styles.headerActions}>
                    <div className={styles.searchBar}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, SKU ou code-barres..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <button className={styles.importBtn} onClick={() => setShowImportModal(true)}>
                        <FileUp size={18} />
                        <span>Importer CSV</span>
                    </button>

                    <button className={styles.addBtn}>
                        <Plus size={18} />
                        <span>Nouveau Produit</span>
                    </button>
                </div>
            </header>

            {/* Stats/Filters Bar */}
            <div className={styles.filterBar}>
                <div className={styles.chip}>
                    <Filter size={14} />
                    <span>Tous les Produits</span>
                </div>
                <div className={styles.stats}>
                    <span>Selection: 0</span>
                </div>
            </div>

            {/* Products Table */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th>SKU</th>
                            <th>Code-barres</th>
                            <th>Prix</th>
                            <th>Catégorie</th>
                            <th className={styles.actionsHeader}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <div className={styles.productInfo}>
                                            <span className={styles.productName}>{product.name}</span>
                                        </div>
                                    </td>
                                    <td><code className={styles.sku}>{product.sku}</code></td>
                                    <td><code className={styles.barcode}>{product.barcode}</code></td>
                                    <td className={styles.price}>{product.price.toFixed(2)} {product.currency}</td>
                                    <td><span className={styles.categoryTag}>{product.category}</span></td>
                                    <td>
                                        <div className={styles.tableActions}>
                                            <button
                                                className={styles.printBtn}
                                                onClick={() => addToQueue(product)}
                                                title="Ajouter à la file d'impression"
                                            >
                                                <Printer size={16} />
                                                <span>Imprimer</span>
                                            </button>
                                            <button className={styles.editBtn} title="Modifier">
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => removeProduct(product.id)}
                                                title="Supprimer"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className={styles.emptyState}>
                                    <div className={styles.emptyContent}>
                                        <Search size={48} />
                                        <p>Aucun produit trouvé</p>
                                        <button className={styles.addBtnSmall}>Ajouter un produit</button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Import Modal */}
            {showImportModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>Importer des Produits</h2>
                            <button
                                className={styles.closeBtn}
                                onClick={() => {
                                    setShowImportModal(false);
                                    setImportStatus(null);
                                }}
                            >
                                &times;
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.importBox}>
                                <FileUp size={48} />
                                <h3>Choisissez un fichier CSV</h3>
                                <p>Format attendu: Nom, SKU, Prix, Code-barres, Catégorie</p>
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleImportCSV}
                                    id="csvImport"
                                />
                                <label htmlFor="csvImport" className={styles.fileLabel}>
                                    Parcourir les fichiers
                                </label>
                            </div>

                            {importStatus && (
                                <div className={`${styles.status} ${styles[importStatus.type]}`}>
                                    {importStatus.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                    <span>{importStatus.message}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Products;

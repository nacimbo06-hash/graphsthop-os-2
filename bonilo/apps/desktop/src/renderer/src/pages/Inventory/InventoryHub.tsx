import React, { useState, useRef } from 'react';
import {
    Package,
    Plus,
    AlertTriangle,
    TrendingUp,
    RefreshCw,
    Download,
    Upload,
    Boxes,
    Tag,
    ClipboardList,
    Layers,
    FileText,
    FileSpreadsheet,
    FileJson,
    X,
} from 'lucide-react';
import { ProductsList } from './tabs/ProductsList';
import { StockAlerts } from './tabs/StockAlerts';
import { Categories } from './tabs/Categories';
import { StockMovements } from './tabs/StockMovements';
import { PhysicalInventory } from './tabs/PhysicalInventory';
import { BundleManagement } from './tabs/BundleManagement';
import { AddProductModal } from './components/AddProductModal';
import { GoodsReceipt } from '../Treasury/GoodsReceipt';

import { useProductsStore, type Product } from '@bonilo/shared/stores';
import { useToast } from '../../components/feedback/Toast';
import styles from './InventoryHub.module.css';

interface Tab {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    component: React.ReactNode;
}

export const InventoryHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showImportMenu, setShowImportMenu] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Use the products store
    const { products, addProduct, updateProduct, getAllSKUs, getLowStockProducts, getOutOfStockProducts } = useProductsStore();
    const toast = useToast();

    // Get existing SKUs for validation
    const existingSKUs = getAllSKUs();

    // Get alerts count (low stock + out of stock)
    const alertsCount = getLowStockProducts().length + getOutOfStockProducts().length;

    // Export functions
    const getExportFilename = (extension: string) => {
        const date = new Date();
        const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
        const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '');
        return `produits_${dateStr}_${timeStr}.${extension}`;
    };

    const handleExportCSV = () => {
        const headers = ['barcode', 'sku', 'name', 'category', 'brand', 'purchasePrice', 'sellingPrice', 'stock', 'minStock', 'unit'];
        const csvRows = [headers.join(',')];

        products.forEach(p => {
            const row = [
                `"${p.barcode || ''}"`,
                `"${p.sku || ''}"`,
                `"${p.name || ''}"`,
                `"${p.category || ''}"`,
                `"${p.brand || ''}"`,
                p.purchasePrice || 0,
                p.sellingPrice || 0,
                p.stock || 0,
                p.minStock || 0,
                `"${p.unit || 'unité'}"`
            ];
            csvRows.push(row.join(','));
        });

        const csvContent = csvRows.join('\n');
        downloadFile(csvContent, getExportFilename('csv'), 'text/csv;charset=utf-8');
        setShowExportMenu(false);
    };

    const handleExportExcel = () => {
        // Export as TSV (Excel compatible)
        const headers = ['Code-barres', 'SKU', 'Nom', 'Catégorie', 'Marque', 'Prix Achat', 'Prix Vente', 'Stock', 'Stock Min', 'Unité'];
        const tsvRows = [headers.join('\t')];

        products.forEach(p => {
            const row = [
                p.barcode || '',
                p.sku || '',
                p.name || '',
                p.category || '',
                p.brand || '',
                p.purchasePrice || 0,
                p.sellingPrice || 0,
                p.stock || 0,
                p.minStock || 0,
                p.unit || 'unité'
            ];
            tsvRows.push(row.join('\t'));
        });

        const tsvContent = tsvRows.join('\n');
        downloadFile(tsvContent, getExportFilename('xls'), 'application/vnd.ms-excel;charset=utf-8');
        setShowExportMenu(false);
    };

    const handleExportJSON = () => {
        const exportData = products.map(p => ({
            barcode: p.barcode,
            sku: p.sku,
            name: p.name,
            category: p.category,
            brand: p.brand,
            purchasePrice: p.purchasePrice,
            sellingPrice: p.sellingPrice,
            stock: p.stock,
            minStock: p.minStock,
            unit: p.unit,
            emoji: p.emoji
        }));

        const jsonContent = JSON.stringify(exportData, null, 2);
        downloadFile(jsonContent, getExportFilename('json'), 'application/json;charset=utf-8');
        setShowExportMenu(false);
    };

    const downloadFile = (content: string, filename: string, type: string) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Import with mapping state
    const [showImportModal, setShowImportModal] = useState(false);
    const [importData, setImportData] = useState<{ headers: string[], rows: string[][] }>({ headers: [], rows: [] });
    const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});

    const targetFields = [
        { key: 'barcode', label: 'Code-barres' },
        { key: 'sku', label: 'SKU' },
        { key: 'name', label: 'Nom du produit' },
        { key: 'category', label: 'Catégorie' },
        { key: 'brand', label: 'Marque' },
        { key: 'purchasePrice', label: 'Prix d\'achat' },
        { key: 'sellingPrice', label: 'Prix de vente' },
        { key: 'stock', label: 'Stock' },
        { key: 'minStock', label: 'Stock minimum' },
        { key: 'unit', label: 'Unité' },
        { key: 'emoji', label: 'Emoji' },
        { key: '', label: '-- Ignorer --' },
    ];

    // Import functions
    const handleImportClick = (format: 'csv' | 'json') => {
        if (fileInputRef.current) {
            fileInputRef.current.accept = format === 'csv' ? '.csv' : '.json';
            fileInputRef.current.dataset.format = format;
            fileInputRef.current.click();
        }
        setShowImportMenu(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const format = e.target.dataset.format || 'csv';
        const reader = new FileReader();

        reader.onload = (event) => {
            const content = event.target?.result as string;
            try {
                if (format === 'json') {
                    // For JSON, import directly
                    const jsonData = JSON.parse(content);
                    if (Array.isArray(jsonData) && jsonData.length > 0) {
                        const importedProducts = jsonData.map(p => ({
                            ...p,
                            id: crypto.randomUUID(),
                            isActive: true,
                            isFavorite: false,
                            priceHistory: [],
                        }));
                        importedProducts.forEach(p => addProduct(p as Product));
                        toast.success(`${jsonData.length} produits importés avec succès!`);
                    } else {
                        toast.warning('Le fichier JSON doit contenir un tableau de produits');
                    }
                } else if (format === 'csv') {
                    // For CSV, show mapping modal
                    const lines = content.split('\n').filter(l => l.trim());
                    if (lines.length < 2) {
                        toast.warning('Le fichier CSV doit contenir une ligne d\'en-tête et une ligne de données');
                        return;
                    }

                    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
                    const rows = lines.slice(1).map(line =>
                        line.split(',').map(v => v.replace(/"/g, '').trim())
                    );

                    // Auto-detect mapping based on header names
                    const autoMapping: Record<string, string> = {};
                    headers.forEach((header, index) => {
                        const lowerHeader = header.toLowerCase();
                        if (lowerHeader.includes('code') || lowerHeader.includes('barcode') || lowerHeader.includes('ean')) {
                            autoMapping[index.toString()] = 'barcode';
                        } else if (lowerHeader === 'sku' || lowerHeader.includes('reference')) {
                            autoMapping[index.toString()] = 'sku';
                        } else if (lowerHeader.includes('nom') || lowerHeader === 'name' || lowerHeader.includes('product') || lowerHeader.includes('désignation')) {
                            autoMapping[index.toString()] = 'name';
                        } else if (lowerHeader.includes('categ') || lowerHeader === 'category') {
                            autoMapping[index.toString()] = 'category';
                        } else if (lowerHeader.includes('marque') || lowerHeader === 'brand') {
                            autoMapping[index.toString()] = 'brand';
                        } else if (lowerHeader.includes('achat') || lowerHeader.includes('purchase') || lowerHeader.includes('cost')) {
                            autoMapping[index.toString()] = 'purchasePrice';
                        } else if (lowerHeader.includes('vente') || lowerHeader.includes('sell') || lowerHeader.includes('price') || lowerHeader.includes('prix')) {
                            autoMapping[index.toString()] = 'sellingPrice';
                        } else if (lowerHeader.includes('stock') || lowerHeader.includes('qty') || lowerHeader.includes('quantité')) {
                            autoMapping[index.toString()] = 'stock';
                        } else if (lowerHeader.includes('min') || lowerHeader.includes('seuil')) {
                            autoMapping[index.toString()] = 'minStock';
                        } else if (lowerHeader.includes('unit') || lowerHeader.includes('unité')) {
                            autoMapping[index.toString()] = 'unit';
                        }
                    });

                    setImportData({ headers, rows });
                    setColumnMapping(autoMapping);
                    setShowImportModal(true);
                }
            } catch (error) {
                console.error('Import error:', error);
                toast.error('Erreur lors de la lecture du fichier');
            }
        };

        reader.readAsText(file);
        e.target.value = ''; // Reset input
    };

    // Process import with mapping
    const handleConfirmImport = () => {
        const importedProducts: Partial<Product>[] = [];

        importData.rows.forEach(row => {
            const product: Partial<Product> = {
                id: crypto.randomUUID(),
                isActive: true,
                isFavorite: false,
                priceHistory: [],
            };

            // Apply mapping
            Object.entries(columnMapping).forEach(([colIndexStr, fieldKey]) => {
                if (!fieldKey) return; // Skip ignored columns
                const colIndex = parseInt(colIndexStr);
                const value = row[colIndex];
                if (value === undefined || value === '') return;

                switch (fieldKey) {
                    case 'barcode': product.barcode = value; break;
                    case 'sku': product.sku = value; break;
                    case 'name': product.name = value; break;
                    case 'category': product.category = value; break;
                    case 'brand': product.brand = value; break;
                    case 'purchasePrice': product.purchasePrice = parseFloat(value) || 0; break;
                    case 'sellingPrice': product.sellingPrice = parseFloat(value) || 0; break;
                    case 'stock': product.stock = parseInt(value) || 0; break;
                    case 'minStock': product.minStock = parseInt(value) || 0; break;
                    case 'unit': product.unit = value; break;
                    case 'emoji': product.emoji = value; break;
                }
            });

            // Only add if has name or barcode
            if (product.name || product.barcode) {
                importedProducts.push(product);
            }
        });

        if (importedProducts.length > 0) {
            importedProducts.forEach(p => addProduct(p as Product));
            toast.success(`${importedProducts.length} produits importés avec succès!`);
            setShowImportModal(false);
            setImportData({ headers: [], rows: [] });
            setColumnMapping({});
        } else {
            toast.warning('Aucun produit valide trouvé. Vérifiez le mapping.');
        }
    };

    const handleAddProduct = (productData: Partial<Product>) => {
        // If it's an update
        if (editProduct) {
            updateProduct(editProduct.id, productData);
            setEditProduct(null);
            setShowAddModal(false);
            return;
        }

        // Add product to store (will persist in localStorage)
        const newProduct = addProduct({
            barcode: productData.barcode || '',
            sku: productData.sku || '',
            name: productData.name || productData.designation || productData.nature || 'Nouveau Produit',
            designation: productData.designation || '',
            shortName: productData.shortName || '',
            variety: productData.variety || '',
            emoji: productData.emoji || getCategoryEmoji(productData.categoryId),
            brand: productData.brand || '',
            nature: productData.nature || '',
            category: getCategoryName(productData.categoryId) || productData.category || 'Épicerie',
            categoryId: productData.categoryId || '',
            subcategoryId: productData.subcategoryId || '',
            purchasePrice: productData.buyPrice || 0,
            sellingPrice: productData.sellPrice || 0,
            buyPrice: productData.buyPrice || 0,
            sellPrice: productData.sellPrice || 0,
            stock: productData.stock || 0,
            minStock: productData.minStock || 10,
            unit: productData.unit || 'unit',
            quantity: productData.quantity || 1,
            isActive: true,
            isFavorite: false,
            // Packaging
            unitsPerCarton: productData.unitsPerCarton,
            cartonBarcode: productData.cartonBarcode,
            unitsPerSellingPack: productData.unitsPerSellingPack,
            sellingPackPrice: productData.sellingPackPrice,
            productType: 'standard',
            priceHistory: [],
        });

        // Product successfully added to store and persisted
    };

    // Helper function to get category name from ID
    const getCategoryName = (categoryId?: string): string => {
        const categoryMap: Record<string, string> = {
            'beverages': 'Boissons',
            'dairy': 'Produits laitiers',
            'grocery': 'Épicerie',
            'biscuits': 'Biscuiterie',
            'fruits': 'Fruits & Légumes',
            'meat': 'Viandes',
            'frozen': 'Surgélés',
            'hygiene': 'Hygiène',
            'cleaning': 'Entretien',
        };
        return categoryMap[categoryId || ''] || 'Épicerie';
    };

    // Helper function to get emoji from category ID
    const getCategoryEmoji = (categoryId?: string): string => {
        const emojiMap: Record<string, string> = {
            'beverages': '🥤',
            'dairy': '🥛',
            'grocery': '🛒',
            'biscuits': '🍪',
            'fruits': '🍎',
            'meat': '🥩',
            'frozen': '❄️',
            'hygiene': '🧴',
            'cleaning': '🧹',
        };
        return emojiMap[categoryId || ''] || '📦';
    };

    const handleEditRequest = (product: Product) => {
        setEditProduct(product);
        setShowAddModal(true);
    };

    const tabs: Tab[] = [
        { id: 'products', label: 'Produits', icon: <Package size={20} />, component: <ProductsList onEdit={handleEditRequest} /> },
        { id: 'bundles', label: 'Packs', icon: <Layers size={20} />, component: <BundleManagement /> },
        { id: 'receipt', label: 'Bon d\'Entrée', icon: <RefreshCw size={20} />, component: <GoodsReceipt /> },
        { id: 'alerts', label: 'Alertes', icon: <AlertTriangle size={20} />, badge: alertsCount, component: <StockAlerts /> },

        { id: 'categories', label: 'Catégories', icon: <Tag size={20} />, component: <Categories /> },
        { id: 'movements', label: 'Mouvements', icon: <TrendingUp size={20} />, component: <StockMovements /> },
        { id: 'physical', label: 'Inventaire', icon: <ClipboardList size={20} />, component: <PhysicalInventory /> },
    ];

    const activeTabData = tabs.find(t => t.id === activeTab);

    return (
        <div className={styles.inventoryHub}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Boxes size={32} className={styles.headerIcon} />
                    <div>
                        <h1>Gestion des Stocks</h1>
                        <p>Inventaire et suivi des produits</p>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    {/* Hidden file input for import */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />

                    {/* Export Dropdown */}
                    <div className={styles.dropdownContainer}>
                        <button
                            className={styles.exportBtn}
                            onClick={() => setShowExportMenu(!showExportMenu)}
                        >
                            <Download size={18} /> Exporter
                        </button>
                        {showExportMenu && (
                            <div className={styles.dropdownMenu}>
                                <button onClick={handleExportCSV}>
                                    <FileText size={16} /> CSV
                                </button>
                                <button onClick={handleExportExcel}>
                                    <FileSpreadsheet size={16} /> Excel
                                </button>
                                <button onClick={handleExportJSON}>
                                    <FileJson size={16} /> JSON
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Import Dropdown */}
                    <div className={styles.dropdownContainer}>
                        <button
                            className={styles.importBtn}
                            onClick={() => setShowImportMenu(!showImportMenu)}
                        >
                            <Upload size={18} /> Importer
                        </button>
                        {showImportMenu && (
                            <div className={styles.dropdownMenu}>
                                <button onClick={() => handleImportClick('csv')}>
                                    <FileText size={16} /> CSV
                                </button>
                                <button onClick={() => handleImportClick('json')}>
                                    <FileJson size={16} /> JSON
                                </button>
                            </div>
                        )}
                    </div>

                    <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
                        <Plus size={18} /> Nouveau produit
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <Package size={24} />
                    <div>
                        <span className={styles.statValue}>{products.length.toLocaleString('fr-FR')}</span>
                        <span className={styles.statLabel}>Produits totaux</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <Boxes size={24} />
                    <div>
                        <span className={styles.statValue}>{products.reduce((sum, p) => sum + p.stock, 0).toLocaleString('fr-FR')}</span>
                        <span className={styles.statLabel}>Unités en stock</span>
                    </div>
                </div>
                <div className={`${styles.statCard} ${styles.warning}`}>
                    <AlertTriangle size={24} />
                    <div>
                        <span className={styles.statValue}>{alertsCount}</span>
                        <span className={styles.statLabel}>Alertes stock bas</span>
                    </div>
                </div>
                <div className={`${styles.statCard} ${styles.danger}`}>
                    <Package size={24} />
                    <div>
                        <span className={styles.statValue}>{getOutOfStockProducts().length}</span>
                        <span className={styles.statLabel}>Ruptures de stock</span>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className={styles.tabsNav}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                        {tab.badge && <span className={styles.badge}>{tab.badge}</span>}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
                {activeTabData?.component}
            </div>

            {/* Add Product Modal */}
            <AddProductModal
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setEditProduct(null);
                }}
                onSave={handleAddProduct}
                existingSKUs={existingSKUs}
                editProduct={editProduct}
            />

            {/* Import Mapping Modal */}
            {showImportModal && (
                <div className={styles.overlay} onClick={() => setShowImportModal(false)}>
                    <div className={styles.importModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>📥 Mapper les colonnes d'import</h2>
                            <button onClick={() => setShowImportModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <p className={styles.importInfo}>
                                {importData.rows.length} lignes détectées. Associez chaque colonne à un champ produit.
                            </p>

                            <div className={styles.mappingTable}>
                                <div className={styles.mappingHeader}>
                                    <span>Colonne du fichier</span>
                                    <span>Exemple</span>
                                    <span>Mapper vers</span>
                                </div>
                                {importData.headers.map((header, index) => (
                                    <div key={index} className={styles.mappingRow}>
                                        <span className={styles.columnName}>{header}</span>
                                        <span className={styles.sampleValue}>
                                            {importData.rows[0]?.[index] || '-'}
                                        </span>
                                        <select
                                            value={columnMapping[index.toString()] || ''}
                                            onChange={e => setColumnMapping(prev => ({
                                                ...prev,
                                                [index.toString()]: e.target.value
                                            }))}
                                        >
                                            {targetFields.map(field => (
                                                <option key={field.key} value={field.key}>
                                                    {field.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowImportModal(false)}>Annuler</button>
                            <button className={styles.confirmBtn} onClick={handleConfirmImport}>
                                <Upload size={18} /> Importer {importData.rows.length} produits
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryHub;


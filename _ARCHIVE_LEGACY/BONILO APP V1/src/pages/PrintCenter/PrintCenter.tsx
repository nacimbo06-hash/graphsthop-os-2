import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Printer,
    Tag,
    Percent,
    Layers,
    Search,
    ArrowLeft,
    Eye,
    CheckCircle,
    Package,
    AlertTriangle,
    TrendingDown,
    Clock,
    X,
} from 'lucide-react';
import { useToast } from '../../components/feedback/Toast';
import { JonyHTML, type PriceLabelData, type LabelType } from '../../services/jonyPrintDesigner';
import { useProductsStore } from '@core/stores';
import { formatCurrency } from '../../utils/formatters';
import styles from './PrintCenter.module.css';

// Essential label templates only
interface LabelTemplate {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
    size: string;
    labelType: LabelType;
    color: string;
}

const labelTemplates: LabelTemplate[] = [
    {
        id: 'standard',
        name: 'STANDARD',
        icon: <Tag size={28} />,
        description: 'Nom + Prix + Code-barres',
        size: '60×40mm',
        labelType: 'standard',
        color: '#10b981',
    },
    {
        id: 'promo',
        name: 'PROMO',
        icon: <Percent size={28} />,
        description: 'Ancien prix barré + Nouveau',
        size: '60×40mm',
        labelType: 'promotion',
        color: '#f59e0b',
    },
    {
        id: 'shelf',
        name: 'RAYON',
        icon: <Layers size={28} />,
        description: 'Étiquette gondole longue',
        size: '100×30mm',
        labelType: 'standard',
        color: '#6366f1',
    },
];

// Product with quantity for printing
interface PrintItem {
    productId: string;
    quantity: number;
}

export const PrintCenter: React.FC = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { products } = useProductsStore();

    // State
    const [selectedTemplate, setSelectedTemplate] = useState<string>('standard');
    const [searchQuery, setSearchQuery] = useState('');
    const [printItems, setPrintItems] = useState<PrintItem[]>([]);
    const [showPreview, setShowPreview] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);

    // Filtered products
    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return products.slice(0, 50); // Show first 50 by default
        const query = searchQuery.toLowerCase();
        return products.filter(p => {
            const nameMatch = (p.name || '').toLowerCase().includes(query);
            const designationMatch = (p.designation || '').toLowerCase().includes(query);
            const varietyMatch = (p.variety || '').toLowerCase().includes(query);
            const shortNameMatch = (p.shortName || '').toLowerCase().includes(query);
            const barcodeMatch = (p.barcode || '').includes(query);
            const skuMatch = (p.sku || '').toLowerCase().includes(query);

            return nameMatch || designationMatch || varietyMatch || shortNameMatch || barcodeMatch || skuMatch;
        });
    }, [products, searchQuery]);

    // Quick action data
    const lowStockProducts = useMemo(() =>
        products.filter(p => p.stock <= (p.minStock || 5)),
        [products]
    );

    const recentProducts = useMemo(() => {
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return products.filter(p => {
            const createdAt = p.createdAt ? new Date(p.createdAt).getTime() : 0;
            return createdAt > oneWeekAgo;
        });
    }, [products]);

    // Total labels to print
    const totalLabels = printItems.reduce((sum, item) => sum + item.quantity, 0);

    // Toggle product selection
    const toggleProduct = (productId: string) => {
        setPrintItems(prev => {
            const exists = prev.find(p => p.productId === productId);
            if (exists) {
                return prev.filter(p => p.productId !== productId);
            }
            return [...prev, { productId, quantity: 1 }];
        });
    };

    // Update quantity
    const updateQuantity = (productId: string, delta: number) => {
        setPrintItems(prev => prev.map(item => {
            if (item.productId === productId) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        }));
    };

    // Quick action: Add all low stock
    const addLowStock = () => {
        const newItems = lowStockProducts.map(p => ({ productId: p.id, quantity: 1 }));
        setPrintItems(prev => {
            const existingIds = new Set(prev.map(p => p.productId));
            const toAdd = newItems.filter(item => !existingIds.has(item.productId));
            return [...prev, ...toAdd];
        });
        toast.success(`${lowStockProducts.length} produits en rupture ajoutés`);
    };

    // Quick action: Add recent arrivals
    const addRecentArrivals = () => {
        const newItems = recentProducts.map(p => ({ productId: p.id, quantity: 1 }));
        setPrintItems(prev => {
            const existingIds = new Set(prev.map(p => p.productId));
            const toAdd = newItems.filter(item => !existingIds.has(item.productId));
            return [...prev, ...toAdd];
        });
        toast.success(`${recentProducts.length} nouveaux produits ajoutés`);
    };

    // Clear selection
    const clearSelection = () => {
        setPrintItems([]);
    };

    // Print labels
    const handlePrint = async () => {
        if (printItems.length === 0) {
            toast.warning('Sélectionnez au moins un produit');
            return;
        }

        setIsPrinting(true);
        const template = labelTemplates.find(t => t.id === selectedTemplate);

        let successCount = 0;

        for (const item of printItems) {
            const product = products.find(p => p.id === item.productId);
            if (!product) continue;

            const data: PriceLabelData = {
                type: template?.labelType || 'standard',
                productName: product.designation || product.name.toUpperCase(),
                barcode: product.barcode || '',
                sku: product.sku || '',
                price: product.sellPrice || product.sellingPrice,
                oldPrice: template?.labelType === 'promotion'
                    ? Math.round(product.sellingPrice * 1.2)
                    : undefined,
                discountPercent: template?.labelType === 'promotion' ? 17 : undefined,
            };

            // Generate and print
            const labelHTML = JonyHTML.generateLabelHTML(data);

            for (let i = 0; i < item.quantity; i++) {
                const printWindow = window.open('', '_blank', 'width=400,height=300');
                if (printWindow) {
                    printWindow.document.write(labelHTML);
                    printWindow.document.close();
                    printWindow.onload = () => printWindow.print();
                    successCount++;
                }
            }
        }

        setIsPrinting(false);
        toast.success(`${successCount} étiquettes envoyées à l'impression`);
    };

    // Generate preview HTML
    const getPreviewHTML = (): string => {
        if (printItems.length === 0) return '';

        const firstItem = printItems[0];
        const product = products.find(p => p.id === firstItem.productId);
        if (!product) return '';

        const template = labelTemplates.find(t => t.id === selectedTemplate);

        const data: PriceLabelData = {
            type: template?.labelType || 'standard',
            productName: product.designation || product.name.toUpperCase(),
            barcode: product.barcode || '',
            sku: product.sku || '',
            price: product.sellPrice || product.sellingPrice,
            oldPrice: template?.labelType === 'promotion'
                ? Math.round(product.sellingPrice * 1.2)
                : undefined,
            discountPercent: template?.labelType === 'promotion' ? 17 : undefined,
        };

        return JonyHTML.generateLabelHTML(data);
    };

    return (
        <div className={styles.printCenter}>
            {/* Header */}
            <header className={styles.header}>
                <button className={styles.backBtn} onClick={() => navigate('/')}>
                    <ArrowLeft size={20} />
                </button>
                <div className={styles.headerTitle}>
                    <Printer size={28} />
                    <h1>Centre d'Impression</h1>
                </div>
            </header>

            {/* Main Content */}
            <div className={styles.mainContent}>
                {/* Left: Templates & Selection */}
                <div className={styles.leftPanel}>
                    {/* Template Selection */}
                    <section className={styles.section}>
                        <h2>1. Choisir le modèle</h2>
                        <div className={styles.templateGrid}>
                            {labelTemplates.map(template => (
                                <button
                                    key={template.id}
                                    className={`${styles.templateCard} ${selectedTemplate === template.id ? styles.selected : ''}`}
                                    onClick={() => setSelectedTemplate(template.id)}
                                    style={{ '--template-color': template.color } as React.CSSProperties}
                                >
                                    <div className={styles.templateIcon}>{template.icon}</div>
                                    <span className={styles.templateName}>{template.name}</span>
                                    <span className={styles.templateSize}>{template.size}</span>
                                    {selectedTemplate === template.id && (
                                        <CheckCircle size={18} className={styles.checkIcon} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Search & Products */}
                    <section className={styles.section}>
                        <h2>2. Sélectionner les produits</h2>
                        <div className={styles.searchBar}>
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Rechercher par nom, code-barres ou SKU..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')}>
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <div className={styles.productsList}>
                            {filteredProducts.map(product => {
                                const item = printItems.find(p => p.productId === product.id);
                                const isSelected = !!item;

                                return (
                                    <div
                                        key={product.id}
                                        className={`${styles.productItem} ${isSelected ? styles.selected : ''}`}
                                    >
                                        <div
                                            className={styles.productMain}
                                            onClick={() => toggleProduct(product.id)}
                                        >
                                            <div className={styles.checkbox}>
                                                {isSelected && <CheckCircle size={18} />}
                                            </div>
                                            <div className={styles.productInfo}>
                                                <span className={styles.productName}>
                                                    {product.designation || product.name}
                                                </span>
                                                {product.variety && (
                                                    <span className={styles.productVariety}>{product.variety}</span>
                                                )}
                                                <span className={styles.productMeta}>
                                                    {product.sku || 'N/A'} • {product.barcode || 'Sans code'}
                                                </span>
                                            </div>
                                            <span className={styles.productPrice}>
                                                {formatCurrency(product.sellPrice || product.sellingPrice)}
                                            </span>
                                        </div>

                                        {isSelected && (
                                            <div className={styles.quantityControl}>
                                                <button onClick={() => updateQuantity(product.id, -1)}>−</button>
                                                <span>{item?.quantity}</span>
                                                <button onClick={() => updateQuantity(product.id, 1)}>+</button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {filteredProducts.length === 0 && (
                                <div className={styles.emptyState}>
                                    <Package size={48} />
                                    <p>Aucun produit trouvé</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right: Actions & Summary */}
                <div className={styles.rightPanel}>
                    {/* Quick Actions */}
                    <section className={styles.section}>
                        <h2>Actions Rapides</h2>
                        <div className={styles.quickActions}>
                            <button
                                className={styles.quickAction}
                                onClick={addLowStock}
                                disabled={lowStockProducts.length === 0}
                            >
                                <TrendingDown size={20} />
                                <span>Stock Bas</span>
                                <span className={styles.badge}>{lowStockProducts.length}</span>
                            </button>
                            <button
                                className={styles.quickAction}
                                onClick={addRecentArrivals}
                                disabled={recentProducts.length === 0}
                            >
                                <Clock size={20} />
                                <span>Nouveaux</span>
                                <span className={styles.badge}>{recentProducts.length}</span>
                            </button>
                        </div>
                    </section>

                    {/* Selection Summary */}
                    <section className={styles.section}>
                        <h2>Récapitulatif</h2>
                        <div className={styles.summary}>
                            <div className={styles.summaryRow}>
                                <span>Produits sélectionnés</span>
                                <strong>{printItems.length}</strong>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Total étiquettes</span>
                                <strong className={styles.totalLabels}>{totalLabels}</strong>
                            </div>
                        </div>

                        {printItems.length > 0 && (
                            <button className={styles.clearBtn} onClick={clearSelection}>
                                Tout désélectionner
                            </button>
                        )}
                    </section>

                    {/* Print Actions */}
                    <div className={styles.printActions}>
                        <button
                            className={styles.previewBtn}
                            onClick={() => setShowPreview(true)}
                            disabled={printItems.length === 0}
                        >
                            <Eye size={20} />
                            Aperçu
                        </button>
                        <button
                            className={styles.printBtn}
                            onClick={handlePrint}
                            disabled={printItems.length === 0 || isPrinting}
                        >
                            <Printer size={20} />
                            {isPrinting ? 'Impression...' : `Imprimer (${totalLabels})`}
                        </button>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div className={styles.overlay} onClick={() => setShowPreview(false)}>
                    <div className={styles.previewModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Aperçu</h2>
                            <button onClick={() => setShowPreview(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className={styles.previewContent}>
                            {printItems.length > 0 ? (
                                <iframe
                                    srcDoc={getPreviewHTML()}
                                    title="Label Preview"
                                    className={styles.previewIframe}
                                />
                            ) : (
                                <div className={styles.noPreview}>
                                    <AlertTriangle size={48} />
                                    <p>Sélectionnez un produit pour voir l'aperçu</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrintCenter;

import React, { useState, useMemo } from 'react';
import {
    AlertTriangle,
    Package,
    TrendingDown,
    ShoppingCart,
    Bell,
    RefreshCw,
    X,
    Check,
    Plus,
    Truck,
} from 'lucide-react';
import { useProductsStore, usePurchasesStore, type Product, type GoodsReceipt } from '@bonilo/shared/stores';
import { useSettings } from '../../../contexts/SettingsContext';
import { useToast } from '../../../components/feedback/Toast';
import { commandErrorMessage } from '../../../utils/commandError';
import styles from './StockAlerts.module.css';

interface StockAlert {
    id: string;
    product: Product;
    type: 'low' | 'outOfStock' | 'expiring';
    currentStock: number;
    minStock: number;
    unit: string;
    lastRestocked?: Date;
}

export const StockAlerts: React.FC = () => {
    const { formatCurrency } = useSettings();
    const toast = useToast();
    const { products, getLowStockProducts, getOutOfStockProducts } = useProductsStore();
    const { suppliers, purchaseOrders, addPurchaseOrder, goodsReceipts } = usePurchasesStore();

    // Modal state for ordering
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [orderQty, setOrderQty] = useState('');
    const [selectedSupplierId, setSelectedSupplierId] = useState('');

    // Get real alerts from the products store
    const lowStockProducts = getLowStockProducts();
    const outOfStockProducts = getOutOfStockProducts();

    // Get expiring products from goods receipts
    const expiringAlerts = useMemo(() => {
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        const expiringItems: StockAlert[] = [];
        const seenProducts = new Set<string>();

        // Sort receipts by newest first
        const sortedReceipts = [...goodsReceipts].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        sortedReceipts.forEach(receipt => {
            receipt.items.forEach(item => {
                if (item.expiryDate && !seenProducts.has(item.productId)) {
                    const expiryDate = new Date(item.expiryDate);
                    if (expiryDate <= thirtyDaysFromNow) {
                        const product = products.find(p => p.id === item.productId);
                        if (product && product.stock > 0) {
                            expiringItems.push({
                                id: `${item.id}-expiry`,
                                product,
                                type: 'expiring',
                                currentStock: product.stock,
                                minStock: product.minStock,
                                unit: product.unit,
                                lastRestocked: new Date(receipt.date),
                            });
                            seenProducts.add(product.id);
                        }
                    }
                }
            });
        });

        return expiringItems;
    }, [goodsReceipts, products]);

    const alerts = useMemo(() => {
        const alertsList: StockAlert[] = [];

        // Out of stock products
        outOfStockProducts.forEach(product => {
            alertsList.push({
                id: product.id,
                product,
                type: 'outOfStock',
                currentStock: product.stock,
                minStock: product.minStock,
                unit: product.unit,
            });
        });

        // Low stock products (not already in out of stock)
        lowStockProducts
            .filter(p => !outOfStockProducts.find(oos => oos.id === p.id))
            .forEach(product => {
                alertsList.push({
                    id: product.id,
                    product,
                    type: 'low',
                    currentStock: product.stock,
                    minStock: product.minStock,
                    unit: product.unit,
                });
            });

        // Add expiration alerts
        alertsList.push(...expiringAlerts);

        return alertsList;
    }, [lowStockProducts, outOfStockProducts, expiringAlerts]);

    const outOfStockCount = alerts.filter(a => a.type === 'outOfStock').length;
    const lowStockCount = alerts.filter(a => a.type === 'low').length;
    const expiringCount = expiringAlerts.length;

    // Handle order button click
    const handleOrderClick = (product: Product) => {
        setSelectedProduct(product);
        setOrderQty((product.minStock - product.stock + 5).toString()); // Suggest quantity to bring to min + 5
        setShowOrderModal(true);
    };

    // Create purchase order
    const handleCreateOrder = async () => {
        if (!selectedProduct || !selectedSupplierId || !orderQty) return;

        const supplier = suppliers.find(s => s.id === selectedSupplierId);
        if (!supplier) return;

        const productName = selectedProduct.name;
        try {
            await addPurchaseOrder({
                supplierId: selectedSupplierId,
                supplierName: supplier.name,
                items: [{
                    id: crypto.randomUUID(),
                    productId: selectedProduct.id,
                    productName: selectedProduct.name,
                    productBarcode: selectedProduct.barcode,
                    productEmoji: selectedProduct.emoji,
                    orderedQty: parseInt(orderQty),
                    receivedQty: 0,
                    purchasePrice: selectedProduct.purchasePrice,
                    total: parseInt(orderQty) * selectedProduct.purchasePrice,
                    unit: selectedProduct.unit,
                }],
                total: parseInt(orderQty) * selectedProduct.purchasePrice,
                subtotal: parseInt(orderQty) * selectedProduct.purchasePrice,
                taxAmount: 0,
                date: new Date().toISOString(),
                expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'draft',
            });
        } catch (err) {
            toast.error(commandErrorMessage(err, 'Échec de la création du bon de commande'));
            return;
        }

        setShowOrderModal(false);
        setSelectedProduct(null);
        setOrderQty('');
        setSelectedSupplierId('');
        toast.success(`Bon de commande créé pour ${productName}`);
    };

    // Get pending orders for a product
    const getPendingOrderQty = (productId: string) => {
        return purchaseOrders
            .filter(po => po.status === 'draft' || po.status === 'partial')
            .flatMap(po => po.items)
            .filter(item => item.productId === productId)
            .reduce((sum, item) => sum + (item.orderedQty - item.receivedQty), 0);
    };

    return (
        <div className={styles.stockAlerts}>
            {/* Summary */}
            <div className={styles.summaryRow}>
                <div className={`${styles.summaryCard} ${styles.danger}`}>
                    <Package size={24} />
                    <div>
                        <span className={styles.summaryValue}>{outOfStockCount}</span>
                        <span className={styles.summaryLabel}>Ruptures de stock</span>
                    </div>
                </div>
                <div className={`${styles.summaryCard} ${styles.warning}`}>
                    <TrendingDown size={24} />
                    <div>
                        <span className={styles.summaryValue}>{lowStockCount}</span>
                        <span className={styles.summaryLabel}>Stock bas</span>
                    </div>
                </div>
                <div className={`${styles.summaryCard} ${styles.expiring}`}>
                    <Bell size={24} />
                    <div>
                        <span className={styles.summaryValue}>{expiringCount}</span>
                        <span className={styles.summaryLabel}>Péremption proche</span>
                    </div>
                </div>
            </div>

            {/* Out of Stock Section */}
            {outOfStockCount > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <span className={styles.dangerDot}></span>
                        Ruptures de stock ({outOfStockCount})
                    </h3>
                    <div className={styles.alertsList}>
                        {alerts.filter(a => a.type === 'outOfStock').map(alert => {
                            const pendingQty = getPendingOrderQty(alert.product.id);
                            return (
                                <div key={alert.id} className={`${styles.alertCard} ${styles.outOfStock}`}>
                                    <div className={styles.alertLeft}>
                                        <span className={styles.alertEmoji}>{alert.product.emoji}</span>
                                        <div>
                                            <span className={styles.alertName}>{alert.product.name}</span>
                                            <span className={styles.alertMeta}>
                                                {alert.product.barcode} • Min: {alert.minStock} {alert.unit}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.alertRight}>
                                        <span className={styles.stockLabel}>
                                            Stock: <strong>0 / {alert.minStock}</strong> {alert.unit}
                                        </span>
                                        {pendingQty > 0 && (
                                            <span className={styles.pendingOrder}>
                                                <Truck size={12} /> {pendingQty} en commande
                                            </span>
                                        )}
                                        <button
                                            className={styles.orderBtn}
                                            onClick={() => handleOrderClick(alert.product)}
                                        >
                                            <ShoppingCart size={14} /> Commander
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Expiring Soon Section */}
            {expiringCount > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <span className={styles.expiringDot}></span>
                        Péremption proche ({expiringCount})
                    </h3>
                    <div className={styles.alertsList}>
                        {expiringAlerts.map(alert => {
                            const expiryDate = new Date(goodsReceipts.flatMap(r => r.items).find(i => i.productId === alert.product.id && i.expiryDate)?.expiryDate || '');
                            const daysDiff = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                            const isExpired = daysDiff <= 0;

                            return (
                                <div key={alert.id} className={`${styles.alertCard} ${isExpired ? styles.expired : styles.expiringSoon}`}>
                                    <div className={styles.alertLeft}>
                                        <span className={styles.alertEmoji}>{alert.product.emoji}</span>
                                        <div>
                                            <span className={styles.alertName}>{alert.product.name}</span>
                                            <span className={styles.alertMeta}>
                                                {alert.product.barcode} • Lot: {goodsReceipts.flatMap(r => r.items).find(i => i.productId === alert.product.id)?.lotNumber || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.alertRight}>
                                        <div className={styles.expiryInfo}>
                                            <span className={isExpired ? styles.expiredText : styles.expiringText}>
                                                {isExpired ? 'EXPIRÉ' : `Expire dans ${daysDiff} jours`}
                                            </span>
                                            <span className={styles.expiryDate}>
                                                Le {expiryDate.toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => toast.info('Action: Retrait du stock ou promotion')}
                                        >
                                            <TrendingDown size={14} /> Gérer
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Low Stock Section */}
            {lowStockCount > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <span className={styles.warningDot}></span>
                        Stock bas ({lowStockCount})
                    </h3>
                    <div className={styles.alertsList}>
                        {alerts.filter(a => a.type === 'low').map(alert => {
                            const pendingQty = getPendingOrderQty(alert.product.id);
                            const progressPercent = Math.min(100, (alert.currentStock / alert.minStock) * 100);
                            return (
                                <div key={alert.id} className={`${styles.alertCard} ${styles.lowStock}`}>
                                    <div className={styles.alertLeft}>
                                        <span className={styles.alertEmoji}>{alert.product.emoji}</span>
                                        <div>
                                            <span className={styles.alertName}>{alert.product.name}</span>
                                            <span className={styles.alertMeta}>
                                                {alert.product.barcode} • Prix: {formatCurrency(alert.product.purchasePrice)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.alertRight}>
                                        <div className={styles.stockProgress}>
                                            <span>{alert.currentStock} / {alert.minStock} {alert.unit}</span>
                                            <div className={styles.progressBar}>
                                                <div
                                                    className={styles.progressFill}
                                                    style={{ width: `${progressPercent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        {pendingQty > 0 && (
                                            <span className={styles.pendingOrder}>
                                                <Truck size={12} /> {pendingQty} en commande
                                            </span>
                                        )}
                                        <button
                                            className={styles.orderBtn}
                                            onClick={() => handleOrderClick(alert.product)}
                                        >
                                            <ShoppingCart size={14} /> Commander
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* No Alerts */}
            {alerts.length === 0 && (
                <div className={styles.emptyState}>
                    <Check size={48} />
                    <h3>Tous les stocks sont en ordre! 🎉</h3>
                    <p>Aucune alerte de stock pour le moment.</p>
                </div>
            )}

            {/* Order Modal */}
            {showOrderModal && selectedProduct && (
                <div className={styles.overlay} onClick={() => setShowOrderModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>🛒 Commander: {selectedProduct.emoji} {selectedProduct.name}</h2>
                            <button onClick={() => setShowOrderModal(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.productSummary}>
                                <div className={styles.productStat}>
                                    <span>Stock actuel</span>
                                    <strong>{selectedProduct.stock} {selectedProduct.unit}</strong>
                                </div>
                                <div className={styles.productStat}>
                                    <span>Stock minimum</span>
                                    <strong>{selectedProduct.minStock} {selectedProduct.unit}</strong>
                                </div>
                                <div className={styles.productStat}>
                                    <span>Prix d'achat</span>
                                    <strong>{formatCurrency(selectedProduct.purchasePrice)}</strong>
                                </div>
                            </div>

                            <label>Fournisseur</label>
                            <select
                                value={selectedSupplierId}
                                onChange={e => setSelectedSupplierId(e.target.value)}
                            >
                                <option value="">Sélectionner un fournisseur...</option>
                                {suppliers.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>

                            <label>Quantité à commander</label>
                            <input
                                type="number"
                                value={orderQty}
                                onChange={e => setOrderQty(e.target.value)}
                                placeholder="10"
                                min="1"
                            />

                            {orderQty && selectedSupplierId && (
                                <div className={styles.orderPreview}>
                                    <span>Total estimé:</span>
                                    <strong>
                                        {formatCurrency(parseInt(orderQty) * selectedProduct.purchasePrice)}
                                    </strong>
                                </div>
                            )}
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowOrderModal(false)}>Annuler</button>
                            <button
                                className={styles.confirmBtn}
                                onClick={handleCreateOrder}
                                disabled={!selectedSupplierId || !orderQty || parseInt(orderQty) <= 0}
                            >
                                <Plus size={18} /> Créer le bon de commande
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockAlerts;

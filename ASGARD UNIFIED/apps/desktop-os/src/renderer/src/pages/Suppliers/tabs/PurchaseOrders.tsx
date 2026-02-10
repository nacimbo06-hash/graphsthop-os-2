import React, { useState, useMemo } from 'react';
import {
    FileText,
    Plus,
    Search,
    CheckCircle,
    Clock,
    AlertCircle,
    Eye,
    Printer,
    X,
    Truck,
    Package,
    Trash2,
    Save,
    ShoppingCart,
} from 'lucide-react';
import { 
    usePurchasesStore,
    useProductsStore,
    type PurchaseOrder,
    type PurchaseItem,
    type Product
} from '@asgard/shared/stores';
import { useSettings } from '../../../contexts/SettingsContext';
import { useToast } from '../../../components/feedback/Toast';
import styles from './PurchaseOrders.module.css';

export const PurchaseOrders: React.FC = () => {
    const { formatCurrency } = useSettings();
    const { purchaseOrders, suppliers, addPurchaseOrder, updatePurchaseOrder } = usePurchasesStore();
    const { products } = useProductsStore();
    const toast = useToast();

    // Local state
    const [showNewModal, setShowNewModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Form state for new PO
    const [newOrderSupplierId, setNewOrderSupplierId] = useState('');
    const [newOrderDate, setNewOrderDate] = useState(new Date().toISOString().split('T')[0]);
    const [newOrderExpectedDate, setNewOrderExpectedDate] = useState('');
    const [orderItems, setOrderItems] = useState<PurchaseItem[]>([]);
    const [productSearch, setProductSearch] = useState('');

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const getStatusBadge = (status: PurchaseOrder['status']) => {
        const config = {
            draft: { label: 'Brouillon', icon: <FileText size={12} />, class: styles.draft },
            sent: { label: 'Envoyé', icon: <Clock size={12} />, class: styles.sent },
            partial: { label: 'Partiel', icon: <AlertCircle size={12} />, class: styles.partial },
            complete: { label: 'Complet', icon: <CheckCircle size={12} />, class: styles.complete },
            cancelled: { label: 'Annulé', icon: <X size={12} />, class: styles.cancelled },
        };
        const item = config[status] || config.draft;
        return <span className={`${styles.statusBadge} ${item.class}`}>{item.icon} {item.label}</span>;
    };

    const filteredOrders = useMemo(() =>
        purchaseOrders.filter(o =>
            (filterStatus === 'all' || o.status === filterStatus) &&
            (o.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.supplierName.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        , [purchaseOrders, filterStatus, searchQuery]);

    // Filtered products for search
    const filteredProducts = useMemo(() => {
        if (!productSearch) return [];
        return products.filter(p =>
            p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
            p.barcode.includes(productSearch) ||
            p.sku.includes(productSearch)
        ).slice(0, 10);
    }, [products, productSearch]);

    // Add product to order
    const addProductToOrder = (product: Product) => {
        if (orderItems.some(item => item.productId === product.id)) {
            toast.warning('Ce produit est déjà dans la commande');
            return;
        }

        const newItem: PurchaseItem = {
            id: `item_${Date.now()}`,
            productId: product.id,
            productName: product.name,
            productBarcode: product.barcode,
            productEmoji: product.emoji,
            orderedQty: 1,
            receivedQty: 0,
            purchasePrice: product.purchasePrice,
            total: product.purchasePrice,
            unit: product.unit,
        };

        setOrderItems([...orderItems, newItem]);
        setProductSearch('');
    };

    // Update item quantity
    const updateItemQty = (itemId: string, qty: number) => {
        setOrderItems(orderItems.map(item => {
            if (item.id === itemId) {
                return { ...item, orderedQty: qty, total: qty * item.purchasePrice };
            }
            return item;
        }));
    };

    // Update item price
    const updateItemPrice = (itemId: string, price: number) => {
        setOrderItems(orderItems.map(item => {
            if (item.id === itemId) {
                return { ...item, purchasePrice: price, total: item.orderedQty * price };
            }
            return item;
        }));
    };

    // Remove item from order
    const removeItem = (itemId: string) => {
        setOrderItems(orderItems.filter(item => item.id !== itemId));
    };

    // Calculate order totals
    const orderSubtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
    const orderTax = Math.round(orderSubtotal * 0.19); // 19% TVA
    const orderTotal = orderSubtotal + orderTax;

    const handleCreateOrder = () => {
        const supplier = suppliers.find(s => s.id === newOrderSupplierId);
        if (!supplier) {
            toast.warning('Veuillez sélectionner un fournisseur');
            return;
        }

        if (orderItems.length === 0) {
            toast.warning('Ajoutez au moins un produit à la commande');
            return;
        }

        addPurchaseOrder({
            supplierId: supplier.id,
            supplierName: supplier.name,
            date: newOrderDate,
            expectedDate: newOrderExpectedDate || newOrderDate,
            status: 'draft',
            items: orderItems,
            subtotal: orderSubtotal,
            taxAmount: orderTax,
            total: orderTotal,
        });

        // Reset form
        setShowNewModal(false);
        setNewOrderSupplierId('');
        setNewOrderExpectedDate('');
        setOrderItems([]);
        toast.success(`Bon de commande créé pour ${supplier.name}`);
    };

    const handleViewOrder = (order: PurchaseOrder) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    const handleSendOrder = (orderId: string) => {
        updatePurchaseOrder(orderId, { status: 'sent' });
        toast.success('Commande envoyée au fournisseur');
        setShowDetailModal(false);
    };

    const handlePrintOrder = (order: PurchaseOrder) => {
        toast.info(`Impression de la commande ${order.poNumber}...`);
        window.print();
    };

    return (
        <div className={styles.purchaseOrders}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher par N° ou fournisseur..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className={styles.filters}>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="all">Tous les statuts</option>
                        <option value="draft">Brouillon</option>
                        <option value="sent">Envoyé</option>
                        <option value="partial">Partiel</option>
                        <option value="complete">Complet</option>
                        <option value="cancelled">Annulé</option>
                    </select>
                </div>
                <button className={styles.newBtn} onClick={() => setShowNewModal(true)}>
                    <Plus size={18} /> Nouvelle commande
                </button>
            </div>

            {/* Orders Table */}
            <div className={styles.ordersTable}>
                <div className={styles.tableHeader}>
                    <span>N° Commande</span>
                    <span>Fournisseur</span>
                    <span>Date</span>
                    <span>Date prévue</span>
                    <span>Articles</span>
                    <span>Total</span>
                    <span>Statut</span>
                    <span>Actions</span>
                </div>
                {filteredOrders.length === 0 ? (
                    <div className={styles.emptyTable}>
                        <FileText size={48} />
                        <p>Aucune commande trouvée</p>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order.id} className={styles.tableRow}>
                            <span className={styles.orderNumber}>{order.poNumber}</span>
                            <span className={styles.supplier}>
                                <Truck size={14} /> {order.supplierName}
                            </span>
                            <span>{formatDate(order.date)}</span>
                            <span>{formatDate(order.expectedDate)}</span>
                            <span><Package size={14} /> {order.items.length}</span>
                            <span className={styles.total}>{formatCurrency(order.total)}</span>
                            {getStatusBadge(order.status)}
                            <div className={styles.actions}>
                                <button title="Voir" onClick={() => handleViewOrder(order)}><Eye size={16} /></button>
                                <button title="Imprimer" onClick={() => handlePrintOrder(order)}><Printer size={16} /></button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* New Order Modal */}
            {showNewModal && (
                <div className={styles.overlay} onClick={() => setShowNewModal(false)}>
                    <div className={styles.modalLarge} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2><ShoppingCart size={20} /> Nouvelle commande (Bon de Commande)</h2>
                            <button onClick={() => setShowNewModal(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            {/* Supplier & Dates */}
                            <div className={styles.formSection}>
                                <div className={styles.formGroup}>
                                    <label>Fournisseur *</label>
                                    <select
                                        value={newOrderSupplierId}
                                        onChange={(e) => setNewOrderSupplierId(e.target.value)}
                                    >
                                        <option value="">Sélectionner un fournisseur...</option>
                                        {suppliers.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Date de commande</label>
                                        <input
                                            type="date"
                                            value={newOrderDate}
                                            onChange={(e) => setNewOrderDate(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Date de livraison prévue</label>
                                        <input
                                            type="date"
                                            value={newOrderExpectedDate}
                                            onChange={(e) => setNewOrderExpectedDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Product Selection */}
                            <div className={styles.productSection}>
                                <h4><Package size={18} /> Ajouter des produits</h4>
                                <div className={styles.productSearchBox}>
                                    <Search size={18} />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un produit par nom, code-barres ou SKU..."
                                        value={productSearch}
                                        onChange={(e) => setProductSearch(e.target.value)}
                                    />
                                </div>
                                {productSearch && filteredProducts.length > 0 && (
                                    <div className={styles.productResults}>
                                        {filteredProducts.map(product => (
                                            <div
                                                key={product.id}
                                                className={styles.productResult}
                                                onClick={() => addProductToOrder(product)}
                                            >
                                                <span className={styles.productEmoji}>{product.emoji}</span>
                                                <div className={styles.productInfo}>
                                                    <span className={styles.productName}>{product.name}</span>
                                                    <span className={styles.productMeta}>
                                                        SKU: {product.sku} | Stock: {product.stock} | {formatCurrency(product.purchasePrice)}
                                                    </span>
                                                </div>
                                                <Plus size={20} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Order Items */}
                            <div className={styles.orderItemsSection}>
                                <h4>Articles commandés ({orderItems.length})</h4>
                                {orderItems.length === 0 ? (
                                    <div className={styles.emptyItems}>
                                        <Package size={32} />
                                        <p>Recherchez et ajoutez des produits à la commande</p>
                                    </div>
                                ) : (
                                    <div className={styles.itemsList}>
                                        {orderItems.map(item => (
                                            <div key={item.id} className={styles.orderItem}>
                                                <span className={styles.itemEmoji}>{item.productEmoji}</span>
                                                <div className={styles.itemInfo}>
                                                    <span className={styles.itemName}>{item.productName}</span>
                                                    <span className={styles.itemBarcode}>{item.productBarcode}</span>
                                                </div>
                                                <div className={styles.itemQty}>
                                                    <label>Qté</label>
                                                    <input
                                                        type="number"
                                                        value={item.orderedQty}
                                                        onChange={(e) => updateItemQty(item.id, parseInt(e.target.value) || 1)}
                                                        min="1"
                                                    />
                                                </div>
                                                <div className={styles.itemPrice}>
                                                    <label>Prix achat</label>
                                                    <input
                                                        type="number"
                                                        value={item.purchasePrice}
                                                        onChange={(e) => updateItemPrice(item.id, parseFloat(e.target.value) || 0)}
                                                    />
                                                </div>
                                                <div className={styles.itemTotal}>
                                                    {formatCurrency(item.total)}
                                                </div>
                                                <button className={styles.removeItemBtn} onClick={() => removeItem(item.id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Order Summary */}
                            {orderItems.length > 0 && (
                                <div className={styles.orderSummary}>
                                    <div className={styles.summaryRow}>
                                        <span>Sous-total</span>
                                        <span>{formatCurrency(orderSubtotal)}</span>
                                    </div>
                                    <div className={styles.summaryRow}>
                                        <span>TVA (19%)</span>
                                        <span>{formatCurrency(orderTax)}</span>
                                    </div>
                                    <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                                        <span>Total</span>
                                        <span>{formatCurrency(orderTotal)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowNewModal(false)}>Annuler</button>
                            <button
                                className={styles.confirmBtn}
                                onClick={handleCreateOrder}
                                disabled={!newOrderSupplierId || orderItems.length === 0}
                            >
                                <Save size={18} /> Créer la commande
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Detail Modal */}
            {showDetailModal && selectedOrder && (
                <div className={styles.overlay} onClick={() => setShowDetailModal(false)}>
                    <div className={styles.modalLarge} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div>
                                <h2>{selectedOrder.poNumber}</h2>
                                <span className={styles.orderSupplier}>{selectedOrder.supplierName}</span>
                            </div>
                            <button onClick={() => setShowDetailModal(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.orderMeta}>
                                <div>
                                    <span className={styles.metaLabel}>Date de commande</span>
                                    <span className={styles.metaValue}>{formatDate(selectedOrder.date)}</span>
                                </div>
                                <div>
                                    <span className={styles.metaLabel}>Livraison prévue</span>
                                    <span className={styles.metaValue}>{formatDate(selectedOrder.expectedDate)}</span>
                                </div>
                                <div>
                                    <span className={styles.metaLabel}>Statut</span>
                                    {getStatusBadge(selectedOrder.status)}
                                </div>
                            </div>

                            <div className={styles.orderItemsSection}>
                                <h4>Articles ({selectedOrder.items.length})</h4>
                                <div className={styles.itemsList}>
                                    {selectedOrder.items.map(item => (
                                        <div key={item.id} className={styles.orderItem}>
                                            <span className={styles.itemEmoji}>{item.productEmoji}</span>
                                            <div className={styles.itemInfo}>
                                                <span className={styles.itemName}>{item.productName}</span>
                                                <span className={styles.itemBarcode}>{item.productBarcode}</span>
                                            </div>
                                            <div className={styles.itemQtyDisplay}>
                                                <span>{item.orderedQty} x {formatCurrency(item.purchasePrice)}</span>
                                            </div>
                                            <div className={styles.itemTotal}>
                                                {formatCurrency(item.total)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.orderSummary}>
                                <div className={styles.summaryRow}>
                                    <span>Sous-total</span>
                                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>TVA</span>
                                    <span>{formatCurrency(selectedOrder.taxAmount)}</span>
                                </div>
                                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                                    <span>Total</span>
                                    <span>{formatCurrency(selectedOrder.total)}</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => handlePrintOrder(selectedOrder)} className={styles.printBtn}>
                                <Printer size={18} /> Imprimer
                            </button>
                            <div style={{ flex: 1 }}></div>
                            <button onClick={() => setShowDetailModal(false)}>Fermer</button>
                            {selectedOrder.status === 'draft' && (
                                <button
                                    className={styles.confirmBtn}
                                    onClick={() => handleSendOrder(selectedOrder.id)}
                                >
                                    <Truck size={18} /> Envoyer au fournisseur
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseOrders;

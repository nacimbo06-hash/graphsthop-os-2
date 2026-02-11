import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
    Package,
    Barcode,
    Plus,
    Minus,
    X,
    Check,
    AlertCircle,
    Search,
    Truck,
    Calendar,
    FileText,
    Save,
    Trash2,
    RefreshCw,
    CheckCircle,
    Camera,
    CreditCard,
    DollarSign,
    Lock,
} from 'lucide-react';
import { ExpiryQuickInput } from '../../components/domain/expiry';
import { 
    useProductsStore,
    usePurchasesStore,
    useTreasuryStore,
    useStockMovementsStore,
    useLotsStore,
    type Product,
    type PurchaseItem
} from '@bonilo/shared/stores';
import { useSettings } from '../../contexts/SettingsContext';
import { useToast } from '../../components/feedback/Toast';
import styles from './GoodsReceipt.module.css';

interface ReceiptLine {
    id: string;
    product: Product;
    orderedQty: number;
    receivedQty: number;      // Quantity received (in selected unit)
    receiveAs: 'units' | 'cartons';  // Changed from 'packs' to 'cartons' for clarity
    unitsPerCarton: number;   // Copied from product.unitsPerCarton
    totalUnits: number;       // Calculated: receivedQty * unitsPerCarton (if cartons) or receivedQty (if units)
    purchasePrice: number;
    total: number;
    expiryDate: Date | null;
    lotNumber?: string;
}

export const GoodsReceipt: React.FC = () => {
    const { formatCurrency } = useSettings();
    const { products, updateStock } = useProductsStore();
    const { suppliers, goodsReceipts, addGoodsReceipt } = usePurchasesStore();
    const { currentSession, addExpense, addMovement, safeBalance, getCurrentBalance, withdrawFromSafe } = useTreasuryStore();
    const { addMovement: addStockMovement } = useStockMovementsStore();
    const { addLot } = useLotsStore();
    const toast = useToast();

    // Auto-generate invoice number
    const generateInvoiceNumber = () => {
        const today = new Date();
        const prefix = 'FAC';
        const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
        const seq = String(goodsReceipts.length + 1).padStart(4, '0');
        return `${prefix}-${dateStr}-${seq}`;
    };

    // State
    const [receiptLines, setReceiptLines] = useState<ReceiptLine[]>([]);
    const [barcodeInput, setBarcodeInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSupplierId, setSelectedSupplierId] = useState('');
    const [receiptNumber, setReceiptNumber] = useState(`BE-${Date.now().toString().slice(-6)}`);
    const [receiptDate, setReceiptDate] = useState(new Date().toISOString().split('T')[0]);
    const [invoiceNumber, setInvoiceNumber] = useState(generateInvoiceNumber());
    const [showProductSearch, setShowProductSearch] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [lastScannedProduct, setLastScannedProduct] = useState<Product | null>(null);
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

    // Payment status in receipt
    const [isPaid, setIsPaid] = useState(true);
    const [paymentSource, setPaymentSource] = useState<'cash' | 'safe'>('cash');

    // View past receipt modal
    const [viewReceiptId, setViewReceiptId] = useState<string | null>(null);
    const viewingReceipt = useMemo(() =>
        viewReceiptId ? goodsReceipts.find(r => r.id === viewReceiptId) : null
        , [viewReceiptId, goodsReceipts]);

    const barcodeInputRef = useRef<HTMLInputElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const selectedSupplier = useMemo(() =>
        suppliers.find(s => s.id === selectedSupplierId) || null
        , [suppliers, selectedSupplierId]);

    // Focus barcode input on mount
    useEffect(() => {
        barcodeInputRef.current?.focus();
    }, []);

    // Calculate totals
    const totalAmount = useMemo(() => receiptLines.reduce((sum, line) => sum + line.total, 0), [receiptLines]);
    const totalItems = useMemo(() => receiptLines.reduce((sum, line) => sum + line.totalUnits, 0), [receiptLines]);
    const completedLines = useMemo(() => receiptLines.filter(l => l.receivedQty >= l.orderedQty).length, [receiptLines]);

    // Handle barcode scan/input
    const handleBarcodeSubmit = useCallback((e?: React.FormEvent) => {
        e?.preventDefault();
        const barcode = barcodeInput.trim();
        if (!barcode) return;

        setIsScanning(true);

        // Simulate scan delay for visual feedback
        setTimeout(() => {
            const product = products.find(p => p.barcode === barcode);

            if (product) {
                setReceiptLines(prevLines => {
                    const existingLineIndex = prevLines.findIndex(l => l.product.id === product.id);
                    const cartonUnits = product.unitsPerCarton || 1;

                    if (existingLineIndex > -1) {
                        const newLines = [...prevLines];
                        const line = newLines[existingLineIndex];
                        const newReceivedQty = line.receivedQty + 1;
                        const newTotalUnits = line.receiveAs === 'cartons'
                            ? newReceivedQty * line.unitsPerCarton
                            : newReceivedQty;
                        newLines[existingLineIndex] = {
                            ...line,
                            receivedQty: newReceivedQty,
                            totalUnits: newTotalUnits,
                            total: newTotalUnits * line.purchasePrice,
                        };
                        return newLines;
                    } else {
                        const newLine: ReceiptLine = {
                            id: crypto.randomUUID(),
                            product,
                            orderedQty: 1,
                            receivedQty: 1,
                            receiveAs: 'units',
                            unitsPerCarton: cartonUnits,
                            totalUnits: 1,
                            purchasePrice: product.purchasePrice || 0,
                            total: product.purchasePrice || 0,
                            expiryDate: null,
                        };
                        return [newLine, ...prevLines];
                    }
                });

                setLastScannedProduct(product);
                setShowSuccessAnimation(true);
                setTimeout(() => setShowSuccessAnimation(false), 1000);
            } else {
                toast.warning(`Produit non trouvé: ${barcode}`);
            }

            setBarcodeInput('');
            setIsScanning(false);
            barcodeInputRef.current?.focus();
        }, 200);
    }, [barcodeInput, products]);

    // Actions
    const handleQuantityChange = (lineId: string, newQty: number) => {
        if (newQty < 0) return;
        setReceiptLines(lines => lines.map(l => {
            if (l.id !== lineId) return l;
            const newTotalUnits = l.receiveAs === 'cartons' ? newQty * l.unitsPerCarton : newQty;
            return {
                ...l,
                receivedQty: newQty,
                totalUnits: newTotalUnits,
                total: newTotalUnits * l.purchasePrice
            };
        }));
    };

    const handleOrderedQtyChange = (lineId: string, newQty: number) => {
        if (newQty < 0) return;
        setReceiptLines(lines => lines.map(l =>
            l.id === lineId ? { ...l, orderedQty: newQty } : l
        ));
    };

    const handleReceiveAsChange = (lineId: string, receiveAs: 'units' | 'cartons') => {
        setReceiptLines(lines => lines.map(l => {
            if (l.id !== lineId) return l;
            const newTotalUnits = receiveAs === 'cartons' ? l.receivedQty * l.unitsPerCarton : l.receivedQty;
            return {
                ...l,
                receiveAs,
                totalUnits: newTotalUnits,
                total: newTotalUnits * l.purchasePrice
            };
        }));
    };

    const handlePriceChange = (lineId: string, newPrice: number) => {
        if (newPrice < 0) return;
        setReceiptLines(lines => lines.map(l =>
            l.id === lineId ? { ...l, purchasePrice: newPrice, total: l.totalUnits * newPrice } : l
        ));
    };

    const handleRemoveLine = (lineId: string) => {
        setReceiptLines(lines => lines.filter(l => l.id !== lineId));
    };

    const handleExpiryChange = (lineId: string, expiryDate: Date | null) => {
        setReceiptLines(lines => lines.map(l =>
            l.id === lineId ? { ...l, expiryDate } : l
        ));
    };

    const handleLotChange = (lineId: string, lotNumber: string) => {
        setReceiptLines(lines => lines.map(l =>
            l.id === lineId ? { ...l, lotNumber } : l
        ));
    };

    const handleAddProduct = (product: Product) => {
        const existingLine = receiptLines.find(l => l.product.id === product.id);

        if (existingLine) {
            handleQuantityChange(existingLine.id, existingLine.receivedQty + 1);
        } else {
            const cartonUnits = product.unitsPerCarton || 1;
            const newLine: ReceiptLine = {
                id: crypto.randomUUID(),
                product,
                orderedQty: 1,
                receivedQty: 1,
                receiveAs: 'units',
                unitsPerCarton: cartonUnits,
                totalUnits: 1,
                purchasePrice: product.purchasePrice || 0,
                total: product.purchasePrice || 0,
                expiryDate: null,
            };
            setReceiptLines([newLine, ...receiptLines]);
        }

        setShowProductSearch(false);
        setSearchQuery('');
        barcodeInputRef.current?.focus();
    };

    const filteredProducts = useMemo(() =>
        products.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.barcode.includes(searchQuery) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 50)
        , [products, searchQuery]);

    const handleSaveReceipt = () => {
        if (receiptLines.length === 0) {
            toast.warning('Ajoutez au moins un produit');
            return;
        }
        if (!selectedSupplier) {
            toast.warning('Sélectionnez un fournisseur');
            return;
        }

        // Check funds if paid
        if (isPaid) {
            const available = paymentSource === 'cash' ? getCurrentBalance() : safeBalance;
            if (available < totalAmount) {
                toast.error(`Fonds insuffisants en ${paymentSource === 'cash' ? 'caisse' : 'coffre'}`);
                return;
            }
        }

        setShowConfirmModal(true);
    };

    const handleConfirmReceipt = () => {
        if (!selectedSupplier) return;

        // 1. Create Goods Receipt
        const purchaseItems: PurchaseItem[] = receiptLines.map(line => ({
            id: crypto.randomUUID(),
            productId: line.product.id,
            productName: line.product.name,
            productBarcode: line.product.barcode,
            productEmoji: line.product.emoji,
            orderedQty: line.orderedQty,
            receivedQty: line.receivedQty,
            purchasePrice: line.purchasePrice,
            total: line.total,
            expiryDate: line.expiryDate?.toISOString(),
            unit: line.product.unit,
        }));

        addGoodsReceipt({
            supplierId: selectedSupplier.id,
            supplierName: selectedSupplier.name,
            date: receiptDate,
            invoiceNumber,
            items: purchaseItems,
            total: totalAmount,
            status: 'completed',
            isPaid,
            paidFrom: isPaid ? paymentSource : undefined,
        });

        // 2. Update stock and track movements
        receiptLines.forEach(line => {
            // Track stock movement
            addStockMovement({
                type: 'entry',
                productId: line.product.id,
                productName: line.product.name,
                productEmoji: line.product.emoji,
                quantity: line.totalUnits, // Use totalUnits for accurate stock tracking
                previousStock: line.product.stock,
                newStock: line.product.stock + line.totalUnits,
                reason: line.receiveAs === 'cartons'
                    ? `Réception ${receiptNumber} (${line.receivedQty} cartons × ${line.unitsPerCarton}u)`
                    : `Réception ${receiptNumber}`,
                performedBy: 'Admin',
                reference: receiptNumber,
            });

            // Update stock - use totalUnits for accurate count
            updateStock(line.product.id, line.totalUnits, 'add');

            // 2.1 Create Lot if expiry info is present OR product is perishable
            if (line.expiryDate || line.product.isPerishable) {
                addLot({
                    productId: line.product.id,
                    productName: line.product.name,
                    productBarcode: line.product.barcode,
                    lotNumber: line.lotNumber || `LOT-${receiptNumber.slice(-4)}-${line.product.sku || line.product.id.slice(-4)}`,
                    quantity: line.totalUnits, // Use totalUnits
                    originalQuantity: line.totalUnits,
                    expiryDate: line.expiryDate
                        ? line.expiryDate.toISOString()
                        : new Date(Date.now() + (line.product.shelfLifeDays || 30) * 24 * 60 * 60 * 1000).toISOString(),
                    receivedDate: new Date().toISOString(),
                    supplierId: selectedSupplier.id,
                    supplierName: selectedSupplier.name,
                    goodsReceiptId: receiptNumber,
                    purchasePrice: line.purchasePrice,
                });
            }
        });

        // 3. Handle treasury if paid
        if (isPaid) {
            const expenseDesc = `Achat stock: ${selectedSupplier.name} (${receiptNumber})`;

            if (paymentSource === 'cash') {
                if (!currentSession) {
                    toast.warning('Session de caisse fermée. Paiement enregistré comme dette fournisseur.');
                } else {
                    // Add movement to deduct from cash balance
                    addMovement({
                        type: 'expense',
                        amount: totalAmount,
                        reason: expenseDesc,
                        reference: receiptNumber,
                        createdBy: 'Admin',
                    });

                    // Also record in expenses for reporting
                    addExpense({
                        description: expenseDesc,
                        amount: totalAmount,
                        category: 'Achats',
                        paymentMethod: 'cash',
                        date: new Date().toISOString(),
                    }, true, 'cash');
                }
            } else {
                // Payment from Safe
                withdrawFromSafe(totalAmount, expenseDesc, 'Admin');
                addExpense({
                    description: expenseDesc,
                    amount: totalAmount,
                    category: 'Achats',
                    paymentMethod: 'safe',
                    date: new Date().toISOString(),
                }, true, 'safe');
            }
        }

        // Reset form
        setReceiptLines([]);
        setSelectedSupplierId('');
        setInvoiceNumber('');
        setReceiptNumber(`BE-${Date.now().toString().slice(-6)}`);
        setShowConfirmModal(false);

        toast.success('Bon d\'entrée enregistré et stock mis à jour!');
    };

    const getStatusBadge = (ordered: number, received: number) => {
        if (received === 0) return <span className={`${styles.statusBadge} ${styles.pending}`}>En attente</span>;
        if (received === ordered) return <span className={`${styles.statusBadge} ${styles.complete}`}><Check size={12} /> Complet</span>;
        if (received > ordered) return <span className={`${styles.statusBadge} ${styles.excess}`}><Plus size={12} /> Excédent</span>;
        return <span className={`${styles.statusBadge} ${styles.partial}`}><AlertCircle size={12} /> Partiel</span>;
    };

    return (
        <div className={styles.goodsReceipt}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1>
                        <Package size={28} />
                        Bon d'Entrée
                    </h1>
                    <span className={styles.receiptNumber}>{receiptNumber}</span>
                </div>
                <div className={styles.headerRight}>
                    <button className={styles.resetBtn} onClick={() => setReceiptLines([])}>
                        <RefreshCw size={18} />
                        Nouveau
                    </button>
                    <button
                        className={styles.saveBtn}
                        onClick={handleSaveReceipt}
                        disabled={receiptLines.length === 0}
                    >
                        <Save size={18} />
                        Enregistrer
                    </button>
                </div>
            </div>

            {/* Receipt Info */}
            <div className={styles.receiptInfo}>
                <div className={styles.infoField}>
                    <label><Calendar size={16} /> Date</label>
                    <input
                        type="date"
                        value={receiptDate}
                        onChange={(e) => setReceiptDate(e.target.value)}
                    />
                </div>
                <div className={styles.infoField}>
                    <label><Truck size={16} /> Fournisseur</label>
                    <select
                        value={selectedSupplierId}
                        onChange={(e) => setSelectedSupplierId(e.target.value)}
                    >
                        <option value="">Sélectionner...</option>
                        {suppliers.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.infoField}>
                    <label><FileText size={16} /> N° Facture</label>
                    <input
                        type="text"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        placeholder="FAC-00000"
                    />
                </div>
                <div className={styles.paymentField}>
                    <label><CreditCard size={16} /> Paiement</label>
                    <div className={styles.paymentToggle}>
                        <button
                            className={isPaid ? styles.active : ''}
                            onClick={() => setIsPaid(true)}
                        >Payé</button>
                        <button
                            className={!isPaid ? styles.active : ''}
                            onClick={() => setIsPaid(false)}
                        >Crédit</button>
                    </div>
                </div>
            </div>

            {/* Barcode Scanner Section */}
            <div className={`${styles.scannerSection} ${isScanning ? styles.scanning : ''} ${showSuccessAnimation ? styles.success : ''}`}>
                <div className={styles.scannerIcon}>
                    <Barcode size={32} />
                </div>
                <form onSubmit={handleBarcodeSubmit} className={styles.scannerForm}>
                    <input
                        ref={barcodeInputRef}
                        type="text"
                        value={barcodeInput}
                        onChange={(e) => setBarcodeInput(e.target.value)}
                        placeholder="Scanner ou saisir le code-barres..."
                        className={styles.barcodeInput}
                        autoComplete="off"
                    />
                    <button type="submit" className={styles.scanBtn}>
                        <Camera size={20} />
                    </button>
                </form>
                <button
                    className={styles.searchProductBtn}
                    onClick={() => {
                        setShowProductSearch(true);
                        setTimeout(() => searchInputRef.current?.focus(), 100);
                    }}
                >
                    <Search size={18} />
                    Rechercher produit
                </button>

                {lastScannedProduct && showSuccessAnimation && (
                    <div className={styles.lastScanned}>
                        <CheckCircle size={18} />
                        {lastScannedProduct.emoji} {lastScannedProduct.name} ajouté!
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>
                {/* Products List */}
                <div className={styles.productsList}>
                    <div className={styles.listHeader}>
                        <h2>Produits reçus</h2>
                        <span className={styles.itemCount}>
                            {receiptLines.length} articles • {totalItems} unités
                        </span>
                    </div>

                    {receiptLines.length === 0 ? (
                        <div className={styles.emptyState}>
                            <Barcode size={48} />
                            <p>Scannez un code-barres pour ajouter des produits</p>
                        </div>
                    ) : (
                        <div className={styles.linesTable}>
                            <div className={styles.tableHeader}>
                                <span>Produit</span>
                                <span>Qté Reçue</span>
                                <span>Prix U.</span>
                                <span>Lot / Expiration</span>
                                <span>Total</span>
                                <span></span>
                            </div>
                            {receiptLines.map(line => (
                                <div key={line.id} className={styles.lineRow}>
                                    <div className={styles.productInfo}>
                                        <span className={styles.emoji}>{line.product.emoji}</span>
                                        <div>
                                            <span className={styles.productName}>{line.product.name}</span>
                                            <span className={styles.barcode}>{line.product.barcode}</span>
                                        </div>
                                    </div>
                                    <div className={styles.qtyField}>
                                        <button onClick={() => handleQuantityChange(line.id, line.receivedQty - 1)}>
                                            <Minus size={14} />
                                        </button>
                                        <input
                                            type="number"
                                            value={line.receivedQty}
                                            onChange={(e) => handleQuantityChange(line.id, parseInt(e.target.value) || 0)}
                                        />
                                        <button onClick={() => handleQuantityChange(line.id, line.receivedQty + 1)}>
                                            <Plus size={14} />
                                        </button>
                                        {/* Units/Cartons Toggle */}
                                        {line.unitsPerCarton > 1 && (
                                            <select
                                                className={styles.receiveAsSelect}
                                                value={line.receiveAs}
                                                onChange={(e) => handleReceiveAsChange(line.id, e.target.value as 'units' | 'cartons')}
                                            >
                                                <option value="units">Unités</option>
                                                <option value="cartons">Cartons ({line.unitsPerCarton}/crt)</option>
                                            </select>
                                        )}
                                        {/* Show total units when receiving as cartons */}
                                        {line.receiveAs === 'cartons' && (
                                            <span className={styles.totalUnitsInfo}>
                                                = {line.totalUnits} unités
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.priceField}>
                                        <input
                                            type="number"
                                            value={line.purchasePrice}
                                            onChange={(e) => handlePriceChange(line.id, parseFloat(e.target.value) || 0)}
                                        />
                                        <span>DA</span>
                                    </div>
                                    <div className={styles.lotExpiryField}>
                                        <input
                                            type="text"
                                            className={styles.lotInput}
                                            value={line.lotNumber || ''}
                                            onChange={(e) => handleLotChange(line.id, e.target.value)}
                                            placeholder="N° Lot"
                                        />
                                        <input
                                            type="date"
                                            className={styles.expiryInput}
                                            value={line.expiryDate ? line.expiryDate.toISOString().split('T')[0] : ''}
                                            onChange={(e) => handleExpiryChange(line.id, e.target.value ? new Date(e.target.value) : null)}
                                        />
                                    </div>
                                    <span className={styles.lineTotal}>{formatCurrency(line.total)}</span>
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => handleRemoveLine(line.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Summary */}
                <div className={styles.summary}>
                    <h3>Récapitulatif</h3>
                    <div className={styles.summaryRow}>
                        <span>Articles</span>
                        <span>{receiptLines.length}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Unités totales</span>
                        <span>{totalItems}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Lignes complètes</span>
                        <span className={styles.complete}>{completedLines}/{receiptLines.length}</span>
                    </div>

                    {isPaid && (
                        <div className={styles.paymentSourceBox}>
                            <label>Source du paiement</label>
                            <div className={styles.sourceToggle}>
                                <button
                                    className={paymentSource === 'cash' ? styles.active : ''}
                                    onClick={() => setPaymentSource('cash')}
                                >
                                    <DollarSign size={14} /> Caisse
                                </button>
                                <button
                                    className={paymentSource === 'safe' ? styles.active : ''}
                                    onClick={() => setPaymentSource('safe')}
                                >
                                    <Lock size={14} /> Coffre
                                </button>
                            </div>
                        </div>
                    )}

                    <div className={styles.summaryTotal}>
                        <span>TOTAL</span>
                        <span>{formatCurrency(totalAmount)}</span>
                    </div>

                    {selectedSupplier && (
                        <div className={styles.supplierInfo}>
                            <Truck size={16} />
                            <div>
                                <strong>{selectedSupplier.name}</strong>
                                <span>{selectedSupplier.phone}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Receipt History */}
            <div className={styles.historySection}>
                <div className={styles.historyHeader}>
                    <h3>📋 Historique des Bons d'Entrée</h3>
                    <span className={styles.historyCount}>{goodsReceipts.length} bons enregistrés</span>
                </div>
                {goodsReceipts.length === 0 ? (
                    <div className={styles.emptyHistory}>
                        <p>Aucun bon d'entrée enregistré</p>
                    </div>
                ) : (
                    <div className={styles.historyTable}>
                        <div className={styles.historyTableHeader}>
                            <span>N° Bon</span>
                            <span>Date</span>
                            <span>Fournisseur</span>
                            <span>N° Facture</span>
                            <span>Articles</span>
                            <span>Total</span>
                            <span>Statut</span>
                        </div>
                        {goodsReceipts.slice(0, 10).map(receipt => (
                            <div
                                key={receipt.id}
                                className={`${styles.historyRow} ${styles.clickable}`}
                                onClick={() => setViewReceiptId(receipt.id)}
                            >
                                <span className={styles.receiptNum}>{receipt.grNumber}</span>
                                <span>{new Date(receipt.date).toLocaleDateString('fr-FR')}</span>
                                <span>{receipt.supplierName}</span>
                                <span>{receipt.invoiceNumber || '-'}</span>
                                <span>{receipt.items.length}</span>
                                <span className={styles.historyTotal}>{formatCurrency(receipt.total)}</span>
                                <span className={receipt.isPaid ? styles.paid : styles.unpaid}>
                                    {receipt.isPaid ? '✓ Payé' : '⏳ Crédit'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Search Modal */}
            {
                showProductSearch && (
                    <div className={styles.overlay} onClick={() => setShowProductSearch(false)}>
                        <div className={styles.modal} onClick={e => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h2>Rechercher un produit</h2>
                                <button onClick={() => setShowProductSearch(false)}><X size={24} /></button>
                            </div>
                            <div className={styles.modalBody}>
                                <div className={styles.searchBox}>
                                    <Search size={18} />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Nom, code-barres ou catégorie..."
                                    />
                                </div>
                                <div className={styles.searchResults}>
                                    {filteredProducts.map(product => (
                                        <div
                                            key={product.id}
                                            className={styles.productResult}
                                            onClick={() => handleAddProduct(product)}
                                        >
                                            <span className={styles.emoji}>{product.emoji}</span>
                                            <div className={styles.productDetails}>
                                                <span className={styles.name}>{product.name}</span>
                                                <span className={styles.meta}>
                                                    {product.barcode} • {product.category} • Stock: {product.stock}
                                                </span>
                                            </div>
                                            <span className={styles.price}>{formatCurrency(product.purchasePrice)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Confirm Modal */}
            {
                showConfirmModal && (
                    <div className={styles.overlay} onClick={() => setShowConfirmModal(false)}>
                        <div className={styles.modal} onClick={e => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h2>Confirmer le bon d'entrée</h2>
                                <button onClick={() => setShowConfirmModal(false)}><X size={24} /></button>
                            </div>
                            <div className={styles.modalBody}>
                                <div className={styles.confirmSummary}>
                                    <p><strong>N° Bon:</strong> {receiptNumber}</p>
                                    <p><strong>Fournisseur:</strong> {selectedSupplier?.name}</p>
                                    <p><strong>Total à payer:</strong> <span className={styles.totalHighlight}>{formatCurrency(totalAmount)}</span></p>
                                    <p><strong>Paiement:</strong> {isPaid ? `Réglé par ${paymentSource === 'cash' ? 'Caisse' : 'Coffre'}` : 'Crédit fournisseur'}</p>
                                </div>
                                <div className={styles.stockUpdateNotice}>
                                    <AlertCircle size={18} />
                                    <p>Les quantités reçues seront ajoutées au stock de chaque produit ({totalItems} unités au total).</p>
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button className={styles.cancelBtn} onClick={() => setShowConfirmModal(false)}>
                                    Annuler
                                </button>
                                <button className={styles.confirmBtn} onClick={handleConfirmReceipt}>
                                    <CheckCircle size={18} />
                                    Confirmer et mettre à jour le stock
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* View Receipt Modal */}
            {
                viewingReceipt && (
                    <div className={styles.overlay} onClick={() => setViewReceiptId(null)}>
                        <div className={styles.modal} onClick={e => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h2>📋 Bon d'entrée: {viewingReceipt.grNumber}</h2>
                                <button onClick={() => setViewReceiptId(null)}><X size={24} /></button>
                            </div>
                            <div className={styles.modalBody}>
                                <div className={styles.receiptDetails}>
                                    <div className={styles.detailRow}>
                                        <span>Date:</span>
                                        <strong>{new Date(viewingReceipt.date).toLocaleDateString('fr-FR')}</strong>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span>Fournisseur:</span>
                                        <strong>{viewingReceipt.supplierName}</strong>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span>N° Facture:</span>
                                        <strong>{viewingReceipt.invoiceNumber || 'N/A'}</strong>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span>Statut:</span>
                                        <strong className={viewingReceipt.isPaid ? styles.paid : styles.unpaid}>
                                            {viewingReceipt.isPaid ? '✓ Payé' : '⏳ Crédit'}
                                        </strong>
                                    </div>
                                </div>

                                <h4>Articles ({viewingReceipt.items.length})</h4>
                                <div className={styles.receiptItemsList}>
                                    {viewingReceipt.items.map(item => (
                                        <div key={item.id} className={styles.receiptItem}>
                                            <div className={styles.itemInfo}>
                                                <span className={styles.itemEmoji}>{item.productEmoji}</span>
                                                <div>
                                                    <span className={styles.itemName}>{item.productName}</span>
                                                    <span className={styles.itemBarcode}>{item.productBarcode}</span>
                                                </div>
                                            </div>
                                            <div className={styles.itemQty}>
                                                <span>{item.receivedQty} {item.unit}</span>
                                                <span className={styles.itemPrice}>@ {formatCurrency(item.purchasePrice)}</span>
                                            </div>
                                            <span className={styles.itemTotal}>{formatCurrency(item.total)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.receiptTotal}>
                                    <span>TOTAL</span>
                                    <strong>{formatCurrency(viewingReceipt.total)}</strong>
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button onClick={() => setViewReceiptId(null)}>Fermer</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default GoodsReceipt;

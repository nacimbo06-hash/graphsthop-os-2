import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Plus,
    Minus,
    Trash2,
    User,
    CreditCard,
    Banknote,
    Wallet,
    Printer,
    Keyboard,
    X,
    ShoppingCart,
    Barcode,
    Pause,
    RotateCcw,
    Percent,
    UserCheck,
    ArrowLeft,
    Star,
    Clock,
    AlertCircle,
    History,
    CheckCircle,
    Edit3,
    Eye,
    Layers,
    Box,
} from 'lucide-react';
import { useTVA, usePOSSettings } from '../../contexts/SettingsContext';
import {
    useProductsStore,
    useTreasuryStore,
    useSalesStore,
    useCustomersStore,
    useStockMovementsStore,
    useAuthStore
} from '@bonilo/shared/stores';
import { useToast } from '../../components/feedback/Toast';
import { ConfirmModal } from '../../components/feedback/ConfirmModal';
import styles from './POS.module.css';
import { formatCurrency, formatTime } from '../../utils/formatters';

// Product categories
const categories = [
    { id: 'favorites', name: 'Favoris ⭐', color: '#F59E0B' },
    { id: 'all', name: 'Tous', color: '#3D7C4F' },
    { id: 'beverages', name: 'Boissons', color: '#34C759' },
    { id: 'dairy', name: 'Laitiers', color: '#8B5CF6' },
    { id: 'bakery', name: 'Boulangerie', color: '#F97316' },
    { id: 'grocery', name: 'Épicerie', color: '#06B6D4' },
    { id: 'snacks', name: 'Snacks', color: '#EC4899' },
    { id: 'cleaning', name: 'Entretien', color: '#10B981' },
];


interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    isBundle?: boolean; // True if sold as pack
    unitsInBundle?: number; // Units in this bundle
}

interface HeldSale {
    id: string;
    items: CartItem[];
    customer: string | null;
    timestamp: Date;
    total: number;
}

// POS Product interface for unified typing
interface POSProduct {
    id: string;
    name: string;
    price: number;
    sku: string;
    category: string;
    stock: number;
    image: string;
    isFavorite: boolean;
    unitsPerPack: number;
    bundlePrice: number | null;
}

export const POS: React.FC = () => {
    const navigate = useNavigate();

    // Store hooks - Real data from stores
    const { products, updateStock, toggleFavorite } = useProductsStore();
    const { addMovement, currentSession } = useTreasuryStore();
    const { sales, addSale } = useSalesStore();
    const { customers, updateCredit, getCustomerByBarcode } = useCustomersStore();
    const { addMovement: addStockMovement } = useStockMovementsStore();
    const { user } = useAuthStore();
    const toast = useToast();

    // Settings hooks - TVA and other settings from context
    const { tvaEnabled, tvaRate: settingsTvaRate } = useTVA();
    const posSettings = usePOSSettings();

    // Transform store products to POS format with memoization
    const storeProducts = useMemo(() => {
        return products.map(p => {
            // Use new field or legacy field for pack units
            const packUnits = p.unitsPerSellingPack || p.unitsPerPack || 1;
            // Use custom pack price or calculate with 10% discount
            const packPrice = p.sellingPackPrice || (packUnits > 1 ? Math.floor(p.sellingPrice * packUnits * 0.9) : null);

            return {
                id: p.id,
                name: p.name,
                price: p.sellingPrice,
                sku: p.sku || p.barcode,
                category: p.categoryId || p.category?.toLowerCase().replace(/\s+/g, '') || 'grocery',
                stock: p.stock,
                image: p.emoji || '📦',
                isFavorite: p.isFavorite,
                unitsPerPack: packUnits,
                bundlePrice: packPrice,
            };
        });
    }, [products]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('favorites'); // Favoris par défaut
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showPayment, setShowPayment] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [showHeldSales, setShowHeldSales] = useState(false);
    const [showDiscount, setShowDiscount] = useState(false);
    const [showCustomerSearch, setShowCustomerSearch] = useState(false);
    const [showSalesHistory, setShowSalesHistory] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<string>(posSettings.defaultPaymentMethod || 'cash');
    const [amountReceived, setAmountReceived] = useState<string>('');
    const [discountPercent, setDiscountPercent] = useState<number>(0);
    const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null); // Storing customer ID
    const [heldSales, setHeldSales] = useState<HeldSale[]>([]);
    const [autoPrint, setAutoPrint] = useState(true);
    // Pack selector modal state
    const [showPackSelector, setShowPackSelector] = useState(false);
    const [pendingProduct, setPendingProduct] = useState<POSProduct | null>(null);
    // Sale detail modal state (using sales from store)
    const [selectedSaleDetail, setSelectedSaleDetail] = useState<any | null>(null);
    const [showRefundConfirm, setShowRefundConfirm] = useState(false);
    const [saleToRefund, setSaleToRefund] = useState<any | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [customerSearchQuery, setCustomerSearchQuery] = useState('');


    // Calculate totals with dynamic TVA from settings
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = subtotal * (discountPercent / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;

    // Use TVA from settings - convert from percentage (e.g., 19) to decimal (0.19)
    const vatRate = tvaEnabled ? settingsTvaRate / 100 : 0;
    const vatAmount = subtotalAfterDiscount * vatRate;
    const total = subtotalAfterDiscount + vatAmount;
    const change = parseFloat(amountReceived || '0') - total;
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Filter products - Using store products only
    const allProducts = storeProducts;

    // Memoize filtered products to avoid re-filtering on every render
    const filteredProducts = useMemo(() =>
        allProducts
            .filter(product => {
                const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.sku.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = selectedCategory === 'all' ||
                    (selectedCategory === 'favorites' ? product.isFavorite : product.category === selectedCategory);
                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => {
                if (a.isFavorite && !b.isFavorite) return -1;
                if (!a.isFavorite && b.isFavorite) return 1;
                return 0;
            })
        , [allProducts, searchQuery, selectedCategory]);

    // Add item to cart (handles pack selection)
    const addToCart = useCallback((product: POSProduct, asBundle: boolean = false) => {
        // Stock validation
        const unitsNeeded = asBundle ? product.unitsPerPack : 1;
        const existingInCart = cart.reduce((total, item) => {
            const baseId = item.productId.replace('-pack', '');
            if (baseId === product.id) {
                return total + (item.isBundle && item.unitsInBundle ? item.quantity * item.unitsInBundle : item.quantity);
            }
            return total;
        }, 0);

        if (existingInCart + unitsNeeded > product.stock) {
            toast.error(`Stock insuffisant: ${product.stock} disponible(s), ${existingInCart} déjà dans le panier`);
            return;
        }

        const itemPrice = asBundle && product.bundlePrice ? product.bundlePrice : product.price;
        const itemName = asBundle ? `${product.name} (Pack x${product.unitsPerPack})` : product.name;
        const itemKey = asBundle ? `${product.id}-pack` : product.id;

        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.productId === itemKey);
            if (existingItem) {
                return prevCart.map(item =>
                    item.productId === itemKey
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, {
                id: Date.now().toString(),
                productId: itemKey,
                name: itemName,
                price: itemPrice,
                quantity: 1,
                image: product.image,
                isBundle: asBundle,
                unitsInBundle: asBundle ? product.unitsPerPack : 1,
            }];
        });
    }, []);

    // Handle product click - show pack selector if applicable
    const handleProductClick = useCallback((product: POSProduct) => {
        if (product.unitsPerPack > 1 && product.bundlePrice) {
            // Show pack selector modal
            setPendingProduct(product);
            setShowPackSelector(true);
        } else {
            // Add directly as unit
            addToCart(product, false);
        }
    }, [addToCart]);

    // Handle Search/Scan input (Enter key)
    const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery) {
            e.preventDefault();

            // 1. Check if it's a customer barcode
            const customer = getCustomerByBarcode(searchQuery);
            if (customer) {
                setSelectedCustomer(customer.id);
                setSearchQuery('');
                toast.success(`Client identifié: ${customer.name} ✨`);
                return;
            }

            // 2. Check if it matches exactly ONE product barcode
            const productByBarcode = products.find(p => p.barcode === searchQuery);
            if (productByBarcode) {
                // Find POS formatted product
                const posProduct = storeProducts.find(p => p.id === productByBarcode.id);
                if (posProduct) {
                    handleProductClick(posProduct);
                    setSearchQuery('');
                    return;
                }
            }
        }
    }, [searchQuery, getCustomerByBarcode, products, storeProducts, handleProductClick, toast]);

    // Update quantity
    const updateQuantity = useCallback((itemId: string, delta: number) => {
        setCart(prevCart =>
            prevCart.map(item => {
                if (item.id === itemId) {
                    const newQuantity = item.quantity + delta;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
                }
                return item;
            }).filter(item => item.quantity > 0)
        );
    }, []);

    // Set exact quantity
    const setQuantity = useCallback((itemId: string, quantity: number) => {
        if (quantity <= 0) {
            setCart(prevCart => prevCart.filter(item => item.id !== itemId));
        } else {
            setCart(prevCart =>
                prevCart.map(item =>
                    item.id === itemId ? { ...item, quantity } : item
                )
            );
        }
    }, []);

    // Remove item
    const removeFromCart = useCallback((itemId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    }, []);

    // Clear cart
    const clearCart = useCallback(() => {
        if (cart.length === 0) return;
        setCart([]);
        setDiscountPercent(0);
        setSelectedCustomer(null);
        setShowPayment(false);
        setAmountReceived('');
        toast.info('Panier vidé');
    }, [cart.length, toast]);

    // Hold sale
    const holdSale = useCallback(() => {
        if (cart.length === 0) return;
        const newHeldSale: HeldSale = {
            id: Date.now().toString(),
            items: [...cart],
            customer: selectedCustomer,
            timestamp: new Date(),
            total: total,
        };
        setHeldSales(prev => [...prev, newHeldSale]);
        setCart([]);
        setDiscountPercent(0);
        setSelectedCustomer(null);
    }, [cart, selectedCustomer, total]);

    // Recall held sale
    const recallSale = useCallback((saleId: string) => {
        const sale = heldSales.find(s => s.id === saleId);
        if (sale) {
            setCart(sale.items);
            setSelectedCustomer(sale.customer);
            setHeldSales(prev => prev.filter(s => s.id !== saleId));
            setShowHeldSales(false);
            toast.info('Vente rappelée');
        }
    }, [heldSales, toast]);

    const generateReceiptHTML = (saleId: string, receiptNumber: string, items: any[], totalAmount: number, change: number, customer: string | null, paymentMethod: string) => {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Courier New', monospace; padding: 10px; width: 280px; font-size: 12px; }
                    .header { text-align: center; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 5px; }
                    .line { display: flex; justify-content: space-between; margin-bottom: 2px; }
                    .divider { border-top: 1px dashed #000; margin: 5px 0; }
                    .total { font-weight: bold; font-size: 14px; margin-top: 5px; }
                    .footer { text-align: center; margin-top: 10px; font-size: 10px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <strong>BONILO</strong><br/>
                    N°: ${receiptNumber}<br/>
                    Date: ${new Date().toLocaleString('fr-FR')}
                </div>
                ${items.map(item => `
                    <div class="line">
                        <span>${item.name} x${item.quantity}</span>
                        <span>${formatCurrency(item.price * item.quantity)}</span>
                    </div>
                `).join('')}
                <div class="divider"></div>
                <div class="line total">
                    <span>TOTAL</span>
                    <span>${formatCurrency(totalAmount)}</span>
                </div>
                <div class="line">
                    <span>Reçu</span>
                    <span>${formatCurrency(parseFloat(amountReceived || '0'))}</span>
                </div>
                <div class="line">
                    <span>Monnaie</span>
                    <span>${formatCurrency(change)}</span>
                </div>
                <div class="divider"></div>
                <div class="footer">
                    <p>Mode: ${paymentMethod}</p>
                    <p>Client: ${customer || 'Anonyme'}</p>
                    <p>Merci de votre visite !</p>
                </div>
            </body>
            </html>
        `;
    };

    // Complete sale
    const completeSale = useCallback(async () => {
        const saleId = `sale_${Date.now()}`;
        const receiptNumber = `REC-${Date.now().toString().slice(-6)}`;

        const saleItems = cart.map(item => ({
            id: crypto.randomUUID(),
            productId: item.productId.replace('-pack', ''),
            productName: item.name,
            quantity: item.quantity,
            stockQuantity: (item.isBundle && item.unitsInBundle)
                ? item.quantity * item.unitsInBundle
                : item.quantity,
            unitPrice: item.price,
            total: item.price * item.quantity,
        }));

        const customerObj = customers.find(c => c.id === selectedCustomer);
        const isCreditSale = selectedPayment === 'credit' && !!customerObj;

        // Prepare customer credit data for atomic transaction
        const customerCredit = isCreditSale ? {
            newBalance: customerObj!.currentCredit + total,
            lastPaymentDate: null
        } : undefined;

        // Prepare treasury movement for atomic transaction
        const treasuryMovement = (currentSession && selectedPayment === 'cash') ? {
            sessionId: currentSession.id,
            movementId: crypto.randomUUID(),
            createdBy: user ? `${user.firstName} ${user.lastName}` : 'Caissier',
        } : undefined;

        await addSale({
            items: saleItems,
            subtotal,
            taxAmount: vatAmount,
            discountAmount,
            totalAmount: total,
            paymentMethod: selectedPayment as any,
            customerId: selectedCustomer || undefined,
            customerName: customerObj?.name || undefined,
            cashierId: user?.id || 'unknown',
            cashierName: user ? `${user.firstName} ${user.lastName}` : 'Caissier',
            status: 'completed',
        }, {}, customerCredit, treasuryMovement);

        // 5. Silent Printing
        if (autoPrint) {
            try {
                window.print();
                toast.success('Ticket imprimé');
            } catch (err) {
                console.error('Print error:', err);
                toast.error('Erreur d\'impression');
            }
        }

        toast.success(`Vente complétée! Total: ${formatCurrency(total)} - Monnaie: ${formatCurrency(Math.max(0, change))}`);

        setCart([]);
        setDiscountPercent(0);
        setSelectedCustomer(null);
        setShowPayment(false);
        setAmountReceived('');
        searchInputRef.current?.focus();
    }, [total, amountReceived, change, autoPrint, currentSession, addMovement, cart, itemCount, updateStock, addSale, customers, selectedCustomer, selectedPayment, subtotal, vatAmount, discountAmount, updateCredit, addStockMovement, products, toast]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ne pas déclencher si on tape dans un input
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                if (e.key === 'Escape') {
                    target.blur();
                    searchInputRef.current?.focus();
                }
                return;
            }

            switch (e.key) {
                case 'F1':
                    e.preventDefault();
                    setShowShortcuts(true);
                    break;
                case 'F2':
                    e.preventDefault();
                    setShowCustomerSearch(true);
                    break;
                case 'F3':
                    e.preventDefault();
                    searchInputRef.current?.focus();
                    break;
                case 'F4':
                    e.preventDefault();
                    if (cart.length > 0) setShowDiscount(true);
                    break;
                case 'F5':
                    e.preventDefault();
                    setShowSalesHistory(true);
                    break;
                case 'F6':
                    e.preventDefault();
                    holdSale();
                    break;
                case 'F7':
                    e.preventDefault();
                    setShowHeldSales(true);
                    break;
                case 'F11':
                    e.preventDefault();
                    clearCart();
                    break;
                case 'F12':
                    e.preventDefault();
                    if (cart.length > 0) setShowPayment(true);
                    break;
                case 'Escape':
                    e.preventDefault();
                    setShowPayment(false);
                    setShowShortcuts(false);
                    setShowHeldSales(false);
                    setShowDiscount(false);
                    setShowCustomerSearch(false);
                    setShowSalesHistory(false);
                    searchInputRef.current?.focus();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cart, holdSale, clearCart]);

    // formatCurrency and formatTime imported from utils/formatters

    return (
        <div className={styles.pos}>
            {/* LEFT PANEL - PRODUCTS (50%) */}
            <div className={styles.productsPanel}>
                {/* Search */}
                <div className={styles.searchBar}>
                    <Barcode size={20} />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Scanner ou rechercher... (F3)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        autoFocus
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')}><X size={18} /></button>
                    )}
                </div>

                {/* Categories */}
                <div className={styles.categories}>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`${styles.catBtn} ${selectedCategory === cat.id ? styles.active : ''}`}
                            onClick={() => setSelectedCategory(cat.id)}
                            style={{ '--cat-color': cat.color } as React.CSSProperties}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Products Grid - Compact */}
                <div className={styles.productsGrid}>
                    {filteredProducts.length === 0 ? (
                        <div className={styles.noProducts}>
                            <Search size={48} />
                            <p>Aucun produit trouvé</p>
                        </div>
                    ) : (
                        filteredProducts.map(product => (
                            <button
                                key={product.id}
                                className={`${styles.productCard} ${product.stock <= 5 ? styles.lowStock : ''} ${product.unitsPerPack > 1 && product.bundlePrice ? styles.hasBundle : ''}`}
                                onClick={() => handleProductClick(product)}
                            >
                                {/* Favorite Star - Clickable */}
                                <button
                                    className={`${styles.favoriteBtn} ${product.isFavorite ? styles.isFavorite : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(product.id);
                                        toast.success(product.isFavorite ? `${product.name} retiré des favoris` : `${product.name} ajouté aux favoris ⭐`);
                                    }}
                                    title={product.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                >
                                    <Star size={14} fill={product.isFavorite ? '#F59E0B' : 'none'} />
                                </button>
                                {product.unitsPerPack > 1 && product.bundlePrice && (
                                    <span className={styles.packBadge}>
                                        <Layers size={10} /> x{product.unitsPerPack}
                                    </span>
                                )}
                                <span className={styles.productEmoji}>{product.image}</span>
                                <span className={styles.productName}>{product.name}</span>
                                <span className={styles.productPrice}>{formatCurrency(product.price)}</span>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT PANEL - CART (50%) */}
            <div className={styles.cartPanel}>
                {/* Cart Header */}
                <div className={styles.cartHeader}>
                    <button className={styles.backBtn} onClick={() => navigate('/')}>
                        <ArrowLeft size={20} />
                    </button>
                    <h1>Caisse</h1>
                    <div className={styles.headerActions}>
                        {heldSales.length > 0 && (
                            <button className={styles.heldBadge} onClick={() => setShowHeldSales(true)} title="F7 - Ventes en attente">
                                <Pause size={16} />
                                <span>{heldSales.length}</span>
                            </button>
                        )}
                        <button className={styles.historyBtn} onClick={() => setShowSalesHistory(true)} title="F5 - Historique">
                            <History size={18} />
                        </button>
                        <button className={styles.shortcutsBtn} onClick={() => setShowShortcuts(true)} title="F1 - Raccourcis">
                            <Keyboard size={18} />
                        </button>
                    </div>
                </div>

                {/* Customer Selection */}
                <div className={styles.customerBar}>
                    <button className={styles.customerBtn} onClick={() => setShowCustomerSearch(true)}>
                        {selectedCustomer ? (
                            <><UserCheck size={18} className={styles.customerIcon} /><span>{customers.find(c => c.id === selectedCustomer)?.name}</span></>
                        ) : (
                            <><User size={18} /><span>Client (F2)</span></>
                        )}
                    </button>
                    {selectedCustomer && (
                        <button className={styles.clearCustomer} onClick={() => setSelectedCustomer(null)}>
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Cart Items */}
                <div className={styles.cartItems}>
                    {cart.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <ShoppingCart size={64} strokeWidth={1} />
                            <p>Panier vide</p>
                            <span>Scannez ou sélectionnez un produit</span>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className={styles.cartItem}>
                                <span className={styles.itemEmoji}>{item.image}</span>
                                <div className={styles.itemInfo}>
                                    <span className={styles.itemName}>{item.name}</span>
                                    <span className={styles.itemPrice}>{formatCurrency(item.price)}</span>
                                </div>
                                <div className={styles.itemQty}>
                                    <button onClick={() => updateQuantity(item.id, -1)}><Minus size={16} /></button>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => setQuantity(item.id, parseInt(e.target.value) || 0)}
                                        min="0"
                                    />
                                    <button onClick={() => updateQuantity(item.id, 1)}><Plus size={16} /></button>
                                </div>
                                <span className={styles.itemTotal}>{formatCurrency(item.price * item.quantity)}</span>
                                <button className={styles.itemRemove} onClick={() => removeFromCart(item.id)}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Cart Summary - GRAND TOTAL */}
                <div className={styles.cartSummary}>
                    <div className={styles.summaryLine}>
                        <span>Sous-total ({itemCount} articles)</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {discountPercent > 0 && (
                        <div className={styles.summaryLine + ' ' + styles.discount}>
                            <span>Remise ({discountPercent}%)</span>
                            <span>-{formatCurrency(discountAmount)}</span>
                        </div>
                    )}
                    {tvaEnabled && (
                        <div className={styles.summaryLine}>
                            <span>TVA ({settingsTvaRate}%)</span>
                            <span>{formatCurrency(vatAmount)}</span>
                        </div>
                    )}
                    <div className={styles.totalLine}>
                        <span>TOTAL</span>
                        <span className={styles.totalValue}>{formatCurrency(total)}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={styles.cartActions}>
                    <div className={styles.secondaryBtns}>
                        <button onClick={() => cart.length > 0 && setShowDiscount(true)} disabled={cart.length === 0}>
                            <Percent size={18} /> Remise
                        </button>
                        <button onClick={holdSale} disabled={cart.length === 0}>
                            <Pause size={18} /> Attente
                        </button>
                        <button onClick={clearCart} disabled={cart.length === 0} className={styles.dangerBtn}>
                            <Trash2 size={18} /> Vider
                        </button>
                    </div>
                    <button
                        className={styles.payBtn}
                        onClick={() => setShowPayment(true)}
                        disabled={cart.length === 0}
                    >
                        <CreditCard size={24} />
                        <span>PAYER</span>
                        <span className={styles.payAmount}>{formatCurrency(total)}</span>
                    </button>
                </div>
            </div>

            {/* PAYMENT MODAL */}
            {showPayment && (
                <div className={styles.overlay} onClick={() => setShowPayment(false)}>
                    <div className={styles.paymentModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Paiement</h2>
                            <div className={styles.printToggle}>
                                <label>
                                    <input type="checkbox" checked={autoPrint} onChange={(e) => setAutoPrint(e.target.checked)} />
                                    <Printer size={16} />
                                    Imprimer ticket
                                </label>
                            </div>
                            <button onClick={() => setShowPayment(false)}><X size={24} /></button>
                        </div>

                        <div className={styles.paymentTotal}>
                            <span>Total à payer</span>
                            <span className={styles.bigTotal}>{formatCurrency(total)}</span>
                        </div>

                        <div className={styles.paymentMethods}>
                            {[
                                { id: 'cash', icon: <Banknote size={28} />, label: 'Espèces' },
                                { id: 'cib', icon: <CreditCard size={28} />, label: 'CIB' },
                                { id: 'dahabia', icon: <Wallet size={28} />, label: 'Dahabia' },
                                { id: 'credit', icon: <Clock size={28} />, label: 'Crédit' },
                            ].map(m => (
                                <button
                                    key={m.id}
                                    className={`${styles.methodBtn} ${selectedPayment === m.id ? styles.selected : ''}`}
                                    onClick={() => setSelectedPayment(m.id)}
                                >
                                    {m.icon}
                                    <span>{m.label}</span>
                                </button>
                            ))}
                        </div>

                        {selectedPayment === 'cash' && (
                            <div className={styles.cashSection}>
                                <label>Montant reçu</label>
                                <input
                                    type="number"
                                    value={amountReceived}
                                    onChange={(e) => setAmountReceived(e.target.value)}
                                    placeholder={Math.ceil(total).toString()}
                                    autoFocus
                                />
                                <div className={styles.quickAmounts}>
                                    {[200, 500, 1000, 2000, 5000].map(amt => (
                                        <button key={amt} onClick={() => setAmountReceived(amt.toString())}>{amt}</button>
                                    ))}
                                    <button className={styles.exact} onClick={() => setAmountReceived(Math.ceil(total).toString())}>Exact</button>
                                </div>
                                {parseFloat(amountReceived || '0') >= total && (
                                    <div className={styles.changeDisplay}>
                                        <span>Monnaie:</span>
                                        <span className={styles.changeValue}>{formatCurrency(change)}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedPayment === 'credit' && !selectedCustomer && (
                            <div className={styles.warning}>
                                <AlertCircle size={20} />
                                Sélectionnez un client pour le crédit
                            </div>
                        )}

                        <div className={styles.modalFooter}>
                            <button className={styles.cancelBtn} onClick={() => setShowPayment(false)}>Annuler</button>
                            <button
                                className={styles.confirmBtn}
                                onClick={completeSale}
                                disabled={(selectedPayment === 'cash' && parseFloat(amountReceived || '0') < total) ||
                                    (selectedPayment === 'credit' && !selectedCustomer)}
                            >
                                <CheckCircle size={20} />
                                Confirmer {autoPrint && '& Imprimer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DISCOUNT MODAL */}
            {showDiscount && (
                <div className={styles.overlay} onClick={() => setShowDiscount(false)}>
                    <div className={styles.smallModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Remise</h2>
                            <button onClick={() => setShowDiscount(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.discountGrid}>
                            {[5, 10, 15, 20, 25, 30].map(p => (
                                <button
                                    key={p}
                                    className={`${styles.discountBtn} ${discountPercent === p ? styles.active : ''}`}
                                    onClick={() => setDiscountPercent(p)}
                                >
                                    {p}%
                                </button>
                            ))}
                        </div>
                        <div className={styles.customDiscount}>
                            <input
                                type="number"
                                value={discountPercent}
                                onChange={(e) => setDiscountPercent(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                min="0"
                                max="100"
                            />
                            <span>%</span>
                        </div>
                        <div className={styles.discountPreview}>
                            Montant: <strong>{formatCurrency(discountAmount)}</strong>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => { setDiscountPercent(0); setShowDiscount(false); }}>Annuler</button>
                            <button className={styles.confirmBtn} onClick={() => setShowDiscount(false)}>Appliquer</button>
                        </div>
                    </div>
                </div>
            )}

            {/* HELD SALES MODAL */}
            {showHeldSales && (
                <div className={styles.overlay} onClick={() => setShowHeldSales(false)}>
                    <div className={styles.mediumModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Ventes en attente ({heldSales.length})</h2>
                            <button onClick={() => setShowHeldSales(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.heldList}>
                            {heldSales.length === 0 ? (
                                <div className={styles.emptyState}><Pause size={48} /><p>Aucune vente en attente</p></div>
                            ) : (
                                heldSales.map(sale => (
                                    <div key={sale.id} className={styles.heldItem}>
                                        <div className={styles.heldInfo}>
                                            <span className={styles.heldTime}>{formatTime(sale.timestamp)}</span>
                                            <span>{sale.items.length} articles</span>
                                            <span className={styles.heldTotal}>{formatCurrency(sale.total)}</span>
                                        </div>
                                        <div className={styles.heldActions}>
                                            <button className={styles.recallBtn} onClick={() => recallSale(sale.id)}>
                                                <RotateCcw size={16} /> Reprendre
                                            </button>
                                            <button onClick={() => setHeldSales(prev => prev.filter(s => s.id !== sale.id))}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* SALES HISTORY MODAL */}
            {showSalesHistory && (
                <div className={styles.overlay} onClick={() => setShowSalesHistory(false)}>
                    <div className={styles.mediumModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Historique des ventes</h2>
                            <button onClick={() => setShowSalesHistory(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.historyList}>
                            {sales.slice(0, 5).map(sale => (
                                <div key={sale.id} className={styles.historyItem}>
                                    <div className={styles.historyInfo}>
                                        <span className={styles.historyId}>{sale.id}</span>
                                        <span className={styles.historyTime}>{formatTime(new Date(sale.timestamp))}</span>
                                        <span>{sale.items.length} articles</span>
                                        <span className={styles.historyTotal}>{formatCurrency(sale.totalAmount)}</span>
                                    </div>
                                    <div className={styles.historyActions}>
                                        <button
                                            title="Voir les détails"
                                            onClick={() => { setSelectedSaleDetail(sale); setShowSalesHistory(false); }}
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            title="Rappeler pour modification"
                                            className={styles.editBtn}
                                            onClick={() => {
                                                // Clear current cart and load sale items for editing
                                                const newCart = sale.items.map((item, idx) => ({
                                                    id: `recall-${Date.now()}-${idx}`,
                                                    productId: item.productId,
                                                    name: item.productName,
                                                    price: item.unitPrice,
                                                    quantity: item.quantity,
                                                    image: '📦',
                                                    isBundle: false,
                                                    unitsInBundle: 1,
                                                }));
                                                setCart(newCart);
                                                setShowSalesHistory(false);
                                                if (sale.customerId) setSelectedCustomer(sale.customerId);
                                                toast.info(`Vente ${sale.id} rappelée - Modifiez et revalidez`);
                                            }}
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            title="Remboursement"
                                            className={styles.refundBtn}
                                            onClick={() => {
                                                setSaleToRefund(sale);
                                                setShowRefundConfirm(true);
                                            }}
                                        >
                                            <RotateCcw size={16} />
                                        </button>
                                        <button
                                            title="Réimprimer le ticket"
                                            onClick={() => {
                                                // Print the ticket
                                                const printWindow = window.open('', '_blank', 'width=350,height=500');
                                                if (printWindow) {
                                                    const ticketHTML = `
                                                        <!DOCTYPE html>
                                                        <html>
                                                        <head>
                                                            <title>Ticket ${sale.id}</title>
                                                            <style>
                                                                * { margin: 0; padding: 0; box-sizing: border-box; }
                                                                body { font-family: 'Courier New', monospace; padding: 20px; max-width: 280px; margin: 0 auto; }
                                                                .ticket { border: 1px dashed #000; padding: 15px; }
                                                                .header { text-align: center; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
                                                                .line { display: flex; justify-content: space-between; font-size: 12px; padding: 2px 0; }
                                                                .total { border-top: 2px solid #000; margin-top: 10px; padding-top: 10px; font-size: 16px; font-weight: bold; }
                                                                .footer { text-align: center; margin-top: 15px; font-size: 11px; }
                                                            </style>
                                                        </head>
                                                        <body>
                                                            <div class="ticket">
                                                                <div class="header">
                                                                    <strong>TICKET DE CAISSE</strong><br/>
                                                                    <small>{formatTime(new Date(sale.timestamp))} - {sale.id}</small>
                                                                </div>
                                                                ${sale.items.map(p => `
                                                                    <div class="line">
                                                                        <span>${p.productName} x${p.quantity}</span>
                                                                        <span>${formatCurrency(p.unitPrice * p.quantity)}</span>
                                                                    </div>
                                                                `).join('')}
                                                                <div class="line total">
                                                                    <span>TOTAL</span>
                                                                    <span>${formatCurrency(sale.totalAmount)}</span>
                                                                </div>
                                                                <div class="footer">
                                                                    <p>Paiement: ${sale.paymentMethod}</p>
                                                                    <p>Client: ${sale.customerName || 'Anonyme'}</p>
                                                                    <p>Merci de votre visite! 🙏</p>
                                                                </div>
                                                            </div>
                                                            <script>window.onload = function() { window.print(); }</script>
                                                        </body>
                                                        </html>
                                                    `;
                                                    printWindow.document.write(ticketHTML);
                                                    printWindow.document.close();
                                                }
                                            }}
                                        >
                                            <Printer size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* SALE DETAIL MODAL */}
            {selectedSaleDetail && (
                <div className={styles.overlay} onClick={() => setSelectedSaleDetail(null)}>
                    <div className={styles.mediumModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Détails de la vente {selectedSaleDetail.id}</h2>
                            <button onClick={() => setSelectedSaleDetail(null)}><X size={24} /></button>
                        </div>
                        <div className={styles.saleDetailBody}>
                            <div className={styles.saleDetailInfo}>
                                <div className={styles.detailRow}>
                                    <span>Heure:</span>
                                    <span>{formatTime(new Date(selectedSaleDetail.timestamp))}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span>Client:</span>
                                    <span>{selectedSaleDetail.customerName || 'Client anonyme'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span>Paiement:</span>
                                    <span>{selectedSaleDetail.paymentMethod}</span>
                                </div>
                            </div>
                            <div className={styles.saleDetailProducts}>
                                <h3>Produits</h3>
                                <div className={styles.productsList}>
                                    {selectedSaleDetail.items.map((p: any, idx: number) => (
                                        <div key={idx} className={styles.productRow}>
                                            <span className={styles.productName}>{p.productName}</span>
                                            <span className={styles.productQty}>x{p.quantity}</span>
                                            <span className={styles.productPrice}>{formatCurrency(p.unitPrice * p.quantity)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.saleDetailTotal}>
                                <span>Total</span>
                                <span className={styles.totalValue}>{formatCurrency(selectedSaleDetail.totalAmount)}</span>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => setSelectedSaleDetail(null)}
                            >
                                Fermer
                            </button>
                            <button
                                className={styles.confirmBtn}
                                onClick={async () => {
                                    toast.info('Réimpression du ticket via navigateur...');
                                    window.print();
                                }}
                            >
                                <Printer size={16} />
                                Réimprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CUSTOMER SEARCH MODAL */}
            {showCustomerSearch && (
                <div className={styles.overlay} onClick={() => setShowCustomerSearch(false)}>
                    <div className={styles.smallModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Sélectionner client</h2>
                            <button onClick={() => setShowCustomerSearch(false)}><X size={24} /></button>
                        </div>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Rechercher un client..."
                            onChange={(e) => setCustomerSearchQuery(e.target.value)}
                            value={customerSearchQuery}
                            autoFocus
                        />
                        <div className={styles.customerList}>
                            {customers
                                .filter(c =>
                                    c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
                                    c.phone.includes(customerSearchQuery)
                                )
                                .slice(0, 10)
                                .map(c => (
                                    <button key={c.id} onClick={() => { setSelectedCustomer(c.id); setShowCustomerSearch(false); setCustomerSearchQuery(''); }}>
                                        <User size={16} />
                                        <div className={styles.customerBtnInfo}>
                                            <span className={styles.customerBtnName}>{c.name}</span>
                                            <span className={styles.customerBtnPhone}>{c.phone}</span>
                                        </div>
                                    </button>
                                ))}
                            {customers.length === 0 && <p className={styles.empty}>Aucun client enregistré</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* SHORTCUTS MODAL */}
            {showShortcuts && (
                <div className={styles.overlay} onClick={() => setShowShortcuts(false)}>
                    <div className={styles.smallModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Raccourcis clavier</h2>
                            <button onClick={() => setShowShortcuts(false)}><X size={24} /></button>
                        </div>
                        <div className={styles.shortcutsList}>
                            {[
                                { key: 'F1', action: 'Aide' },
                                { key: 'F2', action: 'Client' },
                                { key: 'F3', action: 'Recherche' },
                                { key: 'F4', action: 'Remise' },
                                { key: 'F5', action: 'Historique' },
                                { key: 'F6', action: 'Mettre en attente' },
                                { key: 'F7', action: 'Reprendre vente' },
                                { key: 'F11', action: 'Vider panier' },
                                { key: 'F12', action: 'Payer' },
                                { key: 'ESC', action: 'Annuler/Fermer' },
                            ].map(s => (
                                <div key={s.key} className={styles.shortcutItem}>
                                    <kbd>{s.key}</kbd>
                                    <span>{s.action}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* PACK/UNIT SELECTOR MODAL */}
            {showPackSelector && pendingProduct && (
                <div className={styles.overlay} onClick={() => { setShowPackSelector(false); setPendingProduct(null); }}>
                    <div className={styles.packSelectorModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Choisir le mode de vente</h2>
                            <button onClick={() => { setShowPackSelector(false); setPendingProduct(null); }}><X size={24} /></button>
                        </div>
                        <div className={styles.packSelectorBody}>
                            <div className={styles.productPreview}>
                                <span className={styles.previewEmoji}>{pendingProduct.image}</span>
                                <span className={styles.previewName}>{pendingProduct.name}</span>
                            </div>
                            <div className={styles.packOptions}>
                                {/* Unit Option */}
                                <button
                                    className={styles.packOption}
                                    onClick={() => { addToCart(pendingProduct, false); setShowPackSelector(false); setPendingProduct(null); }}
                                >
                                    <div className={styles.optionIcon}>
                                        <Box size={32} />
                                    </div>
                                    <div className={styles.optionInfo}>
                                        <span className={styles.optionTitle}>À l'unité</span>
                                        <span className={styles.optionPrice}>{formatCurrency(pendingProduct.price)}</span>
                                    </div>
                                </button>
                                {/* Pack Option */}
                                <button
                                    className={`${styles.packOption} ${styles.packHighlight}`}
                                    onClick={() => { addToCart(pendingProduct, true); setShowPackSelector(false); setPendingProduct(null); }}
                                >
                                    <div className={styles.discountRibbon}>
                                        -{Math.round(((pendingProduct.price * pendingProduct.unitsPerPack - (pendingProduct.bundlePrice || 0)) / (pendingProduct.price * pendingProduct.unitsPerPack)) * 100)}%
                                    </div>
                                    <div className={styles.optionIcon}>
                                        <Layers size={32} />
                                    </div>
                                    <div className={styles.optionInfo}>
                                        <span className={styles.optionTitle}>Pack x{pendingProduct.unitsPerPack}</span>
                                        <span className={styles.optionPrice}>{formatCurrency(pendingProduct.bundlePrice || 0)}</span>
                                        <span className={styles.optionSaving}>
                                            au lieu de {formatCurrency(pendingProduct.price * pendingProduct.unitsPerPack)}
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Refund Confirmation Modal */}
            <ConfirmModal
                isOpen={showRefundConfirm}
                title="Confirmer le remboursement"
                message={saleToRefund ? `Effectuer un remboursement pour la vente ${saleToRefund.id} ?\n\nMontant: ${formatCurrency(saleToRefund.totalAmount)}` : ''}
                confirmText="Rembourser"
                cancelText="Annuler"
                variant="warning"
                onConfirm={() => {
                    if (saleToRefund && addMovement) {
                        addMovement({
                            type: 'refund',
                            amount: saleToRefund.totalAmount,
                            reason: `Remboursement vente ${saleToRefund.id}`,
                            createdBy: 'Caissier',
                        });
                        toast.success(`Remboursement effectué: ${formatCurrency(saleToRefund.totalAmount)}`);
                    }
                    setShowRefundConfirm(false);
                    setSaleToRefund(null);
                    setShowSalesHistory(false);
                }}
                onCancel={() => {
                    setShowRefundConfirm(false);
                    setSaleToRefund(null);
                }}
            />
        </div>
    );
};

export default POS;

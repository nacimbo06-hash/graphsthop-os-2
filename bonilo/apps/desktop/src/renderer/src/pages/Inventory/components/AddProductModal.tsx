import React, { useState, useEffect, useRef } from 'react';
import {
    X,
    Barcode,
    Tag,
    Package,
    DollarSign,
    AlertTriangle,
    CheckCircle,
    Sparkles,
    History,
    Save,
    RotateCcw,
    Zap,
    Layers,
    Scale,
    Archive,
    Smile,
    Box,
    Truck,
} from 'lucide-react';
import { generateSKU, generateDesignation, generateShortName, validatePrices, validateSKU } from '../../../utils/skuGenerator';
import { CATEGORIES, UNITS_OF_MEASURE, COMMON_BRANDS, PRODUCT_NATURES, getGroupedUnits } from '@bonilo/shared';
import type { Product } from '@bonilo/shared';
import { useToast } from '../../../components/feedback/Toast';
import { formatCurrency } from '../../../utils/formatters';
import { getAutoEmoji, getSuggestedEmojis, POPULAR_EMOJIS } from '../../../utils/emojiMapper';
import styles from './AddProductModal.module.css';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Partial<Product>) => void;
    existingSKUs: string[];
    editProduct?: Product | null;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
    isOpen,
    onClose,
    onSave,
    existingSKUs,
    editProduct
}) => {
    const toast = useToast();
    const barcodeInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [barcode, setBarcode] = useState('');
    const [sku, setSku] = useState('');
    const [skuGenerated, setSkuGenerated] = useState(false);
    const [skuLength, setSkuLength] = useState<3 | 4 | 5>(3);
    const [brand, setBrand] = useState('');
    const [nature, setNature] = useState('');
    const [variety, setVariety] = useState('');  // Parfum/Variété (Fraise, Nature, Lavande)
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('unit');
    const [shortName, setShortName] = useState('');  // Nom court pour ticket
    const [categoryId, setCategoryId] = useState('');
    const [subcategoryId, setSubcategoryId] = useState('');
    const [designation, setDesignation] = useState('');
    const [buyPrice, setBuyPrice] = useState('');
    const [sellPrice, setSellPrice] = useState('');
    const [minStock, setMinStock] = useState('10');
    const [emoji, setEmoji] = useState('📦');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Packaging - Supplier (Carton)
    const [unitsPerCarton, setUnitsPerCarton] = useState('');
    const [cartonBarcode, setCartonBarcode] = useState('');

    // Packaging - Customer Sales (Pack)
    const [unitsPerSellingPack, setUnitsPerSellingPack] = useState('');
    const [sellingPackPrice, setSellingPackPrice] = useState('');

    // UI state
    const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
    const [showNatureSuggestions, setShowNatureSuggestions] = useState(false);
    const [priceWarning, setPriceWarning] = useState<string | null>(null);
    const [priceMargin, setPriceMargin] = useState<number | null>(null);

    // Get price history from editProduct if in edit mode
    const priceHistory = editProduct?.priceHistory || [];

    // Focus barcode input when modal opens
    useEffect(() => {
        if (isOpen && barcodeInputRef.current) {
            setTimeout(() => barcodeInputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Populate form when editing
    useEffect(() => {
        if (editProduct) {
            setBarcode(editProduct.barcode || '');
            setSku(editProduct.sku || '');
            setBrand(editProduct.brand || '');
            setNature(editProduct.nature || '');
            setVariety(editProduct.variety || '');
            setQuantity(editProduct.quantity?.toString() || '');
            setUnit(editProduct.unit || 'unit');
            setCategoryId(editProduct.categoryId || '');
            setSubcategoryId(editProduct.subcategoryId || '');
            setDesignation(editProduct.designation || '');
            setShortName(editProduct.shortName || '');
            setBuyPrice(editProduct.buyPrice?.toString() || '');
            setSellPrice(editProduct.sellPrice?.toString() || '');
            setMinStock(editProduct.minStock?.toString() || '10');
            setEmoji(editProduct.emoji || '📦');
            // Packaging fields
            setUnitsPerCarton(editProduct.unitsPerCarton?.toString() || '');
            setCartonBarcode(editProduct.cartonBarcode || '');
            setUnitsPerSellingPack((editProduct.unitsPerSellingPack || editProduct.unitsPerPack)?.toString() || '');
            setSellingPackPrice(editProduct.sellingPackPrice?.toString() || '');
        }
    }, [editProduct]);

    // Auto-generate SKU when barcode changes
    useEffect(() => {
        if (barcode.length >= 8 && !editProduct) {
            const result = generateSKU(barcode, existingSKUs);
            setSku(result.sku);
            setSkuLength(result.length);
            setSkuGenerated(true);
        }
    }, [barcode, existingSKUs, editProduct]);

    // Auto-generate designation & shortName when inputs change
    useEffect(() => {
        // Skip auto-generation in edit mode to preserve existing customized names
        // UNLESS the name is explicitly cleared/empty
        if (editProduct && designation && shortName) {
            return;
        }

        const unitSymbol = UNITS_OF_MEASURE.find(u => u.value === unit)?.symbol || '';
        // Full designation: MARQUE + NATURE + VARIÉTÉ + QTÉ
        const newDesignation = generateDesignation(brand, nature, variety, quantity, unitSymbol);
        setDesignation(newDesignation.toUpperCase());
        // Short name for ticket (max 30 chars)
        const newShortName = generateShortName(brand, nature, variety, quantity, unitSymbol);
        setShortName(newShortName);
    }, [brand, nature, variety, quantity, unit, editProduct]);

    // Auto-suggest emoji when name/nature/category changes
    useEffect(() => {
        if (!editProduct) {
            const suggestedEmoji = getAutoEmoji(brand, nature, categoryId);
            setEmoji(suggestedEmoji);
        }
    }, [brand, nature, categoryId, editProduct]);

    // Get suggested emojis for picker
    const suggestedEmojis = getSuggestedEmojis(brand, nature, categoryId);

    // === OPEN FOOD FACTS INTEGRATION ===
    const [isLoadingOFF, setIsLoadingOFF] = useState(false);

    const fetchOpenFoodFacts = async (code: string) => {
        if (code.length < 8) return;

        setIsLoadingOFF(true);
        try {
            const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
            const data = await response.json();

            if (data.status === 1 && data.product) {
                const p = data.product;

                // 1. Brand
                if (p.brands) {
                    setBrand(p.brands.split(',')[0].trim());
                }

                // 2. Nature/Name
                if (p.product_name_fr || p.product_name) {
                    setNature(p.product_name_fr || p.product_name);
                }

                // 3. Quantity & Unit
                if (p.quantity) {
                    // Try to parse "1 L", "500 g"
                    const qtyMatch = p.quantity.match(/([\d\.]+)\s*([a-zA-Z]+)/);
                    if (qtyMatch) {
                        setQuantity(qtyMatch[1]);
                        // Simple mapping, can be improved
                        const importedUnit = qtyMatch[2].toLowerCase();
                        if (importedUnit.includes('l')) setUnit('l');
                        else if (importedUnit.includes('kg')) setUnit('kg');
                        else if (importedUnit.includes('g')) setUnit('g');
                        else if (importedUnit.includes('cl')) setUnit('cl');
                        else if (importedUnit.includes('ml')) setUnit('ml');
                    }
                }

                // 4. Category Suggestion
                // Basic mapping based on keywords in categories_tags
                const tags = (p.categories_tags || []).join(' ').toLowerCase();
                if (tags.includes('beverage') || tags.includes('boisson')) setCategoryId('beverages');
                else if (tags.includes('dairy') || tags.includes('laitier')) setCategoryId('dairy-fresh');
                else if (tags.includes('biscuit') || tags.includes('cookie')) setCategoryId('sweet-grocery');
                else if (tags.includes('meat') || tags.includes('viande')) setCategoryId('meat-butchery');
                else if (tags.includes('hygiene') || tags.includes('beauté')) setCategoryId('hygiene-beauty');

                // 5. Image (Future: store image URL)

                toast.success('Données trouvées sur OpenFoodFacts !');
            } else {
                // Silent fail or small hint
                console.log('Produit non trouvé sur OFF');
            }
        } catch (error) {
            console.error('Erreur OpenFoodFacts:', error);
            // toast.error('Erreur de connexion à OpenFoodFacts');
        } finally {
            setIsLoadingOFF(false);
        }
    };

    // Trigger OFF search on barcode blur or length match
    useEffect(() => {
        if (barcode.length >= 8 && !editProduct && !brand) {
            // Debounce or wait for user to finish typing? 
            // Better: Trigger manually or precise timing. 
            // For now: Trigger if barcode seems complete and fields are empty
            const timer = setTimeout(() => fetchOpenFoodFacts(barcode), 1000);
            return () => clearTimeout(timer);
        }
    }, [barcode]);


    // Validate prices
    useEffect(() => {
        const buy = parseFloat(buyPrice);
        const sell = parseFloat(sellPrice);

        if (buy > 0 && sell > 0) {
            const validation = validatePrices(buy, sell);
            setPriceWarning(validation.warning || null);
            setPriceMargin(validation.margin);
        } else {
            setPriceWarning(null);
            setPriceMargin(null);
        }
    }, [buyPrice, sellPrice]);

    // Get subcategories for selected category
    const selectedCategory = CATEGORIES.find(c => c.id === categoryId);
    const subcategories = selectedCategory?.subcategories || [];

    // Filter suggestions
    const filteredBrands = COMMON_BRANDS.filter(b =>
        b.toLowerCase().includes(brand.toLowerCase())
    ).slice(0, 8);

    const filteredNatures = PRODUCT_NATURES.filter(n =>
        n.toLowerCase().includes(nature.toLowerCase())
    ).slice(0, 8);

    // Form validation
    const isFormValid = () => {
        const buy = parseFloat(buyPrice);
        const sell = parseFloat(sellPrice);
        return (
            barcode.length >= 8 &&
            validateSKU(sku) &&
            brand.trim() !== '' &&
            nature.trim() !== '' &&
            categoryId !== '' &&
            buy > 0 &&
            sell > 0 &&
            sell > buy
        );
    };

    const handleSave = () => {
        const buy = parseFloat(buyPrice);
        const sell = parseFloat(sellPrice);

        if (sell <= buy) {
            toast.warning('Le prix de vente doit être supérieur au prix d\'achat!');
            return;
        }

        onSave({
            barcode,
            sku,
            brand,
            nature,
            variety,
            designation,
            shortName,   // For ticket printing
            emoji,
            categoryId,
            subcategoryId,
            quantity: parseFloat(quantity) || 1,
            unit,
            purchasePrice: buy,
            sellingPrice: sell,
            buyPrice: buy,
            sellPrice: sell,
            minStock: parseInt(minStock) || 10,
            stock: editProduct?.stock || 0,
            isActive: true,
            priceHistory: editProduct?.priceHistory || [{ date: new Date(), oldPrice: sell, newPrice: sell }],
            // Packaging - Supplier
            unitsPerCarton: parseInt(unitsPerCarton) || undefined,
            cartonBarcode: cartonBarcode || undefined,
            // Packaging - Customer Sales
            unitsPerSellingPack: parseInt(unitsPerSellingPack) || undefined,
            sellingPackPrice: parseFloat(sellingPackPrice) || undefined,
            // Legacy compatibility
            unitsPerPack: parseInt(unitsPerSellingPack) || undefined,
        });

        handleReset();
        onClose();
    };

    const handleReset = () => {
        setBarcode('');
        setSku('');
        setSkuGenerated(false);
        setBrand('');
        setNature('');
        setVariety('');
        setQuantity('');
        setShortName('');
        setUnit('unit');
        setCategoryId('');
        setSubcategoryId('');
        setDesignation('');
        setBuyPrice('');
        setSellPrice('');
        setMinStock('10');
        setEmoji('📦');
        setShowEmojiPicker(false);
        // Reset packaging
        setUnitsPerCarton('');
        setCartonBarcode('');
        setUnitsPerSellingPack('');
        setSellingPackPrice('');
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerTitle}>
                        <Package size={24} />
                        <h2>{editProduct ? 'Modifier le Produit' : 'Nouveau Produit'}</h2>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* Unified Form Content */}
                <div className={styles.content}>
                    <div className={styles.formLayout}>

                        {/* === SECTION 1: Identification === */}
                        <section className={styles.formSection}>
                            <div className={styles.sectionHeader}>
                                <Barcode size={18} />
                                <h3>Identification</h3>
                            </div>

                            <div className={styles.formGrid2}>
                                {/* Barcode */}
                                <div className={styles.formGroup}>
                                    <label>Code-barres *</label>
                                    <div className={styles.inputWithIcon}>
                                        <Barcode size={18} className={styles.inputIcon} />
                                        <input
                                            ref={barcodeInputRef}
                                            type="text"
                                            value={barcode}
                                            onChange={e => setBarcode(e.target.value)}
                                            placeholder="Scanner ou saisir..."
                                            className={styles.monoInput}
                                        />
                                        {isLoadingOFF ? (
                                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                                        ) : barcode.length >= 8 ? (
                                            <CheckCircle size={18} className={styles.successIcon} />
                                        ) : null}
                                    </div>
                                </div>

                                {/* SKU */}
                                <div className={styles.formGroup}>
                                    <label>
                                        SKU
                                        {skuGenerated && (
                                            <span className={styles.autoTag}>
                                                <Zap size={12} /> Auto
                                            </span>
                                        )}
                                    </label>
                                    <div className={styles.inputWithIcon}>
                                        <input
                                            type="text"
                                            value={sku}
                                            onChange={e => {
                                                setSku(e.target.value);
                                                setSkuGenerated(false);
                                            }}
                                            placeholder="000"
                                            maxLength={6}
                                            className={styles.monoInput}
                                        />
                                        {!validateSKU(sku) && sku.length > 0 && (
                                            <AlertTriangle size={16} className={styles.errorIcon} />
                                        )}
                                    </div>
                                    {!validateSKU(sku) && sku.length > 0 && (
                                        <span className={styles.errorHint}>3-6 chiffres requis</span>
                                    )}
                                </div>

                                {/* Emoji Selector */}
                                <div className={styles.formGroup}>
                                    <label>
                                        Emoji
                                        <span className={styles.autoTag}>
                                            <Sparkles size={12} /> Auto
                                        </span>
                                    </label>
                                    <div className={styles.emojiSelector}>
                                        <button
                                            type="button"
                                            className={styles.emojiPreview}
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        >
                                            <span className={styles.currentEmoji}>{emoji}</span>
                                            <Smile size={16} />
                                        </button>
                                        {showEmojiPicker && (
                                            <div className={styles.emojiPicker}>
                                                <div className={styles.emojiSection}>
                                                    <span className={styles.emojiLabel}>Suggestions</span>
                                                    <div className={styles.emojiGrid}>
                                                        {suggestedEmojis.map((e, idx) => (
                                                            <button
                                                                key={idx}
                                                                type="button"
                                                                onClick={() => {
                                                                    setEmoji(e);
                                                                    setShowEmojiPicker(false);
                                                                }}
                                                                className={emoji === e ? styles.selectedEmoji : ''}
                                                            >
                                                                {e}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className={styles.emojiSection}>
                                                    <span className={styles.emojiLabel}>Populaires</span>
                                                    <div className={styles.emojiGrid}>
                                                        {POPULAR_EMOJIS.map((e, idx) => (
                                                            <button
                                                                key={idx}
                                                                type="button"
                                                                onClick={() => {
                                                                    setEmoji(e);
                                                                    setShowEmojiPicker(false);
                                                                }}
                                                                className={emoji === e ? styles.selectedEmoji : ''}
                                                            >
                                                                {e}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* === SECTION 2: Description === */}
                        <section className={styles.formSection}>
                            <div className={styles.sectionHeader}>
                                <Tag size={18} />
                                <h3>Description</h3>
                            </div>

                            <div className={styles.formGrid2}>
                                {/* Brand */}
                                <div className={styles.formGroup}>
                                    <label>Marque *</label>
                                    <div className={styles.autocomplete}>
                                        <input
                                            type="text"
                                            value={brand}
                                            onChange={e => {
                                                setBrand(e.target.value);
                                                setShowBrandSuggestions(true);
                                            }}
                                            onFocus={() => setShowBrandSuggestions(true)}
                                            onBlur={() => setTimeout(() => setShowBrandSuggestions(false), 200)}
                                            placeholder="Ex: Candia, Coca-Cola..."
                                        />
                                        {showBrandSuggestions && filteredBrands.length > 0 && (
                                            <div className={styles.suggestions}>
                                                {filteredBrands.map(b => (
                                                    <div
                                                        key={b}
                                                        className={styles.suggestionItem}
                                                        onClick={() => {
                                                            setBrand(b);
                                                            setShowBrandSuggestions(false);
                                                        }}
                                                    >
                                                        {b}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Nature */}
                                <div className={styles.formGroup}>
                                    <label>Nature du Produit *</label>
                                    <div className={styles.autocomplete}>
                                        <input
                                            type="text"
                                            value={nature}
                                            onChange={e => {
                                                setNature(e.target.value);
                                                setShowNatureSuggestions(true);
                                            }}
                                            onFocus={() => setShowNatureSuggestions(true)}
                                            onBlur={() => setTimeout(() => setShowNatureSuggestions(false), 200)}
                                            placeholder="Ex: Lait UHT Demi-Écrémé..."
                                        />
                                        {showNatureSuggestions && filteredNatures.length > 0 && (
                                            <div className={styles.suggestions}>
                                                {filteredNatures.map(n => (
                                                    <div
                                                        key={n}
                                                        className={styles.suggestionItem}
                                                        onClick={() => {
                                                            setNature(n);
                                                            setShowNatureSuggestions(false);
                                                        }}
                                                    >
                                                        {n}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Variety / Parfum */}
                                <div className={styles.formGroup}>
                                    <label>Variété / Parfum</label>
                                    <input
                                        type="text"
                                        value={variety}
                                        onChange={e => setVariety(e.target.value)}
                                        placeholder="Ex: Fraise, Nature, Lavande..."
                                    />
                                </div>
                            </div>

                            {/* Quantity & Unit */}
                            <div className={styles.formGrid3}>
                                <div className={styles.formGroup}>
                                    <label>Quantité</label>
                                    <div className={styles.inputWithIcon}>
                                        <Scale size={16} className={styles.inputIcon} />
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={e => setQuantity(e.target.value)}
                                            placeholder="1"
                                        />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Unité *</label>
                                    <select value={unit} onChange={e => setUnit(e.target.value)}>
                                        {getGroupedUnits().map(group => (
                                            <optgroup key={group.label} label={group.label}>
                                                {group.options.map(u => (
                                                    <option key={u.value} value={u.value}>
                                                        {u.label} ({u.symbol})
                                                    </option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Stock Minimum</label>
                                    <div className={styles.inputWithIcon}>
                                        <Archive size={16} className={styles.inputIcon} />
                                        <input
                                            type="number"
                                            value={minStock}
                                            onChange={e => setMinStock(e.target.value)}
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Auto-generated Designation */}
                            <div className={styles.designationPreview}>
                                <div className={styles.designationHeader}>
                                    <Sparkles size={16} />
                                    <span>Désignation (auto-générée)</span>
                                </div>
                                <div className={styles.designationValue}>
                                    {designation || 'MARQUE Nature Variété Qté'}
                                </div>
                                {shortName && shortName !== designation && (
                                    <div className={styles.designationHeader} style={{ marginTop: '8px', opacity: 0.7 }}>
                                        <span>Ticket: {shortName}</span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* === SECTION 3: Category === */}
                        <section className={styles.formSection}>
                            <div className={styles.sectionHeader}>
                                <Layers size={18} />
                                <h3>Catégorie</h3>
                            </div>

                            <div className={styles.categoryGrid}>
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        className={`${styles.categoryBtn} ${categoryId === cat.id ? styles.selected : ''}`}
                                        onClick={() => {
                                            setCategoryId(cat.id);
                                            setSubcategoryId('');
                                        }}
                                        style={{ '--cat-color': cat.color } as React.CSSProperties}
                                        title={cat.name}
                                    >
                                        <span className={styles.catIcon}>{cat.icon}</span>
                                        <span className={styles.catName}>{cat.name}</span>
                                    </button>
                                ))}
                            </div>

                            {subcategories.length > 0 && (
                                <div className={styles.formGroup}>
                                    <label>Sous-Catégorie</label>
                                    <select
                                        value={subcategoryId}
                                        onChange={e => setSubcategoryId(e.target.value)}
                                    >
                                        <option value="">Sélectionner...</option>
                                        {subcategories.map(sub => (
                                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </section>

                        {/* === SECTION 4: Packaging (NEW) === */}
                        <section className={styles.formSection}>
                            <div className={styles.sectionHeader}>
                                <Box size={18} />
                                <h3>Conditionnement</h3>
                            </div>

                            <div className={styles.packagingGrid}>
                                {/* Supplier Carton */}
                                <div className={styles.packagingCard}>
                                    <div className={styles.packagingHeader}>
                                        <Truck size={16} />
                                        <span>Carton Fournisseur</span>
                                    </div>
                                    <p className={styles.packagingHint}>
                                        Comment vous RECEVEZ les produits du fournisseur
                                    </p>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Unités / Carton</label>
                                            <input
                                                type="number"
                                                value={unitsPerCarton}
                                                onChange={e => setUnitsPerCarton(e.target.value)}
                                                placeholder="Ex: 24"
                                                min="1"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Code-barres Carton</label>
                                            <input
                                                type="text"
                                                value={cartonBarcode}
                                                onChange={e => setCartonBarcode(e.target.value)}
                                                placeholder="Optionnel"
                                            />
                                        </div>
                                    </div>
                                    {unitsPerCarton && (
                                        <div className={styles.packagingExample}>
                                            <span>📦 1 carton = {unitsPerCarton} unités</span>
                                        </div>
                                    )}
                                </div>

                                {/* Selling Pack */}
                                <div className={styles.packagingCard}>
                                    <div className={styles.packagingHeader}>
                                        <Package size={16} />
                                        <span>Pack Vente Client</span>
                                    </div>
                                    <p className={styles.packagingHint}>
                                        Comment vous VENDEZ les packs avec remise au POS
                                    </p>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Unités / Pack</label>
                                            <input
                                                type="number"
                                                value={unitsPerSellingPack}
                                                onChange={e => setUnitsPerSellingPack(e.target.value)}
                                                placeholder="Ex: 6"
                                                min="1"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Prix du Pack</label>
                                            <div className={styles.priceInput}>
                                                <input
                                                    type="number"
                                                    value={sellingPackPrice}
                                                    onChange={e => setSellingPackPrice(e.target.value)}
                                                    placeholder="0"
                                                    min="0"
                                                />
                                                <span className={styles.currency}>DA</span>
                                            </div>
                                        </div>
                                    </div>
                                    {unitsPerSellingPack && sellPrice && (
                                        <div className={styles.packagingExample}>
                                            <span>🛒 Pack x{unitsPerSellingPack}: </span>
                                            {sellingPackPrice ? (
                                                <>
                                                    <strong>{sellingPackPrice} DA</strong>
                                                    <span className={styles.packagingSavings}>
                                                        {' '}(au lieu de {parseFloat(sellPrice) * parseInt(unitsPerSellingPack)} DA)
                                                    </span>
                                                </>
                                            ) : (
                                                <span className={styles.packagingAuto}>
                                                    Prix auto: {Math.round(parseFloat(sellPrice) * parseInt(unitsPerSellingPack) * 0.9)} DA (-10%)
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* === SECTION 5: Pricing === */}
                        <section className={styles.formSection}>
                            <div className={styles.sectionHeader}>
                                <DollarSign size={18} />
                                <h3>Prix</h3>
                            </div>

                            <div className={styles.priceRow}>
                                <div className={styles.priceCard}>
                                    <label>Prix d'Achat *</label>
                                    <div className={styles.priceInput}>
                                        <input
                                            type="number"
                                            value={buyPrice}
                                            onChange={e => setBuyPrice(e.target.value)}
                                            placeholder="0"
                                        />
                                        <span className={styles.currency}>DA</span>
                                    </div>
                                </div>

                                <div className={styles.priceArrow}>→</div>

                                <div className={styles.priceCard}>
                                    <label>Prix de Vente *</label>
                                    <div className={`${styles.priceInput} ${priceWarning && parseFloat(sellPrice) <= parseFloat(buyPrice) ? styles.errorBorder : ''}`}>
                                        <input
                                            type="number"
                                            value={sellPrice}
                                            onChange={e => setSellPrice(e.target.value)}
                                            placeholder="0"
                                        />
                                        <span className={styles.currency}>DA</span>
                                    </div>
                                </div>

                                {/* Margin Badge */}
                                {priceMargin !== null && (
                                    <div className={`${styles.marginBadge} ${priceMargin < 10 ? styles.lowMargin : styles.goodMargin}`}>
                                        <strong>{priceMargin.toFixed(1)}%</strong>
                                        <span>Marge</span>
                                    </div>
                                )}
                            </div>

                            {/* Price Warning */}
                            {priceWarning && (
                                <div className={styles.priceWarning}>
                                    <AlertTriangle size={16} />
                                    <span>{priceWarning}</span>
                                </div>
                            )}

                            {/* Price History (for edit mode) */}
                            {editProduct && priceHistory.length > 0 && (
                                <div className={styles.priceHistory}>
                                    <div className={styles.historyHeader}>
                                        <History size={14} />
                                        <span>Historique des Prix</span>
                                    </div>
                                    <div className={styles.historyList}>
                                        {priceHistory.slice(0, 3).map((entry, idx) => (
                                            <div key={idx} className={styles.historyItem}>
                                                <span className={styles.historyDate}>
                                                    {new Date(entry.date).toLocaleDateString('fr-FR')}
                                                </span>
                                                <span>{formatCurrency(entry.oldPrice)} → {formatCurrency(entry.newPrice)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className={styles.footer}>
                    <button className={styles.resetBtn} onClick={handleReset}>
                        <RotateCcw size={16} />
                        Réinitialiser
                    </button>
                    <div className={styles.footerRight}>
                        <button className={styles.cancelBtn} onClick={onClose}>
                            Annuler
                        </button>
                        <button
                            className={styles.saveBtn}
                            onClick={handleSave}
                            disabled={!isFormValid()}
                        >
                            <Save size={18} />
                            {editProduct ? 'Modifier' : 'Enregistrer'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProductModal;

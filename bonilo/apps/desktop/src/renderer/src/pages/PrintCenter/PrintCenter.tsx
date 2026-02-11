import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    TrendingDown,
    Clock,
    X,
    Minus,
    Plus,
    Check,
    Moon,
    AlertTriangle,
    BoxIcon,
    Zap,
    Sparkles,
} from 'lucide-react';
import { useToast } from '../../components/feedback/Toast';
import { useProductsStore } from '@bonilo/shared/stores';
import { formatCurrency } from '../../utils/formatters';
import styles from './PrintCenter.module.css';

// ============ TEMPLATE DEFINITIONS ============

interface LabelTemplate {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
    color: string;
    hasBanner: boolean;
    bannerText?: string;
    bannerClass?: string;
}

const TEMPLATES: LabelTemplate[] = [
    {
        id: 'standard',
        name: 'Standard',
        icon: <Tag size={24} />,
        description: 'Nom + Prix + Code-barres',
        color: '#3D7C4F',
        hasBanner: false,
    },
    {
        id: 'promo',
        name: 'Promo Flash',
        icon: <Zap size={24} />,
        description: 'Ancien prix barré + remise',
        color: '#EF4444',
        hasBanner: true,
        bannerText: '🔥 PROMO FLASH',
        bannerClass: 'labelPromoBanner',
    },
    {
        id: 'ramadan',
        name: 'Ramadan',
        icon: <Moon size={24} />,
        description: 'Offre spéciale Ramadan',
        color: '#D4A843',
        hasBanner: true,
        bannerText: '☪ OFFRE RAMADAN',
        bannerClass: 'labelRamadanBanner',
    },
    {
        id: 'pack',
        name: 'Pack Éco',
        icon: <BoxIcon size={24} />,
        description: 'Prix pack + prix unitaire',
        color: '#3B82F6',
        hasBanner: false,
    },
    {
        id: 'expiry',
        name: 'Péremption',
        icon: <AlertTriangle size={24} />,
        description: 'DLC proche + remise urgente',
        color: '#F59E0B',
        hasBanner: true,
        bannerText: '⚠ DERNIÈRE CHANCE',
        bannerClass: 'labelWarningBanner',
    },
    {
        id: 'shelf',
        name: 'Rayon',
        icon: <Layers size={24} />,
        description: 'Étiquette gondole longue',
        color: '#8B5CF6',
        hasBanner: false,
    },
];

const DISCOUNT_PRESETS = [10, 15, 20, 25, 30, 50];

// ============ PRINT ITEM ============

interface PrintItem {
    productId: string;
    quantity: number;
}

// ============ COMPONENT ============

export const PrintCenter: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const { products } = useProductsStore();

    // State
    const [selectedTemplate, setSelectedTemplate] = useState('standard');
    const [searchQuery, setSearchQuery] = useState('');

    // Initialize from router state if available (from Bulk Actions)
    const [printItems, setPrintItems] = useState<PrintItem[]>(() => {
        const state = location.state as { selectedProductIds?: string[] } | null;
        if (state?.selectedProductIds && Array.isArray(state.selectedProductIds)) {
            // Validate IDs exist in products (optional but good practice)
            return state.selectedProductIds
                .map(id => ({ productId: id, quantity: 1 }));
        }
        return [];
    });

    const [showPrintConfirm, setShowPrintConfirm] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);

    // Promo editor state
    const [customDiscount, setCustomDiscount] = useState(20);
    const [promoLabel, setPromoLabel] = useState('PROMO');

    // Current template object
    const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];

    // Filtered products
    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return products.slice(0, 60);
        const q = searchQuery.toLowerCase();
        return products.filter(p =>
            (p.name || '').toLowerCase().includes(q) ||
            (p.designation || '').toLowerCase().includes(q) ||
            (p.barcode || '').includes(q) ||
            (p.sku || '').toLowerCase().includes(q) ||
            (p.variety || '').toLowerCase().includes(q)
        );
    }, [products, searchQuery]);

    // Quick action counts
    const lowStockCount = useMemo(() =>
        products.filter(p => p.stock <= (p.minStock || 5)).length,
        [products]
    );

    const recentCount = useMemo(() => {
        const oneWeek = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return products.filter(p => {
            const created = p.createdAt ? new Date(p.createdAt).getTime() : 0;
            return created > oneWeek;
        }).length;
    }, [products]);

    // Total labels
    const totalLabels = printItems.reduce((s, i) => s + i.quantity, 0);

    // First selected product (for preview)
    const previewProduct = useMemo(() => {
        if (printItems.length === 0) return null;
        return products.find(p => p.id === printItems[0].productId) || null;
    }, [printItems, products]);

    // Toggle product
    const toggleProduct = useCallback((productId: string) => {
        setPrintItems(prev => {
            const exists = prev.find(p => p.productId === productId);
            if (exists) return prev.filter(p => p.productId !== productId);
            return [...prev, { productId, quantity: 1 }];
        });
    }, []);

    // Update qty
    const updateQty = useCallback((productId: string, delta: number) => {
        setPrintItems(prev => prev.map(item =>
            item.productId === productId
                ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                : item
        ));
    }, []);

    // Quick actions
    const addLowStock = () => {
        const lowStock = products.filter(p => p.stock <= (p.minStock || 5));
        setPrintItems(prev => {
            const existing = new Set(prev.map(p => p.productId));
            const toAdd = lowStock.filter(p => !existing.has(p.id)).map(p => ({ productId: p.id, quantity: 1 }));
            return [...prev, ...toAdd];
        });
        toast.success(`${lowStock.length} produits stock bas ajoutés`);
    };

    const addRecent = () => {
        const oneWeek = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const recent = products.filter(p => {
            const created = p.createdAt ? new Date(p.createdAt).getTime() : 0;
            return created > oneWeek;
        });
        setPrintItems(prev => {
            const existing = new Set(prev.map(p => p.productId));
            const toAdd = recent.filter(p => !existing.has(p.id)).map(p => ({ productId: p.id, quantity: 1 }));
            return [...prev, ...toAdd];
        });
        toast.success(`${recent.length} nouveaux produits ajoutés`);
    };

    const selectAll = () => {
        const all = filteredProducts.map(p => ({ productId: p.id, quantity: 1 }));
        setPrintItems(all);
        toast.success(`${all.length} produits sélectionnés`);
    };

    // ============ GENERATE LABEL HTML ============

    const generateLabelHTML = useCallback((productId: string): string => {
        const product = products.find(p => p.id === productId);
        if (!product) return '';

        const price = product.sellPrice || product.sellingPrice || 0;
        const priceStr = Math.round(price).toLocaleString('fr-DZ');
        const name = (product.designation || product.name || '').toUpperCase();
        const barcode = product.barcode || '0000000000000';
        const sku = product.sku || '';
        const isPromo = selectedTemplate === 'promo' || selectedTemplate === 'ramadan' || selectedTemplate === 'expiry';
        const oldPrice = isPromo ? Math.round(price / (1 - customDiscount / 100)) : 0;
        const oldPriceStr = oldPrice.toLocaleString('fr-DZ');
        const tpl = currentTemplate;

        // Banner HTML
        let bannerHTML = '';
        if (tpl.hasBanner && tpl.bannerClass && tpl.bannerText) {
            bannerHTML = `<div class="${tpl.bannerClass}">${tpl.bannerText}</div>`;
        }

        // Discount badge
        let discountHTML = '';
        if (isPromo) {
            discountHTML = `<div class="labelDiscountBadge">-${customDiscount}%</div>`;
        }

        // Old price
        let oldPriceHTML = '';
        if (isPromo) {
            oldPriceHTML = `<div class="labelOldPrice">${oldPriceStr} DA</div>`;
        }

        // Pack badge
        let packHTML = '';
        let perUnitHTML = '';
        if (selectedTemplate === 'pack' && product.unitsPerPack) {
            packHTML = `<div class="labelPackBadge">PACK ×${product.unitsPerPack}</div>`;
            const perUnit = Math.round(price / product.unitsPerPack);
            perUnitHTML = `<div class="labelPerUnit">${perUnit.toLocaleString('fr-DZ')} DA / unité</div>`;
        }

        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Étiquette</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, sans-serif;
            background: #e5e7eb;
            display: flex; justify-content: center; align-items: center;
            min-height: 100vh; padding: 20px;
        }
        .labelCard {
            width: 240px; background: #fff; border-radius: 6px;
            overflow: hidden; position: relative;
            box-shadow: 0 2px 12px rgba(0,0,0,0.12);
        }
        .labelPromoBanner {
            background: linear-gradient(135deg, #EF4444, #DC2626);
            color: white; text-align: center; padding: 5px 8px;
            font-size: 10px; font-weight: 800; letter-spacing: 1.5px;
        }
        .labelRamadanBanner {
            background: linear-gradient(135deg, #D4A843, #B8860B);
            color: white; text-align: center; padding: 5px 8px;
            font-size: 10px; font-weight: 800; letter-spacing: 1px;
        }
        .labelWarningBanner {
            background: linear-gradient(135deg, #F59E0B, #D97706);
            color: white; text-align: center; padding: 5px 8px;
            font-size: 9px; font-weight: 800; letter-spacing: 0.5px;
        }
        .labelContent { padding: 14px 16px 10px; }
        .labelProductName {
            font-size: 12px; font-weight: 700; color: #111827;
            text-transform: uppercase; line-height: 1.25; margin-bottom: 6px;
            max-height: 32px; overflow: hidden;
        }
        .labelOldPrice {
            font-size: 14px; font-weight: 600; color: #9CA3AF;
            text-decoration: line-through; margin-bottom: 2px;
        }
        .labelPriceRow {
            display: flex; align-items: flex-end;
            justify-content: space-between; margin-bottom: 8px;
        }
        .labelPrice { display: flex; align-items: baseline; }
        .labelPriceValue {
            font-size: 40px; font-weight: 900; color: #000;
            letter-spacing: -2px; line-height: 1;
        }
        .labelPriceCurrency {
            font-size: 14px; font-weight: 700; color: #374151;
            margin-left: 3px; align-self: flex-start; margin-top: 6px;
        }
        .labelDiscountBadge {
            position: absolute; top: ${tpl.hasBanner ? '35px' : '10px'}; right: 10px;
            background: #EF4444; color: white; font-size: 13px;
            font-weight: 800; padding: 5px 10px; border-radius: 8px;
            box-shadow: 0 2px 8px rgba(239,68,68,0.35);
        }
        .labelPackBadge {
            position: absolute; top: 10px; right: 10px;
            background: #3B82F6; color: white; font-size: 11px;
            font-weight: 800; padding: 4px 10px; border-radius: 6px;
            box-shadow: 0 2px 8px rgba(59,130,246,0.3);
        }
        .labelPerUnit {
            font-size: 10px; color: #6B7280; font-weight: 600; margin-top: 2px;
        }
        .labelBarcode {
            display: flex; align-items: flex-end;
            justify-content: space-between; padding: 6px 16px 10px;
            border-top: 1px solid #F3F4F6;
        }
        .barcodeVisual { display: flex; flex-direction: column; gap: 2px; }
        .barcodeBars { display: flex; gap: 1px; height: 22px; }
        .barcodeBars span { background: #000; width: 2px; }
        .barcodeBars span:nth-child(odd) { width: 1px; }
        .barcodeBars span:nth-child(3n) { width: 3px; }
        .barcodeBars span:nth-child(5n) { width: 1px; }
        .barcodeNumber {
            font-size: 9px; font-weight: 600; color: #6B7280;
            letter-spacing: 1.5px; font-family: 'Courier New', monospace;
        }
        .labelSku {
            font-size: 8px; font-weight: 600; color: #9CA3AF; text-align: right;
        }
        @media print {
            body { background: white; padding: 0; min-height: auto; }
            .labelCard { box-shadow: none; border: 1px solid #eee; }
            @page { margin: 2mm; size: 62mm 42mm; }
        }
    </style>
</head>
<body>
    <div class="labelCard">
        ${bannerHTML}
        ${discountHTML}
        ${packHTML}
        <div class="labelContent">
            <div class="labelProductName">${name}</div>
            ${oldPriceHTML}
            <div class="labelPriceRow">
                <div>
                    <div class="labelPrice">
                        <span class="labelPriceValue">${priceStr}</span>
                        <span class="labelPriceCurrency">DA</span>
                    </div>
                    ${perUnitHTML}
                </div>
            </div>
        </div>
        <div class="labelBarcode">
            <div class="barcodeVisual">
                <div class="barcodeBars">
                    ${'<span></span>'.repeat(20)}
                </div>
                <div class="barcodeNumber">${barcode}</div>
            </div>
            <div class="labelSku">${sku}</div>
        </div>
    </div>
</body>
</html>`;
    }, [products, selectedTemplate, customDiscount, currentTemplate]);

    // ============ PRINT ============

    const handlePrint = async () => {
        if (printItems.length === 0) return;
        setIsPrinting(true);
        setShowPrintConfirm(false);

        let successCount = 0;

        // Create a single print window with all labels
        const allLabelsHTML = printItems.flatMap(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return [];
            return Array(item.quantity).fill(generateLabelHTML(item.productId));
        });

        if (allLabelsHTML.length > 0) {
            // Build a combined print document
            const combinedHTML = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8"><title>Impression Étiquettes - Bonilo</title>
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; }
    .page { page-break-after: always; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 10px; }
    .page:last-child { page-break-after: auto; }
    @media print { @page { margin: 2mm; } }
</style>
</head><body>
${allLabelsHTML.map(html => {
                // Extract just the label card from each HTML
                const match = html.match(/<div class="labelCard">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/);
                const style = html.match(/<style>([\s\S]*?)<\/style>/);
                return `<div class="page"><style>${style?.[1] || ''}</style>${match?.[0] || ''}</div>`;
            }).join('\n')}
</body></html>`;

            const printWindow = window.open('', '_blank', 'width=500,height=600');
            if (printWindow) {
                printWindow.document.write(combinedHTML);
                printWindow.document.close();
                printWindow.onload = () => {
                    setTimeout(() => {
                        printWindow.print();
                        printWindow.close();
                    }, 500);
                };
                successCount = allLabelsHTML.length;
            }
        }

        setIsPrinting(false);
        toast.success(`${successCount} étiquettes envoyées à l'impression`);
    };

    // ============ RENDER LIVE PREVIEW ============

    const renderLivePreview = () => {
        if (!previewProduct) return null;

        const price = previewProduct.sellPrice || previewProduct.sellingPrice || 0;
        const priceStr = Math.round(price).toLocaleString('fr-DZ');
        const name = (previewProduct.designation || previewProduct.name || '').toUpperCase();
        const barcode = previewProduct.barcode || '0000000000000';
        const sku = previewProduct.sku || '';
        const isPromo = ['promo', 'ramadan', 'expiry'].includes(selectedTemplate);
        const oldPrice = isPromo ? Math.round(price / (1 - customDiscount / 100)) : 0;

        return (
            <div className={styles.labelCard}>
                {/* Banners */}
                {currentTemplate.hasBanner && currentTemplate.bannerClass && (
                    <div className={styles[currentTemplate.bannerClass]}>
                        {currentTemplate.bannerText}
                    </div>
                )}

                {/* Discount Badge */}
                {isPromo && (
                    <div className={styles.labelDiscountBadge}>-{customDiscount}%</div>
                )}

                {/* Pack Badge */}
                {selectedTemplate === 'pack' && previewProduct.unitsPerPack && (
                    <div className={styles.labelPackBadge}>PACK ×{previewProduct.unitsPerPack}</div>
                )}

                <div className={styles.labelContent}>
                    <div className={styles.labelProductName}>{name}</div>

                    {isPromo && (
                        <div className={styles.labelOldPrice}>{oldPrice.toLocaleString('fr-DZ')} DA</div>
                    )}

                    <div className={styles.labelPriceRow}>
                        <div>
                            <div className={styles.labelPrice}>
                                <span className={styles.labelPriceValue}>{priceStr}</span>
                                <span className={styles.labelPriceCurrency}>DA</span>
                            </div>
                            {selectedTemplate === 'pack' && previewProduct.unitsPerPack && (
                                <div className={styles.labelPerUnit}>
                                    {Math.round(price / previewProduct.unitsPerPack).toLocaleString('fr-DZ')} DA / unité
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.labelBarcode}>
                    <div className={styles.barcodeVisual}>
                        <div className={styles.barcodeBars}>
                            {Array.from({ length: 20 }, (_, i) => <span key={i} />)}
                        </div>
                        <div className={styles.barcodeNumber}>{barcode}</div>
                    </div>
                    <div className={styles.labelSku}>{sku}</div>
                </div>
            </div>
        );
    };

    // ============ RENDER ============

    const showPromoEditor = ['promo', 'ramadan', 'expiry'].includes(selectedTemplate);

    return (
        <div className={styles.printCenter}>
            {/* ===== HEADER ===== */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <button className={styles.backBtn} onClick={() => navigate('/')}>
                        <ArrowLeft size={20} />
                    </button>
                    <div className={styles.headerInfo}>
                        <h1>Centre d'Impression</h1>
                        <p>Étiquettes prix, promotions & rayon</p>
                    </div>
                </div>
                <div className={styles.headerRight}>
                    <div className={styles.headerStat}>
                        <span className={styles.statValue}>{printItems.length}</span>
                        <span className={styles.statLabel}>Produits</span>
                    </div>
                    <div className={styles.headerStat}>
                        <span className={styles.statValue}>{totalLabels}</span>
                        <span className={styles.statLabel}>Étiquettes</span>
                    </div>
                </div>
            </header>

            {/* ===== MAIN ===== */}
            <div className={styles.mainContent}>
                {/* LEFT PANEL */}
                <div className={styles.leftPanel}>
                    {/* Step 1: Template Selection */}
                    <div>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionTitle}>
                                <span className={styles.stepBadge}>1</span>
                                <h2>Choisir le modèle</h2>
                            </div>
                        </div>
                        <div className={styles.templateGrid}>
                            {TEMPLATES.map(tpl => (
                                <button
                                    key={tpl.id}
                                    className={`${styles.templateCard} ${selectedTemplate === tpl.id ? styles.selected : ''}`}
                                    onClick={() => setSelectedTemplate(tpl.id)}
                                    style={{ '--tpl-color': tpl.color } as React.CSSProperties}
                                >
                                    <div className={styles.tplIconWrap}>{tpl.icon}</div>
                                    <span className={styles.tplName}>{tpl.name}</span>
                                    <span className={styles.tplDesc}>{tpl.description}</span>
                                    {selectedTemplate === tpl.id && (
                                        <CheckCircle size={16} className={styles.tplCheck} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Promo Editor (shown for promo/ramadan/expiry) */}
                    {showPromoEditor && (
                        <div className={styles.promoEditor}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionTitle}>
                                    <Sparkles size={18} color={currentTemplate.color} />
                                    <h2>Configuration Promo</h2>
                                </div>
                            </div>
                            <div className={styles.promoGrid}>
                                <div className={styles.promoField}>
                                    <label>Libellé</label>
                                    <input
                                        type="text"
                                        value={promoLabel}
                                        onChange={e => setPromoLabel(e.target.value)}
                                        placeholder="Ex: PROMO RAMADAN"
                                    />
                                </div>
                                <div className={styles.promoField}>
                                    <label>Remise personnalisée</label>
                                    <input
                                        type="number"
                                        value={customDiscount}
                                        onChange={e => setCustomDiscount(Math.min(99, Math.max(1, Number(e.target.value))))}
                                        min={1}
                                        max={99}
                                    />
                                </div>
                                <div className={`${styles.promoField} ${styles.promoDiscount}`}>
                                    <label>Remise rapide</label>
                                    <div className={styles.discountBtns}>
                                        {DISCOUNT_PRESETS.map(d => (
                                            <button
                                                key={d}
                                                className={`${styles.discountBtn} ${customDiscount === d ? styles.active : ''}`}
                                                onClick={() => setCustomDiscount(d)}
                                            >
                                                -{d}%
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Products Selection */}
                    <div>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionTitle}>
                                <span className={styles.stepBadge}>2</span>
                                <h2>Sélectionner les produits</h2>
                            </div>
                            <button className={styles.sectionAction} onClick={selectAll}>
                                Tout sélectionner
                            </button>
                        </div>

                        {/* Search */}
                        <div className={styles.searchBar}>
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Rechercher par nom, code-barres ou SKU..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button className={styles.clearSearch} onClick={() => setSearchQuery('')}>
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Quick Chips */}
                        <div className={styles.quickChips}>
                            <button className={styles.chip} onClick={addLowStock} disabled={lowStockCount === 0}>
                                <TrendingDown size={14} />
                                Stock Bas
                                <span className={styles.chipBadge}>{lowStockCount}</span>
                            </button>
                            <button className={styles.chip} onClick={addRecent} disabled={recentCount === 0}>
                                <Clock size={14} />
                                Nouveaux
                                <span className={styles.chipBadge}>{recentCount}</span>
                            </button>
                            {printItems.length > 0 && (
                                <button className={styles.chip} onClick={() => setPrintItems([])}>
                                    <X size={14} />
                                    Vider la sélection
                                </button>
                            )}
                        </div>

                        {/* Products List */}
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
                                            className={styles.productCheck}
                                            onClick={() => toggleProduct(product.id)}
                                        >
                                            {isSelected && <Check size={14} />}
                                        </div>
                                        <span className={styles.productEmoji}>
                                            {product.emoji || '📦'}
                                        </span>
                                        <div className={styles.productInfo} onClick={() => toggleProduct(product.id)}>
                                            <span className={styles.productName}>
                                                {product.designation || product.name}
                                            </span>
                                            <span className={styles.productMeta}>
                                                {product.sku || 'N/A'} • {product.barcode || 'Sans code'}
                                            </span>
                                        </div>
                                        <span className={styles.productPrice}>
                                            {formatCurrency(product.sellPrice || product.sellingPrice)}
                                        </span>
                                        {isSelected && (
                                            <div className={styles.qtyControls}>
                                                <button
                                                    className={`${styles.qtyBtn} ${styles.qtyMinus}`}
                                                    onClick={() => updateQty(product.id, -1)}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className={styles.qtyValue}>{item?.quantity}</span>
                                                <button
                                                    className={`${styles.qtyBtn} ${styles.qtyPlus}`}
                                                    onClick={() => updateQty(product.id, 1)}
                                                >
                                                    <Plus size={14} />
                                                </button>
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
                    </div>
                </div>

                {/* RIGHT PANEL: Live Preview */}
                <div className={styles.rightPanel}>
                    <div className={styles.previewHeader}>
                        <div className={styles.previewTitle}>
                            <Eye size={18} />
                            Aperçu en direct
                        </div>
                        <span className={styles.previewBadge}>
                            {currentTemplate.name}
                        </span>
                    </div>

                    <div className={styles.previewArea}>
                        {previewProduct ? (
                            <div className={styles.liveLabel}>
                                {renderLivePreview()}
                            </div>
                        ) : (
                            <div className={styles.previewEmpty}>
                                <Tag size={48} />
                                <p>Sélectionnez un produit</p>
                                <span>L'aperçu apparaîtra ici</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.printBar}>
                        <button
                            className={`${styles.printBtn} ${styles.printBtnSecondary}`}
                            disabled={printItems.length === 0}
                            onClick={() => {
                                if (previewProduct) {
                                    const html = generateLabelHTML(previewProduct.id);
                                    const w = window.open('', '_blank', 'width=400,height=400');
                                    if (w) { w.document.write(html); w.document.close(); }
                                }
                            }}
                        >
                            <Eye size={18} />
                            Aperçu
                        </button>
                        <button
                            className={`${styles.printBtn} ${styles.printBtnPrimary}`}
                            disabled={printItems.length === 0 || isPrinting}
                            onClick={() => setShowPrintConfirm(true)}
                        >
                            <Printer size={18} />
                            {isPrinting ? 'Impression...' : `Imprimer (${totalLabels})`}
                        </button>
                    </div>
                </div>
            </div>

            {/* ===== PRINT CONFIRM MODAL ===== */}
            {showPrintConfirm && (
                <div className={styles.overlay} onClick={() => setShowPrintConfirm(false)}>
                    <div className={styles.printModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Confirmer l'impression</h2>
                            <button className={styles.modalClose} onClick={() => setShowPrintConfirm(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.printConfirmInfo}>
                                <div className={styles.confirmRow}>
                                    <span>Modèle</span>
                                    <strong>{currentTemplate.name}</strong>
                                </div>
                                <div className={styles.confirmRow}>
                                    <span>Produits</span>
                                    <strong>{printItems.length}</strong>
                                </div>
                                <div className={styles.confirmRow}>
                                    <span>Total étiquettes</span>
                                    <strong>{totalLabels}</strong>
                                </div>
                                {showPromoEditor && (
                                    <div className={styles.confirmRow}>
                                        <span>Remise</span>
                                        <strong style={{ color: '#EF4444' }}>-{customDiscount}%</strong>
                                    </div>
                                )}
                            </div>
                            <div className={styles.modalActions}>
                                <button className={styles.modalCancelBtn} onClick={() => setShowPrintConfirm(false)}>
                                    Annuler
                                </button>
                                <button className={styles.modalPrintBtn} onClick={handlePrint}>
                                    <Printer size={18} />
                                    Lancer l'impression
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrintCenter;

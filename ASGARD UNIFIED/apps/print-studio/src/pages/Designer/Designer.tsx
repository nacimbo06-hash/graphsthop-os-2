import { useState } from 'react';
import {
    Download,
    Printer,
    RotateCcw,
    Palette,
    Type,
    Hash,
    DollarSign,
    Barcode,
    Copy,
    Trash2,
    ChevronDown,
    Check,
} from 'lucide-react';
import styles from './Designer.module.css';

interface LabelData {
    productName: string;
    sku: string;
    price: string;
    currency: string;
    barcode: string;
    layout: 'layout-1' | 'layout-2' | 'layout-3' | 'layout-4' | 'layout-5' | 'layout-6';
    accentColor: string;
}

const layouts = [
    { id: 'layout-1', name: 'Classique Haut', description: 'En-tête jaune en haut' },
    { id: 'layout-2', name: 'En-tête Centré', description: 'Bande jaune centrée' },
    { id: 'layout-3', name: 'Accent Coin', description: 'En-tête coin supérieur' },
    { id: 'layout-4', name: 'Pleine Largeur', description: 'En-tête large' },
    { id: 'layout-5', name: 'Compact', description: 'Design minimal' },
    { id: 'layout-6', name: 'Premium', description: 'Accent doré' },
];

const accentColors = [
    { id: 'yellow', color: '#fbbf24', name: 'Jaune' },
    { id: 'green', color: '#22c55e', name: 'Vert' },
    { id: 'blue', color: '#3b82f6', name: 'Bleu' },
    { id: 'red', color: '#ef4444', name: 'Rouge' },
    { id: 'purple', color: '#a855f7', name: 'Violet' },
    { id: 'gold', color: '#d4af37', name: 'Or' },
];

const defaultLabel: LabelData = {
    productName: 'Café Arabica Premium',
    sku: '9876-5432-10',
    price: '890.00',
    currency: 'DA',
    barcode: '5901234123457',
    layout: 'layout-1',
    accentColor: '#fbbf24',
};

export function Designer() {
    const [label, setLabel] = useState<LabelData>(defaultLabel);
    const [showLayoutPicker, setShowLayoutPicker] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [zoom, setZoom] = useState(1.5);

    const updateLabel = (field: keyof LabelData, value: string) => {
        setLabel(prev => ({ ...prev, [field]: value }));
    };

    const resetLabel = () => {
        setLabel(defaultLabel);
    };

    const renderLabelPreview = () => {
        const accentStyle = { '--accent-color': label.accentColor } as React.CSSProperties;

        switch (label.layout) {
            case 'layout-1':
                // ETIX Top Left: Product, SKU, Price all in the yellow box
                return (
                    <div className={styles.labelPreview} style={accentStyle}>
                        <div className={styles.labelHeaderFullBox}>
                            <div className={styles.headerTopLine}>
                                <div className={styles.headerLeft}>
                                    <span className={styles.productNameBold}>{label.productName}</span>
                                    <span className={styles.skuLineInHeader}>{label.sku}</span>
                                </div>
                                <div className={styles.headerRight}>
                                    <span className={styles.retailPriceLabel}>Retail Price</span>
                                </div>
                            </div>
                            <div className={styles.headerPriceRow}>
                                <span className={styles.priceValueXL}>
                                    <span className={styles.currencySmall}>{label.currency}</span>
                                    {label.price}
                                </span>
                            </div>
                        </div>
                        <div className={styles.barcodeSectionAlone}>
                            <div className={styles.barcodeCenter}>
                                {Array.from({ length: 50 }).map((_, i) => (
                                    <div key={i} className={styles.bar} style={{ width: i % 4 === 0 ? '1px' : '2px' }} />
                                ))}
                            </div>
                            <span className={styles.barcodeNumberCenter}>{label.barcode}</span>
                        </div>
                    </div>
                );

            case 'layout-2':
                // ETIX Top Center: QR area removed, yellow box on right
                return (
                    <div className={styles.labelPreview} style={accentStyle}>
                        <div className={styles.splitLayout}>
                            <div className={styles.splitLeft}>
                                <span className={styles.productNameNormal}>{label.productName}</span>
                                <span className={styles.skuGrey}>{label.sku}</span>
                                <div className={styles.barcodeLeft}>
                                    {Array.from({ length: 30 }).map((_, i) => (
                                        <div key={i} className={styles.bar} style={{ width: i % 4 === 0 ? '1px' : '2px' }} />
                                    ))}
                                </div>
                            </div>
                            <div className={styles.splitRightAccent}>
                                <span className={styles.retailPriceLabelDark}>Retail Price</span>
                                <span className={styles.priceValueLrg}>
                                    <span className={styles.currencyMed}>{label.currency}</span>
                                    {label.price}
                                </span>
                            </div>
                        </div>
                    </div>
                );

            case 'layout-3':
                // ETIX Top Right: Product top left, color box right
                return (
                    <div className={styles.labelPreview} style={accentStyle}>
                        <div className={styles.layout3Body}>
                            <div className={styles.l3Left}>
                                <span className={styles.productNameLarge}>{label.productName}</span>
                                <span className={styles.skuGrey}>{label.sku}</span>
                            </div>
                            <div className={styles.l3RightAccent}>
                                <span className={styles.retailPriceLabelDark}>Prix</span>
                                <span className={styles.priceValueBold}>
                                    {label.currency}{label.price}
                                </span>
                            </div>
                        </div>
                        <div className={styles.barcodeBottomFull}>
                            <div className={styles.barcodeCenter}>
                                {Array.from({ length: 60 }).map((_, i) => (
                                    <div key={i} className={styles.bar} style={{ width: i % 5 === 0 ? '1px' : '2px' }} />
                                ))}
                            </div>
                            <span className={styles.barcodeNumberCenter}>{label.barcode}</span>
                        </div>
                    </div>
                );

            case 'layout-4':
                // ETIX Bottom Left: Floating accent box in middle
                return (
                    <div className={styles.labelPreview} style={accentStyle}>
                        <div className={styles.l4Header}>
                            <span className={styles.productNameNormal}>{label.productName}</span>
                            <span className={styles.skuRight}>{label.sku}</span>
                        </div>
                        <div className={styles.l4CenterAccent}>
                            <span className={styles.retailPriceLabelDark}>Retail Price</span>
                            <span className={styles.priceValueHuge}>{label.currency}{label.price}</span>
                        </div>
                        <div className={styles.barcodeBottomFull}>
                            <div className={styles.barcodeCenter}>
                                {Array.from({ length: 60 }).map((_, i) => (
                                    <div key={i} className={styles.bar} style={{ width: i % 4 === 0 ? '1px' : '2px' }} />
                                ))}
                            </div>
                            <span className={styles.barcodeNumberCenter}>{label.barcode}</span>
                        </div>
                    </div>
                );

            case 'layout-5':
                // ETIX Bottom Center: Accent box bottom left
                return (
                    <div className={styles.labelPreview} style={accentStyle}>
                        <div className={styles.l5Top}>
                            <span className={styles.productNameLarge}>{label.productName}</span>
                            <span className={styles.skuGrey}>{label.sku}</span>
                        </div>
                        <div className={styles.l5BottomRow}>
                            <div className={styles.l5PriceAccent}>
                                <span className={styles.retailPriceLabelDark}>Prix</span>
                                <span className={styles.priceValueBold}>{label.currency}{label.price}</span>
                            </div>
                            <div className={styles.l5BarcodeArea}>
                                <div className={styles.barcodeCompact}>
                                    {Array.from({ length: 30 }).map((_, i) => (
                                        <div key={i} className={styles.bar} style={{ width: i % 3 === 0 ? '1px' : '2px' }} />
                                    ))}
                                </div>
                                <span className={styles.barcodeNumberSmall}>{label.barcode}</span>
                            </div>
                        </div>
                    </div>
                );

            case 'layout-6':
                // ETIX Bottom Right: High Barcode at top
                return (
                    <div className={styles.labelPreview} style={accentStyle}>
                        <div className={styles.l6BarcodeTop}>
                            <div className={styles.barcodeCenter}>
                                {Array.from({ length: 60 }).map((_, i) => (
                                    <div key={i} className={styles.bar} style={{ width: i % 4 === 0 ? '1px' : '2px' }} />
                                ))}
                            </div>
                            <span className={styles.barcodeNumberCenter}>{label.barcode}</span>
                        </div>
                        <div className={styles.l6BottomPart}>
                            <div className={styles.l6Info}>
                                <span className={styles.productNameNormal}>{label.productName}</span>
                                <span className={styles.skuGrey}>{label.sku}</span>
                            </div>
                            <div className={styles.l6PriceAccent}>
                                <span className={styles.priceValueBold}>{label.currency}{label.price}</span>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className={styles.designer}>
            {/* Toolbar */}
            <header className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                    <h1 className={styles.title}>Éditeur d'Étiquettes</h1>
                </div>

                <div className={styles.toolbarCenter}>
                    {/* Layout Picker */}
                    <div className={styles.pickerWrapper}>
                        <button
                            className={styles.pickerBtn}
                            onClick={() => setShowLayoutPicker(!showLayoutPicker)}
                        >
                            <span>{layouts.find(l => l.id === label.layout)?.name}</span>
                            <ChevronDown size={16} />
                        </button>
                        {showLayoutPicker && (
                            <div className={styles.pickerDropdown}>
                                {layouts.map(layout => (
                                    <button
                                        key={layout.id}
                                        className={`${styles.pickerOption} ${label.layout === layout.id ? styles.active : ''}`}
                                        onClick={() => {
                                            updateLabel('layout', layout.id);
                                            setShowLayoutPicker(false);
                                        }}
                                    >
                                        <div>
                                            <span className={styles.optionName}>{layout.name}</span>
                                            <span className={styles.optionDesc}>{layout.description}</span>
                                        </div>
                                        {label.layout === layout.id && <Check size={16} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Color Picker */}
                    <div className={styles.pickerWrapper}>
                        <button
                            className={styles.colorPickerBtn}
                            onClick={() => setShowColorPicker(!showColorPicker)}
                        >
                            <div className={styles.colorSwatch} style={{ background: label.accentColor }} />
                            <Palette size={16} />
                        </button>
                        {showColorPicker && (
                            <div className={styles.colorDropdown}>
                                {accentColors.map(color => (
                                    <button
                                        key={color.id}
                                        className={`${styles.colorOption} ${label.accentColor === color.color ? styles.active : ''}`}
                                        onClick={() => {
                                            updateLabel('accentColor', color.color);
                                            setShowColorPicker(false);
                                        }}
                                    >
                                        <div className={styles.colorSwatch} style={{ background: color.color }} />
                                        <span>{color.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.toolbarRight}>
                    <button className={styles.iconBtn} onClick={resetLabel} title="Réinitialiser">
                        <RotateCcw size={18} />
                    </button>
                    <button className={styles.actionBtn}>
                        <Download size={18} />
                        <span>Exporter</span>
                    </button>
                    <button className={styles.primaryBtn}>
                        <Printer size={18} />
                        <span>Imprimer</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className={styles.content}>
                {/* Properties Panel */}
                <aside className={styles.propertiesPanel}>
                    <h2>Propriétés</h2>

                    <div className={styles.propertyGroup}>
                        <label>
                            <Type size={14} />
                            <span>Nom du Produit</span>
                        </label>
                        <input
                            type="text"
                            value={label.productName}
                            onChange={(e) => updateLabel('productName', e.target.value)}
                            placeholder="Entrez le nom..."
                        />
                    </div>

                    <div className={styles.propertyGroup}>
                        <label>
                            <Hash size={14} />
                            <span>Code SKU</span>
                        </label>
                        <input
                            type="text"
                            value={label.sku}
                            onChange={(e) => updateLabel('sku', e.target.value)}
                            placeholder="9876-5432-10"
                        />
                    </div>

                    <div className={styles.propertyRow}>
                        <div className={styles.propertyGroup}>
                            <label>
                                <DollarSign size={14} />
                                <span>Prix</span>
                            </label>
                            <input
                                type="text"
                                value={label.price}
                                onChange={(e) => updateLabel('price', e.target.value)}
                                placeholder="99.99"
                            />
                        </div>
                        <div className={styles.propertyGroup}>
                            <label>
                                <span>Devise</span>
                            </label>
                            <select
                                value={label.currency}
                                onChange={(e) => updateLabel('currency', e.target.value)}
                            >
                                <option value="DA">DA</option>
                                <option value="€">€</option>
                                <option value="$">$</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.propertyGroup}>
                        <label>
                            <Barcode size={14} />
                            <span>Code-barres</span>
                        </label>
                        <input
                            type="text"
                            value={label.barcode}
                            onChange={(e) => updateLabel('barcode', e.target.value)}
                            placeholder="5901234123457"
                        />
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.quickActions}>
                        <h3>Actions Rapides</h3>
                        <div className={styles.actionGrid}>
                            <button className={styles.quickBtn}>
                                <Copy size={16} />
                                <span>Dupliquer</span>
                            </button>
                            <button className={styles.quickBtn}>
                                <Trash2 size={16} />
                                <span>Effacer</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Canvas Area */}
                <div className={styles.canvasArea}>
                    <div className={styles.canvasContainer}>
                        <div
                            className={styles.canvas}
                            style={{ transform: `scale(${zoom})` }}
                        >
                            {renderLabelPreview()}
                        </div>
                    </div>

                    {/* Zoom Controls */}
                    <div className={styles.zoomControls}>
                        <button onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}>−</button>
                        <span>{Math.round(zoom * 100)}%</span>
                        <button onClick={() => setZoom(Math.min(3, zoom + 0.25))}>+</button>
                    </div>

                    {/* Size Info */}
                    <div className={styles.sizeInfo}>
                        60mm × 40mm • ETIX Format
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Designer;

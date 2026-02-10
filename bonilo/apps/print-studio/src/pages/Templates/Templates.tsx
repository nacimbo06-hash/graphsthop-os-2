import { useState } from 'react';
import {
    Search,
    Star,
    Download,
    Eye,
    Sparkles,
} from 'lucide-react';
import styles from './Templates.module.css';

interface Template {
    id: string;
    name: string;
    description: string;
    layout: 'layout-1' | 'layout-2' | 'layout-3' | 'layout-4' | 'layout-5' | 'layout-6';
    isPro?: boolean;
    isPopular?: boolean;
}

const templates: Template[] = [
    {
        id: 'classic-top',
        name: 'Classique Haut',
        description: 'En-tête jaune en haut, code-barres en bas',
        layout: 'layout-1',
        isPopular: true,
    },
    {
        id: 'centered-header',
        name: 'En-tête Centré',
        description: 'Bande jaune centrée avec prix en dessous',
        layout: 'layout-2',
        isPopular: true,
    },
    {
        id: 'corner-accent',
        name: 'Accent Coin',
        description: 'En-tête coin supérieur, prix à droite',
        layout: 'layout-3',
    },
    {
        id: 'full-width',
        name: 'Pleine Largeur',
        description: 'En-tête large, prix centré',
        layout: 'layout-4',
    },
    {
        id: 'compact',
        name: 'Compact',
        description: 'Design épuré et compact',
        layout: 'layout-5',
    },
    {
        id: 'premium',
        name: 'Premium',
        description: 'Style premium avec accent doré',
        layout: 'layout-6',
        isPro: true,
    },
];

// Sample preview data
const previewData = {
    productName: 'Produit',
    sku: '9876-5432-10',
    price: '99.99',
    currency: 'DA',
    barcode: '0123456789',
};

export function Templates() {
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

    const filteredTemplates = templates.filter((template) =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderLabelPreview = (layout: Template['layout']) => {
        const accentStyle = { '--accent-color': '#fbbf24' } as React.CSSProperties; // Default to yellow for preview

        switch (layout) {
            case 'layout-1':
                // ETIX Top Left: Product, SKU, Price all in the yellow box
                return (
                    <div className={styles.labelPreview} style={accentStyle}>
                        <div className={styles.labelHeaderFullBox}>
                            <div className={styles.headerTopLine}>
                                <div className={styles.headerLeft}>
                                    <span className={styles.productNameBold}>{previewData.productName}</span>
                                    <span className={styles.skuLineInHeader}>{previewData.sku}</span>
                                </div>
                                <div className={styles.headerRight}>
                                    <span className={styles.retailPriceLabel}>Retail Price</span>
                                </div>
                            </div>
                            <div className={styles.headerPriceRow}>
                                <span className={styles.priceValueXL}>
                                    <span className={styles.currencySmall}>{previewData.currency}</span>
                                    {previewData.price}
                                </span>
                            </div>
                        </div>
                        <div className={styles.barcodeSectionAlone}>
                            <div className={styles.barcodeCenter}>
                                {Array.from({ length: 50 }).map((_, i) => (
                                    <div key={i} className={styles.bar} style={{ width: i % 4 === 0 ? '1px' : '2px' }} />
                                ))}
                            </div>
                            <span className={styles.barcodeNumberCenter}>{previewData.barcode}</span>
                        </div>
                    </div>
                );

            case 'layout-2':
                // ETIX Top Center: QR area removed, yellow box on right
                return (
                    <div className={styles.labelPreview} style={accentStyle}>
                        <div className={styles.splitLayout}>
                            <div className={styles.splitLeft}>
                                <span className={styles.productNameNormal}>{previewData.productName}</span>
                                <span className={styles.skuGrey}>{previewData.sku}</span>
                                <div className={styles.barcodeLeft}>
                                    {Array.from({ length: 30 }).map((_, i) => (
                                        <div key={i} className={styles.bar} style={{ width: i % 4 === 0 ? '1px' : '2px' }} />
                                    ))}
                                </div>
                            </div>
                            <div className={styles.splitRightAccent}>
                                <span className={styles.retailPriceLabelDark}>Retail Price</span>
                                <span className={styles.priceValueLrg}>
                                    <span className={styles.currencyMed}>{previewData.currency}</span>
                                    {previewData.price}
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
                                <span className={styles.productNameLarge}>{previewData.productName}</span>
                                <span className={styles.skuGrey}>{previewData.sku}</span>
                            </div>
                            <div className={styles.l3RightAccent}>
                                <span className={styles.retailPriceLabelDark}>Prix</span>
                                <span className={styles.priceValueBold}>
                                    {previewData.currency}{previewData.price}
                                </span>
                            </div>
                        </div>
                        <div className={styles.barcodeBottomFull}>
                            <div className={styles.barcodeCenter}>
                                {Array.from({ length: 60 }).map((_, i) => (
                                    <div key={i} className={styles.bar} style={{ width: i % 5 === 0 ? '1px' : '2px' }} />
                                ))}
                            </div>
                            <span className={styles.barcodeNumberCenter}>{previewData.barcode}</span>
                        </div>
                    </div>
                );

            case 'layout-4':
                // ETIX Bottom Left: Floating accent box in middle
                return (
                    <div className={styles.labelPreview} style={accentStyle}>
                        <div className={styles.l4Header}>
                            <span className={styles.productNameNormal}>{previewData.productName}</span>
                            <span className={styles.skuRight}>{previewData.sku}</span>
                        </div>
                        <div className={styles.l4CenterAccent}>
                            <span className={styles.retailPriceLabelDark}>Retail Price</span>
                            <span className={styles.priceValueHuge}>{previewData.currency}{previewData.price}</span>
                        </div>
                        <div className={styles.barcodeBottomFull}>
                            <div className={styles.barcodeCenter}>
                                {Array.from({ length: 60 }).map((_, i) => (
                                    <div key={i} className={styles.bar} style={{ width: i % 4 === 0 ? '1px' : '2px' }} />
                                ))}
                            </div>
                            <span className={styles.barcodeNumberCenter}>{previewData.barcode}</span>
                        </div>
                    </div>
                );

            case 'layout-5':
                // ETIX Bottom Center: Accent box bottom left
                return (
                    <div className={styles.labelPreview} style={accentStyle}>
                        <div className={styles.l5Top}>
                            <span className={styles.productNameLarge}>{previewData.productName}</span>
                            <span className={styles.skuGrey}>{previewData.sku}</span>
                        </div>
                        <div className={styles.l5BottomRow}>
                            <div className={styles.l5PriceAccent}>
                                <span className={styles.retailPriceLabelDark}>Prix</span>
                                <span className={styles.priceValueBold}>{previewData.currency}{previewData.price}</span>
                            </div>
                            <div className={styles.l5BarcodeArea}>
                                <div className={styles.barcodeCompact}>
                                    {Array.from({ length: 30 }).map((_, i) => (
                                        <div key={i} className={styles.bar} style={{ width: i % 3 === 0 ? '1px' : '2px' }} />
                                    ))}
                                </div>
                                <span className={styles.barcodeNumberSmall}>{previewData.barcode}</span>
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
                            <span className={styles.barcodeNumberCenter}>{previewData.barcode}</span>
                        </div>
                        <div className={styles.l6BottomPart}>
                            <div className={styles.l6Info}>
                                <span className={styles.productNameNormal}>{previewData.productName}</span>
                                <span className={styles.skuGrey}>{previewData.sku}</span>
                            </div>
                            <div className={styles.l6PriceAccent}>
                                <span className={styles.priceValueBold}>{previewData.currency}{previewData.price}</span>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className={styles.templates}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>Galerie de Templates</h1>
                    <p>Modèles professionnels pour vos étiquettes de prix</p>
                </div>
                <div className={styles.headerActions}>
                    <div className={styles.searchBox}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher un template..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {/* Templates Grid */}
            <div className={styles.grid}>
                {filteredTemplates.map((template) => (
                    <div
                        key={template.id}
                        className={styles.card}
                        onMouseEnter={() => setHoveredTemplate(template.id)}
                        onMouseLeave={() => setHoveredTemplate(null)}
                    >
                        {/* Preview */}
                        <div className={styles.preview}>
                            {renderLabelPreview(template.layout)}

                            {/* Badges */}
                            <div className={styles.badges}>
                                {template.isPopular && (
                                    <span className={styles.popularBadge}>
                                        <Star size={12} /> Populaire
                                    </span>
                                )}
                                {template.isPro && (
                                    <span className={styles.proBadge}>
                                        <Sparkles size={12} /> PRO
                                    </span>
                                )}
                            </div>

                            {/* Hover Actions */}
                            {hoveredTemplate === template.id && (
                                <div className={styles.hoverActions}>
                                    <button className={styles.previewBtn}>
                                        <Eye size={18} />
                                        Aperçu
                                    </button>
                                    <button className={styles.useBtn}>
                                        <Download size={18} />
                                        Utiliser
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className={styles.cardInfo}>
                            <div className={styles.cardText}>
                                <h3>{template.name}</h3>
                                <p>{template.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Templates;

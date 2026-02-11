import React, { useState, useRef } from 'react';
import {
    Printer,
    Tag,
    Receipt,
    Eye,
    FileText,
    Percent,
    Package,
    Scale,
    AlertTriangle,
    Download,
    RefreshCw,
} from 'lucide-react';
import {
    JonyHTML,
    JonyReceipt,
    JonyLabel,
    type PriceLabelData,
    type LabelType,
} from '../../../services/jonyPrintDesigner';
import type { ReceiptData } from '@asgard/shared';
import { useSalesStore, useProductsStore } from '@asgard/shared/stores';
import { useSettings } from '../../../contexts/SettingsContext';
import styles from './PrintPreview.module.css';

// Default demo receipt data (used when no real data is available)
const defaultReceiptData: ReceiptData = {
    storeInfo: {
        name: 'SUPERETTE AMIR',
        address: '45, Rue Didouche Mourad, Alger',
        phone: '023 45 67 89',
        nif: '001234567890123',
    },
    transactionId: 'V-20260104-0042',
    date: new Date(),
    cashier: 'Karim B.',
    items: [
        { name: 'Coca-Cola 1.5L', quantity: 2, unitPrice: 180, total: 360 },
        { name: 'Lait Candia 1L', quantity: 3, unitPrice: 120, total: 360, isBundle: false },
        { name: 'Pain de mie', quantity: 1, unitPrice: 85, total: 85 },
        { name: 'Huile Elio 5L', quantity: 1, unitPrice: 850, total: 850 },
        { name: 'Yaourt x4', quantity: 2, unitPrice: 180, total: 360, isBundle: true },
    ],
    subtotal: 2015,
    discount: { percent: 5, amount: 100.75 },
    vat: { rate: 19, amount: 363.51 },
    total: 2277.76,
    paymentMethod: 'Espèces',
    amountReceived: 2500,
    change: 222.24,
    customer: { name: 'Ahmed M.', loyaltyPoints: 23 },
};

// Default label data for each type
const defaultLabels: Record<LabelType, PriceLabelData> = {
    standard: {
        type: 'standard',
        productName: 'Coca-Cola 1.5L',
        barcode: '5449000000996',
        sku: 'BEV-001',
        price: 180,
    },
    promotion: {
        type: 'promotion',
        productName: 'Huile Elio 5L',
        barcode: '6191234567890',
        sku: 'OIL-001',
        price: 750,
        oldPrice: 850,
        discountPercent: 12,
    },
    pack: {
        type: 'pack',
        productName: 'Eau Ifri 1L',
        barcode: '6192345678901',
        sku: 'BEV-002',
        price: 180,
        packSize: 6,
        pricePerUnit: 30,
    },
    perkilo: {
        type: 'perkilo',
        productName: 'Pommes Golden',
        barcode: '2000000000000',
        sku: 'FRU-001',
        price: 350,
        pluCode: '4135',
    },
    expiry: {
        type: 'expiry',
        productName: 'Yaourt Soummam',
        barcode: '6193456789012',
        sku: 'DAI-002',
        price: 140,
        oldPrice: 180,
        discountPercent: 22,
        expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        daysRemaining: 2,
    },
    'loyalty-card': {
        type: 'loyalty-card',
        productName: '',
        barcode: 'FIDEL-2026-0001',
        sku: '',
        price: 0,
        customerName: 'Ahmed Benali',
        loyaltyPoints: 1250,
        memberSince: '2024',
    },
};

type PreviewTab = 'receipt' | 'labels';

interface PrintPreviewProps {
    receiptData?: ReceiptData;
    labelData?: Partial<Record<LabelType, PriceLabelData>>;
}

export const PrintPreview: React.FC<PrintPreviewProps> = ({ receiptData, labelData }) => {
    const [activeTab, setActiveTab] = useState<PreviewTab>('receipt');
    const [selectedLabelType, setSelectedLabelType] = useState<LabelType>('standard');
    const [paperWidth, setPaperWidth] = useState<58 | 80>(80);
    const previewRef = useRef<HTMLIFrameElement>(null);

    // Get real data from stores as fallback
    const { getTodaySales } = useSalesStore();
    const { products } = useProductsStore();
    const { settings } = useSettings();

    // Build receipt data from last sale if no prop provided
    const getReceiptData = (): ReceiptData => {
        if (receiptData) return receiptData;

        const todaySales = getTodaySales();
        const lastSale = todaySales[0];

        if (lastSale) {
            return {
                storeInfo: {
                    name: settings?.store?.name || 'Bonilo',
                    address: settings?.store?.address || '',
                    phone: settings?.store?.phone || '',
                    nif: settings?.store?.nif || '',
                },
                transactionId: lastSale.receiptNumber,
                date: new Date(lastSale.timestamp),
                cashier: lastSale.cashierName,
                items: lastSale.items.map(item => ({
                    name: item.productName,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    total: item.total,
                })),
                subtotal: lastSale.subtotal,
                discount: lastSale.discountAmount > 0 ? {
                    percent: Math.round((lastSale.discountAmount / lastSale.subtotal) * 100),
                    amount: lastSale.discountAmount,
                } : undefined,
                vat: lastSale.taxAmount > 0 ? { rate: 19, amount: lastSale.taxAmount } : undefined,
                total: lastSale.totalAmount,
                paymentMethod: lastSale.paymentMethod === 'cash' ? 'Espèces' :
                    lastSale.paymentMethod === 'cib' ? 'CIB' :
                        lastSale.paymentMethod === 'dahabia' ? 'Dahabia' : lastSale.paymentMethod,
                customer: lastSale.customerName ? { name: lastSale.customerName } : undefined,
            };
        }

        return defaultReceiptData;
    };

    // Get label data with product lookup
    const getLabelData = (type: LabelType): PriceLabelData => {
        if (labelData?.[type]) return labelData[type]!;

        // Try to find a real product for certain label types
        const product = products.find(p => p.stock > 0);
        if (product && type === 'standard') {
            return {
                type: 'standard',
                productName: product.name,
                barcode: product.barcode,
                sku: product.sku,
                price: product.sellingPrice,
            };
        }

        return defaultLabels[type];
    };

    const labelTypes: { type: LabelType; icon: React.ReactNode; label: string }[] = [
        { type: 'standard', icon: <Tag size={16} />, label: 'Standard' },
        { type: 'promotion', icon: <Percent size={16} />, label: 'Promotion' },
        { type: 'pack', icon: <Package size={16} />, label: 'Pack' },
        { type: 'perkilo', icon: <Scale size={16} />, label: 'Au Kilo' },
        { type: 'expiry', icon: <AlertTriangle size={16} />, label: 'Expiration' },
    ];

    const getPreviewHTML = (): string => {
        if (activeTab === 'receipt') {
            return JonyHTML.generateReceiptHTML(getReceiptData(), paperWidth);
        } else {
            return JonyHTML.generateLabelHTML(getLabelData(selectedLabelType));
        }
    };

    const handlePrint = () => {
        if (previewRef.current?.contentWindow) {
            previewRef.current.contentWindow.print();
        }
    };

    const handleDownloadESCPOS = () => {
        let bytes: Uint8Array;
        let filename: string;

        if (activeTab === 'receipt') {
            const generator = new (JonyReceipt.constructor as any)(paperWidth);
            bytes = generator.generate(getReceiptData());
            filename = 'receipt.bin';
        } else {
            bytes = JonyLabel.generate(getLabelData(selectedLabelType));
            filename = `label_${selectedLabelType}.bin`;
        }

        const blob = new Blob([bytes as any], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <Printer size={24} />
                    <h1>Design d'impression Jony Ive</h1>
                </div>
                <div className={styles.actions}>
                    <button className={styles.actionBtn} onClick={handlePrint}>
                        <Printer size={16} />
                        Imprimer
                    </button>
                    <button className={styles.actionBtn} onClick={handleDownloadESCPOS}>
                        <Download size={16} />
                        ESC/POS
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'receipt' ? styles.active : ''}`}
                    onClick={() => setActiveTab('receipt')}
                >
                    <Receipt size={18} />
                    Ticket de caisse
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'labels' ? styles.active : ''}`}
                    onClick={() => setActiveTab('labels')}
                >
                    <Tag size={18} />
                    Étiquettes prix
                </button>
            </div>

            {/* Controls */}
            <div className={styles.controls}>
                {activeTab === 'receipt' ? (
                    <div className={styles.paperSelector}>
                        <span>Largeur papier:</span>
                        <button
                            className={`${styles.paperBtn} ${paperWidth === 58 ? styles.active : ''}`}
                            onClick={() => setPaperWidth(58)}
                        >
                            58mm
                        </button>
                        <button
                            className={`${styles.paperBtn} ${paperWidth === 80 ? styles.active : ''}`}
                            onClick={() => setPaperWidth(80)}
                        >
                            80mm
                        </button>
                    </div>
                ) : (
                    <div className={styles.labelTypes}>
                        {labelTypes.map(lt => (
                            <button
                                key={lt.type}
                                className={`${styles.labelTypeBtn} ${selectedLabelType === lt.type ? styles.active : ''}`}
                                onClick={() => setSelectedLabelType(lt.type)}
                            >
                                {lt.icon}
                                {lt.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Preview */}
            <div className={styles.previewArea}>
                <div className={styles.previewLabel}>
                    <Eye size={14} />
                    Aperçu {receiptData ? '(Données réelles)' : '(Mode démonstration)'}
                </div>
                <iframe
                    ref={previewRef}
                    className={styles.preview}
                    srcDoc={getPreviewHTML()}
                    title="Print Preview"
                />
            </div>

            {/* Design Principles */}
            <div className={styles.principles}>
                <h3>Principes de conception Jony Ive</h3>
                <div className={styles.principleGrid}>
                    <div className={styles.principle}>
                        <strong>Minimal</strong>
                        <span>Seulement les informations essentielles</span>
                    </div>
                    <div className={styles.principle}>
                        <strong>Propre</strong>
                        <span>Séparateurs fins, espacement généreux</span>
                    </div>
                    <div className={styles.principle}>
                        <strong>Hiérarchie</strong>
                        <span>Prix = 60%, Nom = 25%, Reste = 15%</span>
                    </div>
                    <div className={styles.principle}>
                        <strong>Respiration</strong>
                        <span>Les éléments respirent, pas de crampage</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrintPreview;


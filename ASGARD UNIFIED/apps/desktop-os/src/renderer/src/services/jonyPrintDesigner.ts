/**
 * Thermal Print Template Designer - Minimal Style
 * SuperMarket Control OS
 * 
 * DESIGN PRINCIPLES:
 * - MINIMAL: Only essential information
 * - CLEAN: Single thin line separators, generous whitespace
 * - HIERARCHY: Store name (large) → Items (normal) → Total (emphasized)
 * - BREATHING SPACE: Items breathe, no cramping
 * 
 * XPRINTER SPECS:
 * - Paper: 80mm (72mm printable) or 58mm (48mm printable)
 * - Resolution: 203 DPI
 * - Protocol: ESC/POS compatible
 */

import type { ReceiptData } from '@asgard/shared';
import { formatCurrency, formatDateShort, formatDateTime } from '../utils/formatters';

// ===== CONFIGURATION =====

export interface PrinterPaperConfig {
    width: 58 | 80;
    printableWidth: 48 | 72; // mm
    charColumns: 32 | 48;    // characters per line
}

export const PAPER_CONFIGS: Record<58 | 80, PrinterPaperConfig> = {
    58: { width: 58, printableWidth: 48, charColumns: 32 },
    80: { width: 80, printableWidth: 72, charColumns: 48 },
};

// ===== ESC/POS ENHANCED COMMANDS =====

const ESC = 0x1B;
const GS = 0x1D;
const LF = 0x0A;

export const ESCPOS_JONY = {
    // Initialize
    INIT: new Uint8Array([ESC, 0x40]),

    // Alignment
    ALIGN_LEFT: new Uint8Array([ESC, 0x61, 0x00]),
    ALIGN_CENTER: new Uint8Array([ESC, 0x61, 0x01]),
    ALIGN_RIGHT: new Uint8Array([ESC, 0x61, 0x02]),

    // Text Size (GS ! n)
    // n: 0x00=Normal, 0x01=Double Height, 0x10=Double Width, 0x11=Both
    SIZE_NORMAL: new Uint8Array([GS, 0x21, 0x00]),
    SIZE_DOUBLE_HEIGHT: new Uint8Array([GS, 0x21, 0x01]),
    SIZE_DOUBLE_WIDTH: new Uint8Array([GS, 0x21, 0x10]),
    SIZE_DOUBLE: new Uint8Array([GS, 0x21, 0x11]),
    SIZE_TRIPLE_HEIGHT: new Uint8Array([GS, 0x21, 0x02]),
    SIZE_LARGE: new Uint8Array([GS, 0x21, 0x11]), // Double both = Large

    // Bold
    BOLD_ON: new Uint8Array([ESC, 0x45, 0x01]),
    BOLD_OFF: new Uint8Array([ESC, 0x45, 0x00]),

    // Underline
    UNDERLINE_OFF: new Uint8Array([ESC, 0x2D, 0x00]),
    UNDERLINE_1: new Uint8Array([ESC, 0x2D, 0x01]),
    UNDERLINE_2: new Uint8Array([ESC, 0x2D, 0x02]),

    // Inverse (white on black)
    INVERSE_ON: new Uint8Array([GS, 0x42, 0x01]),
    INVERSE_OFF: new Uint8Array([GS, 0x42, 0x00]),

    // Line spacing
    LINE_SPACING_DEFAULT: new Uint8Array([ESC, 0x32]),
    LINE_SPACING_SET: (n: number) => new Uint8Array([ESC, 0x33, n]),

    // Feed
    FEED_LINE: new Uint8Array([LF]),
    FEED_LINES: (n: number) => new Uint8Array([ESC, 0x64, n]),

    // Cut
    CUT_FULL: new Uint8Array([GS, 0x56, 0x00]),
    CUT_PARTIAL: new Uint8Array([GS, 0x56, 0x01]),

    // Barcode
    BARCODE_HEIGHT: (h: number) => new Uint8Array([GS, 0x68, h]),
    BARCODE_WIDTH: (w: number) => new Uint8Array([GS, 0x77, w]),
    BARCODE_TEXT_BELOW: new Uint8Array([GS, 0x48, 0x02]),
    BARCODE_TEXT_NONE: new Uint8Array([GS, 0x48, 0x00]),
    BARCODE_EAN13: (data: string) => {
        const dataBytes = new TextEncoder().encode(data);
        return new Uint8Array([GS, 0x6B, 0x02, ...dataBytes, 0x00]);
    },

    // QR Code (GS ( k)
    QR_MODEL: new Uint8Array([GS, 0x28, 0x6B, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00]),
    QR_SIZE: (n: number) => new Uint8Array([GS, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x43, n]),
    QR_ERROR: new Uint8Array([GS, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x45, 0x31]), // Level M
    QR_STORE: (data: string) => {
        const bytes = new TextEncoder().encode(data);
        const len = bytes.length + 3;
        const pL = len % 256;
        const pH = Math.floor(len / 256);
        return new Uint8Array([GS, 0x28, 0x6B, pL, pH, 0x31, 0x50, 0x30, ...bytes]);
    },
    QR_PRINT: new Uint8Array([GS, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x51, 0x30]),

    // Arabic codepage (CP1256)
    CODEPAGE_ARABIC: new Uint8Array([ESC, 0x74, 0x16]),
    CODEPAGE_UTF8: new Uint8Array([ESC, 0x74, 0x00]),

    // Cash drawer
    OPEN_DRAWER: new Uint8Array([ESC, 0x70, 0x00, 0x19, 0xFA]),
};

// ===== UTILITY FUNCTIONS =====

function textToBytes(text: string): Uint8Array {
    return new TextEncoder().encode(text);
}

function formatPrice(value: number): string {
    return new Intl.NumberFormat('fr-DZ').format(Math.round(value));
}

function leftRight(left: string, right: string, width: number): string {
    const spaces = width - left.length - right.length;
    if (spaces < 1) return (left + ' ' + right).substring(0, width);
    return left + ' '.repeat(spaces) + right;
}

function thinLine(width: number): string {
    return '-'.repeat(width);
}


// ===== MINIMAL STYLE RECEIPT GENERATOR =====

export class JonyReceiptGenerator {
    private parts: Uint8Array[] = [];
    private config: PrinterPaperConfig;

    constructor(paperWidth: 58 | 80 = 80) {
        this.config = PAPER_CONFIGS[paperWidth];
    }

    private add(cmd: Uint8Array): void {
        this.parts.push(cmd);
    }

    private text(str: string): void {
        this.add(textToBytes(str + '\n'));
    }

    private blank(lines: number = 1): void {
        this.add(ESCPOS_JONY.FEED_LINES(lines));
    }

    private separator(): void {
        this.text(thinLine(this.config.charColumns));
    }

    /**
     * Generate minimal, elegant receipt
     */
    generate(data: ReceiptData): Uint8Array {
        this.parts = [];
        const cols = this.config.charColumns;

        // === INITIALIZE ===
        this.add(ESCPOS_JONY.INIT);
        this.add(ESCPOS_JONY.LINE_SPACING_DEFAULT);

        // === HEADER - Store Name (prominent) ===
        this.blank(1);
        this.add(ESCPOS_JONY.ALIGN_CENTER);
        this.add(ESCPOS_JONY.SIZE_DOUBLE);
        this.add(ESCPOS_JONY.BOLD_ON);
        this.text(data.storeInfo.name.toUpperCase());
        this.add(ESCPOS_JONY.BOLD_OFF);
        this.add(ESCPOS_JONY.SIZE_NORMAL);

        // Address & phone (subtle)
        this.text(data.storeInfo.address.toUpperCase());
        this.text(data.storeInfo.phone);
        this.blank(2);

        // === TRANSACTION INFO ===
        this.separator();
        this.blank(1);
        this.add(ESCPOS_JONY.ALIGN_LEFT);
        this.text(leftRight(`#${data.transactionId}`, formatDateTime(data.date), cols));
        this.text(`CAISSIER: ${data.cashier.toUpperCase()}`);
        if (data.customer) {
            this.text(`CLIENT: ${data.customer.name.toUpperCase()}`);
        }
        this.blank(1);
        this.separator();

        // === ITEMS (clean, breathing) ===
        this.blank(1);
        for (const item of data.items) {
            // Item name - UPPERCASE
            const displayName = item.isBundle ? `${item.name.toUpperCase()} ⬡` : item.name.toUpperCase();
            this.text(displayName);

            // Quantity x Price = Total (right aligned)
            const priceInfo = `${item.quantity} × ${formatPrice(item.unitPrice)}`;
            const totalStr = formatCurrency(item.total);
            this.text(leftRight(`  ${priceInfo}`, totalStr, cols));

            // Small breathing space between items
            this.blank(1);
        }
        this.separator();

        // === TOTALS ===
        this.blank(1);
        this.add(ESCPOS_JONY.ALIGN_RIGHT);

        // Subtotal
        this.text(`SOUS-TOTAL  ${formatCurrency(data.subtotal)}`);

        // Discount (if any)
        if (data.discount && data.discount.amount > 0) {
            this.text(`REMISE ${data.discount.percent}%  -${formatCurrency(data.discount.amount)}`);
        }

        // VAT (only if applicable)
        if (data.vat && data.vat.amount > 0) {
            this.text(`TVA ${data.vat.rate}%  ${formatCurrency(data.vat.amount)}`);
        }

        this.blank(1);

        // === GRAND TOTAL (emphasized) ===
        this.add(ESCPOS_JONY.ALIGN_CENTER);
        this.add(ESCPOS_JONY.SIZE_DOUBLE_HEIGHT);
        this.add(ESCPOS_JONY.BOLD_ON);
        this.text(`TOTAL: ${formatCurrency(data.total)}`);
        this.add(ESCPOS_JONY.BOLD_OFF);
        this.add(ESCPOS_JONY.SIZE_NORMAL);

        this.blank(1);
        this.separator();

        // === PAYMENT INFO ===
        this.blank(1);
        this.add(ESCPOS_JONY.ALIGN_LEFT);
        this.text(`PAIEMENT: ${data.paymentMethod.toUpperCase()}`);

        if (data.amountReceived && data.amountReceived > data.total) {
            this.text(leftRight('REÇU:', formatCurrency(data.amountReceived), cols));
            if (data.change && data.change > 0) {
                this.add(ESCPOS_JONY.BOLD_ON);
                this.text(leftRight('MONNAIE:', formatCurrency(data.change), cols));
                this.add(ESCPOS_JONY.BOLD_OFF);
            }
        }

        // Loyalty points
        if (data.customer?.loyaltyPoints) {
            this.blank(1);
            this.text(`+${data.customer.loyaltyPoints} POINTS FIDÉLITÉ`);
        }

        // === QR CODE (for digital receipt) ===
        this.blank(2);
        this.add(ESCPOS_JONY.ALIGN_CENTER);
        this.printQRCode(`https://receipt.dz/${data.transactionId}`);
        this.blank(1);

        // === FOOTER - Minimal & elegant ===
        this.add(ESCPOS_JONY.ALIGN_CENTER);
        this.text('● MERCI ●');
        this.blank(3);

        // Cut
        this.add(ESCPOS_JONY.CUT_PARTIAL);

        return this.combine();
    }

    private printQRCode(data: string): void {
        this.add(ESCPOS_JONY.QR_MODEL);
        this.add(ESCPOS_JONY.QR_SIZE(4));
        this.add(ESCPOS_JONY.QR_ERROR);
        this.add(ESCPOS_JONY.QR_STORE(data));
        this.add(ESCPOS_JONY.QR_PRINT);
    }

    private combine(): Uint8Array {
        const totalLength = this.parts.reduce((acc, p) => acc + p.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const part of this.parts) {
            result.set(part, offset);
            offset += part.length;
        }
        return result;
    }
}

// ===== PRICE LABEL TYPES =====

export type LabelType = 'standard' | 'promotion' | 'pack' | 'perkilo' | 'expiry' | 'loyalty-card';

export interface PriceLabelData {
    type: LabelType;
    productName: string;
    barcode: string;
    sku: string;
    price: number;
    unit?: string;

    // Promotion
    oldPrice?: number;
    discountPercent?: number;

    // Pack
    packSize?: number;
    pricePerUnit?: number;

    // Per-kilo
    pluCode?: string;

    // Expiry promo
    expiryDate?: Date;
    daysRemaining?: number;

    // Loyalty Card
    customerName?: string;
    loyaltyPoints?: number;
    memberSince?: string;
}

// ===== MINIMAL STYLE LABEL GENERATOR =====

export class JonyLabelGenerator {
    private parts: Uint8Array[] = [];

    private add(cmd: Uint8Array): void {
        this.parts.push(cmd);
    }

    private text(str: string): void {
        this.add(textToBytes(str + '\n'));
    }

    private blank(lines: number = 1): void {
        this.add(ESCPOS_JONY.FEED_LINES(lines));
    }

    /**
     * Generate price label - 60% price, 25% name, 15% barcode
     */
    generate(data: PriceLabelData): Uint8Array {
        this.parts = [];

        this.add(ESCPOS_JONY.INIT);

        switch (data.type) {
            case 'promotion':
                return this.generatePromoLabel(data);
            case 'pack':
                return this.generatePackLabel(data);
            case 'perkilo':
                return this.generatePerKiloLabel(data);
            case 'expiry':
                return this.generateExpiryLabel(data);
            default:
                return this.generateStandardLabel(data);
        }
    }

    private generateStandardLabel(data: PriceLabelData): Uint8Array {
        // Product name (25% visual weight) - UPPERCASE
        this.add(ESCPOS_JONY.ALIGN_CENTER);
        this.add(ESCPOS_JONY.BOLD_ON);
        this.text(data.productName.toUpperCase().substring(0, 25));
        this.add(ESCPOS_JONY.BOLD_OFF);
        this.blank(1);

        // PRICE (60% visual weight - TRIPLE HEIGHT)
        this.add(ESCPOS_JONY.SIZE_LARGE);
        this.add(ESCPOS_JONY.BOLD_ON);
        this.text(formatCurrency(data.price));
        this.add(ESCPOS_JONY.BOLD_OFF);
        this.add(ESCPOS_JONY.SIZE_NORMAL);
        this.blank(1);

        // Barcode (15% visual weight)
        this.printBarcode(data.barcode);
        this.blank(1);

        // Cut
        this.add(ESCPOS_JONY.CUT_PARTIAL);

        return this.combine();
    }

    private generatePromoLabel(data: PriceLabelData): Uint8Array {
        // Product name - UPPERCASE
        this.add(ESCPOS_JONY.ALIGN_CENTER);
        this.add(ESCPOS_JONY.BOLD_ON);
        this.text(data.productName.toUpperCase().substring(0, 25));
        this.add(ESCPOS_JONY.BOLD_OFF);
        this.blank(1);

        // Old price (struck through effect)
        if (data.oldPrice) {
            this.add(ESCPOS_JONY.SIZE_DOUBLE_HEIGHT);
            this.text(`̶${formatPrice(data.oldPrice)}̶`); // Unicode strikethrough
            this.add(ESCPOS_JONY.SIZE_NORMAL);
        }

        // NEW PRICE (large, emphasized)
        this.add(ESCPOS_JONY.SIZE_LARGE);
        this.add(ESCPOS_JONY.BOLD_ON);
        this.text(formatCurrency(data.price));
        this.add(ESCPOS_JONY.BOLD_OFF);
        this.add(ESCPOS_JONY.SIZE_NORMAL);

        // Discount badge
        if (data.discountPercent) {
            this.add(ESCPOS_JONY.INVERSE_ON);
            this.text(` -${data.discountPercent}% `);
            this.add(ESCPOS_JONY.INVERSE_OFF);
        }
        this.blank(1);

        // Barcode
        this.printBarcode(data.barcode);
        this.blank(1);
        this.add(ESCPOS_JONY.CUT_PARTIAL);

        return this.combine();
    }

    private generatePackLabel(data: PriceLabelData): Uint8Array {
        // Product name - UPPERCASE
        this.add(ESCPOS_JONY.ALIGN_CENTER);
        this.add(ESCPOS_JONY.BOLD_ON);
        this.text(data.productName.toUpperCase().substring(0, 25));
        this.add(ESCPOS_JONY.BOLD_OFF);

        // Pack badge
        if (data.packSize) {
            this.add(ESCPOS_JONY.INVERSE_ON);
            this.text(` PACK ×${data.packSize} `);
            this.add(ESCPOS_JONY.INVERSE_OFF);
        }
        this.blank(1);

        // Pack PRICE
        this.add(ESCPOS_JONY.SIZE_LARGE);
        this.add(ESCPOS_JONY.BOLD_ON);
        this.text(formatCurrency(data.price));
        this.add(ESCPOS_JONY.BOLD_OFF);
        this.add(ESCPOS_JONY.SIZE_NORMAL);

        // Per-unit price
        if (data.pricePerUnit) {
            this.text(`(${formatCurrency(data.pricePerUnit)}/UNITÉ)`);
        }
        this.blank(1);

        // Barcode
        this.printBarcode(data.barcode);
        this.blank(1);
        this.add(ESCPOS_JONY.CUT_PARTIAL);

        return this.combine();
    }

    private generatePerKiloLabel(data: PriceLabelData): Uint8Array {
        // Product name - UPPERCASE
        this.add(ESCPOS_JONY.ALIGN_CENTER);
        this.add(ESCPOS_JONY.BOLD_ON);
        this.text(data.productName.toUpperCase().substring(0, 25));
        this.add(ESCPOS_JONY.BOLD_OFF);
        this.blank(1);

        // Price per Kg
        this.add(ESCPOS_JONY.SIZE_LARGE);
        this.add(ESCPOS_JONY.BOLD_ON);
        this.text(`${formatPrice(data.price)} DA/KG`);
        this.add(ESCPOS_JONY.BOLD_OFF);
        this.add(ESCPOS_JONY.SIZE_NORMAL);
        this.blank(1);

        // PLU Code
        if (data.pluCode) {
            this.add(ESCPOS_JONY.SIZE_DOUBLE_HEIGHT);
            this.text(`PLU: ${data.pluCode}`);
            this.add(ESCPOS_JONY.SIZE_NORMAL);
        }
        this.blank(1);
        this.add(ESCPOS_JONY.CUT_PARTIAL);

        return this.combine();
    }

    private generateExpiryLabel(data: PriceLabelData): Uint8Array {
        // WARNING HEADER (yellow background effect with inverse)
        this.add(ESCPOS_JONY.ALIGN_CENTER);
        this.add(ESCPOS_JONY.INVERSE_ON);
        this.add(ESCPOS_JONY.BOLD_ON);
        this.text(' ⚠ À CONSOMMER RAPIDEMENT ⚠ ');
        this.add(ESCPOS_JONY.BOLD_OFF);
        this.add(ESCPOS_JONY.INVERSE_OFF);
        this.blank(1);

        // Product name - UPPERCASE
        this.add(ESCPOS_JONY.BOLD_ON);
        this.text(data.productName.toUpperCase().substring(0, 25));
        this.add(ESCPOS_JONY.BOLD_OFF);
        this.blank(1);

        // PRICE (reduced)
        this.add(ESCPOS_JONY.SIZE_LARGE);
        this.add(ESCPOS_JONY.BOLD_ON);
        this.text(formatCurrency(data.price));
        this.add(ESCPOS_JONY.BOLD_OFF);
        this.add(ESCPOS_JONY.SIZE_NORMAL);

        // Discount
        if (data.discountPercent) {
            this.add(ESCPOS_JONY.INVERSE_ON);
            this.text(` -${data.discountPercent}% `);
            this.add(ESCPOS_JONY.INVERSE_OFF);
        }
        this.blank(1);

        // Expiry date
        if (data.expiryDate) {
            this.add(ESCPOS_JONY.BOLD_ON);
            this.text(`DLC: ${formatDateShort(data.expiryDate)}`);
            this.add(ESCPOS_JONY.BOLD_OFF);
            if (data.daysRemaining !== undefined && data.daysRemaining <= 3) {
                this.text(`(${data.daysRemaining} JOUR${data.daysRemaining > 1 ? 'S' : ''})`);
            }
        }
        this.blank(1);

        // Barcode
        this.printBarcode(data.barcode);
        this.blank(1);
        this.add(ESCPOS_JONY.CUT_PARTIAL);

        return this.combine();
    }

    private printBarcode(barcode: string): void {
        this.add(ESCPOS_JONY.ALIGN_CENTER);
        this.add(ESCPOS_JONY.BARCODE_HEIGHT(50));
        this.add(ESCPOS_JONY.BARCODE_WIDTH(2));
        this.add(ESCPOS_JONY.BARCODE_TEXT_BELOW);
        this.add(ESCPOS_JONY.BARCODE_EAN13(barcode));
    }

    private combine(): Uint8Array {
        const totalLength = this.parts.reduce((acc, p) => acc + p.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const part of this.parts) {
            result.set(part, offset);
            offset += part.length;
        }
        return result;
    }
}

// ===== HTML PREVIEW GENERATOR (for browser/screen) =====

export class JonyHTMLGenerator {

    /**
     * Generate beautiful receipt HTML for browser preview
     */
    generateReceiptHTML(data: ReceiptData, paperWidth: 58 | 80 = 80): string {
        const width = paperWidth === 80 ? '80mm' : '58mm';

        const itemsHTML = data.items.map(item => `
            <div class="item">
                <div class="item-name">${item.name}${item.isBundle ? ' <span class="pack-badge">⬡</span>' : ''}</div>
                <div class="item-line">
                    <span class="qty-price">${item.quantity} × ${formatCurrency(item.unitPrice)}</span>
                    <span class="item-total">${formatCurrency(item.total)}</span>
                </div>
            </div>
        `).join('');

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Ticket de caisse</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Space Grotesk', sans-serif;
            background: #f1f5f9;
            padding: 40px;
            display: flex;
            justify-content: center;
        }
        
        .receipt {
            width: ${width};
            background: white;
            padding: 24px 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            color: #0f172a;
        }
        
        .header {
            text-align: center;
            margin-bottom: 24px;
        }
        
        .brand-badge {
            display: inline-block;
            background: #0f172a;
            color: white;
            font-size: 8px;
            font-weight: 700;
            padding: 4px 12px;
            border-radius: 4px;
            margin-bottom: 12px;
            letter-spacing: 2px;
        }
        
        .store-name {
            font-size: 18px;
            font-weight: 700;
            letter-spacing: -0.5px;
            margin-bottom: 4px;
        }
        
        .store-info {
            font-size: 10px;
            color: #64748b;
            line-height: 1.5;
        }
        
        .transaction-info {
            border-top: 1px dashed #e2e8f0;
            border-bottom: 1px dashed #e2e8f0;
            padding: 12px 0;
            margin-bottom: 16px;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            font-size: 9px;
            color: #475569;
            margin-bottom: 4px;
        }
        
        .info-row:last-child { margin-bottom: 0; }
        
        .items {
            margin-bottom: 24px;
        }
        
        .item {
            margin-bottom: 12px;
        }
        
        .item-name {
            font-size: 11px;
            font-weight: 600;
            margin-bottom: 2px;
            text-transform: uppercase;
        }
        
        .item-line {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: #64748b;
            font-family: 'JetBrains Mono', monospace;
        }
        
        .totals-section {
            background: #f8fafc;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 16px;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #475569;
            margin-bottom: 8px;
        }
        
        .total-row.discount {
            color: #ef4444;
            font-weight: 600;
        }
        
        .grand-total {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 2px solid #0f172a;
            padding-top: 12px;
            margin-top: 4px;
        }
        
        .grand-total .label {
            font-size: 12px;
            font-weight: 700;
        }
        
        .grand-total .value {
            font-size: 20px;
            font-weight: 700;
            letter-spacing: -1px;
        }
        
        .payment-summary {
            font-size: 10px;
            padding: 0 12px;
            margin-bottom: 24px;
        }
        
        .payment-method {
            font-weight: 700;
            margin-bottom: 6px;
        }
        
        .payment-row {
            display: flex;
            justify-content: space-between;
            color: #64748b;
            margin-bottom: 2px;
        }
        
        .payment-row.change {
            color: #0f172a;
            font-weight: 600;
        }
        
        .qr-footer {
            display: flex;
            justify-content: center;
            margin-bottom: 24px;
        }
        
        .qr-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }
        
        .qr-box {
            width: 80px;
            height: 80px;
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            position: relative;
        }
        
        .qr-box::after {
            content: '';
            position: absolute;
            inset: 20px;
            background: repeating-linear-gradient(45deg, #cbd5e1 0, #cbd5e1 1px, transparent 1px, transparent 4px);
        }
        
        .qr-placeholder span {
            font-size: 7px;
            font-weight: 600;
            color: #94a3b8;
            letter-spacing: 1px;
        }
        
        .final-footer {
            text-align: center;
            color: #94a3b8;
        }
        
        .dots { margin-bottom: 8px; font-size: 12px; }
        .thanks { font-size: 11px; font-weight: 700; margin-bottom: 4px; color: #64748b; letter-spacing: 1px; }
        .website { font-size: 9px; font-weight: 500; }
        
        @media print {
            body { background: white; padding: 0; }
            .receipt { box-shadow: none; border-radius: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @page { margin: 0; size: ${width} auto; }
        }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <div class="brand-badge">S-POS PREMIUM</div>
            <div class="store-name">${data.storeInfo.name.toUpperCase()}</div>
            <div class="store-info">
                ${data.storeInfo.address}<br>
                TEL: ${data.storeInfo.phone}
            </div>
        </div>
        
        <div class="transaction-info">
            <div class="info-row">
                <span class="id">REFERENCE: #${data.transactionId}</span>
                <span class="date">${formatDateTime(data.date)}</span>
            </div>
            <div class="info-row">
                <span>CAISSIER: ${data.cashier.toUpperCase()}</span>
                ${data.customer ? `<span>CLIENT: ${data.customer.name.toUpperCase()}</span>` : ''}
            </div>
        </div>
        
        <div class="items">
            ${itemsHTML}
        </div>
        
        <div class="totals-section">
            <div class="total-row">
                <span>SOUS-TOTAL</span>
                <span>${formatCurrency(data.subtotal)}</span>
            </div>
            ${data.discount && data.discount.amount > 0 ? `
            <div class="total-row discount">
                <span>REMISE ${data.discount.percent}%</span>
                <span>-${formatCurrency(data.discount.amount)}</span>
            </div>` : ''}
            ${data.vat && data.vat.amount > 0 ? `
            <div class="total-row">
                <span>TVA ${data.vat.rate}%</span>
                <span>${formatCurrency(data.vat.amount)}</span>
            </div>` : ''}
            
            <div class="grand-total">
                <span class="label">TOTAL</span>
                <span class="value">${formatCurrency(data.total)}</span>
            </div>
        </div>
        
        <div class="payment-summary">
            <div class="payment-method">PAIEMENT: ${data.paymentMethod.toUpperCase()}</div>
            ${data.amountReceived ? `
                <div class="payment-row"><span>REÇU:</span><span>${formatCurrency(data.amountReceived)}</span></div>
                ${data.change && data.change > 0 ?
                    `<div class="payment-row change"><span>MONNAIE:</span><span>${formatCurrency(data.change)}</span></div>` : ''}
            ` : ''}
        </div>
        
        <div class="qr-footer">
            <div class="qr-placeholder">
                <div class="qr-box"></div>
                <span>SCANNER POUR TICKET DIGITAL</span>
            </div>
        </div>
        
        <div class="final-footer">
            <div class="dots">● ● ●</div>
            <div class="thanks">MERCI DE VOTRE VISITE</div>
            <div class="website">WWW.GRAPHSHOP.DZ</div>
        </div>
    </div>
</body>
</html>`;
    }

    /**
     * Generate price label HTML for browser preview
     * REDESIGNED: Clarity & Legibility First
     * - Large, bold sans-serif font (Inter) for maximum readability
     * - High contrast black text on white background
     * - Clear visual hierarchy: Product Name → Price → Barcode
     * - Proper spacing and breathing room
     */
    generateLabelHTML(data: PriceLabelData): string {
        // Handle loyalty card separately
        if (data.type === 'loyalty-card') {
            return this.generateLoyaltyCardHTML(data);
        }

        // Build conditional sections
        const isPromo = data.type === 'promotion';
        const isExpiry = data.type === 'expiry';
        const isPerkilo = data.type === 'perkilo';

        const oldPriceHTML = isPromo && data.oldPrice
            ? `<div class="old-price">${formatPrice(data.oldPrice)} DA</div>`
            : '';

        const discountBadge = (isPromo || isExpiry) && data.discountPercent
            ? `<div class="discount-badge">-${data.discountPercent}%</div>`
            : '';

        const warningBar = isExpiry
            ? `<div class="warning-bar">⚠ À CONSOMMER RAPIDEMENT</div>`
            : '';

        const priceUnit = isPerkilo ? '/KG' : '';
        const pluCode = isPerkilo && data.pluCode
            ? `<div class="plu-code">PLU ${data.pluCode}</div>`
            : '';

        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Étiquette Prix</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #e5e7eb;
            padding: 32px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        
        /* === LABEL CONTAINER === */
        .label {
            width: 226px; /* ~60mm at 96dpi */
            height: 151px; /* ~40mm at 96dpi */
            background: #ffffff;
            border-radius: 4px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 
                0 1px 3px rgba(0,0,0,0.12),
                0 4px 12px rgba(0,0,0,0.08);
        }
        
        /* === WARNING BAR (for expiry labels) === */
        .warning-bar {
            background: #dc2626;
            color: white;
            font-size: 9px;
            font-weight: 700;
            text-align: center;
            padding: 4px 8px;
            letter-spacing: 0.5px;
        }
        
        /* === MAIN CONTENT === */
        .content {
            flex: 1;
            padding: 12px 14px 8px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        
        /* === PRODUCT NAME === */
        .product-name {
            font-size: 13px;
            font-weight: 700;
            color: #111827;
            line-height: 1.25;
            text-transform: uppercase;
            letter-spacing: -0.01em;
            /* Limit to 2 lines max */
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        /* === PRICE SECTION === */
        .price-section {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            margin: 6px 0;
        }
        
        .price-left {
            display: flex;
            flex-direction: column;
        }
        
        .old-price {
            font-size: 12px;
            font-weight: 500;
            color: #9ca3af;
            text-decoration: line-through;
            margin-bottom: 2px;
        }
        
        .price {
            display: flex;
            align-items: baseline;
        }
        
        .price-value {
            font-size: 42px;
            font-weight: 900;
            color: #000000;
            letter-spacing: -2px;
            line-height: 1;
        }
        
        .price-currency {
            font-size: 16px;
            font-weight: 700;
            color: #374151;
            margin-left: 4px;
        }
        
        .price-unit {
            font-size: 14px;
            font-weight: 600;
            color: #6b7280;
        }
        
        .discount-badge {
            background: #000000;
            color: #ffffff;
            font-size: 14px;
            font-weight: 800;
            padding: 6px 10px;
            border-radius: 6px;
            letter-spacing: -0.5px;
        }
        
        .plu-code {
            background: #f3f4f6;
            color: #374151;
            font-size: 12px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 4px;
            letter-spacing: 1px;
        }
        
        /* === BARCODE SECTION === */
        .barcode-section {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            padding-top: 6px;
            border-top: 1px solid #e5e7eb;
        }
        
        .barcode-container {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }
        
        /* CSS-based barcode visualization */
        .barcode-bars {
            display: flex;
            gap: 1px;
            height: 20px;
        }
        
        .barcode-bars span {
            background: #000;
            width: 2px;
        }
        
        .barcode-bars span:nth-child(odd) { width: 1px; }
        .barcode-bars span:nth-child(3n) { width: 3px; }
        .barcode-bars span:nth-child(5n) { width: 1px; }
        
        .barcode-number {
            font-size: 10px;
            font-weight: 600;
            color: #4b5563;
            letter-spacing: 2px;
            font-family: 'Inter', monospace;
        }
        
        .sku-label {
            font-size: 9px;
            font-weight: 600;
            color: #9ca3af;
            text-align: right;
        }
        
        /* === PRINT STYLES === */
        @media print {
            body { 
                background: white; 
                padding: 0; 
                min-height: auto;
            }
            .label { 
                box-shadow: none; 
                border: 0.5px solid #d1d5db;
            }
            @page { 
                margin: 0; 
                size: 60mm 40mm; 
            }
        }
    </style>
</head>
<body>
    <div class="label">
        ${warningBar}
        <div class="content">
            <div class="product-name">${data.productName}</div>
            
            <div class="price-section">
                <div class="price-left">
                    ${oldPriceHTML}
                    <div class="price">
                        <span class="price-value">${formatPrice(data.price)}</span>
                        <span class="price-currency">DA${priceUnit}</span>
                    </div>
                </div>
                ${discountBadge}
                ${pluCode}
            </div>
            
            <div class="barcode-section">
                <div class="barcode-container">
                    <div class="barcode-bars">
                        ${data.barcode ? '<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>' : ''}
                    </div>
                    <div class="barcode-number">${data.barcode || 'AUCUN CODE'}</div>
                </div>
                ${data.sku ? `<div class="sku-label">SKU: ${data.sku}</div>` : ''}
            </div>
        </div>
    </div>
</body>
</html>`;
    }

    /**
     * Generate premium loyalty card HTML
     */
    generateLoyaltyCardHTML(data: PriceLabelData): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Carte de Fidélité</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Outfit', -apple-system, sans-serif;
            background: #f0f2f5;
            padding: 40px;
            display: flex;
            justify-content: center;
        }
        
        .card {
            width: 85.6mm;
            height: 53.98mm;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            border-radius: 12px;
            position: relative;
            overflow: hidden;
            color: white;
            padding: 24px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .card::before {
            content: '';
            position: absolute;
            top: -20%;
            right: -10%;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
            border-radius: 50%;
        }
        
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            z-index: 1;
        }
        
        .brand {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .logo-icon {
            width: 32px;
            height: 32px;
            background: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #0f172a;
            font-weight: 800;
            font-size: 18px;
        }
        
        .brand-name {
            font-weight: 700;
            font-size: 14px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        
        .card-type {
            font-size: 10px;
            font-weight: 600;
            background: rgba(255, 255, 255, 0.1);
            padding: 4px 10px;
            border-radius: 20px;
            backdrop-filter: blur(4px);
            letter-spacing: 1px;
        }
        
        .card-body {
            margin-top: 10px;
            z-index: 1;
        }
        
        .holder-name {
            font-size: 18px;
            font-weight: 600;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .points-info {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .points-value {
            color: #fbbf24;
            font-weight: 700;
        }
        
        .card-footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            z-index: 1;
        }
        
        .barcode-section {
            background: white;
            padding: 4px 8px;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
        }
        
        .barcode-img {
            height: 30px;
            filter: contrast(200%);
        }
        
        .barcode-text {
            color: #333;
            font-size: 8px;
            font-weight: 600;
            font-family: 'JetBrains Mono', monospace;
        }
        
        .member-info {
            text-align: right;
            font-size: 9px;
            color: rgba(255, 255, 255, 0.5);
            line-height: 1.4;
        }
        
        @media print {
            body { background: transparent; padding: 0; }
            .card { box-shadow: none; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @page { margin: 0; size: 85.6mm 53.98mm; }
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="card-header">
            <div class="brand">
                <div class="logo-icon">G</div>
                <div class="brand-name">GRAPHSHOP</div>
            </div>
            <div class="card-type">PREMIUM LOYALTY</div>
        </div>
        
        <div class="card-body">
            <div class="holder-name">${data.customerName?.toUpperCase() || 'MEMBRE PRIVILÈGE'}</div>
            <div class="points-info">
                <span>MEMBRE DEPUIS: <span style="color:white">${data.memberSince || '2024'}</span></span>
                <span>POINTS: <span class="points-value">${data.loyaltyPoints || 0} PTS</span></span>
            </div>
        </div>
        
        <div class="card-footer">
            <div class="barcode-section">
                <!-- Fallback barcode text if font not available -->
                <div class="barcode-text" style="font-size: 14px; letter-spacing: 2px; font-weight: 800;">|||| | ||| || ||</div>
                <div class="barcode-text">${data.barcode}</div>
            </div>
            <div class="member-info">
                VALABLE DANS TOUS LES<br>POINTS DE VENTE GRAPHSHOP
            </div>
        </div>
    </div>
</body>
</html>`;
    }

    /**
     * Generate premium full-page document HTML (A4 style)
     */
    generateDocumentHTML(type: string, data: any): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${type}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=JetBrains+Mono:wght@400;600&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Outfit', sans-serif;
            background: #f1f5f9;
            padding: 40px;
            display: flex;
            justify-content: center;
        }
        
        .document {
            width: 210mm;
            min-height: 297mm;
            background: white;
            padding: 25mm;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            position: relative;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 50px;
        }
        
        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .logo {
            width: 48px;
            height: 48px;
            background: #0f172a;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 800;
            border-radius: 12px;
        }
        
        .brand-name {
            font-size: 20px;
            font-weight: 800;
            letter-spacing: -0.5px;
            color: #0f172a;
        }
        
        .doc-type {
            text-align: right;
        }
        
        .doc-title {
            font-size: 32px;
            font-weight: 800;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: -1px;
            margin-bottom: 4px;
        }
        
        .doc-ref {
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            color: #64748b;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 50px;
        }
        
        .info-box-title {
            font-size: 11px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 8px;
        }
        
        .info-content {
            font-size: 14px;
            line-height: 1.6;
            color: #1e293b;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
        }
        
        th {
            text-align: left;
            font-size: 11px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            padding: 12px 16px;
            background: #f8fafc;
        }
        
        td {
            padding: 16px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 14px;
            color: #334155;
        }
        
        .item-row:last-child td { border-bottom: none; }
        
        .total-section {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 12px;
        }
        
        .total-row {
            display: flex;
            gap: 40px;
            font-size: 14px;
            color: #64748b;
        }
        
        .grand-total {
            margin-top: 8px;
            padding-top: 16px;
            border-top: 2px solid #0f172a;
            color: #0f172a;
            font-size: 24px;
            font-weight: 800;
        }
        
        .footer {
            position: absolute;
            bottom: 25mm;
            left: 25mm;
            right: 25mm;
            border-top: 1px solid #f1f5f9;
            padding-top: 20px;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: #94a3b8;
        }
        
        @media print {
            body { background: transparent; padding: 0; }
            .document { box-shadow: none; width: 100%; height: 100%; padding: 15mm; }
            @page { margin: 0; size: A4; }
        }
    </style>
</head>
<body>
    <div class="document">
        <div class="header">
            <div class="brand">
                <div class="logo">G</div>
                <div class="brand-name">GRAPHSHOP OS</div>
            </div>
            <div class="doc-type">
                <div class="doc-title">${type}</div>
                <div class="doc-ref">#${data.reference || 'REF-' + Date.now().toString().slice(-6)}</div>
            </div>
        </div>
        
        <div class="info-grid">
            <div class="info-box">
                <div class="info-box-title">ÉMIS PAR</div>
                <div class="info-content">
                    <strong>${data.storeInfo?.name || 'GRAPHSHOP HQ'}</strong><br>
                    ${data.storeInfo?.address || 'Cité des sciences, Alger'}<br>
                    Tél: ${data.storeInfo?.phone || '+213 555 12 34 56'}<br>
                    NIF: 01234567891234
                </div>
            </div>
            <div class="info-box">
                <div class="info-box-title">${data.recipientTitle || 'DESTINATAIRE'}</div>
                <div class="info-content">
                    <strong>${data.recipient?.name || 'NOM DU CLIENT'}</strong><br>
                    ${data.recipient?.address || 'Adresse de livraison'}<br>
                    Tél: ${data.recipient?.phone || 'Pas de numéro'}
                </div>
            </div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th style="width: 50%">DÉSIGNATION</th>
                    <th style="text-align: center">QTÉ</th>
                    <th style="text-align: right">P.U</th>
                    <th style="text-align: right">TOTAL</th>
                </tr>
            </thead>
            <tbody>
                ${(data.items || []).map((item: any) => `
                <tr class="item-row">
                    <td>
                        <div style="font-weight: 600; color: #0f172a">${item.name}</div>
                        <div style="font-size: 11px; color: #94a3b8">${item.sku || ''}</div>
                    </td>
                    <td style="text-align: center">${item.quantity}</td>
                    <td style="text-align: right">${new Intl.NumberFormat('fr-DZ').format(item.unitPrice)} DA</td>
                    <td style="text-align: right; font-weight: 600">${new Intl.NumberFormat('fr-DZ').format(item.total)} DA</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="total-section">
            <div class="total-row">
                <span>SOUS-TOTAL</span>
                <span>${new Intl.NumberFormat('fr-DZ').format(data.subtotal || 0)} DA</span>
            </div>
            <div class="total-row">
                <span>REMISE TOTAL</span>
                <span>-${new Intl.NumberFormat('fr-DZ').format(data.discountAmount || 0)} DA</span>
            </div>
            <div class="grand-total">
                <span style="font-size: 14px; color: #94a3b8; margin-right: 20px">SOLDE TOTAL</span>
                ${new Intl.NumberFormat('fr-DZ').format(data.totalAmount || 0)} DA
            </div>
        </div>
        
        <div class="footer">
            <div>GÉNÉRÉ LE ${new Date().toLocaleDateString('fr-FR')} À ${new Date().toLocaleTimeString('fr-FR')}</div>
            <div>PAGE 1 SUR 1 • GRAPHSHOP OS - SYSTÈME DE GESTION PROFESSIONNEL</div>
        </div>
    </div>
</body>
</html>`;
    }
}

// ===== EXPORTS =====

export const JonyReceipt = new JonyReceiptGenerator();
export const JonyLabel = new JonyLabelGenerator();
export const JonyHTML = new JonyHTMLGenerator();

export default {
    Receipt: JonyReceipt,
    Label: JonyLabel,
    HTML: JonyHTML,
    ESCPOS: ESCPOS_JONY,
    PAPER_CONFIGS,
};

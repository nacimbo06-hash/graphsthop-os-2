/**
 * PrinterService - Service d'impression pour SuperMarket Control OS
 * 
 * Supporte:
 * - Imprimantes thermiques (ESC/POS) - 58mm / 80mm
 * - Imprimantes d'étiquettes (ZPL) - Zebra compatible
 * - Impression navigateur (fallback)
 * - Web USB API pour connexion directe
 * 
 * Design: Style Minimal, propre, hiérarchique
 */

import { JonyReceiptGenerator, JonyHTML, JonyLabelGenerator, type PriceLabelData } from './jonyPrintDesigner';
import { formatCurrency, formatDateTime as formatDate } from '../utils/formatters';
import type {
    PrinterConfig,
    PrintJob,
    ReceiptData,
    LabelData,
    DocumentData
} from '@core';

// Placeholder for WebUSB type
type USBDevice = any;


// ===== ESC/POS COMMANDS =====

const ESC = 0x1B;
const GS = 0x1D;
const LF = 0x0A;

const ESCPOS = {
    // Initialize printer
    INIT: new Uint8Array([ESC, 0x40]),

    // Text alignment
    ALIGN_LEFT: new Uint8Array([ESC, 0x61, 0x00]),
    ALIGN_CENTER: new Uint8Array([ESC, 0x61, 0x01]),
    ALIGN_RIGHT: new Uint8Array([ESC, 0x61, 0x02]),

    // Text formatting
    BOLD_ON: new Uint8Array([ESC, 0x45, 0x01]),
    BOLD_OFF: new Uint8Array([ESC, 0x45, 0x00]),
    DOUBLE_HEIGHT: new Uint8Array([GS, 0x21, 0x01]),
    DOUBLE_WIDTH: new Uint8Array([GS, 0x21, 0x10]),
    DOUBLE_SIZE: new Uint8Array([GS, 0x21, 0x11]),
    NORMAL_SIZE: new Uint8Array([GS, 0x21, 0x00]),
    UNDERLINE_ON: new Uint8Array([ESC, 0x2D, 0x01]),
    UNDERLINE_OFF: new Uint8Array([ESC, 0x2D, 0x00]),

    // Paper control
    LINE_FEED: new Uint8Array([LF]),
    CUT_PAPER: new Uint8Array([GS, 0x56, 0x00]),
    PARTIAL_CUT: new Uint8Array([GS, 0x56, 0x01]),

    // Barcode settings
    BARCODE_HEIGHT: (h: number) => new Uint8Array([GS, 0x68, h]),
    BARCODE_WIDTH: (w: number) => new Uint8Array([GS, 0x77, w]),
    BARCODE_TEXT_BELOW: new Uint8Array([GS, 0x48, 0x02]),
    BARCODE_EAN13: (data: string) => {
        const bytes = new Uint8Array([GS, 0x6B, 0x02, ...stringToBytes(data), 0x00]);
        return bytes;
    },

    // Cash drawer
    OPEN_DRAWER: new Uint8Array([ESC, 0x70, 0x00, 0x19, 0xFA]),
};

// ===== ZPL COMMANDS (Zebra Label Printers) =====

const ZPL = {
    START: '^XA',
    END: '^XZ',

    // Position field
    fieldOrigin: (x: number, y: number) => `^FO${x},${y}`,

    // Font
    font: (size: number = 30) => `^A0N,${size},${size}`,

    // Field data
    fieldData: (text: string) => `^FD${text}^FS`,

    // Barcode EAN-13
    barcodeEAN13: (x: number, y: number, data: string, height: number = 80) =>
        `^FO${x},${y}^BY2^BEN,${height},Y,N^FD${data}^FS`,

    // QR Code
    qrCode: (x: number, y: number, data: string, size: number = 3) =>
        `^FO${x},${y}^BQN,2,${size}^FDQA,${data}^FS`,

    // Box
    box: (x: number, y: number, w: number, h: number, thickness: number = 2) =>
        `^FO${x},${y}^GB${w},${h},${thickness}^FS`,

    // Generate price label
    priceLabel: (data: LabelData): string => {
        const priceStr = Math.round(data.price).toString();
        let zpl = ZPL.START;

        // Product name
        zpl += ZPL.fieldOrigin(20, 20);
        zpl += ZPL.font(25);
        zpl += ZPL.fieldData(data.productName.substring(0, 25));

        // Price
        zpl += ZPL.fieldOrigin(20, 60);
        zpl += '^A0N,60,60';
        zpl += `^FD${priceStr} DA^FS`;

        // Old price (strikethrough for promo)
        if (data.oldPrice) {
            zpl += ZPL.fieldOrigin(200, 70);
            zpl += ZPL.font(25);
            zpl += `^FD${data.oldPrice} DA^FS`;
            // Strikethrough line
            zpl += `^FO200,85^GB80,2,2^FS`;
        }

        // Barcode
        zpl += ZPL.barcodeEAN13(20, 130, data.barcode, 60);

        zpl += ZPL.END;
        return zpl;
    },
};

// ===== UTILITY FUNCTIONS =====

function stringToBytes(str: string): number[] {
    const encoder = new TextEncoder();
    return Array.from(encoder.encode(str));
}

function padRight(str: string, len: number): string {

    return str.padEnd(len).substring(0, len);
}

function padLeft(str: string, len: number): string {
    return str.padStart(len).substring(0, len);
}

// ===== RECEIPT GENERATION =====

function generateReceiptBytes(data: ReceiptData, paperWidth: 58 | 80 = 80): Uint8Array {
    const charWidth = paperWidth === 80 ? 48 : 32;
    const separator = '-'.repeat(charWidth);
    const doubleSeparator = '='.repeat(charWidth);

    const parts: Uint8Array[] = [];
    const addCommand = (cmd: Uint8Array) => parts.push(cmd);
    const addText = (text: string) => parts.push(new Uint8Array(stringToBytes(text + '\n')));

    // Initialize
    addCommand(ESCPOS.INIT);

    // Store header
    addCommand(ESCPOS.ALIGN_CENTER);
    addCommand(ESCPOS.DOUBLE_SIZE);
    addText(data.storeInfo.name);
    addCommand(ESCPOS.NORMAL_SIZE);
    addText(data.storeInfo.address);
    addText(`Tél: ${data.storeInfo.phone}`);
    if (data.storeInfo.nif) addText(`NIF: ${data.storeInfo.nif}`);
    if (data.storeInfo.rc) addText(`RC: ${data.storeInfo.rc}`);
    addText('');

    // Transaction info
    addCommand(ESCPOS.ALIGN_LEFT);
    addText(separator);
    addText(`Ticket: ${data.transactionId}`);
    addText(`Date: ${formatDate(data.date)}`);
    addText(`Caissier: ${data.cashier}`);
    if (data.customer) addText(`Client: ${data.customer.name}`);
    addText(separator);

    // Items
    addCommand(ESCPOS.BOLD_ON);
    addText(padRight('ARTICLE', charWidth - 12) + padLeft('TOTAL', 12));
    addCommand(ESCPOS.BOLD_OFF);
    addText(separator);

    for (const item of data.items) {
        const name = item.isBundle ? `${item.name} (PACK)` : item.name;
        const qtyPrice = `${item.quantity} x ${formatCurrency(item.unitPrice)}`;
        const total = formatCurrency(item.total);

        addText(name.substring(0, charWidth));
        addText(padRight(`  ${qtyPrice}`, charWidth - total.length) + total);
    }

    addText(separator);

    // Totals
    const addTotalLine = (label: string, value: string, bold: boolean = false) => {
        if (bold) addCommand(ESCPOS.BOLD_ON);
        addText(padRight(label, charWidth - value.length) + value);
        if (bold) addCommand(ESCPOS.BOLD_OFF);
    };

    addTotalLine('Sous-total:', formatCurrency(data.subtotal));
    if (data.discount && data.discount.amount > 0) {
        addTotalLine(`Remise (${data.discount.percent}%):`, `-${formatCurrency(data.discount.amount)}`);
    }
    if (data.vat) {
        addTotalLine(`TVA (${data.vat.rate}%):`, formatCurrency(data.vat.amount));
    }
    addText(doubleSeparator);

    addCommand(ESCPOS.DOUBLE_SIZE);
    addTotalLine('TOTAL:', formatCurrency(data.total), true);
    addCommand(ESCPOS.NORMAL_SIZE);

    addText(doubleSeparator);

    // Payment info
    addText(`Mode de paiement: ${data.paymentMethod}`);
    if (data.amountReceived) {
        addText(`Montant reçu: ${formatCurrency(data.amountReceived)}`);
        if (data.change && data.change > 0) {
            addText(`Monnaie rendue: ${formatCurrency(data.change)}`);
        }
    }

    // Loyalty points
    if (data.customer?.loyaltyPoints) {
        addText('');
        addText(`Points fidélité: +${data.customer.loyaltyPoints} pts`);
    }

    // Footer
    addText('');
    addCommand(ESCPOS.ALIGN_CENTER);
    addText(data.footer || 'Merci de votre visite!');
    addText('À bientôt!');
    addText('');
    addText('');
    addText('');

    // Cut paper
    addCommand(ESCPOS.PARTIAL_CUT);

    // Combine all parts
    const totalLength = parts.reduce((acc, part) => acc + part.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const part of parts) {
        result.set(part, offset);
        offset += part.length;
    }

    return result;
}

// ===== PRINTER SERVICE CLASS =====

class PrinterServiceClass {
    private connectedDevice: USBDevice | null = null;
    private printers: PrinterConfig[] = [];
    private printQueue: PrintJob[] = [];

    constructor() {
        this.loadPrinters();
    }

    // Load saved printers from localStorage
    private loadPrinters(): void {
        const saved = localStorage.getItem('printers');
        if (saved) {
            this.printers = JSON.parse(saved);
        } else {
            // Default printers
            this.printers = [
                {
                    id: 'browser-default',
                    name: 'Imprimante système',
                    type: 'standard',
                    connectionType: 'browser',
                    paperWidth: 80,
                    isDefault: true,
                    status: 'online',
                },
            ];
        }
    }

    // Save printers to localStorage
    private savePrinters(): void {
        localStorage.setItem('printers', JSON.stringify(this.printers));
    }

    // Get all printers
    getPrinters(): PrinterConfig[] {
        return this.printers;
    }

    // Get default printer by type
    getDefaultPrinter(type: 'thermal' | 'label' | 'standard'): PrinterConfig | undefined {
        return this.printers.find(p => p.type === type && p.isDefault) ||
            this.printers.find(p => p.type === type);
    }

    // Add printer
    addPrinter(printer: Omit<PrinterConfig, 'id' | 'status'>): PrinterConfig {
        const newPrinter: PrinterConfig = {
            ...printer,
            id: `printer-${Date.now()}`,
            status: 'offline',
        };
        this.printers.push(newPrinter);
        this.savePrinters();
        return newPrinter;
    }

    // Remove printer
    removePrinter(id: string): void {
        this.printers = this.printers.filter(p => p.id !== id);
        this.savePrinters();
    }

    // Request USB device access (Web USB API)
    async requestUSBPrinter(): Promise<USBDevice | null> {
        if (!('usb' in navigator)) {
            console.warn('Web USB API not supported');
            return null;
        }

        try {
            const device = await (navigator as any).usb.requestDevice({
                filters: [
                    // Common thermal printer vendors
                    { vendorId: 0x0416 }, // Epson
                    { vendorId: 0x04B8 }, // Epson (alternate)
                    { vendorId: 0x0519 }, // Star Micronics
                    { vendorId: 0x0DD4 }, // Custom
                    { vendorId: 0x0FE6 }, // ICS
                    { vendorId: 0x1504 }, // HPRT
                    { vendorId: 0x0483 }, // STMicroelectronics (many Chinese printers)
                ]
            });

            this.connectedDevice = device;
            return device;
        } catch (error) {
            console.error('USB device request failed:', error);
            return null;
        }
    }

    // Connect to USB device
    async connectUSB(device: USBDevice): Promise<boolean> {
        try {
            await device.open();

            if (device.configuration === null) {
                await device.selectConfiguration(1);
            }

            await device.claimInterface(0);

            this.connectedDevice = device;
            console.log('USB printer connected:', device.productName);
            return true;
        } catch (error) {
            console.error('USB connection failed:', error);
            return false;
        }
    }

    // Send data to USB printer
    async sendToUSB(data: Uint8Array): Promise<boolean> {
        if (!this.connectedDevice) {
            console.error('No USB device connected');
            return false;
        }

        try {
            // Find the bulk OUT endpoint
            const endpoint = this.connectedDevice.configuration?.interfaces[0]
                ?.alternate.endpoints.find(e => e.direction === 'out');

            if (!endpoint) {
                throw new Error('No output endpoint found');
            }

            await this.connectedDevice.transferOut(endpoint.endpointNumber, data);
            return true;
        } catch (error) {
            console.error('USB send failed:', error);
            return false;
        }
    }

    // Print receipt
    async printReceipt(data: ReceiptData, printer?: PrinterConfig): Promise<boolean> {
        const targetPrinter = printer || this.getDefaultPrinter('thermal');

        if (!targetPrinter) {
            // Fallback to browser print
            return this.browserPrintReceipt(data);
        }

        switch (targetPrinter.connectionType) {
            case 'usb':
                const bytes = generateReceiptBytes(data, targetPrinter.paperWidth as 58 | 80);
                return this.sendToUSB(bytes);

            case 'network':
                // TODO: Implement network printing via backend
                console.log('Network printing not yet implemented');
                return this.browserPrintReceipt(data);

            case 'browser':
            default:
                return this.browserPrintReceipt(data);
        }
    }

    // Browser print receipt (fallback) - Using Jony Ive style
    private browserPrintReceipt(data: ReceiptData): boolean {
        const html = JonyHTML.generateReceiptHTML(data, 80);
        return this.openPrintWindow(html, 'Ticket de caisse');
    }

    // Generate HTML receipt for browser printing
    private generateReceiptHTML(data: ReceiptData): string {
        const itemsHTML = data.items.map(item => `
            <tr>
                <td>${item.name}${item.isBundle ? ' <small>(PACK)</small>' : ''}</td>
                <td class="center">${item.quantity}</td>
                <td class="right">${formatCurrency(item.unitPrice)}</td>
                <td class="right">${formatCurrency(item.total)}</td>
            </tr>
        `).join('');

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Ticket de caisse</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Courier New', monospace;
                        font-size: 12px;
                        width: 80mm;
                        padding: 5mm;
                    }
                    .center { text-align: center; }
                    .right { text-align: right; }
                    .bold { font-weight: bold; }
                    .big { font-size: 16px; }
                    .separator { border-top: 1px dashed #000; margin: 5px 0; }
                    .double-separator { border-top: 2px solid #000; margin: 5px 0; }
                    table { width: 100%; border-collapse: collapse; }
                    td { padding: 2px 0; }
                    .header { margin-bottom: 10px; }
                    .total-section { margin-top: 10px; }
                    @media print {
                        @page { margin: 0; size: 80mm auto; }
                        body { width: 100%; }
                    }
                </style>
            </head>
            <body>
                <div class="header center">
                    <div class="bold big">${data.storeInfo.name}</div>
                    <div>${data.storeInfo.address}</div>
                    <div>Tél: ${data.storeInfo.phone}</div>
                    ${data.storeInfo.nif ? `<div>NIF: ${data.storeInfo.nif}</div>` : ''}
                </div>
                
                <div class="separator"></div>
                
                <div>
                    <div>Ticket: ${data.transactionId}</div>
                    <div>Date: ${formatDate(data.date)}</div>
                    <div>Caissier: ${data.cashier}</div>
                    ${data.customer ? `<div>Client: ${data.customer.name}</div>` : ''}
                </div>
                
                <div class="separator"></div>
                
                <table>
                    <thead>
                        <tr class="bold">
                            <td>Article</td>
                            <td class="center">Qté</td>
                            <td class="right">P.U.</td>
                            <td class="right">Total</td>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                    </tbody>
                </table>
                
                <div class="separator"></div>
                
                <div class="total-section">
                    <table>
                        <tr>
                            <td>Sous-total:</td>
                            <td class="right">${formatCurrency(data.subtotal)}</td>
                        </tr>
                        ${data.discount && data.discount.amount > 0 ? `
                        <tr>
                            <td>Remise (${data.discount.percent}%):</td>
                            <td class="right">-${formatCurrency(data.discount.amount)}</td>
                        </tr>
                        ` : ''}
                        ${data.vat ? `
                        <tr>
                            <td>TVA (${data.vat.rate}%):</td>
                            <td class="right">${formatCurrency(data.vat.amount)}</td>
                        </tr>
                        ` : ''}
                    </table>
                    
                    <div class="double-separator"></div>
                    
                    <table>
                        <tr class="bold big">
                            <td>TOTAL:</td>
                            <td class="right">${formatCurrency(data.total)}</td>
                        </tr>
                    </table>
                    
                    <div class="double-separator"></div>
                    
                    <div>Mode de paiement: ${data.paymentMethod}</div>
                    ${data.amountReceived ? `<div>Montant reçu: ${formatCurrency(data.amountReceived)}</div>` : ''}
                    ${data.change && data.change > 0 ? `<div>Monnaie: ${formatCurrency(data.change)}</div>` : ''}
                </div>
                
                <div class="separator"></div>
                
                <div class="center" style="margin-top: 10px;">
                    <div>${data.footer || 'Merci de votre visite!'}</div>
                    <div>À bientôt!</div>
                </div>
            </body>
            </html>
        `;
    }

    // Print label
    async printLabel(data: LabelData, quantity: number = 1, printer?: PrinterConfig): Promise<boolean> {
        const targetPrinter = printer || this.getDefaultPrinter('label');

        if (targetPrinter?.connectionType === 'usb' && this.connectedDevice) {
            // Generate ZPL for Zebra printers
            const zpl = ZPL.priceLabel(data);
            const zplBytes = new TextEncoder().encode(zpl.repeat(quantity));
            return this.sendToUSB(zplBytes);
        }

        // Fallback to browser print
        return this.browserPrintLabel(data, quantity);
    }

    // Browser print label (fallback)
    private browserPrintLabel(data: LabelData, quantity: number): boolean {
        const labels = Array(quantity).fill(this.generateLabelHTML(data)).join('');
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Étiquettes</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: Arial, sans-serif; }
                    .label {
                        width: 50mm;
                        height: 30mm;
                        border: 1px solid #ccc;
                        padding: 2mm;
                        margin: 2mm;
                        display: inline-block;
                        page-break-inside: avoid;
                    }
                    .product-name { font-size: 10px; font-weight: bold; margin-bottom: 2px; }
                    .price { font-size: 18px; font-weight: bold; }
                    .old-price { font-size: 12px; text-decoration: line-through; color: #999; }
                    .barcode { font-family: 'Libre Barcode EAN13 Text', monospace; font-size: 24px; }
                    .sku { font-size: 8px; color: #666; }
                    @media print {
                        @page { margin: 0; }
                        .label { border: none; }
                    }
                </style>
            </head>
            <body>${labels}</body>
            </html>
        `;
        return this.openPrintWindow(html, 'Étiquettes');
    }

    // Generate single label HTML
    private generateLabelHTML(data: LabelData): string {
        return `
            <div class="label">
                <div class="product-name">${data.productName}</div>
                <div class="price">${formatCurrency(data.price)}</div>
                ${data.oldPrice ? `<div class="old-price">${formatCurrency(data.oldPrice)}</div>` : ''}
                <div class="barcode">${data.barcode}</div>
                <div class="sku">${data.sku}</div>
            </div>
        `;
    }

    // Print document
    async printDocument(data: DocumentData): Promise<boolean> {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${data.title}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20mm; }
                    h1 { color: #333; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background: #f5f5f5; }
                    @media print { @page { margin: 15mm; } }
                </style>
            </head>
            <body>
                <h1>${data.title}</h1>
                ${data.html}
            </body>
            </html>
        `;
        return this.openPrintWindow(html, data.title);
    }

    // Open print window
    private openPrintWindow(html: string, title: string): boolean {
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!printWindow) {
            console.error('Could not open print window');
            return false;
        }

        printWindow.document.write(html);
        printWindow.document.close();

        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
            // printWindow.close(); // Uncomment to auto-close after print
        };

        return true;
    }

    // Open cash drawer (ESC/POS)
    async openCashDrawer(): Promise<boolean> {
        if (this.connectedDevice) {
            return this.sendToUSB(ESCPOS.OPEN_DRAWER);
        }
        console.warn('No USB printer connected for cash drawer');
        return false;
    }

    // Test print
    async testPrint(printer: PrinterConfig): Promise<boolean> {
        const testData: ReceiptData = {
            storeInfo: {
                name: 'TEST IMPRESSION',
                address: 'Test Address',
                phone: '0000000000',
            },
            transactionId: 'TEST-001',
            date: new Date(),
            cashier: 'Test',
            items: [
                { name: 'Produit Test 1', quantity: 2, unitPrice: 100, total: 200 },
                { name: 'Produit Test 2', quantity: 1, unitPrice: 150, total: 150 },
            ],
            subtotal: 350,
            vat: { rate: 19, amount: 66.5 },
            total: 416.5,
            paymentMethod: 'TEST',
            footer: '*** TEST D\'IMPRESSION ***',
        };

        return this.printReceipt(testData, printer);
    }
}

// Export singleton instance
export const PrinterService = new PrinterServiceClass();
export default PrinterService;

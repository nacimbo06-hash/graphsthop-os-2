/**
 * Printer Manager - Device Discovery and Connection Management
 * 
 * Handles USB printer discovery, connection, and print job execution.
 */

import { ESCPOS } from './commands/escpos';
import { ZPL } from './commands/zpl';
import { generateReceiptBytes } from './generators/receiptGenerator';
import { generateLabelPage } from './generators/labelGenerator';
import { JonyHTML } from '../jonyPrintDesigner';
import type {
    PrinterConfig,
    PrintJob,
    ReceiptData,
    LabelData,
    DocumentData,
    PrintResult,
    PrintErrorType
} from '@bonilo/shared';

// Placeholder for WebUSB type
type USBDevice = any;

// ===== PRINTER MANAGER CLASS =====

class PrinterManager {
    private connectedDevice: USBDevice | null = null;
    private printers: PrinterConfig[] = [];
    private printQueue: PrintJob[] = [];

    constructor() {
        this.loadPrinters();
    }

    // ========== CONFIGURATION ==========

    private loadPrinters(): void {
        const saved = localStorage.getItem('printers');
        if (saved) {
            this.printers = JSON.parse(saved);
        } else {
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

    private savePrinters(): void {
        localStorage.setItem('printers', JSON.stringify(this.printers));
    }

    getPrinters(): PrinterConfig[] {
        return this.printers;
    }

    getDefaultPrinter(type: 'thermal' | 'label' | 'standard'): PrinterConfig | undefined {
        return this.printers.find(p => p.type === type && p.isDefault) ||
            this.printers.find(p => p.type === type);
    }

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

    removePrinter(id: string): void {
        this.printers = this.printers.filter(p => p.id !== id);
        this.savePrinters();
    }

    // ========== USB CONNECTION ==========

    async requestUSBPrinter(): Promise<USBDevice | null> {
        if (!('usb' in navigator)) {
            console.warn('Web USB API not supported');
            return null;
        }

        try {
            const device = await (navigator as any).usb.requestDevice({
                filters: [
                    { vendorId: 0x0416 }, // Epson
                    { vendorId: 0x04B8 }, // Epson (alternate)
                    { vendorId: 0x0519 }, // Star Micronics
                    { vendorId: 0x0DD4 }, // Custom
                    { vendorId: 0x0FE6 }, // ICS
                    { vendorId: 0x1504 }, // HPRT
                    { vendorId: 0x0483 }, // STMicroelectronics
                ]
            });

            this.connectedDevice = device;
            return device;
        } catch (error) {
            console.error('USB device request failed:', error);
            return null;
        }
    }

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

    async sendToUSB(data: Uint8Array): Promise<boolean> {
        if (!this.connectedDevice) {
            console.error('No USB device connected');
            return false;
        }

        try {
            const endpoint = this.connectedDevice.configuration?.interfaces[0]
                ?.alternate.endpoints.find((e: any) => e.direction === 'out');

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

    // ========== PRINTING ==========

    async printReceipt(data: ReceiptData, printer?: PrinterConfig): Promise<boolean> {
        const targetPrinter = printer || this.getDefaultPrinter('thermal');

        if (!targetPrinter) {
            return this.browserPrintReceipt(data);
        }

        switch (targetPrinter.connectionType) {
            case 'usb':
                const bytes = generateReceiptBytes(data, targetPrinter.paperWidth as 58 | 80);
                return this.sendToUSB(bytes);

            case 'network':
                console.log('Network printing not yet implemented');
                return this.browserPrintReceipt(data);

            case 'browser':
            default:
                return this.browserPrintReceipt(data);
        }
    }

    private browserPrintReceipt(data: ReceiptData): boolean {
        const html = JonyHTML.generateReceiptHTML(data, 80);
        return this.openPrintWindow(html, 'Ticket de caisse');
    }

    async printLabel(data: LabelData, quantity: number = 1, printer?: PrinterConfig): Promise<boolean> {
        const targetPrinter = printer || this.getDefaultPrinter('label');

        if (targetPrinter?.connectionType === 'usb' && this.connectedDevice) {
            const zpl = ZPL.priceLabel(data);
            const zplBytes = new TextEncoder().encode(zpl.repeat(quantity));
            return this.sendToUSB(zplBytes);
        }

        return this.browserPrintLabel(data, quantity);
    }

    private browserPrintLabel(data: LabelData, quantity: number): boolean {
        const html = generateLabelPage(data, quantity);
        return this.openPrintWindow(html, 'Étiquettes');
    }

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
        };

        return true;
    }

    // ========== CASH DRAWER ==========

    async openCashDrawer(): Promise<boolean> {
        if (this.connectedDevice) {
            return this.sendToUSB(ESCPOS.OPEN_DRAWER);
        }
        console.warn('No USB printer connected for cash drawer');
        return false;
    }

    // ========== TEST ==========

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
export const printerManager = new PrinterManager();
export default printerManager;

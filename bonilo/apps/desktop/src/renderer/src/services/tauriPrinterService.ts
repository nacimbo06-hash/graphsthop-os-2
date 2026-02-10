import { invoke } from '@tauri-apps/api/core';

export interface PrinterInfo {
    port: string;
    name: string;
}

export interface ReceiptLine {
    text: string;
    bold?: boolean;
    align?: 'left' | 'center' | 'right';
    size?: 1 | 2;
}

export interface ReceiptData {
    lines: ReceiptLine[];
    cut?: boolean;
    open_drawer?: boolean;
}

/**
 * List available thermal printers (serial ports)
 */
export async function listPrinters(): Promise<PrinterInfo[]> {
    return invoke<PrinterInfo[]>('list_printers');
}

/**
 * Print a receipt to a thermal printer using ESC/POS
 */
export async function printReceipt(portName: string, receipt: ReceiptData): Promise<void> {
    const formattedReceipt = {
        lines: receipt.lines.map(line => ({
            text: line.text,
            bold: line.bold ?? false,
            align: line.align ?? 'left',
            size: line.size ?? 1,
        })),
        cut: receipt.cut ?? true,
        open_drawer: receipt.open_drawer ?? false,
    };

    return invoke('print_receipt', { portName, receipt: formattedReceipt });
}

/**
 * Send raw bytes to printer (advanced)
 */
export async function printRaw(portName: string, data: number[]): Promise<void> {
    return invoke('print_raw', { portName, data });
}

/**
 * Helper: Generate receipt lines from sale data
 */
export function generateReceiptLines(sale: {
    number: string;
    date: Date;
    cashier: string;
    items: { name: string; qty: number; price: number; total: number }[];
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
    amountPaid: number;
    change: number;
    storeName?: string;
}): ReceiptLine[] {
    const lines: ReceiptLine[] = [];

    // Header
    lines.push({ text: sale.storeName || 'IGO', bold: true, align: 'center', size: 2 });
    lines.push({ text: '================================', align: 'center' });
    lines.push({ text: `Ticket: ${sale.number}`, align: 'left' });
    lines.push({ text: `Date: ${sale.date.toLocaleDateString('fr-FR')}`, align: 'left' });
    lines.push({ text: `Caissier: ${sale.cashier}`, align: 'left' });
    lines.push({ text: '--------------------------------', align: 'center' });

    // Items
    for (const item of sale.items) {
        lines.push({ text: item.name.substring(0, 20), align: 'left' });
        lines.push({ text: `  ${item.qty} x ${item.price.toFixed(2)} = ${item.total.toFixed(2)} DA`, align: 'right' });
    }

    lines.push({ text: '--------------------------------', align: 'center' });

    // Totals
    lines.push({ text: `Sous-total: ${sale.subtotal.toFixed(2)} DA`, align: 'right' });
    if (sale.tax > 0) {
        lines.push({ text: `TVA: ${sale.tax.toFixed(2)} DA`, align: 'right' });
    }
    lines.push({ text: `TOTAL: ${sale.total.toFixed(2)} DA`, bold: true, align: 'right', size: 2 });

    lines.push({ text: '--------------------------------', align: 'center' });

    // Payment
    lines.push({ text: `Mode: ${sale.paymentMethod}`, align: 'left' });
    lines.push({ text: `Payé: ${sale.amountPaid.toFixed(2)} DA`, align: 'left' });
    lines.push({ text: `Rendu: ${sale.change.toFixed(2)} DA`, align: 'left' });

    lines.push({ text: '================================', align: 'center' });
    lines.push({ text: 'Merci pour votre visite!', align: 'center' });
    lines.push({ text: '', align: 'left' }); // Empty line before cut

    return lines;
}

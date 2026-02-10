/**
 * Receipt Generator - ESC/POS Byte Array Generation
 * 
 * Generates ESC/POS byte arrays for thermal receipt printers.
 */

import { ESCPOS, stringToBytes, padRight, padLeft } from '../commands/escpos';
import type { ReceiptData } from '@core';
import { formatCurrency, formatDateTime as formatDate } from '../../../utils/formatters';

/**
 * Generate ESC/POS receipt bytes for thermal printers
 */
export function generateReceiptBytes(data: ReceiptData, paperWidth: 58 | 80 = 80): Uint8Array {
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
        // Use shortName if available (from product.shortName), otherwise truncate intelligently
        let displayName = (item as any).shortName || item.name;
        if (item.isBundle) displayName = `${displayName} (PK)`;

        // Truncate to fit receipt width
        if (displayName.length > charWidth - 2) {
            displayName = displayName.substring(0, charWidth - 3) + '.';
        }

        const qtyPrice = `${item.quantity} x ${formatCurrency(item.unitPrice)}`;
        const total = formatCurrency(item.total);

        addText(displayName);
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

export default generateReceiptBytes;

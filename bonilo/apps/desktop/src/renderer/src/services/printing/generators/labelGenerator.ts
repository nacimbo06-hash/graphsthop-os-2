/**
 * Label Generator - ZPL and HTML Label Generation
 * 
 * Generates labels for both Zebra printers (ZPL) and browser printing (HTML).
 */

import { ZPL } from '../commands/zpl';
import type { LabelData } from '@bonilo/shared';
import { formatCurrency } from '../../../utils/formatters';

/**
 * Generate ZPL label for Zebra printers
 */
export function generateZPLLabel(data: LabelData): string {
    return ZPL.priceLabel(data);
}

/**
 * Generate HTML label for browser printing
 */
export function generateLabelHTML(data: LabelData): string {
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

/**
 * Generate full HTML page for label printing
 */
export function generateLabelPage(data: LabelData, quantity: number): string {
    const labels = Array(quantity).fill(generateLabelHTML(data)).join('');

    return `
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
}

export default { generateZPLLabel, generateLabelHTML, generateLabelPage };

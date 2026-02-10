/**
 * ZPL Commands - Zebra Label Printer Command Set
 * 
 * Command builders for ZPL-compatible label printers.
 * Used for price labels and product tags.
 */

import type { LabelData } from '@core';

// ===== BASE COMMANDS =====

export const START = '^XA';
export const END = '^XZ';

// ===== POSITIONING =====

export function fieldOrigin(x: number, y: number): string {
    return `^FO${x},${y}`;
}

// ===== FONTS =====

export function font(size: number = 30): string {
    return `^A0N,${size},${size}`;
}

// ===== FIELD DATA =====

export function fieldData(text: string): string {
    return `^FD${text}^FS`;
}

// ===== BARCODES =====

export function barcodeEAN13(x: number, y: number, data: string, height: number = 80): string {
    return `^FO${x},${y}^BY2^BEN,${height},Y,N^FD${data}^FS`;
}

export function qrCode(x: number, y: number, data: string, size: number = 3): string {
    return `^FO${x},${y}^BQN,2,${size}^FDQA,${data}^FS`;
}

// ===== GRAPHICS =====

export function box(x: number, y: number, w: number, h: number, thickness: number = 2): string {
    return `^FO${x},${y}^GB${w},${h},${thickness}^FS`;
}

// ===== LABEL TEMPLATES =====

/**
 * Generate a price label in ZPL format
 */
export function priceLabel(data: LabelData): string {
    const priceStr = Math.round(data.price).toString();
    let zpl = START;

    // Product name
    zpl += fieldOrigin(20, 20);
    zpl += font(25);
    zpl += fieldData(data.productName.substring(0, 25));

    // Price
    zpl += fieldOrigin(20, 60);
    zpl += '^A0N,60,60';
    zpl += `^FD${priceStr} DA^FS`;

    // Old price (strikethrough for promo)
    if (data.oldPrice) {
        zpl += fieldOrigin(200, 70);
        zpl += font(25);
        zpl += `^FD${data.oldPrice} DA^FS`;
        // Strikethrough line
        zpl += `^FO200,85^GB80,2,2^FS`;
    }

    // Barcode
    zpl += barcodeEAN13(20, 130, data.barcode, 60);

    zpl += END;
    return zpl;
}

// ===== COMBINED COMMAND OBJECT (Legacy Support) =====

export const ZPL = {
    START,
    END,
    fieldOrigin,
    font,
    fieldData,
    barcodeEAN13,
    qrCode,
    box,
    priceLabel,
};

export default ZPL;

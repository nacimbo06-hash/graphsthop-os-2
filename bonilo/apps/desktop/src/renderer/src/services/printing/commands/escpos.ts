/**
 * ESC/POS Commands - Thermal Printer Command Set
 * 
 * Low-level byte arrays for ESC/POS compatible printers.
 * Used for thermal receipt printers (58mm / 80mm).
 */

// Base command bytes
const ESC = 0x1B;
const GS = 0x1D;
const LF = 0x0A;

// ===== INITIALIZATION =====

/** Initialize printer - reset to default settings */
export const INIT = new Uint8Array([ESC, 0x40]);

// ===== TEXT ALIGNMENT =====

export const ALIGN_LEFT = new Uint8Array([ESC, 0x61, 0x00]);
export const ALIGN_CENTER = new Uint8Array([ESC, 0x61, 0x01]);
export const ALIGN_RIGHT = new Uint8Array([ESC, 0x61, 0x02]);

// ===== TEXT FORMATTING =====

export const BOLD_ON = new Uint8Array([ESC, 0x45, 0x01]);
export const BOLD_OFF = new Uint8Array([ESC, 0x45, 0x00]);
export const DOUBLE_HEIGHT = new Uint8Array([GS, 0x21, 0x01]);
export const DOUBLE_WIDTH = new Uint8Array([GS, 0x21, 0x10]);
export const DOUBLE_SIZE = new Uint8Array([GS, 0x21, 0x11]);
export const NORMAL_SIZE = new Uint8Array([GS, 0x21, 0x00]);
export const UNDERLINE_ON = new Uint8Array([ESC, 0x2D, 0x01]);
export const UNDERLINE_OFF = new Uint8Array([ESC, 0x2D, 0x00]);

// ===== PAPER CONTROL =====

export const LINE_FEED = new Uint8Array([LF]);
export const CUT_PAPER = new Uint8Array([GS, 0x56, 0x00]);
export const PARTIAL_CUT = new Uint8Array([GS, 0x56, 0x01]);

// ===== CASH DRAWER =====

export const OPEN_DRAWER = new Uint8Array([ESC, 0x70, 0x00, 0x19, 0xFA]);

// ===== BARCODE =====

export const BARCODE_TEXT_BELOW = new Uint8Array([GS, 0x48, 0x02]);

export function BARCODE_HEIGHT(h: number): Uint8Array {
    return new Uint8Array([GS, 0x68, h]);
}

export function BARCODE_WIDTH(w: number): Uint8Array {
    return new Uint8Array([GS, 0x77, w]);
}

export function BARCODE_EAN13(data: string): Uint8Array {
    const bytes = new Uint8Array([GS, 0x6B, 0x02, ...stringToBytes(data), 0x00]);
    return bytes;
}

// ===== UTILITY =====

export function stringToBytes(str: string): number[] {
    const encoder = new TextEncoder();
    return Array.from(encoder.encode(str));
}

export function padRight(str: string, len: number): string {
    return str.length >= len ? str.substring(0, len) : str + ' '.repeat(len - str.length);
}

export function padLeft(str: string, len: number): string {
    return str.length >= len ? str.substring(0, len) : ' '.repeat(len - str.length) + str;
}

// ===== COMBINED COMMAND OBJECT (Legacy Support) =====

export const ESCPOS = {
    INIT,
    ALIGN_LEFT,
    ALIGN_CENTER,
    ALIGN_RIGHT,
    BOLD_ON,
    BOLD_OFF,
    DOUBLE_HEIGHT,
    DOUBLE_WIDTH,
    DOUBLE_SIZE,
    NORMAL_SIZE,
    UNDERLINE_ON,
    UNDERLINE_OFF,
    LINE_FEED,
    CUT_PAPER,
    PARTIAL_CUT,
    OPEN_DRAWER,
    BARCODE_HEIGHT,
    BARCODE_WIDTH,
    BARCODE_TEXT_BELOW,
    BARCODE_EAN13,
};

export default ESCPOS;

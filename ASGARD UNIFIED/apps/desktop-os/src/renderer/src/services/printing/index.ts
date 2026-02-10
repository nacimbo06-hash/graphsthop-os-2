/**
 * Printing Services - Barrel Export
 * 
 * This module re-exports all printing-related functionality.
 */

// Types
export * from '@asgard/shared';

// Commands
export { ESCPOS } from './commands/escpos';
export { ZPL } from './commands/zpl';

// Generators
export { generateReceiptBytes } from './generators/receiptGenerator';
export { generateZPLLabel, generateLabelHTML, generateLabelPage } from './generators/labelGenerator';

// Manager
export { printerManager as PrinterService, printerManager } from './printerManager';
export { default as PrinterManager } from './printerManager';

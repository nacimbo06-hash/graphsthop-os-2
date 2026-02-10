// Export types from shared
export type {
    PrinterConfig,
    PrintJob,
    ReceiptData,
    LabelData,
    DocumentData
} from '@asgard/shared';

// Legacy export (original printerService - still works)
export { PrinterService } from './printerService';

// New modular printing exports
export * from './printing';

/**
 * Printing Types - SuperMarket Control OS
 * 
 * Shared type definitions for the printing service.
 */

// ===== PRINTER CONFIGURATION =====

export interface PrinterConfig {
    id: string;
    name: string;
    type: 'thermal' | 'label' | 'standard';
    connectionType: 'usb' | 'network' | 'bluetooth' | 'browser' | 'serial';
    paperWidth: 58 | 80 | 100; // mm
    vendorId?: number;
    productId?: number;
    ipAddress?: string;
    port?: number;
    isDefault: boolean;
    status: 'online' | 'offline' | 'error';
}

// ===== PRINT JOBS =====

export interface PrintJob {
    id: string;
    type: 'receipt' | 'label' | 'document';
    content: ReceiptData | LabelData | DocumentData;
    printer?: PrinterConfig;
    copies: number;
    status: 'pending' | 'printing' | 'done' | 'error';
    error?: string;
    timestamp: Date;
}

// ===== RECEIPT DATA =====

export interface StoreInfo {
    name: string;
    address: string;
    phone: string;
    nif?: string;  // Numéro d'Identification Fiscale
    nis?: string;  // Numéro d'Identification Statistique
    rc?: string;   // Registre de Commerce
}

export interface ReceiptItem {
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
    isBundle?: boolean;
}

export interface ReceiptData {
    storeInfo: StoreInfo;
    transactionId: string;
    date: Date;
    cashier: string;
    items: ReceiptItem[];
    subtotal: number;
    discount?: { percent: number; amount: number };
    vat?: { rate: number; amount: number };
    total: number;
    paymentMethod: string;
    amountReceived?: number;
    change?: number;
    customer?: { name: string; loyaltyPoints?: number };
    footer?: string;
}

// ===== LABEL DATA =====

export interface LabelData {
    productName: string;
    barcode: string;
    price: number;
    oldPrice?: number; // For promo labels
    sku: string;
    unit?: string;
    date?: Date;
    showQR?: boolean;
}

// ===== DOCUMENT DATA =====

export interface DocumentData {
    title: string;
    html: string;
}

// ===== ERROR TYPES =====

export enum PrintErrorType {
    CONNECTION_FAILED = 'CONNECTION_FAILED',
    DEVICE_NOT_FOUND = 'DEVICE_NOT_FOUND',
    PERMISSION_DENIED = 'PERMISSION_DENIED',
    PRINT_FAILED = 'PRINT_FAILED',
    PAPER_OUT = 'PAPER_OUT',
    COVER_OPEN = 'COVER_OPEN',
    TIMEOUT = 'TIMEOUT',
    UNKNOWN = 'UNKNOWN',
}

export interface PrintError {
    type: PrintErrorType;
    message: string;
    retryable: boolean;
}

// ===== PRINT RESULT =====

export interface PrintResult {
    success: boolean;
    jobId?: string;
    error?: PrintError;
}

/**
 * Sales and POS Data Types
 */
import { PaymentMethod } from '../constants';

export interface SaleItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
    taxAmount?: number;
    discountPercent?: number;
    stockQuantity?: number;
}

export interface Sale {
    id: string;
    receiptNumber: string;
    items: SaleItem[];
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    customerId?: string;
    customerName?: string;
    cashierId: string;
    cashierName: string;
    timestamp: string;
    status: 'completed' | 'pending' | 'refunded' | 'voided';
}

export interface Payment {
    id: string;
    saleId: string;
    paymentMethod: PaymentMethod;
    amount: number;
    referenceNumber?: string;
    isSplit: boolean;
    createdAt: Date | string;
}

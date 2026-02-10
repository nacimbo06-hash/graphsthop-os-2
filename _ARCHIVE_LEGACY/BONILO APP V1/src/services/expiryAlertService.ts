/**
 * Expiry Alert Service - SuperMarket Control OS
 * 
 * Centralized service for managing expiry alerts across the application
 * Connected to real product data from productsStore
 */

import {
    type ExpiryAlert,
    type ProductLot,
    type ExpiryStatus,
    calculateDaysRemaining,
    getExpiryStatus,
    getSuggestedDiscount,
    sortByFEFO,
    selectLotsForSale,
} from '@core';
import type { Product } from '@core';

/**
 * Create a ProductLot from a perishable product
 * In production, lots would be tracked separately per delivery batch
 * For now, we simulate based on product's shelfLifeDays
 */
function createLotFromProduct(product: Product): ProductLot | null {
    if (!product.isPerishable || !product.shelfLifeDays) {
        return null;
    }

    // Simulate expiry date based on shelfLifeDays
    // In production, this would come from GoodsReceipt with actual expiry dates
    const daysRemaining = Math.max(1, Math.min(product.shelfLifeDays, Math.floor(Math.random() * product.shelfLifeDays)));
    const expiryDate = new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000);
    const status = getExpiryStatus(daysRemaining);

    return {
        id: `lot-${product.id}`,
        productId: product.id,
        lotNumber: `LOT-${product.sku || product.id.slice(-6).toUpperCase()}`,
        quantity: product.stock,
        expiryDate,
        receivedDate: new Date(Date.now() - (product.shelfLifeDays - daysRemaining) * 24 * 60 * 60 * 1000),
        costPrice: product.purchasePrice,
        status,
        daysRemaining,
    };
}

class ExpiryAlertServiceClass {
    private products: Product[] = [];
    private lots: ProductLot[] = [];
    private alerts: ExpiryAlert[] = [];

    /**
     * Initialize or update with real products from store
     */
    setProducts(products: Product[]): void {
        this.products = products;
        this.refreshLots();
        this.refreshAlerts();
    }

    /**
     * Refresh lots from current products
     */
    private refreshLots(): void {
        this.lots = this.products
            .filter(p => p.isPerishable && p.shelfLifeDays && p.stock > 0)
            .map(p => createLotFromProduct(p))
            .filter((lot): lot is ProductLot => lot !== null);
    }

    /**
     * Refresh all alerts based on current lot data
     */
    refreshAlerts(): void {
        this.alerts = this.lots
            .filter(lot => lot.expiryDate && lot.status !== 'ok')
            .map(lot => this.createAlertFromLot(lot))
            .sort((a, b) => a.daysRemaining - b.daysRemaining);
    }

    /**
     * Create an alert from a product lot
     */
    private createAlertFromLot(lot: ProductLot): ExpiryAlert {
        const daysRemaining = calculateDaysRemaining(lot.expiryDate) ?? 999;
        const status = getExpiryStatus(daysRemaining);
        const suggestedDiscount = getSuggestedDiscount(status);
        const product = this.products.find(p => p.id === lot.productId);

        let suggestedAction: ExpiryAlert['suggestedAction'] = 'discount';
        if (status === 'expired') suggestedAction = 'dispose';
        else if (status === 'critical' && daysRemaining <= 1) suggestedAction = 'donate';

        return {
            id: `alert-${lot.id}`,
            productId: lot.productId,
            productName: product?.name || 'Produit inconnu',
            lotId: lot.id,
            lotNumber: lot.lotNumber,
            quantity: lot.quantity,
            expiryDate: lot.expiryDate!,
            daysRemaining,
            status,
            suggestedDiscount,
            suggestedAction,
            createdAt: new Date(),
            acknowledged: false,
        };
    }

    /**
     * Get all active alerts
     */
    getAlerts(): ExpiryAlert[] {
        return this.alerts;
    }

    /**
     * Get alerts filtered by status
     */
    getAlertsByStatus(status: ExpiryStatus): ExpiryAlert[] {
        return this.alerts.filter(a => a.status === status);
    }

    /**
     * Get critical and high priority alerts for dashboard
     */
    getCriticalAlerts(): ExpiryAlert[] {
        return this.alerts.filter(a =>
            a.status === 'expired' || a.status === 'critical' || a.status === 'warning'
        );
    }

    /**
     * Get summary counts
     */
    getSummary(): { expired: number; critical: number; warning: number; attention: number; total: number } {
        return {
            expired: this.alerts.filter(a => a.status === 'expired').length,
            critical: this.alerts.filter(a => a.status === 'critical').length,
            warning: this.alerts.filter(a => a.status === 'warning').length,
            attention: this.alerts.filter(a => a.status === 'attention').length,
            total: this.alerts.length,
        };
    }

    /**
     * Acknowledge an alert
     */
    acknowledgeAlert(alertId: string): void {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.acknowledged = true;
        }
    }

    /**
     * Record an action taken on an alert
     */
    recordAction(alertId: string, action: 'discount' | 'return' | 'donate' | 'dispose'): void {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.actionTaken = action;
            alert.acknowledged = true;
            // In production, this would also update the database
        }
    }

    /**
     * Get lots for a product sorted by FEFO
     */
    getLotsForProduct(productId: string): ProductLot[] {
        return sortByFEFO(this.lots.filter(l => l.productId === productId));
    }

    /**
     * Select lots for sale using FEFO
     */
    selectLotsForSale(productId: string, quantity: number): { lot: ProductLot; qty: number }[] {
        const productLots = this.getLotsForProduct(productId);
        return selectLotsForSale(productLots, quantity);
    }

    /**
     * Check if a product has near-expiry lots
     */
    hasNearExpiryLots(productId: string): { hasNearExpiry: boolean; nearestExpiry: ProductLot | null } {
        const lots = this.getLotsForProduct(productId);
        const nearExpiryLots = lots.filter(l =>
            l.status === 'critical' || l.status === 'warning'
        );

        return {
            hasNearExpiry: nearExpiryLots.length > 0,
            nearestExpiry: nearExpiryLots[0] || null,
        };
    }

    /**
     * Get perishable products that should have expiry tracking
     */
    getPerishableProducts(): Product[] {
        return this.products.filter(p => p.isPerishable);
    }
}

// Export singleton instance
export const ExpiryAlertService = new ExpiryAlertServiceClass();

export default ExpiryAlertService;


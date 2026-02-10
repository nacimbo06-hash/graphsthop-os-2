/**
 * Settings Service - Centralized Settings Management
 * Bonilo — Retail Management OS
 * 
 * This service handles loading, saving, and providing settings
 * across the entire application.
 */

// Types
export interface StoreSettings {
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    nif: string;
    nis: string;
    rc: string;
    ai: string;
    currency: string;
    timezone: string;
    tvaEnabled: boolean;
    tvaRate: number;
}

export interface PrintSettings {
    receiptWidth: 58 | 80;
    showBarcode: boolean;
    showQRCode: boolean;
    showLogo: boolean;
    footerText: string;
    autoPrint: boolean;
    openDrawer: boolean;
    printCopy: number;
}

export interface POSSettings {
    quickCheckout: boolean;
    requireCustomer: boolean;
    allowDiscount: boolean;
    maxDiscount: number;
    allowNegativeStock: boolean;
    defaultPaymentMethod: string;
    soundEnabled: boolean;
    autoLogout: number;
}

export interface NotificationSettings {
    lowStockAlert: boolean;
    lowStockThreshold: number;
    expiryAlert: boolean;
    expiryDaysWarning: number;
    dailyReport: boolean;
    emailNotifications: boolean;
    soundNotifications: boolean;
}

export interface SecuritySettings {
    requirePin: boolean;
    pinLength: number;
    sessionTimeout: number;
    lockAfterAttempts: number;
    twoFactorAuth: boolean;
}

export interface AppearanceSettings {
    theme: 'light' | 'dark' | 'system';
    language: 'fr' | 'ar' | 'en';
    dateFormat: string;
    timeFormat: '12h' | '24h';
    numberFormat: string;
}

export interface AllSettings {
    store: StoreSettings;
    print: PrintSettings;
    pos: POSSettings;
    notifications: NotificationSettings;
    security: SecuritySettings;
    appearance: AppearanceSettings;
}

// Default settings
const defaultSettings: AllSettings = {
    store: {
        name: '',
        address: '',
        city: '',
        phone: '',
        email: '',
        nif: '',
        nis: '',
        rc: '',
        ai: '',
        currency: 'DZD',
        timezone: 'Africa/Algiers',
        tvaEnabled: true,
        tvaRate: 19,
    },
    print: {
        receiptWidth: 80,
        showBarcode: true,
        showQRCode: true,
        showLogo: false,
        footerText: '● MERCI DE VOTRE VISITE ●',
        autoPrint: true,
        openDrawer: true,
        printCopy: 1,
    },
    pos: {
        quickCheckout: true,
        requireCustomer: false,
        allowDiscount: true,
        maxDiscount: 50,
        allowNegativeStock: false,
        defaultPaymentMethod: 'cash',
        soundEnabled: true,
        autoLogout: 30,
    },
    notifications: {
        lowStockAlert: true,
        lowStockThreshold: 10,
        expiryAlert: true,
        expiryDaysWarning: 7,
        dailyReport: true,
        emailNotifications: true,
        soundNotifications: true,
    },
    security: {
        requirePin: true,
        pinLength: 4,
        sessionTimeout: 60,
        lockAfterAttempts: 3,
        twoFactorAuth: false,
    },
    appearance: {
        theme: 'light',
        language: 'fr',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        numberFormat: '1 234,56',
    },
};

const STORAGE_KEY = 'bonilo_settings';
const LEGACY_STORAGE_KEY = 'supermarket_settings';

class SettingsServiceClass {
    private settings: AllSettings;
    private listeners: Set<(settings: AllSettings) => void> = new Set();

    constructor() {
        this.settings = this.loadSettings();
        this.applyTheme();
    }

    /**
     * Load settings from localStorage
     */
    private loadSettings(): AllSettings {
        try {
            let saved = localStorage.getItem(STORAGE_KEY);
            // Migrate from legacy key if new key doesn't exist
            if (!saved) {
                saved = localStorage.getItem(LEGACY_STORAGE_KEY);
                if (saved) {
                    localStorage.setItem(STORAGE_KEY, saved);
                    localStorage.removeItem(LEGACY_STORAGE_KEY);
                    console.log('[Settings] ✅ Migrated settings from legacy key');
                }
            }
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults to ensure all keys exist
                return {
                    store: { ...defaultSettings.store, ...parsed.store },
                    print: { ...defaultSettings.print, ...parsed.print },
                    pos: { ...defaultSettings.pos, ...parsed.pos },
                    notifications: { ...defaultSettings.notifications, ...parsed.notifications },
                    security: { ...defaultSettings.security, ...parsed.security },
                    appearance: { ...defaultSettings.appearance, ...parsed.appearance },
                };
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
        return { ...defaultSettings };
    }

    /**
     * Save settings to localStorage
     */
    saveSettings(settings: AllSettings): boolean {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            this.settings = settings;
            this.applyTheme();
            this.notifyListeners();
            return true;
        } catch (error) {
            console.error('Failed to save settings:', error);
            return false;
        }
    }

    /**
     * Get all settings
     */
    getSettings(): AllSettings {
        return this.settings;
    }

    /**
     * Get store settings
     */
    getStoreSettings(): StoreSettings {
        return this.settings.store;
    }

    /**
     * Get print settings
     */
    getPrintSettings(): PrintSettings {
        return this.settings.print;
    }

    /**
     * Get POS settings
     */
    getPOSSettings(): POSSettings {
        return this.settings.pos;
    }

    /**
     * Get notification settings
     */
    getNotificationSettings(): NotificationSettings {
        return this.settings.notifications;
    }

    /**
     * Get security settings
     */
    getSecuritySettings(): SecuritySettings {
        return this.settings.security;
    }

    /**
     * Get appearance settings
     */
    getAppearanceSettings(): AppearanceSettings {
        return this.settings.appearance;
    }

    /**
     * Update specific settings category
     */
    updateStoreSettings(store: Partial<StoreSettings>): void {
        this.settings.store = { ...this.settings.store, ...store };
        this.saveSettings(this.settings);
    }

    updatePrintSettings(print: Partial<PrintSettings>): void {
        this.settings.print = { ...this.settings.print, ...print };
        this.saveSettings(this.settings);
    }

    updatePOSSettings(pos: Partial<POSSettings>): void {
        this.settings.pos = { ...this.settings.pos, ...pos };
        this.saveSettings(this.settings);
    }

    updateNotificationSettings(notifications: Partial<NotificationSettings>): void {
        this.settings.notifications = { ...this.settings.notifications, ...notifications };
        this.saveSettings(this.settings);
    }

    updateSecuritySettings(security: Partial<SecuritySettings>): void {
        this.settings.security = { ...this.settings.security, ...security };
        this.saveSettings(this.settings);
    }

    updateAppearanceSettings(appearance: Partial<AppearanceSettings>): void {
        this.settings.appearance = { ...this.settings.appearance, ...appearance };
        this.saveSettings(this.settings);
    }

    /**
     * Reset all settings to defaults
     */
    resetToDefaults(): void {
        this.saveSettings({ ...defaultSettings });
    }

    /**
     * Apply theme based on settings
     */
    private applyTheme(): void {
        const theme = this.settings.appearance.theme;
        const root = document.documentElement;

        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else if (theme === 'light') {
            root.setAttribute('data-theme', 'light');
        } else {
            // System preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        }
    }

    /**
     * Calculate TVA amount
     */
    calculateTVA(amount: number): { tvaAmount: number; totalWithTVA: number; tvaRate: number } {
        if (!this.settings.store.tvaEnabled) {
            return { tvaAmount: 0, totalWithTVA: amount, tvaRate: 0 };
        }

        const tvaRate = this.settings.store.tvaRate;
        const tvaAmount = Math.round(amount * (tvaRate / 100));
        const totalWithTVA = amount + tvaAmount;

        return { tvaAmount, totalWithTVA, tvaRate };
    }

    /**
     * Format currency based on settings
     */
    formatCurrency(amount: number): string {
        const currency = this.settings.store.currency;
        return new Intl.NumberFormat('fr-DZ', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount) + ' ' + (currency === 'DZD' ? 'DA' : currency);
    }

    /**
     * Format date based on settings
     */
    formatDate(date: Date): string {
        const format = this.settings.appearance.dateFormat;
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        switch (format) {
            case 'MM/DD/YYYY':
                return `${month}/${day}/${year}`;
            case 'YYYY-MM-DD':
                return `${year}-${month}-${day}`;
            default: // DD/MM/YYYY
                return `${day}/${month}/${year}`;
        }
    }

    /**
     * Format time based on settings
     */
    formatTime(date: Date): string {
        const format = this.settings.appearance.timeFormat;
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: format === '12h',
        });
    }

    /**
     * Check if discount is allowed
     */
    isDiscountAllowed(discountPercent: number): boolean {
        if (!this.settings.pos.allowDiscount) return false;
        return discountPercent <= this.settings.pos.maxDiscount;
    }

    /**
     * Check if negative stock is allowed
     */
    isNegativeStockAllowed(): boolean {
        return this.settings.pos.allowNegativeStock;
    }

    /**
     * Play sound if enabled
     */
    playSound(type: 'beep' | 'success' | 'error' | 'warning'): void {
        if (!this.settings.pos.soundEnabled) return;

        // Simple beep using Web Audio API
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            const frequencies: Record<string, number> = {
                beep: 800,
                success: 1000,
                error: 300,
                warning: 600,
            };

            oscillator.frequency.value = frequencies[type] || 800;
            oscillator.type = 'sine';
            gainNode.gain.value = 0.1;

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            // Audio not supported
        }
    }

    /**
     * Subscribe to settings changes
     */
    subscribe(listener: (settings: AllSettings) => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    /**
     * Notify all listeners of settings changes
     */
    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.settings));
    }

    /**
     * Export settings as JSON
     */
    exportSettings(): string {
        return JSON.stringify(this.settings, null, 2);
    }

    /**
     * Import settings from JSON
     */
    importSettings(json: string): boolean {
        try {
            const imported = JSON.parse(json);
            const merged: AllSettings = {
                store: { ...defaultSettings.store, ...imported.store },
                print: { ...defaultSettings.print, ...imported.print },
                pos: { ...defaultSettings.pos, ...imported.pos },
                notifications: { ...defaultSettings.notifications, ...imported.notifications },
                security: { ...defaultSettings.security, ...imported.security },
                appearance: { ...defaultSettings.appearance, ...imported.appearance },
            };
            return this.saveSettings(merged);
        } catch (error) {
            console.error('Failed to import settings:', error);
            return false;
        }
    }
}

// Singleton instance
export const SettingsService = new SettingsServiceClass();

// Also export defaults for reference
export { defaultSettings };

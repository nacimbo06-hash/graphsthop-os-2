/**
 * Settings Context - React Context for Settings
 * Provides settings throughout the application
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import {
    SettingsService,
    type AllSettings,
    type StoreSettings,
    type PrintSettings,
    type POSSettings,
    type NotificationSettings,
    type SecuritySettings,
    type AppearanceSettings,
} from '../services/settingsService';

interface SettingsContextType {
    settings: AllSettings;
    storeSettings: StoreSettings;
    printSettings: PrintSettings;
    posSettings: POSSettings;
    notificationSettings: NotificationSettings;
    securitySettings: SecuritySettings;
    appearanceSettings: AppearanceSettings;

    // Update functions
    updateSettings: (settings: AllSettings) => boolean;
    updateStoreSettings: (store: Partial<StoreSettings>) => void;
    updatePrintSettings: (print: Partial<PrintSettings>) => void;
    updatePOSSettings: (pos: Partial<POSSettings>) => void;
    updateNotificationSettings: (notifications: Partial<NotificationSettings>) => void;
    updateSecuritySettings: (security: Partial<SecuritySettings>) => void;
    updateAppearanceSettings: (appearance: Partial<AppearanceSettings>) => void;
    resetToDefaults: () => void;

    // Utility functions
    calculateTVA: (amount: number) => { tvaAmount: number; totalWithTVA: number; tvaRate: number };
    formatCurrency: (amount: number) => string;
    formatDate: (date: Date) => string;
    formatTime: (date: Date) => string;
    isDiscountAllowed: (discountPercent: number) => boolean;
    isNegativeStockAllowed: () => boolean;
    playSound: (type: 'beep' | 'success' | 'error' | 'warning') => void;
    exportSettings: () => string;
    importSettings: (json: string) => boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
    children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
    const [settings, setSettings] = useState<AllSettings>(SettingsService.getSettings());

    // Subscribe to settings changes
    useEffect(() => {
        const unsubscribe = SettingsService.subscribe((newSettings) => {
            setSettings({ ...newSettings });
        });
        return unsubscribe;
    }, []);

    // Update functions
    const updateSettings = useCallback((newSettings: AllSettings): boolean => {
        return SettingsService.saveSettings(newSettings);
    }, []);

    const updateStoreSettings = useCallback((store: Partial<StoreSettings>) => {
        SettingsService.updateStoreSettings(store);
    }, []);

    const updatePrintSettings = useCallback((print: Partial<PrintSettings>) => {
        SettingsService.updatePrintSettings(print);
    }, []);

    const updatePOSSettings = useCallback((pos: Partial<POSSettings>) => {
        SettingsService.updatePOSSettings(pos);
    }, []);

    const updateNotificationSettings = useCallback((notifications: Partial<NotificationSettings>) => {
        SettingsService.updateNotificationSettings(notifications);
    }, []);

    const updateSecuritySettings = useCallback((security: Partial<SecuritySettings>) => {
        SettingsService.updateSecuritySettings(security);
    }, []);

    const updateAppearanceSettings = useCallback((appearance: Partial<AppearanceSettings>) => {
        SettingsService.updateAppearanceSettings(appearance);
    }, []);

    const resetToDefaults = useCallback(() => {
        SettingsService.resetToDefaults();
    }, []);

    // Utility functions
    const calculateTVA = useCallback((amount: number) => {
        return SettingsService.calculateTVA(amount);
    }, [settings.store.tvaEnabled, settings.store.tvaRate]);

    const formatCurrency = useCallback((amount: number) => {
        return SettingsService.formatCurrency(amount);
    }, [settings.store.currency]);

    const formatDate = useCallback((date: Date) => {
        return SettingsService.formatDate(date);
    }, [settings.appearance.dateFormat]);

    const formatTime = useCallback((date: Date) => {
        return SettingsService.formatTime(date);
    }, [settings.appearance.timeFormat]);

    const isDiscountAllowed = useCallback((discountPercent: number) => {
        return SettingsService.isDiscountAllowed(discountPercent);
    }, [settings.pos.allowDiscount, settings.pos.maxDiscount]);

    const isNegativeStockAllowed = useCallback(() => {
        return SettingsService.isNegativeStockAllowed();
    }, [settings.pos.allowNegativeStock]);

    const playSound = useCallback((type: 'beep' | 'success' | 'error' | 'warning') => {
        SettingsService.playSound(type);
    }, [settings.pos.soundEnabled]);

    const exportSettings = useCallback(() => {
        return SettingsService.exportSettings();
    }, [settings]);

    const importSettings = useCallback((json: string) => {
        return SettingsService.importSettings(json);
    }, []);

    const value: SettingsContextType = {
        settings,
        storeSettings: settings.store,
        printSettings: settings.print,
        posSettings: settings.pos,
        notificationSettings: settings.notifications,
        securitySettings: settings.security,
        appearanceSettings: settings.appearance,

        updateSettings,
        updateStoreSettings,
        updatePrintSettings,
        updatePOSSettings,
        updateNotificationSettings,
        updateSecuritySettings,
        updateAppearanceSettings,
        resetToDefaults,

        calculateTVA,
        formatCurrency,
        formatDate,
        formatTime,
        isDiscountAllowed,
        isNegativeStockAllowed,
        playSound,
        exportSettings,
        importSettings,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

/**
 * Hook to use settings in any component
 */
export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

/**
 * Hook to get just TVA calculation
 */
export const useTVA = () => {
    const { calculateTVA, storeSettings } = useSettings();
    return {
        calculateTVA,
        tvaEnabled: storeSettings.tvaEnabled,
        tvaRate: storeSettings.tvaRate,
    };
};

/**
 * Hook to get just POS settings
 */
export const usePOSSettings = () => {
    const { posSettings, isDiscountAllowed, isNegativeStockAllowed, playSound } = useSettings();
    return {
        ...posSettings,
        isDiscountAllowed,
        isNegativeStockAllowed,
        playSound,
    };
};

/**
 * Hook to get formatting utilities
 */
export const useFormatting = () => {
    const { formatCurrency, formatDate, formatTime, storeSettings, appearanceSettings } = useSettings();
    return {
        formatCurrency,
        formatDate,
        formatTime,
        currency: storeSettings.currency,
        dateFormat: appearanceSettings.dateFormat,
        timeFormat: appearanceSettings.timeFormat,
    };
};

export default SettingsContext;

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppSettings } from '../types';

interface SettingsState {
    settings: AppSettings;

    // Actions
    updateGeneralSettings: (settings: Partial<AppSettings['general']>) => void;
    updatePOSSettings: (settings: Partial<AppSettings['pos']>) => void;
    updateLoyaltySettings: (settings: Partial<AppSettings['loyalty']>) => void;
    updatePrinterSettings: (settings: Partial<AppSettings['printer']>) => void;
    resetSettings: () => void;
}

const defaultSettings: AppSettings = {
    general: {
        storeName: 'Ma Superette',
        storeNameAr: undefined,
        currency: 'DZD',
        language: 'fr',
        timezone: 'Africa/Algiers',
        dateFormat: 'DD/MM/YYYY',
    },
    pos: {
        autoPrintReceipt: true,
        allowPriceOverride: false,
        requireCustomer: false,
        defaultPaymentMethod: 'cash',
    },
    loyalty: {
        pointsPer10DA: 1,
        minRedeemPoints: 100,
        pointsValue: 10, // 1 point = 10 DA
    },
    tax: {
        defaultVatRate: 0.19,
        foodVatRate: 0.09,
    },
    printer: {
        type: 'escpos',
        name: undefined,
        connectionType: 'usb',
    },
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            settings: defaultSettings,

            updateGeneralSettings: (general) => {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        general: { ...state.settings.general, ...general },
                    },
                }));
            },

            updatePOSSettings: (pos) => {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        pos: { ...state.settings.pos, ...pos },
                    },
                }));
            },

            updateLoyaltySettings: (loyalty) => {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        loyalty: { ...state.settings.loyalty, ...loyalty },
                    },
                }));
            },

            updatePrinterSettings: (printer) => {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        printer: { ...state.settings.printer, ...printer },
                    },
                }));
            },

            resetSettings: () => {
                set({ settings: defaultSettings });
            },
        }),
        {
            name: 'settings-storage',
        }
    )
);

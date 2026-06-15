import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    useAuthStore,
    useProductsStore,
    useSalesStore,
    useCustomersStore,
    usePurchasesStore,
    useLotsStore,
    useStockMovementsStore,
} from '@bonilo/shared/stores';
import {
    useCashSessionStore,
    useExpensesStore,
    useSafeStore,
    useSinkingFundsStore,
} from '@bonilo/shared/stores/treasury';

interface DBContextType {
    isReady: boolean;
    error: string | null;
}

const DBContext = createContext<DBContextType>({ isReady: false, error: null });

// Check if running in Tauri
const isTauri = () => {
    return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
};

export const DBProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initDB = async () => {
            try {
                console.log('[DBProvider] Checking Tauri environment...');

                if (!isTauri()) {
                    console.log('[DBProvider] Not in Tauri — using in-memory stores only');
                    setIsReady(true);
                    return;
                }

                console.log('[DBProvider] Initializing Bonilo Database...');

                // Import and init the new migration-based database service
                const { db } = await import('@bonilo/shared/db');
                await db.init();

                // Load settings from DB (SettingsService bootstraps from localStorage;
                // this overwrites with the DB copy if one exists).
                const { SettingsService } = await import('../services/settingsService');
                await SettingsService.loadFromDB();

                // Hydrate all Zustand stores from SQLite
                console.log('[DBProvider] Hydrating stores from SQLite...');
                await Promise.all([
                    useAuthStore.getState().hydrate(),
                    useProductsStore.getState().hydrate(),
                    useSalesStore.getState().hydrate(),
                    useCustomersStore.getState().hydrate(),
                    usePurchasesStore.getState().hydrate(),
                    useLotsStore.getState().hydrate(),
                    useStockMovementsStore.getState().hydrate(),
                    useCashSessionStore.getState().hydrate(),
                    useExpensesStore.getState().hydrate(),
                    useSafeStore.getState().hydrate(),
                    useSinkingFundsStore.getState().hydrate(),
                ]);

                setIsReady(true);
                console.log('[DBProvider] ✅ Database ready, stores hydrated');
            } catch (err) {
                const errorMsg = err instanceof Error ? err.message : String(err);
                console.error('[DBProvider] ❌ Database init failed:', errorMsg);

                // Still mark as ready — stores will work from empty state
                setError(errorMsg);
                setIsReady(true);
            }
        };

        initDB();
    }, []);

    return (
        <DBContext.Provider value={{ isReady, error }}>
            {isReady ? children : (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#FDFBF7',
                    color: '#2C2C2C',
                    fontFamily: "'Nunito', system-ui, -apple-system, sans-serif"
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid #E8E2D9',
                        borderTopColor: '#3D7C4F',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <div style={{ marginTop: '16px', fontSize: '16px', fontWeight: 600 }}>
                        Chargement de Bonilo...
                    </div>
                    <style>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            )}
        </DBContext.Provider>
    );
};

export const useDB = () => useContext(DBContext);

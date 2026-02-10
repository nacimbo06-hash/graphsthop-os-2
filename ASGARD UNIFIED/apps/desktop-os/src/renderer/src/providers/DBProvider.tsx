import React, { createContext, useContext, useEffect, useState } from 'react';
import { useProductsStore, useSalesStore, useCustomersStore } from '@asgard/shared/stores';

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
                    console.log('[DBProvider] Not running in Tauri, skipping SQLite init');
                    setIsReady(true);
                    return;
                }

                console.log('[DBProvider] Initializing Tauri SQLite...');

                // Dynamic import to avoid issues in browser
                const { default: Database } = await import('@tauri-apps/plugin-sql');
                const db = await Database.load('sqlite:igo-desktop.db');

                // Create tables
                const collections = [
                    'products', 'sales', 'customers', 'suppliers',
                    'goods_receipts', 'purchase_orders', 'inventory_movements',
                    'treasury_movements', 'expenses', 'safe_transactions',
                    'sinking_funds', 'users', 'settings', 'store_settings'
                ];

                for (const collection of collections) {
                    await db.execute(`
                        CREATE TABLE IF NOT EXISTS ${collection} (
                            id TEXT PRIMARY KEY,
                            data TEXT NOT NULL,
                            updated_at INTEGER NOT NULL,
                            deleted INTEGER DEFAULT 0
                        )
                    `);
                }

                // Load initial data into Zustand stores
                const loadCollection = async (name: string) => {
                    const rows: any[] = await db.select(
                        `SELECT data FROM ${name} WHERE deleted = 0`
                    );
                    return rows.map((r: any) => JSON.parse(r.data));
                };

                const products = await loadCollection('products');
                if (products.length > 0) {
                    useProductsStore.setState({ products });
                }

                const sales = await loadCollection('sales');
                if (sales.length > 0) {
                    useSalesStore.setState({ sales });
                }

                const customers = await loadCollection('customers');
                if (customers.length > 0) {
                    useCustomersStore.setState({ customers });
                }

                setIsReady(true);
                console.log('[DBProvider] Database ready');
            } catch (err) {
                const errorMsg = err instanceof Error ? err.message : String(err);
                console.error('[DBProvider] Failed to initialize database:', errorMsg);

                // Still mark as ready to allow the app to function (Zustand has localStorage persistence)
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
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    color: 'white',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid #334155',
                        borderTopColor: '#3D7C4F',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <div style={{ marginTop: '16px', fontSize: '16px' }}>
                        Chargement de la base de données...
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

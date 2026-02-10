import React, { createContext, useContext, useEffect, useState } from 'react';

interface DBContextType {
    isReady: boolean;
    error: string | null;
}

const DBContext = createContext<DBContextType>({ isReady: false, error: null });

export const DBProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isReady, setIsReady] = useState(false);
    const [error] = useState<string | null>(null);

    useEffect(() => {
        // Browser mode: Zustand stores handle persistence via localStorage
        console.log('[DBProvider] Browser mode — using localStorage persistence');
        setIsReady(true);
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
                    background: 'linear-gradient(135deg, #1A1A1A 0%, #2C2C2C 100%)',
                    color: 'white',
                    fontFamily: "'Nunito', system-ui, -apple-system, sans-serif"
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
                        Chargement...
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

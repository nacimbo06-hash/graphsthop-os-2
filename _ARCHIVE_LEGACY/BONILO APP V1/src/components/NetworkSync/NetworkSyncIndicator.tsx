/**
 * Network Sync Status Indicator
 * Shows connection status in the sidebar/header
 */

import React, { useState } from 'react';
import { Server, Monitor, Wifi, WifiOff, Users, Settings } from 'lucide-react';
import { useNetworkSyncStore } from '@core/stores';
import { NetworkSyncSetup } from './NetworkSyncSetup';
import styles from './NetworkSyncIndicator.module.css';

export const NetworkSyncIndicator: React.FC = () => {
    const {
        mode,
        serverRunning,
        serverIps,
        connectedClients,
        clientConnected,
        serverAddress,
        pendingChanges
    } = useNetworkSyncStore();

    const [showSetup, setShowSetup] = useState(false);

    if (mode === 'standalone') {
        return (
            <>
                <button
                    className={styles.indicator}
                    onClick={() => setShowSetup(true)}
                    title="Configurer la synchronisation réseau"
                >
                    <WifiOff size={16} className={styles.iconOffline} />
                    <span className={styles.label}>Mode Local</span>
                    <Settings size={14} className={styles.settingsIcon} />
                </button>
                <NetworkSyncSetup isOpen={showSetup} onClose={() => setShowSetup(false)} />
            </>
        );
    }

    if (mode === 'server') {
        return (
            <>
                <button
                    className={`${styles.indicator} ${serverRunning ? styles.online : styles.offline}`}
                    onClick={() => setShowSetup(true)}
                    title={serverRunning ? `Serveur actif sur ${serverIps[0] || 'localhost'}` : 'Serveur inactif'}
                >
                    <Server size={16} />
                    <span className={styles.label}>
                        {serverRunning ? 'Serveur' : 'Serveur (Arrêté)'}
                    </span>
                    {serverRunning && connectedClients.length > 0 && (
                        <span className={styles.badge}>
                            <Users size={12} />
                            {connectedClients.length}
                        </span>
                    )}
                </button>
                <NetworkSyncSetup isOpen={showSetup} onClose={() => setShowSetup(false)} />
            </>
        );
    }

    if (mode === 'client') {
        return (
            <>
                <button
                    className={`${styles.indicator} ${clientConnected ? styles.online : styles.offline}`}
                    onClick={() => setShowSetup(true)}
                    title={clientConnected ? `Connecté à ${serverAddress}` : 'Déconnecté du serveur'}
                >
                    {clientConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
                    <span className={styles.label}>
                        {clientConnected ? 'Connecté' : 'Déconnecté'}
                    </span>
                    {pendingChanges > 0 && (
                        <span className={`${styles.badge} ${styles.warning}`}>
                            {pendingChanges}
                        </span>
                    )}
                </button>
                <NetworkSyncSetup isOpen={showSetup} onClose={() => setShowSetup(false)} />
            </>
        );
    }

    return null;
};

export default NetworkSyncIndicator;

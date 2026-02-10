/**
 * Network Sync Setup Modal
 * Allows users to configure their PC as a server (main) or client (cashier)
 */

import React, { useState, useEffect } from 'react';
import {
    Server,
    Monitor,
    Wifi,
    WifiOff,
    Check,
    X,
    RefreshCw,
    Copy,
    Users,
    Clock
} from 'lucide-react';
import { useNetworkSyncStore } from '@asgard/shared/stores';
import styles from './NetworkSyncSetup.module.css';

interface NetworkSyncSetupProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NetworkSyncSetup: React.FC<NetworkSyncSetupProps> = ({ isOpen, onClose }) => {
    const {
        mode,
        serverRunning,
        serverPort,
        serverIps,
        connectedClients,
        clientConnected,
        serverAddress,
        lastSyncTime,
        pendingChanges,
        connectionError,
        setMode,
        connectToServer,
        disconnectFromServer
    } = useNetworkSyncStore();

    const [step, setStep] = useState<'choose' | 'server' | 'client'>('choose');
    const [clientServerIp, setClientServerIp] = useState('');
    const [clientServerPort, setClientServerPort] = useState('9876');
    const [isConnecting, setIsConnecting] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (mode === 'server') setStep('server');
        else if (mode === 'client') setStep('client');
        else setStep('choose');
    }, [mode]);

    const handleStartServer = async () => {
        try {
            // Use electronAPI to start the sync server
            // @ts-expect-error - electronAPI is exposed via preload
            const result = await window.electronAPI?.startSyncServer(parseInt(clientServerPort) || 9876);

            if (result?.success) {
                setMode('server');
                // Update server status in store
                useNetworkSyncStore.getState().setServerStatus(
                    result.running ?? true,
                    result.port ?? (parseInt(clientServerPort) || 9876),
                    result.ips ?? []
                );
                setStep('server');
            } else {
                console.error('Failed to start server:', result?.error);
            }
        } catch (error) {
            console.error('Failed to start server:', error);
        }
    };

    const handleStopServer = async () => {
        try {
            // @ts-expect-error - electronAPI is exposed via preload
            const result = await window.electronAPI?.stopSyncServer();

            if (result?.success) {
                setMode('standalone');
                useNetworkSyncStore.getState().setServerStatus(false, 9876, []);
                setStep('choose');
            }
        } catch (error) {
            console.error('Failed to stop server:', error);
        }
    };

    const handleConnectClient = async () => {
        if (!clientServerIp) return;

        setIsConnecting(true);
        try {
            const success = await connectToServer(clientServerIp, parseInt(clientServerPort) || 9876);
            if (success) {
                setStep('client');
            }
        } finally {
            setIsConnecting(false);
        }
    };

    const handleDisconnectClient = () => {
        disconnectFromServer();
        setStep('choose');
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatTime = (timestamp: number | null) => {
        if (!timestamp) return 'Jamais';
        return new Date(timestamp).toLocaleTimeString('fr-FR');
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Configuration Réseau</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {step === 'choose' && (
                    <div className={styles.content}>
                        <p className={styles.description}>
                            Choisissez le rôle de cet ordinateur dans votre réseau local.
                        </p>

                        <div className={styles.options}>
                            <button
                                className={styles.optionCard}
                                onClick={() => setStep('server')}
                            >
                                <div className={styles.optionIcon}>
                                    <Server size={32} />
                                </div>
                                <div className={styles.optionInfo}>
                                    <h3>Serveur Principal</h3>
                                    <p>Cet ordinateur hébergera la base de données centrale. Les autres postes s'y connecteront.</p>
                                </div>
                                <div className={styles.optionBadge}>Recommandé pour PC Admin</div>
                            </button>

                            <button
                                className={styles.optionCard}
                                onClick={() => setStep('client')}
                            >
                                <div className={styles.optionIcon}>
                                    <Monitor size={32} />
                                </div>
                                <div className={styles.optionInfo}>
                                    <h3>Poste Client</h3>
                                    <p>Cet ordinateur se connectera au serveur principal pour synchroniser les données.</p>
                                </div>
                                <div className={styles.optionBadge}>Recommandé pour Caisse</div>
                            </button>
                        </div>
                    </div>
                )}

                {step === 'server' && (
                    <div className={styles.content}>
                        <div className={styles.statusHeader}>
                            <div className={`${styles.statusIndicator} ${serverRunning ? styles.online : styles.offline}`}>
                                {serverRunning ? <Wifi size={20} /> : <WifiOff size={20} />}
                                <span>{serverRunning ? 'Serveur Actif' : 'Serveur Inactif'}</span>
                            </div>
                        </div>

                        {!serverRunning ? (
                            <>
                                <div className={styles.inputGroup}>
                                    <label>Port du serveur</label>
                                    <input
                                        type="number"
                                        value={clientServerPort}
                                        onChange={(e) => setClientServerPort(e.target.value)}
                                        placeholder="9876"
                                    />
                                </div>

                                <button className={styles.primaryBtn} onClick={handleStartServer}>
                                    <Server size={18} />
                                    Démarrer le Serveur
                                </button>
                            </>
                        ) : (
                            <>
                                <div className={styles.serverInfo}>
                                    <div className={styles.infoCard}>
                                        <h4>Adresses IP du Serveur</h4>
                                        <p className={styles.hint}>Utilisez l'une de ces adresses pour connecter les caisses</p>
                                        <div className={styles.ipList}>
                                            {serverIps.length > 0 ? serverIps.map((ip, i) => (
                                                <div key={i} className={styles.ipItem}>
                                                    <code>{ip}:{serverPort}</code>
                                                    <button
                                                        className={styles.copyBtn}
                                                        onClick={() => copyToClipboard(`${ip}:${serverPort}`)}
                                                    >
                                                        {copied ? <Check size={14} /> : <Copy size={14} />}
                                                    </button>
                                                </div>
                                            )) : (
                                                <div className={styles.ipItem}>
                                                    <code>localhost:{serverPort}</code>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.infoCard}>
                                        <h4>
                                            <Users size={16} />
                                            Clients Connectés
                                        </h4>
                                        <div className={styles.clientCount}>
                                            {connectedClients.length}
                                        </div>
                                        {connectedClients.length > 0 && (
                                            <div className={styles.clientList}>
                                                {connectedClients.map(client => (
                                                    <div key={client.id} className={styles.clientItem}>
                                                        <Monitor size={14} />
                                                        <span>{client.name || 'Caisse'}</span>
                                                        <span className={styles.clientTime}>
                                                            {formatTime(client.connectedAt)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button className={styles.dangerBtn} onClick={handleStopServer}>
                                    <X size={18} />
                                    Arrêter le Serveur
                                </button>
                            </>
                        )}

                        <button className={styles.backBtn} onClick={() => setStep('choose')}>
                            ← Retour
                        </button>
                    </div>
                )}

                {step === 'client' && (
                    <div className={styles.content}>
                        <div className={styles.statusHeader}>
                            <div className={`${styles.statusIndicator} ${clientConnected ? styles.online : styles.offline}`}>
                                {clientConnected ? <Wifi size={20} /> : <WifiOff size={20} />}
                                <span>{clientConnected ? 'Connecté' : 'Déconnecté'}</span>
                            </div>
                        </div>

                        {!clientConnected ? (
                            <>
                                <div className={styles.inputGroup}>
                                    <label>Adresse IP du Serveur</label>
                                    <input
                                        type="text"
                                        value={clientServerIp}
                                        onChange={(e) => setClientServerIp(e.target.value)}
                                        placeholder="192.168.1.100"
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Port</label>
                                    <input
                                        type="number"
                                        value={clientServerPort}
                                        onChange={(e) => setClientServerPort(e.target.value)}
                                        placeholder="9876"
                                    />
                                </div>

                                {connectionError && (
                                    <div className={styles.error}>
                                        <X size={16} />
                                        {connectionError}
                                    </div>
                                )}

                                <button
                                    className={styles.primaryBtn}
                                    onClick={handleConnectClient}
                                    disabled={isConnecting || !clientServerIp}
                                >
                                    {isConnecting ? (
                                        <>
                                            <RefreshCw size={18} className={styles.spin} />
                                            Connexion...
                                        </>
                                    ) : (
                                        <>
                                            <Wifi size={18} />
                                            Se Connecter
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            <>
                                <div className={styles.serverInfo}>
                                    <div className={styles.infoCard}>
                                        <h4>Serveur</h4>
                                        <code>{serverAddress}</code>
                                    </div>

                                    <div className={styles.infoCard}>
                                        <h4>
                                            <Clock size={16} />
                                            Dernière Sync
                                        </h4>
                                        <div className={styles.syncTime}>
                                            {formatTime(lastSyncTime)}
                                        </div>
                                    </div>

                                    {pendingChanges > 0 && (
                                        <div className={styles.infoCard + ' ' + styles.warning}>
                                            <h4>Modifications en attente</h4>
                                            <div className={styles.pendingCount}>
                                                {pendingChanges}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button className={styles.dangerBtn} onClick={handleDisconnectClient}>
                                    <WifiOff size={18} />
                                    Déconnecter
                                </button>
                            </>
                        )}

                        <button className={styles.backBtn} onClick={() => setStep('choose')}>
                            ← Retour
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NetworkSyncSetup;

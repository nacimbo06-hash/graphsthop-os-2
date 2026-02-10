import React, { useState, useRef, useEffect } from 'react';
import {
    Settings as SettingsIcon,
    Store,
    Printer,
    Bell,
    Shield,
    Database,
    Palette,
    RotateCcw,
    ChevronRight,
    Check,
    AlertTriangle,
    Cloud,
    Mail,
    Phone,
    MapPin,
    Building,
    Calculator,
    Clock,
    Calendar,
    Download,
    Upload,
    Trash2,
    Sun,
    Moon,
    Monitor,
    Globe,
    Info,
    Wifi,
    WifiOff,
    Server,
    Users,
    RefreshCw,
    Copy,
    X,
} from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { useToast } from '../../components/feedback/Toast';
import { ConfirmModal } from '../../components/feedback/ConfirmModal';
import { useNetworkSyncStore } from '@asgard/shared/stores';
import styles from './Settings.module.css';

// Helper component for debounced inputs
const SettingInput: React.FC<{
    value: string | number;
    onChange: (val: string) => void;
    type?: string;
    placeholder?: string;
    onSave?: () => void;
    [key: string]: any;
}> = ({ value: initialValue, onChange, type = 'text', onSave, ...props }) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => setValue(initialValue), [initialValue]);

    const handleBlur = () => {
        if (value !== initialValue) {
            onChange(value.toString());
            onSave?.();
        }
    };

    return (
        <input
            type={type}
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={e => e.key === 'Enter' && handleBlur()}
            {...props}
        />
    );
};

// Network Settings Tab Component
const NetworkSettingsTab: React.FC<{ showSaveConfirmation: () => void }> = ({ showSaveConfirmation }) => {
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
        disconnectFromServer,
        setServerStatus,
    } = useNetworkSyncStore();

    const [serverPortInput, setServerPortInput] = useState('9876');
    const [clientServerIp, setClientServerIp] = useState('');
    const [clientServerPort, setClientServerPort] = useState('9876');
    const [isConnecting, setIsConnecting] = useState(false);
    const [copied, setCopied] = useState(false);
    const toast = useToast();

    const handleStartServer = async () => {
        try {
            // @ts-expect-error - electronAPI is exposed via preload
            const result = await window.electronAPI?.startSyncServer(parseInt(serverPortInput) || 9876);
            if (result?.success) {
                setMode('server');
                setServerStatus(result.running ?? true, result.port ?? 9876, result.ips ?? []);
                toast.success('Serveur de synchronisation démarré');
                showSaveConfirmation();
            } else {
                toast.error('Erreur: ' + (result?.error || 'Impossible de démarrer le serveur'));
            }
        } catch (error) {
            toast.error('Erreur lors du démarrage du serveur');
        }
    };

    const handleStopServer = async () => {
        try {
            // @ts-expect-error - electronAPI is exposed via preload
            const result = await window.electronAPI?.stopSyncServer();
            if (result?.success) {
                setMode('standalone');
                setServerStatus(false, 9876, []);
                toast.success('Serveur arrêté');
                showSaveConfirmation();
            }
        } catch (error) {
            toast.error('Erreur lors de l\'arrêt du serveur');
        }
    };

    const handleConnectClient = async () => {
        if (!clientServerIp) {
            toast.error('Veuillez entrer l\'adresse IP du serveur');
            return;
        }
        setIsConnecting(true);
        try {
            const success = await connectToServer(clientServerIp, parseInt(clientServerPort) || 9876);
            if (success) {
                toast.success('Connecté au serveur');
                showSaveConfirmation();
            } else {
                toast.error('Impossible de se connecter au serveur');
            }
        } finally {
            setIsConnecting(false);
        }
    };

    const handleDisconnect = () => {
        disconnectFromServer();
        toast.success('Déconnecté du serveur');
        showSaveConfirmation();
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Adresse copiée');
        setTimeout(() => setCopied(false), 2000);
    };

    const formatTime = (timestamp: number | null) => {
        if (!timestamp) return 'Jamais';
        return new Date(timestamp).toLocaleTimeString('fr-FR');
    };

    return (
        <div className={styles.tabContent}>
            <h2><Wifi size={24} /> RÉSEAU LOCAL</h2>

            {/* Mode Selection */}
            <section className={styles.section}>
                <h3>MODE DE FONCTIONNEMENT</h3>
                <p className={styles.hint} style={{ marginBottom: 'var(--space-4)' }}>
                    Choisissez le rôle de cet ordinateur dans votre réseau local.
                </p>

                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                    {/* Standalone Mode */}
                    <button
                        className={`${styles.backupBtn} ${mode === 'standalone' ? styles.active : ''}`}
                        onClick={() => {
                            if (mode === 'server') handleStopServer();
                            else if (mode === 'client') handleDisconnect();
                            else setMode('standalone');
                        }}
                        style={{ flex: 1, minWidth: 200, padding: 'var(--space-4)', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}
                    >
                        <WifiOff size={24} />
                        <span style={{ fontWeight: 600 }}>MODE LOCAL</span>
                        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Pas de synchronisation</span>
                    </button>

                    {/* Server Mode */}
                    <button
                        className={`${styles.backupBtn} ${mode === 'server' ? styles.active : ''}`}
                        onClick={() => !serverRunning && handleStartServer()}
                        disabled={mode === 'server' && serverRunning}
                        style={{ flex: 1, minWidth: 200, padding: 'var(--space-4)', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}
                    >
                        <Server size={24} />
                        <span style={{ fontWeight: 600 }}>SERVEUR PRINCIPAL</span>
                        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>PC Admin / Windows</span>
                    </button>

                    {/* Client Mode */}
                    <button
                        className={`${styles.backupBtn} ${mode === 'client' ? styles.active : ''}`}
                        onClick={() => setMode('client')}
                        disabled={mode === 'client' && clientConnected}
                        style={{ flex: 1, minWidth: 200, padding: 'var(--space-4)', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}
                    >
                        <Monitor size={24} />
                        <span style={{ fontWeight: 600 }}>POSTE CLIENT</span>
                        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Caisse / Linux</span>
                    </button>
                </div>
            </section>

            {/* Server Configuration */}
            {mode === 'server' && (
                <section className={styles.section}>
                    <h3>
                        <Server size={18} />
                        CONFIGURATION SERVEUR
                    </h3>

                    <div className={styles.syncStatus}>
                        <div className={styles.syncIcon} style={{ background: serverRunning ? 'var(--color-success)' : 'var(--color-error)' }}>
                            {serverRunning ? <Wifi size={24} /> : <WifiOff size={24} />}
                        </div>
                        <div className={styles.syncInfo}>
                            <span className={styles.syncLabel}>STATUT</span>
                            <span className={serverRunning ? styles.synced : ''} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                {serverRunning ? (
                                    <><Check size={16} /> SERVEUR ACTIF</>
                                ) : (
                                    <><X size={16} /> SERVEUR INACTIF</>
                                )}
                            </span>
                        </div>
                    </div>

                    {!serverRunning ? (
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>PORT DU SERVEUR</label>
                                <input
                                    type="number"
                                    value={serverPortInput}
                                    onChange={(e) => setServerPortInput(e.target.value)}
                                    placeholder="9876"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <button className={styles.backupBtn} onClick={handleStartServer} style={{ marginTop: 'var(--space-4)' }}>
                                    <Server size={18} />
                                    DÉMARRER LE SERVEUR
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup + ' ' + styles.fullWidth}>
                                    <label>ADRESSES IP DU SERVEUR</label>
                                    <p className={styles.hint}>Utilisez l'une de ces adresses pour connecter les caisses</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                                        {serverIps.length > 0 ? serverIps.map((ip, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--color-surface)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                                                <code style={{ flex: 1, fontFamily: 'monospace', fontSize: '1rem' }}>{ip}:{serverPort}</code>
                                                <button
                                                    onClick={() => copyToClipboard(`${ip}:${serverPort}`)}
                                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', padding: 'var(--space-1)' }}
                                                >
                                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                                </button>
                                            </div>
                                        )) : (
                                            <code style={{ fontFamily: 'monospace' }}>localhost:{serverPort}</code>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formGrid} style={{ marginTop: 'var(--space-4)' }}>
                                <div className={styles.formGroup}>
                                    <label><Users size={16} /> CLIENTS CONNECTÉS</label>
                                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                                        {connectedClients.length}
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <button className={styles.dangerBtn} onClick={handleStopServer} style={{ marginTop: 'var(--space-2)' }}>
                                        <X size={18} />
                                        ARRÊTER LE SERVEUR
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </section>
            )}

            {/* Client Configuration */}
            {mode === 'client' && (
                <section className={styles.section}>
                    <h3>
                        <Monitor size={18} />
                        CONNEXION CLIENT
                    </h3>

                    <div className={styles.syncStatus}>
                        <div className={styles.syncIcon} style={{ background: clientConnected ? 'var(--color-success)' : 'var(--color-warning)' }}>
                            {clientConnected ? <Wifi size={24} /> : <WifiOff size={24} />}
                        </div>
                        <div className={styles.syncInfo}>
                            <span className={styles.syncLabel}>STATUT</span>
                            <span className={clientConnected ? styles.synced : ''} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                {clientConnected ? (
                                    <><Check size={16} /> CONNECTÉ À {serverAddress}</>
                                ) : (
                                    <><WifiOff size={16} /> DÉCONNECTÉ</>
                                )}
                            </span>
                        </div>
                    </div>

                    {!clientConnected ? (
                        <>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>ADRESSE IP DU SERVEUR</label>
                                    <input
                                        type="text"
                                        value={clientServerIp}
                                        onChange={(e) => setClientServerIp(e.target.value)}
                                        placeholder="192.168.1.100"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>PORT</label>
                                    <input
                                        type="number"
                                        value={clientServerPort}
                                        onChange={(e) => setClientServerPort(e.target.value)}
                                        placeholder="9876"
                                    />
                                </div>
                            </div>

                            {connectionError && (
                                <div style={{ color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
                                    <AlertTriangle size={16} />
                                    {connectionError}
                                </div>
                            )}

                            <button
                                className={styles.backupBtn}
                                onClick={handleConnectClient}
                                disabled={isConnecting || !clientServerIp}
                                style={{ marginTop: 'var(--space-4)' }}
                            >
                                {isConnecting ? (
                                    <><RefreshCw size={18} className={styles.spin} /> CONNEXION...</>
                                ) : (
                                    <><Wifi size={18} /> SE CONNECTER</>
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            <div className={styles.formGrid} style={{ marginTop: 'var(--space-4)' }}>
                                <div className={styles.formGroup}>
                                    <label><Clock size={16} /> DERNIÈRE SYNCHRONISATION</label>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                                        {formatTime(lastSyncTime)}
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>MODIFICATIONS EN ATTENTE</label>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 600, color: pendingChanges > 0 ? 'var(--color-warning)' : 'var(--color-success)' }}>
                                        {pendingChanges}
                                    </div>
                                </div>
                            </div>

                            <button className={styles.dangerBtn} onClick={handleDisconnect} style={{ marginTop: 'var(--space-4)' }}>
                                <WifiOff size={18} />
                                SE DÉCONNECTER
                            </button>
                        </>
                    )}
                </section>
            )}

            {/* Info Section */}
            <section className={styles.section}>
                <h3><Info size={18} /> INFORMATIONS</h3>
                <p className={styles.hint}>
                    💡 <strong>Serveur Principal:</strong> Installez sur le PC Windows admin. C'est lui qui stocke la base de données centrale.
                </p>
                <p className={styles.hint} style={{ marginTop: 'var(--space-2)' }}>
                    💡 <strong>Poste Client:</strong> Installez sur les caisses (AntiX Linux, Windows). Elles se synchronisent automatiquement avec le serveur.
                </p>
                <p className={styles.hint} style={{ marginTop: 'var(--space-2)' }}>
                    💡 <strong>Collections synchroisées:</strong> Produits, Ventes, Clients, Fournisseurs, Stock, Trésorerie
                </p>
            </section>
        </div>
    );
};

type SettingsTab = 'store' | 'print' | 'pos' | 'notifications' | 'security' | 'backup' | 'appearance' | 'network';

export const Settings: React.FC = () => {
    const {
        settings,
        updateStoreSettings,
        updatePrintSettings,
        updatePOSSettings,
        updateNotificationSettings,
        updateSecuritySettings,
        updateAppearanceSettings,
        resetToDefaults,
        exportSettings,
        importSettings,
    } = useSettings();

    const [activeTab, setActiveTab] = useState<SettingsTab>('store');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showClearDataConfirm, setShowClearDataConfirm] = useState(false);
    const [showFinalClearConfirm, setShowFinalClearConfirm] = useState(false);

    // Show save confirmation
    const showSaveConfirmation = () => {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
    };

    // Handle reset
    const handleReset = () => {
        setShowResetConfirm(true);
    };

    const confirmReset = () => {
        resetToDefaults();
        showSaveConfirmation();
        setShowResetConfirm(false);
        toast.success('Paramètres réinitialisés par défaut');
    };

    // Handle export
    const handleExport = () => {
        const json = exportSettings();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bonilo-settings-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Handle import
    const handleImport = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = event.target?.result as string;
                const success = importSettings(json);
                if (success) {
                    toast.success('Paramètres importés avec succès!');
                    showSaveConfirmation();
                } else {
                    toast.error('Erreur lors de l\'importation des paramètres');
                }
            } catch (error) {
                toast.error('Fichier invalide');
            }
        };
        reader.readAsText(file);

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle clear all data
    const handleClearData = () => {
        setShowClearDataConfirm(true);
    };

    const confirmFirstClear = () => {
        setShowClearDataConfirm(false);
        setShowFinalClearConfirm(true);
    };

    const confirmFinalClear = () => {
        localStorage.clear();
        window.location.reload();
    };

    const tabs = [
        { id: 'store' as const, label: 'MAGASIN', icon: <Store size={20} /> },
        { id: 'print' as const, label: 'IMPRESSION', icon: <Printer size={20} /> },
        { id: 'pos' as const, label: 'CAISSE', icon: <Calculator size={20} /> },
        { id: 'notifications' as const, label: 'ALERTES', icon: <Bell size={20} /> },
        { id: 'security' as const, label: 'SÉCURITÉ', icon: <Shield size={20} /> },
        { id: 'backup' as const, label: 'SAUVEGARDE', icon: <Database size={20} /> },
        { id: 'network' as const, label: 'RÉSEAU', icon: <Wifi size={20} /> },
        { id: 'appearance' as const, label: 'APPARENCE', icon: <Palette size={20} /> },
    ];

    return (
        <div className={styles.settings}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <SettingsIcon size={28} />
                    <div>
                        <h1>PARAMÈTRES</h1>
                        <p>Configuration de l'application</p>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    {saveStatus === 'saved' && (
                        <span className={styles.savedBadge}>
                            <Check size={14} />
                            SAUVEGARDÉ AUTOMATIQUEMENT
                        </span>
                    )}
                    <button className={styles.resetBtn} onClick={handleReset}>
                        <RotateCcw size={18} />
                        RÉINITIALISER
                    </button>
                </div>
            </header>

            <div className={styles.content}>
                {/* Sidebar */}
                <nav className={styles.sidebar}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                            <ChevronRight size={16} />
                        </button>
                    ))}
                </nav>

                {/* Main Content */}
                <main className={styles.main}>
                    {/* STORE SETTINGS */}
                    {activeTab === 'store' && (
                        <div className={styles.tabContent}>
                            <h2><Store size={24} /> INFORMATIONS DU MAGASIN</h2>

                            <section className={styles.section}>
                                <h3>IDENTITÉ</h3>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label><Building size={16} /> NOM DU MAGASIN</label>
                                        <SettingInput
                                            value={settings.store.name}
                                            onChange={val => updateStoreSettings({ name: val })}
                                            onSave={showSaveConfirmation}
                                            placeholder="Nom du magasin"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label><MapPin size={16} /> ADRESSE</label>
                                        <SettingInput
                                            value={settings.store.address}
                                            onChange={val => updateStoreSettings({ address: val })}
                                            onSave={showSaveConfirmation}
                                            placeholder="Adresse"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label><MapPin size={16} /> VILLE</label>
                                        <SettingInput
                                            value={settings.store.city}
                                            onChange={val => updateStoreSettings({ city: val })}
                                            onSave={showSaveConfirmation}
                                            placeholder="Ville"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label><Phone size={16} /> TÉLÉPHONE</label>
                                        <SettingInput
                                            type="tel"
                                            value={settings.store.phone}
                                            onChange={val => updateStoreSettings({ phone: val })}
                                            onSave={showSaveConfirmation}
                                            placeholder="Téléphone"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label><Mail size={16} /> EMAIL</label>
                                        <SettingInput
                                            type="email"
                                            value={settings.store.email}
                                            onChange={val => updateStoreSettings({ email: val })}
                                            onSave={showSaveConfirmation}
                                            placeholder="Email"
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className={styles.section}>
                                <h3>INFORMATIONS FISCALES</h3>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label>NIF (NUMÉRO D'IDENTIFICATION FISCALE)</label>
                                        <SettingInput
                                            value={settings.store.nif}
                                            onChange={val => updateStoreSettings({ nif: val })}
                                            onSave={showSaveConfirmation}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>NIS (NUMÉRO D'IDENTIFICATION STATISTIQUE)</label>
                                        <SettingInput
                                            value={settings.store.nis}
                                            onChange={val => updateStoreSettings({ nis: val })}
                                            onSave={showSaveConfirmation}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>RC (REGISTRE DE COMMERCE)</label>
                                        <SettingInput
                                            value={settings.store.rc}
                                            onChange={val => updateStoreSettings({ rc: val })}
                                            onSave={showSaveConfirmation}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>AI (ARTICLE D'IMPOSITION)</label>
                                        <SettingInput
                                            value={settings.store.ai}
                                            onChange={val => updateStoreSettings({ ai: val })}
                                            onSave={showSaveConfirmation}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className={styles.section}>
                                <h3>TVA (TAXE SUR LA VALEUR AJOUTÉE)</h3>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.toggle}>
                                            <input
                                                type="checkbox"
                                                checked={settings.store.tvaEnabled}
                                                onChange={e => {
                                                    updateStoreSettings({ tvaEnabled: e.target.checked });
                                                    showSaveConfirmation();
                                                }}
                                            />
                                            <span className={styles.toggleSlider}></span>
                                            TVA ACTIVÉE
                                        </label>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>TAUX DE TVA (%)</label>
                                        <select
                                            value={settings.store.tvaRate}
                                            onChange={e => {
                                                updateStoreSettings({ tvaRate: parseInt(e.target.value) });
                                                showSaveConfirmation();
                                            }}
                                            disabled={!settings.store.tvaEnabled}
                                        >
                                            <option value={0}>0% (EXONÉRÉ)</option>
                                            <option value={9}>9% (TAUX RÉDUIT)</option>
                                            <option value={19}>19% (TAUX NORMAL)</option>
                                        </select>
                                    </div>
                                </div>
                                <p className={styles.hint} style={{ marginTop: 'var(--space-3)' }}>
                                    💡 En Algérie, le taux normal de TVA est de 19%. Le taux réduit de 9% s'applique à certains produits de base.
                                </p>
                            </section>
                        </div>
                    )}

                    {/* PRINT SETTINGS */}
                    {activeTab === 'print' && (
                        <div className={styles.tabContent}>
                            <h2><Printer size={24} /> PARAMÈTRES D'IMPRESSION</h2>

                            <section className={styles.section}>
                                <h3>TICKET DE CAISSE</h3>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label>LARGEUR DU PAPIER</label>
                                        <div className={styles.radioGroup}>
                                            <label className={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    checked={settings.print.receiptWidth === 58}
                                                    onChange={() => {
                                                        updatePrintSettings({ receiptWidth: 58 });
                                                        showSaveConfirmation();
                                                    }}
                                                />
                                                58mm
                                            </label>
                                            <label className={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    checked={settings.print.receiptWidth === 80}
                                                    onChange={() => {
                                                        updatePrintSettings({ receiptWidth: 80 });
                                                        showSaveConfirmation();
                                                    }}
                                                />
                                                80mm
                                            </label>
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>NOMBRE DE COPIES</label>
                                        <SettingInput
                                            type="number"
                                            min="1"
                                            max="5"
                                            value={settings.print.printCopy}
                                            onChange={val => updatePrintSettings({ printCopy: parseInt(val) || 1 })}
                                            onSave={showSaveConfirmation}
                                        />
                                    </div>
                                    <div className={styles.formGroup + ' ' + styles.fullWidth}>
                                        <label>TEXTE DE PIED DE PAGE</label>
                                        <SettingInput
                                            value={settings.print.footerText}
                                            onChange={val => updatePrintSettings({ footerText: val })}
                                            onSave={showSaveConfirmation}
                                            placeholder="Message de fin de ticket"
                                        />
                                    </div>
                                </div>

                                <div className={styles.toggleGrid}>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            checked={settings.print.showBarcode}
                                            onChange={e => {
                                                updatePrintSettings({ showBarcode: e.target.checked });
                                                showSaveConfirmation();
                                            }}
                                        />
                                        <span className={styles.toggleSlider}></span>
                                        AFFICHER CODE-BARRES
                                    </label>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            checked={settings.print.showQRCode}
                                            onChange={e => {
                                                updatePrintSettings({ showQRCode: e.target.checked });
                                                showSaveConfirmation();
                                            }}
                                        />
                                        <span className={styles.toggleSlider}></span>
                                        AFFICHER QR CODE
                                    </label>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            checked={settings.print.autoPrint}
                                            onChange={e => {
                                                updatePrintSettings({ autoPrint: e.target.checked });
                                                showSaveConfirmation();
                                            }}
                                        />
                                        <span className={styles.toggleSlider}></span>
                                        IMPRESSION AUTOMATIQUE
                                    </label>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            checked={settings.print.openDrawer}
                                            onChange={e => {
                                                updatePrintSettings({ openDrawer: e.target.checked });
                                                showSaveConfirmation();
                                            }}
                                        />
                                        <span className={styles.toggleSlider}></span>
                                        OUVRIR TIROIR-CAISSE
                                    </label>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* POS SETTINGS */}
                    {activeTab === 'pos' && (
                        <div className={styles.tabContent}>
                            <h2><Calculator size={24} /> PARAMÈTRES DE CAISSE</h2>

                            <section className={styles.section}>
                                <h3>COMPORTEMENT</h3>
                                <div className={styles.toggleGrid}>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            checked={settings.pos.quickCheckout}
                                            onChange={e => {
                                                updatePOSSettings({ quickCheckout: e.target.checked });
                                                showSaveConfirmation();
                                            }}
                                        />
                                        <span className={styles.toggleSlider}></span>
                                        ENCAISSEMENT RAPIDE
                                    </label>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            checked={settings.pos.requireCustomer}
                                            onChange={e => {
                                                updatePOSSettings({ requireCustomer: e.target.checked });
                                                showSaveConfirmation();
                                            }}
                                        />
                                        <span className={styles.toggleSlider}></span>
                                        CLIENT OBLIGATOIRE
                                    </label>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            checked={settings.pos.allowDiscount}
                                            onChange={e => {
                                                updatePOSSettings({ allowDiscount: e.target.checked });
                                                showSaveConfirmation();
                                            }}
                                        />
                                        <span className={styles.toggleSlider}></span>
                                        AUTORISER LES REMISES
                                    </label>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            checked={settings.pos.allowNegativeStock}
                                            onChange={e => {
                                                updatePOSSettings({ allowNegativeStock: e.target.checked });
                                                showSaveConfirmation();
                                            }}
                                        />
                                        <span className={styles.toggleSlider}></span>
                                        AUTORISER STOCK NÉGATIF
                                    </label>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            checked={settings.pos.soundEnabled}
                                            onChange={e => {
                                                updatePOSSettings({ soundEnabled: e.target.checked });
                                                showSaveConfirmation();
                                            }}
                                        />
                                        <span className={styles.toggleSlider}></span>
                                        SONS ACTIVÉS
                                    </label>
                                </div>

                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label>REMISE MAXIMUM (%)</label>
                                        <SettingInput
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={settings.pos.maxDiscount}
                                            onChange={val => updatePOSSettings({ maxDiscount: parseInt(val) || 0 })}
                                            onSave={showSaveConfirmation}
                                            disabled={!settings.pos.allowDiscount}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>DÉCONNEXION AUTO (MINUTES)</label>
                                        <SettingInput
                                            type="number"
                                            min="0"
                                            max="120"
                                            value={settings.pos.autoLogout}
                                            onChange={val => updatePOSSettings({ autoLogout: parseInt(val) || 0 })}
                                            onSave={showSaveConfirmation}
                                        />
                                        <span className={styles.hint}>0 = Désactivé</span>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>MÉTHODE DE PAIEMENT PAR DÉFAUT</label>
                                        <select
                                            value={settings.pos.defaultPaymentMethod}
                                            onChange={e => {
                                                updatePOSSettings({ defaultPaymentMethod: e.target.value });
                                                showSaveConfirmation();
                                            }}
                                        >
                                            <option value="cash">ESPÈCES</option>
                                            <option value="card">CARTE BANCAIRE</option>
                                            <option value="edahabia">EDAHABIA</option>
                                            <option value="ccp">CCP</option>
                                        </select>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* NOTIFICATION SETTINGS */}
                    {activeTab === 'notifications' && (
                        <div className={styles.tabContent}>
                            <h2><Bell size={24} /> ALERTES ET NOTIFICATIONS</h2>

                            <section className={styles.section}>
                                <h3>ALERTES STOCK</h3>
                                <div className={styles.alertRow}>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.lowStockAlert}
                                            onChange={e => {
                                                updateNotificationSettings({ lowStockAlert: e.target.checked });
                                                showSaveConfirmation();
                                            }}
                                        />
                                        <span className={styles.toggleSlider}></span>
                                        ALERTE STOCK BAS
                                    </label>
                                    <div className={styles.formGroup + ' ' + styles.inline}>
                                        <label>SEUIL</label>
                                        <SettingInput
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={settings.notifications.lowStockThreshold}
                                            onChange={val => updateNotificationSettings({ lowStockThreshold: parseInt(val) || 10 })}
                                            onSave={showSaveConfirmation}
                                            disabled={!settings.notifications.lowStockAlert}
                                        />
                                        <span>UNITÉS</span>
                                    </div>
                                </div>
                            </section>

                            <section className={styles.section}>
                                <h3>ALERTES EXPIRATION</h3>
                                <div className={styles.alertRow}>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.expiryAlert}
                                            onChange={e => {
                                                updateNotificationSettings({ expiryAlert: e.target.checked });
                                                showSaveConfirmation();
                                            }}
                                        />
                                        <span className={styles.toggleSlider}></span>
                                        ALERTE PRODUITS PROCHES EXPIRATION
                                    </label>
                                    <div className={styles.formGroup + ' ' + styles.inline}>
                                        <label>PRÉAVIS</label>
                                        <SettingInput
                                            type="number"
                                            min="1"
                                            max="90"
                                            value={settings.notifications.expiryDaysWarning}
                                            onChange={val => updateNotificationSettings({ expiryDaysWarning: parseInt(val) || 7 })}
                                            onSave={showSaveConfirmation}
                                            disabled={!settings.notifications.expiryAlert}
                                        />
                                        <span>JOURS</span>
                                    </div>
                                </div>
                            </section>

                            <section className={styles.section}>
                                <h3>NOTIFICATIONS</h3>
                                <div className={styles.toggleGrid}>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.dailyReport}
                                            onChange={e => {
                                                updateNotificationSettings({ dailyReport: e.target.checked });
                                                showSaveConfirmation();
                                            }}
                                        />
                                        <span className={styles.toggleSlider}></span>
                                        RAPPORT JOURNALIER
                                    </label>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.emailNotifications}
                                            onChange={e => {
                                                updateNotificationSettings({ emailNotifications: e.target.checked });
                                                showSaveConfirmation();
                                            }}
                                        />
                                        <span className={styles.toggleSlider}></span>
                                        NOTIFICATIONS EMAIL
                                    </label>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.soundNotifications}
                                            onChange={e => {
                                                updateNotificationSettings({ soundNotifications: e.target.checked });
                                                showSaveConfirmation();
                                            }}
                                        />
                                        <span className={styles.toggleSlider}></span>
                                        NOTIFICATIONS SONORES
                                    </label>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* SECURITY SETTINGS */}
                    {activeTab === 'security' && (
                        <div className={styles.tabContent}>
                            <h2><Shield size={24} /> SÉCURITÉ</h2>

                            <section className={styles.section}>
                                <h3>AUTHENTIFICATION</h3>
                                <div className={styles.toggleGrid}>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            checked={settings.security.requirePin}
                                            onChange={e => {
                                                updateSecuritySettings({ requirePin: e.target.checked });
                                                showSaveConfirmation();
                                            }}
                                        />
                                        <span className={styles.toggleSlider}></span>
                                        EXIGER CODE PIN
                                    </label>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            checked={settings.security.twoFactorAuth}
                                            onChange={e => {
                                                updateSecuritySettings({ twoFactorAuth: e.target.checked });
                                                showSaveConfirmation();
                                            }}
                                        />
                                        <span className={styles.toggleSlider}></span>
                                        AUTHENTIFICATION À 2 FACTEURS
                                    </label>
                                </div>

                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label>LONGUEUR DU PIN</label>
                                        <select
                                            value={settings.security.pinLength}
                                            onChange={e => {
                                                updateSecuritySettings({ pinLength: parseInt(e.target.value) as 4 | 6 });
                                                showSaveConfirmation();
                                            }}
                                            disabled={!settings.security.requirePin}
                                        >
                                            <option value={4}>4 CHIFFRES</option>
                                            <option value={6}>6 CHIFFRES</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>EXPIRATION SESSION (MINUTES)</label>
                                        <SettingInput
                                            type="number"
                                            min="5"
                                            max="480"
                                            value={settings.security.sessionTimeout}
                                            onChange={val => updateSecuritySettings({ sessionTimeout: parseInt(val) || 60 })}
                                            onSave={showSaveConfirmation}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>VERROUILLAGE APRÈS TENTATIVES</label>
                                        <SettingInput
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={settings.security.lockAfterAttempts}
                                            onChange={val => updateSecuritySettings({ lockAfterAttempts: parseInt(val) || 3 })}
                                            onSave={showSaveConfirmation}
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* BACKUP SETTINGS */}
                    {activeTab === 'backup' && (
                        <div className={styles.tabContent}>
                            <h2><Database size={24} /> SAUVEGARDE ET DONNÉES</h2>

                            <section className={styles.section}>
                                <h3>SAUVEGARDE LOCALE</h3>
                                <div className={styles.backupActions}>
                                    <button className={styles.backupBtn} onClick={handleExport}>
                                        <Download size={20} />
                                        EXPORTER LES PARAMÈTRES
                                    </button>
                                    <button className={styles.backupBtn} onClick={handleImport}>
                                        <Upload size={20} />
                                        IMPORTER LES PARAMÈTRES
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".json"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                                <p className={styles.backupInfo}>
                                    <Info size={16} />
                                    Exportez vos paramètres pour les sauvegarder ou les transférer vers un autre appareil
                                </p>
                            </section>

                            <section className={styles.section}>
                                <h3>SYNCHRONISATION CLOUD</h3>
                                <div className={styles.syncStatus}>
                                    <div className={styles.syncIcon}>
                                        <Cloud size={32} />
                                    </div>
                                    <div className={styles.syncInfo}>
                                        <span className={styles.syncLabel}>STATUT</span>
                                        <span className={styles.syncValue + ' ' + styles.synced}>
                                            <Check size={16} /> SYNCHRONISÉ
                                        </span>
                                    </div>
                                </div>
                            </section>

                            <section className={styles.section}>
                                <h3>DONNÉES</h3>
                                <div className={styles.dangerZone}>
                                    <p><AlertTriangle size={16} /> ZONE DANGEREUSE</p>
                                    <button className={styles.dangerBtn} onClick={handleClearData}>
                                        <Trash2 size={18} />
                                        SUPPRIMER TOUTES LES DONNÉES
                                    </button>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* APPEARANCE SETTINGS */}
                    {activeTab === 'appearance' && (
                        <div className={styles.tabContent}>
                            <h2><Palette size={24} /> APPARENCE</h2>

                            <section className={styles.section}>
                                <h3>THÈME</h3>
                                <div className={styles.themeSelector}>
                                    <button
                                        className={`${styles.themeBtn} ${settings.appearance.theme === 'light' ? styles.active : ''}`}
                                        onClick={() => {
                                            updateAppearanceSettings({ theme: 'light' });
                                            showSaveConfirmation();
                                        }}
                                    >
                                        <Sun size={24} />
                                        <span>CLAIR</span>
                                    </button>
                                    <button
                                        className={`${styles.themeBtn} ${settings.appearance.theme === 'dark' ? styles.active : ''}`}
                                        onClick={() => {
                                            updateAppearanceSettings({ theme: 'dark' });
                                            showSaveConfirmation();
                                        }}
                                    >
                                        <Moon size={24} />
                                        <span>SOMBRE</span>
                                    </button>
                                    <button
                                        className={`${styles.themeBtn} ${settings.appearance.theme === 'system' ? styles.active : ''}`}
                                        onClick={() => {
                                            updateAppearanceSettings({ theme: 'system' });
                                            showSaveConfirmation();
                                        }}
                                    >
                                        <Monitor size={24} />
                                        <span>SYSTÈME</span>
                                    </button>
                                </div>
                            </section>

                            <section className={styles.section}>
                                <h3>LANGUE ET FORMAT</h3>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label><Globe size={16} /> LANGUE</label>
                                        <select
                                            value={settings.appearance.language}
                                            onChange={e => {
                                                updateAppearanceSettings({ language: e.target.value as 'fr' | 'ar' | 'en' });
                                                showSaveConfirmation();
                                            }}
                                        >
                                            <option value="fr">FRANÇAIS</option>
                                            <option value="ar">العربية</option>
                                            <option value="en">ENGLISH</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label><Calendar size={16} /> FORMAT DATE</label>
                                        <select
                                            value={settings.appearance.dateFormat}
                                            onChange={e => {
                                                updateAppearanceSettings({ dateFormat: e.target.value });
                                                showSaveConfirmation();
                                            }}
                                        >
                                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label><Clock size={16} /> FORMAT HEURE</label>
                                        <select
                                            value={settings.appearance.timeFormat}
                                            onChange={e => {
                                                updateAppearanceSettings({ timeFormat: e.target.value as '12h' | '24h' });
                                                showSaveConfirmation();
                                            }}
                                        >
                                            <option value="24h">24H (14:30)</option>
                                            <option value="12h">12H (2:30 PM)</option>
                                        </select>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* NETWORK SETTINGS */}
                    {activeTab === 'network' && (
                        <NetworkSettingsTab showSaveConfirmation={showSaveConfirmation} />
                    )}
                </main>
            </div>

            {/* Reset Confirmation Modal */}
            <ConfirmModal
                isOpen={showResetConfirm}
                title="Réinitialiser les paramètres"
                message="Êtes-vous sûr de vouloir réinitialiser tous les paramètres par défaut ?"
                confirmText="Réinitialiser"
                cancelText="Annuler"
                variant="warning"
                onConfirm={confirmReset}
                onCancel={() => setShowResetConfirm(false)}
            />

            {/* Clear Data First Confirmation Modal */}
            <ConfirmModal
                isOpen={showClearDataConfirm}
                title="⚠️ Supprimer toutes les données"
                message="ATTENTION: Êtes-vous sûr de vouloir supprimer TOUTES les données ? Cette action est IRRÉVERSIBLE !"
                confirmText="Continuer"
                cancelText="Annuler"
                variant="danger"
                onConfirm={confirmFirstClear}
                onCancel={() => setShowClearDataConfirm(false)}
            />

            {/* Clear Data Final Confirmation Modal */}
            <ConfirmModal
                isOpen={showFinalClearConfirm}
                title="Dernière confirmation"
                message="Cette action supprimera tous vos produits, clients, ventes et paramètres. Continuer ?"
                confirmText="Supprimer tout"
                cancelText="Annuler"
                variant="danger"
                onConfirm={confirmFinalClear}
                onCancel={() => setShowFinalClearConfirm(false)}
            />
        </div>
    );
};

export default Settings;

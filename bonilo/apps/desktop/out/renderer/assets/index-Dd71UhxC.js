import { j as jsxRuntimeExports } from "./vendor-state-DFI86SKa.js";
import { r as reactExports } from "./vendor-react-Df__x13C.js";
import { u as useSettings, f as useToast, n as useNetworkSyncStore } from "./index-BbOgUw3k.js";
import { C as ConfirmModal } from "./ConfirmModal-IjhJ8y4D.js";
import { f as Settings$1, c as Check, ai as RotateCcw, h as ChevronRight, aY as Store, aZ as Building, aO as MapPin, aM as Phone, aN as Mail, l as Printer, a_ as Calculator, G as Bell, J as Shield, a$ as Database, ay as Download, y as Upload, I as Info, A as Cloud, T as TriangleAlert, v as Trash2, b0 as Palette, p as Sun, q as Moon, M as Monitor, b1 as Globe, w as Calendar, e as Clock, W as Wifi, b as WifiOff, S as Server, X, d as Copy, U as Users, R as RefreshCw } from "./vendor-ui-DiXyqbDT.js";
import "./vendor-i18n-DeCNyroL.js";
const settings = "_settings_6ks6p_5";
const header = "_header_6ks6p_13";
const headerTitle = "_headerTitle_6ks6p_22";
const headerActions = "_headerActions_6ks6p_41";
const savedBadge = "_savedBadge_6ks6p_60";
const resetBtn = "_resetBtn_6ks6p_87";
const content = "_content_6ks6p_128";
const sidebar = "_sidebar_6ks6p_135";
const tabBtn = "_tabBtn_6ks6p_145";
const active = "_active_6ks6p_170";
const main = "_main_6ks6p_184";
const tabContent = "_tabContent_6ks6p_190";
const section = "_section_6ks6p_202";
const formGrid = "_formGrid_6ks6p_219";
const formGroup = "_formGroup_6ks6p_225";
const fullWidth = "_fullWidth_6ks6p_231";
const inline = "_inline_6ks6p_235";
const hint = "_hint_6ks6p_288";
const radioGroup = "_radioGroup_6ks6p_294";
const radioLabel = "_radioLabel_6ks6p_299";
const toggleGrid = "_toggleGrid_6ks6p_316";
const toggle = "_toggle_6ks6p_316";
const toggleSlider = "_toggleSlider_6ks6p_345";
const alertRow = "_alertRow_6ks6p_376";
const themeSelector = "_themeSelector_6ks6p_387";
const themeBtn = "_themeBtn_6ks6p_392";
const backupActions = "_backupActions_6ks6p_421";
const backupBtn = "_backupBtn_6ks6p_427";
const backupInfo = "_backupInfo_6ks6p_446";
const syncStatus = "_syncStatus_6ks6p_455";
const syncIcon = "_syncIcon_6ks6p_464";
const syncInfo = "_syncInfo_6ks6p_475";
const syncLabel = "_syncLabel_6ks6p_481";
const syncValue = "_syncValue_6ks6p_488";
const synced = "_synced_6ks6p_496";
const dangerZone = "_dangerZone_6ks6p_501";
const dangerBtn = "_dangerBtn_6ks6p_518";
const spin = "_spin_6ks6p_548";
const styles = {
  settings,
  header,
  headerTitle,
  headerActions,
  savedBadge,
  resetBtn,
  content,
  sidebar,
  tabBtn,
  active,
  main,
  tabContent,
  section,
  formGrid,
  formGroup,
  fullWidth,
  inline,
  hint,
  radioGroup,
  radioLabel,
  toggleGrid,
  toggle,
  toggleSlider,
  alertRow,
  themeSelector,
  themeBtn,
  backupActions,
  backupBtn,
  backupInfo,
  syncStatus,
  syncIcon,
  syncInfo,
  syncLabel,
  syncValue,
  synced,
  dangerZone,
  dangerBtn,
  spin
};
const SettingInput = ({ value: initialValue, onChange, type = "text", onSave, ...props }) => {
  const [value, setValue] = reactExports.useState(initialValue);
  reactExports.useEffect(() => setValue(initialValue), [initialValue]);
  const handleBlur = () => {
    if (value !== initialValue) {
      onChange(value.toString());
      onSave?.();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      type,
      value,
      onChange: (e) => setValue(e.target.value),
      onBlur: handleBlur,
      onKeyDown: (e) => e.key === "Enter" && handleBlur(),
      ...props
    }
  );
};
const NetworkSettingsTab = ({ showSaveConfirmation }) => {
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
    setServerStatus
  } = useNetworkSyncStore();
  const [serverPortInput, setServerPortInput] = reactExports.useState("9876");
  const [clientServerIp, setClientServerIp] = reactExports.useState("");
  const [clientServerPort, setClientServerPort] = reactExports.useState("9876");
  const [isConnecting, setIsConnecting] = reactExports.useState(false);
  const [copied, setCopied] = reactExports.useState(false);
  const toast = useToast();
  const handleStartServer = async () => {
    try {
      const result = await window.electronAPI?.startSyncServer(parseInt(serverPortInput) || 9876);
      if (result?.success) {
        setMode("server");
        setServerStatus(result.running ?? true, result.port ?? 9876, result.ips ?? []);
        toast.success("Serveur de synchronisation démarré");
        showSaveConfirmation();
      } else {
        toast.error("Erreur: " + (result?.error || "Impossible de démarrer le serveur"));
      }
    } catch (error) {
      toast.error("Erreur lors du démarrage du serveur");
    }
  };
  const handleStopServer = async () => {
    try {
      const result = await window.electronAPI?.stopSyncServer();
      if (result?.success) {
        setMode("standalone");
        setServerStatus(false, 9876, []);
        toast.success("Serveur arrêté");
        showSaveConfirmation();
      }
    } catch (error) {
      toast.error("Erreur lors de l'arrêt du serveur");
    }
  };
  const handleConnectClient = async () => {
    if (!clientServerIp) {
      toast.error("Veuillez entrer l'adresse IP du serveur");
      return;
    }
    setIsConnecting(true);
    try {
      const success = await connectToServer(clientServerIp, parseInt(clientServerPort) || 9876);
      if (success) {
        toast.success("Connecté au serveur");
        showSaveConfirmation();
      } else {
        toast.error("Impossible de se connecter au serveur");
      }
    } finally {
      setIsConnecting(false);
    }
  };
  const handleDisconnect = () => {
    disconnectFromServer();
    toast.success("Déconnecté du serveur");
    showSaveConfirmation();
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Adresse copiée");
    setTimeout(() => setCopied(false), 2e3);
  };
  const formatTime = (timestamp) => {
    if (!timestamp) return "Jamais";
    return new Date(timestamp).toLocaleTimeString("fr-FR");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.tabContent, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { size: 24 }),
      " RÉSEAU LOCAL"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "MODE DE FONCTIONNEMENT" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles.hint, style: { marginBottom: "var(--space-4)" }, children: "Choisissez le rôle de cet ordinateur dans votre réseau local." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: `${styles.backupBtn} ${mode === "standalone" ? styles.active : ""}`,
            onClick: () => {
              if (mode === "server") handleStopServer();
              else if (mode === "client") handleDisconnect();
              else setMode("standalone");
            },
            style: { flex: 1, minWidth: 200, padding: "var(--space-4)", flexDirection: "column", alignItems: "center", gap: "var(--space-2)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { size: 24 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600 }, children: "MODE LOCAL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.8rem", opacity: 0.7 }, children: "Pas de synchronisation" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: `${styles.backupBtn} ${mode === "server" ? styles.active : ""}`,
            onClick: () => !serverRunning && handleStartServer(),
            disabled: mode === "server" && serverRunning,
            style: { flex: 1, minWidth: 200, padding: "var(--space-4)", flexDirection: "column", alignItems: "center", gap: "var(--space-2)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { size: 24 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600 }, children: "SERVEUR PRINCIPAL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.8rem", opacity: 0.7 }, children: "PC Admin / Windows" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: `${styles.backupBtn} ${mode === "client" ? styles.active : ""}`,
            onClick: () => setMode("client"),
            disabled: mode === "client" && clientConnected,
            style: { flex: 1, minWidth: 200, padding: "var(--space-4)", flexDirection: "column", alignItems: "center", gap: "var(--space-2)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 24 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600 }, children: "POSTE CLIENT" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.8rem", opacity: 0.7 }, children: "Caisse / Linux" })
            ]
          }
        )
      ] })
    ] }),
    mode === "server" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { size: 18 }),
        "CONFIGURATION SERVEUR"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.syncStatus, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.syncIcon, style: { background: serverRunning ? "var(--color-success)" : "var(--color-error)" }, children: serverRunning ? /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { size: 24 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.syncInfo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.syncLabel, children: "STATUT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: serverRunning ? styles.synced : "", style: { display: "flex", alignItems: "center", gap: "var(--space-2)" }, children: serverRunning ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 16 }),
            " SERVEUR ACTIF"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 }),
            " SERVEUR INACTIF"
          ] }) })
        ] })
      ] }),
      !serverRunning ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGrid, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "PORT DU SERVEUR" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              value: serverPortInput,
              onChange: (e) => setServerPortInput(e.target.value),
              placeholder: "9876"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.formGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.backupBtn, onClick: handleStartServer, style: { marginTop: "var(--space-4)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { size: 18 }),
          "DÉMARRER LE SERVEUR"
        ] }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.formGrid, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup + " " + styles.fullWidth, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "ADRESSES IP DU SERVEUR" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles.hint, children: "Utilisez l'une de ces adresses pour connecter les caisses" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-2)", marginTop: "var(--space-2)" }, children: serverIps.length > 0 ? serverIps.map((ip, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", background: "var(--color-surface)", padding: "var(--space-2) var(--space-3)", borderRadius: "var(--radius-md)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("code", { style: { flex: 1, fontFamily: "monospace", fontSize: "1rem" }, children: [
              ip,
              ":",
              serverPort
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => copyToClipboard(`${ip}:${serverPort}`),
                style: { background: "transparent", border: "none", cursor: "pointer", color: "var(--color-primary)", padding: "var(--space-1)" },
                children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 16 })
              }
            )
          ] }, i)) : /* @__PURE__ */ jsxRuntimeExports.jsxs("code", { style: { fontFamily: "monospace" }, children: [
            "localhost:",
            serverPort
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGrid, style: { marginTop: "var(--space-4)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 16 }),
              " CLIENTS CONNECTÉS"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem", fontWeight: 700, color: "var(--color-primary)" }, children: connectedClients.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.formGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.dangerBtn, onClick: handleStopServer, style: { marginTop: "var(--space-2)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 }),
            "ARRÊTER LE SERVEUR"
          ] }) })
        ] })
      ] })
    ] }),
    mode === "client" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 18 }),
        "CONNEXION CLIENT"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.syncStatus, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.syncIcon, style: { background: clientConnected ? "var(--color-success)" : "var(--color-warning)" }, children: clientConnected ? /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { size: 24 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.syncInfo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.syncLabel, children: "STATUT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: clientConnected ? styles.synced : "", style: { display: "flex", alignItems: "center", gap: "var(--space-2)" }, children: clientConnected ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 16 }),
            " CONNECTÉ À ",
            serverAddress
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { size: 16 }),
            " DÉCONNECTÉ"
          ] }) })
        ] })
      ] }),
      !clientConnected ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGrid, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "ADRESSE IP DU SERVEUR" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: clientServerIp,
                onChange: (e) => setClientServerIp(e.target.value),
                placeholder: "192.168.1.100"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "PORT" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                value: clientServerPort,
                onChange: (e) => setClientServerPort(e.target.value),
                placeholder: "9876"
              }
            )
          ] })
        ] }),
        connectionError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "var(--color-error)", display: "flex", alignItems: "center", gap: "var(--space-2)", marginTop: "var(--space-3)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 16 }),
          connectionError
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: styles.backupBtn,
            onClick: handleConnectClient,
            disabled: isConnecting || !clientServerIp,
            style: { marginTop: "var(--space-4)" },
            children: isConnecting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 18, className: styles.spin }),
              " CONNEXION..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { size: 18 }),
              " SE CONNECTER"
            ] })
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGrid, style: { marginTop: "var(--space-4)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 16 }),
              " DERNIÈRE SYNCHRONISATION"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.2rem", fontWeight: 600 }, children: formatTime(lastSyncTime) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "MODIFICATIONS EN ATTENTE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.2rem", fontWeight: 600, color: pendingChanges > 0 ? "var(--color-warning)" : "var(--color-success)" }, children: pendingChanges })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.dangerBtn, onClick: handleDisconnect, style: { marginTop: "var(--space-4)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { size: 18 }),
          "SE DÉCONNECTER"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 18 }),
        " INFORMATIONS"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: styles.hint, children: [
        "💡 ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Serveur Principal:" }),
        " Installez sur le PC Windows admin. C'est lui qui stocke la base de données centrale."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: styles.hint, style: { marginTop: "var(--space-2)" }, children: [
        "💡 ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Poste Client:" }),
        " Installez sur les caisses (AntiX Linux, Windows). Elles se synchronisent automatiquement avec le serveur."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: styles.hint, style: { marginTop: "var(--space-2)" }, children: [
        "💡 ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Collections synchroisées:" }),
        " Produits, Ventes, Clients, Fournisseurs, Stock, Trésorerie"
      ] })
    ] })
  ] });
};
const Settings = () => {
  const {
    settings: settings2,
    updateStoreSettings,
    updatePrintSettings,
    updatePOSSettings,
    updateNotificationSettings,
    updateSecuritySettings,
    updateAppearanceSettings,
    resetToDefaults,
    exportSettings,
    importSettings
  } = useSettings();
  const [activeTab, setActiveTab] = reactExports.useState("store");
  const [saveStatus, setSaveStatus] = reactExports.useState("idle");
  const fileInputRef = reactExports.useRef(null);
  const toast = useToast();
  const [showResetConfirm, setShowResetConfirm] = reactExports.useState(false);
  const [showClearDataConfirm, setShowClearDataConfirm] = reactExports.useState(false);
  const [showFinalClearConfirm, setShowFinalClearConfirm] = reactExports.useState(false);
  const showSaveConfirmation = () => {
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2e3);
  };
  const handleReset = () => {
    setShowResetConfirm(true);
  };
  const confirmReset = () => {
    resetToDefaults();
    showSaveConfirmation();
    setShowResetConfirm(false);
    toast.success("Paramètres réinitialisés par défaut");
  };
  const handleExport = () => {
    const json = exportSettings();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `supermarket-settings-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const handleImport = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result;
        const success = importSettings(json);
        if (success) {
          toast.success("Paramètres importés avec succès!");
          showSaveConfirmation();
        } else {
          toast.error("Erreur lors de l'importation des paramètres");
        }
      } catch (error) {
        toast.error("Fichier invalide");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
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
    { id: "store", label: "MAGASIN", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 20 }) },
    { id: "print", label: "IMPRESSION", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 20 }) },
    { id: "pos", label: "CAISSE", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calculator, { size: 20 }) },
    { id: "notifications", label: "ALERTES", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 20 }) },
    { id: "security", label: "SÉCURITÉ", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 20 }) },
    { id: "backup", label: "SAUVEGARDE", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 20 }) },
    { id: "network", label: "RÉSEAU", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { size: 20 }) },
    { id: "appearance", label: "APPARENCE", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 20 }) }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.settings, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: styles.header, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.headerTitle, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings$1, { size: 28 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "PARAMÈTRES" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Configuration de l'application" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.headerActions, children: [
        saveStatus === "saved" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.savedBadge, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }),
          "SAUVEGARDÉ AUTOMATIQUEMENT"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.resetBtn, onClick: handleReset, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 18 }),
          "RÉINITIALISER"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.content, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: styles.sidebar, children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: `${styles.tabBtn} ${activeTab === tab.id ? styles.active : ""}`,
          onClick: () => setActiveTab(tab.id),
          children: [
            tab.icon,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tab.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16 })
          ]
        },
        tab.id
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: styles.main, children: [
        activeTab === "store" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.tabContent, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 24 }),
            " INFORMATIONS DU MAGASIN"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "IDENTITÉ" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGrid, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { size: 16 }),
                  " NOM DU MAGASIN"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SettingInput,
                  {
                    value: settings2.store.name,
                    onChange: (val) => updateStoreSettings({ name: val }),
                    onSave: showSaveConfirmation,
                    placeholder: "Nom du magasin"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 16 }),
                  " ADRESSE"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SettingInput,
                  {
                    value: settings2.store.address,
                    onChange: (val) => updateStoreSettings({ address: val }),
                    onSave: showSaveConfirmation,
                    placeholder: "Adresse"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 16 }),
                  " VILLE"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SettingInput,
                  {
                    value: settings2.store.city,
                    onChange: (val) => updateStoreSettings({ city: val }),
                    onSave: showSaveConfirmation,
                    placeholder: "Ville"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 16 }),
                  " TÉLÉPHONE"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SettingInput,
                  {
                    type: "tel",
                    value: settings2.store.phone,
                    onChange: (val) => updateStoreSettings({ phone: val }),
                    onSave: showSaveConfirmation,
                    placeholder: "Téléphone"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 16 }),
                  " EMAIL"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SettingInput,
                  {
                    type: "email",
                    value: settings2.store.email,
                    onChange: (val) => updateStoreSettings({ email: val }),
                    onSave: showSaveConfirmation,
                    placeholder: "Email"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "INFORMATIONS FISCALES" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGrid, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "NIF (NUMÉRO D'IDENTIFICATION FISCALE)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SettingInput,
                  {
                    value: settings2.store.nif,
                    onChange: (val) => updateStoreSettings({ nif: val }),
                    onSave: showSaveConfirmation
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "NIS (NUMÉRO D'IDENTIFICATION STATISTIQUE)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SettingInput,
                  {
                    value: settings2.store.nis,
                    onChange: (val) => updateStoreSettings({ nis: val }),
                    onSave: showSaveConfirmation
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "RC (REGISTRE DE COMMERCE)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SettingInput,
                  {
                    value: settings2.store.rc,
                    onChange: (val) => updateStoreSettings({ rc: val }),
                    onSave: showSaveConfirmation
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "AI (ARTICLE D'IMPOSITION)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SettingInput,
                  {
                    value: settings2.store.ai,
                    onChange: (val) => updateStoreSettings({ ai: val }),
                    onSave: showSaveConfirmation
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "TVA (TAXE SUR LA VALEUR AJOUTÉE)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGrid, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.formGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles.toggle, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: settings2.store.tvaEnabled,
                    onChange: (e) => {
                      updateStoreSettings({ tvaEnabled: e.target.checked });
                      showSaveConfirmation();
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.toggleSlider }),
                "TVA ACTIVÉE"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "TAUX DE TVA (%)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: settings2.store.tvaRate,
                    onChange: (e) => {
                      updateStoreSettings({ tvaRate: parseInt(e.target.value) });
                      showSaveConfirmation();
                    },
                    disabled: !settings2.store.tvaEnabled,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 0, children: "0% (EXONÉRÉ)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 9, children: "9% (TAUX RÉDUIT)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 19, children: "19% (TAUX NORMAL)" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles.hint, style: { marginTop: "var(--space-3)" }, children: "💡 En Algérie, le taux normal de TVA est de 19%. Le taux réduit de 9% s'applique à certains produits de base." })
          ] })
        ] }),
        activeTab === "print" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.tabContent, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 24 }),
            " PARAMÈTRES D'IMPRESSION"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "TICKET DE CAISSE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGrid, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "LARGEUR DU PAPIER" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.radioGroup, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles.radioLabel, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "radio",
                        checked: settings2.print.receiptWidth === 58,
                        onChange: () => {
                          updatePrintSettings({ receiptWidth: 58 });
                          showSaveConfirmation();
                        }
                      }
                    ),
                    "58mm"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles.radioLabel, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "radio",
                        checked: settings2.print.receiptWidth === 80,
                        onChange: () => {
                          updatePrintSettings({ receiptWidth: 80 });
                          showSaveConfirmation();
                        }
                      }
                    ),
                    "80mm"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "NOMBRE DE COPIES" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SettingInput,
                  {
                    type: "number",
                    min: "1",
                    max: "5",
                    value: settings2.print.printCopy,
                    onChange: (val) => updatePrintSettings({ printCopy: parseInt(val) || 1 }),
                    onSave: showSaveConfirmation
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup + " " + styles.fullWidth, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "TEXTE DE PIED DE PAGE" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SettingInput,
                  {
                    value: settings2.print.footerText,
                    onChange: (val) => updatePrintSettings({ footerText: val }),
                    onSave: showSaveConfirmation,
                    placeholder: "Message de fin de ticket"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.toggleGrid, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles.toggle, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: settings2.print.showBarcode,
                    onChange: (e) => {
                      updatePrintSettings({ showBarcode: e.target.checked });
                      showSaveConfirmation();
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.toggleSlider }),
                "AFFICHER CODE-BARRES"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles.toggle, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: settings2.print.showQRCode,
                    onChange: (e) => {
                      updatePrintSettings({ showQRCode: e.target.checked });
                      showSaveConfirmation();
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.toggleSlider }),
                "AFFICHER QR CODE"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles.toggle, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: settings2.print.autoPrint,
                    onChange: (e) => {
                      updatePrintSettings({ autoPrint: e.target.checked });
                      showSaveConfirmation();
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.toggleSlider }),
                "IMPRESSION AUTOMATIQUE"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles.toggle, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: settings2.print.openDrawer,
                    onChange: (e) => {
                      updatePrintSettings({ openDrawer: e.target.checked });
                      showSaveConfirmation();
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.toggleSlider }),
                "OUVRIR TIROIR-CAISSE"
              ] })
            ] })
          ] })
        ] }),
        activeTab === "pos" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.tabContent, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calculator, { size: 24 }),
            " PARAMÈTRES DE CAISSE"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "COMPORTEMENT" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.toggleGrid, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles.toggle, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: settings2.pos.quickCheckout,
                    onChange: (e) => {
                      updatePOSSettings({ quickCheckout: e.target.checked });
                      showSaveConfirmation();
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.toggleSlider }),
                "ENCAISSEMENT RAPIDE"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles.toggle, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: settings2.pos.requireCustomer,
                    onChange: (e) => {
                      updatePOSSettings({ requireCustomer: e.target.checked });
                      showSaveConfirmation();
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.toggleSlider }),
                "CLIENT OBLIGATOIRE"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles.toggle, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: settings2.pos.allowDiscount,
                    onChange: (e) => {
                      updatePOSSettings({ allowDiscount: e.target.checked });
                      showSaveConfirmation();
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.toggleSlider }),
                "AUTORISER LES REMISES"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles.toggle, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: settings2.pos.allowNegativeStock,
                    onChange: (e) => {
                      updatePOSSettings({ allowNegativeStock: e.target.checked });
                      showSaveConfirmation();
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.toggleSlider }),
                "AUTORISER STOCK NÉGATIF"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles.toggle, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: settings2.pos.soundEnabled,
                    onChange: (e) => {
                      updatePOSSettings({ soundEnabled: e.target.checked });
                      showSaveConfirmation();
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.toggleSlider }),
                "SONS ACTIVÉS"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGrid, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "REMISE MAXIMUM (%)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SettingInput,
                  {
                    type: "number",
                    min: "0",
                    max: "100",
                    value: settings2.pos.maxDiscount,
                    onChange: (val) => updatePOSSettings({ maxDiscount: parseInt(val) || 0 }),
                    onSave: showSaveConfirmation,
                    disabled: !settings2.pos.allowDiscount
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "DÉCONNEXION AUTO (MINUTES)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SettingInput,
                  {
                    type: "number",
                    min: "0",
                    max: "120",
                    value: settings2.pos.autoLogout,
                    onChange: (val) => updatePOSSettings({ autoLogout: parseInt(val) || 0 }),
                    onSave: showSaveConfirmation
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.hint, children: "0 = Désactivé" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "MÉTHODE DE PAIEMENT PAR DÉFAUT" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: settings2.pos.defaultPaymentMethod,
                    onChange: (e) => {
                      updatePOSSettings({ defaultPaymentMethod: e.target.value });
                      showSaveConfirmation();
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "cash", children: "ESPÈCES" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "card", children: "CARTE BANCAIRE" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "edahabia", children: "EDAHABIA" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ccp", children: "CCP" })
                    ]
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        activeTab === "notifications" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.tabContent, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 24 }),
            " ALERTES ET NOTIFICATIONS"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "ALERTES STOCK" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.alertRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles.toggle, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: settings2.notifications.lowStockAlert,
                    onChange: (e) => {
                      updateNotificationSettings({ lowStockAlert: e.target.checked });
                      showSaveConfirmation();
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.toggleSlider }),
                "ALERTE STOCK BAS"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup + " " + styles.inline, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "SEUIL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SettingInput,
                  {
                    type: "number",
                    min: "1",
                    max: "100",
                    value: settings2.notifications.lowStockThreshold,
                    onChange: (val) => updateNotificationSettings({ lowStockThreshold: parseInt(val) || 10 }),
                    onSave: showSaveConfirmation,
                    disabled: !settings2.notifications.lowStockAlert
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "UNITÉS" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "ALERTES EXPIRATION" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.alertRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles.toggle, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: settings2.notifications.expiryAlert,
                    onChange: (e) => {
                      updateNotificationSettings({ expiryAlert: e.target.checked });
                      showSaveConfirmation();
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.toggleSlider }),
                "ALERTE PRODUITS PROCHES EXPIRATION"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup + " " + styles.inline, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "PRÉAVIS" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SettingInput,
                  {
                    type: "number",
                    min: "1",
                    max: "90",
                    value: settings2.notifications.expiryDaysWarning,
                    onChange: (val) => updateNotificationSettings({ expiryDaysWarning: parseInt(val) || 7 }),
                    onSave: showSaveConfirmation,
                    disabled: !settings2.notifications.expiryAlert
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "JOURS" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "NOTIFICATIONS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.toggleGrid, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles.toggle, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: settings2.notifications.dailyReport,
                    onChange: (e) => {
                      updateNotificationSettings({ dailyReport: e.target.checked });
                      showSaveConfirmation();
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.toggleSlider }),
                "RAPPORT JOURNALIER"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles.toggle, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: settings2.notifications.emailNotifications,
                    onChange: (e) => {
                      updateNotificationSettings({ emailNotifications: e.target.checked });
                      showSaveConfirmation();
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.toggleSlider }),
                "NOTIFICATIONS EMAIL"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles.toggle, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: settings2.notifications.soundNotifications,
                    onChange: (e) => {
                      updateNotificationSettings({ soundNotifications: e.target.checked });
                      showSaveConfirmation();
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.toggleSlider }),
                "NOTIFICATIONS SONORES"
              ] })
            ] })
          ] })
        ] }),
        activeTab === "security" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.tabContent, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 24 }),
            " SÉCURITÉ"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "AUTHENTIFICATION" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.toggleGrid, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles.toggle, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: settings2.security.requirePin,
                    onChange: (e) => {
                      updateSecuritySettings({ requirePin: e.target.checked });
                      showSaveConfirmation();
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.toggleSlider }),
                "EXIGER CODE PIN"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles.toggle, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: settings2.security.twoFactorAuth,
                    onChange: (e) => {
                      updateSecuritySettings({ twoFactorAuth: e.target.checked });
                      showSaveConfirmation();
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.toggleSlider }),
                "AUTHENTIFICATION À 2 FACTEURS"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGrid, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "LONGUEUR DU PIN" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: settings2.security.pinLength,
                    onChange: (e) => {
                      updateSecuritySettings({ pinLength: parseInt(e.target.value) });
                      showSaveConfirmation();
                    },
                    disabled: !settings2.security.requirePin,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 4, children: "4 CHIFFRES" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 6, children: "6 CHIFFRES" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "EXPIRATION SESSION (MINUTES)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SettingInput,
                  {
                    type: "number",
                    min: "5",
                    max: "480",
                    value: settings2.security.sessionTimeout,
                    onChange: (val) => updateSecuritySettings({ sessionTimeout: parseInt(val) || 60 }),
                    onSave: showSaveConfirmation
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "VERROUILLAGE APRÈS TENTATIVES" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SettingInput,
                  {
                    type: "number",
                    min: "1",
                    max: "10",
                    value: settings2.security.lockAfterAttempts,
                    onChange: (val) => updateSecuritySettings({ lockAfterAttempts: parseInt(val) || 3 }),
                    onSave: showSaveConfirmation
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        activeTab === "backup" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.tabContent, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 24 }),
            " SAUVEGARDE ET DONNÉES"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "SAUVEGARDE LOCALE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.backupActions, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.backupBtn, onClick: handleExport, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 20 }),
                "EXPORTER LES PARAMÈTRES"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.backupBtn, onClick: handleImport, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 20 }),
                "IMPORTER LES PARAMÈTRES"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: fileInputRef,
                  type: "file",
                  accept: ".json",
                  onChange: handleFileChange,
                  style: { display: "none" }
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: styles.backupInfo, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 16 }),
              "Exportez vos paramètres pour les sauvegarder ou les transférer vers un autre appareil"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "SYNCHRONISATION CLOUD" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.syncStatus, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.syncIcon, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { size: 32 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.syncInfo, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.syncLabel, children: "STATUT" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.syncValue + " " + styles.synced, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 16 }),
                  " SYNCHRONISÉ"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "DONNÉES" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.dangerZone, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 16 }),
                " ZONE DANGEREUSE"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.dangerBtn, onClick: handleClearData, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 18 }),
                "SUPPRIMER TOUTES LES DONNÉES"
              ] })
            ] })
          ] })
        ] }),
        activeTab === "appearance" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.tabContent, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 24 }),
            " APPARENCE"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "THÈME" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.themeSelector, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: `${styles.themeBtn} ${settings2.appearance.theme === "light" ? styles.active : ""}`,
                  onClick: () => {
                    updateAppearanceSettings({ theme: "light" });
                    showSaveConfirmation();
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { size: 24 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "CLAIR" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: `${styles.themeBtn} ${settings2.appearance.theme === "dark" ? styles.active : ""}`,
                  onClick: () => {
                    updateAppearanceSettings({ theme: "dark" });
                    showSaveConfirmation();
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { size: 24 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "SOMBRE" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: `${styles.themeBtn} ${settings2.appearance.theme === "system" ? styles.active : ""}`,
                  onClick: () => {
                    updateAppearanceSettings({ theme: "system" });
                    showSaveConfirmation();
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 24 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "SYSTÈME" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "LANGUE ET FORMAT" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGrid, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 16 }),
                  " LANGUE"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: settings2.appearance.language,
                    onChange: (e) => {
                      updateAppearanceSettings({ language: e.target.value });
                      showSaveConfirmation();
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "fr", children: "FRANÇAIS" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ar", children: "العربية" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "en", children: "ENGLISH" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 16 }),
                  " FORMAT DATE"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: settings2.appearance.dateFormat,
                    onChange: (e) => {
                      updateAppearanceSettings({ dateFormat: e.target.value });
                      showSaveConfirmation();
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "DD/MM/YYYY", children: "DD/MM/YYYY" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "MM/DD/YYYY", children: "MM/DD/YYYY" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "YYYY-MM-DD", children: "YYYY-MM-DD" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 16 }),
                  " FORMAT HEURE"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: settings2.appearance.timeFormat,
                    onChange: (e) => {
                      updateAppearanceSettings({ timeFormat: e.target.value });
                      showSaveConfirmation();
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "24h", children: "24H (14:30)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "12h", children: "12H (2:30 PM)" })
                    ]
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        activeTab === "network" && /* @__PURE__ */ jsxRuntimeExports.jsx(NetworkSettingsTab, { showSaveConfirmation })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmModal,
      {
        isOpen: showResetConfirm,
        title: "Réinitialiser les paramètres",
        message: "Êtes-vous sûr de vouloir réinitialiser tous les paramètres par défaut ?",
        confirmText: "Réinitialiser",
        cancelText: "Annuler",
        variant: "warning",
        onConfirm: confirmReset,
        onCancel: () => setShowResetConfirm(false)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmModal,
      {
        isOpen: showClearDataConfirm,
        title: "⚠️ Supprimer toutes les données",
        message: "ATTENTION: Êtes-vous sûr de vouloir supprimer TOUTES les données ? Cette action est IRRÉVERSIBLE !",
        confirmText: "Continuer",
        cancelText: "Annuler",
        variant: "danger",
        onConfirm: confirmFirstClear,
        onCancel: () => setShowClearDataConfirm(false)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmModal,
      {
        isOpen: showFinalClearConfirm,
        title: "Dernière confirmation",
        message: "Cette action supprimera tous vos produits, clients, ventes et paramètres. Continuer ?",
        confirmText: "Supprimer tout",
        cancelText: "Annuler",
        variant: "danger",
        onConfirm: confirmFinalClear,
        onCancel: () => setShowFinalClearConfirm(false)
      }
    )
  ] });
};
export {
  Settings
};

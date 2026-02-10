import { j as jsxRuntimeExports } from "./vendor-state-DFI86SKa.js";
import { r as reactExports } from "./vendor-react-Df__x13C.js";
import { u as useSettings, f as useToast, a as useAuthStore } from "./index-BbOgUw3k.js";
import { u as useTreasuryFacade } from "./useTreasuryFacade-CchObU-E.js";
import { e as Clock, a1 as ArrowRight, x as Lock, al as LockOpen, j as Wallet, s as TrendingUp, Q as TrendingDown, am as PiggyBank, af as Plus, ae as Minus, l as Printer, X, a as CircleCheckBig, C as CircleAlert, ah as Banknote, an as CircleArrowDown, ao as CircleArrowUp, ap as Target, w as Calendar, aq as Pen, ab as History, ar as ArrowUpRight, as as ArrowDownLeft, V as Receipt, r as Search, _ as CreditCard, v as Trash2, c as Check, U as Users, Z as Zap, at as ShoppingBag, au as House, k as Truck, av as Wrench, aw as Briefcase, F as FileText, ax as FileChartColumnIncreasing, ay as Download, i as ShoppingCart, az as Smartphone, O as DollarSign, T as TriangleAlert, P as Package } from "./vendor-ui-DiXyqbDT.js";
import { G as GoodsReceipt } from "./GoodsReceipt-BSVIkDPf.js";
import { C as ConfirmModal } from "./ConfirmModal-IjhJ8y4D.js";
import "./vendor-i18n-DeCNyroL.js";
const cashRegister = "_cashRegister_i3une_6";
const sessionBar = "_sessionBar_i3une_16";
const sessionInfo = "_sessionInfo_i3une_26";
const sessionStatus = "_sessionStatus_i3une_32";
const statusDot = "_statusDot_i3une_40";
const sessionMeta = "_sessionMeta_i3une_62";
const sessionActions = "_sessionActions_i3une_70";
const openingBalance = "_openingBalance_i3une_76";
const transferBtn = "_transferBtn_i3une_86";
const closeBtn$1 = "_closeBtn_i3une_104";
const closedBar = "_closedBar_i3une_117";
const openBtn = "_openBtn_i3une_129";
const metricsGrid = "_metricsGrid_i3une_146";
const metric = "_metric_i3une_146";
const metricLabel = "_metricLabel_i3une_172";
const metricValue = "_metricValue_i3une_177";
const balance = "_balance_i3une_183";
const sales = "_sales_i3une_187";
const expenses$1 = "_expenses_i3une_191";
const safe = "_safe_i3une_195";
const provisionsCard$1 = "_provisionsCard_i3une_203";
const provisionTargets = "_provisionTargets_i3une_218";
const provisionItem$1 = "_provisionItem_i3une_225";
const provisionIcon = "_provisionIcon_i3une_236";
const provisionInfo = "_provisionInfo_i3une_240";
const provisionProgress = "_provisionProgress_i3une_256";
const progressBar$1 = "_progressBar_i3une_264";
const totalTarget = "_totalTarget_i3une_271";
const quickActions = "_quickActions_i3une_290";
const printBtn$1 = "_printBtn_i3une_320";
const movementsCard = "_movementsCard_i3une_328";
const cardHeader$1 = "_cardHeader_i3une_335";
const movementsList = "_movementsList_i3une_357";
const emptyState$3 = "_emptyState_i3une_362";
const movementItem = "_movementItem_i3une_372";
const movementLeft = "_movementLeft_i3une_389";
const movementReason = "_movementReason_i3une_401";
const movementTime = "_movementTime_i3une_407";
const movementAmount = "_movementAmount_i3une_412";
const positive$2 = "_positive_i3une_417";
const negative$2 = "_negative_i3une_421";
const movementRight = "_movementRight_i3une_425";
const printMovementBtn = "_printMovementBtn_i3une_431";
const saleIcon = "_saleIcon_i3une_456";
const depositIcon$1 = "_depositIcon_i3une_460";
const withdrawIcon$1 = "_withdrawIcon_i3une_464";
const expenseIcon$1 = "_expenseIcon_i3une_468";
const safeIcon$1 = "_safeIcon_i3une_472";
const overlay$3 = "_overlay_i3une_484";
const modal$3 = "_modal_i3une_506";
const transferModal = "_transferModal_i3une_507";
const modalHeader$3 = "_modalHeader_i3une_533";
const modalBody$3 = "_modalBody_i3une_559";
const hint$3 = "_hint_i3une_590";
const expectedBalance = "_expectedBalance_i3une_596";
const difference = "_difference_i3une_609";
const exact = "_exact_i3une_618";
const surplus$1 = "_surplus_i3une_623";
const deficit$1 = "_deficit_i3une_628";
const currentCash = "_currentCash_i3une_634";
const transferSection = "_transferSection_i3une_654";
const provisionInputs = "_provisionInputs_i3une_677";
const provisionRow = "_provisionRow_i3une_684";
const transferTotal = "_transferTotal_i3une_702";
const quickFillBtn = "_quickFillBtn_i3une_716";
const modalFooter$3 = "_modalFooter_i3une_732";
const confirmBtn$3 = "_confirmBtn_i3une_754";
const dangerBtn$1 = "_dangerBtn_i3une_769";
const styles$4 = {
  cashRegister,
  sessionBar,
  sessionInfo,
  sessionStatus,
  statusDot,
  sessionMeta,
  sessionActions,
  openingBalance,
  transferBtn,
  closeBtn: closeBtn$1,
  closedBar,
  openBtn,
  metricsGrid,
  metric,
  metricLabel,
  metricValue,
  balance,
  sales,
  expenses: expenses$1,
  safe,
  provisionsCard: provisionsCard$1,
  provisionTargets,
  provisionItem: provisionItem$1,
  provisionIcon,
  provisionInfo,
  provisionProgress,
  progressBar: progressBar$1,
  totalTarget,
  quickActions,
  printBtn: printBtn$1,
  movementsCard,
  cardHeader: cardHeader$1,
  movementsList,
  emptyState: emptyState$3,
  movementItem,
  movementLeft,
  movementReason,
  movementTime,
  movementAmount,
  positive: positive$2,
  negative: negative$2,
  movementRight,
  printMovementBtn,
  saleIcon,
  depositIcon: depositIcon$1,
  withdrawIcon: withdrawIcon$1,
  expenseIcon: expenseIcon$1,
  safeIcon: safeIcon$1,
  overlay: overlay$3,
  modal: modal$3,
  transferModal,
  modalHeader: modalHeader$3,
  modalBody: modalBody$3,
  hint: hint$3,
  expectedBalance,
  difference,
  exact,
  surplus: surplus$1,
  deficit: deficit$1,
  currentCash,
  transferSection,
  provisionInputs,
  provisionRow,
  transferTotal,
  quickFillBtn,
  modalFooter: modalFooter$3,
  confirmBtn: confirmBtn$3,
  dangerBtn: dangerBtn$1
};
const CashRegister = () => {
  const { formatCurrency, settings } = useSettings();
  const toast = useToast();
  const { user } = useAuthStore();
  const userName = user ? `${user.firstName} ${user.lastName}` : "Caissier";
  const {
    currentSession,
    movements,
    safeBalance,
    openSession,
    closeSession,
    addMovement,
    depositToSafe,
    contributeToFund,
    getCurrentBalance,
    getDailyProvisionTarget,
    getProvisionProgress
  } = useTreasuryFacade();
  const [showOpenModal, setShowOpenModal] = reactExports.useState(false);
  const [showCloseModal, setShowCloseModal] = reactExports.useState(false);
  const [showDepositModal, setShowDepositModal] = reactExports.useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = reactExports.useState(false);
  const [showTransferModal, setShowTransferModal] = reactExports.useState(false);
  const [openingAmount, setOpeningAmount] = reactExports.useState("");
  const [closingAmount, setClosingAmount] = reactExports.useState("");
  const [closingNotes, setClosingNotes] = reactExports.useState("");
  const [movementAmount2, setMovementAmount] = reactExports.useState("");
  const [movementReason2, setMovementReason] = reactExports.useState("");
  const [transferToSafe, setTransferToSafe] = reactExports.useState("");
  const [transferSalaries, setTransferSalaries] = reactExports.useState("");
  const [transferBankCredit, setTransferBankCredit] = reactExports.useState("");
  const [transferCharges, setTransferCharges] = reactExports.useState("");
  const [isPrinting, setIsPrinting] = reactExports.useState(false);
  const currentBalance2 = getCurrentBalance();
  const dailyTargets = getDailyProvisionTarget();
  const provisionProgress2 = getProvisionProgress();
  const isSessionOpen = currentSession && currentSession.status === "open";
  const todayMovements = reactExports.useMemo(() => {
    if (!currentSession) return [];
    return movements.filter((m) => m.sessionId === currentSession.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [movements, currentSession]);
  const sessionTotals = reactExports.useMemo(() => {
    const sales2 = todayMovements.filter((m) => m.type === "sale").reduce((s, m) => s + m.amount, 0);
    const expenses2 = todayMovements.filter((m) => m.type === "expense").reduce((s, m) => s + m.amount, 0);
    const withdrawals = todayMovements.filter((m) => m.type === "withdrawal").reduce((s, m) => s + m.amount, 0);
    const deposits = todayMovements.filter((m) => m.type === "deposit").reduce((s, m) => s + m.amount, 0);
    const toSafe = todayMovements.filter((m) => m.type === "transfer_to_safe").reduce((s, m) => s + m.amount, 0);
    const toProvisions = todayMovements.filter((m) => m.type === "transfer_to_provision").reduce((s, m) => s + m.amount, 0);
    return { sales: sales2, expenses: expenses2, withdrawals, deposits, toSafe, toProvisions };
  }, [todayMovements]);
  const formatTime = (date2) => {
    const d = typeof date2 === "string" ? new Date(date2) : date2;
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };
  const handleOpenSession = () => {
    const amount = parseFloat(openingAmount);
    if (isNaN(amount) || amount < 0) return;
    openSession(amount, userName);
    setShowOpenModal(false);
    setOpeningAmount("");
  };
  const handleCloseSession = () => {
    const amount = parseFloat(closingAmount);
    if (isNaN(amount) || amount < 0) return;
    closeSession(amount, closingNotes);
    setShowCloseModal(false);
    setClosingAmount("");
    setClosingNotes("");
  };
  const handleDeposit = () => {
    const amount = parseFloat(movementAmount2);
    if (isNaN(amount) || amount <= 0 || !movementReason2) return;
    addMovement({
      type: "deposit",
      amount,
      reason: movementReason2,
      createdBy: userName
    });
    setShowDepositModal(false);
    setMovementAmount("");
    setMovementReason("");
  };
  const handleWithdraw = () => {
    const amount = parseFloat(movementAmount2);
    if (isNaN(amount) || amount <= 0 || !movementReason2) return;
    addMovement({
      type: "withdrawal",
      amount,
      reason: movementReason2,
      createdBy: userName
    });
    setShowWithdrawModal(false);
    setMovementAmount("");
    setMovementReason("");
  };
  const handleTransfers = () => {
    const safeAmount = parseFloat(transferToSafe) || 0;
    const salariesAmount = parseFloat(transferSalaries) || 0;
    const bankCreditAmount = parseFloat(transferBankCredit) || 0;
    const chargesAmount = parseFloat(transferCharges) || 0;
    if (safeAmount > 0) {
      depositToSafe(safeAmount, "Transfert fin de journée", userName);
    }
    if (salariesAmount > 0) {
      contributeToFund("salaries", salariesAmount, "Provision journalière", userName);
    }
    if (bankCreditAmount > 0) {
      contributeToFund("bankCredit", bankCreditAmount, "Provision journalière", userName);
    }
    if (chargesAmount > 0) {
      contributeToFund("fixedCharges", chargesAmount, "Provision journalière", userName);
    }
    setShowTransferModal(false);
    setTransferToSafe("");
    setTransferSalaries("");
    setTransferBankCredit("");
    setTransferCharges("");
  };
  const getMovementIcon = (type) => {
    switch (type) {
      case "sale":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowUp, { size: 18, className: styles$4.saleIcon });
      case "deposit":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18, className: styles$4.depositIcon });
      case "withdrawal":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 18, className: styles$4.withdrawIcon });
      case "expense":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowDown, { size: 18, className: styles$4.expenseIcon });
      case "transfer_to_safe":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(PiggyBank, { size: 18, className: styles$4.safeIcon });
      case "transfer_to_provision":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { size: 18, className: styles$4.provisionIcon });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 18 });
    }
  };
  const getMovementLabel = (type) => {
    const labels = {
      sale: "Vente",
      deposit: "Entrée",
      withdrawal: "Retrait",
      expense: "Dépense",
      refund: "Remboursement",
      transfer_to_safe: "Vers Coffre",
      transfer_to_provision: "Vers Provision"
    };
    return labels[type] || type;
  };
  const handlePrintTicket = reactExports.useCallback((movement) => {
    const ticketData = movement || todayMovements.find((m) => m.type === "sale");
    if (!ticketData) {
      toast.warning("Aucune vente à imprimer");
      return;
    }
    setIsPrinting(true);
    const typeLabels = {
      sale: "Vente",
      deposit: "Entrée",
      withdrawal: "Retrait",
      expense: "Dépense",
      refund: "Remboursement",
      transfer_to_safe: "Vers Coffre",
      transfer_to_provision: "Vers Provision"
    };
    const typeLabel = typeLabels[ticketData.type] || ticketData.type;
    const storeName = settings?.store?.name || "SuperMarket";
    const dateStr = new Date(ticketData.createdAt).toLocaleDateString("fr-FR");
    const timeStr = new Date(ticketData.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const amount = ticketData.amount.toLocaleString("fr-FR") + " DA";
    const ticketHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Ticket - ${ticketData.id.slice(-8)}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Courier New', monospace; 
                        padding: 20px; 
                        max-width: 280px;
                        margin: 0 auto;
                    }
                    .ticket { border: 1px dashed #000; padding: 15px; }
                    .header { text-align: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px dashed #000; }
                    .store-name { font-size: 16px; font-weight: bold; }
                    .date { font-size: 12px; margin-top: 5px; }
                    .ticket-number { font-size: 11px; color: #666; margin-top: 5px; }
                    .content { padding: 10px 0; border-bottom: 1px dashed #000; }
                    .row { display: flex; justify-content: space-between; padding: 3px 0; }
                    .label { font-size: 12px; }
                    .value { font-size: 12px; font-weight: bold; }
                    .total { font-size: 16px !important; margin-top: 10px; padding-top: 10px; border-top: 2px solid #000; }
                    .footer { text-align: center; margin-top: 15px; font-size: 11px; }
                    .thanks { font-size: 12px; font-weight: bold; margin-top: 10px; }
                    @media print { body { padding: 0; } .ticket { border: none; } }
                </style>
            </head>
            <body>
                <div class="ticket">
                    <div class="header">
                        <div class="store-name">${storeName}</div>
                        <div class="date">${dateStr} - ${timeStr}</div>
                        <div class="ticket-number">Ticket N° ${ticketData.id.slice(-8).toUpperCase()}</div>
                    </div>
                    <div class="content">
                        <div class="row">
                            <span class="label">Type:</span>
                            <span class="value">${typeLabel}</span>
                        </div>
                        <div class="row">
                            <span class="label">Description:</span>
                            <span class="value">${ticketData.reason}</span>
                        </div>
                        <div class="row total">
                            <span class="label">MONTANT:</span>
                            <span class="value">${amount}</span>
                        </div>
                    </div>
                    <div class="footer">
                        <div class="thanks">Merci de votre visite! 🙏</div>
                        <div style="margin-top: 10px;">Caissier: ${currentSession?.cashierName || "N/A"}</div>
                    </div>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(function() { window.close(); }, 500);
                    };
                <\/script>
            </body>
            </html>
        `;
    const printWindow = window.open("", "_blank", "width=350,height=500");
    if (printWindow) {
      printWindow.document.write(ticketHTML);
      printWindow.document.close();
    }
    setIsPrinting(false);
  }, [todayMovements, settings, currentSession]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.cashRegister, children: [
    isSessionOpen ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.sessionBar, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.sessionInfo, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$4.sessionStatus, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$4.statusDot }),
          "Caisse ouverte"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$4.sessionMeta, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 14 }),
          "Ouverte à ",
          formatTime(currentSession.openedAt),
          " par ",
          currentSession.cashierName
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.sessionActions, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$4.openingBalance, children: [
          "Fond: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(currentSession.openingBalance) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$4.transferBtn, onClick: () => setShowTransferModal(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16 }),
          "Transférer"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$4.closeBtn, onClick: () => setShowCloseModal(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 16 }),
          "Clôturer"
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.closedBar, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚠️ Caisse fermée" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$4.openBtn, onClick: () => setShowOpenModal(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { size: 16 }),
        "Ouvrir la caisse"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.metricsGrid, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$4.metric} ${styles$4.balance}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$4.metricLabel, children: "Solde en caisse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$4.metricValue, children: formatCurrency(currentBalance2) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$4.metric} ${styles$4.sales}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$4.metricLabel, children: "Ventes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$4.metricValue, children: formatCurrency(sessionTotals.sales) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$4.metric} ${styles$4.expenses}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$4.metricLabel, children: "Sorties" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$4.metricValue, children: formatCurrency(sessionTotals.expenses + sessionTotals.withdrawals) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$4.metric} ${styles$4.safe}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PiggyBank, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$4.metricLabel, children: "Au coffre" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$4.metricValue, children: formatCurrency(safeBalance) })
        ] })
      ] })
    ] }),
    isSessionOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.provisionsCard, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Objectif Provisions Journalier" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.provisionTargets, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.provisionItem, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$4.provisionIcon, children: "👥" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.provisionInfo, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Salaires" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              formatCurrency(dailyTargets.salaries),
              "/jour"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$4.provisionProgress, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$4.progressBar, style: { width: `${provisionProgress2.salaries}%` } }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.provisionItem, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$4.provisionIcon, children: "🏦" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.provisionInfo, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Crédit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              formatCurrency(dailyTargets.bankCredit),
              "/jour"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$4.provisionProgress, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$4.progressBar, style: { width: `${provisionProgress2.bankCredit}%` } }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.provisionItem, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$4.provisionIcon, children: "⚡" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.provisionInfo, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Charges" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              formatCurrency(dailyTargets.fixedCharges),
              "/jour"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$4.provisionProgress, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$4.progressBar, style: { width: `${provisionProgress2.fixedCharges}%` } }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.totalTarget, children: [
          "Total à provisionner: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(dailyTargets.total) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.quickActions, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowDepositModal(true), disabled: !isSessionOpen, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
        " Entrée de fonds"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowWithdrawModal(true), disabled: !isSessionOpen, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 18 }),
        " Retrait"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: styles$4.printBtn,
          onClick: () => handlePrintTicket(),
          disabled: !isSessionOpen || todayMovements.filter((m) => m.type === "sale").length === 0 || isPrinting,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 18 }),
            " ",
            isPrinting ? "Impression..." : "Imprimer dernier ticket"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.movementsCard, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.cardHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Mouvements du jour" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          todayMovements.length,
          " opérations"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$4.movementsList, children: todayMovements.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.emptyState, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 48 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Aucun mouvement pour cette session" })
      ] }) : todayMovements.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.movementItem, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.movementLeft, children: [
          getMovementIcon(m.type),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$4.movementReason, children: m.reason }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$4.movementTime, children: [
              getMovementLabel(m.type),
              " • ",
              formatTime(m.createdAt)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.movementRight, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `${styles$4.movementAmount} ${m.type === "sale" || m.type === "deposit" ? styles$4.positive : styles$4.negative}`, children: [
            m.type === "sale" || m.type === "deposit" ? "+" : "-",
            formatCurrency(m.amount)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: styles$4.printMovementBtn,
              onClick: () => handlePrintTicket(m),
              title: "Imprimer ce ticket",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 14 })
            }
          )
        ] })
      ] }, m.id)) })
    ] }),
    showOpenModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$4.overlay, onClick: () => setShowOpenModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Ouvrir la caisse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowOpenModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Fond de caisse (DA)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: openingAmount,
            onChange: (e) => setOpeningAmount(e.target.value),
            placeholder: "5000",
            autoFocus: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles$4.hint, children: "Comptez les espèces dans la caisse avant de commencer." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowOpenModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: styles$4.confirmBtn,
            onClick: handleOpenSession,
            disabled: !openingAmount || parseFloat(openingAmount) < 0,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { size: 18 }),
              " Ouvrir"
            ]
          }
        )
      ] })
    ] }) }),
    showCloseModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$4.overlay, onClick: () => setShowCloseModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Clôturer la caisse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowCloseModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.expectedBalance, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Solde théorique:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(currentBalance2) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Montant réel compté (DA)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: closingAmount,
            onChange: (e) => setClosingAmount(e.target.value),
            placeholder: currentBalance2.toString(),
            autoFocus: true
          }
        ),
        closingAmount && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${styles$4.difference} ${parseFloat(closingAmount) === currentBalance2 ? styles$4.exact : parseFloat(closingAmount) > currentBalance2 ? styles$4.surplus : styles$4.deficit}`, children: parseFloat(closingAmount) === currentBalance2 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 16 }),
          " Caisse équilibrée"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 16 }),
          " Écart: ",
          formatCurrency(parseFloat(closingAmount) - currentBalance2)
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Notes (optionnel)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: closingNotes,
            onChange: (e) => setClosingNotes(e.target.value),
            placeholder: "Observations de fin de journée...",
            rows: 2
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowCloseModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: styles$4.dangerBtn,
            onClick: handleCloseSession,
            disabled: !closingAmount || parseFloat(closingAmount) < 0,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 18 }),
              " Clôturer"
            ]
          }
        )
      ] })
    ] }) }),
    showDepositModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$4.overlay, onClick: () => setShowDepositModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Entrée de fonds" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowDepositModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Montant (DA)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: movementAmount2,
            onChange: (e) => setMovementAmount(e.target.value),
            placeholder: "0",
            autoFocus: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Motif" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: movementReason2,
            onChange: (e) => setMovementReason(e.target.value),
            placeholder: "Ex: Apport de monnaie"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowDepositModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: styles$4.confirmBtn,
            onClick: handleDeposit,
            disabled: !movementAmount2 || !movementReason2,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
              " Ajouter"
            ]
          }
        )
      ] })
    ] }) }),
    showWithdrawModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$4.overlay, onClick: () => setShowWithdrawModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Retrait" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowWithdrawModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Montant (DA)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: movementAmount2,
            onChange: (e) => setMovementAmount(e.target.value),
            placeholder: "0",
            autoFocus: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Motif" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: movementReason2,
            onChange: (e) => setMovementReason(e.target.value),
            placeholder: "Ex: Retrait patron"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowWithdrawModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: styles$4.dangerBtn,
            onClick: handleWithdraw,
            disabled: !movementAmount2 || !movementReason2,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 18 }),
              " Retirer"
            ]
          }
        )
      ] })
    ] }) }),
    showTransferModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$4.overlay, onClick: () => setShowTransferModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.transferModal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Transférer vers Coffre & Provisions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowTransferModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.currentCash, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 24 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "En caisse:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(currentBalance2) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.transferSection, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PiggyBank, { size: 18 }),
            " Vers le Coffre"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              value: transferToSafe,
              onChange: (e) => setTransferToSafe(e.target.value),
              placeholder: "0"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.transferSection, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "📊 Vers les Provisions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: styles$4.hint, children: [
            "Objectif quotidien: ",
            formatCurrency(dailyTargets.total)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.provisionInputs, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.provisionRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "👥 Salaires (",
                formatCurrency(dailyTargets.salaries),
                "/j)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  value: transferSalaries,
                  onChange: (e) => setTransferSalaries(e.target.value),
                  placeholder: dailyTargets.salaries.toString()
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.provisionRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "🏦 Crédit (",
                formatCurrency(dailyTargets.bankCredit),
                "/j)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  value: transferBankCredit,
                  onChange: (e) => setTransferBankCredit(e.target.value),
                  placeholder: dailyTargets.bankCredit.toString()
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.provisionRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "⚡ Charges (",
                formatCurrency(dailyTargets.fixedCharges),
                "/j)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  value: transferCharges,
                  onChange: (e) => setTransferCharges(e.target.value),
                  placeholder: dailyTargets.fixedCharges.toString()
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.transferTotal, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total à transférer:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(
            (parseFloat(transferToSafe) || 0) + (parseFloat(transferSalaries) || 0) + (parseFloat(transferBankCredit) || 0) + (parseFloat(transferCharges) || 0)
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles$4.quickFillBtn, onClick: () => {
          setTransferSalaries(dailyTargets.salaries.toString());
          setTransferBankCredit(dailyTargets.bankCredit.toString());
          setTransferCharges(dailyTargets.fixedCharges.toString());
        }, children: "⚡ Remplir avec objectifs quotidiens" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowTransferModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$4.confirmBtn, onClick: handleTransfers, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 18 }),
          " Transférer"
        ] })
      ] })
    ] }) })
  ] });
};
const GoodsReceiptTab = GoodsReceipt;
const savings = "_savings_1h6h1_6";
const overviewGrid = "_overviewGrid_1h6h1_16";
const safeCard = "_safeCard_1h6h1_22";
const provisionsCard = "_provisionsCard_1h6h1_23";
const totalCard = "_totalCard_1h6h1_24";
const safeIcon = "_safeIcon_1h6h1_46";
const provisionsIcon = "_provisionsIcon_1h6h1_47";
const totalIcon = "_totalIcon_1h6h1_48";
const safeInfo = "_safeInfo_1h6h1_73";
const provisionsInfo = "_provisionsInfo_1h6h1_74";
const totalInfo = "_totalInfo_1h6h1_75";
const safeLabel = "_safeLabel_1h6h1_82";
const provisionsLabel = "_provisionsLabel_1h6h1_83";
const totalLabel = "_totalLabel_1h6h1_84";
const safeValue = "_safeValue_1h6h1_89";
const provisionsValue = "_provisionsValue_1h6h1_90";
const totalValue = "_totalValue_1h6h1_91";
const safeActions = "_safeActions_1h6h1_97";
const depositBtn = "_depositBtn_1h6h1_103";
const withdrawBtn = "_withdrawBtn_1h6h1_104";
const dailyTarget = "_dailyTarget_1h6h1_137";
const totalBreakdown = "_totalBreakdown_1h6h1_138";
const fundsSection = "_fundsSection_1h6h1_154";
const fundsSectionHeader = "_fundsSectionHeader_1h6h1_161";
const sectionHint = "_sectionHint_1h6h1_174";
const addFundBtn = "_addFundBtn_1h6h1_180";
const emojiPicker = "_emojiPicker_1h6h1_199";
const selectedEmoji = "_selectedEmoji_1h6h1_223";
const fundsGrid = "_fundsGrid_1h6h1_228";
const fundCard = "_fundCard_1h6h1_234";
const complete = "_complete_1h6h1_246";
const ontrack = "_ontrack_1h6h1_251";
const behind = "_behind_1h6h1_255";
const critical = "_critical_1h6h1_259";
const fundHeader = "_fundHeader_1h6h1_264";
const fundIcon = "_fundIcon_1h6h1_271";
const fundInfo = "_fundInfo_1h6h1_275";
const fundName = "_fundName_1h6h1_282";
const fundDue = "_fundDue_1h6h1_287";
const editBtn = "_editBtn_1h6h1_295";
const fundProgress = "_fundProgress_1h6h1_314";
const fundAmounts = "_fundAmounts_1h6h1_318";
const currentAmount = "_currentAmount_1h6h1_325";
const targetAmount = "_targetAmount_1h6h1_331";
const progressWrapper = "_progressWrapper_1h6h1_336";
const progressBar = "_progressBar_1h6h1_343";
const progressPercent = "_progressPercent_1h6h1_362";
const fundStatus = "_fundStatus_1h6h1_370";
const statusComplete = "_statusComplete_1h6h1_384";
const statusOntrack = "_statusOntrack_1h6h1_389";
const statusBehind = "_statusBehind_1h6h1_394";
const statusCritical = "_statusCritical_1h6h1_399";
const fundActions = "_fundActions_1h6h1_404";
const historyCard = "_historyCard_1h6h1_439";
const cardHeader = "_cardHeader_1h6h1_446";
const historyList = "_historyList_1h6h1_463";
const emptyState$2 = "_emptyState_1h6h1_468";
const historyItem = "_historyItem_1h6h1_478";
const historyLeft = "_historyLeft_1h6h1_495";
const historyReason = "_historyReason_1h6h1_507";
const historyMeta = "_historyMeta_1h6h1_513";
const historyAmount = "_historyAmount_1h6h1_518";
const positive$1 = "_positive_1h6h1_523";
const negative$1 = "_negative_1h6h1_527";
const depositIcon = "_depositIcon_1h6h1_531";
const withdrawIcon = "_withdrawIcon_1h6h1_535";
const overlay$2 = "_overlay_1h6h1_543";
const fadeIn$1 = "_fadeIn_1h6h1_1";
const modal$2 = "_modal_1h6h1_565";
const slideUp$1 = "_slideUp_1h6h1_1";
const modalHeader$2 = "_modalHeader_1h6h1_587";
const modalBody$2 = "_modalBody_1h6h1_613";
const currentBalance = "_currentBalance_1h6h1_642";
const hint$2 = "_hint_1h6h1_658";
const dailyCalc = "_dailyCalc_1h6h1_664";
const modalFooter$2 = "_modalFooter_1h6h1_674";
const confirmBtn$2 = "_confirmBtn_1h6h1_696";
const dangerBtn = "_dangerBtn_1h6h1_711";
const styles$3 = {
  savings,
  overviewGrid,
  safeCard,
  provisionsCard,
  totalCard,
  safeIcon,
  provisionsIcon,
  totalIcon,
  safeInfo,
  provisionsInfo,
  totalInfo,
  safeLabel,
  provisionsLabel,
  totalLabel,
  safeValue,
  provisionsValue,
  totalValue,
  safeActions,
  depositBtn,
  withdrawBtn,
  dailyTarget,
  totalBreakdown,
  fundsSection,
  fundsSectionHeader,
  sectionHint,
  addFundBtn,
  emojiPicker,
  selectedEmoji,
  fundsGrid,
  fundCard,
  complete,
  ontrack,
  behind,
  critical,
  fundHeader,
  fundIcon,
  fundInfo,
  fundName,
  fundDue,
  editBtn,
  fundProgress,
  fundAmounts,
  currentAmount,
  targetAmount,
  progressWrapper,
  progressBar,
  progressPercent,
  fundStatus,
  statusComplete,
  statusOntrack,
  statusBehind,
  statusCritical,
  fundActions,
  historyCard,
  cardHeader,
  historyList,
  emptyState: emptyState$2,
  historyItem,
  historyLeft,
  historyReason,
  historyMeta,
  historyAmount,
  positive: positive$1,
  negative: negative$1,
  depositIcon,
  withdrawIcon,
  overlay: overlay$2,
  fadeIn: fadeIn$1,
  modal: modal$2,
  slideUp: slideUp$1,
  modalHeader: modalHeader$2,
  modalBody: modalBody$2,
  currentBalance,
  hint: hint$2,
  dailyCalc,
  modalFooter: modalFooter$2,
  confirmBtn: confirmBtn$2,
  dangerBtn
};
const Savings = () => {
  const { formatCurrency } = useSettings();
  const {
    safeBalance,
    safeTransactions,
    sinkingFunds,
    depositToSafe,
    withdrawFromSafe,
    contributeToFund,
    withdrawFromFund,
    updateFundTarget,
    addSinkingFund,
    getDailyProvisionTarget,
    getTotalSafeAndProvisions
  } = useTreasuryFacade();
  const [showSafeDepositModal, setShowSafeDepositModal] = reactExports.useState(false);
  const [showSafeWithdrawModal, setShowSafeWithdrawModal] = reactExports.useState(false);
  const [showFundModal, setShowFundModal] = reactExports.useState(false);
  const [showEditTargetModal, setShowEditTargetModal] = reactExports.useState(false);
  const [showNewFundModal, setShowNewFundModal] = reactExports.useState(false);
  const [selectedFund, setSelectedFund] = reactExports.useState(null);
  const [modalMode, setModalMode] = reactExports.useState("contribute");
  const [amount, setAmount] = reactExports.useState("");
  const [reason, setReason] = reactExports.useState("");
  const [newTarget, setNewTarget] = reactExports.useState("");
  const [newFundName, setNewFundName] = reactExports.useState("");
  const [newFundIcon, setNewFundIcon] = reactExports.useState("💰");
  const [newFundTarget, setNewFundTarget] = reactExports.useState("");
  const [newFundDueDay, setNewFundDueDay] = reactExports.useState("25");
  const dailyTargets = getDailyProvisionTarget();
  const totalReserves = getTotalSafeAndProvisions();
  const totalProvisions = sinkingFunds.reduce((sum, f) => sum + f.currentBalance, 0);
  const formatDate = (date2) => {
    const d = typeof date2 === "string" ? new Date(date2) : date2;
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  };
  const getDaysUntilDue = (dueDay) => {
    const today = /* @__PURE__ */ new Date();
    const currentDay = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    if (currentDay <= dueDay) {
      return dueDay - currentDay;
    } else {
      return daysInMonth - currentDay + dueDay;
    }
  };
  const getFundStatus = (fund) => {
    const currentDay = (/* @__PURE__ */ new Date()).getDate();
    const daysInMonth = new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth() + 1, 0).getDate();
    const expectedProgress = currentDay / daysInMonth;
    const expectedAmount = fund.targetAmount * expectedProgress;
    if (fund.currentBalance >= fund.targetAmount) return "complete";
    if (fund.currentBalance >= expectedAmount * 0.9) return "ontrack";
    if (fund.currentBalance >= expectedAmount * 0.5) return "behind";
    return "critical";
  };
  const handleSafeDeposit = () => {
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) return;
    depositToSafe(amountValue, reason || "Dépôt au coffre", "Caissier");
    setShowSafeDepositModal(false);
    setAmount("");
    setReason("");
  };
  const handleSafeWithdraw = () => {
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0 || amountValue > safeBalance) return;
    withdrawFromSafe(amountValue, reason || "Retrait du coffre", "Caissier");
    setShowSafeWithdrawModal(false);
    setAmount("");
    setReason("");
  };
  const handleFundContribution = () => {
    if (!selectedFund) return;
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) return;
    contributeToFund(selectedFund.id, amountValue, reason || "Provision", "Caissier");
    setShowFundModal(false);
    setSelectedFund(null);
    setAmount("");
    setReason("");
  };
  const handleFundWithdrawal = () => {
    if (!selectedFund) return;
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0 || amountValue > selectedFund.currentBalance) return;
    withdrawFromFund(selectedFund.id, amountValue, reason || "Paiement", "Caissier");
    setShowFundModal(false);
    setSelectedFund(null);
    setAmount("");
    setReason("");
  };
  const handleUpdateTarget = () => {
    if (!selectedFund) return;
    const targetValue = parseFloat(newTarget);
    if (isNaN(targetValue) || targetValue <= 0) return;
    updateFundTarget(selectedFund.id, targetValue);
    setShowEditTargetModal(false);
    setSelectedFund(null);
    setNewTarget("");
  };
  const openFundModal = (fund, mode) => {
    setSelectedFund(fund);
    setModalMode(mode);
    setShowFundModal(true);
  };
  const openEditTargetModal = (fund) => {
    setSelectedFund(fund);
    setNewTarget(fund.targetAmount.toString());
    setShowEditTargetModal(true);
  };
  const handleCreateFund = () => {
    const targetValue = parseFloat(newFundTarget);
    if (!newFundName || isNaN(targetValue) || targetValue <= 0) return;
    addSinkingFund({
      name: newFundName,
      icon: newFundIcon,
      color: "#10b981",
      targetAmount: targetValue,
      dueDay: parseInt(newFundDueDay) || 25,
      isRecurring: true,
      category: "custom"
    });
    setShowNewFundModal(false);
    setNewFundName("");
    setNewFundIcon("💰");
    setNewFundTarget("");
    setNewFundDueDay("25");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.savings, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.overviewGrid, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.safeCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.safeIcon, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 32 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.safeInfo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.safeLabel, children: "Coffre" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.safeValue, children: formatCurrency(safeBalance) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.safeActions, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$3.depositBtn, onClick: () => setShowSafeDepositModal(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
            " Dépôt"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$3.withdrawBtn, onClick: () => setShowSafeWithdrawModal(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 16 }),
            " Retrait"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.provisionsCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.provisionsIcon, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { size: 32 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.provisionsInfo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.provisionsLabel, children: "Total Provisions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.provisionsValue, children: formatCurrency(totalProvisions) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.dailyTarget, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Objectif quotidien: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(dailyTargets.total) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.totalCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.totalIcon, children: /* @__PURE__ */ jsxRuntimeExports.jsx(PiggyBank, { size: 32 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.totalInfo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.totalLabel, children: "Réserves Totales" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.totalValue, children: formatCurrency(totalReserves) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.totalBreakdown, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Coffre + Provisions" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.fundsSection, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.fundsSectionHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Cagnottes & Provisions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles$3.sectionHint, children: "Mettez de l'argent de côté chaque jour pour vos charges fixes" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$3.addFundBtn, onClick: () => setShowNewFundModal(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
          " Nouvelle cagnotte"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.fundsGrid, children: sinkingFunds.map((fund) => {
        const status = getFundStatus(fund);
        const daysUntilDue = getDaysUntilDue(fund.dueDay);
        const progressPercent2 = Math.min(100, fund.currentBalance / fund.targetAmount * 100);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$3.fundCard} ${styles$3[status]}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.fundHeader, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.fundIcon, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: fund.icon }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.fundInfo, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.fundName, children: fund.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$3.fundDue, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 12 }),
                "Échéance: ",
                daysUntilDue,
                "j"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: styles$3.editBtn,
                onClick: () => openEditTargetModal(fund),
                title: "Modifier l'objectif",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 14 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.fundProgress, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.fundAmounts, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.currentAmount, children: formatCurrency(fund.currentBalance) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$3.targetAmount, children: [
                "/ ",
                formatCurrency(fund.targetAmount)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.progressWrapper, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: styles$3.progressBar,
                style: { width: `${progressPercent2}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$3.progressPercent, children: [
              Math.round(progressPercent2),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.fundStatus, children: [
            status === "complete" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$3.statusComplete, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 14 }),
              " Objectif atteint"
            ] }),
            status === "ontrack" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$3.statusOntrack, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 14 }),
              " En bonne voie"
            ] }),
            status === "behind" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$3.statusBehind, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14 }),
              " En retard"
            ] }),
            status === "critical" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$3.statusCritical, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14 }),
              " Critique"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.fundActions, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => openFundModal(fund, "contribute"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
              " Ajouter"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => openFundModal(fund, "withdraw"),
                disabled: fund.currentBalance === 0,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 14 }),
                  " Utiliser"
                ]
              }
            )
          ] })
        ] }, fund.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.historyCard, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.cardHeader, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(History, { size: 18 }),
        " Historique récent"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.historyList, children: safeTransactions.length === 0 && sinkingFunds.every((f) => f.history.length === 0) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.emptyState, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PiggyBank, { size: 48 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Aucune transaction pour le moment" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        safeTransactions.slice(0, 5).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.historyItem, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.historyLeft, children: [
            t.type === "deposit" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { size: 20, className: styles$3.depositIcon }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { size: 20, className: styles$3.withdrawIcon }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.historyReason, children: t.reason }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$3.historyMeta, children: [
                "Coffre • ",
                formatDate(t.date),
                " • ",
                t.performedBy
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `${styles$3.historyAmount} ${t.type === "deposit" ? styles$3.positive : styles$3.negative}`, children: [
            t.type === "deposit" ? "+" : "-",
            formatCurrency(t.amount)
          ] })
        ] }, t.id)),
        sinkingFunds.flatMap(
          (f) => f.history.slice(0, 3).map((t) => ({
            ...t,
            fundName: f.name,
            fundIcon: f.icon
          }))
        ).slice(0, 5).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.historyItem, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.historyLeft, children: [
            t.type === "contribution" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { size: 20, className: styles$3.depositIcon }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { size: 20, className: styles$3.withdrawIcon }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$3.historyReason, children: [
                t.fundIcon,
                " ",
                t.reason
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$3.historyMeta, children: [
                t.fundName,
                " • ",
                formatDate(t.date),
                " • ",
                t.performedBy
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `${styles$3.historyAmount} ${t.type === "contribution" ? styles$3.positive : styles$3.negative}`, children: [
            t.type === "contribution" ? "+" : "-",
            formatCurrency(t.amount)
          ] })
        ] }, t.id))
      ] }) })
    ] }),
    showSafeDepositModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.overlay, onClick: () => setShowSafeDepositModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Dépôt au coffre" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowSafeDepositModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Montant (DA)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: amount,
            onChange: (e) => setAmount(e.target.value),
            placeholder: "0",
            autoFocus: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Motif (optionnel)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: reason,
            onChange: (e) => setReason(e.target.value),
            placeholder: "Ex: Bénéfices du jour"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowSafeDepositModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: styles$3.confirmBtn,
            onClick: handleSafeDeposit,
            disabled: !amount || parseFloat(amount) <= 0,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
              " Déposer"
            ]
          }
        )
      ] })
    ] }) }),
    showSafeWithdrawModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.overlay, onClick: () => setShowSafeWithdrawModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Retrait du coffre" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowSafeWithdrawModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.currentBalance, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 16 }),
          " Solde actuel: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(safeBalance) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Montant (DA)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: amount,
            onChange: (e) => setAmount(e.target.value),
            placeholder: "0",
            autoFocus: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Motif" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: reason,
            onChange: (e) => setReason(e.target.value),
            placeholder: "Ex: Paiement fournisseur"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowSafeWithdrawModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: styles$3.dangerBtn,
            onClick: handleSafeWithdraw,
            disabled: !amount || parseFloat(amount) <= 0 || parseFloat(amount) > safeBalance,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 18 }),
              " Retirer"
            ]
          }
        )
      ] })
    ] }) }),
    showFundModal && selectedFund && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.overlay, onClick: () => setShowFundModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
          selectedFund.icon,
          " ",
          modalMode === "contribute" ? "Ajouter à" : "Utiliser depuis",
          " ",
          selectedFund.name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowFundModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.currentBalance, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { size: 16 }),
          " Solde actuel: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(selectedFund.currentBalance) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Montant (DA)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: amount,
            onChange: (e) => setAmount(e.target.value),
            placeholder: "0",
            autoFocus: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Motif" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: reason,
            onChange: (e) => setReason(e.target.value),
            placeholder: modalMode === "contribute" ? "Ex: Provision journalière" : "Ex: Paiement salaires"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowFundModal(false), children: "Annuler" }),
        modalMode === "contribute" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: styles$3.confirmBtn,
            onClick: handleFundContribution,
            disabled: !amount || parseFloat(amount) <= 0,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
              " Ajouter"
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: styles$3.dangerBtn,
            onClick: handleFundWithdrawal,
            disabled: !amount || parseFloat(amount) <= 0 || parseFloat(amount) > selectedFund.currentBalance,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 18 }),
              " Utiliser"
            ]
          }
        )
      ] })
    ] }) }),
    showEditTargetModal && selectedFund && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.overlay, onClick: () => setShowEditTargetModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
          selectedFund.icon,
          " Modifier l'objectif"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowEditTargetModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: styles$3.hint, children: [
          'Définissez le montant mensuel à provisionner pour "',
          selectedFund.name,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Objectif mensuel (DA)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: newTarget,
            onChange: (e) => setNewTarget(e.target.value),
            placeholder: "0",
            autoFocus: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: styles$3.dailyCalc, children: [
          "= ",
          formatCurrency(Math.round((parseFloat(newTarget) || 0) / 30)),
          "/jour"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowEditTargetModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: styles$3.confirmBtn,
            onClick: handleUpdateTarget,
            disabled: !newTarget || parseFloat(newTarget) <= 0,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 18 }),
              " Enregistrer"
            ]
          }
        )
      ] })
    ] }) }),
    showNewFundModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.overlay, onClick: () => setShowNewFundModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "💰 Nouvelle cagnotte" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowNewFundModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Nom de la cagnotte" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: newFundName,
            onChange: (e) => setNewFundName(e.target.value),
            placeholder: "Ex: Impôts, Assurance, Maintenance...",
            autoFocus: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Icône (emoji)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.emojiPicker, children: ["💰", "🏠", "📱", "🚗", "💼", "🎓", "🏥", "⚡", "🛠️", "📊"].map((emoji) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: newFundIcon === emoji ? styles$3.selectedEmoji : "",
            onClick: () => setNewFundIcon(emoji),
            children: emoji
          },
          emoji
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Objectif mensuel (DA)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: newFundTarget,
            onChange: (e) => setNewFundTarget(e.target.value),
            placeholder: "50000"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: styles$3.dailyCalc, children: [
          "= ",
          formatCurrency(Math.round((parseFloat(newFundTarget) || 0) / 30)),
          "/jour"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Jour d'échéance (1-31)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: newFundDueDay,
            onChange: (e) => setNewFundDueDay(e.target.value),
            min: "1",
            max: "31"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowNewFundModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: styles$3.confirmBtn,
            onClick: handleCreateFund,
            disabled: !newFundName || !newFundTarget || parseFloat(newFundTarget) <= 0,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
              " Créer la cagnotte"
            ]
          }
        )
      ] })
    ] }) })
  ] });
};
const expenses = "_expenses_cmxw2_6";
const summaryRow = "_summaryRow_cmxw2_16";
const summaryCard = "_summaryCard_cmxw2_22";
const expenseIcon = "_expenseIcon_cmxw2_33";
const monthIcon = "_monthIcon_cmxw2_34";
const summaryLabel = "_summaryLabel_cmxw2_59";
const summaryValue = "_summaryValue_cmxw2_64";
const statusCards = "_statusCards_cmxw2_70";
const statusCard = "_statusCard_cmxw2_70";
const unpaid = "_unpaid_cmxw2_85";
const paid = "_paid_cmxw2_90";
const categoriesBreakdown = "_categoriesBreakdown_cmxw2_103";
const categoryChip = "_categoryChip_cmxw2_109";
const toolbar = "_toolbar_cmxw2_128";
const searchBox = "_searchBox_cmxw2_135";
const statusFilter = "_statusFilter_cmxw2_170";
const active$1 = "_active_cmxw2_188";
const newBtn = "_newBtn_cmxw2_197";
const expensesList = "_expensesList_cmxw2_220";
const emptyState$1 = "_emptyState_cmxw2_226";
const expenseCard = "_expenseCard_cmxw2_238";
const expenseLeft = "_expenseLeft_cmxw2_258";
const categoryIcon = "_categoryIcon_cmxw2_265";
const expenseInfo = "_expenseInfo_cmxw2_269";
const expenseDesc = "_expenseDesc_cmxw2_275";
const expenseMeta = "_expenseMeta_cmxw2_281";
const expenseRight = "_expenseRight_cmxw2_289";
const expenseAmount = "_expenseAmount_cmxw2_296";
const paymentBadge = "_paymentBadge_cmxw2_302";
const cash = "_cash_cmxw2_308";
const bank = "_bank_cmxw2_313";
const check = "_check_cmxw2_318";
const expenseStatus = "_expenseStatus_cmxw2_323";
const paidBadge = "_paidBadge_cmxw2_327";
const payBtn = "_payBtn_cmxw2_338";
const expenseActions = "_expenseActions_cmxw2_357";
const deleteBtn = "_deleteBtn_cmxw2_381";
const overlay$1 = "_overlay_cmxw2_390";
const fadeIn = "_fadeIn_cmxw2_1";
const modal$1 = "_modal_cmxw2_412";
const slideUp = "_slideUp_cmxw2_1";
const modalHeader$1 = "_modalHeader_cmxw2_434";
const modalBody$1 = "_modalBody_cmxw2_460";
const formGroup$1 = "_formGroup_cmxw2_467";
const formRow = "_formRow_cmxw2_497";
const categoryGrid = "_categoryGrid_cmxw2_503";
const categoryBtn = "_categoryBtn_cmxw2_509";
const selected = "_selected_cmxw2_531";
const expensePreview = "_expensePreview_cmxw2_542";
const previewAmount = "_previewAmount_cmxw2_565";
const hint$1 = "_hint_cmxw2_571";
const paymentOptions = "_paymentOptions_cmxw2_577";
const paymentOption = "_paymentOption_cmxw2_577";
const modalFooter$1 = "_modalFooter_cmxw2_625";
const confirmBtn$1 = "_confirmBtn_cmxw2_647";
const styles$2 = {
  expenses,
  summaryRow,
  summaryCard,
  expenseIcon,
  monthIcon,
  summaryLabel,
  summaryValue,
  statusCards,
  statusCard,
  unpaid,
  paid,
  categoriesBreakdown,
  categoryChip,
  toolbar,
  searchBox,
  statusFilter,
  active: active$1,
  newBtn,
  expensesList,
  emptyState: emptyState$1,
  expenseCard,
  expenseLeft,
  categoryIcon,
  expenseInfo,
  expenseDesc,
  expenseMeta,
  expenseRight,
  expenseAmount,
  paymentBadge,
  cash,
  bank,
  check,
  expenseStatus,
  paidBadge,
  payBtn,
  expenseActions,
  deleteBtn,
  overlay: overlay$1,
  fadeIn,
  modal: modal$1,
  slideUp,
  modalHeader: modalHeader$1,
  modalBody: modalBody$1,
  formGroup: formGroup$1,
  formRow,
  categoryGrid,
  categoryBtn,
  selected,
  expensePreview,
  previewAmount,
  hint: hint$1,
  paymentOptions,
  paymentOption,
  modalFooter: modalFooter$1,
  confirmBtn: confirmBtn$1
};
const EXPENSE_CATEGORIES = [
  { id: "supplies", name: "Fournitures", icon: "📦", emoji: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 20 }) },
  { id: "utilities", name: "Charges", icon: "⚡", emoji: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 20 }) },
  { id: "rent", name: "Loyer", icon: "🏠", emoji: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { size: 20 }) },
  { id: "transport", name: "Transport", icon: "🚛", emoji: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 20 }) },
  { id: "maintenance", name: "Entretien", icon: "🔧", emoji: /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { size: 20 }) },
  { id: "salary", name: "Salaires", icon: "👥", emoji: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 20 }) },
  { id: "admin", name: "Administratif", icon: "📋", emoji: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { size: 20 }) },
  { id: "other", name: "Autres", icon: "📄", emoji: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 20 }) }
];
const Expenses = () => {
  const { formatCurrency } = useSettings();
  const {
    expenses: expenses2,
    addExpense,
    markExpenseAsPaid,
    deleteExpense,
    sinkingFunds,
    safeBalance
  } = useTreasuryFacade();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [filterCategory, setFilterCategory] = reactExports.useState("all");
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const [showNewModal, setShowNewModal] = reactExports.useState(false);
  const [showPayModal, setShowPayModal] = reactExports.useState(false);
  const [selectedExpense, setSelectedExpense] = reactExports.useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = reactExports.useState(false);
  const [expenseToDelete, setExpenseToDelete] = reactExports.useState(null);
  const [newExpense, setNewExpense] = reactExports.useState({
    description: "",
    amount: "",
    category: "supplies",
    paymentMethod: "cash",
    reference: ""
  });
  const totalExpenses = reactExports.useMemo(() => expenses2.reduce((sum, e) => sum + e.amount, 0), [expenses2]);
  const unpaidExpenses = reactExports.useMemo(() => expenses2.filter((e) => !e.isPaid), [expenses2]);
  const paidExpenses = reactExports.useMemo(() => expenses2.filter((e) => e.isPaid), [expenses2]);
  const categoryTotals = reactExports.useMemo(() => EXPENSE_CATEGORIES.map((cat) => ({
    ...cat,
    total: expenses2.filter((e) => e.category === cat.id).reduce((sum, e) => sum + e.amount, 0),
    count: expenses2.filter((e) => e.category === cat.id).length
  })).filter((cat) => cat.total > 0), [expenses2]);
  const currentMonth = (/* @__PURE__ */ new Date()).getMonth();
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const monthlyTotal = reactExports.useMemo(() => expenses2.filter((e) => {
    const date2 = new Date(e.date);
    return date2.getMonth() === currentMonth && date2.getFullYear() === currentYear;
  }).reduce((sum, e) => sum + e.amount, 0), [expenses2, currentMonth, currentYear]);
  const filteredExpenses = reactExports.useMemo(
    () => expenses2.filter((e) => {
      const matchesSearch = e.description.toLowerCase().includes(searchQuery.toLowerCase()) || e.reference?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "all" || e.category === filterCategory;
      const matchesStatus = filterStatus === "all" || filterStatus === "paid" && e.isPaid || filterStatus === "unpaid" && !e.isPaid;
      return matchesSearch && matchesCategory && matchesStatus;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [expenses2, searchQuery, filterCategory, filterStatus]
  );
  const getCategoryInfo = (categoryId) => {
    return EXPENSE_CATEGORIES.find((c) => c.id === categoryId) || EXPENSE_CATEGORIES[7];
  };
  const formatDate = (date2) => {
    return new Date(date2).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  };
  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount) return;
    addExpense({
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      paymentMethod: newExpense.paymentMethod,
      reference: newExpense.reference || void 0
    });
    setNewExpense({ description: "", amount: "", category: "supplies", paymentMethod: "cash", reference: "" });
    setShowNewModal(false);
  };
  const handleMarkAsPaid = (paidFrom) => {
    if (!selectedExpense) return;
    markExpenseAsPaid(selectedExpense.id, paidFrom);
    setShowPayModal(false);
    setSelectedExpense(null);
  };
  const handleDeleteExpense = (id) => {
    setExpenseToDelete(id);
    setShowDeleteConfirm(true);
  };
  const confirmDelete = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete);
    }
    setShowDeleteConfirm(false);
    setExpenseToDelete(null);
  };
  const openPayModal = (expense) => {
    setSelectedExpense(expense);
    setShowPayModal(true);
  };
  const getSalariesFund = sinkingFunds.find((f) => f.category === "salaries");
  const getChargesFund = sinkingFunds.find((f) => f.category === "fixedCharges");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.expenses, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.summaryRow, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.summaryCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.expenseIcon, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.summaryLabel, children: "Total des dépenses" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.summaryValue, children: formatCurrency(totalExpenses) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.summaryCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.monthIcon, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.summaryLabel, children: "Ce mois-ci" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.summaryValue, children: formatCurrency(monthlyTotal) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.statusCards, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$2.statusCard} ${styles$2.unpaid}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            unpaidExpenses.length,
            " impayées"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(unpaidExpenses.reduce((s, e) => s + e.amount, 0)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$2.statusCard} ${styles$2.paid}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            paidExpenses.length,
            " payées"
          ] })
        ] })
      ] })
    ] }),
    categoryTotals.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.categoriesBreakdown, children: categoryTotals.slice(0, 5).map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.categoryChip, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: cat.icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: cat.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(cat.total) })
    ] }, cat.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.toolbar, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.searchBox, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Rechercher une dépense...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value: filterCategory,
          onChange: (e) => setFilterCategory(e.target.value),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "Toutes les catégories" }),
            EXPENSE_CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: cat.id, children: [
              cat.icon,
              " ",
              cat.name
            ] }, cat.id))
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.statusFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: filterStatus === "all" ? styles$2.active : "",
            onClick: () => setFilterStatus("all"),
            children: "Toutes"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: filterStatus === "unpaid" ? styles$2.active : "",
            onClick: () => setFilterStatus("unpaid"),
            children: "Impayées"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: filterStatus === "paid" ? styles$2.active : "",
            onClick: () => setFilterStatus("paid"),
            children: "Payées"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$2.newBtn, onClick: () => setShowNewModal(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
        "Nouvelle dépense"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.expensesList, children: filteredExpenses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.emptyState, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { size: 48 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Aucune dépense trouvée" })
    ] }) : filteredExpenses.map((expense) => {
      const category = getCategoryInfo(expense.category);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$2.expenseCard} ${expense.isPaid ? styles$2.paid : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.expenseLeft, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.categoryIcon, children: category.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.expenseInfo, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.expenseDesc, children: expense.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$2.expenseMeta, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 12 }),
              formatDate(expense.date),
              expense.reference && ` • ${expense.reference}`
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.expenseRight, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$2.expenseAmount, children: [
            "-",
            formatCurrency(expense.amount)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${styles$2.paymentBadge} ${styles$2[expense.paymentMethod]}`, children: expense.paymentMethod === "cash" ? "Espèces" : expense.paymentMethod === "bank" ? "Virement" : "Chèque" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.expenseStatus, children: expense.isPaid ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$2.paidBadge, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 14 }),
          " Payée",
          expense.paidFrom && ` (${expense.paidFrom === "safe" ? "Coffre" : expense.paidFrom === "provision" ? "Provision" : "Caisse"})`
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: styles$2.payBtn,
            onClick: () => openPayModal(expense),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 14 }),
              " Payer"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.expenseActions, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: styles$2.deleteBtn,
            onClick: () => handleDeleteExpense(expense.id),
            title: "Supprimer",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 })
          }
        ) })
      ] }, expense.id);
    }) }),
    showNewModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.overlay, onClick: () => setShowNewModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Nouvelle dépense" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowNewModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.formGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: newExpense.description,
              onChange: (e) => setNewExpense({ ...newExpense, description: e.target.value }),
              placeholder: "Ex: Facture électricité",
              autoFocus: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.formRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Montant (DA)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                value: newExpense.amount,
                onChange: (e) => setNewExpense({ ...newExpense, amount: e.target.value }),
                placeholder: "0"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Mode de paiement" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: newExpense.paymentMethod,
                onChange: (e) => setNewExpense({ ...newExpense, paymentMethod: e.target.value }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "cash", children: "Espèces" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "bank", children: "Virement" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "check", children: "Chèque" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.formGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Catégorie" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.categoryGrid, children: EXPENSE_CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: `${styles$2.categoryBtn} ${newExpense.category === cat.id ? styles$2.selected : ""}`,
              onClick: () => setNewExpense({ ...newExpense, category: cat.id }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "1.5rem" }, children: cat.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: cat.name })
              ]
            },
            cat.id
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.formGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Référence (optionnel)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: newExpense.reference,
              onChange: (e) => setNewExpense({ ...newExpense, reference: e.target.value }),
              placeholder: "Ex: FAC-2026-001"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowNewModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: styles$2.confirmBtn,
            onClick: handleAddExpense,
            disabled: !newExpense.description || !newExpense.amount,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 18 }),
              "Enregistrer"
            ]
          }
        )
      ] })
    ] }) }),
    showPayModal && selectedExpense && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.overlay, onClick: () => setShowPayModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Payer la dépense" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowPayModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.expensePreview, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: getCategoryInfo(selectedExpense.category).icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selectedExpense.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.previewAmount, children: formatCurrency(selectedExpense.amount) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles$2.hint, children: "Choisissez la source de paiement:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.paymentOptions, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: styles$2.paymentOption,
              onClick: () => handleMarkAsPaid("cash"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { size: 24 }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Caisse" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Payer depuis la caisse" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: styles$2.paymentOption,
              onClick: () => handleMarkAsPaid("safe"),
              disabled: safeBalance < selectedExpense.amount,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { size: 24 }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Coffre (",
                    formatCurrency(safeBalance),
                    ")"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: safeBalance >= selectedExpense.amount ? "Disponible" : "Insuffisant" })
                ] })
              ]
            }
          ),
          selectedExpense.category === "salary" && getSalariesFund && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: styles$2.paymentOption,
              onClick: () => handleMarkAsPaid("provision"),
              disabled: getSalariesFund.currentBalance < selectedExpense.amount,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 24 }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Provision Salaires (",
                    formatCurrency(getSalariesFund.currentBalance),
                    ")"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: getSalariesFund.currentBalance >= selectedExpense.amount ? "Disponible" : "Insuffisant" })
                ] })
              ]
            }
          ),
          ["utilities", "rent"].includes(selectedExpense.category) && getChargesFund && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: styles$2.paymentOption,
              onClick: () => handleMarkAsPaid("provision"),
              disabled: getChargesFund.currentBalance < selectedExpense.amount,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 24 }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Provision Charges (",
                    formatCurrency(getChargesFund.currentBalance),
                    ")"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: getChargesFund.currentBalance >= selectedExpense.amount ? "Disponible" : "Insuffisant" })
                ] })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.modalFooter, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowPayModal(false), children: "Annuler" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmModal,
      {
        isOpen: showDeleteConfirm,
        title: "Supprimer la dépense",
        message: "Êtes-vous sûr de vouloir supprimer cette dépense ?",
        confirmText: "Supprimer",
        cancelText: "Annuler",
        variant: "danger",
        onConfirm: confirmDelete,
        onCancel: () => setShowDeleteConfirm(false)
      }
    )
  ] });
};
const zReport = "_zReport_1vgt2_3";
const header$1 = "_header_1vgt2_10";
const headerLeft$1 = "_headerLeft_1vgt2_18";
const date = "_date_1vgt2_26";
const headerActions = "_headerActions_1vgt2_34";
const printBtn = "_printBtn_1vgt2_39";
const downloadBtn = "_downloadBtn_1vgt2_40";
const closeBtn = "_closeBtn_1vgt2_41";
const statusBanner = "_statusBanner_1vgt2_61";
const open = "_open_1vgt2_70";
const closed = "_closed_1vgt2_76";
const reportGrid = "_reportGrid_1vgt2_83";
const reportCard = "_reportCard_1vgt2_89";
const bigNumber = "_bigNumber_1vgt2_106";
const value = "_value_1vgt2_110";
const negative = "_negative_1vgt2_117";
const subtext = "_subtext_1vgt2_121";
const breakdown = "_breakdown_1vgt2_127";
const breakdownRow = "_breakdownRow_1vgt2_133";
const positive = "_positive_1vgt2_147";
const neutral = "_neutral_1vgt2_155";
const emptyState = "_emptyState_1vgt2_160";
const provisionsStatus = "_provisionsStatus_1vgt2_181";
const provisionsGrid = "_provisionsGrid_1vgt2_196";
const provisionItem = "_provisionItem_1vgt2_202";
const transfersSection = "_transfersSection_1vgt2_221";
const hint = "_hint_1vgt2_233";
const transferRow = "_transferRow_1vgt2_239";
const formGroup = "_formGroup_1vgt2_262";
const confirmBtn = "_confirmBtn_1vgt2_273";
const balanceSummary = "_balanceSummary_1vgt2_279";
const balanceRow = "_balanceRow_1vgt2_286";
const total = "_total_1vgt2_298";
const pastReports = "_pastReports_1vgt2_312";
const reportsList = "_reportsList_1vgt2_324";
const pastReportRow = "_pastReportRow_1vgt2_330";
const reportDate = "_reportDate_1vgt2_339";
const reportStats = "_reportStats_1vgt2_348";
const highlight = "_highlight_1vgt2_356";
const reportDiff = "_reportDiff_1vgt2_361";
const balanced = "_balanced_1vgt2_373";
const surplus = "_surplus_1vgt2_377";
const deficit = "_deficit_1vgt2_381";
const overlay = "_overlay_1vgt2_400";
const modal = "_modal_1vgt2_410";
const modalHeader = "_modalHeader_1vgt2_418";
const modalBody = "_modalBody_1vgt2_428";
const summaryBox = "_summaryBox_1vgt2_432";
const diffResult = "_diffResult_1vgt2_467";
const ok = "_ok_1vgt2_475";
const warn = "_warn_1vgt2_480";
const error = "_error_1vgt2_485";
const warning = "_warning_1vgt2_490";
const modalFooter = "_modalFooter_1vgt2_499";
const styles$1 = {
  zReport,
  header: header$1,
  headerLeft: headerLeft$1,
  date,
  headerActions,
  printBtn,
  downloadBtn,
  closeBtn,
  statusBanner,
  open,
  closed,
  reportGrid,
  reportCard,
  bigNumber,
  value,
  negative,
  subtext,
  breakdown,
  breakdownRow,
  positive,
  neutral,
  emptyState,
  provisionsStatus,
  provisionsGrid,
  provisionItem,
  transfersSection,
  hint,
  transferRow,
  formGroup,
  confirmBtn,
  balanceSummary,
  balanceRow,
  total,
  pastReports,
  reportsList,
  pastReportRow,
  reportDate,
  reportStats,
  highlight,
  reportDiff,
  balanced,
  surplus,
  deficit,
  overlay,
  modal,
  modalHeader,
  modalBody,
  summaryBox,
  diffResult,
  ok,
  warn,
  error,
  warning,
  modalFooter
};
const ZReport = () => {
  const { formatCurrency, settings: rawSettings } = useSettings();
  const settings = rawSettings;
  const toast = useToast();
  reactExports.useRef(null);
  const {
    currentSession,
    sessions,
    movements,
    sinkingFunds,
    safeBalance,
    getCurrentBalance,
    closeSession,
    depositToSafe,
    contributeToFund,
    getDailyProvisionTarget
  } = useTreasuryFacade();
  const [showCloseModal, setShowCloseModal] = reactExports.useState(false);
  const [closingAmount, setClosingAmount] = reactExports.useState("");
  const [closingNotes, setClosingNotes] = reactExports.useState("");
  const [isPrinting, setIsPrinting] = reactExports.useState(false);
  const [isExporting, setIsExporting] = reactExports.useState(false);
  const [transferToSafe, setTransferToSafe] = reactExports.useState("");
  const [transferSalaries, setTransferSalaries] = reactExports.useState("");
  const [transferBankCredit, setTransferBankCredit] = reactExports.useState("");
  const [transferCharges, setTransferCharges] = reactExports.useState("");
  const todayReport = reactExports.useMemo(() => {
    if (!currentSession) return null;
    const sessionMovements = movements.filter((m) => m.sessionId === currentSession.id);
    const sales2 = sessionMovements.filter((m) => m.type === "sale");
    const refunds = sessionMovements.filter((m) => m.type === "refund");
    const expenses2 = sessionMovements.filter((m) => m.type === "expense");
    const deposits = sessionMovements.filter((m) => m.type === "deposit");
    const withdrawals = sessionMovements.filter((m) => m.type === "withdrawal");
    const toSafe = sessionMovements.filter((m) => m.type === "transfer_to_safe");
    const toProvisions = sessionMovements.filter((m) => m.type === "transfer_to_provision");
    const totalSales = sales2.reduce((s, m) => s + m.amount, 0);
    const salesCount = sales2.length;
    return {
      date: new Date(currentSession.openedAt),
      openingBalance: currentSession.openingBalance,
      totalSales,
      salesCount,
      averageTicket: salesCount > 0 ? Math.round(totalSales / salesCount) : 0,
      cashSales: totalSales,
      cardSales: 0,
      dahabiaSales: 0,
      refunds: refunds.reduce((s, m) => s + m.amount, 0),
      refundsCount: refunds.length,
      expenses: expenses2.reduce((s, m) => s + m.amount, 0),
      expensesCount: expenses2.length,
      deposits: deposits.reduce((s, m) => s + m.amount, 0),
      withdrawals: withdrawals.reduce((s, m) => s + m.amount, 0),
      transfersToSafe: toSafe.reduce((s, m) => s + m.amount, 0),
      transfersToProvisions: toProvisions.reduce((s, m) => s + m.amount, 0),
      status: currentSession.status,
      cashierName: currentSession.cashierName
    };
  }, [currentSession, movements]);
  const pastReports2 = reactExports.useMemo(() => {
    return sessions.filter((s) => s.status === "closed").slice(0, 7).map((s) => {
      const sessionMovements = movements.filter((m) => m.sessionId === s.id);
      const totalSales = sessionMovements.filter((m) => m.type === "sale").reduce((sum, m) => sum + m.amount, 0);
      const salesCount = sessionMovements.filter((m) => m.type === "sale").length;
      return {
        id: s.id,
        date: new Date(s.openedAt),
        closedAt: s.closedAt ? new Date(s.closedAt) : null,
        closedBy: s.cashierName,
        totalSales,
        salesCount,
        difference: s.difference || 0,
        openingBalance: s.openingBalance,
        closingBalance: s.closingBalance || 0
      };
    });
  }, [sessions, movements]);
  const theoreticalBalance = getCurrentBalance();
  const dailyTargets = getDailyProvisionTarget();
  const formatDate = (date2) => date2.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const formatDateShort = (date2) => date2.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "-");
  const formatTime = (date2) => date2.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const storeName = settings?.general?.storeName || "Asgard Pro";
      const dateStr = formatDateShort(/* @__PURE__ */ new Date());
      const filename = `RapportZ_${dateStr}_${storeName.replace(/\s+/g, "-")}`;
      const reportHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport Z - ${dateStr}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #4285F4;
            --primary-light: #E8F0FE;
            --success: #34C759;
            --success-light: #EBF7EE;
            --warning: #FBBC04;
            --danger: #EA4335;
            --text-dark: #1F2937;
            --text-gray: #6B7280;
            --text-light: #9CA3AF;
            --bg-light: #F9FAFB;
            --border: #E5E7EB;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', -apple-system, sans-serif; 
            background: #F3F4F6; 
            color: var(--text-dark);
            line-height: 1.5;
            -webkit-print-color-adjust: exact;
        }

        .page {
            max-width: 800px;
            margin: 40px auto;
            background: white;
            min-height: 297mm;
            padding: 50px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            position: relative;
            overflow: hidden;
            border-radius: 12px;
        }

        .gradient-top {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 8px;
            background: linear-gradient(to right, var(--primary), var(--success));
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 1px solid var(--border);
        }

        .brand h1 {
            font-size: 24px;
            font-weight: 800;
            color: var(--primary);
            letter-spacing: -0.5px;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .brand .subtitle {
            color: var(--text-gray);
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
        }

        .report-info { text-align: right; }
        .report-info .title {
            font-size: 14px;
            font-weight: 700;
            color: var(--text-gray);
            margin-bottom: 4px;
            text-transform: uppercase;
        }
        .report-info .date { font-size: 16px; font-weight: 600; color: var(--text-dark); }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        }

        .metric-card {
            background: var(--bg-light);
            padding: 24px;
            border-radius: 16px;
            border: 1px solid var(--border);
        }
        .metric-card .label {
            font-size: 12px;
            font-weight: 600;
            color: var(--text-gray);
            text-transform: uppercase;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .metric-card .value {
            font-size: 24px;
            font-weight: 800;
            color: var(--text-dark);
        }
        .metric-card.highlight {
            background: var(--primary-light);
            border-color: rgba(66, 133, 244, 0.2);
        }
        .metric-card.highlight .value { color: var(--primary); }

        .section-title {
            font-size: 14px;
            font-weight: 700;
            color: var(--text-gray);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .section-title::after {
            content: '';
            flex: 1;
            height: 1px;
            background: var(--border);
        }

        .table-container { margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 12px; color: var(--text-gray); font-size: 12px; font-weight: 600; border-bottom: 1px solid var(--border); }
        td { padding: 16px 12px; border-bottom: 1px solid var(--bg-light); font-size: 14px; }
        .row-label { font-weight: 500; color: var(--text-dark); }
        .row-value { font-weight: 600; text-align: right; }
        .row-value.positive { color: var(--success); }
        .row-value.negative { color: var(--danger); }

        .balance-footer {
            margin-top: 40px;
            padding: 30px;
            background: var(--text-dark);
            border-radius: 20px;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .balance-footer .label { font-size: 16px; font-weight: 500; opacity: 0.8; }
        .balance-footer .amount { font-size: 32px; font-weight: 800; }

        .footer-note {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding-top: 20px;
            border-top: 1px solid var(--border);
        }
        .signature-box { width: 180px; text-align: center; }
        .signature-line { border-top: 1px solid var(--text-light); margin-top: 40px; padding-top: 8px; font-size: 11px; color: var(--text-gray); }
        .legal { font-size: 11px; color: var(--text-light); max-width: 300px; }

        @media print {
            body { background: white; }
            .page { margin: 0; box-shadow: none; border-radius: 0; width: 100%; }
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="gradient-top"></div>
        
        <div class="header">
            <div class="brand">
                <h1>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    ASGARD PRO
                </h1>
                <div class="subtitle">${storeName}</div>
            </div>
            <div class="report-info">
                <div class="title">Rapport Z de Clôture</div>
                <div class="date">${formatDate(/* @__PURE__ */ new Date())}</div>
                <div class="date" style="font-size: 12px; margin-top: 4px; opacity: 0.7;">Généré à ${formatTime(/* @__PURE__ */ new Date())}</div>
            </div>
        </div>

        ${todayReport ? `
        <div class="summary-grid">
            <div class="metric-card highlight">
                <div class="label">Ventes Totales</div>
                <div class="value">${formatCurrency(todayReport.totalSales)}</div>
            </div>
            <div class="metric-card">
                <div class="label">Volume Transactions</div>
                <div class="value">${todayReport.salesCount} Tickets</div>
            </div>
            <div class="metric-card">
                <div class="label">Panier Moyen</div>
                <div class="value">${formatCurrency(todayReport.averageTicket)}</div>
            </div>
        </div>

        <div class="section-title">Analyse Financière</div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th style="width: 70%">Désignation</th>
                        <th style="text-align: right">Montant (DA)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="row-label">Fond de Caisse (Ouverture)</td>
                        <td class="row-value">${formatCurrency(todayReport.openingBalance)}</td>
                    </tr>
                    <tr>
                        <td class="row-label">Ventes Espèces</td>
                        <td class="row-value positive">+ ${formatCurrency(todayReport.cashSales)}</td>
                    </tr>
                    <tr>
                        <td class="row-label">Autres Entrées (Dépôts)</td>
                        <td class="row-value positive">+ ${formatCurrency(todayReport.deposits)}</td>
                    </tr>
                    <tr>
                        <td class="row-label">Remboursements Articles</td>
                        <td class="row-value negative">- ${formatCurrency(todayReport.refunds)}</td>
                    </tr>
                    <tr>
                        <td class="row-label">Dépenses de Caisse</td>
                        <td class="row-value negative">- ${formatCurrency(todayReport.expenses)}</td>
                    </tr>
                    <tr>
                        <td class="row-label">Retraits Ponctualisés</td>
                        <td class="row-value negative">- ${formatCurrency(todayReport.withdrawals)}</td>
                    </tr>
                    <tr>
                        <td class="row-label">Transferts (Coffre & Provisions)</td>
                        <td class="row-value">- ${formatCurrency(todayReport.transfersToSafe + todayReport.transfersToProvisions)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="balance-footer">
            <div>
                <div class="label">SOLDE THÉORIQUE EN CAISSE</div>
                <div style="font-size: 11px; opacity: 0.6; margin-top: 4px;">À vérifier avec le montant réel compté</div>
            </div>
            <div class="amount">${formatCurrency(theoreticalBalance)}</div>
        </div>

        <div class="section-title" style="margin-top: 40px;">État des Réserves & Fonds</div>
        <div class="summary-grid" style="grid-template-columns: repeat(2, 1fr); margin-bottom: 20px;">
            <div class="metric-card">
                <div class="label">🔒 Coffre Fort</div>
                <div class="value" style="font-size: 20px;">${formatCurrency(safeBalance)}</div>
            </div>
            ${sinkingFunds.map((fund) => `
                <div class="metric-card">
                    <div class="label">${fund.icon} ${fund.name}</div>
                    <div class="value" style="font-size: 20px;">${formatCurrency(fund.currentBalance)}</div>
                    <div style="font-size: 11px; color: var(--text-gray); margin-top: 4px;">Objectif: ${formatCurrency(fund.targetAmount)}</div>
                </div>
            `).join("")}
        </div>
        ` : `
        <div style="text-align: center; padding: 100px 0; color: var(--text-gray);">
            <p>Aucune donnée disponible pour cette session.</p>
        </div>
        `}

        <div class="footer-note">
            <div class="legal">
                Ce document est un rapport officiel de clôture de journée généré par Asgard Pro. 
                Il doit être conservé pour la comptabilité et les audits de caisse.
                <br><br>
                <strong>Shop ID:</strong> ${settings?.general?.storeId || "ST-001"} | <strong>Opérateur:</strong> ${todayReport?.cashierName || "Admin"}
            </div>
            <div class="signature-box">
                <div class="signature-line">Signature du Caissier</div>
            </div>
            <div class="signature-box">
                <div class="signature-line">Validation Responsable</div>
            </div>
        </div>
    </div>
</body>
</html>`;
      const blob = new Blob([reportHTML], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      const printWindow = window.open("", "_blank", "width=800,height=900");
      if (printWindow) {
        printWindow.document.write(reportHTML);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 800);
      }
    } catch (error2) {
      console.error("Error exporting PDF:", error2);
      toast.error("Erreur lors de l'export");
    } finally {
      setIsExporting(false);
    }
  };
  const handleClose = () => {
    const amount = parseFloat(closingAmount);
    if (isNaN(amount) || amount < 0) return;
    const safeAmount = parseFloat(transferToSafe) || 0;
    const salariesAmount = parseFloat(transferSalaries) || 0;
    const bankCreditAmount = parseFloat(transferBankCredit) || 0;
    const chargesAmount = parseFloat(transferCharges) || 0;
    if (safeAmount > 0) {
      depositToSafe(safeAmount, "Clôture journée", currentSession?.cashierName || "Caissier");
    }
    if (salariesAmount > 0) {
      contributeToFund("salaries", salariesAmount, "Clôture journée", currentSession?.cashierName || "Caissier");
    }
    if (bankCreditAmount > 0) {
      contributeToFund("bankCredit", bankCreditAmount, "Clôture journée", currentSession?.cashierName || "Caissier");
    }
    if (chargesAmount > 0) {
      contributeToFund("fixedCharges", chargesAmount, "Clôture journée", currentSession?.cashierName || "Caissier");
    }
    closeSession(amount, closingNotes);
    setShowCloseModal(false);
    setClosingAmount("");
    setClosingNotes("");
    setTransferToSafe("");
    setTransferSalaries("");
    setTransferBankCredit("");
    setTransferCharges("");
  };
  if (!currentSession && sessions.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.zReport, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.emptyState, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileChartColumnIncreasing, { size: 64 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Aucune session de caisse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Ouvrez une session de caisse pour générer un rapport Z" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.zReport, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.header, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.headerLeft, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileChartColumnIncreasing, { size: 24 }),
          " Rapport Z - Clôture de journée"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.date, children: formatDate(/* @__PURE__ */ new Date()) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.headerActions, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$1.printBtn, onClick: handlePrint, disabled: isPrinting, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 18 }),
          " ",
          isPrinting ? "Impression..." : "Imprimer"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$1.downloadBtn, onClick: handleExportPDF, disabled: isExporting, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 18 }),
          " ",
          isExporting ? "Export..." : "Exporter PDF"
        ] }),
        currentSession?.status === "open" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$1.closeBtn, onClick: () => setShowCloseModal(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 18 }),
          " Clôturer la journée"
        ] })
      ] })
    ] }),
    currentSession ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${styles$1.statusBanner} ${currentSession.status === "open" ? styles$1.open : styles$1.closed}`, children: currentSession.status === "open" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 20 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Journée en cours depuis ",
        formatTime(new Date(currentSession.openedAt)),
        " - Ouverte par ",
        currentSession.cashierName
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 20 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Journée clôturée" })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$1.statusBanner} ${styles$1.closed}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 20 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Dernière session clôturée" })
    ] }),
    todayReport && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.reportGrid, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.reportCard, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 18 }),
            " Ventes"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.bigNumber, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.value, children: formatCurrency(todayReport.totalSales) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.subtext, children: [
              todayReport.salesCount,
              " ventes • Ticket moyen: ",
              formatCurrency(todayReport.averageTicket)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.breakdown, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.breakdownRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { size: 14 }),
                " Espèces"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCurrency(todayReport.cashSales) })
            ] }),
            todayReport.cardSales > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.breakdownRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 14 }),
                " CIB"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCurrency(todayReport.cardSales) })
            ] }),
            todayReport.dahabiaSales > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.breakdownRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { size: 14 }),
                " Dahabia"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCurrency(todayReport.dahabiaSales) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.reportCard, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 18 }),
            " Remboursements"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.bigNumber, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `${styles$1.value} ${styles$1.negative}`, children: [
              "-",
              formatCurrency(todayReport.refunds)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.subtext, children: [
              todayReport.refundsCount,
              " remboursement(s)"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.reportCard, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 18 }),
            " Dépenses"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.bigNumber, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `${styles$1.value} ${styles$1.negative}`, children: [
              "-",
              formatCurrency(todayReport.expenses)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.subtext, children: [
              todayReport.expensesCount,
              " dépense(s)"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.reportCard, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { size: 18 }),
            " Mouvements de caisse"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.breakdown, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.breakdownRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 14 }),
                " Dépôts"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.positive, children: [
                "+",
                formatCurrency(todayReport.deposits)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.breakdownRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 14 }),
                " Retraits"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.negative, children: [
                "-",
                formatCurrency(todayReport.withdrawals)
              ] })
            ] }),
            todayReport.transfersToSafe > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.breakdownRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PiggyBank, { size: 14 }),
                " Vers coffre"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.neutral, children: [
                "-",
                formatCurrency(todayReport.transfersToSafe)
              ] })
            ] }),
            todayReport.transfersToProvisions > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.breakdownRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 14 }),
                " Vers provisions"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.neutral, children: [
                "-",
                formatCurrency(todayReport.transfersToProvisions)
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.balanceSummary, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.balanceRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Fond de caisse (ouverture)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCurrency(todayReport.openingBalance) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.balanceRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "+ Ventes espèces" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.positive, children: [
            "+",
            formatCurrency(todayReport.cashSales)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.balanceRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "+ Dépôts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.positive, children: [
            "+",
            formatCurrency(todayReport.deposits)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.balanceRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "- Remboursements" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.negative, children: [
            "-",
            formatCurrency(todayReport.refunds)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.balanceRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "- Dépenses" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.negative, children: [
            "-",
            formatCurrency(todayReport.expenses)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.balanceRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "- Retraits" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.negative, children: [
            "-",
            formatCurrency(todayReport.withdrawals)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.balanceRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "- Transferts (coffre + provisions)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.neutral, children: [
            "-",
            formatCurrency(todayReport.transfersToSafe + todayReport.transfersToProvisions)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$1.balanceRow} ${styles$1.total}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "= Solde théorique en caisse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCurrency(theoreticalBalance) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.provisionsStatus, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PiggyBank, { size: 18 }),
        " État des réserves"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.provisionsGrid, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.provisionItem, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🔒 Coffre" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(safeBalance) })
        ] }),
        sinkingFunds.map((fund) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.provisionItem, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            fund.icon,
            " ",
            fund.name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(fund.currentBalance) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
            "/ ",
            formatCurrency(fund.targetAmount)
          ] })
        ] }, fund.id))
      ] })
    ] }),
    pastReports2.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.pastReports, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Historique des clôtures" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.reportsList, children: pastReports2.map((report) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.pastReportRow, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.reportDate, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 16 }),
          formatDate(report.date)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.reportStats, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            report.salesCount,
            " ventes"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.highlight, children: formatCurrency(report.totalSales) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.reportDiff, children: report.difference === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.balanced, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 14 }),
          " Équilibré"
        ] }) : report.difference > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.surplus, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 14 }),
          " +",
          report.difference,
          " DA"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.deficit, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 14 }),
          " ",
          report.difference,
          " DA"
        ] }) })
      ] }, report.id)) })
    ] }),
    showCloseModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.overlay, onClick: () => setShowCloseModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.modalHeader, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Clôturer la journée" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.modalBody, children: [
        todayReport && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.summaryBox, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Solde théorique:" }),
            " ",
            formatCurrency(theoreticalBalance)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Ventes du jour:" }),
            " ",
            formatCurrency(todayReport.totalSales)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Nombre de ventes:" }),
            " ",
            todayReport.salesCount
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.formGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Montant réel compté en caisse (DA)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              value: closingAmount,
              onChange: (e) => setClosingAmount(e.target.value),
              placeholder: theoreticalBalance.toString(),
              autoFocus: true
            }
          )
        ] }),
        closingAmount && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$1.diffResult} ${parseFloat(closingAmount) === theoreticalBalance ? styles$1.ok : Math.abs(parseFloat(closingAmount) - theoreticalBalance) <= 100 ? styles$1.warn : styles$1.error}`, children: [
          "Écart: ",
          formatCurrency(parseFloat(closingAmount) - theoreticalBalance)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.transfersSection, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Transferts de fin de journée (optionnel)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: styles$1.hint, children: [
            "Objectif quotidien: ",
            formatCurrency(dailyTargets.total)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.transferRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🔒 Coffre" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                value: transferToSafe,
                onChange: (e) => setTransferToSafe(e.target.value),
                placeholder: "0"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.transferRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "👥 Salaires (",
              formatCurrency(dailyTargets.salaries),
              "/j)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                value: transferSalaries,
                onChange: (e) => setTransferSalaries(e.target.value),
                placeholder: dailyTargets.salaries.toString()
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.transferRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "🏦 Crédit (",
              formatCurrency(dailyTargets.bankCredit),
              "/j)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                value: transferBankCredit,
                onChange: (e) => setTransferBankCredit(e.target.value),
                placeholder: dailyTargets.bankCredit.toString()
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.transferRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "⚡ Charges (",
              formatCurrency(dailyTargets.fixedCharges),
              "/j)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                value: transferCharges,
                onChange: (e) => setTransferCharges(e.target.value),
                placeholder: dailyTargets.fixedCharges.toString()
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.formGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Notes (optionnel)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: closingNotes,
              onChange: (e) => setClosingNotes(e.target.value),
              placeholder: "Observations de fin de journée...",
              rows: 2
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: styles$1.warning, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 16 }),
          "Cette action est irréversible. Assurez-vous d'avoir compté la caisse."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowCloseModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: styles$1.confirmBtn,
            onClick: handleClose,
            disabled: !closingAmount || parseFloat(closingAmount) < 0,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 18 }),
              " Clôturer la journée"
            ]
          }
        )
      ] })
    ] }) })
  ] });
};
const treasuryHub = "_treasuryHub_1v9gy_5";
const header = "_header_1v9gy_26";
const headerLeft = "_headerLeft_1v9gy_33";
const headerIcon = "_headerIcon_1v9gy_39";
const tabsNav = "_tabsNav_1v9gy_65";
const tabBtn = "_tabBtn_1v9gy_76";
const active = "_active_1v9gy_97";
const tabContent = "_tabContent_1v9gy_111";
const styles = {
  treasuryHub,
  header,
  headerLeft,
  headerIcon,
  tabsNav,
  tabBtn,
  active,
  tabContent
};
const TreasuryHub = () => {
  const [activeTab, setActiveTab] = reactExports.useState("cash-register");
  const tabs = [
    { id: "cash-register", label: "Caisse", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 20 }), component: /* @__PURE__ */ jsxRuntimeExports.jsx(CashRegister, {}) },
    { id: "goods-receipt", label: "Bon d'Entrée", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 20 }), component: /* @__PURE__ */ jsxRuntimeExports.jsx(GoodsReceiptTab, {}) },
    { id: "savings", label: "Épargne / Coffre", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PiggyBank, { size: 20 }), component: /* @__PURE__ */ jsxRuntimeExports.jsx(Savings, {}) },
    { id: "expenses", label: "Dépenses & Charges", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { size: 20 }), component: /* @__PURE__ */ jsxRuntimeExports.jsx(Expenses, {}) },
    { id: "z-report", label: "Rapport Z", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileChartColumnIncreasing, { size: 20 }), component: /* @__PURE__ */ jsxRuntimeExports.jsx(ZReport, {}) }
  ];
  const activeTabData = tabs.find((t) => t.id === activeTab);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.treasuryHub, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.header, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.headerLeft, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { size: 32, className: styles.headerIcon }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Trésorerie" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Gestion financière complète" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.tabsNav, children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: `${styles.tabBtn} ${activeTab === tab.id ? styles.active : ""}`,
        onClick: () => setActiveTab(tab.id),
        children: [
          tab.icon,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tab.label })
        ]
      },
      tab.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.tabContent, children: activeTabData?.component })
  ] });
};
export {
  GoodsReceipt,
  TreasuryHub as Treasury,
  TreasuryHub,
  TreasuryHub as default
};

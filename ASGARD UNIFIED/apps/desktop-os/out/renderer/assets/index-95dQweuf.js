import { j as jsxRuntimeExports } from "./vendor-state-DFI86SKa.js";
import { r as reactExports, u as useNavigate } from "./vendor-react-Df__x13C.js";
import { u as useSettings, a as useAuthStore, b as useSalesStore, c as useProductsStore, d as useCustomersStore } from "./index-BbOgUw3k.js";
import { u as useTreasuryFacade } from "./useTreasuryFacade-CchObU-E.js";
import { I as InsightsGenerator } from "./forecastingService-CdtV6Vuz.js";
import { u as useTranslation } from "./vendor-i18n-DeCNyroL.js";
import { R as RefreshCw, O as DollarSign, s as TrendingUp, Q as TrendingDown, V as Receipt, i as ShoppingCart, T as TriangleAlert, Y as Activity, Z as Zap, m as ChartColumn, _ as CreditCard, $ as CirclePlus, a0 as UserPlus, F as FileText, P as Package, a1 as ArrowRight, e as Clock, a2 as CircleX, j as Wallet, a3 as Brain, a4 as Sparkles, a5 as Eye, X } from "./vendor-ui-DiXyqbDT.js";
import { r as resolveDefaultProps, D as DefaultZIndexes, u as useAppDispatch, a as addDot, b as removeDot, c as useClipPathId, s as svgPropertiesAndEvents, Z as ZIndexLayer, L as Layer, d as clsx, C as CartesianLabelContextProvider, e as CartesianLabelFromLabelProp, f as useIsPanorama, g as useAppSelector, h as selectAxisScale, i as isNumOrStr, R as ResponsiveContainer, T as Tooltip, j as Label } from "./CategoricalChart-BNQNLo93.js";
import { c as createLabeledScales, D as Dot, A as AreaChart, C as CartesianGrid, X as XAxis, Y as YAxis, a as Area } from "./AreaChart-D_YS4Ytt.js";
import { R as ReferenceLine } from "./ReferenceLine-kLWu0j86.js";
import { P as PieChart, a as Pie, C as Cell } from "./PieChart-DaKadvC7.js";
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
var useCoordinate = (x, y, xAxisId, yAxisId, ifOverflow) => {
  var isX = isNumOrStr(x);
  var isY = isNumOrStr(y);
  var isPanorama = useIsPanorama();
  var xAxisScale = useAppSelector((state) => selectAxisScale(state, "xAxis", xAxisId, isPanorama));
  var yAxisScale = useAppSelector((state) => selectAxisScale(state, "yAxis", yAxisId, isPanorama));
  if (!isX || !isY || xAxisScale == null || yAxisScale == null) {
    return null;
  }
  var scales = createLabeledScales({
    x: xAxisScale,
    y: yAxisScale
  });
  var result = scales.apply({
    x,
    y
  }, {
    bandAware: true
  });
  if (ifOverflow === "discard" && !scales.isInRange(result)) {
    return null;
  }
  return result;
};
function ReportReferenceDot(props) {
  var dispatch = useAppDispatch();
  reactExports.useEffect(() => {
    dispatch(addDot(props));
    return () => {
      dispatch(removeDot(props));
    };
  });
  return null;
}
var renderDot = (option, props) => {
  var dot;
  if (/* @__PURE__ */ reactExports.isValidElement(option)) {
    dot = /* @__PURE__ */ reactExports.cloneElement(option, props);
  } else if (typeof option === "function") {
    dot = option(props);
  } else {
    dot = /* @__PURE__ */ reactExports.createElement(Dot, _extends({}, props, {
      cx: props.cx,
      cy: props.cy,
      className: "recharts-reference-dot-dot"
    }));
  }
  return dot;
};
function ReferenceDotImpl(props) {
  var {
    x,
    y,
    r
  } = props;
  var clipPathId = useClipPathId();
  var coordinate = useCoordinate(x, y, props.xAxisId, props.yAxisId, props.ifOverflow);
  if (!coordinate) {
    return null;
  }
  var {
    x: cx,
    y: cy
  } = coordinate;
  var {
    shape,
    className,
    ifOverflow
  } = props;
  var clipPath = ifOverflow === "hidden" ? "url(#".concat(clipPathId, ")") : void 0;
  var dotProps = _objectSpread(_objectSpread({
    clipPath
  }, svgPropertiesAndEvents(props)), {}, {
    cx,
    cy
  });
  return /* @__PURE__ */ reactExports.createElement(ZIndexLayer, {
    zIndex: props.zIndex
  }, /* @__PURE__ */ reactExports.createElement(Layer, {
    className: clsx("recharts-reference-dot", className)
  }, renderDot(shape, dotProps), /* @__PURE__ */ reactExports.createElement(CartesianLabelContextProvider, {
    x: cx - r,
    y: cy - r,
    width: 2 * r,
    height: 2 * r,
    upperWidth: 2 * r,
    lowerWidth: 2 * r
  }, /* @__PURE__ */ reactExports.createElement(CartesianLabelFromLabelProp, {
    label: props.label
  }), props.children)));
}
var referenceDotDefaultProps = {
  ifOverflow: "discard",
  xAxisId: 0,
  yAxisId: 0,
  r: 10,
  fill: "#fff",
  stroke: "#ccc",
  fillOpacity: 1,
  strokeWidth: 1,
  zIndex: DefaultZIndexes.scatter
};
function ReferenceDot(outsideProps) {
  var props = resolveDefaultProps(outsideProps, referenceDotDefaultProps);
  var {
    x,
    y,
    r,
    ifOverflow,
    yAxisId,
    xAxisId
  } = props;
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement(ReportReferenceDot, {
    y,
    x,
    r,
    yAxisId,
    xAxisId,
    ifOverflow
  }), /* @__PURE__ */ reactExports.createElement(ReferenceDotImpl, props));
}
ReferenceDot.displayName = "ReferenceDot";
const EXPIRY_STATUS_CONFIG = [
  { status: "expired", label: "Expiré", color: "#1F2937", bgColor: "#F3F4F6", daysThreshold: 0, suggestedDiscount: 100 },
  { status: "critical", label: "Critique", color: "#DC2626", bgColor: "#FEE2E2", daysThreshold: 3, suggestedDiscount: 50 },
  { status: "warning", label: "Alerte", color: "#D97706", bgColor: "#FEF3C7", daysThreshold: 7, suggestedDiscount: 20 },
  { status: "attention", label: "Attention", color: "#2563EB", bgColor: "#DBEAFE", daysThreshold: 14, suggestedDiscount: 0 },
  { status: "ok", label: "OK", color: "#059669", bgColor: "#D1FAE5", daysThreshold: Infinity, suggestedDiscount: 0 }
];
function calculateDaysRemaining(expiryDate) {
  if (!expiryDate) return null;
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1e3 * 60 * 60 * 24));
}
function getExpiryStatus(daysRemaining) {
  if (daysRemaining === null) return "ok";
  if (daysRemaining <= 0) return "expired";
  if (daysRemaining <= 3) return "critical";
  if (daysRemaining <= 7) return "warning";
  if (daysRemaining <= 14) return "attention";
  return "ok";
}
function getExpiryStatusConfig(status) {
  return EXPIRY_STATUS_CONFIG.find((c) => c.status === status) || EXPIRY_STATUS_CONFIG[4];
}
function getSuggestedDiscount(status) {
  const config = getExpiryStatusConfig(status);
  return config.suggestedDiscount;
}
function sortByFEFO(lots) {
  return [...lots].sort((a, b) => {
    if (!a.expiryDate && !b.expiryDate) return 0;
    if (!a.expiryDate) return 1;
    if (!b.expiryDate) return -1;
    return a.expiryDate.getTime() - b.expiryDate.getTime();
  });
}
function selectLotsForSale(lots, quantity) {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    console.error("[SECURITY] Invalid quantity for lot selection:", quantity);
    return [];
  }
  const MAX_QUANTITY = 1e6;
  if (quantity > MAX_QUANTITY) {
    console.warn("[SECURITY] Quantity exceeds maximum, capping at", MAX_QUANTITY);
    quantity = MAX_QUANTITY;
  }
  const sortedLots = sortByFEFO(lots).filter((lot) => lot.status !== "expired");
  const selections = [];
  let remaining = Math.floor(quantity);
  for (const lot of sortedLots) {
    if (remaining <= 0) break;
    const take = Math.min(lot.quantity, remaining);
    if (take <= 0) continue;
    selections.push({ lot, qty: take });
    remaining -= take;
  }
  return selections;
}
function createLotFromProduct(product) {
  if (!product.isPerishable || !product.shelfLifeDays) {
    return null;
  }
  const daysRemaining = Math.max(1, Math.min(product.shelfLifeDays, Math.floor(Math.random() * product.shelfLifeDays)));
  const expiryDate = new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1e3);
  const status = getExpiryStatus(daysRemaining);
  return {
    id: `lot-${product.id}`,
    productId: product.id,
    lotNumber: `LOT-${product.sku || product.id.slice(-6).toUpperCase()}`,
    quantity: product.stock,
    expiryDate,
    receivedDate: new Date(Date.now() - (product.shelfLifeDays - daysRemaining) * 24 * 60 * 60 * 1e3),
    costPrice: product.purchasePrice,
    status,
    daysRemaining
  };
}
class ExpiryAlertServiceClass {
  products = [];
  lots = [];
  alerts = [];
  /**
   * Initialize or update with real products from store
   */
  setProducts(products) {
    this.products = products;
    this.refreshLots();
    this.refreshAlerts();
  }
  /**
   * Refresh lots from current products
   */
  refreshLots() {
    this.lots = this.products.filter((p) => p.isPerishable && p.shelfLifeDays && p.stock > 0).map((p) => createLotFromProduct(p)).filter((lot) => lot !== null);
  }
  /**
   * Refresh all alerts based on current lot data
   */
  refreshAlerts() {
    this.alerts = this.lots.filter((lot) => lot.expiryDate && lot.status !== "ok").map((lot) => this.createAlertFromLot(lot)).sort((a, b) => a.daysRemaining - b.daysRemaining);
  }
  /**
   * Create an alert from a product lot
   */
  createAlertFromLot(lot) {
    const daysRemaining = calculateDaysRemaining(lot.expiryDate) ?? 999;
    const status = getExpiryStatus(daysRemaining);
    const suggestedDiscount = getSuggestedDiscount(status);
    const product = this.products.find((p) => p.id === lot.productId);
    let suggestedAction = "discount";
    if (status === "expired") suggestedAction = "dispose";
    else if (status === "critical" && daysRemaining <= 1) suggestedAction = "donate";
    return {
      id: `alert-${lot.id}`,
      productId: lot.productId,
      productName: product?.name || "Produit inconnu",
      lotId: lot.id,
      lotNumber: lot.lotNumber,
      quantity: lot.quantity,
      expiryDate: lot.expiryDate,
      daysRemaining,
      status,
      suggestedDiscount,
      suggestedAction,
      createdAt: /* @__PURE__ */ new Date(),
      acknowledged: false
    };
  }
  /**
   * Get all active alerts
   */
  getAlerts() {
    return this.alerts;
  }
  /**
   * Get alerts filtered by status
   */
  getAlertsByStatus(status) {
    return this.alerts.filter((a) => a.status === status);
  }
  /**
   * Get critical and high priority alerts for dashboard
   */
  getCriticalAlerts() {
    return this.alerts.filter(
      (a) => a.status === "expired" || a.status === "critical" || a.status === "warning"
    );
  }
  /**
   * Get summary counts
   */
  getSummary() {
    return {
      expired: this.alerts.filter((a) => a.status === "expired").length,
      critical: this.alerts.filter((a) => a.status === "critical").length,
      warning: this.alerts.filter((a) => a.status === "warning").length,
      attention: this.alerts.filter((a) => a.status === "attention").length,
      total: this.alerts.length
    };
  }
  /**
   * Acknowledge an alert
   */
  acknowledgeAlert(alertId) {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
    }
  }
  /**
   * Record an action taken on an alert
   */
  recordAction(alertId, action) {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.actionTaken = action;
      alert.acknowledged = true;
    }
  }
  /**
   * Get lots for a product sorted by FEFO
   */
  getLotsForProduct(productId) {
    return sortByFEFO(this.lots.filter((l) => l.productId === productId));
  }
  /**
   * Select lots for sale using FEFO
   */
  selectLotsForSale(productId, quantity) {
    const productLots = this.getLotsForProduct(productId);
    return selectLotsForSale(productLots, quantity);
  }
  /**
   * Check if a product has near-expiry lots
   */
  hasNearExpiryLots(productId) {
    const lots = this.getLotsForProduct(productId);
    const nearExpiryLots = lots.filter(
      (l) => l.status === "critical" || l.status === "warning"
    );
    return {
      hasNearExpiry: nearExpiryLots.length > 0,
      nearestExpiry: nearExpiryLots[0] || null
    };
  }
  /**
   * Get perishable products that should have expiry tracking
   */
  getPerishableProducts() {
    return this.products.filter((p) => p.isPerishable);
  }
}
const ExpiryAlertService = new ExpiryAlertServiceClass();
const dashboard = "_dashboard_7nz66_6";
const pageHeader = "_pageHeader_7nz66_18";
const headerLeft = "_headerLeft_7nz66_26";
const pageTitle = "_pageTitle_7nz66_32";
const pageSubtitle = "_pageSubtitle_7nz66_39";
const headerActions = "_headerActions_7nz66_45";
const periodToggle = "_periodToggle_7nz66_51";
const periodBtn = "_periodBtn_7nz66_59";
const active = "_active_7nz66_75";
const refreshBtn = "_refreshBtn_7nz66_81";
const spinning = "_spinning_7nz66_101";
const spin = "_spin_7nz66_101";
const metricsGrid = "_metricsGrid_7nz66_119";
const metricCard = "_metricCard_7nz66_125";
const metricSuccess = "_metricSuccess_7nz66_142";
const metricPrimary = "_metricPrimary_7nz66_146";
const metricInfo = "_metricInfo_7nz66_150";
const metricWarning = "_metricWarning_7nz66_154";
const metricIcon = "_metricIcon_7nz66_158";
const metricContent = "_metricContent_7nz66_188";
const metricLabel = "_metricLabel_7nz66_195";
const metricValue = "_metricValue_7nz66_201";
const metricTrend = "_metricTrend_7nz66_208";
const trendUp = "_trendUp_7nz66_219";
const trendDown = "_trendDown_7nz66_224";
const chartsRow = "_chartsRow_7nz66_233";
const chartCard = "_chartCard_7nz66_239";
const chartCardSmall = "_chartCardSmall_7nz66_240";
const cardHeader = "_cardHeader_7nz66_247";
const cardTitle = "_cardTitle_7nz66_254";
const cardBadge = "_cardBadge_7nz66_271";
const pulse = "_pulse_7nz66_1";
const chartContainer = "_chartContainer_7nz66_304";
const legendList = "_legendList_7nz66_308";
const legendItem = "_legendItem_7nz66_315";
const legendDot = "_legendDot_7nz66_321";
const legendLabel = "_legendLabel_7nz66_327";
const actionsRow = "_actionsRow_7nz66_336";
const quickActionsCard = "_quickActionsCard_7nz66_342";
const alertsCard = "_alertsCard_7nz66_343";
const actionsGrid = "_actionsGrid_7nz66_350";
const actionBtn = "_actionBtn_7nz66_356";
const actionIcon = "_actionIcon_7nz66_381";
const actionPrimary = "_actionPrimary_7nz66_390";
const actionSuccess = "_actionSuccess_7nz66_395";
const actionInfo = "_actionInfo_7nz66_400";
const actionWarning = "_actionWarning_7nz66_405";
const viewAllBtn = "_viewAllBtn_7nz66_416";
const alertsList = "_alertsList_7nz66_438";
const alertItem = "_alertItem_7nz66_444";
const alertInfo = "_alertInfo_7nz66_458";
const alertIconWarning = "_alertIconWarning_7nz66_464";
const alertIconDanger = "_alertIconDanger_7nz66_468";
const alertDetails = "_alertDetails_7nz66_472";
const alertProduct = "_alertProduct_7nz66_477";
const alertMeta = "_alertMeta_7nz66_483";
const alertBadge = "_alertBadge_7nz66_488";
const badgeDanger = "_badgeDanger_7nz66_495";
const badgeWarning = "_badgeWarning_7nz66_500";
const badgeInfo = "_badgeInfo_7nz66_505";
const bottomRow = "_bottomRow_7nz66_514";
const paymentCard = "_paymentCard_7nz66_520";
const transactionsCard = "_transactionsCard_7nz66_521";
const aiCard = "_aiCard_7nz66_522";
const paymentBars = "_paymentBars_7nz66_530";
const paymentItem = "_paymentItem_7nz66_536";
const paymentInfo = "_paymentInfo_7nz66_542";
const paymentMethod = "_paymentMethod_7nz66_548";
const paymentAmount = "_paymentAmount_7nz66_554";
const paymentBar = "_paymentBar_7nz66_530";
const paymentProgress = "_paymentProgress_7nz66_566";
const paymentPercent = "_paymentPercent_7nz66_573";
const liveDot = "_liveDot_7nz66_580";
const transactionsList = "_transactionsList_7nz66_588";
const transactionItem = "_transactionItem_7nz66_594";
const txTime = "_txTime_7nz66_603";
const txDetails = "_txDetails_7nz66_610";
const txAmount = "_txAmount_7nz66_616";
const txMeta = "_txMeta_7nz66_622";
const aiIcon = "_aiIcon_7nz66_628";
const aiBadge = "_aiBadge_7nz66_632";
const aiList = "_aiList_7nz66_644";
const aiItem = "_aiItem_7nz66_650";
const aiEmoji = "_aiEmoji_7nz66_664";
const critical = "_critical_7nz66_670";
const high = "_high_7nz66_675";
const medium = "_medium_7nz66_680";
const low = "_low_7nz66_685";
const opportunity = "_opportunity_7nz66_691";
const warning = "_warning_7nz66_696";
const savings = "_savings_7nz66_701";
const aiContent = "_aiContent_7nz66_706";
const aiActionBtn = "_aiActionBtn_7nz66_725";
const aiImpact = "_aiImpact_7nz66_742";
const aiEmpty = "_aiEmpty_7nz66_755";
const cardHeaderRight = "_cardHeaderRight_7nz66_844";
const modalOverlay = "_modalOverlay_7nz66_854";
const fadeIn = "_fadeIn_7nz66_1";
const insightsModal = "_insightsModal_7nz66_876";
const slideIn = "_slideIn_7nz66_1";
const modalHeader = "_modalHeader_7nz66_901";
const modalTitle = "_modalTitle_7nz66_910";
const closeBtn = "_closeBtn_7nz66_923";
const modalBody = "_modalBody_7nz66_942";
const aiItemLarge = "_aiItemLarge_7nz66_950";
const aiActionBtnLarge = "_aiActionBtnLarge_7nz66_1000";
const customTooltip = "_customTooltip_7nz66_1026";
const tooltipLabel = "_tooltipLabel_7nz66_1037";
const tooltipDivider = "_tooltipDivider_7nz66_1044";
const tooltipItem = "_tooltipItem_7nz66_1050";
const tooltipDot = "_tooltipDot_7nz66_1058";
const tooltipValue = "_tooltipValue_7nz66_1064";
const pieWrapper = "_pieWrapper_7nz66_1070";
const legendListGrid = "_legendListGrid_7nz66_1085";
const legendText = "_legendText_7nz66_1092";
const legendPercent = "_legendPercent_7nz66_1097";
const chartLegend = "_chartLegend_7nz66_1111";
const chartFooter = "_chartFooter_7nz66_1116";
const insightTag = "_insightTag_7nz66_1125";
const styles = {
  dashboard,
  pageHeader,
  headerLeft,
  pageTitle,
  pageSubtitle,
  headerActions,
  periodToggle,
  periodBtn,
  active,
  refreshBtn,
  spinning,
  spin,
  metricsGrid,
  metricCard,
  metricSuccess,
  metricPrimary,
  metricInfo,
  metricWarning,
  metricIcon,
  metricContent,
  metricLabel,
  metricValue,
  metricTrend,
  trendUp,
  trendDown,
  chartsRow,
  chartCard,
  chartCardSmall,
  cardHeader,
  cardTitle,
  cardBadge,
  pulse,
  chartContainer,
  legendList,
  legendItem,
  legendDot,
  legendLabel,
  actionsRow,
  quickActionsCard,
  alertsCard,
  actionsGrid,
  actionBtn,
  actionIcon,
  actionPrimary,
  actionSuccess,
  actionInfo,
  actionWarning,
  viewAllBtn,
  alertsList,
  alertItem,
  alertInfo,
  alertIconWarning,
  alertIconDanger,
  alertDetails,
  alertProduct,
  alertMeta,
  alertBadge,
  badgeDanger,
  badgeWarning,
  badgeInfo,
  bottomRow,
  paymentCard,
  transactionsCard,
  aiCard,
  paymentBars,
  paymentItem,
  paymentInfo,
  paymentMethod,
  paymentAmount,
  paymentBar,
  paymentProgress,
  paymentPercent,
  liveDot,
  transactionsList,
  transactionItem,
  txTime,
  txDetails,
  txAmount,
  txMeta,
  aiIcon,
  aiBadge,
  aiList,
  aiItem,
  aiEmoji,
  critical,
  high,
  medium,
  low,
  opportunity,
  warning,
  savings,
  aiContent,
  aiActionBtn,
  aiImpact,
  aiEmpty,
  cardHeaderRight,
  modalOverlay,
  fadeIn,
  insightsModal,
  slideIn,
  modalHeader,
  modalTitle,
  closeBtn,
  modalBody,
  aiItemLarge,
  aiActionBtnLarge,
  customTooltip,
  tooltipLabel,
  tooltipDivider,
  tooltipItem,
  tooltipDot,
  tooltipValue,
  pieWrapper,
  legendListGrid,
  legendText,
  legendPercent,
  chartLegend,
  chartFooter,
  insightTag
};
const CustomTooltip = ({ active: active2, payload, label, formatCurrency }) => {
  if (active2 && payload && payload.length) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.customTooltip, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles.tooltipLabel, children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.tooltipDivider }),
      payload.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.tooltipItem, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.tooltipDot, style: { backgroundColor: entry.color } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.tooltipName, children: [
          entry.name,
          ":"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.tooltipValue, children: typeof entry.value === "number" ? formatCurrency(entry.value) : entry.value })
      ] }, index))
    ] });
  }
  return null;
};
const Dashboard = () => {
  useTranslation();
  const navigate = useNavigate();
  const { formatCurrency } = useSettings();
  const { user } = useAuthStore();
  const { sales, getTodaySales, getWeekSales, getMonthSales, getTodayTotal, getWeekTotal, getMonthTotal } = useSalesStore();
  useTreasuryFacade();
  const { products, getLowStockProducts } = useProductsStore();
  const { customers } = useCustomersStore();
  const [selectedPeriod, setSelectedPeriod] = reactExports.useState("today");
  const [isRefreshing, setIsRefreshing] = reactExports.useState(false);
  const [aiInsights, setAiInsights] = reactExports.useState([]);
  const [showAllInsights, setShowAllInsights] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setAiInsights(InsightsGenerator.generateDailyInsights());
  }, []);
  const getMetrics = () => {
    let periodTotal = 0;
    let periodTransactions = 0;
    let previousPeriodTotal = 0;
    let previousPeriodTransactions = 0;
    const now = /* @__PURE__ */ new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1e3);
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1e3);
    const prevWeekStart = new Date(todayStart.getTime() - 14 * 24 * 60 * 60 * 1e3);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    if (selectedPeriod === "today") {
      periodTotal = getTodayTotal();
      periodTransactions = getTodaySales().length;
      const yesterdaySales = sales.filter((s) => {
        const saleDate = new Date(s.timestamp);
        return saleDate >= yesterdayStart && saleDate < todayStart;
      });
      previousPeriodTotal = yesterdaySales.reduce((sum, s) => sum + s.totalAmount, 0);
      previousPeriodTransactions = yesterdaySales.length;
    } else if (selectedPeriod === "week") {
      periodTotal = getWeekTotal();
      periodTransactions = getWeekSales().length;
      const prevWeekSales = sales.filter((s) => {
        const saleDate = new Date(s.timestamp);
        return saleDate >= prevWeekStart && saleDate < weekStart;
      });
      previousPeriodTotal = prevWeekSales.reduce((sum, s) => sum + s.totalAmount, 0);
      previousPeriodTransactions = prevWeekSales.length;
    } else {
      periodTotal = getMonthTotal();
      periodTransactions = getMonthSales().length;
      const prevMonthSales = sales.filter((s) => {
        const saleDate = new Date(s.timestamp);
        return saleDate >= prevMonthStart && saleDate < monthStart;
      });
      previousPeriodTotal = prevMonthSales.reduce((sum, s) => sum + s.totalAmount, 0);
      previousPeriodTransactions = prevMonthSales.length;
    }
    const avgTicket = periodTransactions > 0 ? Math.round(periodTotal / periodTransactions) : 0;
    const prevAvgTicket = previousPeriodTransactions > 0 ? Math.round(previousPeriodTotal / previousPeriodTransactions) : 0;
    const lowStockCount = getLowStockProducts().length;
    const calcChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round((current - previous) / previous * 100 * 10) / 10;
    };
    const dailySalesChange = calcChange(periodTotal, previousPeriodTotal);
    const transactionsChange = calcChange(periodTransactions, previousPeriodTransactions);
    const avgTicketChange = calcChange(avgTicket, prevAvgTicket);
    const alertsChange = -lowStockCount;
    return {
      dailySales: periodTotal,
      dailySalesChange,
      transactions: periodTransactions,
      transactionsChange,
      avgTicket,
      avgTicketChange,
      activeAlerts: lowStockCount,
      alertsChange
    };
  };
  const metrics = getMetrics();
  const { hourlyData, peakHour, peakValue, avgValue } = reactExports.useMemo(() => {
    const todaySales = getTodaySales();
    const hours = {};
    for (let h = 6; h <= 22; h++) {
      const hourStr = `${h.toString().padStart(2, "0")}:00`;
      hours[hourStr] = { ventes: 0, transactions: 0 };
    }
    todaySales.forEach((sale) => {
      const hour = new Date(sale.timestamp).getHours();
      const hourStr = `${hour.toString().padStart(2, "0")}:00`;
      if (hours[hourStr]) {
        hours[hourStr].ventes += sale.totalAmount;
        hours[hourStr].transactions += 1;
      }
    });
    const data = Object.entries(hours).map(([hour, d]) => ({
      hour,
      ventes: d.ventes,
      previous: Math.round(d.ventes * 0.9),
      // Simulated previous day
      transactions: d.transactions
    }));
    let peak = { hour: "12:00", value: 0 };
    let total = 0;
    let count = 0;
    data.forEach((d) => {
      if (d.ventes > peak.value) {
        peak = { hour: d.hour, value: d.ventes };
      }
      total += d.ventes;
      if (d.ventes > 0) count++;
    });
    const avg = count > 0 ? Math.round(total / data.length) : 0;
    return {
      hourlyData: data,
      peakHour: peak.hour,
      peakValue: peak.value,
      avgValue: avg
    };
  }, [sales]);
  const categoryData = reactExports.useMemo(() => {
    const categoryColors = {
      "Boissons": "#4285F4",
      "Épicerie": "#34C759",
      "Produits Laitiers": "#FFD60A",
      "Boulangerie": "#FF3B30",
      "Snacks": "#8B5CF6",
      "Entretien": "#06B6D4",
      "Fruits & Légumes": "#F59E0B",
      "Viandes": "#EF4444",
      "default": "#6B7280"
    };
    const todaySales = getTodaySales();
    const categoryTotals = {};
    todaySales.forEach((sale) => {
      sale.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        const category = product?.category || "Autre";
        categoryTotals[category] = (categoryTotals[category] || 0) + item.total;
      });
    });
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
      color: categoryColors[name] || categoryColors["default"]
    })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [sales, products]);
  const paymentData = reactExports.useMemo(() => {
    const todaySales = getTodaySales();
    const paymentTotals = {};
    const paymentLabels = {
      "cash": "Espèces",
      "cib": "CIB",
      "dahabia": "Dahabia",
      "credit": "Crédit",
      "card": "Carte",
      "visa": "Visa",
      "mastercard": "Mastercard"
    };
    todaySales.forEach((sale) => {
      const method = sale.paymentMethod;
      paymentTotals[method] = (paymentTotals[method] || 0) + sale.totalAmount;
    });
    const total = Object.values(paymentTotals).reduce((sum, v) => sum + v, 0);
    return Object.entries(paymentTotals).map(([method, montant]) => ({
      method: paymentLabels[method] || method,
      montant,
      percentage: total > 0 ? Math.round(montant / total * 100) : 0
    }));
  }, [sales]);
  reactExports.useEffect(() => {
    ExpiryAlertService.setProducts(products);
  }, [products]);
  const inventoryAlerts = reactExports.useMemo(() => {
    const lowStockProducts = getLowStockProducts();
    const expiringAlerts = ExpiryAlertService.getCriticalAlerts();
    const combinedAlerts = [
      ...lowStockProducts.map((p, index) => {
        const isOut = p.stock === 0;
        const isCritical = p.stock <= (p.minStock || 5) * 0.3;
        return {
          id: `low-${p.id}-${index}`,
          product: `${p.emoji || "📦"} ${p.name}`,
          type: isOut ? "out" : isCritical ? "critical" : "low",
          stock: p.stock,
          min: p.minStock || 10,
          urgency: isOut || isCritical ? "high" : "medium",
          expiryDays: 0
        };
      }),
      ...expiringAlerts.map((a) => ({
        id: a.id,
        product: a.productName,
        type: "expiring",
        stock: a.quantity,
        min: 0,
        urgency: a.status === "expired" || a.status === "critical" ? "high" : "medium",
        expiryDays: a.daysRemaining
      }))
    ];
    return combinedAlerts.sort((a, b) => {
      if (a.urgency === "high" && b.urgency !== "high") return -1;
      if (a.urgency !== "high" && b.urgency === "high") return 1;
      return 0;
    }).slice(0, 5);
  }, [products, getLowStockProducts]);
  const recentTransactions = reactExports.useMemo(() => {
    const todaySales = getTodaySales();
    const paymentLabels = {
      "cash": "Espèces",
      "cib": "CIB",
      "dahabia": "Dahabia",
      "credit": "Crédit",
      "card": "Carte"
    };
    return todaySales.slice(0, 5).map((sale, index) => ({
      id: index + 1,
      time: new Date(sale.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      amount: sale.totalAmount,
      items: sale.items.reduce((sum, item) => sum + item.quantity, 0),
      payment: paymentLabels[sale.paymentMethod] || sale.paymentMethod
    }));
  }, [sales]);
  const handleRefresh = () => {
    setIsRefreshing(true);
    setAiInsights(InsightsGenerator.generateDailyInsights());
    setTimeout(() => setIsRefreshing(false), 1500);
  };
  const handleAIAction = (insight) => {
    if (insight.actionRoute) {
      navigate(insight.actionRoute);
    } else if (insight.id.startsWith("event-")) {
      navigate("/inventory?tab=alerts");
    } else if (insight.id === "margin-opportunity") {
      navigate("/reports");
    } else if (insight.id === "expiry-alert") {
      navigate("/inventory?filter=expiring");
    } else {
      console.log(`Action pour: ${insight.title}`);
    }
    setShowAllInsights(false);
  };
  const handleQuickAction = (action) => {
    switch (action) {
      case "pos":
        navigate("/pos");
        break;
      case "addProduct":
        navigate("/inventory?action=add");
        break;
      case "newCustomer":
        navigate("/customers?action=add");
        break;
      case "dailyReport":
        navigate("/reports");
        break;
      case "priceCheck":
        navigate("/inventory?tab=products");
        break;
      case "inventory":
        navigate("/inventory");
        break;
      default:
        navigate("/");
    }
  };
  const getAlertBadgeClass = (type) => {
    switch (type) {
      case "critical":
      case "out":
        return styles.badgeDanger;
      case "expiring":
      case "low":
        return styles.badgeWarning;
      default:
        return styles.badgeInfo;
    }
  };
  const getAlertLabel = (type) => {
    switch (type) {
      case "critical":
        return "Critique";
      case "out":
        return "Rupture";
      case "expiring":
        return "Péremption";
      case "low":
        return "Stock faible";
      default:
        return type;
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.dashboard, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.pageHeader, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.headerLeft, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: styles.pageTitle, children: "Tableau de bord" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: styles.pageSubtitle, children: [
          "Bienvenue, ",
          user?.firstName || "Utilisateur",
          " • ",
          (/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.headerActions, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.periodToggle, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `${styles.periodBtn} ${selectedPeriod === "today" ? styles.active : ""}`,
              onClick: () => setSelectedPeriod("today"),
              children: "Aujourd'hui"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `${styles.periodBtn} ${selectedPeriod === "week" ? styles.active : ""}`,
              onClick: () => setSelectedPeriod("week"),
              children: "Semaine"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `${styles.periodBtn} ${selectedPeriod === "month" ? styles.active : ""}`,
              onClick: () => setSelectedPeriod("month"),
              children: "Mois"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `${styles.refreshBtn} ${isRefreshing ? styles.spinning : ""}`,
            onClick: handleRefresh,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 18 })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.metricsGrid, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles.metricCard} ${styles.metricSuccess}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.metricIcon, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.metricContent, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.metricLabel, children: "Ventes du jour" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.metricValue, children: formatCurrency(metrics.dailySales) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles.metricTrend} ${metrics.dailySalesChange >= 0 ? styles.trendUp : styles.trendDown}`, children: [
            metrics.dailySalesChange >= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 14 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              metrics.dailySalesChange >= 0 ? "+" : "",
              metrics.dailySalesChange,
              "% vs hier"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles.metricCard} ${styles.metricPrimary}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.metricIcon, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.metricContent, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.metricLabel, children: "Transactions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.metricValue, children: metrics.transactions }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles.metricTrend} ${metrics.transactionsChange >= 0 ? styles.trendUp : styles.trendDown}`, children: [
            metrics.transactionsChange >= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 14 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              metrics.transactionsChange >= 0 ? "+" : "",
              metrics.transactionsChange,
              "%"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles.metricCard} ${styles.metricInfo}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.metricIcon, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.metricContent, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.metricLabel, children: "Panier moyen" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.metricValue, children: formatCurrency(metrics.avgTicket) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles.metricTrend} ${metrics.avgTicketChange >= 0 ? styles.trendUp : styles.trendDown}`, children: [
            metrics.avgTicketChange >= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 14 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              metrics.avgTicketChange >= 0 ? "+" : "",
              metrics.avgTicketChange,
              "%"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles.metricCard} ${styles.metricWarning}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.metricIcon, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.metricContent, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.metricLabel, children: "Alertes actives" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.metricValue, children: metrics.activeAlerts }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles.metricTrend} ${metrics.alertsChange <= 0 ? styles.trendUp : styles.trendDown}`, children: [
            metrics.alertsChange <= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 14 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              metrics.alertsChange,
              " depuis hier"
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.chartsRow, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.chartCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.cardHeader, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.cardTitle, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 18 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Ventes par heure" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.chartLegend, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.legendItem, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.legendDot, style: { background: "#4285F4" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Aujourd'hui" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.legendItem, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.legendDot, style: { background: "rgba(66, 133, 244, 0.2)" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Hier" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.chartContainer, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: hourlyData, margin: { top: 20, right: 30, left: 0, bottom: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "colorVentes", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "#4285F4", stopOpacity: 0.6 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "#4285F4", stopOpacity: 0 })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "rgba(229, 231, 235, 0.5)", vertical: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            XAxis,
            {
              dataKey: "hour",
              stroke: "#9CA3AF",
              fontSize: 11,
              tickLine: false,
              axisLine: false,
              dy: 10
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            YAxis,
            {
              stroke: "#9CA3AF",
              fontSize: 11,
              tickLine: false,
              axisLine: false,
              tickFormatter: (value) => `${(value / 1e3).toFixed(0)}K`,
              dx: -10
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Tooltip,
            {
              content: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomTooltip, { formatCurrency }),
              cursor: { stroke: "#4285F4", strokeWidth: 1, strokeDasharray: "4 4" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Area,
            {
              type: "monotone",
              dataKey: "previous",
              name: "Hier",
              stroke: "rgba(66, 133, 244, 0.3)",
              strokeWidth: 2,
              strokeDasharray: "5 5",
              fill: "transparent"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Area,
            {
              type: "monotone",
              dataKey: "ventes",
              name: "Chiffre d'affaires",
              stroke: "#4285F4",
              strokeWidth: 4,
              fillOpacity: 1,
              fill: "url(#colorVentes)",
              activeDot: { r: 6, stroke: "#fff", strokeWidth: 2 },
              animationBegin: 200,
              animationDuration: 1500
            }
          ),
          peakValue > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            ReferenceDot,
            {
              x: peakHour,
              y: peakValue,
              r: 6,
              fill: "#4285F4",
              stroke: "#fff",
              strokeWidth: 2,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { value: "Pic", position: "top", fill: "#4285F4", fontSize: 11, fontWeight: "bold", dy: -10 })
            }
          ),
          avgValue > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            ReferenceLine,
            {
              y: avgValue,
              stroke: "#9CA3AF",
              strokeDasharray: "3 3",
              strokeOpacity: 0.5,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { value: "Moyenne", position: "right", fill: "#9CA3AF", fontSize: 10 })
            }
          )
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.chartFooter, children: [
          peakValue > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.insightTag, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 14 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Pic atteint à ",
              peakHour,
              " (",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(peakValue) }),
              ")"
            ] })
          ] }),
          metrics.dailySalesChange !== 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.insightTag, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Ventes ",
              metrics.dailySalesChange >= 0 ? "en hausse" : "en baisse",
              " de ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                Math.abs(metrics.dailySalesChange),
                "%"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.chartCardSmall, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.cardHeader, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.cardTitle, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Par catégorie" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.chartContainer, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.pieWrapper, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 240, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Pie,
              {
                data: categoryData,
                cx: "50%",
                cy: "50%",
                innerRadius: 65,
                outerRadius: 90,
                paddingAngle: 8,
                dataKey: "value",
                animationBegin: 400,
                animationDuration: 1500,
                stroke: "none",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      position: "center",
                      content: ({ viewBox }) => {
                        const { cx, cy } = viewBox;
                        return /* @__PURE__ */ jsxRuntimeExports.jsx("g", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "text",
                          {
                            x: cx,
                            y: cy,
                            textAnchor: "middle",
                            dominantBaseline: "central",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "tspan",
                                {
                                  x: cx,
                                  dy: "-0.3em",
                                  fontSize: "22",
                                  fontWeight: "700",
                                  fill: "#111827",
                                  children: "100%"
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "tspan",
                                {
                                  x: cx,
                                  dy: "1.5em",
                                  fontSize: "12",
                                  fontWeight: "500",
                                  fill: "#6B7280",
                                  children: "TOTAL"
                                }
                              )
                            ]
                          }
                        ) });
                      }
                    }
                  ),
                  categoryData.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Cell,
                    {
                      fill: entry.color,
                      style: { filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }
                    },
                    `cell-${index}`
                  ))
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Tooltip,
              {
                content: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomTooltip, { formatCurrency })
              }
            )
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.legendListGrid, children: categoryData.slice(0, 6).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.legendItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.legendDot, style: { backgroundColor: item.color } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.legendText, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.legendLabel, children: item.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.legendPercent, children: [
                (item.value / categoryData.reduce((acc, c) => acc + c.value, 0) * 100).toFixed(0),
                "%"
              ] })
            ] })
          ] }, item.name)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.actionsRow, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.quickActionsCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.cardHeader, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.cardTitle, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Actions rapides" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.actionsGrid, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.actionBtn, onClick: () => handleQuickAction("pos"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${styles.actionIcon} ${styles.actionPrimary}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 20 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Ouvrir caisse" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.actionBtn, onClick: () => handleQuickAction("addProduct"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${styles.actionIcon} ${styles.actionSuccess}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { size: 20 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Ajouter produit" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.actionBtn, onClick: () => handleQuickAction("newCustomer"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${styles.actionIcon} ${styles.actionInfo}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { size: 20 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Nouveau client" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.actionBtn, onClick: () => handleQuickAction("dailyReport"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${styles.actionIcon} ${styles.actionWarning}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 20 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Rapport du jour" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.actionBtn, onClick: () => handleQuickAction("priceCheck"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${styles.actionIcon} ${styles.actionPrimary}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 20 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Vérifier prix" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.actionBtn, onClick: () => handleQuickAction("inventory"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${styles.actionIcon} ${styles.actionSuccess}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 20 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Inventaire" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.alertsCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.cardHeader, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.cardTitle, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 18 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Alertes inventaire" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.viewAllBtn, onClick: () => navigate("/inventory?tab=alerts"), children: [
            "Voir tout ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 14 })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.alertsList, children: inventoryAlerts.map((alert) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.alertItem, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.alertInfo, children: [
            alert.type === "expiring" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 16, className: styles.alertIconWarning }) : alert.type === "out" || alert.type === "critical" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 16, className: styles.alertIconDanger }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 16, className: styles.alertIconWarning }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.alertDetails, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.alertProduct, children: alert.product }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.alertMeta, children: alert.type === "expiring" ? `Expire dans ${alert.expiryDays} jours` : `Stock: ${alert.stock} / Min: ${alert.min}` })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${styles.alertBadge} ${getAlertBadgeClass(alert.type)}`, children: getAlertLabel(alert.type) })
        ] }, alert.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.bottomRow, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.paymentCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.cardHeader, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.cardTitle, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Modes de paiement" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.paymentBars, children: paymentData.map((payment) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.paymentItem, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.paymentInfo, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.paymentMethod, children: payment.method }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.paymentAmount, children: formatCurrency(payment.montant) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.paymentBar, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: styles.paymentProgress,
              style: { width: `${payment.percentage}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.paymentPercent, children: [
            payment.percentage,
            "%"
          ] })
        ] }, payment.method)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.transactionsCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.cardHeader, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.cardTitle, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { size: 18 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Dernières transactions" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.liveDot })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.transactionsList, children: recentTransactions.map((tx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.transactionItem, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.txTime, children: tx.time }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.txDetails, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.txAmount, children: formatCurrency(tx.amount) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.txMeta, children: [
              tx.items,
              " articles • ",
              tx.payment
            ] })
          ] })
        ] }, tx.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.aiCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.cardHeader, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.cardTitle, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { size: 18, className: styles.aiIcon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Intelligence IA" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.cardHeaderRight, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.aiBadge, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 12 }),
              " Algérie"
            ] }),
            aiInsights.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: styles.viewAllBtn,
                onClick: () => setShowAllInsights(true),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 14 }),
                  "Voir tout (",
                  aiInsights.length,
                  ")"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.aiList, children: [
          aiInsights.slice(0, 4).map((insight) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `${styles.aiItem} ${styles[insight.importance]}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.aiEmoji, children: insight.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.aiContent, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: insight.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: insight.description })
                ] }),
                insight.actionLabel && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    className: styles.aiActionBtn,
                    onClick: () => handleAIAction(insight),
                    children: insight.actionLabel
                  }
                )
              ]
            },
            insight.id
          )),
          aiInsights.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.aiEmpty, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 24 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Aucune recommandation pour le moment" })
          ] })
        ] })
      ] })
    ] }),
    showAllInsights && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.modalOverlay, onClick: () => setShowAllInsights(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.insightsModal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalTitle, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { size: 24, className: styles.aiIcon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Intelligence IA - Toutes les recommandations" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles.closeBtn, onClick: () => setShowAllInsights(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.modalBody, children: aiInsights.map((insight) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `${styles.aiItemLarge} ${styles[insight.importance]}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.aiEmoji, children: insight.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.aiContent, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: insight.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: insight.description })
            ] }),
            insight.actionLabel && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: styles.aiActionBtnLarge,
                onClick: () => handleAIAction(insight),
                children: [
                  insight.actionLabel,
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16 })
                ]
              }
            )
          ]
        },
        insight.id
      )) })
    ] }) })
  ] });
};
export {
  Dashboard
};

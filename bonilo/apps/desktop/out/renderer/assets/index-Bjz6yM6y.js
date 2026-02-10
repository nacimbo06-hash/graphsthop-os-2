import { j as jsxRuntimeExports } from "./vendor-state-DFI86SKa.js";
import { u as useNavigate, r as reactExports } from "./vendor-react-Df__x13C.js";
import { u as useSettings, b as useSalesStore, c as useProductsStore } from "./index-BbOgUw3k.js";
import { I as InsightsGenerator, g as getAlgerianCalendarEvents } from "./forecastingService-CdtV6Vuz.js";
import { d as formatCurrencyCompact } from "./formatters-BiCn3FBI.js";
import { a9 as ArrowLeft, R as RefreshCw, ay as Download, F as FileText, aJ as FileSpreadsheet, l as Printer, s as TrendingUp, aW as ArrowUp, aX as ArrowDown, a3 as Brain, a4 as Sparkles, ap as Target, w as Calendar, Z as Zap } from "./vendor-ui-DiXyqbDT.js";
import { R as ResponsiveContainer, T as Tooltip } from "./CategoricalChart-BNQNLo93.js";
import { A as AreaChart, C as CartesianGrid, X as XAxis, Y as YAxis, a as Area } from "./AreaChart-D_YS4Ytt.js";
import "./vendor-i18n-DeCNyroL.js";
const container = "_container_xpmx0_6";
const header = "_header_xpmx0_14";
const headerMain = "_headerMain_xpmx0_23";
const backBtn = "_backBtn_xpmx0_29";
const headerActions = "_headerActions_xpmx0_62";
const periodToggle = "_periodToggle_xpmx0_68";
const periodBtn = "_periodBtn_xpmx0_75";
const active = "_active_xpmx0_91";
const iconBtn = "_iconBtn_xpmx0_96";
const exportWrapper = "_exportWrapper_xpmx0_114";
const exportBtn = "_exportBtn_xpmx0_118";
const exportMenu = "_exportMenu_xpmx0_132";
const main = "_main_xpmx0_164";
const section = "_section_xpmx0_174";
const sectionHeader = "_sectionHeader_xpmx0_180";
const eventAlert = "_eventAlert_xpmx0_196";
const eventEmoji = "_eventEmoji_xpmx0_208";
const comparisonGrid = "_comparisonGrid_xpmx0_213";
const comparisonCard = "_comparisonCard_xpmx0_219";
const comparisonLabel = "_comparisonLabel_xpmx0_226";
const comparisonValue = "_comparisonValue_xpmx0_233";
const comparisonChange = "_comparisonChange_xpmx0_241";
const previousValue = "_previousValue_xpmx0_247";
const changeBadge = "_changeBadge_xpmx0_252";
const positive = "_positive_xpmx0_262";
const negative = "_negative_xpmx0_267";
const chartCard = "_chartCard_xpmx0_273";
const forecastRow = "_forecastRow_xpmx0_281";
const forecastChart = "_forecastChart_xpmx0_287";
const forecastStats = "_forecastStats_xpmx0_294";
const statCard = "_statCard_xpmx0_300";
const twoColumns = "_twoColumns_xpmx0_331";
const insightsPanel = "_insightsPanel_xpmx0_338";
const panelHeader = "_panelHeader_xpmx0_345";
const alertBadge = "_alertBadge_xpmx0_361";
const insightsList = "_insightsList_xpmx0_374";
const insightItem = "_insightItem_xpmx0_380";
const critical = "_critical_xpmx0_395";
const high = "_high_xpmx0_400";
const medium = "_medium_xpmx0_405";
const low = "_low_xpmx0_409";
const insightEmoji = "_insightEmoji_xpmx0_413";
const insightContent = "_insightContent_xpmx0_418";
const insightAction = "_insightAction_xpmx0_438";
const performancePanel = "_performancePanel_xpmx0_455";
const performanceSection = "_performanceSection_xpmx0_461";
const performerItem = "_performerItem_xpmx0_475";
const performerRank = "_performerRank_xpmx0_487";
const performerName = "_performerName_xpmx0_500";
const performerValue = "_performerValue_xpmx0_509";
const performerGrowth = "_performerGrowth_xpmx0_515";
const spinning = "_spinning_xpmx0_543";
const spin = "_spin_xpmx0_543";
const customTooltip = "_customTooltip_xpmx0_611";
const tooltipLabel = "_tooltipLabel_xpmx0_622";
const tooltipDivider = "_tooltipDivider_xpmx0_629";
const tooltipItem = "_tooltipItem_xpmx0_635";
const tooltipDot = "_tooltipDot_xpmx0_643";
const tooltipValue = "_tooltipValue_xpmx0_649";
const styles = {
  container,
  header,
  headerMain,
  backBtn,
  headerActions,
  periodToggle,
  periodBtn,
  active,
  iconBtn,
  exportWrapper,
  exportBtn,
  exportMenu,
  main,
  section,
  sectionHeader,
  eventAlert,
  eventEmoji,
  comparisonGrid,
  comparisonCard,
  comparisonLabel,
  comparisonValue,
  comparisonChange,
  previousValue,
  changeBadge,
  positive,
  negative,
  chartCard,
  forecastRow,
  forecastChart,
  forecastStats,
  statCard,
  twoColumns,
  insightsPanel,
  panelHeader,
  alertBadge,
  insightsList,
  insightItem,
  critical,
  high,
  medium,
  low,
  insightEmoji,
  insightContent,
  insightAction,
  performancePanel,
  performanceSection,
  performerItem,
  performerRank,
  performerName,
  performerValue,
  performerGrowth,
  spinning,
  spin,
  customTooltip,
  tooltipLabel,
  tooltipDivider,
  tooltipItem,
  tooltipDot,
  tooltipValue
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
const ReportsHub = () => {
  const navigate = useNavigate();
  const { formatCurrency: settingsFormatCurrency } = useSettings();
  const { sales } = useSalesStore();
  const { products } = useProductsStore();
  const [comparisonPeriod, setComparisonPeriod] = reactExports.useState("day");
  const [aiInsights, setAiInsights] = reactExports.useState([]);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [showExportMenu, setShowExportMenu] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setAiInsights(InsightsGenerator.generateDailyInsights());
  }, []);
  const getRangeData = (start, end) => {
    const periodSales = sales.filter((s) => {
      const d = new Date(s.timestamp);
      return d >= start && d <= end;
    });
    const revenue = periodSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const orders = periodSales.length;
    const avgBasket = orders > 0 ? revenue / orders : 0;
    let totalCost = 0;
    let totalRevenue = 0;
    periodSales.forEach((sale) => {
      sale.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          totalCost += (product.purchasePrice || product.buyPrice || 0) * item.quantity;
          totalRevenue += item.total;
        }
      });
    });
    const margin = totalRevenue > 0 ? (totalRevenue - totalCost) / totalRevenue * 100 : 0;
    return { revenue, orders, avgBasket, margin };
  };
  const comparisonData = reactExports.useMemo(() => {
    const now = /* @__PURE__ */ new Date();
    let currentStart, currentEnd, prevStart, prevEnd;
    if (comparisonPeriod === "day") {
      currentStart = new Date(now.setHours(0, 0, 0, 0));
      currentEnd = new Date(now.setHours(23, 59, 59, 999));
      prevStart = new Date(currentStart);
      prevStart.setDate(prevStart.getDate() - 1);
      prevEnd = new Date(currentEnd);
      prevEnd.setDate(prevEnd.getDate() - 1);
    } else if (comparisonPeriod === "week") {
      currentStart = new Date(now);
      currentStart.setDate(now.getDate() - 7);
      currentEnd = /* @__PURE__ */ new Date();
      prevStart = new Date(currentStart);
      prevStart.setDate(prevStart.getDate() - 7);
      prevEnd = new Date(currentStart);
    } else {
      currentStart = new Date(now);
      currentStart.setMonth(now.getMonth() - 1);
      currentEnd = /* @__PURE__ */ new Date();
      prevStart = new Date(currentStart);
      prevStart.setMonth(prevStart.getMonth() - 1);
      prevEnd = new Date(currentStart);
    }
    return {
      currentPeriod: getRangeData(currentStart, currentEnd),
      previousPeriod: getRangeData(prevStart, prevEnd)
    };
  }, [sales, comparisonPeriod]);
  const topPerformers = reactExports.useMemo(() => {
    const productMap = {};
    sales.forEach((s) => {
      s.items.forEach((item) => {
        if (!productMap[item.productName]) {
          productMap[item.productName] = { revenue: 0, count: 0 };
        }
        productMap[item.productName].revenue += item.total;
        productMap[item.productName].count += item.quantity;
      });
    });
    return Object.entries(productMap).sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 3).map(([name, data2], idx) => ({
      name,
      revenue: data2.revenue,
      growth: Math.floor(Math.random() * 20),
      // Placeholder growth
      rank: idx + 1
    }));
  }, [sales]);
  const formatCurrency = formatCurrencyCompact;
  const formatFullCurrency = (value) => settingsFormatCurrency(value);
  const calcChange = (current, previous) => {
    if (previous === 0) return { value: current > 0 ? "100" : "0", positive: current > 0 };
    const change = (current - previous) / previous * 100;
    return { value: change.toFixed(1), positive: change >= 0 };
  };
  const data = comparisonData;
  const revenueChange = calcChange(data.currentPeriod.revenue, data.previousPeriod.revenue);
  const ordersChange = calcChange(data.currentPeriod.orders, data.previousPeriod.orders);
  const basketChange = calcChange(data.currentPeriod.avgBasket, data.previousPeriod.avgBasket);
  const marginChange = calcChange(data.currentPeriod.margin, data.previousPeriod.margin);
  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setAiInsights(InsightsGenerator.generateDailyInsights());
      setIsLoading(false);
    }, 800);
  };
  const handleExport = (type) => {
    setShowExportMenu(false);
    if (type === "excel") {
      const headers = ["Métrique", "Période Actuelle", "Période Précédente", "Variation"];
      const rows = [
        ["Chiffre d'affaires", data.currentPeriod.revenue, data.previousPeriod.revenue, `${revenueChange.value}%`],
        ["Commandes", data.currentPeriod.orders, data.previousPeriod.orders, `${ordersChange.value}%`],
        ["Panier moyen", data.currentPeriod.avgBasket, data.previousPeriod.avgBasket, `${basketChange.value}%`],
        ["Marge", `${data.currentPeriod.margin}%`, `${data.previousPeriod.margin}%`, `${marginChange.value}%`]
      ];
      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `rapport_${comparisonPeriod}_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
    } else {
      window.print();
    }
  };
  const forecastData = [
    { day: "Auj", actual: data.currentPeriod.revenue, predicted: data.currentPeriod.revenue * 0.95 },
    { day: "Dem", predicted: data.currentPeriod.revenue * 0.92 },
    { day: "J+2", predicted: data.currentPeriod.revenue * 1.1, event: "Vendredi" },
    { day: "J+3", predicted: data.currentPeriod.revenue * 1.05 },
    { day: "J+4", predicted: data.currentPeriod.revenue * 0.8 },
    { day: "J+5", predicted: data.currentPeriod.revenue * 0.85 },
    { day: "J+6", predicted: data.currentPeriod.revenue * 0.9 }
  ];
  const events = getAlgerianCalendarEvents((/* @__PURE__ */ new Date()).getFullYear());
  const today = /* @__PURE__ */ new Date();
  const nextEvent = events.find((e) => e.startDate > today);
  const daysUntilEvent = nextEvent ? Math.ceil((nextEvent.startDate.getTime() - today.getTime()) / (1e3 * 60 * 60 * 24)) : null;
  const criticalCount = aiInsights.filter((i) => i.importance === "critical" || i.importance === "high").length;
  const periodLabels = {
    day: { current: "Aujourd'hui", previous: "Hier" },
    week: { current: "Cette semaine", previous: "Semaine dernière" },
    month: { current: "Ce mois", previous: "Mois dernier" }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.container, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: styles.header, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.headerMain, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles.backBtn, onClick: () => navigate("/"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Analyse & Prévisions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Intelligence IA • Calendrier Algérien" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.headerActions, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.periodToggle, children: ["day", "week", "month"].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `${styles.periodBtn} ${comparisonPeriod === p ? styles.active : ""}`,
            onClick: () => setComparisonPeriod(p),
            children: p === "day" ? "Jour" : p === "week" ? "Semaine" : "Mois"
          },
          p
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles.iconBtn, onClick: refreshData, disabled: isLoading, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 18, className: isLoading ? styles.spinning : "" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.exportWrapper, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.exportBtn, onClick: () => setShowExportMenu(!showExportMenu), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 18 }),
            "Exporter"
          ] }),
          showExportMenu && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.exportMenu, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleExport("pdf"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 16 }),
              " PDF"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleExport("excel"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { size: 16 }),
              " Excel"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleExport("print"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 16 }),
              " Imprimer"
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: styles.main, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.sectionHeader, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 20 }),
          periodLabels[comparisonPeriod].current,
          " vs ",
          periodLabels[comparisonPeriod].previous
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.comparisonGrid, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.comparisonCard, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.comparisonLabel, children: "Chiffre d'affaires" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.comparisonValue, children: formatCurrency(data.currentPeriod.revenue) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.comparisonChange, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.previousValue, children: formatCurrency(data.previousPeriod.revenue) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `${styles.changeBadge} ${revenueChange.positive ? styles.positive : styles.negative}`, children: [
                revenueChange.positive ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { size: 12 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { size: 12 }),
                revenueChange.value,
                "%"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.comparisonCard, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.comparisonLabel, children: "Commandes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.comparisonValue, children: data.currentPeriod.orders }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.comparisonChange, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.previousValue, children: data.previousPeriod.orders }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `${styles.changeBadge} ${ordersChange.positive ? styles.positive : styles.negative}`, children: [
                ordersChange.positive ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { size: 12 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { size: 12 }),
                ordersChange.value,
                "%"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.comparisonCard, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.comparisonLabel, children: "Panier moyen" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.comparisonValue, children: formatFullCurrency(data.currentPeriod.avgBasket) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.comparisonChange, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.previousValue, children: formatFullCurrency(data.previousPeriod.avgBasket) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `${styles.changeBadge} ${basketChange.positive ? styles.positive : styles.negative}`, children: [
                basketChange.positive ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { size: 12 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { size: 12 }),
                basketChange.value,
                "%"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.comparisonCard, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.comparisonLabel, children: "Marge" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.comparisonValue, children: [
              data.currentPeriod.margin,
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.comparisonChange, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.previousValue, children: [
                data.previousPeriod.margin,
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `${styles.changeBadge} ${marginChange.positive ? styles.positive : styles.negative}`, children: [
                marginChange.positive ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { size: 12 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { size: 12 }),
                marginChange.value,
                "%"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.sectionHeader, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { size: 20 }),
            "Prévisions IA - 7 jours"
          ] }),
          nextEvent && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.eventAlert, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.eventEmoji, children: nextEvent.type === "religious" ? "🌙" : "📅" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              nextEvent.nameAr,
              " dans ",
              daysUntilEvent,
              "j"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.forecastRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.forecastChart, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 240, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: forecastData, margin: { top: 10, right: 10, left: 0, bottom: 0 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "forecastGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "#8B5CF6", stopOpacity: 0.6 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "#8B5CF6", stopOpacity: 0 })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "actualGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "#34C759", stopOpacity: 0.2 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "#34C759", stopOpacity: 0 })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "rgba(229, 231, 235, 0.5)", vertical: false }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              XAxis,
              {
                dataKey: "day",
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
                tickFormatter: (v) => `${v / 1e3}k`,
                dx: -10
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Tooltip,
              {
                content: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomTooltip, { formatCurrency: formatFullCurrency })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Area,
              {
                type: "monotone",
                dataKey: "predicted",
                name: "Prédiction IA",
                stroke: "#8B5CF6",
                strokeWidth: 4,
                fill: "url(#forecastGradient)",
                activeDot: { r: 6, stroke: "#fff", strokeWidth: 2 },
                animationDuration: 1500
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Area,
              {
                type: "monotone",
                dataKey: "actual",
                name: "Réel",
                stroke: "#34C759",
                strokeWidth: 3,
                strokeDasharray: "5 5",
                fill: "url(#actualGradient)",
                activeDot: { r: 4, stroke: "#fff", strokeWidth: 2 },
                animationDuration: 1500
              }
            )
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.forecastStats, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.statCard, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 18 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Prévu 7 jours" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(data.currentPeriod.revenue * 7 * 0.9) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.statCard, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 18 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Confiance IA" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "87%" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.statCard, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 18 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Pic prévu" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Vendredi" })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: styles.section, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.twoColumns, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.insightsPanel, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.panelHeader, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 18 }),
              "Actions recommandées"
            ] }),
            criticalCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.alertBadge, children: criticalCount })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.insightsList, children: aiInsights.slice(0, 4).map((insight) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles.insightItem} ${styles[insight.importance]}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.insightEmoji, children: insight.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.insightContent, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: insight.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: insight.description })
            ] })
          ] }, insight.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.performancePanel, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.performanceSection, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "🔥 Top Produits" }),
          topPerformers.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.performerItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.performerRank, children: p.rank }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.performerName, children: p.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.performerValue, children: formatCurrency(p.revenue) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `${styles.performerGrowth} ${styles.positive}`, children: [
              "+",
              p.growth,
              "%"
            ] })
          ] }, p.name)),
          topPerformers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles.empty, children: "Aucune vente enregistrée" })
        ] }) })
      ] }) })
    ] })
  ] });
};
export {
  ReportsHub,
  ReportsHub as default
};

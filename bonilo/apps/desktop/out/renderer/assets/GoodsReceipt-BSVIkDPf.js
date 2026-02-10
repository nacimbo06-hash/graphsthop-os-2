import { c as create, j as jsxRuntimeExports } from "./vendor-state-DFI86SKa.js";
import { r as reactExports } from "./vendor-react-Df__x13C.js";
import { p as persist, u as useSettings, c as useProductsStore, i as usePurchasesStore, e as useStockMovementsStore, f as useToast } from "./index-BbOgUw3k.js";
import { u as useTreasuryFacade } from "./useTreasuryFacade-CchObU-E.js";
import { P as Package, R as RefreshCw, aD as Save, w as Calendar, k as Truck, F as FileText, _ as CreditCard, a6 as Barcode, aL as Camera, r as Search, a as CircleCheckBig, ae as Minus, af as Plus, v as Trash2, O as DollarSign, x as Lock, X, C as CircleAlert } from "./vendor-ui-DiXyqbDT.js";
function getExpiryStatus(daysRemaining) {
  if (daysRemaining < 0) return "expired";
  if (daysRemaining <= 3) return "critical";
  if (daysRemaining <= 7) return "warning";
  if (daysRemaining <= 14) return "attention";
  return "ok";
}
function calculateDaysRemaining(expiryDate) {
  const expiry = new Date(expiryDate);
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1e3 * 60 * 60 * 24));
}
const useLotsStore = create()(
  persist(
    (set, get) => ({
      lots: [],
      movements: [],
      addLot: (lotData) => {
        const daysRemaining = calculateDaysRemaining(lotData.expiryDate);
        const status = getExpiryStatus(daysRemaining);
        const newLot = {
          ...lotData,
          id: `lot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status,
          daysRemaining,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        const movement = {
          id: `mov_${Date.now()}`,
          lotId: newLot.id,
          productId: newLot.productId,
          type: "receipt",
          quantity: newLot.quantity,
          reason: "Réception marchandise",
          reference: newLot.goodsReceiptId,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          createdBy: "System"
        };
        set((state) => ({
          lots: [newLot, ...state.lots],
          movements: [movement, ...state.movements]
        }));
        return newLot.id;
      },
      updateLot: (id, updates) => {
        set((state) => ({
          lots: state.lots.map(
            (lot) => lot.id === id ? { ...lot, ...updates } : lot
          )
        }));
      },
      reduceLotQuantity: (lotId, quantity, reason, reference, createdBy = "System") => {
        const lot = get().lots.find((l) => l.id === lotId);
        if (!lot || quantity <= 0) return;
        const actualQty = Math.min(quantity, lot.quantity);
        const newQuantity = lot.quantity - actualQty;
        const movement = {
          id: `mov_${Date.now()}`,
          lotId,
          productId: lot.productId,
          type: "sale",
          quantity: -actualQty,
          reason,
          reference,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          createdBy
        };
        set((state) => ({
          lots: state.lots.map(
            (l) => l.id === lotId ? { ...l, quantity: newQuantity } : l
          ),
          movements: [movement, ...state.movements]
        }));
      },
      disposeLot: (lotId, reason, createdBy) => {
        const lot = get().lots.find((l) => l.id === lotId);
        if (!lot) return;
        const movement = {
          id: `mov_${Date.now()}`,
          lotId,
          productId: lot.productId,
          type: "disposal",
          quantity: -lot.quantity,
          reason,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          createdBy
        };
        set((state) => ({
          lots: state.lots.map(
            (l) => l.id === lotId ? { ...l, quantity: 0, status: "expired" } : l
          ),
          movements: [movement, ...state.movements]
        }));
      },
      getLotsByProduct: (productId) => {
        return get().lots.filter((l) => l.productId === productId && l.quantity > 0).sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
      },
      getActiveLots: () => {
        return get().lots.filter((l) => l.quantity > 0 && l.status !== "expired");
      },
      getExpiringLots: (daysThreshold = 7) => {
        return get().lots.filter(
          (l) => l.quantity > 0 && l.daysRemaining <= daysThreshold && l.daysRemaining >= 0
        );
      },
      getExpiredLots: () => {
        return get().lots.filter((l) => l.quantity > 0 && l.status === "expired");
      },
      getLotMovements: (lotId) => {
        return get().movements.filter((m) => m.lotId === lotId);
      },
      // FEFO: First Expired First Out selection for sales
      selectLotsForSale: (productId, quantity) => {
        const lots = get().getLotsByProduct(productId);
        const selection = [];
        let remaining = quantity;
        for (const lot of lots) {
          if (remaining <= 0) break;
          if (lot.quantity <= 0) continue;
          const takeQty = Math.min(remaining, lot.quantity);
          selection.push({ lot, qty: takeQty });
          remaining -= takeQty;
        }
        return selection;
      },
      refreshLotStatuses: () => {
        set((state) => ({
          lots: state.lots.map((lot) => {
            const daysRemaining = calculateDaysRemaining(lot.expiryDate);
            const status = getExpiryStatus(daysRemaining);
            return { ...lot, daysRemaining, status };
          })
        }));
      }
    }),
    {
      name: "lots-storage"
    }
  )
);
const goodsReceipt = "_goodsReceipt_ohs4w_6";
const header = "_header_ohs4w_27";
const headerLeft = "_headerLeft_ohs4w_35";
const receiptNumber = "_receiptNumber_ohs4w_50";
const headerRight = "_headerRight_ohs4w_60";
const resetBtn = "_resetBtn_ohs4w_65";
const saveBtn = "_saveBtn_ohs4w_66";
const receiptInfo = "_receiptInfo_ohs4w_107";
const infoField = "_infoField_ohs4w_117";
const paymentField = "_paymentField_ohs4w_149";
const paymentToggle = "_paymentToggle_ohs4w_164";
const active = "_active_ohs4w_185";
const paymentSourceBox = "_paymentSourceBox_ohs4w_191";
const sourceToggle = "_sourceToggle_ohs4w_205";
const scannerSection = "_scannerSection_ohs4w_239";
const scanning = "_scanning_ohs4w_250";
const success = "_success_ohs4w_255";
const scannerIcon = "_scannerIcon_ohs4w_260";
const scannerForm = "_scannerForm_ohs4w_275";
const barcodeInput = "_barcodeInput_ohs4w_281";
const scanBtn = "_scanBtn_ohs4w_303";
const searchProductBtn = "_searchProductBtn_ohs4w_319";
const lastScanned = "_lastScanned_ohs4w_336";
const mainContent = "_mainContent_ohs4w_365";
const productsList = "_productsList_ohs4w_371";
const listHeader = "_listHeader_ohs4w_378";
const itemCount = "_itemCount_ohs4w_391";
const emptyState = "_emptyState_ohs4w_399";
const linesTable = "_linesTable_ohs4w_417";
const tableHeader = "_tableHeader_ohs4w_422";
const lineRow = "_lineRow_ohs4w_436";
const productInfo = "_productInfo_ohs4w_449";
const emoji = "_emoji_ohs4w_455";
const productName = "_productName_ohs4w_459";
const barcode = "_barcode_ohs4w_281";
const qtyField = "_qtyField_ohs4w_472";
const priceField = "_priceField_ohs4w_512";
const lineTotal = "_lineTotal_ohs4w_534";
const complete = "_complete_ohs4w_556";
const removeBtn = "_removeBtn_ohs4w_576";
const summary = "_summary_ohs4w_598";
const summaryRow = "_summaryRow_ohs4w_613";
const summaryTotal = "_summaryTotal_ohs4w_626";
const supplierInfo = "_supplierInfo_ohs4w_638";
const overlay = "_overlay_ohs4w_667";
const modal = "_modal_ohs4w_678";
const modalHeader = "_modalHeader_ohs4w_700";
const modalBody = "_modalBody_ohs4w_730";
const modalFooter = "_modalFooter_ohs4w_734";
const searchBox = "_searchBox_ohs4w_744";
const searchResults = "_searchResults_ohs4w_767";
const productResult = "_productResult_ohs4w_772";
const productDetails = "_productDetails_ohs4w_786";
const name = "_name_ohs4w_792";
const meta = "_meta_ohs4w_797";
const price = "_price_ohs4w_512";
const confirmSummary = "_confirmSummary_ohs4w_808";
const totalHighlight = "_totalHighlight_ohs4w_820";
const stockUpdateNotice = "_stockUpdateNotice_ohs4w_826";
const cancelBtn = "_cancelBtn_ohs4w_841";
const confirmBtn = "_confirmBtn_ohs4w_842";
const lotExpiryField = "_lotExpiryField_ohs4w_913";
const lotInput = "_lotInput_ohs4w_923";
const expiryInput = "_expiryInput_ohs4w_938";
const historySection = "_historySection_ohs4w_957";
const historyHeader = "_historyHeader_ohs4w_965";
const historyCount = "_historyCount_ohs4w_977";
const emptyHistory = "_emptyHistory_ohs4w_982";
const historyTable = "_historyTable_ohs4w_988";
const historyTableHeader = "_historyTableHeader_ohs4w_993";
const historyRow = "_historyRow_ohs4w_1005";
const receiptNum = "_receiptNum_ohs4w_50";
const historyTotal = "_historyTotal_ohs4w_1025";
const paid = "_paid_ohs4w_1029";
const unpaid = "_unpaid_ohs4w_1037";
const clickable = "_clickable_ohs4w_1045";
const receiptDetails = "_receiptDetails_ohs4w_1054";
const detailRow = "_detailRow_ohs4w_1064";
const receiptItemsList = "_receiptItemsList_ohs4w_1078";
const receiptItem = "_receiptItem_ohs4w_1078";
const itemInfo = "_itemInfo_ohs4w_1096";
const itemEmoji = "_itemEmoji_ohs4w_1102";
const itemName = "_itemName_ohs4w_1106";
const itemBarcode = "_itemBarcode_ohs4w_1112";
const itemQty = "_itemQty_ohs4w_1119";
const itemPrice = "_itemPrice_ohs4w_1126";
const itemTotal = "_itemTotal_ohs4w_1131";
const receiptTotal = "_receiptTotal_ohs4w_1138";
const styles = {
  goodsReceipt,
  header,
  headerLeft,
  receiptNumber,
  headerRight,
  resetBtn,
  saveBtn,
  receiptInfo,
  infoField,
  paymentField,
  paymentToggle,
  active,
  paymentSourceBox,
  sourceToggle,
  scannerSection,
  scanning,
  success,
  scannerIcon,
  scannerForm,
  barcodeInput,
  scanBtn,
  searchProductBtn,
  lastScanned,
  mainContent,
  productsList,
  listHeader,
  itemCount,
  emptyState,
  linesTable,
  tableHeader,
  lineRow,
  productInfo,
  emoji,
  productName,
  barcode,
  qtyField,
  priceField,
  lineTotal,
  complete,
  removeBtn,
  summary,
  summaryRow,
  summaryTotal,
  supplierInfo,
  overlay,
  modal,
  modalHeader,
  modalBody,
  modalFooter,
  searchBox,
  searchResults,
  productResult,
  productDetails,
  name,
  meta,
  price,
  confirmSummary,
  totalHighlight,
  stockUpdateNotice,
  cancelBtn,
  confirmBtn,
  lotExpiryField,
  lotInput,
  expiryInput,
  historySection,
  historyHeader,
  historyCount,
  emptyHistory,
  historyTable,
  historyTableHeader,
  historyRow,
  receiptNum,
  historyTotal,
  paid,
  unpaid,
  clickable,
  receiptDetails,
  detailRow,
  receiptItemsList,
  receiptItem,
  itemInfo,
  itemEmoji,
  itemName,
  itemBarcode,
  itemQty,
  itemPrice,
  itemTotal,
  receiptTotal
};
const GoodsReceipt = () => {
  const { formatCurrency } = useSettings();
  const { products, updateStock } = useProductsStore();
  const { suppliers, goodsReceipts, addGoodsReceipt } = usePurchasesStore();
  const { currentSession, addExpense, safeBalance, getCurrentBalance, withdrawFromSafe } = useTreasuryFacade();
  const { addMovement: addStockMovement } = useStockMovementsStore();
  const { addLot } = useLotsStore();
  const toast = useToast();
  const generateInvoiceNumber = () => {
    const today = /* @__PURE__ */ new Date();
    const prefix = "FAC";
    const dateStr = today.toISOString().split("T")[0].replace(/-/g, "");
    const seq = String(goodsReceipts.length + 1).padStart(4, "0");
    return `${prefix}-${dateStr}-${seq}`;
  };
  const [receiptLines, setReceiptLines] = reactExports.useState([]);
  const [barcodeInput2, setBarcodeInput] = reactExports.useState("");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedSupplierId, setSelectedSupplierId] = reactExports.useState("");
  const [receiptNumber2, setReceiptNumber] = reactExports.useState(`BE-${Date.now().toString().slice(-6)}`);
  const [receiptDate, setReceiptDate] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const [invoiceNumber, setInvoiceNumber] = reactExports.useState(generateInvoiceNumber());
  const [showProductSearch, setShowProductSearch] = reactExports.useState(false);
  const [showConfirmModal, setShowConfirmModal] = reactExports.useState(false);
  const [isScanning, setIsScanning] = reactExports.useState(false);
  const [lastScannedProduct, setLastScannedProduct] = reactExports.useState(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = reactExports.useState(false);
  const [isPaid, setIsPaid] = reactExports.useState(true);
  const [paymentSource, setPaymentSource] = reactExports.useState("cash");
  const [viewReceiptId, setViewReceiptId] = reactExports.useState(null);
  const viewingReceipt = reactExports.useMemo(
    () => viewReceiptId ? goodsReceipts.find((r) => r.id === viewReceiptId) : null,
    [viewReceiptId, goodsReceipts]
  );
  const barcodeInputRef = reactExports.useRef(null);
  const searchInputRef = reactExports.useRef(null);
  const selectedSupplier = reactExports.useMemo(
    () => suppliers.find((s) => s.id === selectedSupplierId) || null,
    [suppliers, selectedSupplierId]
  );
  reactExports.useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);
  const totalAmount = reactExports.useMemo(() => receiptLines.reduce((sum, line) => sum + line.total, 0), [receiptLines]);
  const totalItems = reactExports.useMemo(() => receiptLines.reduce((sum, line) => sum + line.receivedQty, 0), [receiptLines]);
  const completedLines = reactExports.useMemo(() => receiptLines.filter((l) => l.receivedQty >= l.orderedQty).length, [receiptLines]);
  const handleBarcodeSubmit = reactExports.useCallback((e) => {
    e?.preventDefault();
    const barcode2 = barcodeInput2.trim();
    if (!barcode2) return;
    setIsScanning(true);
    setTimeout(() => {
      const product = products.find((p) => p.barcode === barcode2);
      if (product) {
        setReceiptLines((prevLines) => {
          const existingLineIndex = prevLines.findIndex((l) => l.product.id === product.id);
          if (existingLineIndex > -1) {
            const newLines = [...prevLines];
            const line = newLines[existingLineIndex];
            newLines[existingLineIndex] = {
              ...line,
              receivedQty: line.receivedQty + 1,
              total: (line.receivedQty + 1) * line.purchasePrice
            };
            return newLines;
          } else {
            const newLine = {
              id: crypto.randomUUID(),
              product,
              orderedQty: 1,
              receivedQty: 1,
              receiveAs: "units",
              purchasePrice: product.purchasePrice || 0,
              total: product.purchasePrice || 0,
              expiryDate: null
            };
            return [newLine, ...prevLines];
          }
        });
        setLastScannedProduct(product);
        setShowSuccessAnimation(true);
        setTimeout(() => setShowSuccessAnimation(false), 1e3);
      } else {
        toast.warning(`Produit non trouvé: ${barcode2}`);
      }
      setBarcodeInput("");
      setIsScanning(false);
      barcodeInputRef.current?.focus();
    }, 200);
  }, [barcodeInput2, products]);
  const handleQuantityChange = (lineId, newQty) => {
    if (newQty < 0) return;
    setReceiptLines((lines) => lines.map(
      (l) => l.id === lineId ? { ...l, receivedQty: newQty, total: newQty * l.purchasePrice } : l
    ));
  };
  const handlePriceChange = (lineId, newPrice) => {
    if (newPrice < 0) return;
    setReceiptLines((lines) => lines.map(
      (l) => l.id === lineId ? { ...l, purchasePrice: newPrice, total: l.receivedQty * newPrice } : l
    ));
  };
  const handleRemoveLine = (lineId) => {
    setReceiptLines((lines) => lines.filter((l) => l.id !== lineId));
  };
  const handleExpiryChange = (lineId, expiryDate) => {
    setReceiptLines((lines) => lines.map(
      (l) => l.id === lineId ? { ...l, expiryDate } : l
    ));
  };
  const handleLotChange = (lineId, lotNumber) => {
    setReceiptLines((lines) => lines.map(
      (l) => l.id === lineId ? { ...l, lotNumber } : l
    ));
  };
  const handleAddProduct = (product) => {
    const existingLine = receiptLines.find((l) => l.product.id === product.id);
    if (existingLine) {
      handleQuantityChange(existingLine.id, existingLine.receivedQty + 1);
    } else {
      const newLine = {
        id: crypto.randomUUID(),
        product,
        orderedQty: 1,
        receivedQty: 1,
        receiveAs: "units",
        purchasePrice: product.purchasePrice || 0,
        total: product.purchasePrice || 0,
        expiryDate: null
      };
      setReceiptLines([newLine, ...receiptLines]);
    }
    setShowProductSearch(false);
    setSearchQuery("");
    barcodeInputRef.current?.focus();
  };
  const filteredProducts = reactExports.useMemo(
    () => products.filter(
      (p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode.includes(searchQuery) || p.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 50),
    [products, searchQuery]
  );
  const handleSaveReceipt = () => {
    if (receiptLines.length === 0) {
      toast.warning("Ajoutez au moins un produit");
      return;
    }
    if (!selectedSupplier) {
      toast.warning("Sélectionnez un fournisseur");
      return;
    }
    if (isPaid) {
      const available = paymentSource === "cash" ? getCurrentBalance() : safeBalance;
      if (available < totalAmount) {
        toast.error(`Fonds insuffisants en ${paymentSource === "cash" ? "caisse" : "coffre"}`);
        return;
      }
    }
    setShowConfirmModal(true);
  };
  const handleConfirmReceipt = () => {
    if (!selectedSupplier) return;
    const purchaseItems = receiptLines.map((line) => ({
      id: crypto.randomUUID(),
      productId: line.product.id,
      productName: line.product.name,
      productBarcode: line.product.barcode,
      productEmoji: line.product.emoji,
      orderedQty: line.orderedQty,
      receivedQty: line.receivedQty,
      purchasePrice: line.purchasePrice,
      total: line.total,
      expiryDate: line.expiryDate?.toISOString(),
      unit: line.product.unit
    }));
    addGoodsReceipt({
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      date: receiptDate,
      invoiceNumber,
      items: purchaseItems,
      total: totalAmount,
      status: "completed",
      isPaid,
      paidFrom: isPaid ? paymentSource : void 0
    });
    receiptLines.forEach((line) => {
      addStockMovement({
        type: "entry",
        productId: line.product.id,
        productName: line.product.name,
        productEmoji: line.product.emoji,
        quantity: line.receivedQty,
        previousStock: line.product.stock,
        newStock: line.product.stock + line.receivedQty,
        reason: `Réception ${receiptNumber2}`,
        performedBy: "Admin",
        reference: receiptNumber2
      });
      updateStock(line.product.id, line.receivedQty, "add");
      if (line.expiryDate || line.product.isPerishable) {
        addLot({
          productId: line.product.id,
          productName: line.product.name,
          productBarcode: line.product.barcode,
          lotNumber: line.lotNumber || `LOT-${receiptNumber2.slice(-4)}-${line.product.sku || line.product.id.slice(-4)}`,
          quantity: line.receivedQty,
          originalQuantity: line.receivedQty,
          expiryDate: line.expiryDate ? line.expiryDate.toISOString() : new Date(Date.now() + (line.product.shelfLifeDays || 30) * 24 * 60 * 60 * 1e3).toISOString(),
          receivedDate: (/* @__PURE__ */ new Date()).toISOString(),
          supplierId: selectedSupplier.id,
          supplierName: selectedSupplier.name,
          goodsReceiptId: receiptNumber2,
          purchasePrice: line.purchasePrice
        });
      }
    });
    if (isPaid) {
      const expenseDesc = `Achat stock: ${selectedSupplier.name} (${receiptNumber2})`;
      if (paymentSource === "cash") {
        if (!currentSession) {
          toast.warning("Session de caisse fermée. Paiement enregistré comme dette fournisseur.");
        } else {
          addExpense({
            description: expenseDesc,
            amount: totalAmount,
            category: "Achats",
            paymentMethod: "cash",
            date: (/* @__PURE__ */ new Date()).toISOString()
          }, true, "cash");
        }
      } else {
        withdrawFromSafe(totalAmount, expenseDesc, "Admin");
        addExpense({
          description: expenseDesc,
          amount: totalAmount,
          category: "Achats",
          paymentMethod: "safe",
          date: (/* @__PURE__ */ new Date()).toISOString()
        }, true, "safe");
      }
    }
    setReceiptLines([]);
    setSelectedSupplierId("");
    setInvoiceNumber("");
    setReceiptNumber(`BE-${Date.now().toString().slice(-6)}`);
    setShowConfirmModal(false);
    toast.success("Bon d'entrée enregistré et stock mis à jour!");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.goodsReceipt, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.header, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.headerLeft, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 28 }),
          "Bon d'Entrée"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.receiptNumber, children: receiptNumber2 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.headerRight, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.resetBtn, onClick: () => setReceiptLines([]), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 18 }),
          "Nouveau"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: styles.saveBtn,
            onClick: handleSaveReceipt,
            disabled: receiptLines.length === 0,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 18 }),
              "Enregistrer"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.receiptInfo, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.infoField, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 16 }),
          " Date"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "date",
            value: receiptDate,
            onChange: (e) => setReceiptDate(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.infoField, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 16 }),
          " Fournisseur"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: selectedSupplierId,
            onChange: (e) => setSelectedSupplierId(e.target.value),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Sélectionner..." }),
              suppliers.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.id, children: s.name }, s.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.infoField, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 16 }),
          " N° Facture"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: invoiceNumber,
            onChange: (e) => setInvoiceNumber(e.target.value),
            placeholder: "FAC-00000"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.paymentField, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 16 }),
          " Paiement"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.paymentToggle, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: isPaid ? styles.active : "",
              onClick: () => setIsPaid(true),
              children: "Payé"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: !isPaid ? styles.active : "",
              onClick: () => setIsPaid(false),
              children: "Crédit"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles.scannerSection} ${isScanning ? styles.scanning : ""} ${showSuccessAnimation ? styles.success : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.scannerIcon, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Barcode, { size: 32 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleBarcodeSubmit, className: styles.scannerForm, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: barcodeInputRef,
            type: "text",
            value: barcodeInput2,
            onChange: (e) => setBarcodeInput(e.target.value),
            placeholder: "Scanner ou saisir le code-barres...",
            className: styles.barcodeInput,
            autoComplete: "off"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: styles.scanBtn, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 20 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: styles.searchProductBtn,
          onClick: () => {
            setShowProductSearch(true);
            setTimeout(() => searchInputRef.current?.focus(), 100);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18 }),
            "Rechercher produit"
          ]
        }
      ),
      lastScannedProduct && showSuccessAnimation && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.lastScanned, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 18 }),
        lastScannedProduct.emoji,
        " ",
        lastScannedProduct.name,
        " ajouté!"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.mainContent, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.productsList, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.listHeader, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Produits reçus" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.itemCount, children: [
            receiptLines.length,
            " articles • ",
            totalItems,
            " unités"
          ] })
        ] }),
        receiptLines.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.emptyState, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Barcode, { size: 48 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Scannez un code-barres pour ajouter des produits" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.linesTable, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.tableHeader, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Produit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Qté Reçue" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Prix U." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Lot / Expiration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
          ] }),
          receiptLines.map((line) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.lineRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.productInfo, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.emoji, children: line.product.emoji }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.productName, children: line.product.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.barcode, children: line.product.barcode })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.qtyField, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleQuantityChange(line.id, line.receivedQty - 1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 14 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  value: line.receivedQty,
                  onChange: (e) => handleQuantityChange(line.id, parseInt(e.target.value) || 0)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleQuantityChange(line.id, line.receivedQty + 1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.priceField, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  value: line.purchasePrice,
                  onChange: (e) => handlePriceChange(line.id, parseFloat(e.target.value) || 0)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "DA" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.lotExpiryField, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  className: styles.lotInput,
                  value: line.lotNumber || "",
                  onChange: (e) => handleLotChange(line.id, e.target.value),
                  placeholder: "N° Lot"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "date",
                  className: styles.expiryInput,
                  value: line.expiryDate ? line.expiryDate.toISOString().split("T")[0] : "",
                  onChange: (e) => handleExpiryChange(line.id, e.target.value ? new Date(e.target.value) : null)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.lineTotal, children: formatCurrency(line.total) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: styles.removeBtn,
                onClick: () => handleRemoveLine(line.id),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 })
              }
            )
          ] }, line.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.summary, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Récapitulatif" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.summaryRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Articles" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: receiptLines.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.summaryRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Unités totales" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: totalItems })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.summaryRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Lignes complètes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.complete, children: [
            completedLines,
            "/",
            receiptLines.length
          ] })
        ] }),
        isPaid && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.paymentSourceBox, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Source du paiement" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.sourceToggle, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: paymentSource === "cash" ? styles.active : "",
                onClick: () => setPaymentSource("cash"),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { size: 14 }),
                  " Caisse"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: paymentSource === "safe" ? styles.active : "",
                onClick: () => setPaymentSource("safe"),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 14 }),
                  " Coffre"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.summaryTotal, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "TOTAL" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCurrency(totalAmount) })
        ] }),
        selectedSupplier && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.supplierInfo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selectedSupplier.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: selectedSupplier.phone })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.historySection, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.historyHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "📋 Historique des Bons d'Entrée" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.historyCount, children: [
          goodsReceipts.length,
          " bons enregistrés"
        ] })
      ] }),
      goodsReceipts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.emptyHistory, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Aucun bon d'entrée enregistré" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.historyTable, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.historyTableHeader, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "N° Bon" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Fournisseur" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "N° Facture" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Articles" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Statut" })
        ] }),
        goodsReceipts.slice(0, 10).map((receipt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `${styles.historyRow} ${styles.clickable}`,
            onClick: () => setViewReceiptId(receipt.id),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.receiptNum, children: receipt.grNumber }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(receipt.date).toLocaleDateString("fr-FR") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: receipt.supplierName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: receipt.invoiceNumber || "-" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: receipt.items.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.historyTotal, children: formatCurrency(receipt.total) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: receipt.isPaid ? styles.paid : styles.unpaid, children: receipt.isPaid ? "✓ Payé" : "⏳ Crédit" })
            ]
          },
          receipt.id
        ))
      ] })
    ] }),
    showProductSearch && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.overlay, onClick: () => setShowProductSearch(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Rechercher un produit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowProductSearch(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.searchBox, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: searchInputRef,
              type: "text",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              placeholder: "Nom, code-barres ou catégorie..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.searchResults, children: filteredProducts.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: styles.productResult,
            onClick: () => handleAddProduct(product),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.emoji, children: product.emoji }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.productDetails, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.name, children: product.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.meta, children: [
                  product.barcode,
                  " • ",
                  product.category,
                  " • Stock: ",
                  product.stock
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.price, children: formatCurrency(product.purchasePrice) })
            ]
          },
          product.id
        )) })
      ] })
    ] }) }),
    showConfirmModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.overlay, onClick: () => setShowConfirmModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Confirmer le bon d'entrée" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowConfirmModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.confirmSummary, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "N° Bon:" }),
            " ",
            receiptNumber2
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Fournisseur:" }),
            " ",
            selectedSupplier?.name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Total à payer:" }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.totalHighlight, children: formatCurrency(totalAmount) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Paiement:" }),
            " ",
            isPaid ? `Réglé par ${paymentSource === "cash" ? "Caisse" : "Coffre"}` : "Crédit fournisseur"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.stockUpdateNotice, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Les quantités reçues seront ajoutées au stock de chaque produit (",
            totalItems,
            " unités au total)."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles.cancelBtn, onClick: () => setShowConfirmModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.confirmBtn, onClick: handleConfirmReceipt, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 18 }),
          "Confirmer et mettre à jour le stock"
        ] })
      ] })
    ] }) }),
    viewingReceipt && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.overlay, onClick: () => setViewReceiptId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
          "📋 Bon d'entrée: ",
          viewingReceipt.grNumber
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setViewReceiptId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.receiptDetails, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.detailRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Date:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: new Date(viewingReceipt.date).toLocaleDateString("fr-FR") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.detailRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Fournisseur:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: viewingReceipt.supplierName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.detailRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "N° Facture:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: viewingReceipt.invoiceNumber || "N/A" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.detailRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Statut:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: viewingReceipt.isPaid ? styles.paid : styles.unpaid, children: viewingReceipt.isPaid ? "✓ Payé" : "⏳ Crédit" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { children: [
          "Articles (",
          viewingReceipt.items.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.receiptItemsList, children: viewingReceipt.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.receiptItem, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.itemInfo, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.itemEmoji, children: item.productEmoji }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.itemName, children: item.productName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.itemBarcode, children: item.productBarcode })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.itemQty, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              item.receivedQty,
              " ",
              item.unit
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.itemPrice, children: [
              "@ ",
              formatCurrency(item.purchasePrice)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.itemTotal, children: formatCurrency(item.total) })
        ] }, item.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.receiptTotal, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "TOTAL" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(viewingReceipt.total) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.modalFooter, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setViewReceiptId(null), children: "Fermer" }) })
    ] }) })
  ] });
};
export {
  GoodsReceipt as G
};

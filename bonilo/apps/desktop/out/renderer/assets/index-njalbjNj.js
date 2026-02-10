import { j as jsxRuntimeExports } from "./vendor-state-DFI86SKa.js";
import { u as useNavigate, r as reactExports } from "./vendor-react-Df__x13C.js";
import { c as useProductsStore, b as useSalesStore, d as useCustomersStore, e as useStockMovementsStore, a as useAuthStore, f as useToast, g as useTVA, h as usePOSSettings } from "./index-BbOgUw3k.js";
import { u as useTreasuryFacade } from "./useTreasuryFacade-CchObU-E.js";
import { C as ConfirmModal } from "./ConfirmModal-IjhJ8y4D.js";
import { f as formatCurrency, a as formatTime } from "./formatters-BiCn3FBI.js";
import { a6 as Barcode, X, r as Search, a7 as Star, a8 as Layers, a9 as ArrowLeft, aa as Pause, ab as History, ac as Keyboard, ad as UserCheck, t as User, i as ShoppingCart, ae as Minus, af as Plus, v as Trash2, ag as Percent, _ as CreditCard, l as Printer, ah as Banknote, j as Wallet, e as Clock, C as CircleAlert, a as CircleCheckBig, ai as RotateCcw, a5 as Eye, aj as PenLine, ak as Box } from "./vendor-ui-DiXyqbDT.js";
import "./vendor-i18n-DeCNyroL.js";
const pos = "_pos_1uocr_6";
const cartPanel = "_cartPanel_1uocr_20";
const cartHeader = "_cartHeader_1uocr_27";
const backBtn = "_backBtn_1uocr_43";
const headerActions = "_headerActions_1uocr_61";
const heldBadge = "_heldBadge_1uocr_66";
const historyBtn = "_historyBtn_1uocr_79";
const shortcutsBtn = "_shortcutsBtn_1uocr_80";
const customerBar = "_customerBar_1uocr_99";
const customerBtn = "_customerBtn_1uocr_107";
const customerIcon = "_customerIcon_1uocr_127";
const clearCustomer = "_clearCustomer_1uocr_131";
const cartItems = "_cartItems_1uocr_144";
const emptyCart = "_emptyCart_1uocr_150";
const cartItem = "_cartItem_1uocr_144";
const itemEmoji = "_itemEmoji_1uocr_182";
const itemInfo = "_itemInfo_1uocr_187";
const itemName = "_itemName_1uocr_192";
const itemPrice = "_itemPrice_1uocr_200";
const itemQty = "_itemQty_1uocr_205";
const itemTotal = "_itemTotal_1uocr_255";
const itemRemove = "_itemRemove_1uocr_263";
const cartSummary = "_cartSummary_1uocr_283";
const summaryLine = "_summaryLine_1uocr_289";
const discount = "_discount_1uocr_297";
const totalLine = "_totalLine_1uocr_302";
const totalValue = "_totalValue_1uocr_317";
const cartActions = "_cartActions_1uocr_324";
const secondaryBtns = "_secondaryBtns_1uocr_329";
const dangerBtn = "_dangerBtn_1uocr_362";
const payBtn = "_payBtn_1uocr_368";
const payAmount = "_payAmount_1uocr_389";
const productsPanel = "_productsPanel_1uocr_411";
const searchBar = "_searchBar_1uocr_421";
const categories$1 = "_categories_1uocr_462";
const catBtn = "_catBtn_1uocr_474";
const active = "_active_1uocr_492";
const productsGrid = "_productsGrid_1uocr_499";
const noProducts = "_noProducts_1uocr_509";
const productCard = "_productCard_1uocr_524";
const lowStock = "_lowStock_1uocr_552";
const starIcon = "_starIcon_1uocr_557";
const productEmoji = "_productEmoji_1uocr_564";
const productName = "_productName_1uocr_570";
const productPrice = "_productPrice_1uocr_586";
const overlay = "_overlay_1uocr_597";
const paymentModal = "_paymentModal_1uocr_619";
const smallModal = "_smallModal_1uocr_620";
const mediumModal = "_mediumModal_1uocr_621";
const modalHeader = "_modalHeader_1uocr_654";
const printToggle = "_printToggle_1uocr_684";
const modalFooter = "_modalFooter_1uocr_704";
const cancelBtn = "_cancelBtn_1uocr_713";
const confirmBtn = "_confirmBtn_1uocr_723";
const paymentTotal = "_paymentTotal_1uocr_747";
const bigTotal = "_bigTotal_1uocr_762";
const paymentMethods = "_paymentMethods_1uocr_768";
const methodBtn = "_methodBtn_1uocr_775";
const selected = "_selected_1uocr_797";
const cashSection = "_cashSection_1uocr_803";
const quickAmounts = "_quickAmounts_1uocr_830";
const exact = "_exact_1uocr_853";
const changeDisplay = "_changeDisplay_1uocr_859";
const changeValue = "_changeValue_1uocr_869";
const warning = "_warning_1uocr_875";
const discountGrid = "_discountGrid_1uocr_888";
const discountBtn = "_discountBtn_1uocr_895";
const customDiscount = "_customDiscount_1uocr_915";
const discountPreview = "_discountPreview_1uocr_938";
const heldList = "_heldList_1uocr_949";
const historyList = "_historyList_1uocr_950";
const emptyState = "_emptyState_1uocr_956";
const heldItem = "_heldItem_1uocr_968";
const historyItem = "_historyItem_1uocr_969";
const heldInfo = "_heldInfo_1uocr_979";
const historyInfo = "_historyInfo_1uocr_980";
const heldTime = "_heldTime_1uocr_986";
const historyTime = "_historyTime_1uocr_987";
const historyId = "_historyId_1uocr_992";
const heldTotal = "_heldTotal_1uocr_997";
const historyTotal = "_historyTotal_1uocr_998";
const heldActions = "_heldActions_1uocr_1003";
const historyActions = "_historyActions_1uocr_1004";
const recallBtn = "_recallBtn_1uocr_1009";
const editBtn = "_editBtn_1uocr_1049";
const refundBtn = "_refundBtn_1uocr_1060";
const searchInput = "_searchInput_1uocr_1072";
const customerList = "_customerList_1uocr_1082";
const shortcutsList = "_shortcutsList_1uocr_1111";
const shortcutItem = "_shortcutItem_1uocr_1115";
const hasBundle = "_hasBundle_1uocr_1203";
const packBadge = "_packBadge_1uocr_1208";
const packSelectorModal = "_packSelectorModal_1uocr_1224";
const packSelectorBody = "_packSelectorBody_1uocr_1234";
const productPreview = "_productPreview_1uocr_1238";
const previewEmoji = "_previewEmoji_1uocr_1246";
const previewName = "_previewName_1uocr_1250";
const packOptions = "_packOptions_1uocr_1257";
const packOption = "_packOption_1uocr_1257";
const packHighlight = "_packHighlight_1uocr_1283";
const discountRibbon = "_discountRibbon_1uocr_1293";
const optionIcon = "_optionIcon_1uocr_1305";
const optionInfo = "_optionInfo_1uocr_1320";
const optionTitle = "_optionTitle_1uocr_1327";
const optionPrice = "_optionPrice_1uocr_1333";
const optionSaving = "_optionSaving_1uocr_1343";
const saleDetailBody = "_saleDetailBody_1uocr_1353";
const saleDetailInfo = "_saleDetailInfo_1uocr_1357";
const detailRow = "_detailRow_1uocr_1367";
const saleDetailProducts = "_saleDetailProducts_1uocr_1383";
const productsList = "_productsList_1uocr_1396";
const productRow = "_productRow_1uocr_1402";
const productQty = "_productQty_1uocr_1417";
const saleDetailTotal = "_saleDetailTotal_1uocr_1435";
const customerBtnInfo = "_customerBtnInfo_1uocr_1456";
const customerBtnName = "_customerBtnName_1uocr_1463";
const customerBtnPhone = "_customerBtnPhone_1uocr_1467";
const styles = {
  pos,
  cartPanel,
  cartHeader,
  backBtn,
  headerActions,
  heldBadge,
  historyBtn,
  shortcutsBtn,
  customerBar,
  customerBtn,
  customerIcon,
  clearCustomer,
  cartItems,
  emptyCart,
  cartItem,
  itemEmoji,
  itemInfo,
  itemName,
  itemPrice,
  itemQty,
  itemTotal,
  itemRemove,
  cartSummary,
  summaryLine,
  discount,
  totalLine,
  totalValue,
  cartActions,
  secondaryBtns,
  dangerBtn,
  payBtn,
  payAmount,
  productsPanel,
  searchBar,
  categories: categories$1,
  catBtn,
  active,
  productsGrid,
  noProducts,
  productCard,
  lowStock,
  starIcon,
  productEmoji,
  productName,
  productPrice,
  overlay,
  paymentModal,
  smallModal,
  mediumModal,
  modalHeader,
  printToggle,
  modalFooter,
  cancelBtn,
  confirmBtn,
  paymentTotal,
  bigTotal,
  paymentMethods,
  methodBtn,
  selected,
  cashSection,
  quickAmounts,
  exact,
  changeDisplay,
  changeValue,
  warning,
  discountGrid,
  discountBtn,
  customDiscount,
  discountPreview,
  heldList,
  historyList,
  emptyState,
  heldItem,
  historyItem,
  heldInfo,
  historyInfo,
  heldTime,
  historyTime,
  historyId,
  heldTotal,
  historyTotal,
  heldActions,
  historyActions,
  recallBtn,
  editBtn,
  refundBtn,
  searchInput,
  customerList,
  shortcutsList,
  shortcutItem,
  hasBundle,
  packBadge,
  packSelectorModal,
  packSelectorBody,
  productPreview,
  previewEmoji,
  previewName,
  packOptions,
  packOption,
  packHighlight,
  discountRibbon,
  optionIcon,
  optionInfo,
  optionTitle,
  optionPrice,
  optionSaving,
  saleDetailBody,
  saleDetailInfo,
  detailRow,
  saleDetailProducts,
  productsList,
  productRow,
  productQty,
  saleDetailTotal,
  customerBtnInfo,
  customerBtnName,
  customerBtnPhone
};
const categories = [
  { id: "favorites", name: "Favoris ⭐", color: "#F59E0B" },
  { id: "all", name: "Tous", color: "#4285F4" },
  { id: "beverages", name: "Boissons", color: "#34C759" },
  { id: "dairy", name: "Laitiers", color: "#8B5CF6" },
  { id: "bakery", name: "Boulangerie", color: "#F97316" },
  { id: "grocery", name: "Épicerie", color: "#06B6D4" },
  { id: "snacks", name: "Snacks", color: "#EC4899" },
  { id: "cleaning", name: "Entretien", color: "#10B981" }
];
const POS = () => {
  const navigate = useNavigate();
  const { products, updateStock } = useProductsStore();
  const { addMovement, currentSession } = useTreasuryFacade();
  const { sales, addSale } = useSalesStore();
  const { customers, updateCredit, getCustomerByBarcode } = useCustomersStore();
  const { addMovement: addStockMovement } = useStockMovementsStore();
  const { user } = useAuthStore();
  const toast = useToast();
  const { tvaEnabled, tvaRate: settingsTvaRate } = useTVA();
  const posSettings = usePOSSettings();
  const storeProducts = reactExports.useMemo(() => {
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.sellingPrice,
      sku: p.sku || p.barcode,
      category: p.categoryId || p.category?.toLowerCase().replace(/\s+/g, "") || "grocery",
      stock: p.stock,
      image: p.emoji || "📦",
      isFavorite: p.isFavorite,
      unitsPerPack: p.unitsPerPack || 1,
      bundlePrice: p.unitsPerPack && p.unitsPerPack > 1 ? Math.floor(p.sellingPrice * p.unitsPerPack * 0.9) : null
    }));
  }, [products]);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedCategory, setSelectedCategory] = reactExports.useState("favorites");
  const [cart, setCart] = reactExports.useState([]);
  const [showPayment, setShowPayment] = reactExports.useState(false);
  const [showShortcuts, setShowShortcuts] = reactExports.useState(false);
  const [showHeldSales, setShowHeldSales] = reactExports.useState(false);
  const [showDiscount, setShowDiscount] = reactExports.useState(false);
  const [showCustomerSearch, setShowCustomerSearch] = reactExports.useState(false);
  const [showSalesHistory, setShowSalesHistory] = reactExports.useState(false);
  const [selectedPayment, setSelectedPayment] = reactExports.useState(posSettings.defaultPaymentMethod || "cash");
  const [amountReceived, setAmountReceived] = reactExports.useState("");
  const [discountPercent, setDiscountPercent] = reactExports.useState(0);
  const [selectedCustomer, setSelectedCustomer] = reactExports.useState(null);
  const [heldSales, setHeldSales] = reactExports.useState([]);
  const [autoPrint, setAutoPrint] = reactExports.useState(true);
  const [showPackSelector, setShowPackSelector] = reactExports.useState(false);
  const [pendingProduct, setPendingProduct] = reactExports.useState(null);
  const [selectedSaleDetail, setSelectedSaleDetail] = reactExports.useState(null);
  const [showRefundConfirm, setShowRefundConfirm] = reactExports.useState(false);
  const [saleToRefund, setSaleToRefund] = reactExports.useState(null);
  const searchInputRef = reactExports.useRef(null);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const vatRate = tvaEnabled ? settingsTvaRate / 100 : 0;
  const vatAmount = subtotalAfterDiscount * vatRate;
  const total = subtotalAfterDiscount + vatAmount;
  const change = parseFloat(amountReceived || "0") - total;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const allProducts = storeProducts;
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || (selectedCategory === "favorites" ? product.isFavorite : product.category === selectedCategory);
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return 0;
  });
  const addToCart = reactExports.useCallback((product, asBundle = false) => {
    const itemPrice2 = asBundle && product.bundlePrice ? product.bundlePrice : product.price;
    const itemName2 = asBundle ? `${product.name} (Pack x${product.unitsPerPack})` : product.name;
    const itemKey = asBundle ? `${product.id}-pack` : product.id;
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === itemKey);
      if (existingItem) {
        return prevCart.map(
          (item) => item.productId === itemKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, {
        id: Date.now().toString(),
        productId: itemKey,
        name: itemName2,
        price: itemPrice2,
        quantity: 1,
        image: product.image,
        isBundle: asBundle,
        unitsInBundle: asBundle ? product.unitsPerPack : 1
      }];
    });
  }, []);
  const handleProductClick = reactExports.useCallback((product) => {
    if (product.unitsPerPack > 1 && product.bundlePrice) {
      setPendingProduct(product);
      setShowPackSelector(true);
    } else {
      addToCart(product, false);
    }
  }, [addToCart]);
  const handleSearchKeyDown = reactExports.useCallback((e) => {
    if (e.key === "Enter" && searchQuery) {
      e.preventDefault();
      const customer = getCustomerByBarcode(searchQuery);
      if (customer) {
        setSelectedCustomer(customer.id);
        setSearchQuery("");
        toast.success(`Client identifié: ${customer.name} ✨`);
        return;
      }
      const productByBarcode = products.find((p) => p.barcode === searchQuery);
      if (productByBarcode) {
        const posProduct = storeProducts.find((p) => p.id === productByBarcode.id);
        if (posProduct) {
          handleProductClick(posProduct);
          setSearchQuery("");
          return;
        }
      }
    }
  }, [searchQuery, getCustomerByBarcode, products, storeProducts, handleProductClick, toast]);
  const updateQuantity = reactExports.useCallback((itemId, delta) => {
    setCart(
      (prevCart) => prevCart.map((item) => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter((item) => item.quantity > 0)
    );
  }, []);
  const setQuantity = reactExports.useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    } else {
      setCart(
        (prevCart) => prevCart.map(
          (item) => item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  }, []);
  const removeFromCart = reactExports.useCallback((itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  }, []);
  const clearCart = reactExports.useCallback(() => {
    if (cart.length === 0) return;
    setCart([]);
    setDiscountPercent(0);
    setSelectedCustomer(null);
    setShowPayment(false);
    setAmountReceived("");
    toast.info("Panier vidé");
  }, [cart.length, toast]);
  const holdSale = reactExports.useCallback(() => {
    if (cart.length === 0) return;
    const newHeldSale = {
      id: Date.now().toString(),
      items: [...cart],
      customer: selectedCustomer,
      timestamp: /* @__PURE__ */ new Date(),
      total
    };
    setHeldSales((prev) => [...prev, newHeldSale]);
    setCart([]);
    setDiscountPercent(0);
    setSelectedCustomer(null);
  }, [cart, selectedCustomer, total]);
  const recallSale = reactExports.useCallback((saleId) => {
    const sale = heldSales.find((s) => s.id === saleId);
    if (sale) {
      setCart(sale.items);
      setSelectedCustomer(sale.customer);
      setHeldSales((prev) => prev.filter((s) => s.id !== saleId));
      setShowHeldSales(false);
      toast.info("Vente rappelée");
    }
  }, [heldSales, toast]);
  const generateReceiptHTML = (saleId, receiptNumber, items, totalAmount, change2, customer, paymentMethod) => {
    return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Courier New', monospace; padding: 10px; width: 280px; font-size: 12px; }
                    .header { text-align: center; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 5px; }
                    .line { display: flex; justify-content: space-between; margin-bottom: 2px; }
                    .divider { border-top: 1px dashed #000; margin: 5px 0; }
                    .total { font-weight: bold; font-size: 14px; margin-top: 5px; }
                    .footer { text-align: center; margin-top: 10px; font-size: 10px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <strong>SUPERMARKET OS</strong><br/>
                    N°: ${receiptNumber}<br/>
                    Date: ${(/* @__PURE__ */ new Date()).toLocaleString("fr-FR")}
                </div>
                ${items.map((item) => `
                    <div class="line">
                        <span>${item.name} x${item.quantity}</span>
                        <span>${formatCurrency(item.price * item.quantity)}</span>
                    </div>
                `).join("")}
                <div class="divider"></div>
                <div class="line total">
                    <span>TOTAL</span>
                    <span>${formatCurrency(totalAmount)}</span>
                </div>
                <div class="line">
                    <span>Reçu</span>
                    <span>${formatCurrency(parseFloat(amountReceived || "0"))}</span>
                </div>
                <div class="line">
                    <span>Monnaie</span>
                    <span>${formatCurrency(change2)}</span>
                </div>
                <div class="divider"></div>
                <div class="footer">
                    <p>Mode: ${paymentMethod}</p>
                    <p>Client: ${customer || "Anonyme"}</p>
                    <p>Merci de votre visite !</p>
                </div>
            </body>
            </html>
        `;
  };
  const completeSale = reactExports.useCallback(async () => {
    const saleId = `sale_${Date.now()}`;
    const receiptNumber = `REC-${Date.now().toString().slice(-6)}`;
    const saleItems = cart.map((item) => ({
      id: crypto.randomUUID(),
      productId: item.productId.replace("-pack", ""),
      productName: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      total: item.price * item.quantity
    }));
    const customerObj = customers.find((c) => c.id === selectedCustomer);
    addSale({
      items: saleItems,
      subtotal,
      taxAmount: vatAmount,
      discountAmount,
      totalAmount: total,
      paymentMethod: selectedPayment,
      customerId: selectedCustomer || void 0,
      customerName: customerObj?.name || void 0,
      cashierId: user?.id || "unknown",
      cashierName: user ? `${user.firstName} ${user.lastName}` : "Caissier",
      status: "completed"
    });
    if (currentSession) {
      addMovement({
        type: "sale",
        amount: total,
        reason: `Vente ${itemCount} articles`,
        reference: receiptNumber,
        createdBy: user ? `${user.firstName} ${user.lastName}` : "Caissier"
      });
      cart.forEach((item) => {
        const quantity = item.isBundle && item.unitsInBundle ? item.quantity * item.unitsInBundle : item.quantity;
        const productId = item.productId.replace("-pack", "");
        const product = products.find((p) => p.id === productId);
        if (product) {
          addStockMovement({
            type: "sale",
            productId,
            productName: product.name,
            productEmoji: product.emoji,
            quantity,
            previousStock: product.stock,
            newStock: product.stock - quantity,
            reason: `Vente ${receiptNumber}`,
            performedBy: "Caissier",
            reference: receiptNumber
          });
          updateStock(productId, quantity, "remove");
        }
      });
    }
    if (selectedPayment === "credit" && customerObj) {
      updateCredit(customerObj.id, total, "purchase", saleId, `Achat POS ${receiptNumber}`);
    }
    if (autoPrint && window.electronAPI) {
      try {
        const html = generateReceiptHTML(saleId, receiptNumber, cart, total, Math.max(0, change), customerObj?.name || null, selectedPayment);
        await window.electronAPI.printReceipt(html);
        toast.success("Ticket imprimé");
      } catch (err) {
        console.error("Print error:", err);
        toast.error("Erreur d'impression");
      }
    }
    toast.success(`Vente complétée! Total: ${formatCurrency(total)} - Monnaie: ${formatCurrency(Math.max(0, change))}`);
    setCart([]);
    setDiscountPercent(0);
    setSelectedCustomer(null);
    setShowPayment(false);
    setAmountReceived("");
    searchInputRef.current?.focus();
  }, [total, amountReceived, change, autoPrint, currentSession, addMovement, cart, itemCount, updateStock, addSale, customers, selectedCustomer, selectedPayment, subtotal, vatAmount, discountAmount, updateCredit, addStockMovement, products, toast]);
  reactExports.useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        if (e.key === "Escape") {
          target.blur();
          searchInputRef.current?.focus();
        }
        return;
      }
      switch (e.key) {
        case "F1":
          e.preventDefault();
          setShowShortcuts(true);
          break;
        case "F2":
          e.preventDefault();
          setShowCustomerSearch(true);
          break;
        case "F3":
          e.preventDefault();
          searchInputRef.current?.focus();
          break;
        case "F4":
          e.preventDefault();
          if (cart.length > 0) setShowDiscount(true);
          break;
        case "F5":
          e.preventDefault();
          setShowSalesHistory(true);
          break;
        case "F6":
          e.preventDefault();
          holdSale();
          break;
        case "F7":
          e.preventDefault();
          setShowHeldSales(true);
          break;
        case "F11":
          e.preventDefault();
          clearCart();
          break;
        case "F12":
          e.preventDefault();
          if (cart.length > 0) setShowPayment(true);
          break;
        case "Escape":
          e.preventDefault();
          setShowPayment(false);
          setShowShortcuts(false);
          setShowHeldSales(false);
          setShowDiscount(false);
          setShowCustomerSearch(false);
          setShowSalesHistory(false);
          searchInputRef.current?.focus();
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cart, holdSale, clearCart]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.pos, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.productsPanel, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.searchBar, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Barcode, { size: 20 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: searchInputRef,
            type: "text",
            placeholder: "Scanner ou rechercher... (F3)",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            onKeyDown: handleSearchKeyDown,
            autoFocus: true
          }
        ),
        searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSearchQuery(""), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.categories, children: categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: `${styles.catBtn} ${selectedCategory === cat.id ? styles.active : ""}`,
          onClick: () => setSelectedCategory(cat.id),
          style: { "--cat-color": cat.color },
          children: cat.name
        },
        cat.id
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.productsGrid, children: filteredProducts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.noProducts, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 48 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Aucun produit trouvé" })
      ] }) : filteredProducts.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: `${styles.productCard} ${product.stock <= 5 ? styles.lowStock : ""} ${product.unitsPerPack > 1 && product.bundlePrice ? styles.hasBundle : ""}`,
          onClick: () => handleProductClick(product),
          children: [
            product.isFavorite && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 12, className: styles.starIcon, fill: "#F59E0B" }),
            product.unitsPerPack > 1 && product.bundlePrice && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.packBadge, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 10 }),
              " x",
              product.unitsPerPack
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.productEmoji, children: product.image }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.productName, children: product.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.productPrice, children: formatCurrency(product.price) })
          ]
        },
        product.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.cartPanel, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.cartHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles.backBtn, onClick: () => navigate("/"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Caisse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.headerActions, children: [
          heldSales.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.heldBadge, onClick: () => setShowHeldSales(true), title: "F7 - Ventes en attente", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { size: 16 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: heldSales.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles.historyBtn, onClick: () => setShowSalesHistory(true), title: "F5 - Historique", children: /* @__PURE__ */ jsxRuntimeExports.jsx(History, { size: 18 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles.shortcutsBtn, onClick: () => setShowShortcuts(true), title: "F1 - Raccourcis", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Keyboard, { size: 18 }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.customerBar, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles.customerBtn, onClick: () => setShowCustomerSearch(true), children: selectedCustomer ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { size: 18, className: styles.customerIcon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: customers.find((c) => c.id === selectedCustomer)?.name })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Client (F2)" })
        ] }) }),
        selectedCustomer && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles.clearCustomer, onClick: () => setSelectedCustomer(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.cartItems, children: cart.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.emptyCart, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 64, strokeWidth: 1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Panier vide" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Scannez ou sélectionnez un produit" })
      ] }) : cart.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.cartItem, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.itemEmoji, children: item.image }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.itemInfo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.itemName, children: item.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.itemPrice, children: formatCurrency(item.price) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.itemQty, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateQuantity(item.id, -1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              value: item.quantity,
              onChange: (e) => setQuantity(item.id, parseInt(e.target.value) || 0),
              min: "0"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateQuantity(item.id, 1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.itemTotal, children: formatCurrency(item.price * item.quantity) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles.itemRemove, onClick: () => removeFromCart(item.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 18 }) })
      ] }, item.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.cartSummary, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.summaryLine, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Sous-total (",
            itemCount,
            " articles)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCurrency(subtotal) })
        ] }),
        discountPercent > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.summaryLine + " " + styles.discount, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Remise (",
            discountPercent,
            "%)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "-",
            formatCurrency(discountAmount)
          ] })
        ] }),
        tvaEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.summaryLine, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "TVA (",
            settingsTvaRate,
            "%)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCurrency(vatAmount) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.totalLine, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "TOTAL" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.totalValue, children: formatCurrency(total) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.cartActions, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.secondaryBtns, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => cart.length > 0 && setShowDiscount(true), disabled: cart.length === 0, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Percent, { size: 18 }),
            " Remise"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: holdSale, disabled: cart.length === 0, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { size: 18 }),
            " Attente"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: clearCart, disabled: cart.length === 0, className: styles.dangerBtn, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 18 }),
            " Vider"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: styles.payBtn,
            onClick: () => setShowPayment(true),
            disabled: cart.length === 0,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 24 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "PAYER" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.payAmount, children: formatCurrency(total) })
            ]
          }
        )
      ] })
    ] }),
    showPayment && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.overlay, onClick: () => setShowPayment(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.paymentModal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Paiement" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.printToggle, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: autoPrint, onChange: (e) => setAutoPrint(e.target.checked) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 16 }),
          "Imprimer ticket"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowPayment(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.paymentTotal, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total à payer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.bigTotal, children: formatCurrency(total) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.paymentMethods, children: [
        { id: "cash", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { size: 28 }), label: "Espèces" },
        { id: "cib", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 28 }), label: "CIB" },
        { id: "dahabia", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 28 }), label: "Dahabia" },
        { id: "credit", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 28 }), label: "Crédit" }
      ].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: `${styles.methodBtn} ${selectedPayment === m.id ? styles.selected : ""}`,
          onClick: () => setSelectedPayment(m.id),
          children: [
            m.icon,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: m.label })
          ]
        },
        m.id
      )) }),
      selectedPayment === "cash" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.cashSection, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Montant reçu" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: amountReceived,
            onChange: (e) => setAmountReceived(e.target.value),
            placeholder: Math.ceil(total).toString(),
            autoFocus: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.quickAmounts, children: [
          [200, 500, 1e3, 2e3, 5e3].map((amt) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setAmountReceived(amt.toString()), children: amt }, amt)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles.exact, onClick: () => setAmountReceived(Math.ceil(total).toString()), children: "Exact" })
        ] }),
        parseFloat(amountReceived || "0") >= total && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.changeDisplay, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Monnaie:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.changeValue, children: formatCurrency(change) })
        ] })
      ] }),
      selectedPayment === "credit" && !selectedCustomer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.warning, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 20 }),
        "Sélectionnez un client pour le crédit"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles.cancelBtn, onClick: () => setShowPayment(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: styles.confirmBtn,
            onClick: completeSale,
            disabled: selectedPayment === "cash" && parseFloat(amountReceived || "0") < total || selectedPayment === "credit" && !selectedCustomer,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 20 }),
              "Confirmer ",
              autoPrint && "& Imprimer"
            ]
          }
        )
      ] })
    ] }) }),
    showDiscount && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.overlay, onClick: () => setShowDiscount(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.smallModal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Remise" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowDiscount(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.discountGrid, children: [5, 10, 15, 20, 25, 30].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: `${styles.discountBtn} ${discountPercent === p ? styles.active : ""}`,
          onClick: () => setDiscountPercent(p),
          children: [
            p,
            "%"
          ]
        },
        p
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.customDiscount, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: discountPercent,
            onChange: (e) => setDiscountPercent(Math.min(100, Math.max(0, parseInt(e.target.value) || 0))),
            min: "0",
            max: "100"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "%" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.discountPreview, children: [
        "Montant: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(discountAmount) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setDiscountPercent(0);
          setShowDiscount(false);
        }, children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles.confirmBtn, onClick: () => setShowDiscount(false), children: "Appliquer" })
      ] })
    ] }) }),
    showHeldSales && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.overlay, onClick: () => setShowHeldSales(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.mediumModal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
          "Ventes en attente (",
          heldSales.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowHeldSales(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.heldList, children: heldSales.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.emptyState, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { size: 48 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Aucune vente en attente" })
      ] }) : heldSales.map((sale) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.heldItem, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.heldInfo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.heldTime, children: formatTime(sale.timestamp) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            sale.items.length,
            " articles"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.heldTotal, children: formatCurrency(sale.total) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.heldActions, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.recallBtn, onClick: () => recallSale(sale.id), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 16 }),
            " Reprendre"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setHeldSales((prev) => prev.filter((s) => s.id !== sale.id)), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 }) })
        ] })
      ] }, sale.id)) })
    ] }) }),
    showSalesHistory && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.overlay, onClick: () => setShowSalesHistory(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.mediumModal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Historique des ventes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowSalesHistory(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.historyList, children: sales.slice(0, 5).map((sale) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.historyItem, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.historyInfo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.historyId, children: sale.id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.historyTime, children: formatTime(new Date(sale.timestamp)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            sale.items.length,
            " articles"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.historyTotal, children: formatCurrency(sale.totalAmount) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.historyActions, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              title: "Voir les détails",
              onClick: () => {
                setSelectedSaleDetail(sale);
                setShowSalesHistory(false);
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              title: "Rappeler pour modification",
              className: styles.editBtn,
              onClick: () => {
                const newCart = sale.items.map((item, idx) => ({
                  id: `recall-${Date.now()}-${idx}`,
                  productId: item.productId,
                  name: item.productName,
                  price: item.unitPrice,
                  quantity: item.quantity,
                  image: "📦",
                  isBundle: false,
                  unitsInBundle: 1
                }));
                setCart(newCart);
                setShowSalesHistory(false);
                if (sale.customerId) setSelectedCustomer(sale.customerId);
                toast.info(`Vente ${sale.id} rappelée - Modifiez et revalidez`);
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { size: 16 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              title: "Remboursement",
              className: styles.refundBtn,
              onClick: () => {
                setSaleToRefund(sale);
                setShowRefundConfirm(true);
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 16 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              title: "Réimprimer le ticket",
              onClick: () => {
                const printWindow = window.open("", "_blank", "width=350,height=500");
                if (printWindow) {
                  const ticketHTML = `
                                                        <!DOCTYPE html>
                                                        <html>
                                                        <head>
                                                            <title>Ticket ${sale.id}</title>
                                                            <style>
                                                                * { margin: 0; padding: 0; box-sizing: border-box; }
                                                                body { font-family: 'Courier New', monospace; padding: 20px; max-width: 280px; margin: 0 auto; }
                                                                .ticket { border: 1px dashed #000; padding: 15px; }
                                                                .header { text-align: center; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
                                                                .line { display: flex; justify-content: space-between; font-size: 12px; padding: 2px 0; }
                                                                .total { border-top: 2px solid #000; margin-top: 10px; padding-top: 10px; font-size: 16px; font-weight: bold; }
                                                                .footer { text-align: center; margin-top: 15px; font-size: 11px; }
                                                            </style>
                                                        </head>
                                                        <body>
                                                            <div class="ticket">
                                                                <div class="header">
                                                                    <strong>TICKET DE CAISSE</strong><br/>
                                                                    <small>{formatTime(new Date(sale.timestamp))} - {sale.id}</small>
                                                                </div>
                                                                ${sale.items.map((p) => `
                                                                    <div class="line">
                                                                        <span>${p.productName} x${p.quantity}</span>
                                                                        <span>${formatCurrency(p.unitPrice * p.quantity)}</span>
                                                                    </div>
                                                                `).join("")}
                                                                <div class="line total">
                                                                    <span>TOTAL</span>
                                                                    <span>${formatCurrency(sale.totalAmount)}</span>
                                                                </div>
                                                                <div class="footer">
                                                                    <p>Paiement: ${sale.paymentMethod}</p>
                                                                    <p>Client: ${sale.customerName || "Anonyme"}</p>
                                                                    <p>Merci de votre visite! 🙏</p>
                                                                </div>
                                                            </div>
                                                            <script>window.onload = function() { window.print(); }<\/script>
                                                        </body>
                                                        </html>
                                                    `;
                  printWindow.document.write(ticketHTML);
                  printWindow.document.close();
                }
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 16 })
            }
          )
        ] })
      ] }, sale.id)) })
    ] }) }),
    selectedSaleDetail && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.overlay, onClick: () => setSelectedSaleDetail(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.mediumModal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
          "Détails de la vente ",
          selectedSaleDetail.id
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedSaleDetail(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.saleDetailBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.saleDetailInfo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.detailRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Heure:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatTime(new Date(selectedSaleDetail.timestamp)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.detailRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Client:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: selectedSaleDetail.customerName || "Client anonyme" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.detailRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Paiement:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: selectedSaleDetail.paymentMethod })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.saleDetailProducts, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Produits" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.productsList, children: selectedSaleDetail.items.map((p, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.productRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.productName, children: p.productName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.productQty, children: [
              "x",
              p.quantity
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.productPrice, children: formatCurrency(p.unitPrice * p.quantity) })
          ] }, idx)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.saleDetailTotal, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.totalValue, children: formatCurrency(selectedSaleDetail.totalAmount) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: styles.cancelBtn,
            onClick: () => setSelectedSaleDetail(null),
            children: "Fermer"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: styles.confirmBtn,
            onClick: async () => {
              if (window.electronAPI) {
                const html = generateReceiptHTML(selectedSaleDetail.id, selectedSaleDetail.id, selectedSaleDetail.items.map((i) => ({ ...i, price: i.unitPrice, name: i.productName })), selectedSaleDetail.totalAmount, 0, selectedSaleDetail.customerName, selectedSaleDetail.paymentMethod);
                await window.electronAPI.printReceipt(html);
                toast.success("Ticket réimprimé");
              } else {
                toast.info("Réimpression du ticket via navigateur...");
                window.print();
              }
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 16 }),
              "Réimprimer"
            ]
          }
        )
      ] })
    ] }) }),
    showCustomerSearch && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.overlay, onClick: () => setShowCustomerSearch(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.smallModal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Sélectionner client" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowCustomerSearch(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          className: styles.searchInput,
          placeholder: "Rechercher un client...",
          onChange: (e) => setSearchQuery(e.target.value),
          value: searchQuery
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.customerList, children: [
        customers.filter(
          (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)
        ).slice(0, 10).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
          setSelectedCustomer(c.id);
          setShowCustomerSearch(false);
          setSearchQuery("");
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.customerBtnInfo, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.customerBtnName, children: c.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.customerBtnPhone, children: c.phone })
          ] })
        ] }, c.id)),
        customers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles.empty, children: "Aucun client enregistré" })
      ] })
    ] }) }),
    showShortcuts && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.overlay, onClick: () => setShowShortcuts(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.smallModal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Raccourcis clavier" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowShortcuts(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.shortcutsList, children: [
        { key: "F1", action: "Aide" },
        { key: "F2", action: "Client" },
        { key: "F3", action: "Recherche" },
        { key: "F4", action: "Remise" },
        { key: "F5", action: "Historique" },
        { key: "F6", action: "Mettre en attente" },
        { key: "F7", action: "Reprendre vente" },
        { key: "F11", action: "Vider panier" },
        { key: "F12", action: "Payer" },
        { key: "ESC", action: "Annuler/Fermer" }
      ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.shortcutItem, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: s.key }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.action })
      ] }, s.key)) })
    ] }) }),
    showPackSelector && pendingProduct && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.overlay, onClick: () => {
      setShowPackSelector(false);
      setPendingProduct(null);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.packSelectorModal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Choisir le mode de vente" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setShowPackSelector(false);
          setPendingProduct(null);
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.packSelectorBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.productPreview, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.previewEmoji, children: pendingProduct.image }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.previewName, children: pendingProduct.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.packOptions, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: styles.packOption,
              onClick: () => {
                addToCart(pendingProduct, false);
                setShowPackSelector(false);
                setPendingProduct(null);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.optionIcon, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { size: 32 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.optionInfo, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.optionTitle, children: "À l'unité" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.optionPrice, children: formatCurrency(pendingProduct.price) })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: `${styles.packOption} ${styles.packHighlight}`,
              onClick: () => {
                addToCart(pendingProduct, true);
                setShowPackSelector(false);
                setPendingProduct(null);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.discountRibbon, children: [
                  "-",
                  Math.round((pendingProduct.price * pendingProduct.unitsPerPack - (pendingProduct.bundlePrice || 0)) / (pendingProduct.price * pendingProduct.unitsPerPack) * 100),
                  "%"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.optionIcon, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 32 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.optionInfo, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.optionTitle, children: [
                    "Pack x",
                    pendingProduct.unitsPerPack
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.optionPrice, children: formatCurrency(pendingProduct.bundlePrice || 0) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.optionSaving, children: [
                    "au lieu de ",
                    formatCurrency(pendingProduct.price * pendingProduct.unitsPerPack)
                  ] })
                ] })
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmModal,
      {
        isOpen: showRefundConfirm,
        title: "Confirmer le remboursement",
        message: saleToRefund ? `Effectuer un remboursement pour la vente ${saleToRefund.id} ?

Montant: ${formatCurrency(saleToRefund.totalAmount)}` : "",
        confirmText: "Rembourser",
        cancelText: "Annuler",
        variant: "warning",
        onConfirm: () => {
          if (saleToRefund && addMovement) {
            addMovement({
              type: "refund",
              amount: saleToRefund.totalAmount,
              reason: `Remboursement vente ${saleToRefund.id}`,
              createdBy: "Caissier"
            });
            toast.success(`Remboursement effectué: ${formatCurrency(saleToRefund.totalAmount)}`);
          }
          setShowRefundConfirm(false);
          setSaleToRefund(null);
          setShowSalesHistory(false);
        },
        onCancel: () => {
          setShowRefundConfirm(false);
          setSaleToRefund(null);
        }
      }
    )
  ] });
};
export {
  POS
};

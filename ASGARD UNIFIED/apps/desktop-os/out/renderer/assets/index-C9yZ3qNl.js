import { j as jsxRuntimeExports } from "./vendor-state-DFI86SKa.js";
import { r as reactExports } from "./vendor-react-Df__x13C.js";
import { u as useSettings, c as useProductsStore, f as useToast, i as usePurchasesStore, e as useStockMovementsStore } from "./index-BbOgUw3k.js";
import { C as ConfirmModal } from "./ConfirmModal-IjhJ8y4D.js";
import { r as Search, aA as List, aB as Grid3x3, a7 as Star, a5 as Eye, aC as SquarePen, v as Trash2, X, aD as Save, P as Package, Q as TrendingDown, G as Bell, k as Truck, i as ShoppingCart, c as Check, af as Plus, g as ChevronLeft, h as ChevronRight, s as TrendingUp, as as ArrowDownLeft, ar as ArrowUpRight, aE as ClipboardList, aF as Play, aa as Pause, a as CircleCheckBig, a2 as CircleX, ai as RotateCcw, T as TriangleAlert, aG as ChartPie, l as Printer, ay as Download, a8 as Layers, ag as Percent, ak as Box, a1 as ArrowRight, a6 as Barcode, Z as Zap, aH as Tag, a4 as Sparkles, O as DollarSign, ab as History, aI as Boxes, F as FileText, aJ as FileSpreadsheet, aK as FileBraces, y as Upload, R as RefreshCw } from "./vendor-ui-DiXyqbDT.js";
import { R as ResponsiveContainer, T as Tooltip } from "./CategoricalChart-BNQNLo93.js";
import { P as PieChart, a as Pie, C as Cell } from "./PieChart-DaKadvC7.js";
import { f as formatCurrency } from "./formatters-BiCn3FBI.js";
import { G as GoodsReceipt } from "./GoodsReceipt-BSVIkDPf.js";
import "./vendor-i18n-DeCNyroL.js";
import "./useTreasuryFacade-CchObU-E.js";
const productsList = "_productsList_1k88y_3";
const toolbar$2 = "_toolbar_1k88y_10";
const searchBox$2 = "_searchBox_1k88y_17";
const filters = "_filters_1k88y_45";
const viewToggle = "_viewToggle_1k88y_60";
const active$2 = "_active_1k88y_81";
const resultsInfo = "_resultsInfo_1k88y_86";
const tableContainer = "_tableContainer_1k88y_92";
const table = "_table_1k88y_92";
const outOfStockRow = "_outOfStockRow_1k88y_125";
const productCell$1 = "_productCell_1k88y_130";
const emoji$3 = "_emoji_1k88y_136";
const productName$2 = "_productName_1k88y_140";
const favIcon = "_favIcon_1k88y_145";
const categoryTag = "_categoryTag_1k88y_151";
const barcode$1 = "_barcode_1k88y_160";
const sellPrice$1 = "_sellPrice_1k88y_169";
const margin = "_margin_1k88y_174";
const good = "_good_1k88y_182";
const low = "_low_1k88y_187";
const stockQty = "_stockQty_1k88y_192";
const stockBadge$1 = "_stockBadge_1k88y_201";
const inStock$1 = "_inStock_1k88y_209";
const lowStock$2 = "_lowStock_1k88y_214";
const outOfStock$2 = "_outOfStock_1k88y_125";
const actions$1 = "_actions_1k88y_224";
const deleteBtn$2 = "_deleteBtn_1k88y_243";
const gridContainer = "_gridContainer_1k88y_249";
const productCard$1 = "_productCard_1k88y_255";
const lowStockCard = "_lowStockCard_1k88y_268";
const cardHeader = "_cardHeader_1k88y_272";
const cardEmoji = "_cardEmoji_1k88y_279";
const cardName = "_cardName_1k88y_283";
const cardCategory = "_cardCategory_1k88y_290";
const cardPrices = "_cardPrices_1k88y_300";
const cardPrice = "_cardPrice_1k88y_300";
const cardMargin = "_cardMargin_1k88y_313";
const cardStock = "_cardStock_1k88y_319";
const cardActions$1 = "_cardActions_1k88y_333";
const overlay$5 = "_overlay_1k88y_379";
const modal$5 = "_modal_1k88y_390";
const modalLarge = "_modalLarge_1k88y_391";
const modalHeader$5 = "_modalHeader_1k88y_420";
const modalBody$4 = "_modalBody_1k88y_450";
const modalFooter$5 = "_modalFooter_1k88y_456";
const editBtn$1 = "_editBtn_1k88y_478";
const saveBtn$2 = "_saveBtn_1k88y_479";
const productDetail = "_productDetail_1k88y_490";
const detailEmoji = "_detailEmoji_1k88y_499";
const favBadge = "_favBadge_1k88y_510";
const detailGrid = "_detailGrid_1k88y_519";
const detailItem = "_detailItem_1k88y_525";
const priceHighlight = "_priceHighlight_1k88y_551";
const marginHighlight = "_marginHighlight_1k88y_557";
const editForm = "_editForm_1k88y_563";
const formRow$2 = "_formRow_1k88y_569";
const formGroup$3 = "_formGroup_1k88y_574";
const formGroupLarge = "_formGroupLarge_1k88y_581";
const emojiInput$1 = "_emojiInput_1k88y_615";
const styles$7 = {
  productsList,
  toolbar: toolbar$2,
  searchBox: searchBox$2,
  filters,
  viewToggle,
  active: active$2,
  resultsInfo,
  tableContainer,
  table,
  outOfStockRow,
  productCell: productCell$1,
  emoji: emoji$3,
  productName: productName$2,
  favIcon,
  categoryTag,
  barcode: barcode$1,
  sellPrice: sellPrice$1,
  margin,
  good,
  low,
  stockQty,
  stockBadge: stockBadge$1,
  inStock: inStock$1,
  lowStock: lowStock$2,
  outOfStock: outOfStock$2,
  actions: actions$1,
  deleteBtn: deleteBtn$2,
  gridContainer,
  productCard: productCard$1,
  lowStockCard,
  cardHeader,
  cardEmoji,
  cardName,
  cardCategory,
  cardPrices,
  cardPrice,
  cardMargin,
  cardStock,
  cardActions: cardActions$1,
  overlay: overlay$5,
  modal: modal$5,
  modalLarge,
  modalHeader: modalHeader$5,
  modalBody: modalBody$4,
  modalFooter: modalFooter$5,
  editBtn: editBtn$1,
  saveBtn: saveBtn$2,
  productDetail,
  detailEmoji,
  favBadge,
  detailGrid,
  detailItem,
  priceHighlight,
  marginHighlight,
  editForm,
  formRow: formRow$2,
  formGroup: formGroup$3,
  formGroupLarge,
  emojiInput: emojiInput$1
};
const categories$1 = ["Toutes", "Boissons", "Produits laitiers", "Épicerie", "Biscuiterie", "Fruits & Légumes", "Viandes", "Surgélés"];
const ProductsList = () => {
  const { formatCurrency: formatCurrency2 } = useSettings();
  const { products, deleteProduct, toggleFavorite, updateProduct } = useProductsStore();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedCategory, setSelectedCategory] = reactExports.useState("Toutes");
  const [viewMode, setViewMode] = reactExports.useState("list");
  const [sortBy, setSortBy] = reactExports.useState("name");
  const [viewingProduct, setViewingProduct] = reactExports.useState(null);
  const [editingProduct, setEditingProduct] = reactExports.useState(null);
  const [editForm2, setEditForm] = reactExports.useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = reactExports.useState(false);
  const [productToDelete, setProductToDelete] = reactExports.useState(null);
  const filteredProducts = products.filter(
    (p) => (selectedCategory === "Toutes" || p.category === selectedCategory) && (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode.includes(searchQuery))
  );
  const getStockStatus = (product) => {
    if (product.stock === 0) return "outOfStock";
    if (product.stock <= product.minStock) return "lowStock";
    return "inStock";
  };
  const getStockBadge = (product) => {
    const status = getStockStatus(product);
    if (status === "outOfStock") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${styles$7.stockBadge} ${styles$7.outOfStock}`, children: "Rupture" });
    if (status === "lowStock") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${styles$7.stockBadge} ${styles$7.lowStock}`, children: "Stock bas" });
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${styles$7.stockBadge} ${styles$7.inStock}`, children: "En stock" });
  };
  const getMargin = (product) => {
    const margin2 = (product.sellingPrice - product.purchasePrice) / product.purchasePrice * 100;
    return Math.round(margin2);
  };
  const handleDelete = (id, name) => {
    setProductToDelete({ id, name });
    setShowDeleteConfirm(true);
  };
  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
    }
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };
  const handleView = (product) => {
    setViewingProduct(product);
  };
  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      barcode: product.barcode,
      category: product.category,
      brand: product.brand,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      stock: product.stock,
      minStock: product.minStock,
      unit: product.unit,
      emoji: product.emoji
    });
  };
  const handleSaveEdit = () => {
    if (editingProduct && editForm2) {
      updateProduct(editingProduct.id, editForm2);
      setEditingProduct(null);
      setEditForm({});
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.productsList, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.toolbar, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.searchBox, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Rechercher par nom ou code-barres...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.filters, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            value: selectedCategory,
            onChange: (e) => setSelectedCategory(e.target.value),
            children: categories$1.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: cat, children: cat }, cat))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "name", children: "Trier par nom" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "stock", children: "Trier par stock" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "price", children: "Trier par prix" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "category", children: "Trier par catégorie" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.viewToggle, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: viewMode === "list" ? styles$7.active : "",
            onClick: () => setViewMode("list"),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { size: 18 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: viewMode === "grid" ? styles$7.active : "",
            onClick: () => setViewMode("grid"),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { size: 18 })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$7.resultsInfo, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      filteredProducts.length,
      " produits trouvés"
    ] }) }),
    viewMode === "list" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$7.tableContainer, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: styles$7.table, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Produit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Catégorie" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Code-barres" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Prix achat" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Prix vente" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Marge" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Stock" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Statut" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filteredProducts.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: getStockStatus(product) === "outOfStock" ? styles$7.outOfStockRow : "", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.productCell, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$7.emoji, children: product.emoji }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$7.productName, children: product.name }),
            product.isFavorite && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 12, className: styles$7.favIcon })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$7.categoryTag, children: product.category }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: styles$7.barcode, children: product.barcode }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: formatCurrency2(product.purchasePrice) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: styles$7.sellPrice, children: formatCurrency2(product.sellingPrice) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `${styles$7.margin} ${getMargin(product) >= 20 ? styles$7.good : styles$7.low}`, children: [
          getMargin(product),
          "%"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$7.stockQty, children: [
          product.stock,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: product.unit })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: getStockBadge(product) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.actions, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { title: "Voir", onClick: () => handleView(product), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { title: "Modifier", onClick: () => handleEdit(product), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              title: "Supprimer",
              className: styles$7.deleteBtn,
              onClick: () => handleDelete(product.id, product.name),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 })
            }
          )
        ] }) })
      ] }, product.id)) })
    ] }) }),
    viewMode === "grid" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$7.gridContainer, children: filteredProducts.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$7.productCard} ${getStockStatus(product) !== "inStock" ? styles$7.lowStockCard : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.cardHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$7.cardEmoji, children: product.emoji }),
        product.isFavorite && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 16, className: styles$7.favIcon })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: styles$7.cardName, children: product.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$7.cardCategory, children: product.category }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.cardPrices, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$7.cardPrice, children: formatCurrency2(product.sellingPrice) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$7.cardMargin, children: [
          "+",
          getMargin(product),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.cardStock, children: [
        getStockBadge(product),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          product.stock,
          " ",
          product.unit
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.cardActions, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleView(product), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 14 }),
          " Voir"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleEdit(product), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { size: 14 }),
          " Modifier"
        ] })
      ] })
    ] }, product.id)) }),
    viewingProduct && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$7.overlay, onClick: () => setViewingProduct(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Détails du produit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setViewingProduct(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.productDetail, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$7.detailEmoji, children: viewingProduct.emoji }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: viewingProduct.name }),
          viewingProduct.isFavorite && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$7.favBadge, children: "⭐ Favori" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.detailGrid, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.detailItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Code-barres" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: viewingProduct.barcode })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.detailItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "SKU" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: viewingProduct.sku || "-" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.detailItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Catégorie" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: viewingProduct.category })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.detailItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Marque" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: viewingProduct.brand || "-" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.detailItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Prix d'achat" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCurrency2(viewingProduct.purchasePrice) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.detailItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Prix de vente" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$7.priceHighlight, children: formatCurrency2(viewingProduct.sellingPrice) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.detailItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Marge" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$7.marginHighlight, children: [
              getMargin(viewingProduct),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.detailItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Stock actuel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              viewingProduct.stock,
              " ",
              viewingProduct.unit
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.detailItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Stock minimum" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              viewingProduct.minStock,
              " ",
              viewingProduct.unit
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.detailItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Statut" }),
            getStockBadge(viewingProduct)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setViewingProduct(null), children: "Fermer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: styles$7.editBtn,
            onClick: () => {
              setViewingProduct(null);
              handleEdit(viewingProduct);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { size: 16 }),
              " Modifier"
            ]
          }
        )
      ] })
    ] }) }),
    editingProduct && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$7.overlay, onClick: () => setEditingProduct(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.modalLarge, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Modifier le produit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditingProduct(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$7.modalBody, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.editForm, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.formRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Emoji" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: editForm2.emoji || "",
                onChange: (e) => setEditForm({ ...editForm2, emoji: e.target.value }),
                className: styles$7.emojiInput
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.formGroupLarge, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Nom du produit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: editForm2.name || "",
                onChange: (e) => setEditForm({ ...editForm2, name: e.target.value })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.formRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Code-barres" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: editForm2.barcode || "",
                onChange: (e) => setEditForm({ ...editForm2, barcode: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Catégorie" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                value: editForm2.category || "",
                onChange: (e) => setEditForm({ ...editForm2, category: e.target.value }),
                children: categories$1.filter((c) => c !== "Toutes").map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: cat, children: cat }, cat))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Marque" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: editForm2.brand || "",
                onChange: (e) => setEditForm({ ...editForm2, brand: e.target.value })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.formRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Prix d'achat (DA)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                value: editForm2.purchasePrice || 0,
                onChange: (e) => setEditForm({ ...editForm2, purchasePrice: parseFloat(e.target.value) || 0 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Prix de vente (DA)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                value: editForm2.sellingPrice || 0,
                onChange: (e) => setEditForm({ ...editForm2, sellingPrice: parseFloat(e.target.value) || 0 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.formRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Stock actuel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                value: editForm2.stock || 0,
                onChange: (e) => setEditForm({ ...editForm2, stock: parseInt(e.target.value) || 0 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Stock minimum" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                value: editForm2.minStock || 0,
                onChange: (e) => setEditForm({ ...editForm2, minStock: parseInt(e.target.value) || 0 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Unité" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: editForm2.unit || "unité",
                onChange: (e) => setEditForm({ ...editForm2, unit: e.target.value }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "unité", children: "Unité" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "kg", children: "Kilogramme" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "g", children: "Gramme" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "L", children: "Litre" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ml", children: "Millilitre" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pack", children: "Pack" })
                ]
              }
            )
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditingProduct(null), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$7.saveBtn, onClick: handleSaveEdit, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 16 }),
          " Enregistrer"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmModal,
      {
        isOpen: showDeleteConfirm,
        title: "Supprimer le produit",
        message: `Êtes-vous sûr de vouloir supprimer "${productToDelete?.name}" ?`,
        confirmText: "Supprimer",
        cancelText: "Annuler",
        variant: "danger",
        onConfirm: confirmDelete,
        onCancel: () => setShowDeleteConfirm(false)
      }
    )
  ] });
};
const stockAlerts = "_stockAlerts_jei1j_3";
const summaryRow = "_summaryRow_jei1j_10";
const summaryCard = "_summaryCard_jei1j_16";
const danger$1 = "_danger_jei1j_33";
const warning$2 = "_warning_jei1j_38";
const expiring = "_expiring_jei1j_43";
const summaryValue = "_summaryValue_jei1j_48";
const summaryLabel = "_summaryLabel_jei1j_55";
const section = "_section_jei1j_62";
const sectionTitle = "_sectionTitle_jei1j_69";
const dangerDot = "_dangerDot_jei1j_80";
const warningDot = "_warningDot_jei1j_81";
const expiringDot = "_expiringDot_jei1j_96";
const alertsList = "_alertsList_jei1j_113";
const alertCard = "_alertCard_jei1j_118";
const outOfStock$1 = "_outOfStock_jei1j_135";
const lowStock$1 = "_lowStock_jei1j_139";
const expiringSoon = "_expiringSoon_jei1j_143";
const expired = "_expired_jei1j_147";
const alertLeft = "_alertLeft_jei1j_151";
const alertEmoji = "_alertEmoji_jei1j_157";
const alertName = "_alertName_jei1j_161";
const alertMeta = "_alertMeta_jei1j_167";
const alertRight = "_alertRight_jei1j_174";
const stockLabel = "_stockLabel_jei1j_180";
const stockProgress = "_stockProgress_jei1j_189";
const progressBar$2 = "_progressBar_jei1j_201";
const progressFill$1 = "_progressFill_jei1j_208";
const orderBtn = "_orderBtn_jei1j_215";
const actionBtn = "_actionBtn_jei1j_232";
const expiryInfo = "_expiryInfo_jei1j_251";
const expiredText = "_expiredText_jei1j_258";
const expiringText = "_expiringText_jei1j_264";
const expiryDate = "_expiryDate_jei1j_270";
const pendingOrder = "_pendingOrder_jei1j_276";
const emptyState$1 = "_emptyState_jei1j_289";
const overlay$4 = "_overlay_jei1j_313";
const modal$4 = "_modal_jei1j_335";
const modalHeader$4 = "_modalHeader_jei1j_357";
const modalBody$3 = "_modalBody_jei1j_383";
const productSummary = "_productSummary_jei1j_414";
const productStat = "_productStat_jei1j_424";
const orderPreview = "_orderPreview_jei1j_441";
const modalFooter$4 = "_modalFooter_jei1j_455";
const confirmBtn$3 = "_confirmBtn_jei1j_477";
const styles$6 = {
  stockAlerts,
  summaryRow,
  summaryCard,
  danger: danger$1,
  warning: warning$2,
  expiring,
  summaryValue,
  summaryLabel,
  section,
  sectionTitle,
  dangerDot,
  warningDot,
  expiringDot,
  alertsList,
  alertCard,
  outOfStock: outOfStock$1,
  lowStock: lowStock$1,
  expiringSoon,
  expired,
  alertLeft,
  alertEmoji,
  alertName,
  alertMeta,
  alertRight,
  stockLabel,
  stockProgress,
  progressBar: progressBar$2,
  progressFill: progressFill$1,
  orderBtn,
  actionBtn,
  expiryInfo,
  expiredText,
  expiringText,
  expiryDate,
  pendingOrder,
  emptyState: emptyState$1,
  overlay: overlay$4,
  modal: modal$4,
  modalHeader: modalHeader$4,
  modalBody: modalBody$3,
  productSummary,
  productStat,
  orderPreview,
  modalFooter: modalFooter$4,
  confirmBtn: confirmBtn$3
};
const StockAlerts = () => {
  const { formatCurrency: formatCurrency2 } = useSettings();
  const toast = useToast();
  const { products, getLowStockProducts, getOutOfStockProducts } = useProductsStore();
  const { suppliers, purchaseOrders, addPurchaseOrder, goodsReceipts } = usePurchasesStore();
  const [showOrderModal, setShowOrderModal] = reactExports.useState(false);
  const [selectedProduct, setSelectedProduct] = reactExports.useState(null);
  const [orderQty, setOrderQty] = reactExports.useState("");
  const [selectedSupplierId, setSelectedSupplierId] = reactExports.useState("");
  const lowStockProducts = getLowStockProducts();
  const outOfStockProducts = getOutOfStockProducts();
  const expiringAlerts = reactExports.useMemo(() => {
    const today = /* @__PURE__ */ new Date();
    const thirtyDaysFromNow = /* @__PURE__ */ new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    const expiringItems = [];
    const seenProducts = /* @__PURE__ */ new Set();
    const sortedReceipts = [...goodsReceipts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    sortedReceipts.forEach((receipt) => {
      receipt.items.forEach((item) => {
        if (item.expiryDate && !seenProducts.has(item.productId)) {
          const expiryDate2 = new Date(item.expiryDate);
          if (expiryDate2 <= thirtyDaysFromNow) {
            const product = products.find((p) => p.id === item.productId);
            if (product && product.stock > 0) {
              expiringItems.push({
                id: `${item.id}-expiry`,
                product,
                type: "expiring",
                currentStock: product.stock,
                minStock: product.minStock,
                unit: product.unit,
                lastRestocked: new Date(receipt.date)
              });
              seenProducts.add(product.id);
            }
          }
        }
      });
    });
    return expiringItems;
  }, [goodsReceipts, products]);
  const alerts = reactExports.useMemo(() => {
    const alertsList2 = [];
    outOfStockProducts.forEach((product) => {
      alertsList2.push({
        id: product.id,
        product,
        type: "outOfStock",
        currentStock: product.stock,
        minStock: product.minStock,
        unit: product.unit
      });
    });
    lowStockProducts.filter((p) => !outOfStockProducts.find((oos) => oos.id === p.id)).forEach((product) => {
      alertsList2.push({
        id: product.id,
        product,
        type: "low",
        currentStock: product.stock,
        minStock: product.minStock,
        unit: product.unit
      });
    });
    alertsList2.push(...expiringAlerts);
    return alertsList2;
  }, [lowStockProducts, outOfStockProducts, expiringAlerts]);
  const outOfStockCount = alerts.filter((a) => a.type === "outOfStock").length;
  const lowStockCount = alerts.filter((a) => a.type === "low").length;
  const expiringCount = expiringAlerts.length;
  const handleOrderClick = (product) => {
    setSelectedProduct(product);
    setOrderQty((product.minStock - product.stock + 5).toString());
    setShowOrderModal(true);
  };
  const handleCreateOrder = () => {
    if (!selectedProduct || !selectedSupplierId || !orderQty) return;
    const supplier = suppliers.find((s) => s.id === selectedSupplierId);
    if (!supplier) return;
    addPurchaseOrder({
      supplierId: selectedSupplierId,
      supplierName: supplier.name,
      items: [{
        id: crypto.randomUUID(),
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        productBarcode: selectedProduct.barcode,
        productEmoji: selectedProduct.emoji,
        orderedQty: parseInt(orderQty),
        receivedQty: 0,
        purchasePrice: selectedProduct.purchasePrice,
        total: parseInt(orderQty) * selectedProduct.purchasePrice,
        unit: selectedProduct.unit
      }],
      total: parseInt(orderQty) * selectedProduct.purchasePrice,
      subtotal: parseInt(orderQty) * selectedProduct.purchasePrice,
      taxAmount: 0,
      date: (/* @__PURE__ */ new Date()).toISOString(),
      expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString(),
      status: "draft"
    });
    setShowOrderModal(false);
    setSelectedProduct(null);
    setOrderQty("");
    setSelectedSupplierId("");
    toast.success(`Bon de commande créé pour ${selectedProduct.name}`);
  };
  const getPendingOrderQty = (productId) => {
    return purchaseOrders.filter((po) => po.status === "draft" || po.status === "partial").flatMap((po) => po.items).filter((item) => item.productId === productId).reduce((sum, item) => sum + (item.orderedQty - item.receivedQty), 0);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$6.stockAlerts, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$6.summaryRow, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$6.summaryCard} ${styles$6.danger}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$6.summaryValue, children: outOfStockCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$6.summaryLabel, children: "Ruptures de stock" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$6.summaryCard} ${styles$6.warning}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$6.summaryValue, children: lowStockCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$6.summaryLabel, children: "Stock bas" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$6.summaryCard} ${styles$6.expiring}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$6.summaryValue, children: expiringCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$6.summaryLabel, children: "Péremption proche" })
        ] })
      ] })
    ] }),
    outOfStockCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$6.section, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: styles$6.sectionTitle, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$6.dangerDot }),
        "Ruptures de stock (",
        outOfStockCount,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$6.alertsList, children: alerts.filter((a) => a.type === "outOfStock").map((alert) => {
        const pendingQty = getPendingOrderQty(alert.product.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$6.alertCard} ${styles$6.outOfStock}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$6.alertLeft, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$6.alertEmoji, children: alert.product.emoji }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$6.alertName, children: alert.product.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$6.alertMeta, children: [
                alert.product.barcode,
                " • Min: ",
                alert.minStock,
                " ",
                alert.unit
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$6.alertRight, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$6.stockLabel, children: [
              "Stock: ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                "0 / ",
                alert.minStock
              ] }),
              " ",
              alert.unit
            ] }),
            pendingQty > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$6.pendingOrder, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 12 }),
              " ",
              pendingQty,
              " en commande"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: styles$6.orderBtn,
                onClick: () => handleOrderClick(alert.product),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 14 }),
                  " Commander"
                ]
              }
            )
          ] })
        ] }, alert.id);
      }) })
    ] }),
    expiringCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$6.section, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: styles$6.sectionTitle, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$6.expiringDot }),
        "Péremption proche (",
        expiringCount,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$6.alertsList, children: expiringAlerts.map((alert) => {
        const expiryDate2 = new Date(goodsReceipts.flatMap((r) => r.items).find((i) => i.productId === alert.product.id && i.expiryDate)?.expiryDate || "");
        const daysDiff = Math.ceil((expiryDate2.getTime() - (/* @__PURE__ */ new Date()).getTime()) / (1e3 * 60 * 60 * 24));
        const isExpired = daysDiff <= 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$6.alertCard} ${isExpired ? styles$6.expired : styles$6.expiringSoon}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$6.alertLeft, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$6.alertEmoji, children: alert.product.emoji }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$6.alertName, children: alert.product.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$6.alertMeta, children: [
                alert.product.barcode,
                " • Lot: ",
                goodsReceipts.flatMap((r) => r.items).find((i) => i.productId === alert.product.id)?.lotNumber || "N/A"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$6.alertRight, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$6.expiryInfo, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: isExpired ? styles$6.expiredText : styles$6.expiringText, children: isExpired ? "EXPIRÉ" : `Expire dans ${daysDiff} jours` }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$6.expiryDate, children: [
                "Le ",
                expiryDate2.toLocaleDateString("fr-FR")
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: styles$6.actionBtn,
                onClick: () => toast.info("Action: Retrait du stock ou promotion"),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 14 }),
                  " Gérer"
                ]
              }
            )
          ] })
        ] }, alert.id);
      }) })
    ] }),
    lowStockCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$6.section, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: styles$6.sectionTitle, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$6.warningDot }),
        "Stock bas (",
        lowStockCount,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$6.alertsList, children: alerts.filter((a) => a.type === "low").map((alert) => {
        const pendingQty = getPendingOrderQty(alert.product.id);
        const progressPercent2 = Math.min(100, alert.currentStock / alert.minStock * 100);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$6.alertCard} ${styles$6.lowStock}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$6.alertLeft, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$6.alertEmoji, children: alert.product.emoji }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$6.alertName, children: alert.product.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$6.alertMeta, children: [
                alert.product.barcode,
                " • Prix: ",
                formatCurrency2(alert.product.purchasePrice)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$6.alertRight, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$6.stockProgress, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                alert.currentStock,
                " / ",
                alert.minStock,
                " ",
                alert.unit
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$6.progressBar, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: styles$6.progressFill,
                  style: { width: `${progressPercent2}%` }
                }
              ) })
            ] }),
            pendingQty > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$6.pendingOrder, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 12 }),
              " ",
              pendingQty,
              " en commande"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: styles$6.orderBtn,
                onClick: () => handleOrderClick(alert.product),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 14 }),
                  " Commander"
                ]
              }
            )
          ] })
        ] }, alert.id);
      }) })
    ] }),
    alerts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$6.emptyState, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 48 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Tous les stocks sont en ordre! 🎉" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Aucune alerte de stock pour le moment." })
    ] }),
    showOrderModal && selectedProduct && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$6.overlay, onClick: () => setShowOrderModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$6.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$6.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
          "🛒 Commander: ",
          selectedProduct.emoji,
          " ",
          selectedProduct.name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowOrderModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$6.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$6.productSummary, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$6.productStat, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Stock actuel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              selectedProduct.stock,
              " ",
              selectedProduct.unit
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$6.productStat, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Stock minimum" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              selectedProduct.minStock,
              " ",
              selectedProduct.unit
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$6.productStat, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Prix d'achat" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency2(selectedProduct.purchasePrice) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Fournisseur" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: selectedSupplierId,
            onChange: (e) => setSelectedSupplierId(e.target.value),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Sélectionner un fournisseur..." }),
              suppliers.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.id, children: s.name }, s.id))
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Quantité à commander" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: orderQty,
            onChange: (e) => setOrderQty(e.target.value),
            placeholder: "10",
            min: "1"
          }
        ),
        orderQty && selectedSupplierId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$6.orderPreview, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total estimé:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency2(parseInt(orderQty) * selectedProduct.purchasePrice) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$6.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowOrderModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: styles$6.confirmBtn,
            onClick: handleCreateOrder,
            disabled: !selectedSupplierId || !orderQty || parseInt(orderQty) <= 0,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
              " Créer le bon de commande"
            ]
          }
        )
      ] })
    ] }) })
  ] });
};
const categories = "_categories_1upkd_3";
const header$3 = "_header_1upkd_9";
const addBtn$1 = "_addBtn_1upkd_26";
const grid = "_grid_1upkd_40";
const categoryCard = "_categoryCard_1upkd_46";
const cardTop = "_cardTop_1upkd_60";
const emoji$2 = "_emoji_1upkd_67";
const cardActions = "_cardActions_1upkd_71";
const deleteBtn$1 = "_deleteBtn_1upkd_95";
const categoryName = "_categoryName_1upkd_101";
const cardFooter = "_cardFooter_1upkd_108";
const productCount = "_productCount_1upkd_116";
const viewBtn = "_viewBtn_1upkd_124";
const overlay$3 = "_overlay_1upkd_141";
const modal$3 = "_modal_1upkd_151";
const modalHeader$3 = "_modalHeader_1upkd_159";
const modalBody$2 = "_modalBody_1upkd_179";
const formGroup$2 = "_formGroup_1upkd_183";
const emojiInput = "_emojiInput_1upkd_204";
const modalFooter$3 = "_modalFooter_1upkd_210";
const confirmBtn$2 = "_confirmBtn_1upkd_232";
const colorInput = "_colorInput_1upkd_238";
const backHeader = "_backHeader_1upkd_246";
const backBtn$1 = "_backBtn_1upkd_252";
const catEmoji = "_catEmoji_1upkd_269";
const searchBox$1 = "_searchBox_1upkd_274";
const emptyState = "_emptyState_1upkd_297";
const productGrid = "_productGrid_1upkd_318";
const productCard = "_productCard_1upkd_324";
const productHeader = "_productHeader_1upkd_336";
const productEmoji = "_productEmoji_1upkd_343";
const stockBadge = "_stockBadge_1upkd_347";
const inStock = "_inStock_1upkd_354";
const lowStock = "_lowStock_1upkd_359";
const outOfStock = "_outOfStock_1upkd_364";
const productName$1 = "_productName_1upkd_369";
const productBarcode = "_productBarcode_1upkd_376";
const productPrices = "_productPrices_1upkd_384";
const sellPrice = "_sellPrice_1upkd_391";
const buyPrice = "_buyPrice_1upkd_397";
const productStock = "_productStock_1upkd_402";
const styles$5 = {
  categories,
  header: header$3,
  addBtn: addBtn$1,
  grid,
  categoryCard,
  cardTop,
  emoji: emoji$2,
  cardActions,
  deleteBtn: deleteBtn$1,
  categoryName,
  cardFooter,
  productCount,
  viewBtn,
  overlay: overlay$3,
  modal: modal$3,
  modalHeader: modalHeader$3,
  modalBody: modalBody$2,
  formGroup: formGroup$2,
  emojiInput,
  modalFooter: modalFooter$3,
  confirmBtn: confirmBtn$2,
  colorInput,
  backHeader,
  backBtn: backBtn$1,
  catEmoji,
  searchBox: searchBox$1,
  emptyState,
  productGrid,
  productCard,
  productHeader,
  productEmoji,
  stockBadge,
  inStock,
  lowStock,
  outOfStock,
  productName: productName$1,
  productBarcode,
  productPrices,
  sellPrice,
  buyPrice,
  productStock
};
const defaultCategories = [
  { id: "beverages", name: "Boissons", emoji: "🥤", color: "#3B82F6" },
  { id: "dairy", name: "Produits laitiers", emoji: "🥛", color: "#8B5CF6" },
  { id: "grocery", name: "Épicerie", emoji: "🛒", color: "#10B981" },
  { id: "biscuits", name: "Biscuiterie", emoji: "🍪", color: "#F59E0B" },
  { id: "fruits", name: "Fruits & Légumes", emoji: "🍎", color: "#EF4444" },
  { id: "meat", name: "Viandes & Charcuterie", emoji: "🥩", color: "#DC2626" },
  { id: "frozen", name: "Surgélés", emoji: "🧊", color: "#0EA5E9" },
  { id: "hygiene", name: "Hygiène & Beauté", emoji: "🧴", color: "#EC4899" },
  { id: "cleaning", name: "Entretien", emoji: "🧹", color: "#6366F1" },
  { id: "snacks", name: "Snacks", emoji: "🍿", color: "#F97316" }
];
const Categories = () => {
  const { products } = useProductsStore();
  const { formatCurrency: formatCurrency2 } = useSettings();
  const toast = useToast();
  const [categories2, setCategories] = reactExports.useState(defaultCategories);
  const [showModal, setShowModal] = reactExports.useState(false);
  const [editingCategory, setEditingCategory] = reactExports.useState(null);
  const [newCategory, setNewCategory] = reactExports.useState({ name: "", emoji: "", color: "#3B82F6" });
  const [viewingCategory, setViewingCategory] = reactExports.useState(null);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = reactExports.useState(false);
  const [categoryToDelete, setCategoryToDelete] = reactExports.useState(null);
  const categoryStats = reactExports.useMemo(() => {
    const stats = {};
    categories2.forEach((cat) => {
      stats[cat.id] = products.filter(
        (p) => p.category?.toLowerCase() === cat.name.toLowerCase() || p.categoryId === cat.id
      ).length;
    });
    return stats;
  }, [products, categories2]);
  const totalProducts = products.length;
  const categoryProducts = reactExports.useMemo(() => {
    if (!viewingCategory) return [];
    return products.filter(
      (p) => p.category?.toLowerCase() === viewingCategory.name.toLowerCase() || p.categoryId === viewingCategory.id
    ).filter(
      (p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode?.includes(searchQuery)
    );
  }, [viewingCategory, products, searchQuery]);
  const handleEdit = (category) => {
    setEditingCategory(category);
    setNewCategory({ name: category.name, emoji: category.emoji, color: category.color });
    setShowModal(true);
  };
  const handleAddNew = () => {
    setEditingCategory(null);
    setNewCategory({ name: "", emoji: "", color: "#3B82F6" });
    setShowModal(true);
  };
  const handleSave = () => {
    if (!newCategory.name.trim()) {
      toast.warning("Le nom de la catégorie est requis");
      return;
    }
    if (editingCategory) {
      setCategories((prev) => prev.map(
        (cat) => cat.id === editingCategory.id ? { ...cat, name: newCategory.name, emoji: newCategory.emoji || "🏷️", color: newCategory.color } : cat
      ));
    } else {
      const newCat = {
        id: crypto.randomUUID(),
        name: newCategory.name,
        emoji: newCategory.emoji || "🏷️",
        color: newCategory.color
      };
      setCategories((prev) => [...prev, newCat]);
    }
    setShowModal(false);
  };
  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };
  const confirmDelete = () => {
    if (categoryToDelete) {
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryToDelete.id));
      toast.success(`Catégorie "${categoryToDelete.name}" supprimée`);
    }
    setShowDeleteConfirm(false);
    setCategoryToDelete(null);
  };
  const getDeleteMessage = () => {
    if (!categoryToDelete) return "";
    const productCount2 = categoryStats[categoryToDelete.id] || 0;
    if (productCount2 > 0) {
      return `Cette catégorie contient ${productCount2} produit(s). Êtes-vous sûr de vouloir la supprimer?`;
    }
    return `Supprimer la catégorie "${categoryToDelete.name}"?`;
  };
  const handleViewProducts = (category) => {
    setViewingCategory(category);
    setSearchQuery("");
  };
  if (viewingCategory) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$5.categories, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$5.header, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$5.backHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$5.backBtn, onClick: () => setViewingCategory(null), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 20 }),
          "Retour"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$5.catEmoji, children: viewingCategory.emoji }),
            viewingCategory.name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            categoryProducts.length,
            " produit(s) dans cette catégorie"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$5.searchBox, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Rechercher un produit...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value)
          }
        )
      ] }),
      categoryProducts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$5.emptyState, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 48 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Aucun produit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Cette catégorie ne contient pas encore de produits." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$5.productGrid, children: categoryProducts.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$5.productCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$5.productHeader, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$5.productEmoji, children: product.emoji || "📦" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${styles$5.stockBadge} ${product.stock === 0 ? styles$5.outOfStock : product.stock <= product.minStock ? styles$5.lowStock : styles$5.inStock}`, children: product.stock === 0 ? "Rupture" : product.stock <= product.minStock ? "Stock bas" : "En stock" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: styles$5.productName, children: product.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: styles$5.productBarcode, children: product.barcode }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$5.productPrices, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$5.sellPrice, children: formatCurrency2(product.sellingPrice) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$5.buyPrice, children: [
            "Achat: ",
            formatCurrency2(product.purchasePrice)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$5.productStock, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 14 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            product.stock,
            " ",
            product.unit
          ] })
        ] })
      ] }, product.id)) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$5.categories, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$5.header, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
          categories2.length,
          " catégories"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          totalProducts,
          " produits au total"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$5.addBtn, onClick: handleAddNew, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
        " Nouvelle catégorie"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$5.grid, children: categories2.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: styles$5.categoryCard,
        style: { borderLeftColor: category.color },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$5.cardTop, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$5.emoji, children: category.emoji }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$5.cardActions, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleEdit(category), title: "Modifier", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { size: 14 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: styles$5.deleteBtn,
                  onClick: () => handleDelete(category),
                  title: "Supprimer",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: styles$5.categoryName, children: category.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$5.cardFooter, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$5.productCount, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 14 }),
              " ",
              categoryStats[category.id] || 0,
              " produits"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: styles$5.viewBtn,
                onClick: () => handleViewProducts(category),
                children: [
                  "Voir ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 })
                ]
              }
            )
          ] })
        ]
      },
      category.id
    )) }),
    showModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$5.overlay, onClick: () => setShowModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$5.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$5.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$5.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$5.formGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Emoji" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: newCategory.emoji,
              onChange: (e) => setNewCategory({ ...newCategory, emoji: e.target.value }),
              placeholder: "🏷️",
              className: styles$5.emojiInput
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$5.formGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Nom de la catégorie" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: newCategory.name,
              onChange: (e) => setNewCategory({ ...newCategory, name: e.target.value }),
              placeholder: "Ex: Boissons"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$5.formGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Couleur" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "color",
              value: newCategory.color,
              onChange: (e) => setNewCategory({ ...newCategory, color: e.target.value }),
              className: styles$5.colorInput
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$5.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles$5.confirmBtn, onClick: handleSave, children: editingCategory ? "Enregistrer" : "Créer" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmModal,
      {
        isOpen: showDeleteConfirm,
        title: "Supprimer la catégorie",
        message: getDeleteMessage(),
        confirmText: "Supprimer",
        cancelText: "Annuler",
        variant: "danger",
        onConfirm: confirmDelete,
        onCancel: () => setShowDeleteConfirm(false)
      }
    )
  ] });
};
const stockMovements = "_stockMovements_il90d_3";
const statsRow$1 = "_statsRow_il90d_10";
const statCard$2 = "_statCard_il90d_16";
const entry = "_entry_il90d_31";
const exit = "_exit_il90d_36";
const statValue$2 = "_statValue_il90d_41";
const statLabel$2 = "_statLabel_il90d_56";
const toolbar$1 = "_toolbar_il90d_63";
const movementsList = "_movementsList_il90d_79";
const movementItem = "_movementItem_il90d_86";
const movementLeft = "_movementLeft_il90d_102";
const entryIcon = "_entryIcon_il90d_109";
const exitIcon = "_exitIcon_il90d_113";
const saleIcon = "_saleIcon_il90d_117";
const adjustIcon = "_adjustIcon_il90d_121";
const movementProduct = "_movementProduct_il90d_125";
const emoji$1 = "_emoji_il90d_131";
const productName = "_productName_il90d_135";
const movementMeta = "_movementMeta_il90d_141";
const movementCenter = "_movementCenter_il90d_147";
const typeBadge = "_typeBadge_il90d_151";
const sale = "_sale_il90d_117";
const adjustment = "_adjustment_il90d_174";
const movementQuantity = "_movementQuantity_il90d_179";
const positive$2 = "_positive_il90d_186";
const negative$2 = "_negative_il90d_192";
const stockChange = "_stockChange_il90d_198";
const movementTime = "_movementTime_il90d_203";
const time = "_time_il90d_212";
const styles$4 = {
  stockMovements,
  statsRow: statsRow$1,
  statCard: statCard$2,
  entry,
  exit,
  statValue: statValue$2,
  statLabel: statLabel$2,
  toolbar: toolbar$1,
  movementsList,
  movementItem,
  movementLeft,
  entryIcon,
  exitIcon,
  saleIcon,
  adjustIcon,
  movementProduct,
  emoji: emoji$1,
  productName,
  movementMeta,
  movementCenter,
  typeBadge,
  sale,
  adjustment,
  movementQuantity,
  positive: positive$2,
  negative: negative$2,
  stockChange,
  movementTime,
  time
};
const StockMovements = () => {
  const [filterType, setFilterType] = reactExports.useState("all");
  const [dateFilter, setDateFilter] = reactExports.useState("today");
  const { movements, getTodayEntries, getTodayExits } = useStockMovementsStore();
  const formatDate = (date) => new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  const formatTime = (date) => new Date(date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const getTypeIcon = (type) => {
    switch (type) {
      case "entry":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { size: 16, className: styles$4.entryIcon });
      case "exit":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { size: 16, className: styles$4.exitIcon });
      case "sale":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { size: 16, className: styles$4.saleIcon });
      case "adjustment":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 16, className: styles$4.adjustIcon });
    }
  };
  const getTypeBadge = (type) => {
    const labels = {
      entry: "Entrée",
      exit: "Sortie",
      sale: "Vente",
      adjustment: "Ajustement"
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${styles$4.typeBadge} ${styles$4[type]}`, children: labels[type] });
  };
  const filteredMovements = reactExports.useMemo(() => {
    const now = /* @__PURE__ */ new Date();
    const today = now.toDateString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
    const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
    return movements.filter((m) => {
      if (filterType !== "all" && m.type !== filterType) return false;
      const moveDate = new Date(m.date);
      switch (dateFilter) {
        case "today":
          return moveDate.toDateString() === today;
        case "week":
          return moveDate >= weekAgo;
        case "month":
          return moveDate >= monthAgo;
        default:
          return true;
      }
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [movements, filterType, dateFilter]);
  const todayEntries = getTodayEntries();
  const todayExits = getTodayExits();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.stockMovements, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.statsRow, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$4.statCard} ${styles$4.entry}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$4.statValue, children: [
            "+",
            todayEntries
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$4.statLabel, children: "Entrées aujourd'hui" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$4.statCard} ${styles$4.exit}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$4.statValue, children: [
            "-",
            todayExits
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$4.statLabel, children: "Sorties (ventes)" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.toolbar, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filterType, onChange: (e) => setFilterType(e.target.value), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "Tous les types" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "entry", children: "Entrées" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "exit", children: "Sorties" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "sale", children: "Ventes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "adjustment", children: "Ajustements" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: dateFilter, onChange: (e) => setDateFilter(e.target.value), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "today", children: "Aujourd'hui" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "week", children: "Cette semaine" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "month", children: "Ce mois" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$4.movementsList, children: filteredMovements.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$4.emptyState, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Aucun mouvement de stock pour cette période" }) }) : filteredMovements.map((movement) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.movementItem, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.movementLeft, children: [
        getTypeIcon(movement.type),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.movementProduct, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$4.emoji, children: movement.productEmoji }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$4.productName, children: movement.productName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$4.movementMeta, children: [
              movement.reason,
              " • ",
              movement.performedBy
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$4.movementCenter, children: getTypeBadge(movement.type) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.movementQuantity, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: movement.type === "entry" ? styles$4.positive : styles$4.negative, children: [
          movement.type === "entry" ? "+" : "-",
          Math.abs(movement.quantity)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$4.stockChange, children: [
          movement.previousStock,
          " → ",
          movement.newStock
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.movementTime, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDate(movement.date) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$4.time, children: formatTime(movement.date) })
      ] })
    ] }, movement.id)) })
  ] });
};
const physicalInventory = "_physicalInventory_r4dvk_3";
const sessionHeader = "_sessionHeader_r4dvk_10";
const sessionInfo = "_sessionInfo_r4dvk_20";
const sessionMeta = "_sessionMeta_r4dvk_28";
const progressSection = "_progressSection_r4dvk_33";
const progressInfo = "_progressInfo_r4dvk_37";
const progressPercent = "_progressPercent_r4dvk_44";
const progressBar$1 = "_progressBar_r4dvk_49";
const progressFill = "_progressFill_r4dvk_56";
const sessionActions = "_sessionActions_r4dvk_63";
const pauseBtn = "_pauseBtn_r4dvk_68";
const completeBtn = "_completeBtn_r4dvk_69";
const startBtn = "_startBtn_r4dvk_70";
const resumeBtn = "_resumeBtn_r4dvk_71";
const cancelBtn$1 = "_cancelBtn_r4dvk_72";
const statsLayout = "_statsLayout_r4dvk_109";
const statsGrid = "_statsGrid_r4dvk_115";
const statCard$1 = "_statCard_r4dvk_121";
const warning$1 = "_warning_r4dvk_144";
const statValue$1 = "_statValue_r4dvk_148";
const statLabel$1 = "_statLabel_r4dvk_154";
const chartSection = "_chartSection_r4dvk_162";
const miniChart = "_miniChart_r4dvk_171";
const chartLegend = "_chartLegend_r4dvk_179";
const legendItem = "_legendItem_r4dvk_185";
const chartPlaceholder = "_chartPlaceholder_r4dvk_199";
const toolbar = "_toolbar_r4dvk_211";
const searchBox = "_searchBox_r4dvk_216";
const toolbarActions = "_toolbarActions_r4dvk_246";
const outlineBtn = "_outlineBtn_r4dvk_251";
const linesTable = "_linesTable_r4dvk_273";
const tableHeader = "_tableHeader_r4dvk_280";
const tableRow = "_tableRow_r4dvk_291";
const discrepancyRow = "_discrepancyRow_r4dvk_303";
const productCell = "_productCell_r4dvk_307";
const emoji = "_emoji_r4dvk_313";
const barcode = "_barcode_r4dvk_317";
const systemStock = "_systemStock_r4dvk_323";
const countedCell = "_countedCell_r4dvk_327";
const counted = "_counted_r4dvk_327";
const pending = "_pending_r4dvk_343";
const difference = "_difference_r4dvk_347";
const ok = "_ok_r4dvk_351";
const positive$1 = "_positive_r4dvk_355";
const negative$1 = "_negative_r4dvk_359";
const actions = "_actions_r4dvk_363";
const countBtn = "_countBtn_r4dvk_368";
const recountBtn = "_recountBtn_r4dvk_378";
const overlay$2 = "_overlay_r4dvk_427";
const modal$2 = "_modal_r4dvk_438";
const modalHeader$2 = "_modalHeader_r4dvk_447";
const modalBody$1 = "_modalBody_r4dvk_473";
const summaryGrid$1 = "_summaryGrid_r4dvk_482";
const discrepancyList = "_discrepancyList_r4dvk_508";
const discrepancyItem = "_discrepancyItem_r4dvk_521";
const pendingWarning = "_pendingWarning_r4dvk_534";
const modalFooter$2 = "_modalFooter_r4dvk_544";
const confirmBtn$1 = "_confirmBtn_r4dvk_566";
const styles$3 = {
  physicalInventory,
  sessionHeader,
  sessionInfo,
  sessionMeta,
  progressSection,
  progressInfo,
  progressPercent,
  progressBar: progressBar$1,
  progressFill,
  sessionActions,
  pauseBtn,
  completeBtn,
  startBtn,
  resumeBtn,
  cancelBtn: cancelBtn$1,
  statsLayout,
  statsGrid,
  statCard: statCard$1,
  warning: warning$1,
  statValue: statValue$1,
  statLabel: statLabel$1,
  chartSection,
  miniChart,
  chartLegend,
  legendItem,
  chartPlaceholder,
  toolbar,
  searchBox,
  toolbarActions,
  outlineBtn,
  linesTable,
  tableHeader,
  tableRow,
  discrepancyRow,
  productCell,
  emoji,
  barcode,
  systemStock,
  countedCell,
  counted,
  pending,
  difference,
  ok,
  positive: positive$1,
  negative: negative$1,
  actions,
  countBtn,
  recountBtn,
  overlay: overlay$2,
  modal: modal$2,
  modalHeader: modalHeader$2,
  modalBody: modalBody$1,
  summaryGrid: summaryGrid$1,
  discrepancyList,
  discrepancyItem,
  pendingWarning,
  modalFooter: modalFooter$2,
  confirmBtn: confirmBtn$1
};
const PhysicalInventory = () => {
  const { products, updateStock } = useProductsStore();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [editingId, setEditingId] = reactExports.useState(null);
  const [countValue, setCountValue] = reactExports.useState("");
  const [showConfirmModal, setShowConfirmModal] = reactExports.useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = reactExports.useState(false);
  const [session, setSession] = reactExports.useState({
    id: crypto.randomUUID(),
    date: /* @__PURE__ */ new Date(),
    status: "idle",
    itemsCounted: 0,
    totalItems: products.length,
    discrepancies: 0,
    createdBy: "Utilisateur"
  });
  const [lines, setLines] = reactExports.useState(
    () => products.map((p) => ({
      id: p.id,
      productId: p.id,
      product: {
        name: p.name,
        emoji: p.emoji || "📦",
        barcode: p.barcode
      },
      systemStock: p.stock,
      countedStock: null,
      difference: null,
      status: "pending"
    }))
  );
  const countedItems = lines.filter((l) => l.status !== "pending").length;
  const discrepancies = lines.filter((l) => l.status === "discrepancy").length;
  const progress = lines.length > 0 ? Math.round(countedItems / lines.length * 100) : 0;
  const handleStart = () => {
    setSession((prev) => ({
      ...prev,
      status: "in_progress",
      date: /* @__PURE__ */ new Date()
    }));
  };
  const handlePause = () => {
    setSession((prev) => ({
      ...prev,
      status: "paused"
    }));
  };
  const handleResume = () => {
    setSession((prev) => ({
      ...prev,
      status: "in_progress"
    }));
  };
  const handleCancel = () => {
    setShowCancelConfirm(true);
  };
  const confirmCancel = () => {
    setLines(products.map((p) => ({
      id: p.id,
      productId: p.id,
      product: { name: p.name, emoji: p.emoji || "📦", barcode: p.barcode },
      systemStock: p.stock,
      countedStock: null,
      difference: null,
      status: "pending"
    })));
    setSession({
      id: crypto.randomUUID(),
      date: /* @__PURE__ */ new Date(),
      status: "idle",
      itemsCounted: 0,
      totalItems: products.length,
      discrepancies: 0,
      createdBy: "Utilisateur"
    });
    setShowCancelConfirm(false);
  };
  const handleComplete = () => {
    setShowConfirmModal(true);
  };
  const handleConfirmAdjustments = () => {
    lines.forEach((line) => {
      if (line.countedStock !== null && line.countedStock !== line.systemStock) {
        updateStock(line.productId, line.countedStock, "set");
      }
    });
    setSession((prev) => ({
      ...prev,
      status: "completed",
      itemsCounted: countedItems,
      discrepancies
    }));
    setLines((prev) => prev.map((line) => {
      const finalCount = line.countedStock !== null ? line.countedStock : line.systemStock;
      return {
        ...line,
        systemStock: finalCount,
        countedStock: null,
        difference: null,
        status: "counted"
      };
    }));
    setShowConfirmModal(false);
    toast.success(`Inventaire terminé! ${countedItems} articles comptés, ${discrepancies} écarts corrigés`);
  };
  const handleCount = (lineId, count) => {
    setLines((prev) => prev.map((line) => {
      if (line.id === lineId) {
        const diff = count - line.systemStock;
        return {
          ...line,
          countedStock: count,
          difference: diff,
          status: diff === 0 ? "counted" : "discrepancy"
        };
      }
      return line;
    }));
    setEditingId(null);
    setCountValue("");
  };
  const filteredLines = lines.filter(
    (l) => l.product.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.product.barcode.includes(searchQuery)
  );
  const isActive = session.status === "in_progress";
  const isPaused = session.status === "paused";
  const isIdle = session.status === "idle";
  const isCompleted = session.status === "completed";
  const statusData = [
    { name: "OK", value: lines.filter((l) => l.status === "counted").length, color: "var(--color-success)" },
    { name: "Écarts", value: discrepancies, color: "var(--color-danger)" },
    { name: "En attente", value: lines.filter((l) => l.status === "pending").length, color: "var(--color-text-muted)" }
  ].filter((d) => d.value > 0);
  const handlePrintSheet = () => {
    window.print();
    toast.info("Génération de la fiche d'inventaire...");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.physicalInventory, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.sessionHeader, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.sessionInfo, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 20 }),
          isIdle && "Nouvel inventaire",
          isActive && "Inventaire en cours",
          isPaused && "⏸️ Inventaire en pause",
          isCompleted && "✅ Inventaire terminé"
        ] }),
        !isIdle && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$3.sessionMeta, children: [
          "Démarré le ",
          session.date.toLocaleDateString("fr-FR"),
          " par ",
          session.createdBy
        ] })
      ] }),
      !isIdle && !isCompleted && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.progressSection, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.progressInfo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            countedItems,
            " / ",
            lines.length,
            " articles"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$3.progressPercent, children: [
            progress,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.progressBar, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.progressFill, style: { width: `${progress}%` } }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.sessionActions, children: [
        isIdle && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$3.startBtn, onClick: handleStart, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 16 }),
          " Démarrer l'inventaire"
        ] }),
        isActive && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$3.pauseBtn, onClick: handlePause, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { size: 16 }),
            " Pause"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$3.completeBtn, onClick: handleComplete, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 16 }),
            " Terminer"
          ] })
        ] }),
        isPaused && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$3.resumeBtn, onClick: handleResume, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 16 }),
            " Reprendre"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$3.completeBtn, onClick: handleComplete, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 16 }),
            " Terminer"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$3.cancelBtn, onClick: handleCancel, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 16 }),
            " Annuler"
          ] })
        ] }),
        isCompleted && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$3.startBtn, onClick: () => {
          setLines(products.map((p) => ({
            id: p.id,
            productId: p.id,
            product: { name: p.name, emoji: p.emoji || "📦", barcode: p.barcode },
            systemStock: p.stock,
            countedStock: null,
            difference: null,
            status: "pending"
          })));
          setSession({
            id: crypto.randomUUID(),
            date: /* @__PURE__ */ new Date(),
            status: "idle",
            itemsCounted: 0,
            totalItems: products.length,
            discrepancies: 0,
            createdBy: "Utilisateur"
          });
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 16 }),
          " Nouveau inventaire"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.statsLayout, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.statsGrid, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.statCard, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 20 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statValue, children: lines.filter((l) => l.status === "counted").length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statLabel, children: "Comptés OK" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$3.statCard} ${styles$3.warning}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 20 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statValue, children: discrepancies }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statLabel, children: "Écarts" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.statCard, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 20 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statValue, children: lines.filter((l) => l.status === "pending").length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statLabel, children: "En attente" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.chartSection, children: statusData.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.miniChart, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 120, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Pie,
            {
              data: statusData,
              innerRadius: 30,
              outerRadius: 50,
              paddingAngle: 5,
              dataKey: "value",
              children: statusData.map((entry2, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: entry2.color }, `cell-${index}`))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {})
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.chartLegend, children: statusData.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.legendItem, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { background: d.color } }),
          d.name
        ] }, i)) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.chartPlaceholder, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPie, { size: 24, opacity: 0.3 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Statut d'avancement" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.toolbar, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.searchBox, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Scanner ou rechercher un produit...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            disabled: !isActive && !isPaused
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.toolbarActions, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$3.outlineBtn, onClick: handlePrintSheet, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 16 }),
          " Fiche d'inventaire"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$3.outlineBtn, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16 }),
          " Exporter"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.linesTable, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.tableHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Produit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Code-barres" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Stock système" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Stock compté" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Écart" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Action" })
      ] }),
      filteredLines.map((line) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `${styles$3.tableRow} ${line.status === "discrepancy" ? styles$3.discrepancyRow : ""}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.productCell, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.emoji, children: line.product.emoji }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: line.product.name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: styles$3.barcode, children: line.product.barcode }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.systemStock, children: line.systemStock }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.countedCell, children: editingId === line.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                value: countValue,
                onChange: (e) => setCountValue(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter" && countValue) {
                    handleCount(line.id, parseInt(countValue));
                  }
                  if (e.key === "Escape") {
                    setEditingId(null);
                    setCountValue("");
                  }
                },
                onBlur: () => {
                  if (countValue) {
                    handleCount(line.id, parseInt(countValue));
                  } else {
                    setEditingId(null);
                  }
                },
                autoFocus: true
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: line.countedStock !== null ? styles$3.counted : styles$3.pending, children: line.countedStock !== null ? line.countedStock : "-" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${styles$3.difference} ${line.difference === null ? "" : line.difference === 0 ? styles$3.ok : line.difference > 0 ? styles$3.positive : styles$3.negative}`, children: line.difference !== null ? line.difference > 0 ? `+${line.difference}` : line.difference : "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.actions, children: (isActive || isPaused) && (line.status === "pending" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: styles$3.countBtn,
                onClick: () => {
                  setEditingId(line.id);
                  setCountValue(line.systemStock.toString());
                },
                children: "Compter"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: styles$3.recountBtn,
                onClick: () => {
                  setEditingId(line.id);
                  setCountValue(line.countedStock?.toString() || "");
                },
                children: "Recompter"
              }
            )) })
          ]
        },
        line.id
      ))
    ] }),
    showConfirmModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.overlay, onClick: () => setShowConfirmModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "✅ Confirmer l'inventaire" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowConfirmModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Résumé de l'inventaire :" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.summaryGrid, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: countedItems }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Articles comptés" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: discrepancies }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Écarts détectés" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: lines.filter((l) => l.status === "pending").length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Non comptés" })
          ] })
        ] }),
        discrepancies > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.discrepancyList, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Écarts à corriger :" }),
          lines.filter((l) => l.status === "discrepancy").slice(0, 5).map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.discrepancyItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              l.product.emoji,
              " ",
              l.product.name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: l.difference > 0 ? styles$3.positive : styles$3.negative, children: [
              l.systemStock,
              " → ",
              l.countedStock,
              " (",
              l.difference > 0 ? "+" : "",
              l.difference,
              ")"
            ] })
          ] }, l.id)),
          discrepancies > 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "...et ",
            discrepancies - 5,
            " autres écarts"
          ] })
        ] }),
        lines.filter((l) => l.status === "pending").length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: styles$3.pendingWarning, children: [
          "⚠️ ",
          lines.filter((l) => l.status === "pending").length,
          " articles n'ont pas été comptés. Leur stock restera inchangé."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles$3.warning, children: "⚠️ Cette action mettra à jour le stock de tous les articles avec écarts." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowConfirmModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$3.confirmBtn, onClick: handleConfirmAdjustments, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 18 }),
          " Terminer l'inventaire"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmModal,
      {
        isOpen: showCancelConfirm,
        title: "Annuler l'inventaire",
        message: "Êtes-vous sûr de vouloir annuler cet inventaire ? Toutes les données seront perdues.",
        confirmText: "Annuler l'inventaire",
        cancelText: "Retour",
        variant: "warning",
        onConfirm: confirmCancel,
        onCancel: () => setShowCancelConfirm(false)
      }
    )
  ] });
};
const bundleManagement = "_bundleManagement_aru8s_5";
const header$2 = "_header_aru8s_12";
const headerLeft$1 = "_headerLeft_aru8s_18";
const createBtn = "_createBtn_aru8s_37";
const searchBar = "_searchBar_aru8s_57";
const bundlesGrid = "_bundlesGrid_aru8s_121";
const bundleCard = "_bundleCard_aru8s_127";
const bundleHeader = "_bundleHeader_aru8s_143";
const bundleIcon = "_bundleIcon_aru8s_149";
const bundleInfo = "_bundleInfo_aru8s_160";
const bundleSku = "_bundleSku_aru8s_166";
const discountBadge = "_discountBadge_aru8s_171";
const bundleComponents = "_bundleComponents_aru8s_182";
const componentsLabel = "_componentsLabel_aru8s_188";
const componentRow = "_componentRow_aru8s_195";
const componentQty = "_componentQty_aru8s_202";
const componentName = "_componentName_aru8s_208";
const bundlePricing = "_bundlePricing_aru8s_216";
const priceRow = "_priceRow_aru8s_222";
const strikethrough = "_strikethrough_aru8s_229";
const bundlePriceValue = "_bundlePriceValue_aru8s_234";
const savingsRow = "_savingsRow_aru8s_240";
const bundleStock = "_bundleStock_aru8s_249";
const stockOk = "_stockOk_aru8s_254";
const stockLow = "_stockLow_aru8s_259";
const bundleActions = "_bundleActions_aru8s_265";
const editBtn = "_editBtn_aru8s_271";
const deleteBtn = "_deleteBtn_aru8s_292";
const modalOverlay = "_modalOverlay_aru8s_333";
const modal$1 = "_modal_aru8s_333";
const modalHeader$1 = "_modalHeader_aru8s_355";
const closeBtn$1 = "_closeBtn_aru8s_371";
const modalContent = "_modalContent_aru8s_380";
const formRow$1 = "_formRow_aru8s_389";
const formGroup$1 = "_formGroup_aru8s_395";
const bundleConfig = "_bundleConfig_aru8s_424";
const configRow = "_configRow_aru8s_433";
const configArrow = "_configArrow_aru8s_439";
const priceCalc = "_priceCalc_aru8s_443";
const calcRow = "_calcRow_aru8s_450";
const priceInputWrapper = "_priceInputWrapper_aru8s_456";
const currency$1 = "_currency_aru8s_473";
const discountPreview = "_discountPreview_aru8s_480";
const discountBadgeLarge = "_discountBadgeLarge_aru8s_490";
const positive = "_positive_aru8s_499";
const negative = "_negative_aru8s_504";
const savingAmount = "_savingAmount_aru8s_509";
const stockInfo = "_stockInfo_aru8s_514";
const modalFooter$1 = "_modalFooter_aru8s_524";
const cancelBtn = "_cancelBtn_aru8s_532";
const saveBtn$1 = "_saveBtn_aru8s_541";
const styles$2 = {
  bundleManagement,
  header: header$2,
  headerLeft: headerLeft$1,
  createBtn,
  searchBar,
  bundlesGrid,
  bundleCard,
  bundleHeader,
  bundleIcon,
  bundleInfo,
  bundleSku,
  discountBadge,
  bundleComponents,
  componentsLabel,
  componentRow,
  componentQty,
  componentName,
  bundlePricing,
  priceRow,
  strikethrough,
  bundlePriceValue,
  savingsRow,
  bundleStock,
  stockOk,
  stockLow,
  bundleActions,
  editBtn,
  deleteBtn,
  modalOverlay,
  modal: modal$1,
  modalHeader: modalHeader$1,
  closeBtn: closeBtn$1,
  modalContent,
  formRow: formRow$1,
  formGroup: formGroup$1,
  bundleConfig,
  configRow,
  configArrow,
  priceCalc,
  calcRow,
  priceInputWrapper,
  currency: currency$1,
  discountPreview,
  discountBadgeLarge,
  positive,
  negative,
  savingAmount,
  stockInfo,
  modalFooter: modalFooter$1,
  cancelBtn,
  saveBtn: saveBtn$1
};
const BundleManagement = () => {
  useToast();
  const { products, addProduct, updateProduct, deleteProduct } = useProductsStore();
  const bundles = products.filter((p) => p.productType === "bundle").map((p) => {
    const basePrefix = p.name.split(" x")[0];
    const baseProduct = products.find((bp) => bp.name === basePrefix && bp.productType !== "bundle");
    const totalUnitPrice = baseProduct ? baseProduct.sellingPrice * (p.unitsPerPack || 1) : p.sellingPrice;
    const savings = totalUnitPrice - p.sellingPrice;
    const discount = totalUnitPrice > 0 ? Math.round(savings / totalUnitPrice * 100) : 0;
    return {
      id: p.id,
      name: p.name,
      sku: p.sku || "",
      barcode: p.barcode,
      bundlePrice: p.sellingPrice,
      totalUnitPrice,
      discount,
      stock: baseProduct ? Math.floor(baseProduct.stock / (p.unitsPerPack || 1)) : 0,
      componentName: baseProduct ? baseProduct.name : "Produit inconnu",
      quantity: p.unitsPerPack || 1
    };
  });
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [showCreateModal, setShowCreateModal] = reactExports.useState(false);
  const [editBundle, setEditBundle] = reactExports.useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = reactExports.useState(false);
  const [bundleToDelete, setBundleToDelete] = reactExports.useState(null);
  const filteredBundles = bundles.filter(
    (b) => b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleDeleteBundle = (bundleId) => {
    setBundleToDelete(bundleId);
    setShowDeleteConfirm(true);
  };
  const confirmDelete = () => {
    if (bundleToDelete) {
      deleteProduct(bundleToDelete);
    }
    setShowDeleteConfirm(false);
    setBundleToDelete(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.bundleManagement, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.header, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.headerLeft, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Gestion des Packs / Bundles" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Créez et gérez les packs produits avec prix réduit" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: styles$2.createBtn,
          onClick: () => setShowCreateModal(true),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
            " Créer un Pack"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.searchBar, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 20 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          placeholder: "Rechercher un pack...",
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.bundlesGrid, children: filteredBundles.map((bundle) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.bundleCard, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.bundleHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.bundleIcon, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.bundleInfo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: bundle.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$2.bundleSku, children: [
            "SKU: ",
            bundle.sku
          ] })
        ] }),
        bundle.discount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.discountBadge, children: [
          "-",
          bundle.discount,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.bundleComponents, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.componentsLabel, children: "Contenu du pack:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.componentRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$2.componentQty, children: [
            bundle.quantity,
            "x"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.componentName, children: bundle.componentName })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.bundlePricing, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.priceRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Prix total (unités):" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.strikethrough, children: formatCurrency(bundle.totalUnitPrice) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.priceRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600 }, children: "Prix du Pack:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.bundlePriceValue, children: formatCurrency(bundle.bundlePrice) })
        ] }),
        bundle.totalUnitPrice > bundle.bundlePrice && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.savingsRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Percent, { size: 12 }),
          "Économie de ",
          formatCurrency(bundle.totalUnitPrice - bundle.bundlePrice)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.bundleStock, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: bundle.stock > 5 ? styles$2.stockOk : styles$2.stockLow, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { size: 14, style: { marginRight: "8px", verticalAlign: "middle" } }),
        bundle.stock > 0 ? `${bundle.stock} packs disponibles` : "En rupture de stock"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.bundleActions, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: styles$2.editBtn,
            onClick: () => {
              const product = products.find((p) => p.id === bundle.id);
              if (product) {
                setEditBundle(product);
                setShowCreateModal(true);
              }
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { size: 16 }),
              " Modifier"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: styles$2.deleteBtn,
            onClick: () => handleDeleteBundle(bundle.id),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 })
          }
        )
      ] })
    ] }, bundle.id)) }),
    showCreateModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CreateBundleModal,
      {
        products,
        initialData: editBundle,
        onClose: () => {
          setShowCreateModal(false);
          setEditBundle(null);
        },
        onSave: (data) => {
          if (editBundle) {
            updateProduct(editBundle.id, data);
          } else {
            addProduct({
              ...data,
              productType: "bundle",
              isActive: true,
              isFavorite: false,
              priceHistory: [],
              stock: 0,
              minStock: 5,
              unit: "pack",
              purchasePrice: 0,
              category: "Packs"
            });
          }
          setShowCreateModal(false);
          setEditBundle(null);
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmModal,
      {
        isOpen: showDeleteConfirm,
        title: "Supprimer le pack",
        message: "Êtes-vous sûr de vouloir supprimer ce pack ?",
        confirmText: "Supprimer",
        cancelText: "Annuler",
        variant: "danger",
        onConfirm: confirmDelete,
        onCancel: () => setShowDeleteConfirm(false)
      }
    )
  ] });
};
const CreateBundleModal = ({ products, onClose, onSave, initialData }) => {
  const [name, setName] = reactExports.useState(initialData?.name || "");
  const [sku, setSku] = reactExports.useState(initialData?.sku || "");
  const [quantity, setQuantity] = reactExports.useState(initialData?.unitsPerPack || initialData?.quantity || 6);
  const [price, setPrice] = reactExports.useState(initialData?.sellingPrice || initialData?.bundlePrice || 0);
  const [selectedProductId, setSelectedProductId] = reactExports.useState("");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [showResults, setShowResults] = reactExports.useState(false);
  const results = products.filter(
    (p) => p.productType !== "bundle" && (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode.includes(searchQuery))
  ).slice(0, 5);
  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const totalUnitPrice = selectedProduct ? selectedProduct.sellingPrice * quantity : 0;
  const savings = totalUnitPrice - price;
  const discount = totalUnitPrice > 0 ? Math.round(savings / totalUnitPrice * 100) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.modalOverlay, onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.modal, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.modalHeader, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 20 }),
        initialData ? "Modifier le Pack" : "Créer un nouveau Pack"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles$2.closeBtn, onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.modalContent, children: [
      !initialData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.formGroup, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Sélectionner le produit de base" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.searchBar, style: { position: "relative" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: "Rechercher par nom ou code-barres...",
              value: searchQuery,
              onChange: (e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }
            }
          ),
          showResults && searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            zIndex: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            marginTop: "4px"
          }, children: results.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              onClick: () => {
                setSelectedProductId(p.id);
                setName(`${p.name} x${quantity}`);
                setPrice(Math.round(p.sellingPrice * quantity * 0.9));
                setSearchQuery(p.name);
                setShowResults(false);
              },
              style: { padding: "12px", cursor: "pointer", borderBottom: "1px solid #f0f0f0" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 500 }, children: p.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { float: "right", color: "#666" }, children: formatCurrency(p.sellingPrice) })
              ]
            },
            p.id
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.formRow, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.formGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Nom du Pack" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "Ex: Pack Eau x6" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.formGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "SKU / Barcode Pack" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: sku, onChange: (e) => setSku(e.target.value), placeholder: "001-P6" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.bundleConfig, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.configRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.formGroup, style: { width: "100px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Quantité" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                value: quantity,
                onChange: (e) => {
                  const q = Number(e.target.value);
                  setQuantity(q);
                  if (selectedProduct) setName(`${selectedProduct.name} x${q}`);
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.configArrow, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 24 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.priceCalc, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.calcRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Prix cumulé:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCurrency(totalUnitPrice) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.formGroup, style: { marginTop: "8px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Prix de vente du Pack" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.priceInputWrapper, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    value: price,
                    onChange: (e) => setPrice(Number(e.target.value))
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.currency, children: "DA" })
              ] })
            ] })
          ] })
        ] }),
        totalUnitPrice > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.discountPreview, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$2.discountBadgeLarge} ${discount >= 0 ? styles$2.positive : styles$2.negative}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Percent, { size: 18 }),
            discount >= 0 ? `Réduction de ${discount}%` : `Majoration de ${Math.abs(discount)}%`
          ] }),
          savings > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$2.savingAmount, children: [
            "L'acheteur économise ",
            formatCurrency(savings)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.stockInfo, children: [
            "Stock estimé: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selectedProduct ? Math.floor(selectedProduct.stock / quantity) : 0 }),
            " packs"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.modalFooter, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles$2.cancelBtn, onClick: onClose, children: "Annuler" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => onSave({
            name,
            sku,
            unitsPerPack: quantity,
            sellingPrice: price,
            barcode: sku,
            // Use SKU as barcode if not provided
            emoji: selectedProduct?.emoji || "📦"
          }),
          className: styles$2.saveBtn,
          disabled: !name || !price || !selectedProductId && !initialData,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 18 }),
            initialData ? "Mettre à jour" : "Créer le Pack"
          ]
        }
      )
    ] })
  ] }) });
};
const extractDigits = (barcode2, count) => {
  const digits = barcode2.replace(/\D/g, "");
  return digits.slice(-count);
};
const generateSKU = (barcode2, existingSKUs) => {
  const existingSet = new Set(existingSKUs.map((s) => s.toUpperCase()));
  let sku3 = extractDigits(barcode2, 3);
  if (sku3.length === 3 && !existingSet.has(sku3)) {
    return { sku: sku3, length: 3, isUnique: true, attempts: 1 };
  }
  let sku4 = extractDigits(barcode2, 4);
  if (sku4.length === 4 && !existingSet.has(sku4)) {
    return { sku: sku4, length: 4, isUnique: true, attempts: 2 };
  }
  let sku5 = extractDigits(barcode2, 5);
  if (sku5.length === 5 && !existingSet.has(sku5)) {
    return { sku: sku5, length: 5, isUnique: true, attempts: 3 };
  }
  let counter = 1;
  let skuWithCounter = `${sku5}${counter}`;
  while (existingSet.has(skuWithCounter) && counter < 100) {
    counter++;
    skuWithCounter = `${sku5}${counter}`;
  }
  return { sku: skuWithCounter, length: 5, isUnique: true, attempts: 3 + counter };
};
const validateSKU = (sku) => {
  return /^\d{3,6}$/.test(sku);
};
const generateDesignation = (brand, nature, quantity, unit) => {
  const parts = [];
  if (brand) {
    parts.push(brand.toUpperCase());
  }
  if (nature) {
    const formattedNature = nature.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    parts.push(formattedNature);
  }
  if (quantity && unit) {
    parts.push(`${quantity}${unit}`);
  }
  return parts.join(" - ");
};
const validatePrices = (buyPrice2, sellPrice2) => {
  if (sellPrice2 <= buyPrice2) {
    return {
      isValid: false,
      margin: 0,
      warning: `⚠️ Prix de vente (${sellPrice2} DA) est inférieur ou égal au prix d'achat (${buyPrice2} DA)!`
    };
  }
  const margin2 = (sellPrice2 - buyPrice2) / buyPrice2 * 100;
  if (margin2 < 5) {
    return {
      isValid: true,
      margin: margin2,
      warning: `⚠️ Marge très faible: ${margin2.toFixed(1)}%`
    };
  }
  return { isValid: true, margin: margin2 };
};
const UNITS_OF_MEASURE = [
  { value: "unit", label: "Unité", symbol: "u" },
  { value: "kg", label: "Kilogramme", symbol: "Kg" },
  { value: "g", label: "Gramme", symbol: "g" },
  { value: "l", label: "Litre", symbol: "L" },
  { value: "ml", label: "Millilitre", symbol: "ml" },
  { value: "cl", label: "Centilitre", symbol: "cl" },
  { value: "pack", label: "Pack", symbol: "Pack" },
  { value: "carton", label: "Carton", symbol: "Crt" },
  { value: "box", label: "Boîte", symbol: "Bte" },
  { value: "sachet", label: "Sachet", symbol: "Sac" },
  { value: "bottle", label: "Bouteille", symbol: "Btl" },
  { value: "can", label: "Canette", symbol: "Can" },
  { value: "jar", label: "Bocal", symbol: "Boc" },
  { value: "tube", label: "Tube", symbol: "Tube" },
  { value: "roll", label: "Rouleau", symbol: "Rl" },
  { value: "piece", label: "Pièce", symbol: "Pce" },
  { value: "dozen", label: "Douzaine", symbol: "Dz" },
  { value: "tray", label: "Plateau", symbol: "Plt" }
];
const CATEGORIES = [
  {
    id: "beverages",
    name: "Boissons",
    icon: "🥤",
    color: "#3B82F6",
    subcategories: [
      { id: "soft-drinks", name: "Boissons gazeuses" },
      { id: "juices", name: "Jus de fruits" },
      { id: "water", name: "Eaux minérales" },
      { id: "energy", name: "Boissons énergisantes" },
      { id: "hot-drinks", name: "Café & Thé" }
    ]
  },
  {
    id: "dairy",
    name: "Produits Laitiers",
    icon: "🥛",
    color: "#8B5CF6",
    subcategories: [
      { id: "milk", name: "Lait" },
      { id: "yogurt", name: "Yaourts" },
      { id: "cheese", name: "Fromages" },
      { id: "butter", name: "Beurre & Margarine" },
      { id: "cream", name: "Crème fraîche" }
    ]
  },
  {
    id: "grocery",
    name: "Épicerie",
    icon: "🛒",
    color: "#10B981",
    subcategories: [
      { id: "pasta", name: "Pâtes & Riz" },
      { id: "oil", name: "Huiles" },
      { id: "sugar", name: "Sucre & Confiserie" },
      { id: "flour", name: "Farines & Semoules" },
      { id: "canned", name: "Conserves" },
      { id: "sauce", name: "Sauces & Condiments" },
      { id: "spices", name: "Épices" },
      { id: "legumes", name: "Légumes secs" }
    ]
  },
  {
    id: "biscuits",
    name: "Biscuiterie",
    icon: "🍪",
    color: "#F59E0B",
    subcategories: [
      { id: "cookies", name: "Biscuits sucrés" },
      { id: "crackers", name: "Biscuits salés" },
      { id: "chocolate", name: "Chocolaterie" },
      { id: "candies", name: "Confiserie" }
    ]
  },
  {
    id: "fruits-vegetables",
    name: "Fruits & Légumes",
    icon: "🍎",
    color: "#EF4444",
    subcategories: [
      { id: "fruits", name: "Fruits frais" },
      { id: "vegetables", name: "Légumes frais" },
      { id: "herbs", name: "Herbes aromatiques" }
    ]
  },
  {
    id: "meat",
    name: "Viandes & Charcuterie",
    icon: "🥩",
    color: "#DC2626",
    subcategories: [
      { id: "beef", name: "Bœuf" },
      { id: "mutton", name: "Mouton & Agneau" },
      { id: "poultry", name: "Volaille" },
      { id: "charcuterie", name: "Charcuterie" }
    ]
  },
  {
    id: "frozen",
    name: "Surgélés",
    icon: "🧊",
    color: "#0EA5E9",
    subcategories: [
      { id: "frozen-meat", name: "Viandes surgelées" },
      { id: "frozen-fish", name: "Poissons surgelés" },
      { id: "frozen-veg", name: "Légumes surgelés" },
      { id: "ice-cream", name: "Glaces & Sorbets" }
    ]
  },
  {
    id: "hygiene",
    name: "Hygiène & Beauté",
    icon: "🧴",
    color: "#EC4899",
    subcategories: [
      { id: "body-care", name: "Soins du corps" },
      { id: "hair-care", name: "Soins capillaires" },
      { id: "oral-care", name: "Hygiène bucco-dentaire" },
      { id: "baby-care", name: "Bébé" },
      { id: "feminine", name: "Hygiène féminine" }
    ]
  },
  {
    id: "cleaning",
    name: "Entretien",
    icon: "🧹",
    color: "#6366F1",
    subcategories: [
      { id: "laundry", name: "Lessive" },
      { id: "dishes", name: "Vaisselle" },
      { id: "floor", name: "Sols" },
      { id: "bathroom", name: "Salle de bain" },
      { id: "air-freshener", name: "Désodorisants" }
    ]
  },
  {
    id: "snacks",
    name: "Snacks",
    icon: "🍿",
    color: "#F97316",
    subcategories: [
      { id: "chips", name: "Chips" },
      { id: "nuts", name: "Fruits secs" },
      { id: "popcorn", name: "Pop-corn" }
    ]
  },
  {
    id: "bread",
    name: "Boulangerie",
    icon: "🍞",
    color: "#A16207",
    subcategories: [
      { id: "bread", name: "Pains" },
      { id: "pastry", name: "Viennoiseries" },
      { id: "cakes", name: "Gâteaux" }
    ]
  },
  {
    id: "pet",
    name: "Animaux",
    icon: "🐕",
    color: "#78716C",
    subcategories: [
      { id: "dog-food", name: "Alimentation chien" },
      { id: "cat-food", name: "Alimentation chat" },
      { id: "bird-food", name: "Alimentation oiseaux" }
    ]
  }
];
const COMMON_BRANDS = [
  "Candia",
  "Soummam",
  "Danone",
  "Coca-Cola",
  "Pepsi",
  "Ifri",
  "Rouiba",
  "Cevital",
  "Elio",
  "Afia",
  "Bimo",
  "Guermit",
  "Iris",
  "SIM",
  "Hamoud Boualem",
  "La Vache Qui Rit",
  "Président",
  "Nestlé",
  "Kraft",
  "Kiri",
  "Puck",
  "Tide",
  "Ariel",
  "Omo",
  "Persil",
  "Dove",
  "Palmolive",
  "Lux",
  "Signal",
  "Colgate",
  "Sensodyne",
  "Gillette",
  "Nivea",
  "Pond's"
];
const PRODUCT_NATURES = [
  // Dairy
  "Lait Entier",
  "Lait Demi-Écrémé",
  "Lait Écrémé",
  "Lait UHT",
  "Yaourt Nature",
  "Yaourt aux Fruits",
  "Yaourt Brassé",
  "Yaourt à Boire",
  "Fromage Fondu",
  "Fromage Frais",
  "Fromage Râpé",
  // Beverages
  "Eau Minérale Naturelle",
  "Eau Minérale Gazeuse",
  "Jus d'Orange",
  "Jus de Pomme",
  "Soda Cola",
  "Soda Limonade",
  "Boisson Énergisante",
  // Grocery
  "Huile de Table",
  "Huile d'Olive",
  "Huile de Tournesol",
  "Sucre Blanc",
  "Sucre Glace",
  "Sucre Roux",
  "Farine de Blé",
  "Semoule Fine",
  "Semoule Moyenne",
  "Pâtes Spaghetti",
  "Pâtes Macaroni",
  "Pâtes Coquillettes",
  "Riz Long",
  "Concentré de Tomate",
  "Double Concentré de Tomate",
  // Others
  "Café Moulu",
  "Café Soluble",
  "Thé Vert",
  "Thé Noir",
  "Biscuits Secs",
  "Biscuits Fourrés",
  "Chocolat au Lait",
  "Chocolat Noir",
  "Chips Nature",
  "Chips Paprika",
  "Chips Fromage"
];
const overlay$1 = "_overlay_6hc0t_5";
const modal = "_modal_6hc0t_27";
const header$1 = "_header_6hc0t_52";
const headerTitle = "_headerTitle_6hc0t_61";
const closeBtn = "_closeBtn_6hc0t_72";
const progressBar = "_progressBar_6hc0t_87";
const step = "_step_6hc0t_96";
const active$1 = "_active_6hc0t_107";
const stepNumber = "_stepNumber_6hc0t_112";
const stepLine = "_stepLine_6hc0t_129";
const content = "_content_6hc0t_136";
const stepContent = "_stepContent_6hc0t_142";
const stepHint = "_stepHint_6hc0t_155";
const barcodeSection = "_barcodeSection_6hc0t_162";
const barcodeInput = "_barcodeInput_6hc0t_168";
const checkIcon = "_checkIcon_6hc0t_197";
const skuResult = "_skuResult_6hc0t_217";
const skuHeader = "_skuHeader_6hc0t_224";
const skuDisplay = "_skuDisplay_6hc0t_233";
const skuCode = "_skuCode_6hc0t_240";
const skuInfo = "_skuInfo_6hc0t_250";
const skuEdit = "_skuEdit_6hc0t_255";
const skuError = "_skuError_6hc0t_277";
const formGrid = "_formGrid_6hc0t_286";
const formRow = "_formRow_6hc0t_292";
const formGroup = "_formGroup_6hc0t_298";
const fieldHint = "_fieldHint_6hc0t_327";
const autocomplete = "_autocomplete_6hc0t_333";
const suggestions = "_suggestions_6hc0t_337";
const suggestionItem = "_suggestionItem_6hc0t_351";
const categoryGrid = "_categoryGrid_6hc0t_363";
const categoryBtn = "_categoryBtn_6hc0t_370";
const selected = "_selected_6hc0t_388";
const catIcon = "_catIcon_6hc0t_394";
const selectedCategoryLabel = "_selectedCategoryLabel_6hc0t_398";
const designationPreview = "_designationPreview_6hc0t_412";
const designationHeader = "_designationHeader_6hc0t_419";
const designationValue = "_designationValue_6hc0t_428";
const priceSection = "_priceSection_6hc0t_435";
const priceInputs = "_priceInputs_6hc0t_441";
const priceGroup = "_priceGroup_6hc0t_448";
const priceInput = "_priceInput_6hc0t_441";
const errorInput = "_errorInput_6hc0t_489";
const currency = "_currency_6hc0t_503";
const priceArrow = "_priceArrow_6hc0t_511";
const marginDisplay = "_marginDisplay_6hc0t_518";
const goodMargin = "_goodMargin_6hc0t_527";
const lowMargin = "_lowMargin_6hc0t_532";
const priceWarning = "_priceWarning_6hc0t_542";
const priceHistory = "_priceHistory_6hc0t_572";
const historyHeader = "_historyHeader_6hc0t_578";
const historyList = "_historyList_6hc0t_588";
const historyItem = "_historyItem_6hc0t_594";
const historyDate = "_historyDate_6hc0t_603";
const stockSection = "_stockSection_6hc0t_615";
const summary = "_summary_6hc0t_621";
const summaryGrid = "_summaryGrid_6hc0t_634";
const stepButtons = "_stepButtons_6hc0t_643";
const nextBtn = "_nextBtn_6hc0t_652";
const backBtn = "_backBtn_6hc0t_653";
const saveBtn = "_saveBtn_6hc0t_654";
const resetBtn = "_resetBtn_6hc0t_655";
const styles$1 = {
  overlay: overlay$1,
  modal,
  header: header$1,
  headerTitle,
  closeBtn,
  progressBar,
  step,
  active: active$1,
  stepNumber,
  stepLine,
  content,
  stepContent,
  stepHint,
  barcodeSection,
  barcodeInput,
  checkIcon,
  skuResult,
  skuHeader,
  skuDisplay,
  skuCode,
  skuInfo,
  skuEdit,
  skuError,
  formGrid,
  formRow,
  formGroup,
  fieldHint,
  autocomplete,
  suggestions,
  suggestionItem,
  categoryGrid,
  categoryBtn,
  selected,
  catIcon,
  selectedCategoryLabel,
  designationPreview,
  designationHeader,
  designationValue,
  priceSection,
  priceInputs,
  priceGroup,
  priceInput,
  errorInput,
  currency,
  priceArrow,
  marginDisplay,
  goodMargin,
  lowMargin,
  priceWarning,
  priceHistory,
  historyHeader,
  historyList,
  historyItem,
  historyDate,
  stockSection,
  summary,
  summaryGrid,
  stepButtons,
  nextBtn,
  backBtn,
  saveBtn,
  resetBtn
};
const AddProductModal = ({
  isOpen,
  onClose,
  onSave,
  existingSKUs,
  editProduct
}) => {
  const toast = useToast();
  const barcodeInputRef = reactExports.useRef(null);
  const [barcode2, setBarcode] = reactExports.useState("");
  const [sku, setSku] = reactExports.useState("");
  const [skuGenerated, setSkuGenerated] = reactExports.useState(false);
  const [skuLength, setSkuLength] = reactExports.useState(3);
  const [brand, setBrand] = reactExports.useState("");
  const [nature, setNature] = reactExports.useState("");
  const [quantity, setQuantity] = reactExports.useState("");
  const [unit, setUnit] = reactExports.useState("unit");
  const [categoryId, setCategoryId] = reactExports.useState("");
  const [subcategoryId, setSubcategoryId] = reactExports.useState("");
  const [designation, setDesignation] = reactExports.useState("");
  const [buyPrice2, setBuyPrice] = reactExports.useState("");
  const [sellPrice2, setSellPrice] = reactExports.useState("");
  const [minStock, setMinStock] = reactExports.useState("10");
  const [showBrandSuggestions, setShowBrandSuggestions] = reactExports.useState(false);
  const [showNatureSuggestions, setShowNatureSuggestions] = reactExports.useState(false);
  const [priceWarning2, setPriceWarning] = reactExports.useState(null);
  const [priceMargin, setPriceMargin] = reactExports.useState(null);
  const [currentStep, setCurrentStep] = reactExports.useState(1);
  const priceHistory2 = editProduct?.priceHistory || [];
  reactExports.useEffect(() => {
    if (isOpen && barcodeInputRef.current) {
      setTimeout(() => barcodeInputRef.current?.focus(), 100);
    }
  }, [isOpen]);
  reactExports.useEffect(() => {
    if (barcode2.length >= 8) {
      const result = generateSKU(barcode2, existingSKUs);
      setSku(result.sku);
      setSkuLength(result.length);
      setSkuGenerated(true);
    }
  }, [barcode2, existingSKUs]);
  reactExports.useEffect(() => {
    const unitSymbol = UNITS_OF_MEASURE.find((u) => u.value === unit)?.symbol || "";
    const newDesignation = generateDesignation(brand, nature, quantity, unitSymbol);
    setDesignation(newDesignation.toUpperCase());
  }, [brand, nature, quantity, unit]);
  reactExports.useEffect(() => {
    const buy = parseFloat(buyPrice2);
    const sell = parseFloat(sellPrice2);
    if (buy > 0 && sell > 0) {
      const validation = validatePrices(buy, sell);
      setPriceWarning(validation.warning || null);
      setPriceMargin(validation.margin);
    } else {
      setPriceWarning(null);
      setPriceMargin(null);
    }
  }, [buyPrice2, sellPrice2]);
  const selectedCategory = CATEGORIES.find((c) => c.id === categoryId);
  const subcategories = selectedCategory?.subcategories || [];
  const filteredBrands = COMMON_BRANDS.filter(
    (b) => b.toLowerCase().includes(brand.toLowerCase())
  ).slice(0, 8);
  const filteredNatures = PRODUCT_NATURES.filter(
    (n) => n.toLowerCase().includes(nature.toLowerCase())
  ).slice(0, 8);
  const handleBarcodeKeyDown = (e) => {
    if (e.key === "Enter" && barcode2.length >= 8) {
      setCurrentStep(2);
    }
  };
  const handleSave = () => {
    const buy = parseFloat(buyPrice2);
    const sell = parseFloat(sellPrice2);
    if (sell <= buy) {
      toast.warning("Le prix de vente doit être supérieur au prix d'achat!");
      return;
    }
    onSave({
      barcode: barcode2,
      sku,
      brand,
      nature,
      designation,
      categoryId,
      subcategoryId,
      quantity: parseFloat(quantity),
      unit,
      buyPrice: buy,
      sellPrice: sell,
      minStock: parseInt(minStock),
      stock: 0,
      isActive: true,
      priceHistory: [{ date: /* @__PURE__ */ new Date(), oldPrice: sell, newPrice: sell }]
    });
    handleReset();
    onClose();
  };
  const handleReset = () => {
    setBarcode("");
    setSku("");
    setSkuGenerated(false);
    setBrand("");
    setNature("");
    setQuantity("");
    setUnit("unit");
    setCategoryId("");
    setSubcategoryId("");
    setDesignation("");
    setBuyPrice("");
    setSellPrice("");
    setMinStock("10");
    setCurrentStep(1);
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.overlay, onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.modal, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.header, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.headerTitle, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: editProduct ? "Modifier le Produit" : "Nouveau Produit" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles$1.closeBtn, onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.progressBar, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$1.step} ${currentStep >= 1 ? styles$1.active : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.stepNumber, children: "1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Identification" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.stepLine }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$1.step} ${currentStep >= 2 ? styles$1.active : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.stepNumber, children: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Description" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.stepLine }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$1.step} ${currentStep >= 3 ? styles$1.active : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.stepNumber, children: "3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Prix & Stock" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.content, children: [
      currentStep === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.stepContent, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Barcode, { size: 20 }),
          " Scanner le Code-Barres"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles$1.stepHint, children: "Scannez le code-barres du produit ou saisissez-le manuellement" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.barcodeSection, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.barcodeInput, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Barcode, { size: 24 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: barcodeInputRef,
                type: "text",
                value: barcode2,
                onChange: (e) => setBarcode(e.target.value),
                onKeyDown: handleBarcodeKeyDown,
                placeholder: "Scanner ou saisir le code-barres...",
                autoFocus: true
              }
            ),
            barcode2.length >= 8 && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 24, className: styles$1.checkIcon })
          ] }),
          skuGenerated && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.skuResult, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.skuHeader, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 16 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "SKU Généré Automatiquement" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.skuDisplay, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: styles$1.skuCode, children: sku }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.skuInfo, children: [
                skuLength,
                " chiffres • Code de secours"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.skuEdit, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Modifier le SKU:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: sku,
                  onChange: (e) => {
                    setSku(e.target.value);
                    setSkuGenerated(false);
                  },
                  maxLength: 6
                }
              ),
              !validateSKU(sku) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.skuError, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 14 }),
                " SKU invalide (3-6 chiffres)"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: styles$1.nextBtn,
            onClick: () => setCurrentStep(2),
            disabled: barcode2.length < 8 || !validateSKU(sku),
            children: "Continuer →"
          }
        )
      ] }),
      currentStep === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.stepContent, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 20 }),
          " Description du Produit"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.formGrid, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Marque *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.autocomplete, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: brand,
                  onChange: (e) => {
                    setBrand(e.target.value);
                    setShowBrandSuggestions(true);
                  },
                  onFocus: () => setShowBrandSuggestions(true),
                  onBlur: () => setTimeout(() => setShowBrandSuggestions(false), 200),
                  placeholder: "Ex: Candia, Coca-Cola..."
                }
              ),
              showBrandSuggestions && filteredBrands.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.suggestions, children: filteredBrands.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: styles$1.suggestionItem,
                  onClick: () => {
                    setBrand(b);
                    setShowBrandSuggestions(false);
                  },
                  children: b
                },
                b
              )) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Nature du Produit *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.autocomplete, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: nature,
                  onChange: (e) => {
                    setNature(e.target.value);
                    setShowNatureSuggestions(true);
                  },
                  onFocus: () => setShowNatureSuggestions(true),
                  onBlur: () => setTimeout(() => setShowNatureSuggestions(false), 200),
                  placeholder: "Ex: Lait UHT Demi-Écrémé..."
                }
              ),
              showNatureSuggestions && filteredNatures.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.suggestions, children: filteredNatures.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: styles$1.suggestionItem,
                  onClick: () => {
                    setNature(n);
                    setShowNatureSuggestions(false);
                  },
                  children: n
                },
                n
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.fieldHint, children: "Cette description apparaîtra sur l'étiquette" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.formRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.formGroup, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Quantité" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  value: quantity,
                  onChange: (e) => setQuantity(e.target.value),
                  placeholder: "Ex: 1, 1.5, 500..."
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.formGroup, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Unité de Mesure *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: unit, onChange: (e) => setUnit(e.target.value), children: UNITS_OF_MEASURE.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: u.value, children: [
                u.label,
                " (",
                u.symbol,
                ")"
              ] }, u.value)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Catégorie *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.categoryGrid, children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: `${styles$1.categoryBtn} ${categoryId === cat.id ? styles$1.selected : ""}`,
                onClick: () => {
                  setCategoryId(cat.id);
                  setSubcategoryId("");
                },
                style: { "--cat-color": cat.color },
                title: cat.name,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.catIcon, children: cat.icon })
              },
              cat.id
            )) }),
            selectedCategory && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.selectedCategoryLabel, children: [
              selectedCategory.icon,
              " ",
              selectedCategory.name
            ] })
          ] }),
          subcategories.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Sous-Catégorie" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: subcategoryId,
                onChange: (e) => setSubcategoryId(e.target.value),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Sélectionner..." }),
                  subcategories.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: sub.id, children: sub.name }, sub.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.designationPreview, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.designationHeader, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 16 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Désignation (générée automatiquement)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.designationValue, children: designation || "MARQUE - Nature du Produit - Quantité" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.stepButtons, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles$1.backBtn, onClick: () => setCurrentStep(1), children: "← Retour" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: styles$1.nextBtn,
              onClick: () => setCurrentStep(3),
              disabled: !brand || !nature || !categoryId,
              children: "Continuer →"
            }
          )
        ] })
      ] }),
      currentStep === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.stepContent, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { size: 20 }),
          " Prix et Stock"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.priceSection, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.priceInputs, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.priceGroup, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Prix d'Achat (DA) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.priceInput, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    value: buyPrice2,
                    onChange: (e) => setBuyPrice(e.target.value),
                    placeholder: "0"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.currency, children: "DA" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.priceArrow, children: "→" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.priceGroup, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Prix de Vente (DA) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.priceInput, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    value: sellPrice2,
                    onChange: (e) => setSellPrice(e.target.value),
                    placeholder: "0",
                    className: priceWarning2 && parseFloat(sellPrice2) <= parseFloat(buyPrice2) ? styles$1.errorInput : ""
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.currency, children: "DA" })
              ] })
            ] })
          ] }),
          priceMargin !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$1.marginDisplay} ${priceMargin < 10 ? styles$1.lowMargin : styles$1.goodMargin}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Marge bénéficiaire:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              priceMargin.toFixed(1),
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "(",
              formatCurrency(parseFloat(sellPrice2) - parseFloat(buyPrice2)),
              " / unité)"
            ] })
          ] }),
          priceWarning2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.priceWarning, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 18 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: priceWarning2 })
          ] }),
          editProduct && priceHistory2.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.priceHistory, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.historyHeader, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(History, { size: 16 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Historique des Prix" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.historyList, children: priceHistory2.map((entry2, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.historyItem, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.historyItemInner, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.historyDate, children: new Date(entry2.date).toLocaleDateString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.historyPrices, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Ancien: ",
                  formatCurrency(entry2.oldPrice)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Nouveau: ",
                  formatCurrency(entry2.newPrice)
                ] })
              ] })
            ] }) }, idx)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.stockSection, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Stock Minimum (alerte)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                value: minStock,
                onChange: (e) => setMinStock(e.target.value),
                min: "0"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.fieldHint, children: "Alerte quand le stock descend sous ce niveau" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.summary, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Résumé du Produit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.summaryGrid, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Code-barres:" }),
              " ",
              barcode2
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "SKU:" }),
              " ",
              sku
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Désignation:" }),
              " ",
              designation
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Catégorie:" }),
              " ",
              selectedCategory?.icon,
              " ",
              selectedCategory?.name
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.stepButtons, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles$1.backBtn, onClick: () => setCurrentStep(2), children: "← Retour" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$1.resetBtn, onClick: handleReset, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 16 }),
            " Réinitialiser"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: styles$1.saveBtn,
              onClick: handleSave,
              disabled: !buyPrice2 || !sellPrice2 || parseFloat(sellPrice2) <= parseFloat(buyPrice2),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 18 }),
                " Enregistrer le Produit"
              ]
            }
          )
        ] })
      ] })
    ] })
  ] }) });
};
const inventoryHub = "_inventoryHub_7ahsp_5";
const header = "_header_7ahsp_26";
const headerLeft = "_headerLeft_7ahsp_35";
const headerIcon = "_headerIcon_7ahsp_41";
const headerActions = "_headerActions_7ahsp_63";
const exportBtn = "_exportBtn_7ahsp_80";
const importBtn = "_importBtn_7ahsp_81";
const addBtn = "_addBtn_7ahsp_92";
const dropdownContainer = "_dropdownContainer_7ahsp_103";
const dropdownMenu = "_dropdownMenu_7ahsp_107";
const statsRow = "_statsRow_7ahsp_167";
const statCard = "_statCard_7ahsp_174";
const warning = "_warning_7ahsp_191";
const danger = "_danger_7ahsp_196";
const statValue = "_statValue_7ahsp_201";
const statLabel = "_statLabel_7ahsp_208";
const tabsNav = "_tabsNav_7ahsp_218";
const tabBtn = "_tabBtn_7ahsp_229";
const active = "_active_7ahsp_250";
const badge = "_badge_7ahsp_256";
const tabContent = "_tabContent_7ahsp_274";
const overlay = "_overlay_7ahsp_306";
const importModal = "_importModal_7ahsp_317";
const modalHeader = "_modalHeader_7ahsp_339";
const modalBody = "_modalBody_7ahsp_369";
const importInfo = "_importInfo_7ahsp_375";
const mappingTable = "_mappingTable_7ahsp_384";
const mappingHeader = "_mappingHeader_7ahsp_390";
const mappingRow = "_mappingRow_7ahsp_402";
const columnName = "_columnName_7ahsp_415";
const sampleValue = "_sampleValue_7ahsp_420";
const modalFooter = "_modalFooter_7ahsp_448";
const confirmBtn = "_confirmBtn_7ahsp_470";
const styles = {
  inventoryHub,
  header,
  headerLeft,
  headerIcon,
  headerActions,
  exportBtn,
  importBtn,
  addBtn,
  dropdownContainer,
  dropdownMenu,
  statsRow,
  statCard,
  warning,
  danger,
  statValue,
  statLabel,
  tabsNav,
  tabBtn,
  active,
  badge,
  tabContent,
  overlay,
  importModal,
  modalHeader,
  modalBody,
  importInfo,
  mappingTable,
  mappingHeader,
  mappingRow,
  columnName,
  sampleValue,
  modalFooter,
  confirmBtn
};
const InventoryHub = () => {
  const [activeTab, setActiveTab] = reactExports.useState("products");
  const [showAddModal, setShowAddModal] = reactExports.useState(false);
  const [editProduct, setEditProduct] = reactExports.useState(null);
  const [showExportMenu, setShowExportMenu] = reactExports.useState(false);
  const [showImportMenu, setShowImportMenu] = reactExports.useState(false);
  const fileInputRef = reactExports.useRef(null);
  const { products, addProduct, getAllSKUs, getLowStockProducts, getOutOfStockProducts } = useProductsStore();
  const toast = useToast();
  const existingSKUs = getAllSKUs();
  const alertsCount = getLowStockProducts().length + getOutOfStockProducts().length;
  const getExportFilename = (extension) => {
    const date = /* @__PURE__ */ new Date();
    const dateStr = date.toISOString().split("T")[0].replace(/-/g, "");
    const timeStr = date.toTimeString().split(" ")[0].replace(/:/g, "");
    return `produits_${dateStr}_${timeStr}.${extension}`;
  };
  const handleExportCSV = () => {
    const headers = ["barcode", "sku", "name", "category", "brand", "purchasePrice", "sellingPrice", "stock", "minStock", "unit"];
    const csvRows = [headers.join(",")];
    products.forEach((p) => {
      const row = [
        `"${p.barcode || ""}"`,
        `"${p.sku || ""}"`,
        `"${p.name || ""}"`,
        `"${p.category || ""}"`,
        `"${p.brand || ""}"`,
        p.purchasePrice || 0,
        p.sellingPrice || 0,
        p.stock || 0,
        p.minStock || 0,
        `"${p.unit || "unité"}"`
      ];
      csvRows.push(row.join(","));
    });
    const csvContent = csvRows.join("\n");
    downloadFile(csvContent, getExportFilename("csv"), "text/csv;charset=utf-8");
    setShowExportMenu(false);
  };
  const handleExportExcel = () => {
    const headers = ["Code-barres", "SKU", "Nom", "Catégorie", "Marque", "Prix Achat", "Prix Vente", "Stock", "Stock Min", "Unité"];
    const tsvRows = [headers.join("	")];
    products.forEach((p) => {
      const row = [
        p.barcode || "",
        p.sku || "",
        p.name || "",
        p.category || "",
        p.brand || "",
        p.purchasePrice || 0,
        p.sellingPrice || 0,
        p.stock || 0,
        p.minStock || 0,
        p.unit || "unité"
      ];
      tsvRows.push(row.join("	"));
    });
    const tsvContent = tsvRows.join("\n");
    downloadFile(tsvContent, getExportFilename("xls"), "application/vnd.ms-excel;charset=utf-8");
    setShowExportMenu(false);
  };
  const handleExportJSON = () => {
    const exportData = products.map((p) => ({
      barcode: p.barcode,
      sku: p.sku,
      name: p.name,
      category: p.category,
      brand: p.brand,
      purchasePrice: p.purchasePrice,
      sellingPrice: p.sellingPrice,
      stock: p.stock,
      minStock: p.minStock,
      unit: p.unit,
      emoji: p.emoji
    }));
    const jsonContent = JSON.stringify(exportData, null, 2);
    downloadFile(jsonContent, getExportFilename("json"), "application/json;charset=utf-8");
    setShowExportMenu(false);
  };
  const downloadFile = (content2, filename, type) => {
    const blob = new Blob([content2], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const [showImportModal, setShowImportModal] = reactExports.useState(false);
  const [importData, setImportData] = reactExports.useState({ headers: [], rows: [] });
  const [columnMapping, setColumnMapping] = reactExports.useState({});
  const targetFields = [
    { key: "barcode", label: "Code-barres" },
    { key: "sku", label: "SKU" },
    { key: "name", label: "Nom du produit" },
    { key: "category", label: "Catégorie" },
    { key: "brand", label: "Marque" },
    { key: "purchasePrice", label: "Prix d'achat" },
    { key: "sellingPrice", label: "Prix de vente" },
    { key: "stock", label: "Stock" },
    { key: "minStock", label: "Stock minimum" },
    { key: "unit", label: "Unité" },
    { key: "emoji", label: "Emoji" },
    { key: "", label: "-- Ignorer --" }
  ];
  const handleImportClick = (format) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = format === "csv" ? ".csv" : ".json";
      fileInputRef.current.dataset.format = format;
      fileInputRef.current.click();
    }
    setShowImportMenu(false);
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const format = e.target.dataset.format || "csv";
    const reader = new FileReader();
    reader.onload = (event) => {
      const content2 = event.target?.result;
      try {
        if (format === "json") {
          const jsonData = JSON.parse(content2);
          if (Array.isArray(jsonData) && jsonData.length > 0) {
            const importedProducts = jsonData.map((p) => ({
              ...p,
              id: crypto.randomUUID(),
              isActive: true,
              isFavorite: false,
              priceHistory: []
            }));
            importedProducts.forEach((p) => addProduct(p));
            toast.success(`${jsonData.length} produits importés avec succès!`);
          } else {
            toast.warning("Le fichier JSON doit contenir un tableau de produits");
          }
        } else if (format === "csv") {
          const lines = content2.split("\n").filter((l) => l.trim());
          if (lines.length < 2) {
            toast.warning("Le fichier CSV doit contenir une ligne d'en-tête et une ligne de données");
            return;
          }
          const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim());
          const rows = lines.slice(1).map(
            (line) => line.split(",").map((v) => v.replace(/"/g, "").trim())
          );
          const autoMapping = {};
          headers.forEach((header2, index) => {
            const lowerHeader = header2.toLowerCase();
            if (lowerHeader.includes("code") || lowerHeader.includes("barcode") || lowerHeader.includes("ean")) {
              autoMapping[index.toString()] = "barcode";
            } else if (lowerHeader === "sku" || lowerHeader.includes("reference")) {
              autoMapping[index.toString()] = "sku";
            } else if (lowerHeader.includes("nom") || lowerHeader === "name" || lowerHeader.includes("product") || lowerHeader.includes("désignation")) {
              autoMapping[index.toString()] = "name";
            } else if (lowerHeader.includes("categ") || lowerHeader === "category") {
              autoMapping[index.toString()] = "category";
            } else if (lowerHeader.includes("marque") || lowerHeader === "brand") {
              autoMapping[index.toString()] = "brand";
            } else if (lowerHeader.includes("achat") || lowerHeader.includes("purchase") || lowerHeader.includes("cost")) {
              autoMapping[index.toString()] = "purchasePrice";
            } else if (lowerHeader.includes("vente") || lowerHeader.includes("sell") || lowerHeader.includes("price") || lowerHeader.includes("prix")) {
              autoMapping[index.toString()] = "sellingPrice";
            } else if (lowerHeader.includes("stock") || lowerHeader.includes("qty") || lowerHeader.includes("quantité")) {
              autoMapping[index.toString()] = "stock";
            } else if (lowerHeader.includes("min") || lowerHeader.includes("seuil")) {
              autoMapping[index.toString()] = "minStock";
            } else if (lowerHeader.includes("unit") || lowerHeader.includes("unité")) {
              autoMapping[index.toString()] = "unit";
            }
          });
          setImportData({ headers, rows });
          setColumnMapping(autoMapping);
          setShowImportModal(true);
        }
      } catch (error) {
        console.error("Import error:", error);
        toast.error("Erreur lors de la lecture du fichier");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };
  const handleConfirmImport = () => {
    const importedProducts = [];
    importData.rows.forEach((row) => {
      const product = {
        id: crypto.randomUUID(),
        isActive: true,
        isFavorite: false,
        priceHistory: []
      };
      Object.entries(columnMapping).forEach(([colIndexStr, fieldKey]) => {
        if (!fieldKey) return;
        const colIndex = parseInt(colIndexStr);
        const value = row[colIndex];
        if (value === void 0 || value === "") return;
        switch (fieldKey) {
          case "barcode":
            product.barcode = value;
            break;
          case "sku":
            product.sku = value;
            break;
          case "name":
            product.name = value;
            break;
          case "category":
            product.category = value;
            break;
          case "brand":
            product.brand = value;
            break;
          case "purchasePrice":
            product.purchasePrice = parseFloat(value) || 0;
            break;
          case "sellingPrice":
            product.sellingPrice = parseFloat(value) || 0;
            break;
          case "stock":
            product.stock = parseInt(value) || 0;
            break;
          case "minStock":
            product.minStock = parseInt(value) || 0;
            break;
          case "unit":
            product.unit = value;
            break;
          case "emoji":
            product.emoji = value;
            break;
        }
      });
      if (product.name || product.barcode) {
        importedProducts.push(product);
      }
    });
    if (importedProducts.length > 0) {
      importedProducts.forEach((p) => addProduct(p));
      toast.success(`${importedProducts.length} produits importés avec succès!`);
      setShowImportModal(false);
      setImportData({ headers: [], rows: [] });
      setColumnMapping({});
    } else {
      toast.warning("Aucun produit valide trouvé. Vérifiez le mapping.");
    }
  };
  const handleAddProduct = (productData) => {
    addProduct({
      barcode: productData.barcode || "",
      sku: productData.sku || "",
      name: productData.designation || productData.nature || "Nouveau Produit",
      designation: productData.designation || "",
      emoji: getCategoryEmoji(productData.categoryId),
      brand: productData.brand || "",
      nature: productData.nature || "",
      category: getCategoryName(productData.categoryId),
      categoryId: productData.categoryId || "",
      subcategoryId: productData.subcategoryId || "",
      purchasePrice: productData.buyPrice || 0,
      sellingPrice: productData.sellPrice || 0,
      buyPrice: productData.buyPrice || 0,
      sellPrice: productData.sellPrice || 0,
      stock: productData.stock || 0,
      minStock: productData.minStock || 10,
      unit: productData.unit || "unité",
      quantity: productData.quantity || 1,
      isActive: true,
      isFavorite: false,
      unitsPerPack: 1,
      productType: "standard",
      priceHistory: []
    });
  };
  const getCategoryName = (categoryId) => {
    const categoryMap = {
      "beverages": "Boissons",
      "dairy": "Produits laitiers",
      "grocery": "Épicerie",
      "biscuits": "Biscuiterie",
      "fruits": "Fruits & Légumes",
      "meat": "Viandes",
      "frozen": "Surgélés",
      "hygiene": "Hygiène",
      "cleaning": "Entretien"
    };
    return categoryMap[categoryId || ""] || "Épicerie";
  };
  const getCategoryEmoji = (categoryId) => {
    const emojiMap = {
      "beverages": "🥤",
      "dairy": "🥛",
      "grocery": "🛒",
      "biscuits": "🍪",
      "fruits": "🍎",
      "meat": "🥩",
      "frozen": "❄️",
      "hygiene": "🧴",
      "cleaning": "🧹"
    };
    return emojiMap[categoryId || ""] || "📦";
  };
  const tabs = [
    { id: "products", label: "Produits", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 20 }), component: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductsList, {}) },
    { id: "bundles", label: "Packs", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 20 }), component: /* @__PURE__ */ jsxRuntimeExports.jsx(BundleManagement, {}) },
    { id: "receipt", label: "Bon d'Entrée", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 20 }), component: /* @__PURE__ */ jsxRuntimeExports.jsx(GoodsReceipt, {}) },
    { id: "alerts", label: "Alertes", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 20 }), badge: alertsCount, component: /* @__PURE__ */ jsxRuntimeExports.jsx(StockAlerts, {}) },
    { id: "categories", label: "Catégories", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 20 }), component: /* @__PURE__ */ jsxRuntimeExports.jsx(Categories, {}) },
    { id: "movements", label: "Mouvements", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 20 }), component: /* @__PURE__ */ jsxRuntimeExports.jsx(StockMovements, {}) },
    { id: "physical", label: "Inventaire", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 20 }), component: /* @__PURE__ */ jsxRuntimeExports.jsx(PhysicalInventory, {}) }
  ];
  const activeTabData = tabs.find((t) => t.id === activeTab);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.inventoryHub, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.header, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.headerLeft, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { size: 32, className: styles.headerIcon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Gestion des Stocks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Inventaire et suivi des produits" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.headerActions, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "file",
            ref: fileInputRef,
            style: { display: "none" },
            onChange: handleFileChange
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.dropdownContainer, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: styles.exportBtn,
              onClick: () => setShowExportMenu(!showExportMenu),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 18 }),
                " Exporter"
              ]
            }
          ),
          showExportMenu && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.dropdownMenu, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleExportCSV, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 16 }),
              " CSV"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleExportExcel, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { size: 16 }),
              " Excel"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleExportJSON, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileBraces, { size: 16 }),
              " JSON"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.dropdownContainer, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: styles.importBtn,
              onClick: () => setShowImportMenu(!showImportMenu),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 18 }),
                " Importer"
              ]
            }
          ),
          showImportMenu && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.dropdownMenu, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleImportClick("csv"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 16 }),
              " CSV"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleImportClick("json"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileBraces, { size: 16 }),
              " JSON"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.addBtn, onClick: () => setShowAddModal(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
          " Nouveau produit"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.statsRow, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.statCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statValue, children: products.length.toLocaleString("fr-FR") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statLabel, children: "Produits totaux" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.statCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statValue, children: products.reduce((sum, p) => sum + p.stock, 0).toLocaleString("fr-FR") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statLabel, children: "Unités en stock" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles.statCard} ${styles.warning}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statValue, children: alertsCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statLabel, children: "Alertes stock bas" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles.statCard} ${styles.danger}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statValue, children: getOutOfStockProducts().length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statLabel, children: "Ruptures de stock" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.tabsNav, children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: `${styles.tabBtn} ${activeTab === tab.id ? styles.active : ""}`,
        onClick: () => setActiveTab(tab.id),
        children: [
          tab.icon,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tab.label }),
          tab.badge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.badge, children: tab.badge })
        ]
      },
      tab.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.tabContent, children: activeTabData?.component }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddProductModal,
      {
        isOpen: showAddModal,
        onClose: () => {
          setShowAddModal(false);
          setEditProduct(null);
        },
        onSave: handleAddProduct,
        existingSKUs,
        editProduct
      }
    ),
    showImportModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.overlay, onClick: () => setShowImportModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.importModal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "📥 Mapper les colonnes d'import" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowImportModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: styles.importInfo, children: [
          importData.rows.length,
          " lignes détectées. Associez chaque colonne à un champ produit."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.mappingTable, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.mappingHeader, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Colonne du fichier" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Exemple" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Mapper vers" })
          ] }),
          importData.headers.map((header2, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.mappingRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.columnName, children: header2 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.sampleValue, children: importData.rows[0]?.[index] || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                value: columnMapping[index.toString()] || "",
                onChange: (e) => setColumnMapping((prev) => ({
                  ...prev,
                  [index.toString()]: e.target.value
                })),
                children: targetFields.map((field) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: field.key, children: field.label }, field.key))
              }
            )
          ] }, index))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowImportModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.confirmBtn, onClick: handleConfirmImport, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 18 }),
          " Importer ",
          importData.rows.length,
          " produits"
        ] })
      ] })
    ] }) })
  ] });
};
export {
  InventoryHub as Inventory,
  InventoryHub,
  InventoryHub as default
};

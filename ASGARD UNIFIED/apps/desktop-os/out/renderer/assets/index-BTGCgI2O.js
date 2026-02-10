import { j as jsxRuntimeExports } from "./vendor-state-DFI86SKa.js";
import { r as reactExports } from "./vendor-react-Df__x13C.js";
import { u as useSettings, i as usePurchasesStore, f as useToast, c as useProductsStore } from "./index-BbOgUw3k.js";
import { C as ConfirmModal } from "./ConfirmModal-IjhJ8y4D.js";
import { r as Search, a0 as UserPlus, k as Truck, _ as CreditCard, aM as Phone, aO as MapPin, a5 as Eye, aC as SquarePen, v as Trash2, X, aN as Mail, Y as Activity, F as FileText, at as ShoppingBag, aD as Save, af as Plus, P as Package, l as Printer, i as ShoppingCart, a as CircleCheckBig, C as CircleAlert, e as Clock, aT as Funnel, w as Calendar, s as TrendingUp, Z as Zap } from "./vendor-ui-DiXyqbDT.js";
import { R as ResponsiveContainer, T as Tooltip, j as Label } from "./CategoricalChart-BNQNLo93.js";
import { A as AreaChart, C as CartesianGrid, X as XAxis, Y as YAxis, a as Area } from "./AreaChart-D_YS4Ytt.js";
import { R as ReferenceLine } from "./ReferenceLine-kLWu0j86.js";
import "./vendor-i18n-DeCNyroL.js";
const suppliersList = "_suppliersList_1roqk_1";
const toolbar$2 = "_toolbar_1roqk_5";
const searchBox$2 = "_searchBox_1roqk_13";
const resultsCount = "_resultsCount_1roqk_34";
const grid = "_grid_1roqk_39";
const supplierCard = "_supplierCard_1roqk_45";
const cardHeader = "_cardHeader_1roqk_59";
const avatar = "_avatar_1roqk_66";
const debtIndicator = "_debtIndicator_1roqk_77";
const supplierName = "_supplierName_1roqk_84";
const contactInfo = "_contactInfo_1roqk_90";
const statsGrid = "_statsGrid_1roqk_105";
const statValue$2 = "_statValue_1roqk_115";
const statLabel$2 = "_statLabel_1roqk_122";
const debtAlert = "_debtAlert_1roqk_130";
const cardActions = "_cardActions_1roqk_141";
const overlay$2 = "_overlay_1roqk_169";
const modal$1 = "_modal_1roqk_185";
const modalHeader$2 = "_modalHeader_1roqk_208";
const modalProfile = "_modalProfile_1roqk_217";
const modalAvatar = "_modalAvatar_1roqk_223";
const cityTag = "_cityTag_1roqk_239";
const closeBtn = "_closeBtn_1roqk_249";
const modalBody$2 = "_modalBody_1roqk_256";
const infoSection = "_infoSection_1roqk_260";
const infoGrid = "_infoGrid_1roqk_271";
const statsSection = "_statsSection_1roqk_285";
const statBox = "_statBox_1roqk_292";
const statBoxValue = "_statBoxValue_1roqk_308";
const statBoxLabel = "_statBoxLabel_1roqk_313";
const alertStat = "_alertStat_1roqk_318";
const recentActivity = "_recentActivity_1roqk_327";
const emptyActivity = "_emptyActivity_1roqk_334";
const addBtn = "_addBtn_1roqk_345";
const deleteBtn = "_deleteBtn_1roqk_366";
const formGroup$1 = "_formGroup_1roqk_379";
const formRow$1 = "_formRow_1roqk_407";
const modalFooter$1 = "_modalFooter_1roqk_414";
const confirmBtn$1 = "_confirmBtn_1roqk_436";
const styles$3 = {
  suppliersList,
  toolbar: toolbar$2,
  searchBox: searchBox$2,
  resultsCount,
  grid,
  supplierCard,
  cardHeader,
  avatar,
  debtIndicator,
  supplierName,
  contactInfo,
  statsGrid,
  statValue: statValue$2,
  statLabel: statLabel$2,
  debtAlert,
  cardActions,
  overlay: overlay$2,
  modal: modal$1,
  modalHeader: modalHeader$2,
  modalProfile,
  modalAvatar,
  cityTag,
  closeBtn,
  modalBody: modalBody$2,
  infoSection,
  infoGrid,
  statsSection,
  statBox,
  statBoxValue,
  statBoxLabel,
  alertStat,
  recentActivity,
  emptyActivity,
  addBtn,
  deleteBtn,
  formGroup: formGroup$1,
  formRow: formRow$1,
  modalFooter: modalFooter$1,
  confirmBtn: confirmBtn$1
};
const SuppliersList = () => {
  const { formatCurrency } = useSettings();
  const { suppliers, goodsReceipts, addSupplier, updateSupplier, deleteSupplier } = usePurchasesStore();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [showViewModal, setShowViewModal] = reactExports.useState(false);
  const [showEditModal, setShowEditModal] = reactExports.useState(false);
  const [selectedSupplier, setSelectedSupplier] = reactExports.useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = reactExports.useState(false);
  const [supplierToDelete, setSupplierToDelete] = reactExports.useState(null);
  const [formData, setFormData] = reactExports.useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    ice: "",
    nif: ""
  });
  const filteredSuppliers = suppliers.filter(
    (s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.phone.includes(searchQuery) || s.city && s.city.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const getSupplierStats = (supplierId) => {
    const supplierReceipts = goodsReceipts.filter((r) => r.supplierId === supplierId);
    const totalPurchased = supplierReceipts.reduce((sum, r) => sum + r.total, 0);
    const unpaidAmount = supplierReceipts.filter((r) => !r.isPaid).reduce((sum, r) => sum + r.total, 0);
    return {
      receiptCount: supplierReceipts.length,
      totalPurchased,
      unpaidAmount
    };
  };
  const handleViewSupplier = (supplier2) => {
    setSelectedSupplier(supplier2);
    setShowViewModal(true);
  };
  const handleEditSupplier = (supplier2) => {
    setSelectedSupplier(supplier2);
    setFormData({
      name: supplier2.name,
      phone: supplier2.phone,
      email: supplier2.email || "",
      address: supplier2.address || "",
      city: supplier2.city || "",
      ice: supplier2.ice || "",
      nif: supplier2.nif || ""
    });
    setShowEditModal(true);
  };
  const handleNewSupplier = () => {
    setSelectedSupplier(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      ice: "",
      nif: ""
    });
    setShowEditModal(true);
  };
  const handleSaveSupplier = () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.warning("Le nom et le téléphone sont obligatoires");
      return;
    }
    if (selectedSupplier) {
      updateSupplier(selectedSupplier.id, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || void 0,
        address: formData.address || void 0,
        city: formData.city || void 0,
        ice: formData.ice || void 0,
        nif: formData.nif || void 0
      });
      toast.success(`Fournisseur "${formData.name}" modifié avec succès`);
    } else {
      addSupplier({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || void 0,
        address: formData.address || void 0,
        city: formData.city || void 0,
        ice: formData.ice || void 0,
        nif: formData.nif || void 0
      });
      toast.success(`Fournisseur "${formData.name}" ajouté avec succès`);
    }
    setShowEditModal(false);
    setSelectedSupplier(null);
  };
  const handleDeleteSupplier = (supplier2) => {
    const stats = getSupplierStats(supplier2.id);
    if (stats.unpaidAmount > 0) {
      toast.warning(`Ce fournisseur a une dette de ${formatCurrency(stats.unpaidAmount)}. Réglez d'abord les paiements.`);
      return;
    }
    setSupplierToDelete(supplier2);
    setShowDeleteConfirm(true);
  };
  const confirmDelete = () => {
    if (supplierToDelete) {
      deleteSupplier(supplierToDelete.id);
      toast.success(`Fournisseur "${supplierToDelete.name}" supprimé`);
    }
    setShowDeleteConfirm(false);
    setSupplierToDelete(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.suppliersList, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.toolbar, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.searchBox, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Rechercher par nom, téléphone ou ville...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$3.addBtn, onClick: handleNewSupplier, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { size: 18 }),
        " Nouveau fournisseur"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$3.resultsCount, children: [
      filteredSuppliers.length,
      " fournisseurs"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.grid, children: filteredSuppliers.map((supplier2) => {
      const stats = getSupplierStats(supplier2.id);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.supplierCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.cardHeader, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.avatar, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 24 }) }),
          stats.unpaidAmount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.debtIndicator, title: "Dette en cours", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 14 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: styles$3.supplierName, children: supplier2.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.contactInfo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 12 }),
            " ",
            supplier2.phone
          ] }),
          supplier2.city && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 12 }),
            " ",
            supplier2.city
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.statsGrid, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statValue, children: stats.receiptCount }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statLabel, children: "Bons" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statValue, children: formatCurrency(stats.totalPurchased) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statLabel, children: "Total achats" })
          ] })
        ] }),
        stats.unpaidAmount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.debtAlert, children: [
          "Dette: ",
          formatCurrency(stats.unpaidAmount)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.cardActions, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleViewSupplier(supplier2), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 14 }),
            " Voir"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleEditSupplier(supplier2), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { size: 14 }),
            " Modifier"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles$3.deleteBtn, onClick: () => handleDeleteSupplier(supplier2), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }) })
        ] })
      ] }, supplier2.id);
    }) }),
    showViewModal && selectedSupplier && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.overlay, onClick: () => setShowViewModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalProfile, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.modalAvatar, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 32 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: selectedSupplier.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.cityTag, children: selectedSupplier.city || "Ville non spécifiée" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles$3.closeBtn, onClick: () => setShowViewModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.infoSection, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Informations de contact" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.infoGrid, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 14 }),
              " ",
              selectedSupplier.phone
            ] }),
            selectedSupplier.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 14 }),
              " ",
              selectedSupplier.email
            ] }),
            selectedSupplier.address && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14 }),
              " ",
              selectedSupplier.address
            ] }),
            selectedSupplier.ice && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14 }),
              " ICE: ",
              selectedSupplier.ice
            ] }),
            selectedSupplier.nif && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 14 }),
              " NIF: ",
              selectedSupplier.nif
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.statsSection, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.statBox, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 20 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statBoxValue, children: getSupplierStats(selectedSupplier.id).receiptCount }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statBoxLabel, children: "Réceptions" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.statBox, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 20 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statBoxValue, children: formatCurrency(getSupplierStats(selectedSupplier.id).totalPurchased) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statBoxLabel, children: "Montant global" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$3.statBox} ${getSupplierStats(selectedSupplier.id).unpaidAmount > 0 ? styles$3.alertStat : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 20 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statBoxValue, children: formatCurrency(getSupplierStats(selectedSupplier.id).unpaidAmount) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statBoxLabel, children: "Reliquat / Dette" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.recentActivity, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Activité récente" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.emptyActivity, children: "Consultez l'historique des bons dans l'onglet des commandes." })
        ] })
      ] })
    ] }) }),
    showEditModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.overlay, onClick: () => setShowEditModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: selectedSupplier ? "Modifier le fournisseur" : "Nouveau fournisseur" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles$3.closeBtn, onClick: () => setShowEditModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.formGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Nom du fournisseur *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: formData.name,
              onChange: (e) => setFormData({ ...formData, name: e.target.value }),
              placeholder: "Ex: SARL Distrib Plus"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.formGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Téléphone *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "tel",
              value: formData.phone,
              onChange: (e) => setFormData({ ...formData, phone: e.target.value }),
              placeholder: "Ex: 0555123456"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.formGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "email",
              value: formData.email,
              onChange: (e) => setFormData({ ...formData, email: e.target.value }),
              placeholder: "Ex: contact@fournisseur.dz"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.formRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Adresse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: formData.address,
                onChange: (e) => setFormData({ ...formData, address: e.target.value }),
                placeholder: "Ex: Zone Industrielle"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Ville" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: formData.city,
                onChange: (e) => setFormData({ ...formData, city: e.target.value }),
                placeholder: "Ex: Alger"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.formRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "ICE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: formData.ice,
                onChange: (e) => setFormData({ ...formData, ice: e.target.value }),
                placeholder: "Ex: 001234567890123"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "NIF" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: formData.nif,
                onChange: (e) => setFormData({ ...formData, nif: e.target.value }),
                placeholder: "Ex: 19801234567890"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowEditModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$3.confirmBtn, onClick: handleSaveSupplier, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 18 }),
          " ",
          selectedSupplier ? "Enregistrer" : "Créer le fournisseur"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmModal,
      {
        isOpen: showDeleteConfirm,
        title: "Supprimer le fournisseur",
        message: `Êtes-vous sûr de vouloir supprimer "${supplierToDelete?.name}" ? Cette action est irréversible.`,
        confirmText: "Supprimer",
        cancelText: "Annuler",
        variant: "danger",
        onConfirm: confirmDelete,
        onCancel: () => setShowDeleteConfirm(false)
      }
    )
  ] });
};
const purchaseOrders = "_purchaseOrders_1son8_3";
const toolbar$1 = "_toolbar_1son8_10";
const searchBox$1 = "_searchBox_1son8_16";
const filters$1 = "_filters_1son8_40";
const newBtn = "_newBtn_1son8_49";
const ordersTable = "_ordersTable_1son8_69";
const tableHeader = "_tableHeader_1son8_76";
const tableRow = "_tableRow_1son8_87";
const emptyTable = "_emptyTable_1son8_100";
const orderNumber = "_orderNumber_1son8_111";
const supplier = "_supplier_1son8_117";
const total = "_total_1son8_124";
const statusBadge = "_statusBadge_1son8_129";
const draft = "_draft_1son8_139";
const sent = "_sent_1son8_144";
const partial = "_partial_1son8_149";
const complete = "_complete_1son8_154";
const cancelled = "_cancelled_1son8_159";
const actions$1 = "_actions_1son8_164";
const overlay$1 = "_overlay_1son8_184";
const modalHeader$1 = "_modalHeader_1son8_202";
const modalBody$1 = "_modalBody_1son8_210";
const formGroup = "_formGroup_1son8_214";
const formRow = "_formRow_1son8_233";
const modalFooter = "_modalFooter_1son8_244";
const confirmBtn = "_confirmBtn_1son8_258";
const modalLarge = "_modalLarge_1son8_274";
const orderSupplier = "_orderSupplier_1son8_305";
const formSection = "_formSection_1son8_313";
const productSection = "_productSection_1son8_320";
const productSearchBox = "_productSearchBox_1son8_333";
const productResults = "_productResults_1son8_355";
const productResult = "_productResult_1son8_355";
const productEmoji = "_productEmoji_1son8_381";
const productInfo = "_productInfo_1son8_385";
const productName = "_productName_1son8_389";
const productMeta = "_productMeta_1son8_395";
const orderItemsSection = "_orderItemsSection_1son8_402";
const emptyItems = "_emptyItems_1son8_412";
const itemsList$1 = "_itemsList_1son8_426";
const orderItem = "_orderItem_1son8_402";
const itemEmoji = "_itemEmoji_1son8_442";
const itemInfo = "_itemInfo_1son8_447";
const itemName = "_itemName_1son8_451";
const itemBarcode = "_itemBarcode_1son8_460";
const itemQty = "_itemQty_1son8_467";
const itemPrice = "_itemPrice_1son8_468";
const itemTotal = "_itemTotal_1son8_490";
const itemQtyDisplay = "_itemQtyDisplay_1son8_496";
const removeItemBtn = "_removeItemBtn_1son8_501";
const orderSummary = "_orderSummary_1son8_516";
const summaryRow = "_summaryRow_1son8_522";
const summaryTotal = "_summaryTotal_1son8_530";
const orderMeta = "_orderMeta_1son8_540";
const metaLabel = "_metaLabel_1son8_550";
const metaValue = "_metaValue_1son8_558";
const printBtn = "_printBtn_1son8_564";
const styles$2 = {
  purchaseOrders,
  toolbar: toolbar$1,
  searchBox: searchBox$1,
  filters: filters$1,
  newBtn,
  ordersTable,
  tableHeader,
  tableRow,
  emptyTable,
  orderNumber,
  supplier,
  total,
  statusBadge,
  draft,
  sent,
  partial,
  complete,
  cancelled,
  actions: actions$1,
  overlay: overlay$1,
  modalHeader: modalHeader$1,
  modalBody: modalBody$1,
  formGroup,
  formRow,
  modalFooter,
  confirmBtn,
  modalLarge,
  orderSupplier,
  formSection,
  productSection,
  productSearchBox,
  productResults,
  productResult,
  productEmoji,
  productInfo,
  productName,
  productMeta,
  orderItemsSection,
  emptyItems,
  itemsList: itemsList$1,
  orderItem,
  itemEmoji,
  itemInfo,
  itemName,
  itemBarcode,
  itemQty,
  itemPrice,
  itemTotal,
  itemQtyDisplay,
  removeItemBtn,
  orderSummary,
  summaryRow,
  summaryTotal,
  orderMeta,
  metaLabel,
  metaValue,
  printBtn
};
const PurchaseOrders = () => {
  const { formatCurrency } = useSettings();
  const { purchaseOrders: purchaseOrders2, suppliers, addPurchaseOrder, updatePurchaseOrder } = usePurchasesStore();
  const { products } = useProductsStore();
  const toast = useToast();
  const [showNewModal, setShowNewModal] = reactExports.useState(false);
  const [showDetailModal, setShowDetailModal] = reactExports.useState(false);
  const [selectedOrder, setSelectedOrder] = reactExports.useState(null);
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [newOrderSupplierId, setNewOrderSupplierId] = reactExports.useState("");
  const [newOrderDate, setNewOrderDate] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const [newOrderExpectedDate, setNewOrderExpectedDate] = reactExports.useState("");
  const [orderItems, setOrderItems] = reactExports.useState([]);
  const [productSearch, setProductSearch] = reactExports.useState("");
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date2 = new Date(dateStr);
    return date2.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  };
  const getStatusBadge = (status2) => {
    const config = {
      draft: { label: "Brouillon", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 12 }), class: styles$2.draft },
      sent: { label: "Envoyé", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12 }), class: styles$2.sent },
      partial: { label: "Partiel", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 12 }), class: styles$2.partial },
      complete: { label: "Complet", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 12 }), class: styles$2.complete },
      cancelled: { label: "Annulé", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 }), class: styles$2.cancelled }
    };
    const item = config[status2] || config.draft;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `${styles$2.statusBadge} ${item.class}`, children: [
      item.icon,
      " ",
      item.label
    ] });
  };
  const filteredOrders = reactExports.useMemo(
    () => purchaseOrders2.filter(
      (o) => (filterStatus === "all" || o.status === filterStatus) && (o.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) || o.supplierName.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
    [purchaseOrders2, filterStatus, searchQuery]
  );
  const filteredProducts = reactExports.useMemo(() => {
    if (!productSearch) return [];
    return products.filter(
      (p) => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.barcode.includes(productSearch) || p.sku.includes(productSearch)
    ).slice(0, 10);
  }, [products, productSearch]);
  const addProductToOrder = (product) => {
    if (orderItems.some((item) => item.productId === product.id)) {
      toast.warning("Ce produit est déjà dans la commande");
      return;
    }
    const newItem = {
      id: `item_${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productBarcode: product.barcode,
      productEmoji: product.emoji,
      orderedQty: 1,
      receivedQty: 0,
      purchasePrice: product.purchasePrice,
      total: product.purchasePrice,
      unit: product.unit
    };
    setOrderItems([...orderItems, newItem]);
    setProductSearch("");
  };
  const updateItemQty = (itemId, qty) => {
    setOrderItems(orderItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, orderedQty: qty, total: qty * item.purchasePrice };
      }
      return item;
    }));
  };
  const updateItemPrice = (itemId, price) => {
    setOrderItems(orderItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, purchasePrice: price, total: item.orderedQty * price };
      }
      return item;
    }));
  };
  const removeItem = (itemId) => {
    setOrderItems(orderItems.filter((item) => item.id !== itemId));
  };
  const orderSubtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  const orderTax = Math.round(orderSubtotal * 0.19);
  const orderTotal = orderSubtotal + orderTax;
  const handleCreateOrder = () => {
    const supplier2 = suppliers.find((s) => s.id === newOrderSupplierId);
    if (!supplier2) {
      toast.warning("Veuillez sélectionner un fournisseur");
      return;
    }
    if (orderItems.length === 0) {
      toast.warning("Ajoutez au moins un produit à la commande");
      return;
    }
    addPurchaseOrder({
      supplierId: supplier2.id,
      supplierName: supplier2.name,
      date: newOrderDate,
      expectedDate: newOrderExpectedDate || newOrderDate,
      status: "draft",
      items: orderItems,
      subtotal: orderSubtotal,
      taxAmount: orderTax,
      total: orderTotal
    });
    setShowNewModal(false);
    setNewOrderSupplierId("");
    setNewOrderExpectedDate("");
    setOrderItems([]);
    toast.success(`Bon de commande créé pour ${supplier2.name}`);
  };
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };
  const handleSendOrder = (orderId) => {
    updatePurchaseOrder(orderId, { status: "sent" });
    toast.success("Commande envoyée au fournisseur");
    setShowDetailModal(false);
  };
  const handlePrintOrder = (order) => {
    toast.info(`Impression de la commande ${order.poNumber}...`);
    window.print();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.purchaseOrders, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.toolbar, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.searchBox, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Rechercher par N° ou fournisseur...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.filters, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "Tous les statuts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "draft", children: "Brouillon" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "sent", children: "Envoyé" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "partial", children: "Partiel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "complete", children: "Complet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "cancelled", children: "Annulé" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$2.newBtn, onClick: () => setShowNewModal(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
        " Nouvelle commande"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.ordersTable, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.tableHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "N° Commande" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Fournisseur" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Date prévue" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Articles" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Statut" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Actions" })
      ] }),
      filteredOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.emptyTable, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 48 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Aucune commande trouvée" })
      ] }) : filteredOrders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.tableRow, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.orderNumber, children: order.poNumber }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$2.supplier, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 14 }),
          " ",
          order.supplierName
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDate(order.date) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDate(order.expectedDate) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 14 }),
          " ",
          order.items.length
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.total, children: formatCurrency(order.total) }),
        getStatusBadge(order.status),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.actions, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { title: "Voir", onClick: () => handleViewOrder(order), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { title: "Imprimer", onClick: () => handlePrintOrder(order), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 16 }) })
        ] })
      ] }, order.id))
    ] }),
    showNewModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.overlay, onClick: () => setShowNewModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.modalLarge, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 20 }),
          " Nouvelle commande (Bon de Commande)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowNewModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.formSection, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Fournisseur *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: newOrderSupplierId,
                onChange: (e) => setNewOrderSupplierId(e.target.value),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Sélectionner un fournisseur..." }),
                  suppliers.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.id, children: s.name }, s.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.formRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.formGroup, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Date de commande" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "date",
                  value: newOrderDate,
                  onChange: (e) => setNewOrderDate(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.formGroup, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Date de livraison prévue" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "date",
                  value: newOrderExpectedDate,
                  onChange: (e) => setNewOrderExpectedDate(e.target.value)
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.productSection, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 18 }),
            " Ajouter des produits"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.productSearchBox, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                placeholder: "Rechercher un produit par nom, code-barres ou SKU...",
                value: productSearch,
                onChange: (e) => setProductSearch(e.target.value)
              }
            )
          ] }),
          productSearch && filteredProducts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.productResults, children: filteredProducts.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: styles$2.productResult,
              onClick: () => addProductToOrder(product),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.productEmoji, children: product.emoji }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.productInfo, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.productName, children: product.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$2.productMeta, children: [
                    "SKU: ",
                    product.sku,
                    " | Stock: ",
                    product.stock,
                    " | ",
                    formatCurrency(product.purchasePrice)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 20 })
              ]
            },
            product.id
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.orderItemsSection, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { children: [
            "Articles commandés (",
            orderItems.length,
            ")"
          ] }),
          orderItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.emptyItems, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 32 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Recherchez et ajoutez des produits à la commande" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.itemsList, children: orderItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.orderItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.itemEmoji, children: item.productEmoji }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.itemInfo, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.itemName, children: item.productName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.itemBarcode, children: item.productBarcode })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.itemQty, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Qté" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  value: item.orderedQty,
                  onChange: (e) => updateItemQty(item.id, parseInt(e.target.value) || 1),
                  min: "1"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.itemPrice, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Prix achat" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  value: item.purchasePrice,
                  onChange: (e) => updateItemPrice(item.id, parseFloat(e.target.value) || 0)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.itemTotal, children: formatCurrency(item.total) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles$2.removeItemBtn, onClick: () => removeItem(item.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 }) })
          ] }, item.id)) })
        ] }),
        orderItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.orderSummary, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.summaryRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sous-total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCurrency(orderSubtotal) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.summaryRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "TVA (19%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCurrency(orderTax) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$2.summaryRow} ${styles$2.summaryTotal}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCurrency(orderTotal) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowNewModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: styles$2.confirmBtn,
            onClick: handleCreateOrder,
            disabled: !newOrderSupplierId || orderItems.length === 0,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 18 }),
              " Créer la commande"
            ]
          }
        )
      ] })
    ] }) }),
    showDetailModal && selectedOrder && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.overlay, onClick: () => setShowDetailModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.modalLarge, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: selectedOrder.poNumber }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.orderSupplier, children: selectedOrder.supplierName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowDetailModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.orderMeta, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.metaLabel, children: "Date de commande" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.metaValue, children: formatDate(selectedOrder.date) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.metaLabel, children: "Livraison prévue" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.metaValue, children: formatDate(selectedOrder.expectedDate) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.metaLabel, children: "Statut" }),
            getStatusBadge(selectedOrder.status)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.orderItemsSection, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { children: [
            "Articles (",
            selectedOrder.items.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.itemsList, children: selectedOrder.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.orderItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.itemEmoji, children: item.productEmoji }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.itemInfo, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.itemName, children: item.productName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.itemBarcode, children: item.productBarcode })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.itemQtyDisplay, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              item.orderedQty,
              " x ",
              formatCurrency(item.purchasePrice)
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.itemTotal, children: formatCurrency(item.total) })
          ] }, item.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.orderSummary, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.summaryRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sous-total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCurrency(selectedOrder.subtotal) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.summaryRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "TVA" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCurrency(selectedOrder.taxAmount) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$2.summaryRow} ${styles$2.summaryTotal}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCurrency(selectedOrder.total) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handlePrintOrder(selectedOrder), className: styles$2.printBtn, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 18 }),
          " Imprimer"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowDetailModal(false), children: "Fermer" }),
        selectedOrder.status === "draft" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: styles$2.confirmBtn,
            onClick: () => handleSendOrder(selectedOrder.id),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 18 }),
              " Envoyer au fournisseur"
            ]
          }
        )
      ] })
    ] }) })
  ] });
};
const supplierPayments = "_supplierPayments_ckfrf_1";
const statsOverview = "_statsOverview_ckfrf_5";
const statCard$1 = "_statCard_ckfrf_12";
const statIcon$1 = "_statIcon_ckfrf_23";
const statInfo = "_statInfo_ckfrf_34";
const statLabel$1 = "_statLabel_ckfrf_39";
const statValue$1 = "_statValue_ckfrf_47";
const critical = "_critical_ckfrf_53";
const toolbar = "_toolbar_ckfrf_64";
const searchBox = "_searchBox_ckfrf_72";
const filters = "_filters_ckfrf_93";
const filterGroup = "_filterGroup_ckfrf_98";
const debtList = "_debtList_ckfrf_119";
const listHeader = "_listHeader_ckfrf_126";
const listItem = "_listItem_ckfrf_138";
const supplierInfo = "_supplierInfo_ckfrf_155";
const supplierAvatar = "_supplierAvatar_ckfrf_162";
const grNumber = "_grNumber_ckfrf_173";
const date = "_date_ckfrf_179";
const amount = "_amount_ckfrf_187";
const paidBadge = "_paidBadge_ckfrf_192";
const unpaidBadge = "_unpaidBadge_ckfrf_193";
const actions = "_actions_ckfrf_213";
const payBtn = "_payBtn_ckfrf_218";
const viewBtn = "_viewBtn_ckfrf_235";
const emptyState = "_emptyState_ckfrf_250";
const status = "_status_ckfrf_278";
const overlay = "_overlay_ckfrf_284";
const modal = "_modal_ckfrf_298";
const detailModal = "_detailModal_ckfrf_299";
const modalHeader = "_modalHeader_ckfrf_313";
const modalBody = "_modalBody_ckfrf_346";
const receiptSummary = "_receiptSummary_ckfrf_350";
const paymentOptions = "_paymentOptions_ckfrf_365";
const paymentBtn = "_paymentBtn_ckfrf_373";
const receiptInfo = "_receiptInfo_ckfrf_397";
const infoRow = "_infoRow_ckfrf_401";
const itemsList = "_itemsList_ckfrf_416";
const itemRow = "_itemRow_ckfrf_427";
const totalRow = "_totalRow_ckfrf_437";
const totalAmount = "_totalAmount_ckfrf_445";
const styles$1 = {
  supplierPayments,
  statsOverview,
  statCard: statCard$1,
  statIcon: statIcon$1,
  statInfo,
  statLabel: statLabel$1,
  statValue: statValue$1,
  critical,
  toolbar,
  searchBox,
  filters,
  filterGroup,
  debtList,
  listHeader,
  listItem,
  supplierInfo,
  supplierAvatar,
  grNumber,
  date,
  amount,
  paidBadge,
  unpaidBadge,
  actions,
  payBtn,
  viewBtn,
  emptyState,
  status,
  overlay,
  modal,
  detailModal,
  modalHeader,
  modalBody,
  receiptSummary,
  paymentOptions,
  paymentBtn,
  receiptInfo,
  infoRow,
  itemsList,
  itemRow,
  totalRow,
  totalAmount
};
const SupplierPayments = () => {
  const { formatCurrency } = useSettings();
  const { goodsReceipts, suppliers, payGoodsReceipt } = usePurchasesStore();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const [showPaymentModal, setShowPaymentModal] = reactExports.useState(false);
  const [showDetailModal, setShowDetailModal] = reactExports.useState(false);
  const [selectedReceipt, setSelectedReceipt] = reactExports.useState(null);
  const unpaidReceipts = reactExports.useMemo(
    () => goodsReceipts.filter(
      (r) => (filterStatus === "all" || (filterStatus === "unpaid" ? !r.isPaid : r.isPaid)) && (r.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) || r.grNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
    [goodsReceipts, filterStatus, searchQuery]
  );
  const stats = reactExports.useMemo(() => {
    const unpaid = goodsReceipts.filter((r) => !r.isPaid);
    const totalDebt = unpaid.reduce((sum, r) => sum + r.total, 0);
    const criticalDebt = unpaid.filter((r) => {
      const daysSinceReception = (Date.now() - new Date(r.date).getTime()) / (1e3 * 60 * 60 * 24);
      return daysSinceReception > 30;
    }).length;
    return {
      totalDebt,
      unpaidCount: unpaid.length,
      criticalDebt
    };
  }, [goodsReceipts]);
  const formatDate = (dateStr) => {
    const date2 = new Date(dateStr);
    return date2.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  };
  const handlePayReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setShowPaymentModal(true);
  };
  const handleViewDetail = (receipt) => {
    setSelectedReceipt(receipt);
    setShowDetailModal(true);
  };
  const confirmPayment = (paymentSource) => {
    if (!selectedReceipt) return;
    payGoodsReceipt(selectedReceipt.id, paymentSource);
    toast.success(`Paiement de ${formatCurrency(selectedReceipt.total)} enregistré depuis ${paymentSource === "cash" ? "la caisse" : paymentSource === "safe" ? "le coffre" : "la provision"}`);
    setShowPaymentModal(false);
    setSelectedReceipt(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.supplierPayments, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.statsOverview, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.statCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.statIcon, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.statInfo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.statLabel, children: "Dette totale fournisseurs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.statValue, children: formatCurrency(stats.totalDebt) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.statCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.statIcon, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.statInfo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.statLabel, children: "Bons non payés" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.statValue, children: stats.unpaidCount })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$1.statCard} ${stats.criticalDebt > 0 ? styles$1.critical : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.statIcon, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.statInfo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.statLabel, children: "Dettes critiques (+30j)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.statValue, children: stats.criticalDebt })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.toolbar, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.searchBox, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Chercher par fournisseur ou N° de bon...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.filters, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.filterGroup, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 16 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "Tous les bons" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "unpaid", children: "À payer (Dettes)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "paid", children: "Payés" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.debtList, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.listHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Fournisseur" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "N° Réception" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Date Réception" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Montant Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Statut" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Action" })
      ] }),
      unpaidReceipts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.emptyState, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 48 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Félicitations ! Vous n'avez aucune dette fournisseur en cours." })
      ] }) : unpaidReceipts.map((receipt) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.listItem, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.supplierInfo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.supplierAvatar, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 14 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: receipt.supplierName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.grNumber, children: receipt.grNumber }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.date, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 14 }),
          " ",
          formatDate(receipt.date)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.amount, children: formatCurrency(receipt.total) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.status, children: receipt.isPaid ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.paidBadge, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 12 }),
          " Payé"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.unpaidBadge, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 12 }),
          " À payer"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.actions, children: [
          !receipt.isPaid && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: styles$1.payBtn,
              onClick: () => handlePayReceipt(receipt),
              children: "Régler"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: styles$1.viewBtn,
              onClick: () => handleViewDetail(receipt),
              children: "Détail"
            }
          )
        ] })
      ] }, receipt.id))
    ] }),
    showPaymentModal && selectedReceipt && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.overlay, onClick: () => setShowPaymentModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "💳 Régler le Bon d'Entrée" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowPaymentModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.receiptSummary, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Fournisseur:" }),
            " ",
            selectedReceipt.supplierName
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "N° Bon:" }),
            " ",
            selectedReceipt.grNumber
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Montant:" }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.amount, children: formatCurrency(selectedReceipt.total) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.paymentOptions, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Payer depuis:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: styles$1.paymentBtn,
              onClick: () => confirmPayment("cash"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 20 }),
                "Caisse"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: styles$1.paymentBtn,
              onClick: () => confirmPayment("safe"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 20 }),
                "Coffre"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: styles$1.paymentBtn,
              onClick: () => confirmPayment("provision"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 20 }),
                "Provision"
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    showDetailModal && selectedReceipt && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.overlay, onClick: () => setShowDetailModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.detailModal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 20 }),
          " Détail du Bon d'Entrée"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowDetailModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.receiptInfo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.infoRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "N° Bon:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selectedReceipt.grNumber })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.infoRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Fournisseur:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selectedReceipt.supplierName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.infoRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Date:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatDate(selectedReceipt.date) })
          ] }),
          selectedReceipt.invoiceNumber && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.infoRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "N° Facture:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selectedReceipt.invoiceNumber })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.infoRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Statut:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selectedReceipt.isPaid ? "✅ Payé" : "⏳ À payer" })
          ] }),
          selectedReceipt.isPaid && selectedReceipt.paidFrom && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.infoRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Payé depuis:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selectedReceipt.paidFrom === "cash" ? "Caisse" : selectedReceipt.paidFrom === "safe" ? "Coffre" : "Provision" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.itemsList, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { children: [
            "Articles (",
            selectedReceipt.items.length,
            ")"
          ] }),
          selectedReceipt.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.itemRow, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              item.productEmoji,
              " ",
              item.productName
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              item.receivedQty,
              " ",
              item.unit
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCurrency(item.total) })
          ] }, item.id))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.totalRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Total:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: styles$1.totalAmount, children: formatCurrency(selectedReceipt.total) })
        ] })
      ] })
    ] }) })
  ] });
};
const suppliersHub = "_suppliersHub_jc98x_5";
const header = "_header_jc98x_23";
const headerLeft = "_headerLeft_jc98x_32";
const headerIcon = "_headerIcon_jc98x_38";
const statsRow = "_statsRow_jc98x_79";
const statCard = "_statCard_jc98x_86";
const statIcon = "_statIcon_jc98x_96";
const dangerCard = "_dangerCard_jc98x_103";
const statValue = "_statValue_jc98x_113";
const statLabel = "_statLabel_jc98x_120";
const tabsNav = "_tabsNav_jc98x_127";
const tabBtn = "_tabBtn_jc98x_137";
const active = "_active_jc98x_157";
const badge = "_badge_jc98x_163";
const tabContent = "_tabContent_jc98x_178";
const chartCard = "_chartCard_jc98x_185";
const chartHeader = "_chartHeader_jc98x_193";
const chartTitle = "_chartTitle_jc98x_200";
const chartLegend = "_chartLegend_jc98x_212";
const legendItem = "_legendItem_jc98x_217";
const legendDot = "_legendDot_jc98x_225";
const chartFooter = "_chartFooter_jc98x_232";
const insightTag = "_insightTag_jc98x_240";
const customTooltip = "_customTooltip_jc98x_256";
const tooltipLabel = "_tooltipLabel_jc98x_266";
const tooltipValue = "_tooltipValue_jc98x_274";
const tooltipSub = "_tooltipSub_jc98x_279";
const styles = {
  suppliersHub,
  header,
  headerLeft,
  headerIcon,
  statsRow,
  statCard,
  statIcon,
  dangerCard,
  statValue,
  statLabel,
  tabsNav,
  tabBtn,
  active,
  badge,
  tabContent,
  chartCard,
  chartHeader,
  chartTitle,
  chartLegend,
  legendItem,
  legendDot,
  chartFooter,
  insightTag,
  customTooltip,
  tooltipLabel,
  tooltipValue,
  tooltipSub
};
const SuppliersHub = () => {
  const { formatCurrency } = useSettings();
  const { suppliers, purchaseOrders: purchaseOrders2, goodsReceipts, getMonthlyStats, getTotalDebt } = usePurchasesStore();
  const [activeTab, setActiveTab] = reactExports.useState("suppliers");
  const totalSuppliers = suppliers.length;
  const activeOrders = purchaseOrders2.filter((o) => o.status === "sent" || o.status === "partial").length;
  const unpaidReceipts = goodsReceipts.filter((r) => !r.isPaid).length;
  const totalDebt = getTotalDebt();
  const tabs = [
    { id: "suppliers", label: "Liste Fournisseurs", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 20 }), component: /* @__PURE__ */ jsxRuntimeExports.jsx(SuppliersList, {}) },
    { id: "orders", label: "Bons de Commande", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 20 }), badge: activeOrders > 0 ? activeOrders : void 0, component: /* @__PURE__ */ jsxRuntimeExports.jsx(PurchaseOrders, {}) },
    { id: "payments", label: "Paiements / Dettes", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 20 }), badge: unpaidReceipts > 0 ? unpaidReceipts : void 0, component: /* @__PURE__ */ jsxRuntimeExports.jsx(SupplierPayments, {}) }
  ];
  const activeTabData = tabs.find((t) => t.id === activeTab);
  const monthlyData = getMonthlyStats();
  const CustomTooltip = ({ active: active2, payload, label }) => {
    if (active2 && payload && payload.length) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.customTooltip, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles.tooltipLabel, children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: styles.tooltipValue, children: [
          "Total: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(payload[0].value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: styles.tooltipSub, children: [
          payload[0].payload.orders,
          " livraisons reçues"
        ] })
      ] });
    }
    return null;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.suppliersHub, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.header, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.headerLeft, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 32, className: styles.headerIcon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Gestion Fournisseurs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Gestion des partenaires et approvisionnements" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.headerActions })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.statsRow, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.statCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.statIcon, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statValue, children: totalSuppliers }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statLabel, children: "Fournisseurs" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.statCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.statIcon, style: { background: "var(--color-primary-bg)", color: "var(--color-primary)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statValue, children: activeOrders }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statLabel, children: "Commandes en cours" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles.statCard} ${totalDebt > 0 ? styles.dangerCard : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.statIcon, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statValue, children: formatCurrency(totalDebt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statLabel, children: "Dette fournisseurs" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.statCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.statIcon, style: { background: "var(--color-success-bg)", color: "var(--color-success)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statValue, children: goodsReceipts.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statLabel, children: "Réceptions totales" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.chartCard, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.chartHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.chartTitle, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Performance Approvisionnement" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Évolution du volume d'achats sur les 6 derniers mois" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.chartLegend, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.legendItem, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.legendDot }),
          "Volume d'achat (DA)"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.chartBody, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: monthlyData, margin: { top: 10, right: 10, left: 10, bottom: 0 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "colorTotal", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "var(--color-primary)", stopOpacity: 0.3 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "var(--color-primary)", stopOpacity: 0 })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "rgba(0,0,0,0.05)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          XAxis,
          {
            dataKey: "name",
            axisLine: false,
            tickLine: false,
            tick: { fontSize: 12, fill: "var(--color-text-muted)" },
            dy: 10
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          YAxis,
          {
            hide: true,
            domain: ["dataMin - 5000", "dataMax + 5000"]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomTooltip, {}), cursor: { stroke: "var(--color-primary)", strokeWidth: 1, strokeDasharray: "4 4" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Area,
          {
            type: "monotone",
            dataKey: "total",
            stroke: "var(--color-primary)",
            strokeWidth: 3,
            fillOpacity: 1,
            fill: "url(#colorTotal)",
            activeDot: { r: 6, strokeWidth: 0, fill: "var(--color-primary)" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ReferenceLine, { y: 5e4, stroke: "var(--color-warning)", strokeDasharray: "3 3", opacity: 0.5, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { value: "Objectif Mensuel", position: "insideBottomLeft", fill: "var(--color-warning)", fontSize: 10 }) })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.chartFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.insightTag, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14 }),
          "Volume en hausse de 12% ce mois-ci"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.insightTag, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14 }),
          "Moyenne mensuelle: ",
          formatCurrency(52e3)
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
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.tabContent, children: activeTabData?.component })
  ] });
};
export {
  SuppliersHub as Suppliers
};

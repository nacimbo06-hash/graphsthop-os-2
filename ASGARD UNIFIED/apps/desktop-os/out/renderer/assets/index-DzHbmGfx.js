import { j as jsxRuntimeExports } from "./vendor-state-DFI86SKa.js";
import { r as reactExports } from "./vendor-react-Df__x13C.js";
import { u as useSettings, d as useCustomersStore, f as useToast } from "./index-BbOgUw3k.js";
import { C as ConfirmModal } from "./ConfirmModal-IjhJ8y4D.js";
import { r as Search, a0 as UserPlus, a7 as Star, aM as Phone, aN as Mail, aO as MapPin, _ as CreditCard, w as Calendar, a5 as Eye, aC as SquarePen, v as Trash2, X, at as ShoppingBag, aD as Save, j as Wallet, e as Clock, T as TriangleAlert, O as DollarSign, a as CircleCheckBig, f as Settings, U as Users, s as TrendingUp, aP as Gift, aQ as Award, af as Plus, ag as Percent, aR as Trophy, aS as Crown } from "./vendor-ui-DiXyqbDT.js";
import "./vendor-i18n-DeCNyroL.js";
const customersList = "_customersList_1t5pn_3";
const toolbar = "_toolbar_1t5pn_10";
const searchBox = "_searchBox_1t5pn_16";
const resultsCount = "_resultsCount_1t5pn_40";
const grid = "_grid_1t5pn_46";
const customerCard = "_customerCard_1t5pn_52";
const vip = "_vip_1t5pn_65";
const cardHeader = "_cardHeader_1t5pn_70";
const avatar = "_avatar_1t5pn_77";
const vipBadge = "_vipBadge_1t5pn_90";
const customerName$2 = "_customerName_1t5pn_95";
const contactInfo = "_contactInfo_1t5pn_102";
const statsGrid = "_statsGrid_1t5pn_117";
const statValue$2 = "_statValue_1t5pn_126";
const statLabel$2 = "_statLabel_1t5pn_133";
const creditAlert = "_creditAlert_1t5pn_139";
const cardFooter = "_cardFooter_1t5pn_152";
const lastVisit = "_lastVisit_1t5pn_156";
const cardActions = "_cardActions_1t5pn_164";
const overlay$2 = "_overlay_1t5pn_191";
const modal$2 = "_modal_1t5pn_201";
const modalSmall = "_modalSmall_1t5pn_212";
const modalHeader$2 = "_modalHeader_1t5pn_221";
const modalCustomer = "_modalCustomer_1t5pn_230";
const modalAvatar = "_modalAvatar_1t5pn_236";
const vipTag = "_vipTag_1t5pn_260";
const modalBody$2 = "_modalBody_1t5pn_268";
const infoSection = "_infoSection_1t5pn_272";
const infoGrid = "_infoGrid_1t5pn_283";
const statsSection = "_statsSection_1t5pn_297";
const statBox = "_statBox_1t5pn_304";
const statBoxValue = "_statBoxValue_1t5pn_319";
const statBoxLabel = "_statBoxLabel_1t5pn_325";
const creditSection = "_creditSection_1t5pn_330";
const creditAmount = "_creditAmount_1t5pn_343";
const payBtn$1 = "_payBtn_1t5pn_350";
const addBtn = "_addBtn_1t5pn_361";
const deleteBtn = "_deleteBtn_1t5pn_382";
const formGroup$2 = "_formGroup_1t5pn_396";
const formRow$1 = "_formRow_1t5pn_424";
const modalFooter$2 = "_modalFooter_1t5pn_431";
const confirmBtn$2 = "_confirmBtn_1t5pn_453";
const paymentInfo$1 = "_paymentInfo_1t5pn_464";
const customerPaymentName = "_customerPaymentName_1t5pn_470";
const currentBalanceInfo = "_currentBalanceInfo_1t5pn_476";
const newBalanceInfo = "_newBalanceInfo_1t5pn_485";
const notesArea = "_notesArea_1t5pn_495";
const styles$3 = {
  customersList,
  toolbar,
  searchBox,
  resultsCount,
  grid,
  customerCard,
  vip,
  cardHeader,
  avatar,
  vipBadge,
  customerName: customerName$2,
  contactInfo,
  statsGrid,
  statValue: statValue$2,
  statLabel: statLabel$2,
  creditAlert,
  cardFooter,
  lastVisit,
  cardActions,
  overlay: overlay$2,
  modal: modal$2,
  modalSmall,
  modalHeader: modalHeader$2,
  modalCustomer,
  modalAvatar,
  vipTag,
  modalBody: modalBody$2,
  infoSection,
  infoGrid,
  statsSection,
  statBox,
  statBoxValue,
  statBoxLabel,
  creditSection,
  creditAmount,
  payBtn: payBtn$1,
  addBtn,
  deleteBtn,
  formGroup: formGroup$2,
  formRow: formRow$1,
  modalFooter: modalFooter$2,
  confirmBtn: confirmBtn$2,
  paymentInfo: paymentInfo$1,
  customerPaymentName,
  currentBalanceInfo,
  newBalanceInfo,
  notesArea
};
const CustomersList = () => {
  const { formatCurrency } = useSettings();
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomersStore();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [showViewModal, setShowViewModal] = reactExports.useState(false);
  const [showEditModal, setShowEditModal] = reactExports.useState(false);
  const [selectedCustomer, setSelectedCustomer] = reactExports.useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = reactExports.useState(false);
  const [customerToDelete, setCustomerToDelete] = reactExports.useState(null);
  const [showPaymentModal, setShowPaymentModal] = reactExports.useState(false);
  const [paymentAmount, setPaymentAmount] = reactExports.useState("");
  const [paymentNotes, setPaymentNotes] = reactExports.useState("");
  const { updateCredit } = useCustomersStore();
  const [formData, setFormData] = reactExports.useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    creditLimit: 5e4
  });
  const formatDate = (date) => {
    if (!date) return "Jamais";
    return new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };
  const filteredCustomers = customers.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)
  );
  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };
  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || "",
      address: customer.address || "",
      city: customer.city || "",
      creditLimit: customer.creditLimit
    });
    setShowEditModal(true);
  };
  const handleNewCustomer = () => {
    setSelectedCustomer(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      creditLimit: 5e4
    });
    setShowEditModal(true);
  };
  const handleSaveCustomer = () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.warning("Le nom et le téléphone sont obligatoires");
      return;
    }
    if (selectedCustomer) {
      updateCustomer(selectedCustomer.id, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || void 0,
        address: formData.address || void 0,
        city: formData.city || void 0,
        creditLimit: formData.creditLimit
      });
      toast.success(`Client "${formData.name}" modifié avec succès`);
    } else {
      addCustomer({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || void 0,
        address: formData.address || void 0,
        city: formData.city || void 0,
        creditLimit: formData.creditLimit
      });
      toast.success(`Client "${formData.name}" ajouté avec succès`);
    }
    setShowEditModal(false);
    setSelectedCustomer(null);
  };
  const handleDeleteCustomer = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteConfirm(true);
  };
  const confirmDelete = () => {
    if (customerToDelete) {
      deleteCustomer(customerToDelete.id);
      toast.success(`Client "${customerToDelete.name}" supprimé`);
    }
    setShowDeleteConfirm(false);
    setCustomerToDelete(null);
  };
  const handleOpenPayment = () => {
    setPaymentAmount(selectedCustomer?.currentCredit.toString() || "");
    setPaymentNotes("");
    setShowPaymentModal(true);
  };
  const handleSavePayment = () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.warning("Veuillez entrer un montant valide");
      return;
    }
    if (selectedCustomer) {
      updateCredit(
        selectedCustomer.id,
        -amount,
        "payment",
        void 0,
        paymentNotes || "Paiement de crédit"
      );
      toast.success(`Paiement de ${formatCurrency(amount)} enregistré pour ${selectedCustomer.name}`);
      setShowPaymentModal(false);
      setShowViewModal(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.customersList, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.toolbar, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.searchBox, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Rechercher par nom ou téléphone...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$3.addBtn, onClick: handleNewCustomer, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { size: 18 }),
        " Nouveau client"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$3.resultsCount, children: [
      filteredCustomers.length,
      " clients"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.grid, children: filteredCustomers.map((customer) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$3.customerCard} ${customer.loyaltyPoints >= 5e3 ? styles$3.vip : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.cardHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.avatar, children: customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2) }),
        customer.loyaltyPoints >= 5e3 && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 16, className: styles$3.vipBadge })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: styles$3.customerName, children: customer.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.contactInfo, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 12 }),
          " ",
          customer.phone
        ] }),
        customer.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 12 }),
          " ",
          customer.email
        ] }),
        customer.city && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 12 }),
          " ",
          customer.city
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.statsGrid, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statValue, children: customer.loyaltyPoints }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statLabel, children: "Points" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statValue, children: formatCurrency(customer.currentCredit) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statLabel, children: "Crédit" })
        ] })
      ] }),
      customer.currentCredit > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.creditAlert, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 14 }),
        " Crédit: ",
        formatCurrency(customer.currentCredit)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.cardFooter, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$3.lastVisit, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 12 }),
        " Dernière visite: ",
        formatDate(customer.lastVisit)
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.cardActions, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleViewCustomer(customer), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 14 }),
          " Voir"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleEditCustomer(customer), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { size: 14 }),
          " Modifier"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles$3.deleteBtn, onClick: () => handleDeleteCustomer(customer), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }) })
      ] })
    ] }, customer.id)) }),
    showViewModal && selectedCustomer && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.overlay, onClick: () => setShowViewModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalCustomer, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.modalAvatar, children: selectedCustomer.name.split(" ").map((n) => n[0]).join("").slice(0, 2) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: selectedCustomer.name }),
            selectedCustomer.loyaltyPoints >= 5e3 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.vipTag, children: "⭐ Client VIP" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowViewModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.infoSection, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Informations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.infoGrid, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 14 }),
              " ",
              selectedCustomer.phone
            ] }),
            selectedCustomer.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 14 }),
              " ",
              selectedCustomer.email
            ] }),
            selectedCustomer.address && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14 }),
              " ",
              selectedCustomer.address
            ] }),
            selectedCustomer.city && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14 }),
              " ",
              selectedCustomer.city
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 14 }),
              " Client depuis ",
              formatDate(selectedCustomer.createdAt)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.statsSection, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.statBox, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 20 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statBoxValue, children: selectedCustomer.loyaltyPoints }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statBoxLabel, children: "Points fidélité" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.statBox, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 20 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statBoxValue, children: formatCurrency(selectedCustomer.currentCredit) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statBoxLabel, children: "Crédit en cours" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.statBox, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 20 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statBoxValue, children: formatCurrency(selectedCustomer.creditLimit) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$3.statBoxLabel, children: "Limite de crédit" })
          ] })
        ] }),
        selectedCustomer.currentCredit > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.creditSection, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Crédit en cours" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.creditAmount, children: formatCurrency(selectedCustomer.currentCredit) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles$3.payBtn, onClick: handleOpenPayment, children: "Enregistrer un paiement" })
        ] })
      ] })
    ] }) }),
    showPaymentModal && selectedCustomer && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.overlay, onClick: () => setShowPaymentModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalSmall, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Enregistrer un paiement" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowPaymentModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.paymentInfo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: styles$3.customerPaymentName, children: selectedCustomer.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.currentBalanceInfo, children: [
            "Crédit actuel: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(selectedCustomer.currentCredit) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.formGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Montant du paiement (DA)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              value: paymentAmount,
              onChange: (e) => setPaymentAmount(e.target.value),
              placeholder: "Ex: 5000",
              autoFocus: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.newBalanceInfo, children: [
            "Nouveau solde: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(Math.max(0, selectedCustomer.currentCredit - (parseFloat(paymentAmount) || 0))) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.formGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Notes / Référence (optionnel)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              className: styles$3.notesArea,
              value: paymentNotes,
              onChange: (e) => setPaymentNotes(e.target.value),
              placeholder: "Ex: Paiement en espèces, Chèque N°...",
              rows: 3
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowPaymentModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$3.confirmBtn, onClick: handleSavePayment, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 18 }),
          " Valider le paiement"
        ] })
      ] })
    ] }) }),
    showEditModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.overlay, onClick: () => setShowEditModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: selectedCustomer ? "Modifier le client" : "Nouveau client" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowEditModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.formGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Nom complet *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: formData.name,
              onChange: (e) => setFormData({ ...formData, name: e.target.value }),
              placeholder: "Ex: Ahmed Benali"
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
              placeholder: "Ex: 0555112233"
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
              placeholder: "Ex: email@exemple.com"
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
                placeholder: "Ex: 45 Rue Didouche Mourad"
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.formGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Limite de crédit (DA)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              value: formData.creditLimit,
              onChange: (e) => setFormData({ ...formData, creditLimit: parseInt(e.target.value) || 0 }),
              placeholder: "50000"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowEditModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$3.confirmBtn, onClick: handleSaveCustomer, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 18 }),
          " ",
          selectedCustomer ? "Enregistrer" : "Créer le client"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmModal,
      {
        isOpen: showDeleteConfirm,
        title: "Supprimer le client",
        message: `Êtes-vous sûr de vouloir supprimer "${customerToDelete?.name}" ? Cette action est irréversible.`,
        confirmText: "Supprimer",
        cancelText: "Annuler",
        variant: "danger",
        onConfirm: confirmDelete,
        onCancel: () => setShowDeleteConfirm(false)
      }
    )
  ] });
};
const creditManagement = "_creditManagement_1wouc_3";
const summaryRow = "_summaryRow_1wouc_10";
const summaryCard = "_summaryCard_1wouc_16";
const warning$1 = "_warning_1wouc_33";
const danger = "_danger_1wouc_38";
const summaryValue = "_summaryValue_1wouc_43";
const summaryLabel = "_summaryLabel_1wouc_50";
const creditList = "_creditList_1wouc_57";
const listHeader = "_listHeader_1wouc_64";
const creditRow = "_creditRow_1wouc_75";
const overdue = "_overdue_1wouc_91";
const critical = "_critical_1wouc_95";
const customerInfo$1 = "_customerInfo_1wouc_99";
const customerName$1 = "_customerName_1wouc_105";
const customerPhone = "_customerPhone_1wouc_110";
const balance = "_balance_1wouc_118";
const balanceValue = "_balanceValue_1wouc_120";
const limit = "_limit_1wouc_126";
const usage = "_usage_1wouc_131";
const usageBar = "_usageBar_1wouc_137";
const usageFill = "_usageFill_1wouc_145";
const lastPayment = "_lastPayment_1wouc_157";
const overdueBadge = "_overdueBadge_1wouc_165";
const neverPaid = "_neverPaid_1wouc_174";
const actions = "_actions_1wouc_179";
const payBtn = "_payBtn_1wouc_181";
const overlay$1 = "_overlay_1wouc_199";
const modal$1 = "_modal_1wouc_209";
const modalHeader$1 = "_modalHeader_1wouc_217";
const modalBody$1 = "_modalBody_1wouc_237";
const paymentInfo = "_paymentInfo_1wouc_241";
const currentBalance = "_currentBalance_1wouc_253";
const formGroup$1 = "_formGroup_1wouc_260";
const newBalance = "_newBalance_1wouc_287";
const quickAmounts = "_quickAmounts_1wouc_300";
const selected = "_selected_1wouc_317";
const modalFooter$1 = "_modalFooter_1wouc_322";
const confirmBtn$1 = "_confirmBtn_1wouc_347";
const styles$2 = {
  creditManagement,
  summaryRow,
  summaryCard,
  warning: warning$1,
  danger,
  summaryValue,
  summaryLabel,
  creditList,
  listHeader,
  creditRow,
  overdue,
  critical,
  customerInfo: customerInfo$1,
  customerName: customerName$1,
  customerPhone,
  balance,
  balanceValue,
  limit,
  usage,
  usageBar,
  usageFill,
  lastPayment,
  overdueBadge,
  neverPaid,
  actions,
  payBtn,
  overlay: overlay$1,
  modal: modal$1,
  modalHeader: modalHeader$1,
  modalBody: modalBody$1,
  paymentInfo,
  currentBalance,
  formGroup: formGroup$1,
  newBalance,
  quickAmounts,
  selected,
  modalFooter: modalFooter$1,
  confirmBtn: confirmBtn$1
};
const CreditManagement = () => {
  const [showPaymentModal, setShowPaymentModal] = reactExports.useState(false);
  const [selectedCustomer, setSelectedCustomer] = reactExports.useState(null);
  const [paymentAmount, setPaymentAmount] = reactExports.useState("");
  const {
    customers,
    transactions,
    updateCredit,
    getCustomersWithCredit,
    getOverdueCustomers,
    getTotalOutstandingCredit
  } = useCustomersStore();
  const { formatCurrency } = useSettings();
  const toast = useToast();
  const formatDate = (date) => new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  const customersWithCredit = reactExports.useMemo(() => getCustomersWithCredit(), [customers]);
  const totalCredit = getTotalOutstandingCredit();
  const overdueCount = getOverdueCustomers(7).length;
  const atLimitCount = customers.filter((c) => c.currentCredit >= c.creditLimit).length;
  const getDaysOverdue = (customer) => {
    if (customer.currentCredit <= 0) return 0;
    if (!customer.lastPaymentDate) return 999;
    const lastPayment2 = new Date(customer.lastPaymentDate);
    return Math.floor(((/* @__PURE__ */ new Date()).getTime() - lastPayment2.getTime()) / (1e3 * 60 * 60 * 24));
  };
  const getStatusClass = (customer) => {
    if (customer.currentCredit >= customer.creditLimit) return styles$2.critical;
    const daysOverdue = getDaysOverdue(customer);
    if (daysOverdue > 14) return styles$2.overdue;
    if (daysOverdue > 7) return styles$2.warning;
    return "";
  };
  const handlePayment = (customer) => {
    setSelectedCustomer(customer);
    setPaymentAmount("");
    setShowPaymentModal(true);
  };
  const confirmPayment = () => {
    if (!selectedCustomer || !paymentAmount) return;
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) return;
    updateCredit(selectedCustomer.id, -amount, "payment", void 0, "Règlement espèces");
    toast.success(`Paiement de ${formatCurrency(amount)} enregistré pour ${selectedCustomer.name}`);
    setShowPaymentModal(false);
    setSelectedCustomer(null);
    setPaymentAmount("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.creditManagement, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.summaryRow, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.summaryCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.summaryValue, children: formatCurrency(totalCredit) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.summaryLabel, children: "Crédit total en cours" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$2.summaryCard} ${styles$2.warning}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.summaryValue, children: overdueCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.summaryLabel, children: "En retard (+7 jours)" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$2.summaryCard} ${styles$2.danger}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.summaryValue, children: atLimitCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.summaryLabel, children: "Limite atteinte" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.creditList, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.listHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Client" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Solde" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Limite" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Utilisation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Dernier paiement" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Action" })
      ] }),
      customersWithCredit.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.emptyState, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Aucun client avec crédit en cours" }) }) : customersWithCredit.map((customer) => {
        const daysOverdue = getDaysOverdue(customer);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles$2.creditRow} ${getStatusClass(customer)}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.customerInfo, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.customerName, children: customer.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$2.customerPhone, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 12 }),
              " ",
              customer.phone
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.balance, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.balanceValue, children: formatCurrency(customer.currentCredit) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.limit, children: formatCurrency(customer.creditLimit) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.usage, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.usageBar, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: styles$2.usageFill,
                style: {
                  width: `${Math.min(customer.currentCredit / customer.creditLimit * 100, 100)}%`,
                  background: customer.currentCredit >= customer.creditLimit ? "var(--color-danger)" : customer.currentCredit > customer.creditLimit * 0.8 ? "var(--color-warning)" : "var(--color-success)"
                }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              Math.round(customer.currentCredit / customer.creditLimit * 100),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.lastPayment, children: customer.lastPaymentDate ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 12 }),
            " ",
            formatDate(customer.lastPaymentDate),
            daysOverdue > 7 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$2.overdueBadge, children: [
              "+",
              daysOverdue,
              "j"
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.neverPaid, children: "Jamais" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.actions, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$2.payBtn, onClick: () => handlePayment(customer), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { size: 14 }),
            " Encaisser"
          ] }) })
        ] }, customer.id);
      })
    ] }),
    showPaymentModal && selectedCustomer && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.overlay, onClick: () => setShowPaymentModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Enregistrer un paiement" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowPaymentModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.paymentInfo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Client:" }),
            " ",
            selectedCustomer.name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Solde actuel:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$2.currentBalance, children: formatCurrency(selectedCustomer.currentCredit) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.formGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Montant du paiement (DA)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              value: paymentAmount,
              onChange: (e) => setPaymentAmount(e.target.value),
              placeholder: "0",
              autoFocus: true
            }
          )
        ] }),
        paymentAmount && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.newBalance, children: [
          "Nouveau solde: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(selectedCustomer.currentCredit - parseFloat(paymentAmount || "0")) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.quickAmounts, children: [
          [1e3, 2e3, 5e3, 1e4].map((amount) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setPaymentAmount(amount.toString()),
              className: paymentAmount === amount.toString() ? styles$2.selected : "",
              children: formatCurrency(amount)
            },
            amount
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPaymentAmount(selectedCustomer.currentCredit.toString()), children: "Tout payer" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowPaymentModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$2.confirmBtn, onClick: confirmPayment, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 18 }),
          " Confirmer le paiement"
        ] })
      ] })
    ] }) })
  ] });
};
const loyaltyProgram = "_loyaltyProgram_17j94_3";
const headerActions = "_headerActions_17j94_10";
const settingsBtn = "_settingsBtn_17j94_16";
const statsRow$1 = "_statsRow_17j94_36";
const statCard$1 = "_statCard_17j94_42";
const statValue$1 = "_statValue_17j94_56";
const statLabel$1 = "_statLabel_17j94_63";
const conversionBox = "_conversionBox_17j94_70";
const conversionNote = "_conversionNote_17j94_91";
const editConversionBtn = "_editConversionBtn_17j94_97";
const section = "_section_17j94_113";
const sectionHeader = "_sectionHeader_17j94_129";
const addTierBtn = "_addTierBtn_17j94_140";
const tiersGrid = "_tiersGrid_17j94_158";
const tierCard = "_tierCard_17j94_164";
const tierActions = "_tierActions_17j94_180";
const tierIcon = "_tierIcon_17j94_208";
const tierName = "_tierName_17j94_214";
const tierPoints = "_tierPoints_17j94_221";
const tierDiscount = "_tierDiscount_17j94_228";
const tierBenefits = "_tierBenefits_17j94_240";
const leaderboard = "_leaderboard_17j94_266";
const leaderRow = "_leaderRow_17j94_272";
const rank = "_rank_17j94_282";
const crown = "_crown_17j94_289";
const customerInfo = "_customerInfo_17j94_293";
const customerName = "_customerName_17j94_299";
const customerTier = "_customerTier_17j94_304";
const customerPoints = "_customerPoints_17j94_309";
const pointsValue = "_pointsValue_17j94_313";
const pointsLabel = "_pointsLabel_17j94_320";
const customerSpent = "_customerSpent_17j94_326";
const emptyState = "_emptyState_17j94_334";
const overlay = "_overlay_17j94_341";
const modal = "_modal_17j94_352";
const modalHeader = "_modalHeader_17j94_362";
const modalBody = "_modalBody_17j94_385";
const formGroup = "_formGroup_17j94_389";
const hint = "_hint_17j94_428";
const checkboxLabel = "_checkboxLabel_17j94_435";
const formRow = "_formRow_17j94_448";
const modalFooter = "_modalFooter_17j94_454";
const confirmBtn = "_confirmBtn_17j94_476";
const styles$1 = {
  loyaltyProgram,
  headerActions,
  settingsBtn,
  statsRow: statsRow$1,
  statCard: statCard$1,
  statValue: statValue$1,
  statLabel: statLabel$1,
  conversionBox,
  conversionNote,
  editConversionBtn,
  section,
  sectionHeader,
  addTierBtn,
  tiersGrid,
  tierCard,
  tierActions,
  tierIcon,
  tierName,
  tierPoints,
  tierDiscount,
  tierBenefits,
  leaderboard,
  leaderRow,
  rank,
  crown,
  customerInfo,
  customerName,
  customerTier,
  customerPoints,
  pointsValue,
  pointsLabel,
  customerSpent,
  emptyState,
  overlay,
  modal,
  modalHeader,
  modalBody,
  formGroup,
  hint,
  checkboxLabel,
  formRow,
  modalFooter,
  confirmBtn
};
const defaultTiers = [
  { id: "bronze", name: "Bronze", icon: "🥉", minPoints: 0, discount: 0, color: "#CD7F32", benefits: ["Accumulation de points"] },
  { id: "silver", name: "Argent", icon: "🥈", minPoints: 1e3, discount: 3, color: "#C0C0C0", benefits: ["3% de remise", "Offres exclusives"] },
  { id: "gold", name: "Or", icon: "🥇", minPoints: 5e3, discount: 5, color: "#FFD700", benefits: ["5% de remise", "Livraison gratuite", "Accès anticipé promos"] },
  { id: "platinum", name: "Platine", icon: "💎", minPoints: 1e4, discount: 10, color: "#E5E4E2", benefits: ["10% de remise", "Service prioritaire", "Cadeaux anniversaire"] }
];
const LOYALTY_STORAGE_KEY = "loyalty_settings";
const TIERS_STORAGE_KEY = "loyalty_tiers";
const LoyaltyProgram = () => {
  const { customers } = useCustomersStore();
  const { formatCurrency } = useSettings();
  const toast = useToast();
  const loadSettings = () => {
    try {
      const saved = localStorage.getItem(LOYALTY_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
    }
    return { pointsPerAmount: 100, currency: "DA", enabled: true };
  };
  const loadTiers = () => {
    try {
      const saved = localStorage.getItem(TIERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
    }
    return defaultTiers;
  };
  const [settings, setSettings] = reactExports.useState(loadSettings);
  const [tiers, setTiers] = reactExports.useState(loadTiers);
  const [selectedTier, setSelectedTier] = reactExports.useState(null);
  const [showSettingsModal, setShowSettingsModal] = reactExports.useState(false);
  const [showTierModal, setShowTierModal] = reactExports.useState(false);
  const [editingTier, setEditingTier] = reactExports.useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = reactExports.useState(false);
  const [tierToDelete, setTierToDelete] = reactExports.useState(null);
  const [tierForm, setTierForm] = reactExports.useState({
    name: "",
    icon: "",
    minPoints: 0,
    discount: 0,
    color: "#FFD700",
    benefits: ""
  });
  const totalMembers = customers.length;
  const totalPointsIssued = customers.reduce((sum, c) => sum + c.loyaltyPoints, 0);
  const avgPointsPerCustomer = totalMembers > 0 ? Math.round(totalPointsIssued / totalMembers) : 0;
  const getCustomerTier = (points) => {
    const sortedTiers = [...tiers].sort((a, b) => b.minPoints - a.minPoints);
    return sortedTiers.find((t) => points >= t.minPoints) || tiers[0];
  };
  const topCustomers = [...customers].sort((a, b) => b.loyaltyPoints - a.loyaltyPoints).slice(0, 5).map((c) => ({
    ...c,
    tier: getCustomerTier(c.loyaltyPoints)
  }));
  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem(LOYALTY_STORAGE_KEY, JSON.stringify(newSettings));
    toast.success("Paramètres de fidélité enregistrés");
    setShowSettingsModal(false);
  };
  const saveTiers = (newTiers) => {
    setTiers(newTiers);
    localStorage.setItem(TIERS_STORAGE_KEY, JSON.stringify(newTiers));
  };
  const handleEditTier = (tier) => {
    setEditingTier(tier);
    setTierForm({
      name: tier.name,
      icon: tier.icon,
      minPoints: tier.minPoints,
      discount: tier.discount,
      color: tier.color,
      benefits: tier.benefits.join(", ")
    });
    setShowTierModal(true);
  };
  const handleNewTier = () => {
    setEditingTier(null);
    setTierForm({
      name: "",
      icon: "⭐",
      minPoints: 0,
      discount: 0,
      color: "#FFD700",
      benefits: ""
    });
    setShowTierModal(true);
  };
  const handleSaveTier = () => {
    if (!tierForm.name.trim()) {
      toast.warning("Le nom du niveau est obligatoire");
      return;
    }
    const newTier = {
      id: editingTier?.id || `tier_${Date.now()}`,
      name: tierForm.name,
      icon: tierForm.icon || "⭐",
      minPoints: tierForm.minPoints,
      discount: tierForm.discount,
      color: tierForm.color,
      benefits: tierForm.benefits.split(",").map((b) => b.trim()).filter((b) => b)
    };
    let newTiers;
    if (editingTier) {
      newTiers = tiers.map((t) => t.id === editingTier.id ? newTier : t);
    } else {
      newTiers = [...tiers, newTier];
    }
    newTiers.sort((a, b) => a.minPoints - b.minPoints);
    saveTiers(newTiers);
    toast.success(editingTier ? "Niveau modifié" : "Niveau créé");
    setShowTierModal(false);
  };
  const handleDeleteTier = (tierId) => {
    if (tiers.length <= 1) {
      toast.warning("Vous devez avoir au moins un niveau");
      return;
    }
    setTierToDelete(tierId);
    setShowDeleteConfirm(true);
  };
  const confirmDeleteTier = () => {
    if (tierToDelete) {
      const newTiers = tiers.filter((t) => t.id !== tierToDelete);
      saveTiers(newTiers);
      toast.success("Niveau supprimé");
    }
    setShowDeleteConfirm(false);
    setTierToDelete(null);
  };
  const formatNumber = (val) => new Intl.NumberFormat("fr-FR").format(val);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.loyaltyProgram, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.headerActions, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$1.settingsBtn, onClick: () => setShowSettingsModal(true), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 18 }),
      " Paramètres du système"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.statsRow, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.statCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.statValue, children: totalMembers }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.statLabel, children: "Membres fidélité" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.statCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.statValue, children: formatNumber(totalPointsIssued) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.statLabel, children: "Points distribués" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.statCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.statValue, children: avgPointsPerCustomer }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.statLabel, children: "Moyenne/client" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.conversionBox, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { size: 24 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Système de points:" }),
        " 1 point = ",
        settings.pointsPerAmount,
        " ",
        settings.currency,
        " dépensés",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.conversionNote, children: "Les points sont crédités automatiquement à chaque achat" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles$1.editConversionBtn, onClick: () => setShowSettingsModal(true), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { size: 16 }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.section, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.sectionHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 20 }),
          " Niveaux de fidélité"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$1.addTierBtn, onClick: handleNewTier, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
          " Ajouter un niveau"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.tiersGrid, children: tiers.map((tier) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: styles$1.tierCard,
          style: { borderTopColor: tier.color },
          onClick: () => setSelectedTier(selectedTier?.id === tier.id ? null : tier),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.tierActions, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
                e.stopPropagation();
                handleEditTier(tier);
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { size: 14 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
                e.stopPropagation();
                handleDeleteTier(tier.id);
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.tierIcon, children: tier.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: styles$1.tierName, children: tier.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.tierPoints, children: tier.minPoints > 0 ? `${formatNumber(tier.minPoints)}+ pts` : "Départ" }),
            tier.discount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.tierDiscount, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Percent, { size: 12 }),
              " ",
              tier.discount,
              "% remise"
            ] }),
            selectedTier?.id === tier.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.tierBenefits, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Avantages:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: tier.benefits.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: b }, i)) })
            ] })
          ]
        },
        tier.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.section, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { size: 20 }),
        " Top clients fidèles"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.leaderboard, children: topCustomers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.emptyState, children: "Aucun client avec des points" }) : topCustomers.map((customer, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.leaderRow, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.rank, children: index === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { size: 20, className: styles$1.crown }) : `#${index + 1}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.customerInfo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.customerName, children: customer.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.customerTier, children: [
            customer.tier.icon,
            " ",
            customer.tier.name
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.customerPoints, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.pointsValue, children: formatNumber(customer.loyaltyPoints) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.pointsLabel, children: "points" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.customerSpent, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 14 }),
          formatCurrency(customer.creditLimit)
        ] })
      ] }, customer.id)) })
    ] }),
    showSettingsModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.overlay, onClick: () => setShowSettingsModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 20 }),
          " Paramètres du système de fidélité"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowSettingsModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.formGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Montant pour 1 point (",
            settings.currency,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              value: settings.pointsPerAmount,
              onChange: (e) => setSettings({ ...settings, pointsPerAmount: parseInt(e.target.value) || 100 }),
              min: "1"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.hint, children: "Ex: Si vous entrez 100, le client gagne 1 point pour chaque 100 DA dépensés" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.formGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Devise" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: settings.currency,
              onChange: (e) => setSettings({ ...settings, currency: e.target.value }),
              placeholder: "DA"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.formGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles$1.checkboxLabel, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: settings.enabled,
              onChange: (e) => setSettings({ ...settings, enabled: e.target.checked })
            }
          ),
          "Activer le système de fidélité"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowSettingsModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$1.confirmBtn, onClick: () => saveSettings(settings), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 18 }),
          " Enregistrer"
        ] })
      ] })
    ] }) }),
    showTierModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.overlay, onClick: () => setShowTierModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: editingTier ? "Modifier le niveau" : "Nouveau niveau" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowTierModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.modalBody, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.formRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Nom du niveau *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: tierForm.name,
                onChange: (e) => setTierForm({ ...tierForm, name: e.target.value }),
                placeholder: "Ex: Or"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Icône (emoji)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: tierForm.icon,
                onChange: (e) => setTierForm({ ...tierForm, icon: e.target.value }),
                placeholder: "🥇"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.formRow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Points minimum" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                value: tierForm.minPoints,
                onChange: (e) => setTierForm({ ...tierForm, minPoints: parseInt(e.target.value) || 0 }),
                min: "0"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.formGroup, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Remise (%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                value: tierForm.discount,
                onChange: (e) => setTierForm({ ...tierForm, discount: parseInt(e.target.value) || 0 }),
                min: "0",
                max: "100"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.formGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Couleur" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "color",
              value: tierForm.color,
              onChange: (e) => setTierForm({ ...tierForm, color: e.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.formGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Avantages (séparés par des virgules)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: tierForm.benefits,
              onChange: (e) => setTierForm({ ...tierForm, benefits: e.target.value }),
              placeholder: "Ex: 5% de remise, Livraison gratuite, Cadeaux"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowTierModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles$1.confirmBtn, onClick: handleSaveTier, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 18 }),
          " ",
          editingTier ? "Enregistrer" : "Créer"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmModal,
      {
        isOpen: showDeleteConfirm,
        title: "Supprimer le niveau",
        message: "Êtes-vous sûr de vouloir supprimer ce niveau de fidélité ?",
        confirmText: "Supprimer",
        cancelText: "Annuler",
        variant: "danger",
        onConfirm: confirmDeleteTier,
        onCancel: () => setShowDeleteConfirm(false)
      }
    )
  ] });
};
const customersHub = "_customersHub_g90fz_5";
const header = "_header_g90fz_23";
const headerLeft = "_headerLeft_g90fz_32";
const headerIcon = "_headerIcon_g90fz_38";
const statsRow = "_statsRow_g90fz_79";
const statCard = "_statCard_g90fz_86";
const warning = "_warning_g90fz_103";
const statValue = "_statValue_g90fz_108";
const statLabel = "_statLabel_g90fz_115";
const tabsNav = "_tabsNav_g90fz_122";
const tabBtn = "_tabBtn_g90fz_132";
const active = "_active_g90fz_152";
const badge = "_badge_g90fz_158";
const tabContent = "_tabContent_g90fz_173";
const styles = {
  customersHub,
  header,
  headerLeft,
  headerIcon,
  statsRow,
  statCard,
  warning,
  statValue,
  statLabel,
  tabsNav,
  tabBtn,
  active,
  badge,
  tabContent
};
const CustomersHub = () => {
  const { formatCurrency } = useSettings();
  const { customers, getTotalCredit, getLoyalCustomers } = useCustomersStore();
  const [activeTab, setActiveTab] = reactExports.useState("customers");
  const totalCredit = getTotalCredit();
  const loyalCustomersCount = getLoyalCustomers(1e3).length;
  const creditAlerts = customers.filter((c) => c.currentCredit > c.creditLimit * 0.8).length;
  const tabs = [
    { id: "customers", label: "Liste Clients", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 20 }), component: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomersList, {}) },
    { id: "credit", label: "Crédit / Ardoise", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 20 }), badge: creditAlerts > 0 ? creditAlerts : void 0, component: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditManagement, {}) },
    { id: "loyalty", label: "Fidélité", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { size: 20 }), component: /* @__PURE__ */ jsxRuntimeExports.jsx(LoyaltyProgram, {}) }
  ];
  const activeTabData = reactExports.useMemo(() => tabs.find((t) => t.id === activeTab), [activeTab, tabs]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.customersHub, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.header, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.headerLeft, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 32, className: styles.headerIcon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Gestion Clients" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Fidélisation et suivi des clients" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.headerActions })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.statsRow, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.statCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statValue, children: customers.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statLabel, children: "Clients enregistrés" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.statCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statValue, children: loyalCustomersCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statLabel, children: "Clients fidèles" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles.statCard} ${totalCredit > 0 ? styles.warning : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statValue, children: formatCurrency(totalCredit) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statLabel, children: "Crédit total en cours" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.statCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statValue, children: "+0%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statLabel, children: "Croissance mensuelle" })
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
  CustomersHub as Customers,
  CustomersHub,
  CustomersHub as default
};

import { j as jsxRuntimeExports } from "./vendor-state-DFI86SKa.js";
import { r as reactExports } from "./vendor-react-Df__x13C.js";
import { a as useAuthStore, f as useToast, D as DEFAULT_MODULE_ACCESS, R as ROLE_LABELS, A as ALL_MODULES, M as MODULE_LABELS } from "./index-BbOgUw3k.js";
import { J as Shield, U as Users, af as Plus, r as Search, aN as Mail, aM as Phone, b7 as LayoutGrid, ad as UserCheck, b8 as UserX, aq as Pen, K as Key, v as Trash2, X, T as TriangleAlert, c as Check, b6 as EyeOff, a5 as Eye } from "./vendor-ui-DiXyqbDT.js";
import "./vendor-i18n-DeCNyroL.js";
const usersManagement = "_usersManagement_3dikb_1";
const accessDenied = "_accessDenied_3dikb_8";
const header = "_header_3dikb_29";
const headerLeft = "_headerLeft_3dikb_36";
const headerIcon = "_headerIcon_3dikb_42";
const addBtn = "_addBtn_3dikb_59";
const toolbar = "_toolbar_3dikb_80";
const searchBox = "_searchBox_3dikb_84";
const rolesSummary = "_rolesSummary_3dikb_116";
const roleCard = "_roleCard_3dikb_124";
const roleColor = "_roleColor_3dikb_135";
const roleInfo = "_roleInfo_3dikb_141";
const roleName = "_roleName_3dikb_146";
const roleCount = "_roleCount_3dikb_151";
const usersList = "_usersList_3dikb_158";
const table = "_table_3dikb_165";
const inactive = "_inactive_3dikb_192";
const userCell = "_userCell_3dikb_197";
const userAvatar = "_userAvatar_3dikb_203";
const userInfo = "_userInfo_3dikb_215";
const userName = "_userName_3dikb_221";
const currentBadge = "_currentBadge_3dikb_226";
const contactCell = "_contactCell_3dikb_236";
const email = "_email_3dikb_242";
const phone = "_phone_3dikb_243";
const roleBadge = "_roleBadge_3dikb_257";
const statusBtn = "_statusBtn_3dikb_268";
const active = "_active_3dikb_281";
const actions = "_actions_3dikb_310";
const actionBtn = "_actionBtn_3dikb_315";
const danger = "_danger_3dikb_334";
const modalOverlay = "_modalOverlay_3dikb_340";
const modal = "_modal_3dikb_340";
const smallModal = "_smallModal_3dikb_374";
const dangerModal = "_dangerModal_3dikb_378";
const modalHeader = "_modalHeader_3dikb_378";
const closeBtn = "_closeBtn_3dikb_413";
const modalBody = "_modalBody_3dikb_432";
const modalFooter = "_modalFooter_3dikb_437";
const errorMessage = "_errorMessage_3dikb_447";
const formGrid = "_formGrid_3dikb_461";
const formField = "_formField_3dikb_467";
const passwordInput = "_passwordInput_3dikb_495";
const roleSelector = "_roleSelector_3dikb_527";
const roleOption = "_roleOption_3dikb_533";
const selected = "_selected_3dikb_550";
const roleOptionColor = "_roleOptionColor_3dikb_554";
const roleOptionContent = "_roleOptionContent_3dikb_561";
const roleOptionName = "_roleOptionName_3dikb_567";
const roleOptionDesc = "_roleOptionDesc_3dikb_573";
const checkboxLabel = "_checkboxLabel_3dikb_583";
const cancelBtn = "_cancelBtn_3dikb_597";
const saveBtn = "_saveBtn_3dikb_614";
const deleteBtn = "_deleteBtn_3dikb_634";
const passwordInfo = "_passwordInfo_3dikb_654";
const deleteWarning = "_deleteWarning_3dikb_664";
const deleteNote = "_deleteNote_3dikb_682";
const moduleBadge = "_moduleBadge_3dikb_689";
const customBadge = "_customBadge_3dikb_701";
const moduleAccessHeader = "_moduleAccessHeader_3dikb_712";
const resetBtn = "_resetBtn_3dikb_728";
const moduleAccessInfo = "_moduleAccessInfo_3dikb_744";
const customNote = "_customNote_3dikb_750";
const moduleGrid = "_moduleGrid_3dikb_756";
const moduleCheckbox = "_moduleCheckbox_3dikb_762";
const checked = "_checked_3dikb_779";
const checkboxMark = "_checkboxMark_3dikb_788";
const moduleName = "_moduleName_3dikb_807";
const styles = {
  usersManagement,
  accessDenied,
  header,
  headerLeft,
  headerIcon,
  addBtn,
  toolbar,
  searchBox,
  rolesSummary,
  roleCard,
  roleColor,
  roleInfo,
  roleName,
  roleCount,
  usersList,
  table,
  inactive,
  userCell,
  userAvatar,
  userInfo,
  userName,
  currentBadge,
  contactCell,
  email,
  phone,
  roleBadge,
  statusBtn,
  active,
  actions,
  actionBtn,
  danger,
  modalOverlay,
  modal,
  smallModal,
  dangerModal,
  modalHeader,
  closeBtn,
  modalBody,
  modalFooter,
  errorMessage,
  formGrid,
  formField,
  passwordInput,
  roleSelector,
  roleOption,
  selected,
  roleOptionColor,
  roleOptionContent,
  roleOptionName,
  roleOptionDesc,
  checkboxLabel,
  cancelBtn,
  saveBtn,
  deleteBtn,
  passwordInfo,
  deleteWarning,
  deleteNote,
  moduleBadge,
  customBadge,
  moduleAccessHeader,
  resetBtn,
  moduleAccessInfo,
  customNote,
  moduleGrid,
  moduleCheckbox,
  checked,
  checkboxMark,
  moduleName
};
const ROLE_COLORS = {
  owner: "#8B5CF6",
  manager: "#3B82F6",
  cashier: "#10B981",
  stock_manager: "#F59E0B",
  accountant: "#EC4899"
};
const ROLE_DESCRIPTIONS = {
  owner: "Accès total à toutes les fonctionnalités",
  manager: "Gestion complète sauf utilisateurs",
  cashier: "Accès au POS et ventes uniquement",
  stock_manager: "Gestion des stocks et inventaire",
  accountant: "Accès aux rapports et trésorerie"
};
const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "cashier",
  password: "",
  confirmPassword: "",
  isActive: true,
  moduleAccess: [],
  useCustomAccess: false
};
const UsersManagement = () => {
  const { user: currentUser, allUsers, createUser, updateUser, deleteUser, hasPermission } = useAuthStore();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [showAddModal, setShowAddModal] = reactExports.useState(false);
  const [showEditModal, setShowEditModal] = reactExports.useState(false);
  const [showPasswordModal, setShowPasswordModal] = reactExports.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = reactExports.useState(false);
  const [selectedUser, setSelectedUser] = reactExports.useState(null);
  const [formData, setFormData] = reactExports.useState(initialFormData);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const canManageUsers = hasPermission("manage_users");
  const filteredUsers = allUsers.filter(
    (u) => u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  reactExports.useEffect(() => {
    if (!formData.useCustomAccess) {
      setFormData((prev) => ({
        ...prev,
        moduleAccess: [...DEFAULT_MODULE_ACCESS[prev.role]]
      }));
    }
  }, [formData.role, formData.useCustomAccess]);
  const handleOpenAdd = () => {
    const newFormData = {
      ...initialFormData,
      moduleAccess: [...DEFAULT_MODULE_ACCESS["cashier"]]
    };
    setFormData(newFormData);
    setError(null);
    setShowAddModal(true);
  };
  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    const hasCustomAccess = user.moduleAccess && user.moduleAccess.length > 0;
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      password: "",
      confirmPassword: "",
      isActive: user.isActive,
      moduleAccess: hasCustomAccess ? [...user.moduleAccess] : [...DEFAULT_MODULE_ACCESS[user.role]],
      useCustomAccess: !!hasCustomAccess
    });
    setError(null);
    setShowEditModal(true);
  };
  const handleOpenPassword = (user) => {
    setSelectedUser(user);
    setFormData({ ...initialFormData, password: "", confirmPassword: "" });
    setError(null);
    setShowPasswordModal(true);
  };
  const handleOpenDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };
  const handleToggleModule = (moduleId) => {
    setFormData((prev) => {
      const newAccess = prev.moduleAccess.includes(moduleId) ? prev.moduleAccess.filter((m) => m !== moduleId) : [...prev.moduleAccess, moduleId];
      return { ...prev, moduleAccess: newAccess, useCustomAccess: true };
    });
  };
  const handleResetToRoleDefaults = () => {
    setFormData((prev) => ({
      ...prev,
      moduleAccess: [...DEFAULT_MODULE_ACCESS[prev.role]],
      useCustomAccess: false
    }));
  };
  const handleAddUser = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    const success = createUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      isActive: formData.isActive,
      twoFactorEnabled: false,
      password: formData.password,
      moduleAccess: formData.useCustomAccess ? formData.moduleAccess : void 0
    });
    if (success) {
      setShowAddModal(false);
      setFormData(initialFormData);
      toast.success(`Utilisateur ${formData.firstName} créé avec succès`);
    } else {
      setError("Cet email est déjà utilisé");
      toast.error("Erreur lors de la création");
    }
  };
  const handleUpdateUser = () => {
    if (!selectedUser) return;
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }
    updateUser(selectedUser.id, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      isActive: formData.isActive,
      moduleAccess: formData.useCustomAccess ? formData.moduleAccess : void 0
    });
    setShowEditModal(false);
    setSelectedUser(null);
    toast.success(`Utilisateur ${formData.firstName} mis à jour`);
  };
  const handleChangePassword = () => {
    if (!selectedUser) return;
    if (!formData.password || formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    toast.success("Mot de passe modifié avec succès!");
    setShowPasswordModal(false);
    setSelectedUser(null);
  };
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    deleteUser(selectedUser.id);
    setShowDeleteConfirm(false);
    setSelectedUser(null);
    toast.info("Utilisateur supprimé");
  };
  const handleToggleActive = (user) => {
    updateUser(user.id, { isActive: !user.isActive });
  };
  const getUserModuleCount = (user) => {
    if (user.role === "owner") return ALL_MODULES.length;
    if (user.moduleAccess && user.moduleAccess.length > 0) {
      return user.moduleAccess.length;
    }
    return DEFAULT_MODULE_ACCESS[user.role].length;
  };
  if (!canManageUsers) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.accessDenied, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 48 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Accès refusé" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Vous n'avez pas les permissions nécessaires pour gérer les utilisateurs." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.usersManagement, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.header, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.headerLeft, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 28, className: styles.headerIcon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Gestion des Utilisateurs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            allUsers.length,
            " utilisateur",
            allUsers.length > 1 ? "s" : "",
            " au total"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.addBtn, onClick: handleOpenAdd, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
        "Nouvel utilisateur"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.toolbar, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.searchBox, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          placeholder: "Rechercher un utilisateur...",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value)
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.rolesSummary, children: Object.keys(ROLE_LABELS).map((role) => {
      const count = allUsers.filter((u) => u.role === role).length;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.roleCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: styles.roleColor,
            style: { backgroundColor: ROLE_COLORS[role] }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.roleInfo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.roleName, children: ROLE_LABELS[role] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.roleCount, children: count })
        ] })
      ] }, role);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.usersList, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: styles.table, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Utilisateur" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Contact" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Rôle" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Modules" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Statut" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filteredUsers.map((user) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: !user.isActive ? styles.inactive : "", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.userCell, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: styles.userAvatar,
              style: { backgroundColor: ROLE_COLORS[user.role] },
              children: [
                user.firstName.charAt(0),
                user.lastName.charAt(0)
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.userInfo, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.userName, children: [
              user.firstName,
              " ",
              user.lastName
            ] }),
            user.id === currentUser?.id && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.currentBadge, children: "Vous" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.contactCell, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.email, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 14 }),
            user.email
          ] }),
          user.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.phone, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 14 }),
            user.phone
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: styles.roleBadge,
            style: { backgroundColor: `${ROLE_COLORS[user.role]}20`, color: ROLE_COLORS[user.role] },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 12 }),
              ROLE_LABELS[user.role]
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.moduleBadge, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { size: 12 }),
          getUserModuleCount(user),
          " / ",
          ALL_MODULES.length,
          user.moduleAccess && user.moduleAccess.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.customBadge, children: "Personnalisé" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `${styles.statusBtn} ${user.isActive ? styles.active : styles.inactive}`,
            onClick: () => handleToggleActive(user),
            disabled: user.id === currentUser?.id,
            children: user.isActive ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { size: 14 }),
              "Actif"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { size: 14 }),
              "Inactif"
            ] })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.actions, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: styles.actionBtn,
              onClick: () => handleOpenEdit(user),
              title: "Modifier",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 16 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: styles.actionBtn,
              onClick: () => handleOpenPassword(user),
              title: "Changer mot de passe",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { size: 16 })
            }
          ),
          user.id !== currentUser?.id && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `${styles.actionBtn} ${styles.danger}`,
              onClick: () => handleOpenDelete(user),
              title: "Supprimer",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 })
            }
          )
        ] }) })
      ] }, user.id)) })
    ] }) }),
    (showAddModal || showEditModal) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.modalOverlay, onClick: () => {
      setShowAddModal(false);
      setShowEditModal(false);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: showAddModal ? "Nouvel utilisateur" : "Modifier utilisateur" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: styles.closeBtn,
            onClick: () => {
              setShowAddModal(false);
              setShowEditModal(false);
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalBody, children: [
        error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.errorMessage, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 16 }),
          error
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGrid, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formField, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Prénom *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: formData.firstName,
                onChange: (e) => setFormData({ ...formData, firstName: e.target.value }),
                placeholder: "Prénom"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formField, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Nom *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: formData.lastName,
                onChange: (e) => setFormData({ ...formData, lastName: e.target.value }),
                placeholder: "Nom"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formField, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Email *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "email",
              value: formData.email,
              onChange: (e) => setFormData({ ...formData, email: e.target.value }),
              placeholder: "email@supermarket.dz"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formField, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Téléphone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "tel",
              value: formData.phone,
              onChange: (e) => setFormData({ ...formData, phone: e.target.value }),
              placeholder: "+213 555 123 456"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formField, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Rôle *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.roleSelector, children: Object.keys(ROLE_LABELS).map((role) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: `${styles.roleOption} ${formData.role === role ? styles.selected : ""}`,
              onClick: () => setFormData({ ...formData, role }),
              style: {
                borderColor: formData.role === role ? ROLE_COLORS[role] : void 0,
                backgroundColor: formData.role === role ? `${ROLE_COLORS[role]}15` : void 0
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: styles.roleOptionColor,
                    style: { backgroundColor: ROLE_COLORS[role] }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.roleOptionContent, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.roleOptionName, children: ROLE_LABELS[role] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.roleOptionDesc, children: ROLE_DESCRIPTIONS[role] })
                ] }),
                formData.role === role && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 18 })
              ]
            },
            role
          )) })
        ] }),
        formData.role !== "owner" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formField, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.moduleAccessHeader, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { size: 16 }),
              "Accès aux modules"
            ] }),
            formData.useCustomAccess && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: styles.resetBtn,
                onClick: handleResetToRoleDefaults,
                children: "Réinitialiser par défaut"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: styles.moduleAccessInfo, children: [
            "Cochez les modules auxquels cet utilisateur aura accès.",
            formData.useCustomAccess && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.customNote, children: " (Accès personnalisé)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.moduleGrid, children: ALL_MODULES.filter((m) => m !== "users").map((moduleId) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              className: `${styles.moduleCheckbox} ${formData.moduleAccess.includes(moduleId) ? styles.checked : ""}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: formData.moduleAccess.includes(moduleId),
                    onChange: () => handleToggleModule(moduleId)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.checkboxMark, children: formData.moduleAccess.includes(moduleId) && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.moduleName, children: MODULE_LABELS[moduleId] })
              ]
            },
            moduleId
          )) })
        ] }),
        showAddModal && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGrid, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formField, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Mot de passe *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.passwordInput, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: showPassword ? "text" : "password",
                  value: formData.password,
                  onChange: (e) => setFormData({ ...formData, password: e.target.value }),
                  placeholder: "Minimum 6 caractères"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowPassword(!showPassword),
                  children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 18 })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formField, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Confirmer *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: showPassword ? "text" : "password",
                value: formData.confirmPassword,
                onChange: (e) => setFormData({ ...formData, confirmPassword: e.target.value }),
                placeholder: "Confirmer le mot de passe"
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.formField, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles.checkboxLabel, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: formData.isActive,
              onChange: (e) => setFormData({ ...formData, isActive: e.target.checked })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Compte actif" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: styles.cancelBtn,
            onClick: () => {
              setShowAddModal(false);
              setShowEditModal(false);
            },
            children: "Annuler"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: styles.saveBtn,
            onClick: showAddModal ? handleAddUser : handleUpdateUser,
            children: showAddModal ? "Créer utilisateur" : "Enregistrer"
          }
        )
      ] })
    ] }) }),
    showPasswordModal && selectedUser && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.modalOverlay, onClick: () => setShowPasswordModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles.modal} ${styles.smallModal}`, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Changer le mot de passe" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles.closeBtn, onClick: () => setShowPasswordModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalBody, children: [
        error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.errorMessage, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 16 }),
          error
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: styles.passwordInfo, children: [
          "Modifier le mot de passe pour ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
            selectedUser.firstName,
            " ",
            selectedUser.lastName
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formField, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Nouveau mot de passe *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.passwordInput, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: showPassword ? "text" : "password",
                value: formData.password,
                onChange: (e) => setFormData({ ...formData, password: e.target.value }),
                placeholder: "Minimum 6 caractères"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 18 }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formField, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Confirmer le mot de passe *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: showPassword ? "text" : "password",
              value: formData.confirmPassword,
              onChange: (e) => setFormData({ ...formData, confirmPassword: e.target.value }),
              placeholder: "Confirmer le mot de passe"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles.cancelBtn, onClick: () => setShowPasswordModal(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.saveBtn, onClick: handleChangePassword, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { size: 16 }),
          "Changer le mot de passe"
        ] })
      ] })
    ] }) }),
    showDeleteConfirm && selectedUser && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.modalOverlay, onClick: () => setShowDeleteConfirm(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles.modal} ${styles.smallModal} ${styles.dangerModal}`, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Supprimer l'utilisateur" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles.closeBtn, onClick: () => setShowDeleteConfirm(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.modalBody, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.deleteWarning, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 40 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "Êtes-vous sûr de vouloir supprimer l'utilisateur",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
            selectedUser.firstName,
            " ",
            selectedUser.lastName
          ] }),
          " ?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles.deleteNote, children: "Cette action est irréversible." })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles.cancelBtn, onClick: () => setShowDeleteConfirm(false), children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.deleteBtn, onClick: handleDeleteUser, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 }),
          "Supprimer définitivement"
        ] })
      ] })
    ] }) })
  ] });
};
export {
  UsersManagement,
  UsersManagement as default
};

import { j as jsxRuntimeExports } from "./vendor-state-DFI86SKa.js";
import { u as useNavigate, r as reactExports, R as React } from "./vendor-react-Df__x13C.js";
import { a9 as ArrowLeft, o as CircleQuestionMark, b2 as BookOpen, ac as Keyboard, b3 as MessageCircle, I as Info, r as Search, H as ChevronDown, h as ChevronRight, i as ShoppingCart, P as Package, O as DollarSign, U as Users, m as ChartColumn, f as Settings, aF as Play, a as CircleCheckBig, b4 as Send, aN as Mail, aM as Phone, b5 as ExternalLink, C as CircleAlert, F as FileText } from "./vendor-ui-DiXyqbDT.js";
const help = "_help_rvx9_1";
const header = "_header_rvx9_10";
const headerLeft = "_headerLeft_rvx9_19";
const backBtn = "_backBtn_rvx9_25";
const tabNav = "_tabNav_rvx9_58";
const tab = "_tab_rvx9_58";
const active = "_active_rvx9_86";
const content = "_content_rvx9_92";
const faqSection = "_faqSection_rvx9_99";
const searchBar = "_searchBar_rvx9_104";
const faqList = "_faqList_rvx9_131";
const faqCategory = "_faqCategory_rvx9_137";
const categoryHeader = "_categoryHeader_rvx9_144";
const categoryIcon = "_categoryIcon_rvx9_161";
const categoryName = "_categoryName_rvx9_165";
const questionCount = "_questionCount_rvx9_172";
const questionsList = "_questionsList_rvx9_184";
const faqItem = "_faqItem_rvx9_188";
const questionHeader = "_questionHeader_rvx9_196";
const answer = "_answer_rvx9_228";
const guidesSection = "_guidesSection_rvx9_240";
const guidesGrid = "_guidesGrid_rvx9_245";
const guideCard = "_guideCard_rvx9_251";
const guideHeader = "_guideHeader_rvx9_265";
const guideIcon = "_guideIcon_rvx9_271";
const guideSteps = "_guideSteps_rvx9_295";
const step = "_step_rvx9_302";
const stepNumber = "_stepNumber_rvx9_310";
const guideAction = "_guideAction_rvx9_323";
const shortcutsSection = "_shortcutsSection_rvx9_347";
const shortcutCategory = "_shortcutCategory_rvx9_355";
const shortcutsList = "_shortcutsList_rvx9_365";
const shortcutItem = "_shortcutItem_rvx9_371";
const keys = "_keys_rvx9_381";
const action = "_action_rvx9_409";
const contactSection = "_contactSection_rvx9_415";
const contactGrid = "_contactGrid_rvx9_420";
const contactForm = "_contactForm_rvx9_426";
const formRow = "_formRow_rvx9_440";
const formGroup = "_formGroup_rvx9_446";
const submitBtn = "_submitBtn_rvx9_485";
const successMessage = "_successMessage_rvx9_507";
const contactInfo = "_contactInfo_rvx9_533";
const contactCard = "_contactCard_rvx9_546";
const emergencyCard = "_emergencyCard_rvx9_586";
const aboutSection = "_aboutSection_rvx9_614";
const aboutHeader = "_aboutHeader_rvx9_619";
const appLogo = "_appLogo_rvx9_627";
const version = "_version_rvx9_647";
const aboutGrid = "_aboutGrid_rvx9_653";
const aboutCard = "_aboutCard_rvx9_660";
const sysInfo = "_sysInfo_rvx9_697";
const sysRow = "_sysRow_rvx9_703";
const linksList = "_linksList_rvx9_725";
const linkItem = "_linkItem_rvx9_731";
const copyright = "_copyright_rvx9_758";
const styles = {
  help,
  header,
  headerLeft,
  backBtn,
  tabNav,
  tab,
  active,
  content,
  faqSection,
  searchBar,
  faqList,
  faqCategory,
  categoryHeader,
  categoryIcon,
  categoryName,
  questionCount,
  questionsList,
  faqItem,
  questionHeader,
  answer,
  guidesSection,
  guidesGrid,
  guideCard,
  guideHeader,
  guideIcon,
  guideSteps,
  step,
  stepNumber,
  guideAction,
  shortcutsSection,
  shortcutCategory,
  shortcutsList,
  shortcutItem,
  keys,
  action,
  contactSection,
  contactGrid,
  contactForm,
  formRow,
  formGroup,
  submitBtn,
  successMessage,
  contactInfo,
  contactCard,
  emergencyCard,
  aboutSection,
  aboutHeader,
  appLogo,
  version,
  aboutGrid,
  aboutCard,
  sysInfo,
  sysRow,
  linksList,
  linkItem,
  copyright
};
const faqCategories = [
  {
    id: "pos",
    name: "Point de Vente (Caisse)",
    icon: "🛒",
    questions: [
      {
        q: "Comment ajouter un produit au panier?",
        a: "Scannez le code-barres du produit ou utilisez la recherche en haut de l'écran. Vous pouvez aussi cliquer sur les produits dans la grille. Les produits favoris apparaissent en premier pour un accès rapide."
      },
      {
        q: "Comment appliquer une remise?",
        a: "Cliquez sur le bouton 'Remise' en bas du panier, puis entrez le pourcentage de remise souhaité (0-100%). La remise sera appliquée au sous-total."
      },
      {
        q: "Comment mettre une vente en attente?",
        a: "Cliquez sur le bouton 'Attente' pour mettre la vente en pause. Vous pouvez ensuite la reprendre plus tard en cliquant sur 'Ventes en attente'."
      },
      {
        q: "Comment annuler une vente?",
        a: "Cliquez sur le bouton 'Annuler' pour vider le panier complètement. Une confirmation vous sera demandée."
      },
      {
        q: "Comment changer le mode de paiement?",
        a: "Dans la fenêtre de paiement, sélectionnez le mode souhaité: Espèces, CIB, Dahabia ou Crédit client."
      }
    ]
  },
  {
    id: "inventory",
    name: "Gestion de Stock",
    icon: "📦",
    questions: [
      {
        q: "Comment ajouter un nouveau produit?",
        a: "Allez dans Inventaire > Ajouter Produit. Remplissez les informations: nom, catégorie, prix d'achat, prix de vente, stock initial et stock minimum."
      },
      {
        q: "Comment recevoir une livraison?",
        a: "Allez dans Inventaire > Réception. Scannez ou recherchez les produits, entrez les quantités reçues (en packs ou unités), puis validez la réception."
      },
      {
        q: "Que signifient les alertes de stock?",
        a: "Rouge = Rupture de stock (0 unités). Orange = Stock bas (en dessous du minimum). Jaune = Produit proche de la date de péremption."
      },
      {
        q: "Comment faire un inventaire?",
        a: "Allez dans Inventaire > Inventaire. Vous pouvez compter les produits par catégorie ou scanner chaque produit pour vérifier les quantités réelles."
      }
    ]
  },
  {
    id: "treasury",
    name: "Trésorerie",
    icon: "💰",
    questions: [
      {
        q: "Comment ouvrir la caisse?",
        a: "Cliquez sur 'Ouvrir la caisse' et entrez le montant du fond de caisse (argent liquide au démarrage)."
      },
      {
        q: "Comment enregistrer une dépense?",
        a: "Cliquez sur 'Nouvelle dépense', sélectionnez la catégorie, entrez le montant et la description."
      },
      {
        q: "Comment clôturer la caisse?",
        a: "Cliquez sur 'Clôturer', comptez l'argent réel dans la caisse et entrez le montant. Le système calculera automatiquement l'écart."
      },
      {
        q: "Qu'est-ce que le rapport Z?",
        a: "Le rapport Z est le récapitulatif de fin de journée avec toutes les ventes, dépenses et mouvements de caisse. Il peut être imprimé."
      }
    ]
  },
  {
    id: "customers",
    name: "Clients & Fidélité",
    icon: "👥",
    questions: [
      {
        q: "Comment créer un compte client?",
        a: "Allez dans Clients > Nouveau client. Remplissez le nom, téléphone (optionnel) et type de client (Particulier/Professionnel)."
      },
      {
        q: "Comment fonctionne le crédit client?",
        a: "Un client avec un compte peut acheter à crédit. Le solde dû apparaît dans sa fiche. Vous pouvez enregistrer des paiements partiels."
      },
      {
        q: "Comment fonctionne la fidélité?",
        a: "Les clients accumulent des points à chaque achat (1 point = 100 DA). Les points peuvent être échangés contre des remises."
      }
    ]
  },
  {
    id: "settings",
    name: "Paramètres",
    icon: "⚙️",
    questions: [
      {
        q: "Comment changer le taux de TVA?",
        a: "Allez dans Paramètres > Magasin. Vous pouvez activer/désactiver la TVA et choisir le taux (9% ou 19%)."
      },
      {
        q: "Comment configurer l'imprimante?",
        a: "Allez dans Paramètres > Impression. Sélectionnez votre imprimante thermique et configurez la largeur du papier (58mm ou 80mm)."
      },
      {
        q: "Comment sauvegarder mes données?",
        a: "Allez dans Paramètres > Sauvegarde. Vous pouvez exporter les paramètres et les données vers un fichier JSON."
      }
    ]
  }
];
const keyboardShortcuts = [
  {
    category: "Navigation",
    shortcuts: [
      { keys: ["Ctrl", "P"], action: "Ouvrir la Caisse (POS)" },
      { keys: ["Ctrl", "I"], action: "Inventaire" },
      { keys: ["Ctrl", "T"], action: "Trésorerie" },
      { keys: ["Ctrl", "R"], action: "Rapports" },
      { keys: ["Ctrl", ","], action: "Paramètres" },
      { keys: ["Esc"], action: "Fermer les modals" }
    ]
  },
  {
    category: "Point de Vente",
    shortcuts: [
      { keys: ["F1"], action: "Rechercher produit" },
      { keys: ["F2"], action: "Appliquer remise" },
      { keys: ["F3"], action: "Mettre en attente" },
      { keys: ["F4"], action: "Reprendre vente" },
      { keys: ["F8"], action: "Encaisser" },
      { keys: ["F10"], action: "Annuler vente" },
      { keys: ["↑", "↓"], action: "Parcourir les produits" },
      { keys: ["+", "-"], action: "Modifier quantité" }
    ]
  },
  {
    category: "Général",
    shortcuts: [
      { keys: ["Ctrl", "S"], action: "Sauvegarder" },
      { keys: ["Ctrl", "Z"], action: "Annuler" },
      { keys: ["Ctrl", "F"], action: "Rechercher" },
      { keys: ["Ctrl", "H"], action: "Ouvrir l'aide" }
    ]
  }
];
const moduleGuides = [
  {
    id: "pos",
    title: "Point de Vente",
    icon: ShoppingCart,
    description: "Encaissement rapide, gestion du panier, modes de paiement",
    color: "#4285F4",
    steps: [
      "Scanner ou rechercher les produits",
      "Ajuster les quantités si nécessaire",
      "Appliquer une remise (optionnel)",
      "Sélectionner le mode de paiement",
      "Confirmer et imprimer le ticket"
    ]
  },
  {
    id: "inventory",
    title: "Inventaire",
    icon: Package,
    description: "Produits, stock, réceptions, alertes",
    color: "#34C759",
    steps: [
      "Ajouter et modifier les produits",
      "Recevoir les livraisons fournisseurs",
      "Suivre les niveaux de stock",
      "Gérer les dates de péremption",
      "Faire des inventaires réguliers"
    ]
  },
  {
    id: "treasury",
    title: "Trésorerie",
    icon: DollarSign,
    description: "Caisse, dépenses, mouvements, rapports",
    color: "#FFD60A",
    steps: [
      "Ouvrir la caisse avec le fond initial",
      "Enregistrer les dépenses",
      "Suivre les entrées/sorties",
      "Clôturer la caisse en fin de journée",
      "Générer le rapport Z"
    ]
  },
  {
    id: "customers",
    title: "Clients",
    icon: Users,
    description: "Comptes clients, crédit, fidélité",
    color: "#8B5CF6",
    steps: [
      "Créer des comptes clients",
      "Gérer le crédit client",
      "Suivre les points de fidélité",
      "Consulter l'historique d'achats"
    ]
  },
  {
    id: "reports",
    title: "Rapports & IA",
    icon: ChartColumn,
    description: "Analyses, prévisions, intelligence artificielle",
    color: "#06B6D4",
    steps: [
      "Consulter les ventes du jour/semaine/mois",
      "Analyser les tendances",
      "Voir les prévisions IA",
      "Exporter les rapports"
    ]
  },
  {
    id: "settings",
    title: "Paramètres",
    icon: Settings,
    description: "Configuration du magasin et du système",
    color: "#6B7280",
    steps: [
      "Configurer les infos du magasin",
      "Régler la TVA et la devise",
      "Paramétrer l'imprimante",
      "Gérer les sauvegardes"
    ]
  }
];
const Help = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = reactExports.useState("faq");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [expandedFaq, setExpandedFaq] = reactExports.useState(null);
  const [expandedCategory, setExpandedCategory] = reactExports.useState("pos");
  const [contactForm2, setContactForm] = reactExports.useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [contactSent, setContactSent] = reactExports.useState(false);
  const tabs = [
    { id: "faq", label: "FAQ", icon: CircleQuestionMark },
    { id: "guides", label: "Guides", icon: BookOpen },
    { id: "shortcuts", label: "Raccourcis", icon: Keyboard },
    { id: "contact", label: "Contact", icon: MessageCircle },
    { id: "about", label: "À propos", icon: Info }
  ];
  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactForm({ name: "", email: "", subject: "", message: "" });
      setContactSent(false);
    }, 3e3);
  };
  const filteredFaqs = faqCategories.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (q) => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter((cat) => cat.questions.length > 0 || searchQuery === "");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.help, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.header, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.headerLeft, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles.backBtn, onClick: () => navigate("/"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Aide & Support" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Trouvez des réponses à vos questions" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.tabNav, children: tabs.map((tab2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: `${styles.tab} ${activeTab === tab2.id ? styles.active : ""}`,
        onClick: () => setActiveTab(tab2.id),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(tab2.icon, { size: 18 }),
          tab2.label
        ]
      },
      tab2.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.content, children: [
      activeTab === "faq" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.faqSection, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.searchBar, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 20 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: "Rechercher dans la FAQ...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.faqList, children: filteredFaqs.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.faqCategory, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: styles.categoryHeader,
              onClick: () => setExpandedCategory(
                expandedCategory === category.id ? null : category.id
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.categoryIcon, children: category.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.categoryName, children: category.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.questionCount, children: [
                  category.questions.length,
                  " questions"
                ] }),
                expandedCategory === category.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 20 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 20 })
              ]
            }
          ),
          expandedCategory === category.id && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.questionsList, children: category.questions.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.faqItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: styles.questionHeader,
                onClick: () => setExpandedFaq(
                  expandedFaq === `${category.id}-${idx}` ? null : `${category.id}-${idx}`
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleQuestionMark, { size: 16 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.q }),
                  expandedFaq === `${category.id}-${idx}` ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16 })
                ]
              }
            ),
            expandedFaq === `${category.id}-${idx}` && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.answer, children: item.a })
          ] }, idx)) })
        ] }, category.id)) })
      ] }),
      activeTab === "guides" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.guidesSection, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.guidesGrid, children: moduleGuides.map((guide) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: styles.guideCard,
          style: { "--guide-color": guide.color },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.guideHeader, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.guideIcon, children: /* @__PURE__ */ jsxRuntimeExports.jsx(guide.icon, { size: 24 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: guide.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: guide.description })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.guideSteps, children: guide.steps.map((step2, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.step, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.stepNumber, children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: step2 })
            ] }, idx)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.guideAction, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 16 }),
              "Voir le tutoriel"
            ] })
          ]
        },
        guide.id
      )) }) }),
      activeTab === "shortcuts" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.shortcutsSection, children: keyboardShortcuts.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.shortcutCategory, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: category.category }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.shortcutsList, children: category.shortcuts.map((shortcut, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.shortcutItem, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.keys, children: shortcut.keys.map((key, keyIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: key }),
            keyIdx < shortcut.keys.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "+" })
          ] }, keyIdx)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.action, children: shortcut.action })
        ] }, idx)) })
      ] }, category.category)) }),
      activeTab === "contact" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.contactSection, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.contactGrid, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.contactForm, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Envoyer un message" }),
          contactSent ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.successMessage, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 48 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Message envoyé!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Nous vous répondrons dans les 24 heures." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleContactSubmit, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Nom" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: contactForm2.name,
                    onChange: (e) => setContactForm({ ...contactForm2, name: e.target.value }),
                    placeholder: "Votre nom",
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "email",
                    value: contactForm2.email,
                    onChange: (e) => setContactForm({ ...contactForm2, email: e.target.value }),
                    placeholder: "votre@email.com",
                    required: true
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Sujet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: contactForm2.subject,
                  onChange: (e) => setContactForm({ ...contactForm2, subject: e.target.value }),
                  required: true,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Sélectionner un sujet..." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "bug", children: "Signaler un bug" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "feature", children: "Demande de fonctionnalité" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "question", children: "Question générale" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "billing", children: "Facturation" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "other", children: "Autre" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGroup, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Message" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  value: contactForm2.message,
                  onChange: (e) => setContactForm({ ...contactForm2, message: e.target.value }),
                  placeholder: "Décrivez votre problème ou question...",
                  rows: 5,
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: styles.submitBtn, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 18 }),
              "Envoyer le message"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.contactInfo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Autres moyens de nous contacter" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.contactCard, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 24 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:support@igo.dz", children: "support@igo.dz" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.contactCard, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 24 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Téléphone" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "tel:+213550123456", children: "+213 550 123 456" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Lun-Ven 8h-18h" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.contactCard, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 24 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "WhatsApp" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "https://wa.me/213550123456", target: "_blank", rel: "noopener noreferrer", children: [
                "+213 550 123 456",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 14 })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.emergencyCard, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 20 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Support Urgent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Pour les problèmes critiques affectant vos ventes, appelez directement." })
            ] })
          ] })
        ] })
      ] }) }),
      activeTab === "about" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.aboutSection, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.aboutHeader, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.appLogo, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🚀" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "IGO" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles.version, children: "Version 1.0.0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.aboutGrid, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.aboutCard, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "À propos" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "IGO est votre partenaire intelligent de gestion commerciale, conçu spécifiquement pour les supermarchés et épiceries en Algérie. Notre solution intègre la gestion des ventes, des stocks, de la trésorerie et des clients dans une interface moderne et intuitive." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.aboutCard, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Fonctionnalités clés" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Point de vente rapide avec scan de codes-barres" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Gestion de stock en temps réel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Suivi des dates de péremption" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Trésorerie et rapports financiers" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Gestion des clients et fidélité" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Prévisions IA et calendrier algérien" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Fonctionne hors ligne" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.aboutCard, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Informations système" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.sysInfo, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.sysRow, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Version" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "1.0.0" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.sysRow, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Dernière mise à jour" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "4 Janvier 2026" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.sysRow, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Navigateur" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: navigator.userAgent.split(" ").slice(-1)[0] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.sysRow, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Langue" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Français" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.sysRow, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Mode" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Production" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.aboutCard, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Liens utiles" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.linksList, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#", className: styles.linkItem, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 18 }),
                "Conditions d'utilisation",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 14 })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#", className: styles.linkItem, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 18 }),
                "Politique de confidentialité",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 14 })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#", className: styles.linkItem, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 18 }),
                "Notes de version",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 14 })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.copyright, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "© 2026 IGO. Tous droits réservés." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Développé avec ❤️ en Algérie" })
        ] })
      ] })
    ] })
  ] });
};
export {
  Help,
  Help as default
};

import { j as jsxRuntimeExports } from "./vendor-state-DFI86SKa.js";
import { u as useNavigate, r as reactExports, R as React } from "./vendor-react-Df__x13C.js";
import { u as useSettings, a as useAuthStore, o as igoLogo } from "./index-BbOgUw3k.js";
import { b9 as LoaderCircle, a as CircleCheckBig, x as Lock, a4 as Sparkles, g as ChevronLeft, a1 as ArrowRight, J as Shield, aO as MapPin } from "./vendor-ui-DiXyqbDT.js";
import "./vendor-i18n-DeCNyroL.js";
const onboardingContainer = "_onboardingContainer_qq1ii_1";
const glowOrb = "_glowOrb_qq1ii_39";
const onboardingCard = "_onboardingCard_qq1ii_63";
const sidebar = "_sidebar_qq1ii_79";
const logoArea = "_logoArea_qq1ii_88";
const tagline = "_tagline_qq1ii_103";
const steps = "_steps_qq1ii_111";
const stepItem = "_stepItem_qq1ii_128";
const stepIcon = "_stepIcon_qq1ii_136";
const stepText = "_stepText_qq1ii_149";
const stepLabel = "_stepLabel_qq1ii_154";
const stepTitle = "_stepTitle_qq1ii_163";
const active = "_active_qq1ii_170";
const completed = "_completed_qq1ii_185";
const contentArea = "_contentArea_qq1ii_191";
const stepHeader = "_stepHeader_qq1ii_198";
const formGrid = "_formGrid_qq1ii_211";
const inputField = "_inputField_qq1ii_218";
const inputWrapper = "_inputWrapper_qq1ii_232";
const footer = "_footer_qq1ii_256";
const btnNext = "_btnNext_qq1ii_263";
const btnBack = "_btnBack_qq1ii_288";
const loadingOverlay = "_loadingOverlay_qq1ii_304";
const spin = "_spin_qq1ii_317";
const loadingText = "_loadingText_qq1ii_332";
const styles = {
  onboardingContainer,
  glowOrb,
  onboardingCard,
  sidebar,
  logoArea,
  tagline,
  steps,
  stepItem,
  stepIcon,
  stepText,
  stepLabel,
  stepTitle,
  active,
  completed,
  contentArea,
  stepHeader,
  formGrid,
  inputField,
  inputWrapper,
  footer,
  btnNext,
  btnBack,
  loadingOverlay,
  spin,
  loadingText
};
const Onboarding = () => {
  const navigate = useNavigate();
  const { storeSettings, updateStoreSettings } = useSettings();
  const { createUser, login, allUsers } = useAuthStore();
  const [step, setStep] = reactExports.useState(1);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  React.useEffect(() => {
    if (storeSettings.name && allUsers.length > 0) {
      navigate("/", { replace: true });
    }
  }, [storeSettings.name, allUsers.length, navigate]);
  const [formData, setFormData] = reactExports.useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    nif: "",
    rc: "",
    currency: "DZD",
    // Owner user fields
    ownerFirstName: "",
    ownerLastName: "",
    ownerEmail: "",
    ownerPassword: ""
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const handleComplete = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const ownerCreated = createUser({
      email: formData.ownerEmail || `admin@${formData.name.toLowerCase().replace(/\s+/g, "")}.dz`,
      password: formData.ownerPassword || "admin123",
      firstName: formData.ownerFirstName || "Admin",
      lastName: formData.ownerLastName || formData.name,
      phone: formData.phone,
      role: "owner",
      isActive: true,
      twoFactorEnabled: false
    });
    if (ownerCreated) {
      await login(
        formData.ownerEmail || `admin@${formData.name.toLowerCase().replace(/\s+/g, "")}.dz`,
        formData.ownerPassword || "admin123"
      );
    }
    updateStoreSettings({
      name: formData.name,
      address: formData.address,
      city: formData.city,
      phone: formData.phone,
      email: formData.email,
      nif: formData.nif,
      rc: formData.rc,
      currency: formData.currency,
      timezone: "Africa/Algiers",
      tvaEnabled: true,
      tvaRate: 19
    });
  };
  const steps2 = [
    { id: 1, title: "Identité", label: "Etape 01", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 22 }) },
    { id: 2, title: "Localisation", label: "Etape 02", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 22 }) },
    { id: 3, title: "Légal & Fiscal", label: "Etape 03", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 22 }) }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.onboardingContainer, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.glowOrb }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.onboardingCard, children: [
      isSaving && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.loadingOverlay, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: styles.spin, size: 48 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.loadingText, children: "Initialisation d'IGO..." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: styles.sidebar, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.logoArea, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: igoLogo, alt: "IGO", style: { height: 40, marginBottom: 8 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.tagline, children: "Votre partenaire intelligent" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.steps, children: steps2.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `${styles.stepItem} ${step === s.id ? styles.active : ""} ${step > s.id ? styles.completed : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.stepIcon, children: step > s.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 22 }) : s.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.stepText, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.stepLabel, children: s.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.stepTitle, children: s.title })
              ] })
            ]
          },
          s.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 12 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Données privées & sécurisées" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: styles.contentArea, children: [
        step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.stepContent, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: styles.stepHeader, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Commençons par le début" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Donnez un nom et une voix à votre boutique." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGrid, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.inputField, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Nom de l'établissement" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.inputWrapper, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  name: "name",
                  value: formData.name,
                  onChange: handleChange,
                  placeholder: "Ex: Supermarché El Kods",
                  autoFocus: true
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.inputField, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Téléphone professionnel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.inputWrapper, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  name: "phone",
                  value: formData.phone,
                  onChange: handleChange,
                  placeholder: "Ex: 0550 12 34 56"
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.inputField, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Email de contact (Optionnel)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.inputWrapper, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  name: "email",
                  value: formData.email,
                  onChange: handleChange,
                  placeholder: "contact@boutique.dz"
                }
              ) })
            ] })
          ] })
        ] }),
        step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.stepContent, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: styles.stepHeader, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Où vous trouvez-vous ?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Ces informations apparaîtront sur vos tickets de caisse." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGrid, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.inputField, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Adresse physique" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.inputWrapper, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  name: "address",
                  value: formData.address,
                  onChange: handleChange,
                  placeholder: "Ex: 12 Rue des Martyrs",
                  autoFocus: true
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.inputField, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Ville / Wilaya" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.inputWrapper, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  name: "city",
                  value: formData.city,
                  onChange: handleChange,
                  placeholder: "Ex: Alger"
                }
              ) })
            ] })
          ] })
        ] }),
        step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.stepContent, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: styles.stepHeader, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Dernière ligne droite" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Configurez vos mentions légales et votre compte propriétaire." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formGrid, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.inputField, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Registre du Commerce (RC)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.inputWrapper, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  name: "rc",
                  value: formData.rc,
                  onChange: handleChange,
                  placeholder: "Ex: 16/00-1234567B01",
                  autoFocus: true
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.inputField, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Identification Fiscale (NIF)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.inputWrapper, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  name: "nif",
                  value: formData.nif,
                  onChange: handleChange,
                  placeholder: "Ex: 000116012345678"
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { gridColumn: "1 / -1", marginTop: "1rem", marginBottom: "0.5rem" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 18, style: { color: "#00D177" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600, color: "rgba(255,255,255,0.9)" }, children: "Compte administrateur" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: 0, fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }, children: "Ces identifiants seront utilisés pour vous connecter." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.inputField, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Email administrateur *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.inputWrapper, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  name: "ownerEmail",
                  type: "email",
                  value: formData.ownerEmail,
                  onChange: handleChange,
                  placeholder: "admin@votreboutique.dz",
                  required: true
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.inputField, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Mot de passe *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.inputWrapper, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  name: "ownerPassword",
                  type: "password",
                  value: formData.ownerPassword,
                  onChange: handleChange,
                  placeholder: "Minimum 6 caractères",
                  required: true
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { gridColumn: "1 / -1", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "1.5rem", borderRadius: "20px", display: "flex", gap: "1rem", alignItems: "center" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { style: { color: "#10b981" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { margin: 0, fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }, children: [
                "La devise sera fixée sur ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "DZD (DA)" }),
                " et la TVA à ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "19%" }),
                " par défaut."
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: styles.footer, children: [
          step > 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.btnBack, onClick: prevStep, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 20 }),
            " Retour"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
          step < 3 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: styles.btnNext,
              onClick: nextStep,
              disabled: step === 1 && !formData.name,
              children: [
                "Suivant ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 20 })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: styles.btnNext,
              onClick: handleComplete,
              disabled: !formData.rc || !formData.nif,
              children: [
                "Terminer ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 20 })
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
};
export {
  Onboarding,
  Onboarding as default
};

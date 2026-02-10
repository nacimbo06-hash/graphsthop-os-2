import { j as jsxRuntimeExports } from "./vendor-state-DFI86SKa.js";
import { u as useNavigate, r as reactExports } from "./vendor-react-Df__x13C.js";
import { a as useAuthStore, o as igoLogo, R as ROLE_LABELS } from "./index-BbOgUw3k.js";
import { C as CircleAlert, aN as Mail, x as Lock, b6 as EyeOff, a5 as Eye, a1 as ArrowRight, J as Shield } from "./vendor-ui-DiXyqbDT.js";
import "./vendor-i18n-DeCNyroL.js";
const loginPage = "_loginPage_ksa1e_1";
const brandPanel = "_brandPanel_ksa1e_11";
const brandContent = "_brandContent_ksa1e_21";
const logo = "_logo_ksa1e_25";
const features = "_features_ksa1e_53";
const feature = "_feature_ksa1e_53";
const featureIcon = "_featureIcon_ksa1e_70";
const brandFooter = "_brandFooter_ksa1e_74";
const formPanel = "_formPanel_ksa1e_89";
const formContainer = "_formContainer_ksa1e_97";
const formHeader = "_formHeader_ksa1e_102";
const form = "_form_ksa1e_89";
const error = "_error_ksa1e_126";
const field = "_field_ksa1e_138";
const inputWrapper = "_inputWrapper_ksa1e_150";
const inputIcon = "_inputIcon_ksa1e_156";
const passwordToggle = "_passwordToggle_ksa1e_184";
const options = "_options_ksa1e_206";
const checkbox = "_checkbox_ksa1e_212";
const submitBtn = "_submitBtn_ksa1e_228";
const spinner = "_spinner_ksa1e_254";
const demoSection = "_demoSection_ksa1e_273";
const demoHeader = "_demoHeader_ksa1e_279";
const demoAccounts = "_demoAccounts_ksa1e_292";
const demoAccount = "_demoAccount_ksa1e_292";
const demoRole = "_demoRole_ksa1e_316";
const demoEmail = "_demoEmail_ksa1e_322";
const styles = {
  loginPage,
  brandPanel,
  brandContent,
  logo,
  features,
  feature,
  featureIcon,
  brandFooter,
  formPanel,
  formContainer,
  formHeader,
  form,
  error,
  field,
  inputWrapper,
  inputIcon,
  passwordToggle,
  options,
  checkbox,
  submitBtn,
  spinner,
  demoSection,
  demoHeader,
  demoAccounts,
  demoAccount,
  demoRole,
  demoEmail
};
const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, loginError, allUsers } = useAuthStore();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [rememberMe, setRememberMe] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate("/");
    }
  };
  const registeredUsers = allUsers.map((user) => ({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role
  }));
  const handleQuickLogin = (userEmail) => {
    setEmail(userEmail);
    setPassword("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.loginPage, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.brandPanel, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.brandContent, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.logo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: igoLogo, alt: "IGO", style: { width: 48, height: 48 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "IGO" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Votre partenaire intelligent de gestion commerciale" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Gérez votre inventaire, vos ventes, et vos clients avec une solution moderne et adaptée au marché algérien." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.features, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.feature, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.featureIcon, children: "📊" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Tableau de bord en temps réel" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.feature, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.featureIcon, children: "💰" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Caisse (POS) rapide et intuitive" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.feature, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.featureIcon, children: "📦" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Gestion des stocks automatisée" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.feature, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.featureIcon, children: "🤖" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Prévisions IA & calendrier algérien" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.brandFooter, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "© 2026 IGO • Conçu pour l'Algérie 🇩🇿" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.formPanel, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formContainer, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Connexion" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Bienvenue ! Connectez-vous pour continuer." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: styles.form, children: [
        loginError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.error, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: loginError })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.field, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "email", children: "Adresse email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.inputWrapper, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 18, className: styles.inputIcon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "email",
                id: "email",
                value: email,
                onChange: (e) => setEmail(e.target.value),
                placeholder: "votre@email.dz",
                required: true,
                autoComplete: "email"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.field, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "password", children: "Mot de passe" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.inputWrapper, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 18, className: styles.inputIcon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: showPassword ? "text" : "password",
                id: "password",
                value: password,
                onChange: (e) => setPassword(e.target.value),
                placeholder: "••••••••",
                required: true,
                autoComplete: "current-password"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: styles.passwordToggle,
                onClick: () => setShowPassword(!showPassword),
                children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 18 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.options, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles.checkbox, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: rememberMe,
              onChange: (e) => setRememberMe(e.target.checked)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.checkmark }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Se souvenir de moi" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            className: styles.submitBtn,
            disabled: isLoading || !email || !password,
            children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.spinner }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              "Se connecter",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 18 })
            ] })
          }
        )
      ] }),
      registeredUsers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.demoSection, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.demoHeader, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Comptes enregistrés" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.demoAccounts, children: registeredUsers.map((user) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: styles.demoAccount,
            onClick: () => handleQuickLogin(user.email),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.demoRole, children: ROLE_LABELS[user.role] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.demoEmail, children: user.email })
            ]
          },
          user.email
        )) })
      ] })
    ] }) })
  ] });
};
export {
  Login,
  Login as default
};

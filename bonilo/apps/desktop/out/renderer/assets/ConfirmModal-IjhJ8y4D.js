import { j as jsxRuntimeExports } from "./vendor-state-DFI86SKa.js";
import { X, c as Check, T as TriangleAlert, v as Trash2 } from "./vendor-ui-DiXyqbDT.js";
const overlay = "_overlay_14t6g_3";
const fadeIn = "_fadeIn_14t6g_1";
const modal = "_modal_14t6g_20";
const slideUp = "_slideUp_14t6g_1";
const iconContainer = "_iconContainer_14t6g_42";
const danger = "_danger_14t6g_52";
const warning = "_warning_14t6g_57";
const info = "_info_14t6g_62";
const title = "_title_14t6g_67";
const message = "_message_14t6g_74";
const actions = "_actions_14t6g_81";
const cancelBtn = "_cancelBtn_14t6g_87";
const confirmBtn = "_confirmBtn_14t6g_88";
const styles = {
  overlay,
  fadeIn,
  modal,
  slideUp,
  iconContainer,
  danger,
  warning,
  info,
  title,
  message,
  actions,
  cancelBtn,
  confirmBtn
};
const ConfirmModal = ({
  isOpen,
  title: title2,
  message: message2,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "danger",
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;
  const getIcon = () => {
    switch (variant) {
      case "danger":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 28 });
      case "warning":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 28 });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 28 });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.overlay, onClick: onCancel, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modal, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${styles.iconContainer} ${styles[variant]}`, children: getIcon() }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: styles.title, children: title2 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles.message, children: message2 }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.actions, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.cancelBtn, onClick: onCancel, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 }),
        cancelText
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: `${styles.confirmBtn} ${styles[variant]}`,
          onClick: onConfirm,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 18 }),
            confirmText
          ]
        }
      )
    ] })
  ] }) });
};
export {
  ConfirmModal as C
};

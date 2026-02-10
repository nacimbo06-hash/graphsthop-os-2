const formatCurrency = (value, currency = "DA") => {
  return new Intl.NumberFormat("fr-DZ").format(Math.round(value)) + " " + currency;
};
const formatCurrencyCompact = (value) => {
  return new Intl.NumberFormat("fr-DZ", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value) + " DA";
};
const formatDateShort = (date) => {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short"
  });
};
const formatDateTime = (date) => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};
const formatTime = (date) => {
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });
};
export {
  formatTime as a,
  formatDateTime as b,
  formatDateShort as c,
  formatCurrencyCompact as d,
  formatCurrency as f
};

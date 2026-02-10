import { j as jsxRuntimeExports } from "./vendor-state-DFI86SKa.js";
import { u as useNavigate, r as reactExports } from "./vendor-react-Df__x13C.js";
import { f as useToast, c as useProductsStore, d as useCustomersStore } from "./index-BbOgUw3k.js";
import { f as formatCurrency, b as formatDateTime, c as formatDateShort, a as formatTime } from "./formatters-BiCn3FBI.js";
import { a9 as ArrowLeft, l as Printer, f as Settings, aH as Tag, F as FileText, aE as ClipboardList, a as CircleCheckBig, r as Search, a5 as Eye, R as RefreshCw, ay as Download, aU as Usb, W as Wifi, Z as Zap, v as Trash2, ag as Percent, P as Package, C as CircleAlert, at as ShoppingBag, a6 as Barcode, aV as QrCode, aJ as FileSpreadsheet, k as Truck } from "./vendor-ui-DiXyqbDT.js";
import "./vendor-i18n-DeCNyroL.js";
function formatPrice(value) {
  return new Intl.NumberFormat("fr-DZ").format(Math.round(value));
}
class JonyHTMLGenerator {
  /**
   * Generate beautiful receipt HTML for browser preview
   */
  generateReceiptHTML(data, paperWidth = 80) {
    const width = paperWidth === 80 ? "80mm" : "58mm";
    const itemsHTML = data.items.map((item) => `
            <div class="item">
                <div class="item-name">${item.name}${item.isBundle ? ' <span class="pack-badge">⬡</span>' : ""}</div>
                <div class="item-line">
                    <span class="qty-price">${item.quantity} × ${formatCurrency(item.unitPrice)}</span>
                    <span class="item-total">${formatCurrency(item.total)}</span>
                </div>
            </div>
        `).join("");
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Ticket de caisse</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Space Grotesk', sans-serif;
            background: #f1f5f9;
            padding: 40px;
            display: flex;
            justify-content: center;
        }
        
        .receipt {
            width: ${width};
            background: white;
            padding: 24px 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            color: #0f172a;
        }
        
        .header {
            text-align: center;
            margin-bottom: 24px;
        }
        
        .brand-badge {
            display: inline-block;
            background: #0f172a;
            color: white;
            font-size: 8px;
            font-weight: 700;
            padding: 4px 12px;
            border-radius: 4px;
            margin-bottom: 12px;
            letter-spacing: 2px;
        }
        
        .store-name {
            font-size: 18px;
            font-weight: 700;
            letter-spacing: -0.5px;
            margin-bottom: 4px;
        }
        
        .store-info {
            font-size: 10px;
            color: #64748b;
            line-height: 1.5;
        }
        
        .transaction-info {
            border-top: 1px dashed #e2e8f0;
            border-bottom: 1px dashed #e2e8f0;
            padding: 12px 0;
            margin-bottom: 16px;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            font-size: 9px;
            color: #475569;
            margin-bottom: 4px;
        }
        
        .info-row:last-child { margin-bottom: 0; }
        
        .items {
            margin-bottom: 24px;
        }
        
        .item {
            margin-bottom: 12px;
        }
        
        .item-name {
            font-size: 11px;
            font-weight: 600;
            margin-bottom: 2px;
            text-transform: uppercase;
        }
        
        .item-line {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: #64748b;
            font-family: 'JetBrains Mono', monospace;
        }
        
        .totals-section {
            background: #f8fafc;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 16px;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #475569;
            margin-bottom: 8px;
        }
        
        .total-row.discount {
            color: #ef4444;
            font-weight: 600;
        }
        
        .grand-total {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 2px solid #0f172a;
            padding-top: 12px;
            margin-top: 4px;
        }
        
        .grand-total .label {
            font-size: 12px;
            font-weight: 700;
        }
        
        .grand-total .value {
            font-size: 20px;
            font-weight: 700;
            letter-spacing: -1px;
        }
        
        .payment-summary {
            font-size: 10px;
            padding: 0 12px;
            margin-bottom: 24px;
        }
        
        .payment-method {
            font-weight: 700;
            margin-bottom: 6px;
        }
        
        .payment-row {
            display: flex;
            justify-content: space-between;
            color: #64748b;
            margin-bottom: 2px;
        }
        
        .payment-row.change {
            color: #0f172a;
            font-weight: 600;
        }
        
        .qr-footer {
            display: flex;
            justify-content: center;
            margin-bottom: 24px;
        }
        
        .qr-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }
        
        .qr-box {
            width: 80px;
            height: 80px;
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            position: relative;
        }
        
        .qr-box::after {
            content: '';
            position: absolute;
            inset: 20px;
            background: repeating-linear-gradient(45deg, #cbd5e1 0, #cbd5e1 1px, transparent 1px, transparent 4px);
        }
        
        .qr-placeholder span {
            font-size: 7px;
            font-weight: 600;
            color: #94a3b8;
            letter-spacing: 1px;
        }
        
        .final-footer {
            text-align: center;
            color: #94a3b8;
        }
        
        .dots { margin-bottom: 8px; font-size: 12px; }
        .thanks { font-size: 11px; font-weight: 700; margin-bottom: 4px; color: #64748b; letter-spacing: 1px; }
        .website { font-size: 9px; font-weight: 500; }
        
        @media print {
            body { background: white; padding: 0; }
            .receipt { box-shadow: none; border-radius: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @page { margin: 0; size: ${width} auto; }
        }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <div class="brand-badge">S-POS PREMIUM</div>
            <div class="store-name">${data.storeInfo.name.toUpperCase()}</div>
            <div class="store-info">
                ${data.storeInfo.address}<br>
                TEL: ${data.storeInfo.phone}
            </div>
        </div>
        
        <div class="transaction-info">
            <div class="info-row">
                <span class="id">REFERENCE: #${data.transactionId}</span>
                <span class="date">${formatDateTime(data.date)}</span>
            </div>
            <div class="info-row">
                <span>CAISSIER: ${data.cashier.toUpperCase()}</span>
                ${data.customer ? `<span>CLIENT: ${data.customer.name.toUpperCase()}</span>` : ""}
            </div>
        </div>
        
        <div class="items">
            ${itemsHTML}
        </div>
        
        <div class="totals-section">
            <div class="total-row">
                <span>SOUS-TOTAL</span>
                <span>${formatCurrency(data.subtotal)}</span>
            </div>
            ${data.discount && data.discount.amount > 0 ? `
            <div class="total-row discount">
                <span>REMISE ${data.discount.percent}%</span>
                <span>-${formatCurrency(data.discount.amount)}</span>
            </div>` : ""}
            ${data.vat && data.vat.amount > 0 ? `
            <div class="total-row">
                <span>TVA ${data.vat.rate}%</span>
                <span>${formatCurrency(data.vat.amount)}</span>
            </div>` : ""}
            
            <div class="grand-total">
                <span class="label">TOTAL</span>
                <span class="value">${formatCurrency(data.total)}</span>
            </div>
        </div>
        
        <div class="payment-summary">
            <div class="payment-method">PAIEMENT: ${data.paymentMethod.toUpperCase()}</div>
            ${data.amountReceived ? `
                <div class="payment-row"><span>REÇU:</span><span>${formatCurrency(data.amountReceived)}</span></div>
                ${data.change && data.change > 0 ? `<div class="payment-row change"><span>MONNAIE:</span><span>${formatCurrency(data.change)}</span></div>` : ""}
            ` : ""}
        </div>
        
        <div class="qr-footer">
            <div class="qr-placeholder">
                <div class="qr-box"></div>
                <span>SCANNER POUR TICKET DIGITAL</span>
            </div>
        </div>
        
        <div class="final-footer">
            <div class="dots">● ● ●</div>
            <div class="thanks">MERCI DE VOTRE VISITE</div>
            <div class="website">WWW.GRAPHSHOP.DZ</div>
        </div>
    </div>
</body>
</html>`;
  }
  /**
   * Generate price label HTML for browser preview
   */
  generateLabelHTML(data) {
    let badgeHTML = "";
    let headerHTML = "";
    `<div class="price">${formatCurrency(data.price)}</div>`;
    let subPriceHTML = "";
    switch (data.type) {
      case "promotion":
        if (data.oldPrice) {
          subPriceHTML = `<div class="old-price">${formatCurrency(data.oldPrice)}</div>`;
        }
        if (data.discountPercent) {
          badgeHTML = `<div class="badge discount">-${data.discountPercent}%</div>`;
        }
        break;
      case "pack":
        if (data.packSize) {
          badgeHTML = `<div class="badge pack">PACK ×${data.packSize}</div>`;
        }
        if (data.pricePerUnit) {
          subPriceHTML = `<div class="unit-price">(${formatCurrency(data.pricePerUnit)}/unité)</div>`;
        }
        break;
      case "perkilo":
        `<div class="price">${formatPrice(data.price)} DA/Kg</div>`;
        if (data.pluCode) {
          subPriceHTML = `<div class="plu">PLU: ${data.pluCode}</div>`;
        }
        break;
      case "expiry":
        headerHTML = `<div class="warning-header">PROCHE EXPIRATION</div>`;
        if (data.discountPercent) {
          badgeHTML = `<div class="badge discount">-${data.discountPercent}%</div>`;
        }
        if (data.expiryDate) {
          subPriceHTML = `<div class="expiry">DLC: ${formatDateShort(data.expiryDate)}</div>`;
        }
        break;
      case "loyalty-card":
        return this.generateLoyaltyCardHTML(data);
    }
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Étiquette prix</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;900&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Outfit', sans-serif;
            background: #f8fafc;
            padding: 40px;
            display: flex;
            justify-content: center;
        }
        
        .label {
            width: 60mm;
            height: 40mm;
            background: white;
            padding: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
        }

        .label::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: 0;
            width: 30mm;
            height: 30mm;
            background: radial-gradient(circle at bottom right, rgba(0,0,0,0.02) 0%, transparent 70%);
            z-index: 0;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            z-index: 1;
        }

        .warning-header {
            background: #ef4444;
            color: white;
            font-size: 7px;
            font-weight: 800;
            padding: 2px 6px;
            border-radius: 4px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        
        .product-name {
            font-size: 11px;
            font-weight: 600;
            color: #1e293b;
            line-height: 1.2;
            margin-top: 4px;
            text-transform: uppercase;
            letter-spacing: -0.2px;
            z-index: 1;
        }
        
        .main-section {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            margin: 4px 0;
            z-index: 1;
        }

        .price-container {
            display: flex;
            flex-direction: column;
        }

        .old-price {
            font-size: 11px;
            color: #94a3b8;
            text-decoration: line-through;
            font-weight: 400;
            margin-bottom: -4px;
        }
        
        .price {
            font-size: 40px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: -1.5px;
            line-height: 0.9;
        }

        .currency {
            font-size: 14px;
            font-weight: 600;
            margin-left: 2px;
        }
        
        .badge-container {
            display: flex;
            flex-direction: column;
            gap: 4px;
            align-items: flex-end;
        }

        .badge {
            font-size: 10px;
            font-weight: 800;
            padding: 4px 8px;
            border-radius: 6px;
        }
        
        .badge.discount {
            background: #0f172a;
            color: white;
        }

        .badge.pack {
            background: #f1f5f9;
            color: #475569;
            border: 1px solid #e2e8f0;
        }
        
        .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-top: 1px solid #f1f5f9;
            padding-top: 8px;
            z-index: 1;
        }

        .barcode-section {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .barcode-stub {
            height: 12px;
            width: 60px;
            background: repeating-linear-gradient(90deg, #333 0, #333 1px, transparent 1px, transparent 3px);
        }

        .barcode-text {
            font-family: 'JetBrains Mono', monospace;
            font-size: 7px;
            color: #64748b;
            font-weight: 500;
        }
        
        .meta-info {
            text-align: right;
            font-size: 8px;
            color: #94a3b8;
            font-weight: 600;
        }

        .plu {
            background: #f8fafc;
            padding: 2px 6px;
            border-radius: 4px;
            color: #1e293b;
        }
        
        @media print {
            body { background: transparent; padding: 0; }
            .label { box-shadow: none; border: none; }
            @page { margin: 0; size: 60mm 40mm; }
        }
    </style>
</head>
<body>
    <div class="label ${data.type}">
        <div class="header">
            ${headerHTML}
            <div class="product-name">${data.productName}</div>
        </div>

        <div class="main-section">
            <div class="price-container">
                ${subPriceHTML}
                <div class="price">
                    ${Math.floor(data.price)}<span class="currency">DA</span>
                </div>
            </div>
            <div class="badge-container">
                ${badgeHTML}
            </div>
        </div>

        <div class="footer">
            <div class="barcode-section">
                <div class="barcode-stub"></div>
                <div class="barcode-text">${data.barcode}</div>
            </div>
            <div class="meta-info">
                ${data.sku ? `SKU: ${data.sku}` : ""}
            </div>
        </div>
    </div>
</body>
</html>`;
  }
  /**
   * Generate premium loyalty card HTML
   */
  generateLoyaltyCardHTML(data) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Carte de Fidélité</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Outfit', -apple-system, sans-serif;
            background: #f0f2f5;
            padding: 40px;
            display: flex;
            justify-content: center;
        }
        
        .card {
            width: 85.6mm;
            height: 53.98mm;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            border-radius: 12px;
            position: relative;
            overflow: hidden;
            color: white;
            padding: 24px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .card::before {
            content: '';
            position: absolute;
            top: -20%;
            right: -10%;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
            border-radius: 50%;
        }
        
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            z-index: 1;
        }
        
        .brand {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .logo-icon {
            width: 32px;
            height: 32px;
            background: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #0f172a;
            font-weight: 800;
            font-size: 18px;
        }
        
        .brand-name {
            font-weight: 700;
            font-size: 14px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        
        .card-type {
            font-size: 10px;
            font-weight: 600;
            background: rgba(255, 255, 255, 0.1);
            padding: 4px 10px;
            border-radius: 20px;
            backdrop-filter: blur(4px);
            letter-spacing: 1px;
        }
        
        .card-body {
            margin-top: 10px;
            z-index: 1;
        }
        
        .holder-name {
            font-size: 18px;
            font-weight: 600;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .points-info {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .points-value {
            color: #fbbf24;
            font-weight: 700;
        }
        
        .card-footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            z-index: 1;
        }
        
        .barcode-section {
            background: white;
            padding: 4px 8px;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
        }
        
        .barcode-img {
            height: 30px;
            filter: contrast(200%);
        }
        
        .barcode-text {
            color: #333;
            font-size: 8px;
            font-weight: 600;
            font-family: 'JetBrains Mono', monospace;
        }
        
        .member-info {
            text-align: right;
            font-size: 9px;
            color: rgba(255, 255, 255, 0.5);
            line-height: 1.4;
        }
        
        @media print {
            body { background: transparent; padding: 0; }
            .card { box-shadow: none; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @page { margin: 0; size: 85.6mm 53.98mm; }
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="card-header">
            <div class="brand">
                <div class="logo-icon">G</div>
                <div class="brand-name">GRAPHSHOP</div>
            </div>
            <div class="card-type">PREMIUM LOYALTY</div>
        </div>
        
        <div class="card-body">
            <div class="holder-name">${data.customerName?.toUpperCase() || "MEMBRE PRIVILÈGE"}</div>
            <div class="points-info">
                <span>MEMBRE DEPUIS: <span style="color:white">${data.memberSince || "2024"}</span></span>
                <span>POINTS: <span class="points-value">${data.loyaltyPoints || 0} PTS</span></span>
            </div>
        </div>
        
        <div class="card-footer">
            <div class="barcode-section">
                <!-- Fallback barcode text if font not available -->
                <div class="barcode-text" style="font-size: 14px; letter-spacing: 2px; font-weight: 800;">|||| | ||| || ||</div>
                <div class="barcode-text">${data.barcode}</div>
            </div>
            <div class="member-info">
                VALABLE DANS TOUS LES<br>POINTS DE VENTE GRAPHSHOP
            </div>
        </div>
    </div>
</body>
</html>`;
  }
  /**
   * Generate premium full-page document HTML (A4 style)
   */
  generateDocumentHTML(type, data) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${type}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=JetBrains+Mono:wght@400;600&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Outfit', sans-serif;
            background: #f1f5f9;
            padding: 40px;
            display: flex;
            justify-content: center;
        }
        
        .document {
            width: 210mm;
            min-height: 297mm;
            background: white;
            padding: 25mm;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            position: relative;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 50px;
        }
        
        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .logo {
            width: 48px;
            height: 48px;
            background: #0f172a;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 800;
            border-radius: 12px;
        }
        
        .brand-name {
            font-size: 20px;
            font-weight: 800;
            letter-spacing: -0.5px;
            color: #0f172a;
        }
        
        .doc-type {
            text-align: right;
        }
        
        .doc-title {
            font-size: 32px;
            font-weight: 800;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: -1px;
            margin-bottom: 4px;
        }
        
        .doc-ref {
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            color: #64748b;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 50px;
        }
        
        .info-box-title {
            font-size: 11px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 8px;
        }
        
        .info-content {
            font-size: 14px;
            line-height: 1.6;
            color: #1e293b;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
        }
        
        th {
            text-align: left;
            font-size: 11px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            padding: 12px 16px;
            background: #f8fafc;
        }
        
        td {
            padding: 16px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 14px;
            color: #334155;
        }
        
        .item-row:last-child td { border-bottom: none; }
        
        .total-section {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 12px;
        }
        
        .total-row {
            display: flex;
            gap: 40px;
            font-size: 14px;
            color: #64748b;
        }
        
        .grand-total {
            margin-top: 8px;
            padding-top: 16px;
            border-top: 2px solid #0f172a;
            color: #0f172a;
            font-size: 24px;
            font-weight: 800;
        }
        
        .footer {
            position: absolute;
            bottom: 25mm;
            left: 25mm;
            right: 25mm;
            border-top: 1px solid #f1f5f9;
            padding-top: 20px;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: #94a3b8;
        }
        
        @media print {
            body { background: transparent; padding: 0; }
            .document { box-shadow: none; width: 100%; height: 100%; padding: 15mm; }
            @page { margin: 0; size: A4; }
        }
    </style>
</head>
<body>
    <div class="document">
        <div class="header">
            <div class="brand">
                <div class="logo">G</div>
                <div class="brand-name">GRAPHSHOP OS</div>
            </div>
            <div class="doc-type">
                <div class="doc-title">${type}</div>
                <div class="doc-ref">#${data.reference || "REF-" + Date.now().toString().slice(-6)}</div>
            </div>
        </div>
        
        <div class="info-grid">
            <div class="info-box">
                <div class="info-box-title">ÉMIS PAR</div>
                <div class="info-content">
                    <strong>${data.storeInfo?.name || "GRAPHSHOP HQ"}</strong><br>
                    ${data.storeInfo?.address || "Cité des sciences, Alger"}<br>
                    Tél: ${data.storeInfo?.phone || "+213 555 12 34 56"}<br>
                    NIF: 01234567891234
                </div>
            </div>
            <div class="info-box">
                <div class="info-box-title">${data.recipientTitle || "DESTINATAIRE"}</div>
                <div class="info-content">
                    <strong>${data.recipient?.name || "NOM DU CLIENT"}</strong><br>
                    ${data.recipient?.address || "Adresse de livraison"}<br>
                    Tél: ${data.recipient?.phone || "Pas de numéro"}
                </div>
            </div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th style="width: 50%">DÉSIGNATION</th>
                    <th style="text-align: center">QTÉ</th>
                    <th style="text-align: right">P.U</th>
                    <th style="text-align: right">TOTAL</th>
                </tr>
            </thead>
            <tbody>
                ${(data.items || []).map((item) => `
                <tr class="item-row">
                    <td>
                        <div style="font-weight: 600; color: #0f172a">${item.name}</div>
                        <div style="font-size: 11px; color: #94a3b8">${item.sku || ""}</div>
                    </td>
                    <td style="text-align: center">${item.quantity}</td>
                    <td style="text-align: right">${new Intl.NumberFormat("fr-DZ").format(item.unitPrice)} DA</td>
                    <td style="text-align: right; font-weight: 600">${new Intl.NumberFormat("fr-DZ").format(item.total)} DA</td>
                </tr>
                `).join("")}
            </tbody>
        </table>
        
        <div class="total-section">
            <div class="total-row">
                <span>SOUS-TOTAL</span>
                <span>${new Intl.NumberFormat("fr-DZ").format(data.subtotal || 0)} DA</span>
            </div>
            <div class="total-row">
                <span>REMISE TOTAL</span>
                <span>-${new Intl.NumberFormat("fr-DZ").format(data.discountAmount || 0)} DA</span>
            </div>
            <div class="grand-total">
                <span style="font-size: 14px; color: #94a3b8; margin-right: 20px">SOLDE TOTAL</span>
                ${new Intl.NumberFormat("fr-DZ").format(data.totalAmount || 0)} DA
            </div>
        </div>
        
        <div class="footer">
            <div>GÉNÉRÉ LE ${(/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR")} À ${(/* @__PURE__ */ new Date()).toLocaleTimeString("fr-FR")}</div>
            <div>PAGE 1 SUR 1 • GRAPHSHOP OS - SYSTÈME DE GESTION PROFESSIONNEL</div>
        </div>
    </div>
</body>
</html>`;
  }
}
const JonyHTML = new JonyHTMLGenerator();
const ESC = 27;
const GS = 29;
const ESCPOS = {
  // Initialize printer
  INIT: new Uint8Array([ESC, 64]),
  // Text alignment
  ALIGN_LEFT: new Uint8Array([ESC, 97, 0]),
  ALIGN_CENTER: new Uint8Array([ESC, 97, 1]),
  // Text formatting
  BOLD_ON: new Uint8Array([ESC, 69, 1]),
  BOLD_OFF: new Uint8Array([ESC, 69, 0]),
  DOUBLE_SIZE: new Uint8Array([GS, 33, 17]),
  NORMAL_SIZE: new Uint8Array([GS, 33, 0]),
  PARTIAL_CUT: new Uint8Array([GS, 86, 1]),
  // Cash drawer
  OPEN_DRAWER: new Uint8Array([ESC, 112, 0, 25, 250])
};
const ZPL = {
  START: "^XA",
  END: "^XZ",
  // Position field
  fieldOrigin: (x, y) => `^FO${x},${y}`,
  // Font
  font: (size = 30) => `^A0N,${size},${size}`,
  // Field data
  fieldData: (text) => `^FD${text}^FS`,
  // Barcode EAN-13
  barcodeEAN13: (x, y, data, height = 80) => `^FO${x},${y}^BY2^BEN,${height},Y,N^FD${data}^FS`,
  // QR Code
  qrCode: (x, y, data, size = 3) => `^FO${x},${y}^BQN,2,${size}^FDQA,${data}^FS`,
  // Box
  box: (x, y, w, h, thickness = 2) => `^FO${x},${y}^GB${w},${h},${thickness}^FS`,
  // Generate price label
  priceLabel: (data) => {
    const priceStr = Math.round(data.price).toString();
    let zpl = ZPL.START;
    zpl += ZPL.fieldOrigin(20, 20);
    zpl += ZPL.font(25);
    zpl += ZPL.fieldData(data.productName.substring(0, 25));
    zpl += ZPL.fieldOrigin(20, 60);
    zpl += "^A0N,60,60";
    zpl += `^FD${priceStr} DA^FS`;
    if (data.oldPrice) {
      zpl += ZPL.fieldOrigin(200, 70);
      zpl += ZPL.font(25);
      zpl += `^FD${data.oldPrice} DA^FS`;
      zpl += `^FO200,85^GB80,2,2^FS`;
    }
    zpl += ZPL.barcodeEAN13(20, 130, data.barcode, 60);
    zpl += ZPL.END;
    return zpl;
  }
};
function stringToBytes(str) {
  const encoder = new TextEncoder();
  return Array.from(encoder.encode(str));
}
function padRight(str, len) {
  return str.padEnd(len).substring(0, len);
}
function padLeft(str, len) {
  return str.padStart(len).substring(0, len);
}
function generateReceiptBytes(data, paperWidth = 80) {
  const charWidth = paperWidth === 80 ? 48 : 32;
  const separator = "-".repeat(charWidth);
  const doubleSeparator = "=".repeat(charWidth);
  const parts = [];
  const addCommand = (cmd) => parts.push(cmd);
  const addText = (text) => parts.push(new Uint8Array(stringToBytes(text + "\n")));
  addCommand(ESCPOS.INIT);
  addCommand(ESCPOS.ALIGN_CENTER);
  addCommand(ESCPOS.DOUBLE_SIZE);
  addText(data.storeInfo.name);
  addCommand(ESCPOS.NORMAL_SIZE);
  addText(data.storeInfo.address);
  addText(`Tél: ${data.storeInfo.phone}`);
  if (data.storeInfo.nif) addText(`NIF: ${data.storeInfo.nif}`);
  if (data.storeInfo.rc) addText(`RC: ${data.storeInfo.rc}`);
  addText("");
  addCommand(ESCPOS.ALIGN_LEFT);
  addText(separator);
  addText(`Ticket: ${data.transactionId}`);
  addText(`Date: ${formatDateTime(data.date)}`);
  addText(`Caissier: ${data.cashier}`);
  if (data.customer) addText(`Client: ${data.customer.name}`);
  addText(separator);
  addCommand(ESCPOS.BOLD_ON);
  addText(padRight("ARTICLE", charWidth - 12) + padLeft("TOTAL", 12));
  addCommand(ESCPOS.BOLD_OFF);
  addText(separator);
  for (const item of data.items) {
    const name = item.isBundle ? `${item.name} (PACK)` : item.name;
    const qtyPrice = `${item.quantity} x ${formatCurrency(item.unitPrice)}`;
    const total = formatCurrency(item.total);
    addText(name.substring(0, charWidth));
    addText(padRight(`  ${qtyPrice}`, charWidth - total.length) + total);
  }
  addText(separator);
  const addTotalLine = (label, value, bold = false) => {
    if (bold) addCommand(ESCPOS.BOLD_ON);
    addText(padRight(label, charWidth - value.length) + value);
    if (bold) addCommand(ESCPOS.BOLD_OFF);
  };
  addTotalLine("Sous-total:", formatCurrency(data.subtotal));
  if (data.discount && data.discount.amount > 0) {
    addTotalLine(`Remise (${data.discount.percent}%):`, `-${formatCurrency(data.discount.amount)}`);
  }
  if (data.vat) {
    addTotalLine(`TVA (${data.vat.rate}%):`, formatCurrency(data.vat.amount));
  }
  addText(doubleSeparator);
  addCommand(ESCPOS.DOUBLE_SIZE);
  addTotalLine("TOTAL:", formatCurrency(data.total), true);
  addCommand(ESCPOS.NORMAL_SIZE);
  addText(doubleSeparator);
  addText(`Mode de paiement: ${data.paymentMethod}`);
  if (data.amountReceived) {
    addText(`Montant reçu: ${formatCurrency(data.amountReceived)}`);
    if (data.change && data.change > 0) {
      addText(`Monnaie rendue: ${formatCurrency(data.change)}`);
    }
  }
  if (data.customer?.loyaltyPoints) {
    addText("");
    addText(`Points fidélité: +${data.customer.loyaltyPoints} pts`);
  }
  addText("");
  addCommand(ESCPOS.ALIGN_CENTER);
  addText(data.footer || "Merci de votre visite!");
  addText("À bientôt!");
  addText("");
  addText("");
  addText("");
  addCommand(ESCPOS.PARTIAL_CUT);
  const totalLength = parts.reduce((acc, part) => acc + part.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }
  return result;
}
class PrinterServiceClass {
  connectedDevice = null;
  printers = [];
  printQueue = [];
  constructor() {
    this.loadPrinters();
  }
  // Load saved printers from localStorage
  loadPrinters() {
    const saved = localStorage.getItem("printers");
    if (saved) {
      this.printers = JSON.parse(saved);
    } else {
      this.printers = [
        {
          id: "browser-default",
          name: "Imprimante système",
          type: "standard",
          connectionType: "browser",
          paperWidth: 80,
          isDefault: true,
          status: "online"
        }
      ];
    }
  }
  // Save printers to localStorage
  savePrinters() {
    localStorage.setItem("printers", JSON.stringify(this.printers));
  }
  // Get all printers
  getPrinters() {
    return this.printers;
  }
  // Get default printer by type
  getDefaultPrinter(type) {
    return this.printers.find((p) => p.type === type && p.isDefault) || this.printers.find((p) => p.type === type);
  }
  // Add printer
  addPrinter(printer) {
    const newPrinter = {
      ...printer,
      id: `printer-${Date.now()}`,
      status: "offline"
    };
    this.printers.push(newPrinter);
    this.savePrinters();
    return newPrinter;
  }
  // Remove printer
  removePrinter(id) {
    this.printers = this.printers.filter((p) => p.id !== id);
    this.savePrinters();
  }
  // Request USB device access (Web USB API)
  async requestUSBPrinter() {
    if (!("usb" in navigator)) {
      console.warn("Web USB API not supported");
      return null;
    }
    try {
      const device = await navigator.usb.requestDevice({
        filters: [
          // Common thermal printer vendors
          { vendorId: 1046 },
          // Epson
          { vendorId: 1208 },
          // Epson (alternate)
          { vendorId: 1305 },
          // Star Micronics
          { vendorId: 3540 },
          // Custom
          { vendorId: 4070 },
          // ICS
          { vendorId: 5380 },
          // HPRT
          { vendorId: 1155 }
          // STMicroelectronics (many Chinese printers)
        ]
      });
      this.connectedDevice = device;
      return device;
    } catch (error2) {
      console.error("USB device request failed:", error2);
      return null;
    }
  }
  // Connect to USB device
  async connectUSB(device) {
    try {
      await device.open();
      if (device.configuration === null) {
        await device.selectConfiguration(1);
      }
      await device.claimInterface(0);
      this.connectedDevice = device;
      console.log("USB printer connected:", device.productName);
      return true;
    } catch (error2) {
      console.error("USB connection failed:", error2);
      return false;
    }
  }
  // Send data to USB printer
  async sendToUSB(data) {
    if (!this.connectedDevice) {
      console.error("No USB device connected");
      return false;
    }
    try {
      const endpoint = this.connectedDevice.configuration?.interfaces[0]?.alternate.endpoints.find((e) => e.direction === "out");
      if (!endpoint) {
        throw new Error("No output endpoint found");
      }
      await this.connectedDevice.transferOut(endpoint.endpointNumber, data);
      return true;
    } catch (error2) {
      console.error("USB send failed:", error2);
      return false;
    }
  }
  // Print receipt
  async printReceipt(data, printer) {
    const targetPrinter = printer || this.getDefaultPrinter("thermal");
    if (!targetPrinter) {
      return this.browserPrintReceipt(data);
    }
    switch (targetPrinter.connectionType) {
      case "usb":
        const bytes = generateReceiptBytes(data, targetPrinter.paperWidth);
        return this.sendToUSB(bytes);
      case "network":
        console.log("Network printing not yet implemented");
        return this.browserPrintReceipt(data);
      case "browser":
      default:
        return this.browserPrintReceipt(data);
    }
  }
  // Browser print receipt (fallback) - Using Jony Ive style
  browserPrintReceipt(data) {
    const html = JonyHTML.generateReceiptHTML(data, 80);
    return this.openPrintWindow(html, "Ticket de caisse");
  }
  // Generate HTML receipt for browser printing
  generateReceiptHTML(data) {
    const itemsHTML = data.items.map((item) => `
            <tr>
                <td>${item.name}${item.isBundle ? " <small>(PACK)</small>" : ""}</td>
                <td class="center">${item.quantity}</td>
                <td class="right">${formatCurrency(item.unitPrice)}</td>
                <td class="right">${formatCurrency(item.total)}</td>
            </tr>
        `).join("");
    return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Ticket de caisse</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Courier New', monospace;
                        font-size: 12px;
                        width: 80mm;
                        padding: 5mm;
                    }
                    .center { text-align: center; }
                    .right { text-align: right; }
                    .bold { font-weight: bold; }
                    .big { font-size: 16px; }
                    .separator { border-top: 1px dashed #000; margin: 5px 0; }
                    .double-separator { border-top: 2px solid #000; margin: 5px 0; }
                    table { width: 100%; border-collapse: collapse; }
                    td { padding: 2px 0; }
                    .header { margin-bottom: 10px; }
                    .total-section { margin-top: 10px; }
                    @media print {
                        @page { margin: 0; size: 80mm auto; }
                        body { width: 100%; }
                    }
                </style>
            </head>
            <body>
                <div class="header center">
                    <div class="bold big">${data.storeInfo.name}</div>
                    <div>${data.storeInfo.address}</div>
                    <div>Tél: ${data.storeInfo.phone}</div>
                    ${data.storeInfo.nif ? `<div>NIF: ${data.storeInfo.nif}</div>` : ""}
                </div>
                
                <div class="separator"></div>
                
                <div>
                    <div>Ticket: ${data.transactionId}</div>
                    <div>Date: ${formatDateTime(data.date)}</div>
                    <div>Caissier: ${data.cashier}</div>
                    ${data.customer ? `<div>Client: ${data.customer.name}</div>` : ""}
                </div>
                
                <div class="separator"></div>
                
                <table>
                    <thead>
                        <tr class="bold">
                            <td>Article</td>
                            <td class="center">Qté</td>
                            <td class="right">P.U.</td>
                            <td class="right">Total</td>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                    </tbody>
                </table>
                
                <div class="separator"></div>
                
                <div class="total-section">
                    <table>
                        <tr>
                            <td>Sous-total:</td>
                            <td class="right">${formatCurrency(data.subtotal)}</td>
                        </tr>
                        ${data.discount && data.discount.amount > 0 ? `
                        <tr>
                            <td>Remise (${data.discount.percent}%):</td>
                            <td class="right">-${formatCurrency(data.discount.amount)}</td>
                        </tr>
                        ` : ""}
                        ${data.vat ? `
                        <tr>
                            <td>TVA (${data.vat.rate}%):</td>
                            <td class="right">${formatCurrency(data.vat.amount)}</td>
                        </tr>
                        ` : ""}
                    </table>
                    
                    <div class="double-separator"></div>
                    
                    <table>
                        <tr class="bold big">
                            <td>TOTAL:</td>
                            <td class="right">${formatCurrency(data.total)}</td>
                        </tr>
                    </table>
                    
                    <div class="double-separator"></div>
                    
                    <div>Mode de paiement: ${data.paymentMethod}</div>
                    ${data.amountReceived ? `<div>Montant reçu: ${formatCurrency(data.amountReceived)}</div>` : ""}
                    ${data.change && data.change > 0 ? `<div>Monnaie: ${formatCurrency(data.change)}</div>` : ""}
                </div>
                
                <div class="separator"></div>
                
                <div class="center" style="margin-top: 10px;">
                    <div>${data.footer || "Merci de votre visite!"}</div>
                    <div>À bientôt!</div>
                </div>
            </body>
            </html>
        `;
  }
  // Print label
  async printLabel(data, quantity = 1, printer) {
    const targetPrinter = printer || this.getDefaultPrinter("label");
    if (targetPrinter?.connectionType === "usb" && this.connectedDevice) {
      const zpl = ZPL.priceLabel(data);
      const zplBytes = new TextEncoder().encode(zpl.repeat(quantity));
      return this.sendToUSB(zplBytes);
    }
    return this.browserPrintLabel(data, quantity);
  }
  // Browser print label (fallback)
  browserPrintLabel(data, quantity) {
    const labels = Array(quantity).fill(this.generateLabelHTML(data)).join("");
    const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Étiquettes</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: Arial, sans-serif; }
                    .label {
                        width: 50mm;
                        height: 30mm;
                        border: 1px solid #ccc;
                        padding: 2mm;
                        margin: 2mm;
                        display: inline-block;
                        page-break-inside: avoid;
                    }
                    .product-name { font-size: 10px; font-weight: bold; margin-bottom: 2px; }
                    .price { font-size: 18px; font-weight: bold; }
                    .old-price { font-size: 12px; text-decoration: line-through; color: #999; }
                    .barcode { font-family: 'Libre Barcode EAN13 Text', monospace; font-size: 24px; }
                    .sku { font-size: 8px; color: #666; }
                    @media print {
                        @page { margin: 0; }
                        .label { border: none; }
                    }
                </style>
            </head>
            <body>${labels}</body>
            </html>
        `;
    return this.openPrintWindow(html, "Étiquettes");
  }
  // Generate single label HTML
  generateLabelHTML(data) {
    return `
            <div class="label">
                <div class="product-name">${data.productName}</div>
                <div class="price">${formatCurrency(data.price)}</div>
                ${data.oldPrice ? `<div class="old-price">${formatCurrency(data.oldPrice)}</div>` : ""}
                <div class="barcode">${data.barcode}</div>
                <div class="sku">${data.sku}</div>
            </div>
        `;
  }
  // Print document
  async printDocument(data) {
    const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${data.title}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20mm; }
                    h1 { color: #333; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background: #f5f5f5; }
                    @media print { @page { margin: 15mm; } }
                </style>
            </head>
            <body>
                <h1>${data.title}</h1>
                ${data.html}
            </body>
            </html>
        `;
    return this.openPrintWindow(html, data.title);
  }
  // Open print window
  openPrintWindow(html, title) {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) {
      console.error("Could not open print window");
      return false;
    }
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
    return true;
  }
  // Open cash drawer (ESC/POS)
  async openCashDrawer() {
    if (this.connectedDevice) {
      return this.sendToUSB(ESCPOS.OPEN_DRAWER);
    }
    console.warn("No USB printer connected for cash drawer");
    return false;
  }
  // Test print
  async testPrint(printer) {
    const testData = {
      storeInfo: {
        name: "TEST IMPRESSION",
        address: "Test Address",
        phone: "0000000000"
      },
      transactionId: "TEST-001",
      date: /* @__PURE__ */ new Date(),
      cashier: "Test",
      items: [
        { name: "Produit Test 1", quantity: 2, unitPrice: 100, total: 200 },
        { name: "Produit Test 2", quantity: 1, unitPrice: 150, total: 150 }
      ],
      subtotal: 350,
      vat: { rate: 19, amount: 66.5 },
      total: 416.5,
      paymentMethod: "TEST",
      footer: "*** TEST D'IMPRESSION ***"
    };
    return this.printReceipt(testData, printer);
  }
}
const PrinterService = new PrinterServiceClass();
const printCenter = "_printCenter_16j1a_5";
const header = "_header_16j1a_13";
const headerLeft = "_headerLeft_16j1a_22";
const backBtn = "_backBtn_16j1a_28";
const headerTitle = "_headerTitle_16j1a_46";
const headerActions = "_headerActions_16j1a_63";
const settingsBtn = "_settingsBtn_16j1a_68";
const tabs = "_tabs_16j1a_82";
const tab = "_tab_16j1a_82";
const active = "_active_16j1a_109";
const content = "_content_16j1a_115";
const section = "_section_16j1a_121";
const templatesGrid = "_templatesGrid_16j1a_132";
const templateCard = "_templateCard_16j1a_138";
const selected = "_selected_16j1a_156";
const templateIcon = "_templateIcon_16j1a_161";
const templateInfo = "_templateInfo_16j1a_177";
const templateName = "_templateName_16j1a_183";
const templateSize = "_templateSize_16j1a_188";
const checkIcon = "_checkIcon_16j1a_193";
const searchBar = "_searchBar_16j1a_201";
const productsList = "_productsList_16j1a_229";
const productItem = "_productItem_16j1a_237";
const productInfo = "_productInfo_16j1a_264";
const productName = "_productName_16j1a_271";
const productMeta = "_productMeta_16j1a_276";
const productPrice = "_productPrice_16j1a_281";
const selectionInfo = "_selectionInfo_16j1a_286";
const printOptions = "_printOptions_16j1a_310";
const optionGroup = "_optionGroup_16j1a_319";
const quantityInput = "_quantityInput_16j1a_330";
const totalLabels = "_totalLabels_16j1a_356";
const actions = "_actions_16j1a_378";
const previewBtn = "_previewBtn_16j1a_386";
const printBtn = "_printBtn_16j1a_399";
const documentsGrid = "_documentsGrid_16j1a_419";
const documentCard = "_documentCard_16j1a_425";
const docIcon = "_docIcon_16j1a_443";
const docName = "_docName_16j1a_454";
const docActions = "_docActions_16j1a_459";
const historyList = "_historyList_16j1a_484";
const historyItem = "_historyItem_16j1a_490";
const jobInfo = "_jobInfo_16j1a_499";
const jobId = "_jobId_16j1a_506";
const jobType = "_jobType_16j1a_511";
const jobItems = "_jobItems_16j1a_515";
const jobTime = "_jobTime_16j1a_519";
const statusBadge = "_statusBadge_16j1a_524";
const done = "_done_16j1a_534";
const printing = "_printing_16j1a_539";
const pending = "_pending_16j1a_544";
const error = "_error_16j1a_549";
const reprintBtn = "_reprintBtn_16j1a_554";
const printerSettings = "_printerSettings_16j1a_574";
const printerCard = "_printerCard_16j1a_580";
const printerIcon = "_printerIcon_16j1a_590";
const printerInfo = "_printerInfo_16j1a_601";
const printerName = "_printerName_16j1a_608";
const printerModel = "_printerModel_16j1a_613";
const printerStatus = "_printerStatus_16j1a_618";
const online = "_online_16j1a_623";
const offline = "_offline_16j1a_627";
const labelSettings = "_labelSettings_16j1a_641";
const settingRow = "_settingRow_16j1a_651";
const overlay = "_overlay_16j1a_677";
const previewModal = "_previewModal_16j1a_688";
const modalHeader = "_modalHeader_16j1a_696";
const previewContent = "_previewContent_16j1a_717";
const modalFooter = "_modalFooter_16j1a_768";
const sectionHeader = "_sectionHeader_16j1a_816";
const usbConnectBtn = "_usbConnectBtn_16j1a_827";
const printStatusBar = "_printStatusBar_16j1a_846";
const printerActions = "_printerActions_16j1a_858";
const deleteBtn = "_deleteBtn_16j1a_888";
const infoBox = "_infoBox_16j1a_899";
const note = "_note_16j1a_921";
const spinning = "_spinning_16j1a_940";
const previewIframe = "_previewIframe_16j1a_945";
const noPreview = "_noPreview_16j1a_954";
const designBadge = "_designBadge_16j1a_971";
const styles = {
  printCenter,
  header,
  headerLeft,
  backBtn,
  headerTitle,
  headerActions,
  settingsBtn,
  tabs,
  tab,
  active,
  content,
  section,
  templatesGrid,
  templateCard,
  selected,
  templateIcon,
  templateInfo,
  templateName,
  templateSize,
  checkIcon,
  searchBar,
  productsList,
  productItem,
  productInfo,
  productName,
  productMeta,
  productPrice,
  selectionInfo,
  printOptions,
  optionGroup,
  quantityInput,
  totalLabels,
  actions,
  previewBtn,
  printBtn,
  documentsGrid,
  documentCard,
  docIcon,
  docName,
  docActions,
  historyList,
  historyItem,
  jobInfo,
  jobId,
  jobType,
  jobItems,
  jobTime,
  statusBadge,
  done,
  printing,
  pending,
  error,
  reprintBtn,
  printerSettings,
  printerCard,
  printerIcon,
  printerInfo,
  printerName,
  printerModel,
  printerStatus,
  online,
  offline,
  labelSettings,
  settingRow,
  overlay,
  previewModal,
  modalHeader,
  previewContent,
  modalFooter,
  sectionHeader,
  usbConnectBtn,
  printStatusBar,
  printerActions,
  deleteBtn,
  infoBox,
  note,
  spinning,
  previewIframe,
  noPreview,
  designBadge
};
const labelTemplates = [
  {
    id: "price-standard",
    name: "ÉTIQUETTE STANDARD",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 24 }),
    description: "Prix + code-barres - Design minimal",
    size: "60x40mm",
    category: "price",
    labelType: "standard"
  },
  {
    id: "price-promo",
    name: "ÉTIQUETTE PROMO",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Percent, { size: 24 }),
    description: "Ancien prix barré + nouveau prix",
    size: "60x40mm",
    category: "price",
    labelType: "promotion"
  },
  {
    id: "price-pack",
    name: "ÉTIQUETTE PACK",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 24 }),
    description: "Prix pack + prix unitaire",
    size: "60x40mm",
    category: "price",
    labelType: "pack"
  },
  {
    id: "price-expiry",
    name: "ÉTIQUETTE EXPIRATION",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 24 }),
    description: "Produit proche expiration avec réduction",
    size: "60x40mm",
    category: "price",
    labelType: "expiry"
  },
  {
    id: "price-perkilo",
    name: "ÉTIQUETTE AU KILO",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 24 }),
    description: "Prix au kilogramme + code PLU",
    size: "60x40mm",
    category: "price",
    labelType: "perkilo"
  },
  {
    id: "barcode-only",
    name: "CODE-BARRES SEUL",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Barcode, { size: 24 }),
    description: "Code-barres EAN-13 uniquement",
    size: "40x20mm",
    category: "barcode",
    labelType: "standard"
  },
  {
    id: "loyalty-card",
    name: "CARTE FIDÉLITÉ",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { size: 24 }),
    description: "Carte client avec points et code-barres",
    size: "85x54mm",
    category: "document",
    labelType: "loyalty-card"
  }
];
const documentTemplates = [
  { id: "inventory-report", name: "Rapport d'Inventaire", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 24 }) },
  { id: "stock-movement", name: "Mouvements de Stock", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { size: 24 }) },
  { id: "purchase-order", name: "Bon de Commande", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 24 }) },
  { id: "price-list", name: "Liste des Prix", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 24 }) }
];
const recentJobs = [
  { id: "J001", type: "Étiquettes Prix", items: 25, status: "done", timestamp: new Date(Date.now() - 36e5) },
  { id: "J002", type: "Rapport Inventaire", items: 1, status: "done", timestamp: new Date(Date.now() - 72e5) },
  { id: "J003", type: "Étiquettes Gondole", items: 12, status: "pending", timestamp: /* @__PURE__ */ new Date() }
];
const PrintCenter = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = reactExports.useState("labels");
  const [selectedTemplate, setSelectedTemplate] = reactExports.useState(null);
  const [selectedProducts, setSelectedProducts] = reactExports.useState([]);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [printQuantity, setPrintQuantity] = reactExports.useState(1);
  const [showPreview, setShowPreview] = reactExports.useState(false);
  const [printers, setPrinters] = reactExports.useState([]);
  const [isPrinting, setIsPrinting] = reactExports.useState(false);
  const [printStatus, setPrintStatus] = reactExports.useState(null);
  const [selectedCustomers, setSelectedCustomers] = reactExports.useState([]);
  const { products } = useProductsStore();
  const { customers } = useCustomersStore();
  reactExports.useEffect(() => {
    setPrinters(PrinterService.getPrinters());
  }, []);
  const filteredProducts = products.filter(
    (p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode && p.barcode.includes(searchQuery) || p.sku && p.sku.includes(searchQuery)
  );
  const filteredCustomers = customers.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone && c.phone.includes(searchQuery) || c.barcode && c.barcode.includes(searchQuery)
  );
  const toggleProductSelection = (productId) => {
    setSelectedProducts(
      (prev) => prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };
  const handleConnectUSB = async () => {
    try {
      const device = await PrinterService.requestUSBPrinter();
      if (device) {
        const connected = await PrinterService.connectUSB(device);
        if (connected) {
          const newPrinter = PrinterService.addPrinter({
            name: device.productName || "Imprimante USB",
            type: "thermal",
            connectionType: "usb",
            paperWidth: 80,
            vendorId: device.vendorId,
            productId: device.productId,
            isDefault: true
          });
          setPrinters(PrinterService.getPrinters());
          setPrintStatus(`✅ ${newPrinter.name} connectée!`);
        }
      }
    } catch (error2) {
      setPrintStatus("❌ Impossible de connecter l'imprimante USB");
    }
  };
  const handleTestPrint = async (printer) => {
    setIsPrinting(true);
    setPrintStatus("🖨️ Test d'impression en cours...");
    const success = await PrinterService.testPrint(printer);
    setIsPrinting(false);
    setPrintStatus(success ? "✅ Test d'impression réussi!" : "❌ Échec du test");
  };
  const handlePrint = async () => {
    const template = labelTemplates.find((t) => t.id === selectedTemplate);
    const isLoyalty = template?.labelType === "loyalty-card";
    if (!selectedTemplate || (isLoyalty ? selectedCustomers.length === 0 : selectedProducts.length === 0)) {
      toast.warning(`Sélectionnez un modèle et au moins un ${isLoyalty ? "client" : "produit"}`);
      return;
    }
    setIsPrinting(true);
    setPrintStatus("🖨️ IMPRESSION EN COURS...");
    if (!template) return;
    let successCount = 0;
    const itemsToPrint = isLoyalty ? selectedCustomers : selectedProducts;
    for (const itemId of itemsToPrint) {
      const data = isLoyalty ? (() => {
        const customer = customers.find((c) => c.id === itemId);
        return {
          type: "loyalty-card",
          productName: "",
          barcode: customer?.barcode || "",
          sku: "",
          price: 0,
          customerName: customer?.name,
          loyaltyPoints: customer?.loyaltyPoints || 0,
          memberSince: "2024"
        };
      })() : (() => {
        const product = products.find((p) => p.id === itemId);
        return {
          type: template.labelType,
          productName: product?.name.toUpperCase() || "",
          barcode: product?.barcode || "",
          sku: product?.sku || "",
          price: product?.sellingPrice || 0,
          oldPrice: template.labelType === "promotion" ? Math.round((product?.sellingPrice || 0) * 1.2) : void 0,
          discountPercent: template.labelType === "promotion" ? 17 : template.labelType === "expiry" ? 25 : void 0
        };
      })();
      const labelHTML = JonyHTML.generateLabelHTML(data);
      const printWindow = window.open("", "_blank", isLoyalty ? "width=600,height=400" : "width=400,height=300");
      if (printWindow) {
        printWindow.document.write(labelHTML);
        printWindow.document.close();
        printWindow.onload = () => {
          printWindow.print();
        };
        successCount++;
      }
    }
    setIsPrinting(false);
    setPrintStatus(`✅ ${successCount}/${itemsToPrint.length} DOCUMENTS IMPRIMÉS!`);
    setTimeout(() => setPrintStatus(null), 3e3);
  };
  const getPreviewHTML = () => {
    const template = labelTemplates.find((t) => t.id === selectedTemplate);
    if (!template) return "";
    const isLoyalty = template.labelType === "loyalty-card";
    const targetId = isLoyalty ? selectedCustomers[0] : selectedProducts[0];
    if (!targetId) return "";
    const data = isLoyalty ? (() => {
      const customer = customers.find((c) => c.id === targetId);
      return {
        type: "loyalty-card",
        productName: "",
        barcode: customer?.barcode || "",
        sku: "",
        price: 0,
        customerName: customer?.name,
        loyaltyPoints: customer?.loyaltyPoints || 0,
        memberSince: "2024"
      };
    })() : (() => {
      const product = products.find((p) => p.id === targetId);
      return {
        type: template.labelType,
        productName: product?.name.toUpperCase() || "",
        barcode: product?.barcode || "",
        sku: product?.sku || "",
        price: product?.sellingPrice || 0,
        oldPrice: template.labelType === "promotion" ? Math.round((product?.sellingPrice || 0) * 1.2) : void 0,
        discountPercent: template.labelType === "promotion" ? 17 : template.labelType === "expiry" ? 25 : void 0
      };
    })();
    return JonyHTML.generateLabelHTML(data);
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case "done":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `${styles.statusBadge} ${styles.done}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 14 }),
          " Terminé"
        ] });
      case "printing":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `${styles.statusBadge} ${styles.printing}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 14 }),
          " En cours"
        ] });
      case "pending":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `${styles.statusBadge} ${styles.pending}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14 }),
          " En attente"
        ] });
      case "error":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `${styles.statusBadge} ${styles.error}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14 }),
          " Erreur"
        ] });
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.printCenter, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: styles.header, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.headerLeft, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles.backBtn, onClick: () => navigate("/"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.headerTitle, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 28 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Centre d'Impression" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Étiquettes, rapports et documents" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.headerActions, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.settingsBtn, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 20 }),
        "Configuration"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.tabs, children: [
      { id: "labels", label: "Étiquettes", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 18 }) },
      { id: "documents", label: "Documents", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 18 }) },
      { id: "history", label: "Historique", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 18 }) },
      { id: "settings", label: "Paramètres", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 18 }) }
    ].map((tab2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: `${styles.tab} ${activeTab === tab2.id ? styles.active : ""}`,
        onClick: () => setActiveTab(tab2.id),
        children: [
          tab2.icon,
          tab2.label
        ]
      },
      tab2.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.content, children: [
      activeTab === "labels" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.labelsTab, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "1. Choisir un modèle" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.templatesGrid, children: labelTemplates.map((template) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: `${styles.templateCard} ${selectedTemplate === template.id ? styles.selected : ""}`,
              onClick: () => setSelectedTemplate(template.id),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.templateIcon, children: template.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.templateInfo, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.templateName, children: template.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.templateSize, children: template.size })
                ] }),
                selectedTemplate === template.id && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 20, className: styles.checkIcon })
              ]
            },
            template.id
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
            "2. Sélectionner ",
            selectedTemplate === "loyalty-card" ? "les clients" : "les produits"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.searchBar, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                placeholder: selectedTemplate === "loyalty-card" ? "Rechercher un client (nom, tél, barcode)..." : "Rechercher par nom, code-barres ou SKU...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value)
              }
            )
          ] }),
          selectedTemplate === "loyalty-card" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.productsList, children: filteredCustomers.map((customer) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `${styles.productItem} ${selectedCustomers.includes(customer.id) ? styles.selected : ""}`,
              onClick: () => setSelectedCustomers((prev) => prev.includes(customer.id) ? prev.filter((id) => id !== customer.id) : [...prev, customer.id]),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: selectedCustomers.includes(customer.id), onChange: () => {
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.productInfo, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.productName, children: customer.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.productMeta, children: [
                    customer.phone || "Pas de tél",
                    " • ",
                    customer.barcode || "Pas de barcode"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.productPrice, children: [
                  customer.loyaltyPoints,
                  " PTS"
                ] })
              ]
            },
            customer.id
          )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.productsList, children: filteredProducts.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `${styles.productItem} ${selectedProducts.includes(product.id) ? styles.selected : ""}`,
              onClick: () => toggleProductSelection(product.id),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: selectedProducts.includes(product.id),
                    onChange: () => {
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.productInfo, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.productName, children: product.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.productMeta, children: [
                    product.sku || "N/A",
                    " • ",
                    product.barcode || "N/A"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.productPrice, children: formatCurrency(product.sellingPrice) })
              ]
            },
            product.id
          )) }),
          (selectedTemplate === "loyalty-card" ? selectedCustomers.length : selectedProducts.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.selectionInfo, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              selectedTemplate === "loyalty-card" ? selectedCustomers.length : selectedProducts.length,
              " sélectionné(s)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => selectedTemplate === "loyalty-card" ? setSelectedCustomers([]) : setSelectedProducts([]), children: "Tout désélectionner" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "3. Options d'impression" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.printOptions, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.optionGroup, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Quantité par produit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.quantityInput, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPrintQuantity(Math.max(1, printQuantity - 1)), children: "-" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    value: printQuantity,
                    onChange: (e) => setPrintQuantity(Math.max(1, parseInt(e.target.value) || 1)),
                    min: "1"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPrintQuantity(printQuantity + 1), children: "+" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.totalLabels, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total documents:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: (selectedTemplate === "loyalty-card" ? selectedCustomers.length : selectedProducts.length) * printQuantity })
            ] })
          ] })
        ] }),
        printStatus && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.printStatusBar, children: printStatus }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.actions, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.previewBtn, onClick: () => setShowPreview(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 18 }),
            "Aperçu"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: styles.printBtn,
              onClick: handlePrint,
              disabled: !selectedTemplate || selectedProducts.length === 0 || isPrinting,
              children: [
                isPrinting ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 20, className: styles.spinning }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 20 }),
                isPrinting ? "Impression..." : "Imprimer"
              ]
            }
          )
        ] })
      ] }),
      activeTab === "documents" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.documentsTab, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Rapports et Documents" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.documentsGrid, children: documentTemplates.map((doc) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.documentCard, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.docIcon, children: doc.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.docName, children: doc.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.docActions, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { title: "Aperçu", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { title: "Télécharger", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { title: "Imprimer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 16 }) })
          ] })
        ] }, doc.id)) })
      ] }) }),
      activeTab === "history" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.historyTab, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Impressions Récentes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.historyList, children: recentJobs.map((job) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.historyItem, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.jobInfo, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.jobId, children: job.id }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.jobType, children: job.type }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.jobItems, children: [
              job.items,
              " élément(s)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.jobTime, children: formatTime(job.timestamp) })
          ] }),
          getStatusBadge(job.status),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.reprintBtn, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 16 }),
            " Réimprimer"
          ] })
        ] }, job.id)) })
      ] }) }),
      activeTab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.settingsTab, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.sectionHeader, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Configuration des Imprimantes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: styles.usbConnectBtn, onClick: handleConnectUSB, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Usb, { size: 18 }),
              "Connecter USB"
            ] })
          ] }),
          printStatus && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.printStatusBar, children: printStatus }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.printerSettings, children: printers.map((printer) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.printerCard, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.printerIcon, children: printer.connectionType === "usb" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Usb, { size: 32 }) : printer.connectionType === "network" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { size: 32 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 32 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.printerInfo, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.printerName, children: printer.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.printerModel, children: [
                printer.type === "thermal" ? "Thermique" : printer.type === "label" ? "Étiquettes" : "Standard",
                "• ",
                printer.paperWidth,
                "mm"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${styles.printerStatus} ${printer.status === "online" ? styles.online : styles.offline}`, children: printer.status === "online" ? "En ligne" : "Hors ligne" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.printerActions, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleTestPrint(printer), disabled: isPrinting, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 16 }),
                " Test"
              ] }),
              printer.id !== "browser-default" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: styles.deleteBtn,
                  onClick: () => {
                    PrinterService.removePrinter(printer.id);
                    setPrinters(PrinterService.getPrinters());
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 })
                }
              )
            ] })
          ] }, printer.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Paramètres des Étiquettes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.labelSettings, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.settingRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Format par défaut" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "50x30mm" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "40x20mm" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "100x70mm" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.settingRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Afficher le code-barres" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", defaultChecked: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.settingRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Afficher le QR code" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.section, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Informations Web USB" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.infoBox, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              "💡 ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Imprimantes compatibles:" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Imprimantes thermiques ESC/POS (Epson, Star, etc.)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Imprimantes d'étiquettes Zebra (ZPL)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Imprimantes HPRT, Xprinter, etc." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles.note, children: "⚠️ Web USB nécessite Chrome/Edge et HTTPS en production." })
          ] })
        ] })
      ] })
    ] }),
    showPreview && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.overlay, onClick: () => setShowPreview(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.previewModal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "APERÇU ÉTIQUETTE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowPreview(false), children: "×" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.previewContent, children: selectedTemplate && (selectedTemplate === "loyalty-card" ? selectedCustomers.length > 0 : selectedProducts.length > 0) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "iframe",
        {
          srcDoc: getPreviewHTML(),
          title: "Label Preview",
          className: styles.previewIframe,
          style: {
            width: "100%",
            height: selectedTemplate === "loyalty-card" ? "400px" : "350px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#f5f5f5"
          }
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.noPreview, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "SÉLECTIONNEZ UN MODÈLE ET UN ",
        selectedTemplate === "loyalty-card" ? "CLIENT" : "PRODUIT"
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.modalFooter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.designBadge, children: "✨ DESIGN MINIMAL • PROPRE • HIÉRARCHIQUE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowPreview(false), children: "FERMER" })
      ] })
    ] }) })
  ] });
};
export {
  PrintCenter,
  PrintCenter as default
};

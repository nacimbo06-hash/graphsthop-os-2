import{g as H,d as U,j as e}from"./index-BWim1ooi.js";import{u as G,r as x}from"./router-Bkq7bDSP.js";import{f as m,b as F}from"./formatters-D8ZHRycW.js";import{a9 as V,l as z,a as q,r as Y,X as A,P as J,Q as Z,e as Q,a5 as W,T as K,aI as X,ag as ee,a8 as te}from"./ui-DbZTdean.js";import"./pdf-BXl3LOEh.js";import"./state-BxyrZ_-v.js";import"./charts-Bze2Kl5x.js";function $(b){return new Intl.NumberFormat("fr-DZ").format(Math.round(b))}class se{generateReceiptHTML(t,o=80){const c=o===80?"80mm":"58mm",u=t.items.map(l=>`
            <div class="item">
                <div class="item-name">${l.name}${l.isBundle?' <span class="pack-badge">⬡</span>':""}</div>
                <div class="item-line">
                    <span class="qty-price">${l.quantity} × ${m(l.unitPrice)}</span>
                    <span class="item-total">${m(l.total)}</span>
                </div>
            </div>
        `).join("");return`
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
            width: ${c};
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
            @page { margin: 0; size: ${c} auto; }
        }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <div class="brand-badge">S-POS PREMIUM</div>
            <div class="store-name">${t.storeInfo.name.toUpperCase()}</div>
            <div class="store-info">
                ${t.storeInfo.address}<br>
                TEL: ${t.storeInfo.phone}
            </div>
        </div>
        
        <div class="transaction-info">
            <div class="info-row">
                <span class="id">REFERENCE: #${t.transactionId}</span>
                <span class="date">${F(t.date)}</span>
            </div>
            <div class="info-row">
                <span>CAISSIER: ${t.cashier.toUpperCase()}</span>
                ${t.customer?`<span>CLIENT: ${t.customer.name.toUpperCase()}</span>`:""}
            </div>
        </div>
        
        <div class="items">
            ${u}
        </div>
        
        <div class="totals-section">
            <div class="total-row">
                <span>SOUS-TOTAL</span>
                <span>${m(t.subtotal)}</span>
            </div>
            ${t.discount&&t.discount.amount>0?`
            <div class="total-row discount">
                <span>REMISE ${t.discount.percent}%</span>
                <span>-${m(t.discount.amount)}</span>
            </div>`:""}
            ${t.vat&&t.vat.amount>0?`
            <div class="total-row">
                <span>TVA ${t.vat.rate}%</span>
                <span>${m(t.vat.amount)}</span>
            </div>`:""}
            
            <div class="grand-total">
                <span class="label">TOTAL</span>
                <span class="value">${m(t.total)}</span>
            </div>
        </div>
        
        <div class="payment-summary">
            <div class="payment-method">PAIEMENT: ${t.paymentMethod.toUpperCase()}</div>
            ${t.amountReceived?`
                <div class="payment-row"><span>REÇU:</span><span>${m(t.amountReceived)}</span></div>
                ${t.change&&t.change>0?`<div class="payment-row change"><span>MONNAIE:</span><span>${m(t.change)}</span></div>`:""}
            `:""}
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
</html>`}generateLabelHTML(t){if(t.type==="loyalty-card")return this.generateLoyaltyCardHTML(t);const o=t.type==="promotion",c=t.type==="expiry",u=t.type==="perkilo",l=o&&t.oldPrice?`<div class="old-price">${$(t.oldPrice)} DA</div>`:"",v=(o||c)&&t.discountPercent?`<div class="discount-badge">-${t.discountPercent}%</div>`:"",p=c?'<div class="warning-bar">⚠ À CONSOMMER RAPIDEMENT</div>':"",f=u?"/KG":"",_=u&&t.pluCode?`<div class="plu-code">PLU ${t.pluCode}</div>`:"";return`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Étiquette Prix</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #e5e7eb;
            padding: 32px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        
        /* === LABEL CONTAINER === */
        .label {
            width: 226px; /* ~60mm at 96dpi */
            height: 151px; /* ~40mm at 96dpi */
            background: #ffffff;
            border-radius: 4px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 
                0 1px 3px rgba(0,0,0,0.12),
                0 4px 12px rgba(0,0,0,0.08);
        }
        
        /* === WARNING BAR (for expiry labels) === */
        .warning-bar {
            background: #dc2626;
            color: white;
            font-size: 9px;
            font-weight: 700;
            text-align: center;
            padding: 4px 8px;
            letter-spacing: 0.5px;
        }
        
        /* === MAIN CONTENT === */
        .content {
            flex: 1;
            padding: 12px 14px 8px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        
        /* === PRODUCT NAME === */
        .product-name {
            font-size: 13px;
            font-weight: 700;
            color: #111827;
            line-height: 1.25;
            text-transform: uppercase;
            letter-spacing: -0.01em;
            /* Limit to 2 lines max */
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        /* === PRICE SECTION === */
        .price-section {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            margin: 6px 0;
        }
        
        .price-left {
            display: flex;
            flex-direction: column;
        }
        
        .old-price {
            font-size: 12px;
            font-weight: 500;
            color: #9ca3af;
            text-decoration: line-through;
            margin-bottom: 2px;
        }
        
        .price {
            display: flex;
            align-items: baseline;
        }
        
        .price-value {
            font-size: 42px;
            font-weight: 900;
            color: #000000;
            letter-spacing: -2px;
            line-height: 1;
        }
        
        .price-currency {
            font-size: 16px;
            font-weight: 700;
            color: #374151;
            margin-left: 4px;
        }
        
        .price-unit {
            font-size: 14px;
            font-weight: 600;
            color: #6b7280;
        }
        
        .discount-badge {
            background: #000000;
            color: #ffffff;
            font-size: 14px;
            font-weight: 800;
            padding: 6px 10px;
            border-radius: 6px;
            letter-spacing: -0.5px;
        }
        
        .plu-code {
            background: #f3f4f6;
            color: #374151;
            font-size: 12px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 4px;
            letter-spacing: 1px;
        }
        
        /* === BARCODE SECTION === */
        .barcode-section {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            padding-top: 6px;
            border-top: 1px solid #e5e7eb;
        }
        
        .barcode-container {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }
        
        /* CSS-based barcode visualization */
        .barcode-bars {
            display: flex;
            gap: 1px;
            height: 20px;
        }
        
        .barcode-bars span {
            background: #000;
            width: 2px;
        }
        
        .barcode-bars span:nth-child(odd) { width: 1px; }
        .barcode-bars span:nth-child(3n) { width: 3px; }
        .barcode-bars span:nth-child(5n) { width: 1px; }
        
        .barcode-number {
            font-size: 10px;
            font-weight: 600;
            color: #4b5563;
            letter-spacing: 2px;
            font-family: 'Inter', monospace;
        }
        
        .sku-label {
            font-size: 9px;
            font-weight: 600;
            color: #9ca3af;
            text-align: right;
        }
        
        /* === PRINT STYLES === */
        @media print {
            body { 
                background: white; 
                padding: 0; 
                min-height: auto;
            }
            .label { 
                box-shadow: none; 
                border: 0.5px solid #d1d5db;
            }
            @page { 
                margin: 0; 
                size: 60mm 40mm; 
            }
        }
    </style>
</head>
<body>
    <div class="label">
        ${p}
        <div class="content">
            <div class="product-name">${t.productName}</div>
            
            <div class="price-section">
                <div class="price-left">
                    ${l}
                    <div class="price">
                        <span class="price-value">${$(t.price)}</span>
                        <span class="price-currency">DA${f}</span>
                    </div>
                </div>
                ${v}
                ${_}
            </div>
            
            <div class="barcode-section">
                <div class="barcode-container">
                    <div class="barcode-bars">
                        ${t.barcode?"<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>":""}
                    </div>
                    <div class="barcode-number">${t.barcode||"AUCUN CODE"}</div>
                </div>
                ${t.sku?`<div class="sku-label">SKU: ${t.sku}</div>`:""}
            </div>
        </div>
    </div>
</body>
</html>`}generateLoyaltyCardHTML(t){return`
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
            <div class="holder-name">${t.customerName?.toUpperCase()||"MEMBRE PRIVILÈGE"}</div>
            <div class="points-info">
                <span>MEMBRE DEPUIS: <span style="color:white">${t.memberSince||"2024"}</span></span>
                <span>POINTS: <span class="points-value">${t.loyaltyPoints||0} PTS</span></span>
            </div>
        </div>
        
        <div class="card-footer">
            <div class="barcode-section">
                <!-- Fallback barcode text if font not available -->
                <div class="barcode-text" style="font-size: 14px; letter-spacing: 2px; font-weight: 800;">|||| | ||| || ||</div>
                <div class="barcode-text">${t.barcode}</div>
            </div>
            <div class="member-info">
                VALABLE DANS TOUS LES<br>POINTS DE VENTE GRAPHSHOP
            </div>
        </div>
    </div>
</body>
</html>`}generateDocumentHTML(t,o){return`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${t}</title>
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
                <div class="doc-title">${t}</div>
                <div class="doc-ref">#${o.reference||"REF-"+Date.now().toString().slice(-6)}</div>
            </div>
        </div>
        
        <div class="info-grid">
            <div class="info-box">
                <div class="info-box-title">ÉMIS PAR</div>
                <div class="info-content">
                    <strong>${o.storeInfo?.name||"GRAPHSHOP HQ"}</strong><br>
                    ${o.storeInfo?.address||"Cité des sciences, Alger"}<br>
                    Tél: ${o.storeInfo?.phone||"+213 555 12 34 56"}<br>
                    NIF: 01234567891234
                </div>
            </div>
            <div class="info-box">
                <div class="info-box-title">${o.recipientTitle||"DESTINATAIRE"}</div>
                <div class="info-content">
                    <strong>${o.recipient?.name||"NOM DU CLIENT"}</strong><br>
                    ${o.recipient?.address||"Adresse de livraison"}<br>
                    Tél: ${o.recipient?.phone||"Pas de numéro"}
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
                ${(o.items||[]).map(c=>`
                <tr class="item-row">
                    <td>
                        <div style="font-weight: 600; color: #0f172a">${c.name}</div>
                        <div style="font-size: 11px; color: #94a3b8">${c.sku||""}</div>
                    </td>
                    <td style="text-align: center">${c.quantity}</td>
                    <td style="text-align: right">${new Intl.NumberFormat("fr-DZ").format(c.unitPrice)} DA</td>
                    <td style="text-align: right; font-weight: 600">${new Intl.NumberFormat("fr-DZ").format(c.total)} DA</td>
                </tr>
                `).join("")}
            </tbody>
        </table>
        
        <div class="total-section">
            <div class="total-row">
                <span>SOUS-TOTAL</span>
                <span>${new Intl.NumberFormat("fr-DZ").format(o.subtotal||0)} DA</span>
            </div>
            <div class="total-row">
                <span>REMISE TOTAL</span>
                <span>-${new Intl.NumberFormat("fr-DZ").format(o.discountAmount||0)} DA</span>
            </div>
            <div class="grand-total">
                <span style="font-size: 14px; color: #94a3b8; margin-right: 20px">SOLDE TOTAL</span>
                ${new Intl.NumberFormat("fr-DZ").format(o.totalAmount||0)} DA
            </div>
        </div>
        
        <div class="footer">
            <div>GÉNÉRÉ LE ${new Date().toLocaleDateString("fr-FR")} À ${new Date().toLocaleTimeString("fr-FR")}</div>
            <div>PAGE 1 SUR 1 • GRAPHSHOP OS - SYSTÈME DE GESTION PROFESSIONNEL</div>
        </div>
    </div>
</body>
</html>`}}const E=new se,ne="_printCenter_v2qt5_3",ie="_header_v2qt5_12",oe="_backBtn_v2qt5_21",ae="_headerTitle_v2qt5_40",re="_mainContent_v2qt5_54",ce="_leftPanel_v2qt5_63",de="_rightPanel_v2qt5_70",le="_section_v2qt5_77",pe="_templateGrid_v2qt5_94",me="_templateCard_v2qt5_100",xe="_selected_v2qt5_119",fe="_templateIcon_v2qt5_124",ge="_templateName_v2qt5_135",ue="_templateSize_v2qt5_141",he="_checkIcon_v2qt5_146",be="_searchBar_v2qt5_154",ve="_productsList_v2qt5_192",ye="_productItem_v2qt5_200",we="_productMain_v2qt5_215",_e="_checkbox_v2qt5_223",je="_productInfo_v2qt5_241",Ne="_productName_v2qt5_246",ke="_productMeta_v2qt5_255",Pe="_productVariety_v2qt5_261",Ie="_productPrice_v2qt5_272",Te="_quantityControl_v2qt5_279",Ce="_emptyState_v2qt5_312",Se="_quickActions_v2qt5_323",ze="_quickAction_v2qt5_323",qe="_badge_v2qt5_358",Ae="_summary_v2qt5_368",$e="_summaryRow_v2qt5_374",Ee="_totalLabels_v2qt5_390",Me="_clearBtn_v2qt5_395",Le="_printActions_v2qt5_413",Re="_previewBtn_v2qt5_420",Oe="_printBtn_v2qt5_421",De="_overlay_v2qt5_461",Be="_previewModal_v2qt5_472",He="_modalHeader_v2qt5_481",Ue="_previewContent_v2qt5_504",Ge="_previewIframe_v2qt5_512",Fe="_noPreview_v2qt5_520",n={printCenter:ne,header:ie,backBtn:oe,headerTitle:ae,mainContent:re,leftPanel:ce,rightPanel:de,section:le,templateGrid:pe,templateCard:me,selected:xe,templateIcon:fe,templateName:ge,templateSize:ue,checkIcon:he,searchBar:be,productsList:ve,productItem:ye,productMain:we,checkbox:_e,productInfo:je,productName:Ne,productMeta:ke,productVariety:Pe,productPrice:Ie,quantityControl:Te,emptyState:Ce,quickActions:Se,quickAction:ze,badge:qe,summary:Ae,summaryRow:$e,totalLabels:Ee,clearBtn:Me,printActions:Le,previewBtn:Re,printBtn:Oe,overlay:De,previewModal:Be,modalHeader:He,previewContent:Ue,previewIframe:Ge,noPreview:Fe},k=[{id:"standard",name:"STANDARD",icon:e.jsx(X,{size:28}),description:"Nom + Prix + Code-barres",size:"60×40mm",labelType:"standard",color:"#10b981"},{id:"promo",name:"PROMO",icon:e.jsx(ee,{size:28}),description:"Ancien prix barré + Nouveau",size:"60×40mm",labelType:"promotion",color:"#f59e0b"},{id:"shelf",name:"RAYON",icon:e.jsx(te,{size:28}),description:"Étiquette gondole longue",size:"100×30mm",labelType:"standard",color:"#6366f1"}],Xe=()=>{const b=G(),t=H(),{products:o}=U(),[c,u]=x.useState("standard"),[l,v]=x.useState(""),[p,f]=x.useState([]),[_,j]=x.useState(!1),[P,I]=x.useState(!1),T=x.useMemo(()=>{if(!l.trim())return o.slice(0,50);const s=l.toLowerCase();return o.filter(i=>{const r=(i.name||"").toLowerCase().includes(s),a=(i.designation||"").toLowerCase().includes(s),d=(i.variety||"").toLowerCase().includes(s),N=(i.shortName||"").toLowerCase().includes(s),h=(i.barcode||"").includes(s),g=(i.sku||"").toLowerCase().includes(s);return r||a||d||N||h||g})},[o,l]),y=x.useMemo(()=>o.filter(s=>s.stock<=(s.minStock||5)),[o]),w=x.useMemo(()=>{const s=Date.now()-6048e5;return o.filter(i=>(i.createdAt?new Date(i.createdAt).getTime():0)>s)},[o]),C=p.reduce((s,i)=>s+i.quantity,0),M=s=>{f(i=>i.find(a=>a.productId===s)?i.filter(a=>a.productId!==s):[...i,{productId:s,quantity:1}])},S=(s,i)=>{f(r=>r.map(a=>a.productId===s?{...a,quantity:Math.max(1,a.quantity+i)}:a))},L=()=>{const s=y.map(i=>({productId:i.id,quantity:1}));f(i=>{const r=new Set(i.map(d=>d.productId)),a=s.filter(d=>!r.has(d.productId));return[...i,...a]}),t.success(`${y.length} produits en rupture ajoutés`)},R=()=>{const s=w.map(i=>({productId:i.id,quantity:1}));f(i=>{const r=new Set(i.map(d=>d.productId)),a=s.filter(d=>!r.has(d.productId));return[...i,...a]}),t.success(`${w.length} nouveaux produits ajoutés`)},O=()=>{f([])},D=async()=>{if(p.length===0){t.warning("Sélectionnez au moins un produit");return}I(!0);const s=k.find(r=>r.id===c);let i=0;for(const r of p){const a=o.find(h=>h.id===r.productId);if(!a)continue;const d={type:s?.labelType||"standard",productName:a.designation||a.name.toUpperCase(),barcode:a.barcode||"",sku:a.sku||"",price:a.sellPrice||a.sellingPrice,oldPrice:s?.labelType==="promotion"?Math.round(a.sellingPrice*1.2):void 0,discountPercent:s?.labelType==="promotion"?17:void 0},N=E.generateLabelHTML(d);for(let h=0;h<r.quantity;h++){const g=window.open("","_blank","width=400,height=300");g&&(g.document.write(N),g.document.close(),g.onload=()=>g.print(),i++)}}I(!1),t.success(`${i} étiquettes envoyées à l'impression`)},B=()=>{if(p.length===0)return"";const s=p[0],i=o.find(d=>d.id===s.productId);if(!i)return"";const r=k.find(d=>d.id===c),a={type:r?.labelType||"standard",productName:i.designation||i.name.toUpperCase(),barcode:i.barcode||"",sku:i.sku||"",price:i.sellPrice||i.sellingPrice,oldPrice:r?.labelType==="promotion"?Math.round(i.sellingPrice*1.2):void 0,discountPercent:r?.labelType==="promotion"?17:void 0};return E.generateLabelHTML(a)};return e.jsxs("div",{className:n.printCenter,children:[e.jsxs("header",{className:n.header,children:[e.jsx("button",{className:n.backBtn,onClick:()=>b("/"),children:e.jsx(V,{size:20})}),e.jsxs("div",{className:n.headerTitle,children:[e.jsx(z,{size:28}),e.jsx("h1",{children:"Centre d'Impression"})]})]}),e.jsxs("div",{className:n.mainContent,children:[e.jsxs("div",{className:n.leftPanel,children:[e.jsxs("section",{className:n.section,children:[e.jsx("h2",{children:"1. Choisir le modèle"}),e.jsx("div",{className:n.templateGrid,children:k.map(s=>e.jsxs("button",{className:`${n.templateCard} ${c===s.id?n.selected:""}`,onClick:()=>u(s.id),style:{"--template-color":s.color},children:[e.jsx("div",{className:n.templateIcon,children:s.icon}),e.jsx("span",{className:n.templateName,children:s.name}),e.jsx("span",{className:n.templateSize,children:s.size}),c===s.id&&e.jsx(q,{size:18,className:n.checkIcon})]},s.id))})]}),e.jsxs("section",{className:n.section,children:[e.jsx("h2",{children:"2. Sélectionner les produits"}),e.jsxs("div",{className:n.searchBar,children:[e.jsx(Y,{size:18}),e.jsx("input",{type:"text",placeholder:"Rechercher par nom, code-barres ou SKU...",value:l,onChange:s=>v(s.target.value)}),l&&e.jsx("button",{onClick:()=>v(""),children:e.jsx(A,{size:16})})]}),e.jsxs("div",{className:n.productsList,children:[T.map(s=>{const i=p.find(a=>a.productId===s.id),r=!!i;return e.jsxs("div",{className:`${n.productItem} ${r?n.selected:""}`,children:[e.jsxs("div",{className:n.productMain,onClick:()=>M(s.id),children:[e.jsx("div",{className:n.checkbox,children:r&&e.jsx(q,{size:18})}),e.jsxs("div",{className:n.productInfo,children:[e.jsx("span",{className:n.productName,children:s.designation||s.name}),s.variety&&e.jsx("span",{className:n.productVariety,children:s.variety}),e.jsxs("span",{className:n.productMeta,children:[s.sku||"N/A"," • ",s.barcode||"Sans code"]})]}),e.jsx("span",{className:n.productPrice,children:m(s.sellPrice||s.sellingPrice)})]}),r&&e.jsxs("div",{className:n.quantityControl,children:[e.jsx("button",{onClick:()=>S(s.id,-1),children:"−"}),e.jsx("span",{children:i?.quantity}),e.jsx("button",{onClick:()=>S(s.id,1),children:"+"})]})]},s.id)}),T.length===0&&e.jsxs("div",{className:n.emptyState,children:[e.jsx(J,{size:48}),e.jsx("p",{children:"Aucun produit trouvé"})]})]})]})]}),e.jsxs("div",{className:n.rightPanel,children:[e.jsxs("section",{className:n.section,children:[e.jsx("h2",{children:"Actions Rapides"}),e.jsxs("div",{className:n.quickActions,children:[e.jsxs("button",{className:n.quickAction,onClick:L,disabled:y.length===0,children:[e.jsx(Z,{size:20}),e.jsx("span",{children:"Stock Bas"}),e.jsx("span",{className:n.badge,children:y.length})]}),e.jsxs("button",{className:n.quickAction,onClick:R,disabled:w.length===0,children:[e.jsx(Q,{size:20}),e.jsx("span",{children:"Nouveaux"}),e.jsx("span",{className:n.badge,children:w.length})]})]})]}),e.jsxs("section",{className:n.section,children:[e.jsx("h2",{children:"Récapitulatif"}),e.jsxs("div",{className:n.summary,children:[e.jsxs("div",{className:n.summaryRow,children:[e.jsx("span",{children:"Produits sélectionnés"}),e.jsx("strong",{children:p.length})]}),e.jsxs("div",{className:n.summaryRow,children:[e.jsx("span",{children:"Total étiquettes"}),e.jsx("strong",{className:n.totalLabels,children:C})]})]}),p.length>0&&e.jsx("button",{className:n.clearBtn,onClick:O,children:"Tout désélectionner"})]}),e.jsxs("div",{className:n.printActions,children:[e.jsxs("button",{className:n.previewBtn,onClick:()=>j(!0),disabled:p.length===0,children:[e.jsx(W,{size:20}),"Aperçu"]}),e.jsxs("button",{className:n.printBtn,onClick:D,disabled:p.length===0||P,children:[e.jsx(z,{size:20}),P?"Impression...":`Imprimer (${C})`]})]})]})]}),_&&e.jsx("div",{className:n.overlay,onClick:()=>j(!1),children:e.jsxs("div",{className:n.previewModal,onClick:s=>s.stopPropagation(),children:[e.jsxs("div",{className:n.modalHeader,children:[e.jsx("h2",{children:"Aperçu"}),e.jsx("button",{onClick:()=>j(!1),children:e.jsx(A,{size:24})})]}),e.jsx("div",{className:n.previewContent,children:p.length>0?e.jsx("iframe",{srcDoc:B(),title:"Label Preview",className:n.previewIframe}):e.jsxs("div",{className:n.noPreview,children:[e.jsx(K,{size:48}),e.jsx("p",{children:"Sélectionnez un produit pour voir l'aperçu"})]})})]})})]})};export{Xe as PrintCenter,Xe as default};

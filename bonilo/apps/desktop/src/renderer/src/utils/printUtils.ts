/**
 * For Treasury Reports and Receipts
 */

import { formatCurrency, formatDate, formatTime, formatDateTime } from './formatters';

// Store info
const STORE_INFO = {
    name: 'IGO',
    address: 'Alger, Algérie',
    phone: '0555 123 456',
    nif: '000123456789012',
    nis: '000987654321',
    rc: '00 B 0123456',
};

export interface ReceiptData {
    number: string;
    date: Date;
    cashierName: string;
    items: {
        name: string;
        qty: number;
        price: number;
        total: number;
    }[];
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
    amountPaid: number;
    change: number;
}

export interface ZReportData {
    date: Date;
    openingBalance: number;
    closingBalance: number;
    cashierName: string;
    salesSummary: {
        totalSales: number;
        salesCount: number;
        averageTicket: number;
        cashSales: number;
        cardSales: number;
        dahabiaSales: number;
    };
    refunds: { total: number; count: number };
    expenses: { total: number; count: number };
    deposits: number;
    withdrawals: number;
    theoreticalBalance: number;
    actualBalance: number;
    difference: number;
}

/**
 * Generate receipt HTML for printing
 */
export const generateReceiptHTML = (data: ReceiptData): string => {
    // Using centralized formatters


    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ticket ${data.number}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Courier New', monospace; 
            font-size: 12px; 
            width: 80mm; 
            padding: 5mm;
            background: white;
        }
        .header { text-align: center; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
        .store-name { font-size: 16px; font-weight: bold; }
        .store-info { font-size: 10px; color: #666; }
        .receipt-info { margin: 10px 0; font-size: 11px; }
        .items { margin: 10px 0; border-bottom: 1px dashed #000; padding-bottom: 10px; }
        .item { display: flex; justify-content: space-between; margin: 3px 0; }
        .item-name { max-width: 60%; }
        .totals { margin: 10px 0; }
        .total-row { display: flex; justify-content: space-between; margin: 3px 0; }
        .grand-total { font-size: 16px; font-weight: bold; border-top: 1px solid #000; padding-top: 5px; margin-top: 5px; }
        .payment { margin: 10px 0; padding: 10px 0; border-top: 1px dashed #000; }
        .footer { text-align: center; font-size: 10px; margin-top: 15px; }
        .barcode { text-align: center; font-size: 20px; letter-spacing: 3px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <div class="store-name">${STORE_INFO.name}</div>
        <div class="store-info">${STORE_INFO.address}</div>
        <div class="store-info">Tél: ${STORE_INFO.phone}</div>
        <div class="store-info">NIF: ${STORE_INFO.nif}</div>
    </div>
    
    <div class="receipt-info">
        <div>Ticket N°: ${data.number}</div>
        <div>Date: ${formatDate(data.date)} ${formatTime(data.date)}</div>
        <div>Caissier: ${data.cashierName}</div>
    </div>
    
    <div class="items">
        ${data.items.map(item => `
            <div class="item">
                <span class="item-name">${item.name}</span>
                <span>${item.qty}x${item.price}</span>
                <span>${formatCurrency(item.total)}</span>
            </div>
        `).join('')}
    </div>
    
    <div class="totals">
        <div class="total-row">
            <span>Sous-total:</span>
            <span>${formatCurrency(data.subtotal)}</span>
        </div>
        <div class="total-row">
            <span>TVA (0%):</span>
            <span>${formatCurrency(data.tax)}</span>
        </div>
        <div class="total-row grand-total">
            <span>TOTAL:</span>
            <span>${formatCurrency(data.total)}</span>
        </div>
    </div>
    
    <div class="payment">
        <div class="total-row">
            <span>Mode: ${data.paymentMethod}</span>
        </div>
        <div class="total-row">
            <span>Payé:</span>
            <span>${formatCurrency(data.amountPaid)}</span>
        </div>
        <div class="total-row">
            <span>Rendu:</span>
            <span>${formatCurrency(data.change)}</span>
        </div>
    </div>
    
    <div class="barcode">||||| ${data.number} |||||</div>
    
    <div class="footer">
        <p>Merci pour votre visite!</p>
        <p>À bientôt 🛒</p>
    </div>
</body>
</html>
    `;
};

/**
 * Generate Z-Report HTML for printing/PDF
 */
export const generateZReportHTML = (data: ZReportData): string => {
    // Using centralized formatters
    const now = new Date();

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Rapport Z - ${formatDate(data.date)}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            font-size: 12px; 
            max-width: 210mm;
            margin: 0 auto;
            padding: 15mm;
            background: white;
            color: #333;
        }
        .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start;
            border-bottom: 2px solid #2563EB;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .logo { font-size: 24px; font-weight: bold; color: #2563EB; }
        .store-info { font-size: 10px; color: #666; margin-top: 5px; }
        .report-title { text-align: right; }
        .report-title h1 { font-size: 20px; color: #1F2937; }
        .report-title .date { font-size: 14px; color: #6B7280; text-transform: capitalize; }
        
        .summary-grid { 
            display: grid; 
            grid-template-columns: repeat(4, 1fr); 
            gap: 15px; 
            margin: 20px 0;
        }
        .summary-card { 
            padding: 15px; 
            border-radius: 8px; 
            background: #F3F4F6;
        }
        .summary-card.primary { background: #EBF5FF; border-left: 4px solid #2563EB; }
        .summary-card.success { background: #ECFDF5; border-left: 4px solid #10B981; }
        .summary-card.danger { background: #FEF2F2; border-left: 4px solid #EF4444; }
        .summary-card.warning { background: #FFFBEB; border-left: 4px solid #F59E0B; }
        .card-label { font-size: 11px; color: #6B7280; text-transform: uppercase; }
        .card-value { font-size: 20px; font-weight: bold; margin-top: 5px; }
        
        .section { margin: 25px 0; }
        .section-title { 
            font-size: 14px; 
            font-weight: bold; 
            color: #1F2937; 
            padding-bottom: 8px; 
            border-bottom: 1px solid #E5E7EB;
            margin-bottom: 15px;
        }
        
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { 
            padding: 10px; 
            text-align: left; 
            border-bottom: 1px solid #E5E7EB;
        }
        .table th { 
            background: #F9FAFB; 
            font-weight: 600; 
            font-size: 11px; 
            text-transform: uppercase;
            color: #6B7280;
        }
        .table .amount { text-align: right; font-weight: 500; }
        .table .positive { color: #10B981; }
        .table .negative { color: #EF4444; }
        
        .balance-box {
            background: linear-gradient(135deg, #2563EB, #1D4ED8);
            color: white;
            padding: 20px;
            border-radius: 12px;
            margin: 25px 0;
        }
        .balance-row { 
            display: flex; 
            justify-content: space-between; 
            padding: 8px 0;
            border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        .balance-row:last-child { border-bottom: none; }
        .balance-row.total { 
            font-size: 18px; 
            font-weight: bold;
            padding-top: 15px;
            margin-top: 10px;
            border-top: 2px solid rgba(255,255,255,0.3);
        }
        
        .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
            padding-top: 20px;
        }
        .signature-box {
            width: 200px;
            text-align: center;
        }
        .signature-line {
            border-top: 1px solid #333;
            margin-top: 50px;
            padding-top: 5px;
            font-size: 11px;
        }
        
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #E5E7EB;
            font-size: 10px;
            color: #9CA3AF;
            text-align: center;
        }
        
        @media print {
            body { padding: 10mm; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="logo">📊 ${STORE_INFO.name}</div>
            <div class="store-info">${STORE_INFO.address} | Tél: ${STORE_INFO.phone}</div>
            <div class="store-info">NIF: ${STORE_INFO.nif} | RC: ${STORE_INFO.rc}</div>
        </div>
        <div class="report-title">
            <h1>RAPPORT Z</h1>
            <div class="date">${formatDate(data.date)}</div>
        </div>
    </div>
    
    <div class="summary-grid">
        <div class="summary-card success">
            <div class="card-label">Ventes totales</div>
            <div class="card-value">${formatCurrency(data.salesSummary.totalSales)}</div>
        </div>
        <div class="summary-card primary">
            <div class="card-label">Nombre de ventes</div>
            <div class="card-value">${data.salesSummary.salesCount}</div>
        </div>
        <div class="summary-card warning">
            <div class="card-label">Ticket moyen</div>
            <div class="card-value">${formatCurrency(data.salesSummary.averageTicket)}</div>
        </div>
        <div class="summary-card danger">
            <div class="card-label">Remboursements</div>
            <div class="card-value">${formatCurrency(data.refunds.total)}</div>
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">💳 Ventes par mode de paiement</div>
        <table class="table">
            <thead>
                <tr>
                    <th>Mode de paiement</th>
                    <th class="amount">Montant</th>
                    <th class="amount">%</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>💵 Espèces</td>
                    <td class="amount">${formatCurrency(data.salesSummary.cashSales)}</td>
                    <td class="amount">${Math.round(data.salesSummary.cashSales / data.salesSummary.totalSales * 100)}%</td>
                </tr>
                <tr>
                    <td>💳 Carte CIB</td>
                    <td class="amount">${formatCurrency(data.salesSummary.cardSales)}</td>
                    <td class="amount">${Math.round(data.salesSummary.cardSales / data.salesSummary.totalSales * 100)}%</td>
                </tr>
                <tr>
                    <td>📱 Dahabia</td>
                    <td class="amount">${formatCurrency(data.salesSummary.dahabiaSales)}</td>
                    <td class="amount">${Math.round(data.salesSummary.dahabiaSales / data.salesSummary.totalSales * 100)}%</td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div class="section">
        <div class="section-title">💰 Mouvements de caisse</div>
        <table class="table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th class="amount">Montant</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Fond d'ouverture</td>
                    <td class="amount">${formatCurrency(data.openingBalance)}</td>
                </tr>
                <tr>
                    <td>+ Ventes espèces</td>
                    <td class="amount positive">+${formatCurrency(data.salesSummary.cashSales)}</td>
                </tr>
                <tr>
                    <td>+ Dépôts</td>
                    <td class="amount positive">+${formatCurrency(data.deposits)}</td>
                </tr>
                <tr>
                    <td>- Remboursements</td>
                    <td class="amount negative">-${formatCurrency(data.refunds.total)}</td>
                </tr>
                <tr>
                    <td>- Dépenses (${data.expenses.count})</td>
                    <td class="amount negative">-${formatCurrency(data.expenses.total)}</td>
                </tr>
                <tr>
                    <td>- Retraits</td>
                    <td class="amount negative">-${formatCurrency(data.withdrawals)}</td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div class="balance-box">
        <div class="balance-row">
            <span>Solde théorique:</span>
            <span>${formatCurrency(data.theoreticalBalance)}</span>
        </div>
        <div class="balance-row">
            <span>Solde réel compté:</span>
            <span>${formatCurrency(data.actualBalance)}</span>
        </div>
        <div class="balance-row total">
            <span>Écart:</span>
            <span>${data.difference >= 0 ? '+' : ''}${formatCurrency(data.difference)}</span>
        </div>
    </div>
    
    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-line">Caissier: ${data.cashierName}</div>
        </div>
        <div class="signature-box">
            <div class="signature-line">Responsable</div>
        </div>
    </div>
    
    <div class="footer">
        <p>Document généré le ${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR')}</p>
        <p>${STORE_INFO.name} - Système de gestion</p>
    </div>
</body>
</html>
    `;
};

/**
 * Print the content in a new window
 */
export const printContent = (html: string): void => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }
};

/**
 * Download content as PDF (using browser print to PDF)
 */
export const downloadAsPDF = (html: string, filename: string): void => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(`
            ${html}
            <script>
                document.title = '${filename}';
                window.onload = function() {
                    window.print();
                }
            </script>
        `);
        printWindow.document.close();
    }
};

/**
 * Print Z-Report
 */
export const printZReport = (data: ZReportData): void => {
    const html = generateZReportHTML(data);

    printContent(html);
};

/**
 * Export Z-Report as PDF
 */
export const exportZReportPDF = (data: ZReportData): void => {
    const html = generateZReportHTML(data);
    const dateStr = data.date.toISOString().split('T')[0];
    downloadAsPDF(html, `Rapport-Z-${dateStr}`);
};

/**
 * Print receipt
 */
export const printReceipt = (data: ReceiptData): void => {
    const html = generateReceiptHTML(data);
    printContent(html);
};

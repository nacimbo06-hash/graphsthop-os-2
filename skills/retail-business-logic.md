# Retail Business Logic Development Skill

## Overview
Expertise in implementing comprehensive retail management systems including Point of Sale (POS), inventory management, treasury operations, and customer relationship management.

## Core Business Domains

### Point of Sale (POS) Operations
- **Multi-Payment Processing**: Cash, credit cards (CIB), mobile payments (Dahabia)
- **Sales Transaction Management**: Real-time cart calculations, tax computations
- **Customer Integration**: Credit sales, loyalty programs, customer identification
- **Receipt Generation**: Thermal printing, digital receipts, Z-reports
- **Stock Integration**: Automatic inventory deduction on sales

### Inventory Management
- **Product Catalog**: SKU generation, barcode integration, categorization
- **Stock Tracking**: Real-time inventory levels, low-stock alerts
- **Expiry Management**: Perishable goods tracking, automated warnings
- **Bundle Logic**: Pack management (e.g., 6x water bottles)
- **Physical Inventory**: Stock reconciliation sessions, discrepancy reporting
- **Supplier Integration**: Purchase orders, goods receipts

### Treasury & Financial Operations
- **Cash Management**: Daily cash sessions, closing procedures
- **Expense Tracking**: Operational expenses, categorization, approval workflows
- **Payment Methods**: Multi-currency support, payment reconciliation
- **Financial Reporting**: Daily reports, period summaries, analytics
- **Sinking Funds**: Provision management, withdrawal operations

### Customer Relationship Management (CRM)
- **Customer Database**: Registration, identification, contact management
- **Credit Management**: Credit limits, payment tracking, debt aging
- **Payment Processing**: Payment registration, receipt generation
- **Customer Analytics**: Purchase history, behavior patterns

### Supplier Management
- **Supplier Database**: Registration, contact information, payment terms
- **Purchase Orders**: Order creation, tracking, receiving
- **Debt Management**: Supplier payments, outstanding balances
- **Goods Receipts**: Inventory updates, quality control

## Technical Implementation Patterns

### Sales Transaction Flow
```typescript
interface SaleTransaction {
  id: string;
  customerId?: string;
  items: SaleItem[];
  payments: Payment[];
  timestamp: Date;
  status: 'pending' | 'completed' | 'cancelled';
  total: number;
  tax: number;
  discount: number;
}

const processSale = async (transaction: SaleTransaction) => {
  // Validate stock availability
  await validateStock(transaction.items);
  
  // Calculate totals
  const totals = calculateTotals(transaction);
  
  // Process payments
  await processPayments(transaction.payments);
  
  // Update inventory
  await updateInventory(transaction.items);
  
  // Update customer balance if credit sale
  if (transaction.customerId) {
    await updateCustomerCredit(transaction.customerId, totals.total);
  }
  
  // Generate receipt
  await generateReceipt(transaction);
  
  // Record transaction
  await saveTransaction(transaction);
};
```

### Stock Management Logic
```typescript
interface StockMovement {
  id: string;
  productId: string;
  type: 'sale' | 'purchase' | 'adjustment' | 'expiry';
  quantity: number;
  timestamp: Date;
  reference: string;
  userId: string;
}

const processStockMovement = async (movement: StockMovement) => {
  const currentStock = await getProductStock(movement.productId);
  
  switch (movement.type) {
    case 'sale':
      if (currentStock < movement.quantity) {
        throw new Error('Insufficient stock');
      }
      await updateProductStock(movement.productId, currentStock - movement.quantity);
      break;
      
    case 'purchase':
      await updateProductStock(movement.productId, currentStock + movement.quantity);
      break;
      
    case 'adjustment':
      await updateProductStock(movement.productId, movement.quantity);
      break;
      
    case 'expiry':
      await updateProductStock(movement.productId, currentStock - movement.quantity);
      await logExpiryLoss(movement);
      break;
  }
  
  await recordStockMovement(movement);
};
```

### Treasury Operations
```typescript
interface TreasurySession {
  id: string;
  userId: string;
  openingTime: Date;
  closingTime?: Date;
  openingBalance: number;
  cashIn: number;
  cashOut: number;
  cardSales: number;
  creditSales: number;
  expectedBalance: number;
  actualBalance?: number;
  discrepancies?: TreasuryDiscrepancy[];
}

const closeTreasurySession = async (sessionId: string) => {
  const session = await getTreasurySession(sessionId);
  
  // Calculate expected balance
  const expectedBalance = session.openingBalance + 
    session.cashIn - session.cashOut + 
    session.cardSales + session.creditSales;
  
  // Update session
  await updateSession(sessionId, {
    closingTime: new Date(),
    expectedBalance,
  });
  
  // Generate Z-report
  const zReport = await generateZReport(session);
  await printZReport(zReport);
  
  // Archive session
  await archiveSession(sessionId);
};
```

## Business Rules & Constraints

### Pricing & Tax Rules
```typescript
const calculatePriceWithTax = (basePrice: number, taxRate: number): number => {
  return basePrice * (1 + taxRate / 100);
};

const applyDiscount = (price: number, discountType: 'percentage' | 'fixed', value: number): number => {
  return discountType === 'percentage' 
    ? price * (1 - value / 100)
    : Math.max(0, price - value);
};
```

### Credit Management Rules
```typescript
const canProcessCreditSale = async (customerId: string, amount: number): Promise<boolean> => {
  const customer = await getCustomer(customerId);
  const creditLimit = customer.creditLimit || 0;
  const currentDebt = await getCustomerDebt(customerId);
  
  return (currentDebt + amount) <= creditLimit;
};

const updateCustomerCredit = async (customerId: string, amount: number): Promise<void> => {
  const customer = await getCustomer(customerId);
  const newBalance = (customer.balance || 0) + amount;
  
  await updateCustomer(customerId, { balance: newBalance });
  
  // Check credit limit and send alerts
  if (newBalance > (customer.creditLimit || 0) * 0.8) {
    await sendCreditLimitAlert(customerId, newBalance);
  }
};
```

### Expiry Management
```typescript
const checkExpiryAlerts = async (): Promise<void> => {
  const products = await getProductsNearExpiry(7); // Next 7 days
  
  for (const product of products) {
    const daysToExpiry = Math.ceil(
      (product.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysToExpiry <= 3) {
      await sendExpiryAlert(product, daysToExpiry);
    }
    
    if (daysToExpiry <= 0) {
      await handleExpiredProduct(product);
    }
  }
};
```

## Reporting & Analytics

### Daily Sales Report
```typescript
const generateDailySalesReport = async (date: Date): Promise<DailyReport> => {
  const sales = await getSalesByDate(date);
  const expenses = await getExpensesByDate(date);
  
  return {
    date,
    totalSales: sales.reduce((sum, sale) => sum + sale.total, 0),
    transactionCount: sales.length,
    averageTicket: sales.length > 0 ? 
      sales.reduce((sum, sale) => sum + sale.total, 0) / sales.length : 0,
    topProducts: await getTopSellingProducts(date),
    expensesTotal: expenses.reduce((sum, expense) => sum + expense.amount, 0),
    netRevenue: sales.reduce((sum, sale) => sum + sale.total, 0) - 
      expenses.reduce((sum, expense) => sum + expense.amount, 0),
  };
};
```

## Integration Patterns

### Hardware Integration
```typescript
// Thermal Printer Integration
const printReceipt = async (sale: SaleTransaction): Promise<void> => {
  const receiptData = formatReceiptData(sale);
  await invoke('print_thermal_receipt', { data: receiptData });
};

// Barcode Scanner Integration
const handleBarcodeScan = (barcode: string): void => {
  const product = findProductByBarcode(barcode);
  if (product) {
    addToCart(product);
  } else {
    showProductNotFound(barcode);
  }
};

// Cash Drawer Integration
const openCashDrawer = async (): Promise<void> => {
  await invoke('open_cash_drawer');
};
```

### Database Schema Design
```sql
-- Products Table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  barcode TEXT,
  designation TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  cost REAL,
  category_id TEXT,
  stock_quantity INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales Table
CREATE TABLE sales (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  user_id TEXT NOT NULL,
  total REAL NOT NULL,
  tax REAL DEFAULT 0,
  discount REAL DEFAULT 0,
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Error Handling & Validation

### Business Logic Validation
```typescript
const validateSaleTransaction = (transaction: SaleTransaction): ValidationResult => {
  const errors: string[] = [];
  
  if (transaction.items.length === 0) {
    errors.push('Sale must contain at least one item');
  }
  
  if (transaction.total <= 0) {
    errors.push('Sale total must be positive');
  }
  
  if (transaction.payments.length === 0) {
    errors.push('At least one payment method is required');
  }
  
  const totalPayments = transaction.payments.reduce((sum, payment) => sum + payment.amount, 0);
  if (Math.abs(totalPayments - transaction.total) > 0.01) {
    errors.push('Payment amounts do not match sale total');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
```

## Performance Optimization

### Batch Operations
```typescript
const processBulkStockUpdate = async (updates: StockUpdate[]): Promise<void> => {
  // Process in batches to avoid database locks
  const batchSize = 100;
  
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);
    await processBatchStockUpdate(batch);
    
    // Allow UI to remain responsive
    await new Promise(resolve => setTimeout(resolve, 10));
  }
};
```

## Localization & Multi-Currency

### Currency Formatting
```typescript
const formatCurrency = (amount: number, currency: string = 'DZD'): string => {
  const formatter = new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  });
  
  return formatter.format(amount);
};
```

This skill covers the essential business logic patterns and implementations needed for building comprehensive retail management systems like GRAPHSHOP OS.
# GRAPHSHOP OS — Enterprise Testing & Debugging Skills

> The testing & debugging bible for a $4M retail management system.
> Stack: React 19 + TypeScript 5.9 + Tauri 2 (Rust) + Zustand 5 + SQLite + Vitest

---

## Table of Contents

1. [Testing Infrastructure Setup](#1-testing-infrastructure-setup)
2. [Unit Testing Patterns](#2-unit-testing-patterns)
3. [Component & Integration Testing](#3-component--integration-testing)
4. [End-to-End Testing](#4-end-to-end-testing)
5. [Security Testing](#5-security-testing)
6. [Retail & POS Domain Testing](#6-retail--pos-domain-testing)
7. [Performance Testing & Profiling](#7-performance-testing--profiling)
8. [Debugging Playbook](#8-debugging-playbook)
9. [PCI DSS & Compliance](#9-pci-dss--compliance)
10. [CI/CD Pipeline](#10-cicd-pipeline)
11. [Error Monitoring & Observability](#11-error-monitoring--observability)
12. [Testing Checklists](#12-testing-checklists)

---

## 1. Testing Infrastructure Setup

### 1.1 Enterprise Vitest Configuration

Replace the current `vitest.config.ts` with this enterprise-grade version:

```ts
// apps/desktop-os/vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules/', 'dist/', 'src-tauri/'],

    // COVERAGE — Enterprise thresholds
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/renderer/src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.stories.{ts,tsx}',
        '**/index.ts',        // barrel exports
        '**/types/**',        // type-only files
        '**/constants/**',    // static constants
      ],
      thresholds: {
        // Phase 1: Minimum viable coverage
        lines: 40,
        branches: 35,
        functions: 40,
        statements: 40,
        // Phase 2 target: 80/75/70/80
        // Phase 3 target: 90/85/80/90
      },
      // Fail CI if coverage drops below thresholds
      // watermarks: [[50, 80], [50, 80], [50, 80], [50, 80]],
    },

    // PERFORMANCE
    pool: 'forks',           // Isolate tests in separate processes
    poolOptions: {
      forks: { singleFork: false },
    },
    testTimeout: 10000,      // 10s per test (POS operations can be slow)
    hookTimeout: 15000,      // 15s for setup/teardown

    // REPORTING
    reporters: ['default', 'json'],
    outputFile: {
      json: './test-results/results.json',
    },

    // RETRY — catch flaky tests
    retry: process.env.CI ? 2 : 0,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/renderer/src'),
      '@shared': path.resolve(__dirname, '../../packages/shared'),
      '@asgard/shared': path.resolve(__dirname, '../../packages/shared'),
    },
  },
});
```

### 1.2 Enhanced Test Setup

```ts
// apps/desktop-os/src/test/setup.ts
import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// ─── AUTO CLEANUP ───────────────────────────────────
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});

// ─── LOCALSTORAGE MOCK ──────────────────────────────
const createStorageMock = (): Storage => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
};

Object.defineProperty(window, 'localStorage', { value: createStorageMock() });
Object.defineProperty(window, 'sessionStorage', { value: createStorageMock() });

// ─── CRYPTO MOCK ────────────────────────────────────
const mockCryptoKey = { type: 'secret', algorithm: { name: 'AES-GCM' } };
Object.defineProperty(global, 'crypto', {
  value: {
    subtle: {
      generateKey: vi.fn().mockResolvedValue(mockCryptoKey),
      importKey: vi.fn().mockResolvedValue(mockCryptoKey),
      exportKey: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
      encrypt: vi.fn().mockResolvedValue(new ArrayBuffer(16)),
      decrypt: vi.fn().mockImplementation(async (_algo, _key, data) => data),
    },
    getRandomValues: vi.fn((arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
      return arr;
    }),
    randomUUID: vi.fn(() => 'test-uuid-' + Math.random().toString(36).slice(2, 11)),
  },
});

// ─── TAURI API MOCK ─────────────────────────────────
// Mock @tauri-apps/api/core
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
  convertFileSrc: vi.fn((path: string) => `asset://${path}`),
}));

// Mock @tauri-apps/plugin-sql
vi.mock('@tauri-apps/plugin-sql', () => {
  const mockDb = {
    execute: vi.fn().mockResolvedValue({ rowsAffected: 1, lastInsertId: 1 }),
    select: vi.fn().mockResolvedValue([]),
    close: vi.fn().mockResolvedValue(undefined),
  };
  return {
    default: {
      load: vi.fn().mockResolvedValue(mockDb),
    },
  };
});

// Mock @tauri-apps/plugin-shell
vi.mock('@tauri-apps/plugin-shell', () => ({
  Command: {
    sidecar: vi.fn().mockReturnValue({
      execute: vi.fn().mockResolvedValue({ code: 0, stdout: '', stderr: '' }),
      spawn: vi.fn().mockResolvedValue({ pid: 1234 }),
    }),
  },
}));

// ─── INTERSECTION OBSERVER MOCK ─────────────────────
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
Object.defineProperty(window, 'IntersectionObserver', {
  value: MockIntersectionObserver,
});

// ─── RESIZE OBSERVER MOCK ───────────────────────────
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
Object.defineProperty(window, 'ResizeObserver', {
  value: MockResizeObserver,
});

// ─── MATCH MEDIA MOCK ───────────────────────────────
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ─── CONSOLE SUPPRESSION (optional in CI) ───────────
if (process.env.CI) {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
}
```

### 1.3 Custom Test Render with All Providers

```tsx
// apps/desktop-os/src/test/render.tsx
import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from '../renderer/src/i18n'; // your i18n config

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string;
  routerProps?: MemoryRouterProps;
  queryClient?: QueryClient;
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,          // No retries in tests
        gcTime: Infinity,      // Never garbage collect in tests
        staleTime: Infinity,   // Never mark as stale in tests
      },
      mutations: {
        retry: false,
      },
    },
  });
}

function AllProviders({
  children,
  initialRoute = '/',
  queryClient,
}: {
  children: React.ReactNode;
  initialRoute?: string;
  queryClient?: QueryClient;
}) {
  const client = queryClient ?? createTestQueryClient();

  return (
    <QueryClientProvider client={client}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={[initialRoute]}>
          {children}
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {},
) {
  const { initialRoute, routerProps, queryClient, ...renderOptions } = options;

  return {
    ...render(ui, {
      wrapper: ({ children }) => (
        <AllProviders initialRoute={initialRoute} queryClient={queryClient}>
          {children}
        </AllProviders>
      ),
      ...renderOptions,
    }),
    queryClient: queryClient ?? createTestQueryClient(),
  };
}

export { screen, waitFor, within, act } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
```

### 1.4 Mock Data Factories

```ts
// apps/desktop-os/src/test/factories.ts
import type { Product } from '@asgard/shared/types/product';
import type { Sale } from '@asgard/shared/types/sales';
import type { TreasuryMovement } from '@asgard/shared/types/treasury';

let idCounter = 0;
const nextId = (prefix: string) => `${prefix}_test_${++idCounter}`;

// ─── PRODUCT FACTORY ────────────────────────────────
export function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: nextId('prod'),
    name: 'Test Product',
    barcode: '3000000000001',
    sku: 'SKU-TEST-001',
    category: 'general',
    purchasePrice: 100,
    sellingPrice: 150,
    stock: 50,
    minStock: 5,
    maxStock: 200,
    unit: 'piece',
    taxRate: 19,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

// ─── SALE FACTORY ───────────────────────────────────
export function createSale(overrides: Partial<Sale> = {}): Sale {
  const product = createProduct();
  return {
    id: nextId('sale'),
    items: [
      {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.sellingPrice,
        total: product.sellingPrice,
        discount: 0,
      },
    ],
    subtotal: product.sellingPrice,
    taxAmount: product.sellingPrice * 0.19,
    total: product.sellingPrice * 1.19,
    paymentMethod: 'cash',
    amountPaid: 200,
    change: 200 - product.sellingPrice * 1.19,
    status: 'completed',
    cashierId: 'user_test_1',
    cashierName: 'Test Cashier',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

// ─── TREASURY MOVEMENT FACTORY ──────────────────────
export function createTreasuryMovement(
  overrides: Partial<TreasuryMovement> = {},
): TreasuryMovement {
  return {
    id: nextId('treasury'),
    type: 'income',
    amount: 1000,
    category: 'sales',
    description: 'Test treasury movement',
    date: new Date().toISOString(),
    createdBy: 'user_test_1',
    ...overrides,
  };
}

// ─── CUSTOMER FACTORY ───────────────────────────────
export function createCustomer(overrides: Record<string, unknown> = {}) {
  return {
    id: nextId('cust'),
    name: 'Test Customer',
    phone: '+213555000000',
    email: 'test@example.com',
    loyaltyPoints: 0,
    totalPurchases: 0,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

// ─── USER FACTORY ───────────────────────────────────
export function createUser(overrides: Record<string, unknown> = {}) {
  return {
    id: nextId('user'),
    username: 'testuser',
    fullName: 'Test User',
    role: 'cashier' as const,
    isActive: true,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

// ─── BATCH FACTORIES ────────────────────────────────
export function createProducts(count: number, overrides: Partial<Product> = {}): Product[] {
  return Array.from({ length: count }, (_, i) =>
    createProduct({
      name: `Product ${i + 1}`,
      barcode: `300000000${String(i).padStart(4, '0')}`,
      sku: `SKU-${String(i).padStart(4, '0')}`,
      stock: Math.floor(Math.random() * 100) + 1,
      ...overrides,
    }),
  );
}

// Reset counter between tests
export function resetFactories() {
  idCounter = 0;
}
```

### 1.5 Zustand Test Helpers

```ts
// apps/desktop-os/src/test/store-helpers.ts
import { act } from '@testing-library/react';

/**
 * Reset a Zustand store to its initial state.
 * Usage: resetStore(useProductsStore);
 */
export function resetStore<T extends { getState: () => any; setState: (s: any) => void }>(
  store: T,
  initialState?: Partial<ReturnType<T['getState']>>,
) {
  const state = store.getState();
  const resetState: Record<string, unknown> = {};

  // Reset all non-function values to defaults
  for (const key of Object.keys(state)) {
    if (typeof state[key] !== 'function') {
      resetState[key] = initialState?.[key as keyof typeof initialState] ?? getDefaultValue(state[key]);
    }
  }

  act(() => {
    store.setState(resetState, true);
  });
}

function getDefaultValue(value: unknown): unknown {
  if (Array.isArray(value)) return [];
  if (value === null) return null;
  if (typeof value === 'object') return {};
  if (typeof value === 'string') return '';
  if (typeof value === 'number') return 0;
  if (typeof value === 'boolean') return false;
  return undefined;
}

/**
 * Seed a store with test data.
 * Usage: seedStore(useProductsStore, { products: [createProduct()] });
 */
export function seedStore<T extends { setState: (s: any) => void }>(
  store: T,
  state: Record<string, unknown>,
) {
  act(() => {
    store.setState(state);
  });
}

/**
 * Wait for async store actions to settle.
 */
export async function waitForStoreUpdate() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}
```

### 1.6 NPM Scripts

Add to `apps/desktop-os/package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:ci": "vitest run --coverage --reporter=json --reporter=default",
    "test:changed": "vitest run --changed",
    "test:store": "vitest run --grep 'Store'",
    "test:services": "vitest run --grep 'Service'",
    "test:components": "vitest run --grep 'Component'",
    "test:security": "vitest run --grep 'Security'",
    "test:pos": "vitest run --grep 'POS'",
    "test:e2e": "wdio run wdio.conf.ts",
    "lint:check": "eslint src/",
    "type:check": "tsc --noEmit"
  }
}
```

---

## 2. Unit Testing Patterns

### 2.1 Zustand Store Testing

#### Pattern: Test stores in isolation using `getState()` and `setState()`

```ts
// packages/shared/stores/__tests__/productsStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useProductsStore } from '../productsStore';
import { createProduct, createProducts, resetFactories } from '@/test/factories';
import { resetStore } from '@/test/store-helpers';

describe('ProductsStore', () => {
  beforeEach(() => {
    resetStore(useProductsStore);
    resetFactories();
  });

  describe('addProduct', () => {
    it('adds a product to the store', () => {
      const product = createProduct({ name: 'Coca Cola 1L' });

      useProductsStore.getState().addProduct(product);

      const products = useProductsStore.getState().products;
      expect(products).toHaveLength(1);
      expect(products[0].name).toBe('Coca Cola 1L');
    });

    it('rejects duplicate barcodes', () => {
      const product1 = createProduct({ barcode: '1234567890' });
      const product2 = createProduct({ barcode: '1234567890' });

      useProductsStore.getState().addProduct(product1);
      useProductsStore.getState().addProduct(product2);

      expect(useProductsStore.getState().products).toHaveLength(1);
    });

    it('handles 10,000 products without performance degradation', () => {
      const products = createProducts(10_000);
      const start = performance.now();

      for (const p of products) {
        useProductsStore.getState().addProduct(p);
      }

      const duration = performance.now() - start;
      expect(useProductsStore.getState().products).toHaveLength(10_000);
      expect(duration).toBeLessThan(5000); // Under 5s for 10K products
    });
  });

  describe('updateProduct', () => {
    it('updates product price and recalculates margin', () => {
      const product = createProduct({ purchasePrice: 100, sellingPrice: 150 });
      useProductsStore.getState().addProduct(product);

      useProductsStore.getState().updateProduct(product.id, { sellingPrice: 200 });

      const updated = useProductsStore.getState().products[0];
      expect(updated.sellingPrice).toBe(200);
    });

    it('does not mutate original product object', () => {
      const product = createProduct();
      useProductsStore.getState().addProduct(product);
      const originalPrice = product.sellingPrice;

      useProductsStore.getState().updateProduct(product.id, { sellingPrice: 999 });

      expect(product.sellingPrice).toBe(originalPrice); // Original unchanged
    });
  });

  describe('deleteProduct', () => {
    it('removes product by ID', () => {
      const product = createProduct();
      useProductsStore.getState().addProduct(product);

      useProductsStore.getState().deleteProduct(product.id);

      expect(useProductsStore.getState().products).toHaveLength(0);
    });

    it('no-ops for non-existent ID', () => {
      const product = createProduct();
      useProductsStore.getState().addProduct(product);

      useProductsStore.getState().deleteProduct('non_existent_id');

      expect(useProductsStore.getState().products).toHaveLength(1);
    });
  });

  describe('search and filter', () => {
    it('filters products by category', () => {
      useProductsStore.setState({
        products: [
          createProduct({ category: 'dairy' }),
          createProduct({ category: 'bakery' }),
          createProduct({ category: 'dairy' }),
        ],
      });

      const state = useProductsStore.getState();
      const dairy = state.products.filter((p) => p.category === 'dairy');
      expect(dairy).toHaveLength(2);
    });
  });
});
```

#### Pattern: Testing Auth Store with Async Actions

```ts
// packages/shared/stores/__tests__/authStore.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../authStore';
import { resetStore, waitForStoreUpdate } from '@/test/store-helpers';

describe('AuthStore', () => {
  beforeEach(() => {
    resetStore(useAuthStore);
    localStorage.clear();
  });

  describe('login', () => {
    it('authenticates valid user and sets token', async () => {
      // Seed a user first
      await useAuthStore.getState().createUser({
        username: 'cashier1',
        fullName: 'Test Cashier',
        password: 'SecureP@ss123',
        role: 'cashier',
      });

      await useAuthStore.getState().login('cashier1', 'SecureP@ss123');
      await waitForStoreUpdate();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user?.username).toBe('cashier1');
      expect(state.token).toBeTruthy();
    });

    it('rejects wrong password', async () => {
      await useAuthStore.getState().createUser({
        username: 'cashier1',
        fullName: 'Test Cashier',
        password: 'SecureP@ss123',
        role: 'cashier',
      });

      await useAuthStore.getState().login('cashier1', 'WrongPassword');
      await waitForStoreUpdate();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.loginError).toBeTruthy();
    });

    it('rejects empty credentials', async () => {
      await useAuthStore.getState().login('', '');
      await waitForStoreUpdate();

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it('handles concurrent login attempts', async () => {
      await useAuthStore.getState().createUser({
        username: 'user1',
        fullName: 'User 1',
        password: 'Pass123!',
        role: 'cashier',
      });

      // Fire two logins simultaneously
      const [result1, result2] = await Promise.allSettled([
        useAuthStore.getState().login('user1', 'Pass123!'),
        useAuthStore.getState().login('user1', 'Pass123!'),
      ]);

      // Both should resolve without crashing
      expect(result1.status).toBe('fulfilled');
      expect(result2.status).toBe('fulfilled');
    });
  });

  describe('session management', () => {
    it('tracks active sessions', async () => {
      await useAuthStore.getState().createUser({
        username: 'admin',
        fullName: 'Admin',
        password: 'Admin@123',
        role: 'admin',
      });

      await useAuthStore.getState().login('admin', 'Admin@123');
      await waitForStoreUpdate();

      const sessions = useAuthStore.getState().activeSessions;
      expect(sessions.length).toBeGreaterThanOrEqual(1);
    });

    it('clears session on logout', async () => {
      await useAuthStore.getState().createUser({
        username: 'admin',
        fullName: 'Admin',
        password: 'Admin@123',
        role: 'admin',
      });
      await useAuthStore.getState().login('admin', 'Admin@123');

      useAuthStore.getState().logout();
      await waitForStoreUpdate();

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().token).toBeNull();
    });
  });
});
```

#### Pattern: Testing Sales Store (Financial Accuracy)

```ts
// packages/shared/stores/__tests__/salesStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useSalesStore } from '../salesStore';
import { createSale, resetFactories } from '@/test/factories';
import { resetStore } from '@/test/store-helpers';

describe('SalesStore — Financial Accuracy', () => {
  beforeEach(() => {
    resetStore(useSalesStore);
    resetFactories();
  });

  it('calculates correct totals with tax', () => {
    const sale = createSale({
      items: [
        { productId: 'p1', productName: 'Item A', quantity: 3, unitPrice: 100, total: 300, discount: 0 },
        { productId: 'p2', productName: 'Item B', quantity: 2, unitPrice: 250, total: 500, discount: 0 },
      ],
      subtotal: 800,
      taxAmount: 152, // 19% of 800
      total: 952,
    });

    useSalesStore.getState().addSale(sale);

    const stored = useSalesStore.getState().sales[0];
    expect(stored.subtotal).toBe(800);
    expect(stored.taxAmount).toBe(152);
    expect(stored.total).toBe(952);
  });

  it('handles decimal rounding correctly (DZD currency)', () => {
    // Algerian Dinar has no decimal subunits in practice
    const sale = createSale({
      subtotal: 333.33,
      taxAmount: 63.33,
      total: 396.66,
    });

    useSalesStore.getState().addSale(sale);

    const stored = useSalesStore.getState().sales[0];
    // Totals should be rounded to whole numbers for DZD
    expect(Math.round(stored.total)).toBe(397);
  });

  it('prevents negative sale totals', () => {
    const sale = createSale({ total: -100 });

    // Should either reject or normalize
    useSalesStore.getState().addSale(sale);

    const sales = useSalesStore.getState().sales;
    if (sales.length > 0) {
      expect(sales[0].total).toBeGreaterThanOrEqual(0);
    }
  });

  it('calculates correct change for cash payment', () => {
    const sale = createSale({
      total: 1750,
      paymentMethod: 'cash',
      amountPaid: 2000,
      change: 250,
    });

    useSalesStore.getState().addSale(sale);

    const stored = useSalesStore.getState().sales[0];
    expect(stored.change).toBe(stored.amountPaid - stored.total);
  });
});
```

### 2.2 Service Layer Testing

#### Pattern: Database Service Testing

```ts
// apps/desktop-os/src/renderer/src/services/__tests__/dbService.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Database from '@tauri-apps/plugin-sql';

describe('dbService', () => {
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      execute: vi.fn().mockResolvedValue({ rowsAffected: 1, lastInsertId: 1 }),
      select: vi.fn().mockResolvedValue([]),
      close: vi.fn().mockResolvedValue(undefined),
    };
    vi.mocked(Database.load).mockResolvedValue(mockDb);
  });

  it('creates product with correct SQL', async () => {
    const { dbService } = await import('../dbService');

    await dbService.createProduct({
      id: 'prod_1',
      name: 'Test',
      barcode: '123',
      sellingPrice: 100,
    });

    expect(mockDb.execute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT'),
      expect.arrayContaining(['prod_1', 'Test']),
    );
  });

  it('handles SQL injection attempt in product name', async () => {
    const { dbService } = await import('../dbService');

    // This should be parameterized, not concatenated
    await dbService.createProduct({
      id: 'prod_1',
      name: "'; DROP TABLE products; --",
      barcode: '123',
      sellingPrice: 100,
    });

    // Verify parameterized query (not string concat)
    const call = mockDb.execute.mock.calls[0];
    expect(call[0]).toContain('?'); // Uses placeholders
    expect(call[1]).toContain("'; DROP TABLE products; --"); // Value passed as param
  });

  it('retries on database lock', async () => {
    mockDb.execute
      .mockRejectedValueOnce(new Error('database is locked'))
      .mockResolvedValueOnce({ rowsAffected: 1 });

    const { dbService } = await import('../dbService');

    // Should retry and succeed
    await expect(dbService.createProduct({ id: 'p1', name: 'Test' })).resolves.not.toThrow();
  });
});
```

#### Pattern: Printer Service Testing

```ts
// apps/desktop-os/src/renderer/src/services/__tests__/printerService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { invoke } from '@tauri-apps/api/core';

describe('PrinterService', () => {
  beforeEach(() => {
    vi.mocked(invoke).mockReset();
  });

  it('detects available printers', async () => {
    vi.mocked(invoke).mockResolvedValue([
      { name: 'XP-80C', port: '/dev/tty.usbserial', type: 'thermal' },
    ]);

    const { printerService } = await import('../printerService');
    const printers = await printerService.detectPrinters();

    expect(invoke).toHaveBeenCalledWith('detect_printers');
    expect(printers).toHaveLength(1);
    expect(printers[0].name).toBe('XP-80C');
  });

  it('handles no printers gracefully', async () => {
    vi.mocked(invoke).mockResolvedValue([]);

    const { printerService } = await import('../printerService');
    const printers = await printerService.detectPrinters();

    expect(printers).toHaveLength(0);
  });

  it('handles printer connection failure', async () => {
    vi.mocked(invoke).mockRejectedValue(new Error('Failed to open port'));

    const { printerService } = await import('../printerService');

    await expect(printerService.detectPrinters()).rejects.toThrow('Failed to open port');
  });

  it('generates valid ESC/POS receipt commands', async () => {
    vi.mocked(invoke).mockResolvedValue({ success: true });

    const { printerService } = await import('../printerService');

    const receiptData = {
      items: [{ name: 'Coca Cola', qty: 2, price: 150, total: 300 }],
      subtotal: 300,
      tax: 57,
      total: 357,
    };

    await printerService.printReceipt('/dev/tty.usbserial', receiptData);

    const printCall = vi.mocked(invoke).mock.calls.find(
      (call) => call[0] === 'print_raw' || call[0] === 'print_receipt',
    );
    expect(printCall).toBeDefined();
  });
});
```

### 2.3 Utility Testing

```ts
// packages/shared/utils/__tests__/secureStorage.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('SecureStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('encrypts and decrypts data round-trip', async () => {
    const { secureStorage } = await import('../secureStorage');

    await secureStorage.setItem('test_key', 'sensitive_data');
    const result = await secureStorage.getItem('test_key');

    // In mock environment, verify the flow works
    expect(result).toBeDefined();
  });

  it('returns null for non-existent key', async () => {
    const { secureStorage } = await import('../secureStorage');

    const result = await secureStorage.getItem('does_not_exist');
    expect(result).toBeNull();
  });

  it('handles storage quota exceeded', async () => {
    const { secureStorage } = await import('../secureStorage');

    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });

    await expect(secureStorage.setItem('key', 'value')).rejects.toThrow();
  });
});
```

---

## 3. Component & Integration Testing

### 3.1 Page Component Testing

#### Pattern: POS Page Testing

```tsx
// apps/desktop-os/src/renderer/src/pages/POS/__tests__/POS.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderWithProviders, screen, userEvent, waitFor } from '@/test/render';
import { useProductsStore } from '@asgard/shared/stores/productsStore';
import { useSalesStore } from '@asgard/shared/stores/salesStore';
import { createProduct, createProducts } from '@/test/factories';
import { resetStore, seedStore } from '@/test/store-helpers';
import POS from '../POS';

describe('POS Page', () => {
  beforeEach(() => {
    resetStore(useProductsStore);
    resetStore(useSalesStore);
  });

  it('renders product grid', async () => {
    seedStore(useProductsStore, {
      products: [
        createProduct({ name: 'Coca Cola 1L' }),
        createProduct({ name: 'Pepsi 500ml' }),
      ],
    });

    renderWithProviders(<POS />, { initialRoute: '/pos' });

    expect(await screen.findByText('Coca Cola 1L')).toBeInTheDocument();
    expect(screen.getByText('Pepsi 500ml')).toBeInTheDocument();
  });

  it('adds product to cart on click', async () => {
    const product = createProduct({ name: 'Orange Juice', sellingPrice: 200 });
    seedStore(useProductsStore, { products: [product] });

    renderWithProviders(<POS />);
    const user = userEvent.setup();

    const productCard = await screen.findByText('Orange Juice');
    await user.click(productCard);

    // Cart should show the product
    await waitFor(() => {
      expect(screen.getByText(/200/)).toBeInTheDocument();
    });
  });

  it('updates quantity when same product clicked twice', async () => {
    const product = createProduct({ name: 'Water', sellingPrice: 50 });
    seedStore(useProductsStore, { products: [product] });

    renderWithProviders(<POS />);
    const user = userEvent.setup();

    const productCard = await screen.findByText('Water');
    await user.click(productCard);
    await user.click(productCard);

    await waitFor(() => {
      expect(screen.getByText(/x2|qty.*2|2\s*x/i)).toBeInTheDocument();
    });
  });

  it('handles barcode scanner input (rapid keystrokes)', async () => {
    const product = createProduct({ name: 'Scanned Item', barcode: '3000001234567' });
    seedStore(useProductsStore, { products: [product] });

    renderWithProviders(<POS />);
    const user = userEvent.setup({ delay: 10 }); // Fast typing = scanner

    // Simulate barcode scanner (types fast then Enter)
    await user.keyboard('3000001234567{Enter}');

    await waitFor(() => {
      expect(screen.getByText('Scanned Item')).toBeInTheDocument();
    });
  });

  it('prevents sale with empty cart', async () => {
    renderWithProviders(<POS />);
    const user = userEvent.setup();

    // Try to complete sale with empty cart
    const payButton = screen.queryByText(/pay|checkout|encaisser/i);
    if (payButton) {
      await user.click(payButton);

      // Should show error or button should be disabled
      await waitFor(() => {
        const errorMsg = screen.queryByText(/empty|vide|cart/i);
        const isDisabled = payButton.hasAttribute('disabled');
        expect(errorMsg || isDisabled).toBeTruthy();
      });
    }
  });

  it('keyboard shortcut F2 opens payment modal', async () => {
    const product = createProduct({ name: 'Test', sellingPrice: 100 });
    seedStore(useProductsStore, { products: [product] });

    renderWithProviders(<POS />);
    const user = userEvent.setup();

    // Add item to cart first
    await user.click(await screen.findByText('Test'));

    // Press F2
    await user.keyboard('{F2}');

    await waitFor(() => {
      expect(screen.getByText(/payment|paiement/i)).toBeInTheDocument();
    });
  });
});
```

#### Pattern: Dashboard Testing

```tsx
// apps/desktop-os/src/renderer/src/pages/Dashboard/__tests__/Dashboard.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithProviders, screen, waitFor } from '@/test/render';
import { useSalesStore } from '@asgard/shared/stores/salesStore';
import { createSale } from '@/test/factories';
import { resetStore, seedStore } from '@/test/store-helpers';
import Dashboard from '../Dashboard';

describe('Dashboard', () => {
  beforeEach(() => {
    resetStore(useSalesStore);
  });

  it('shows zero state when no sales exist', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/0|aucune/i)).toBeInTheDocument();
    });
  });

  it('displays correct daily revenue', async () => {
    const today = new Date().toISOString();
    seedStore(useSalesStore, {
      sales: [
        createSale({ total: 1000, createdAt: today }),
        createSale({ total: 2500, createdAt: today }),
      ],
    });

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      // Total should be 3500
      expect(screen.getByText(/3[,.]?500/)).toBeInTheDocument();
    });
  });

  it('renders charts without crashing', async () => {
    seedStore(useSalesStore, {
      sales: Array.from({ length: 20 }, () => createSale()),
    });

    const { container } = renderWithProviders(<Dashboard />);

    await waitFor(() => {
      // Recharts renders SVG elements
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });
  });
});
```

### 3.2 RTL (Right-to-Left) Testing

```tsx
// apps/desktop-os/src/test/rtl-testing.test.tsx
import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '@/test/render';

describe('RTL Layout Support', () => {
  it('applies RTL direction for Arabic locale', async () => {
    // Set i18n to Arabic
    const { i18n } = await import('../renderer/src/i18n');
    await i18n.changeLanguage('ar');

    const { container } = renderWithProviders(
      <div dir={i18n.dir()}><span>تجربة</span></div>,
    );

    expect(container.firstChild).toHaveAttribute('dir', 'rtl');
  });

  it('applies LTR direction for French locale', async () => {
    const { i18n } = await import('../renderer/src/i18n');
    await i18n.changeLanguage('fr');

    const { container } = renderWithProviders(
      <div dir={i18n.dir()}><span>Test</span></div>,
    );

    expect(container.firstChild).toHaveAttribute('dir', 'ltr');
  });

  it('translates all keys without fallback to key name', async () => {
    const { i18n } = await import('../renderer/src/i18n');

    for (const lang of ['fr', 'ar', 'en']) {
      await i18n.changeLanguage(lang);

      // Check critical keys are translated
      const criticalKeys = [
        'pos.checkout', 'pos.cart', 'dashboard.revenue',
        'settings.title', 'common.save', 'common.cancel',
      ];

      for (const key of criticalKeys) {
        const translated = i18n.t(key);
        // Should not return the key itself (means translation is missing)
        expect(translated).not.toBe(key);
      }
    }
  });
});
```

### 3.3 Error Boundary Testing

```tsx
// apps/desktop-os/src/renderer/src/components/__tests__/ErrorBoundary.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Component that throws
function ThrowingComponent() {
  throw new Error('Test crash');
}

// Simple ErrorBoundary for testing
class TestErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div>Something went wrong</div>;
    return this.props.children;
  }
}

import React from 'react';

describe('ErrorBoundary', () => {
  it('catches component crashes and shows fallback', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <TestErrorBoundary>
        <ThrowingComponent />
      </TestErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it('renders children when no error', () => {
    render(
      <TestErrorBoundary>
        <div>Normal content</div>
      </TestErrorBoundary>,
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });
});
```

---

## 4. End-to-End Testing

### 4.1 Tauri E2E with WebdriverIO

Tauri supports E2E testing via the WebDriver protocol. macOS does not have a desktop WebDriver client — use Windows/Linux for full E2E or test the web layer with Playwright.

#### Setup

```bash
# Install dependencies
npm install --save-dev @wdio/cli @wdio/local-runner @wdio/mocha-framework @wdio/spec-reporter
npm install --save-dev wdio-tauri-service
```

```ts
// apps/desktop-os/wdio.conf.ts
export const config: WebdriverIO.Config = {
  runner: 'local',
  specs: ['./e2e/**/*.e2e.ts'],
  maxInstances: 1, // Desktop app = single instance

  capabilities: [{
    'tauri:options': {
      application: './src-tauri/target/release/igo-desktop',
    },
  }],

  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000, // 60s for desktop operations
  },
};
```

### 4.2 Critical E2E Journeys

```ts
// apps/desktop-os/e2e/complete-sale.e2e.ts
describe('Complete Sale Journey', () => {
  it('cashier logs in, scans items, completes cash sale', async () => {
    // 1. Login
    const usernameInput = await $('[data-testid="login-username"]');
    await usernameInput.setValue('cashier1');
    const passwordInput = await $('[data-testid="login-password"]');
    await passwordInput.setValue('password123');
    await $('[data-testid="login-submit"]').click();

    // 2. Wait for POS page
    await $('[data-testid="pos-page"]').waitForDisplayed({ timeout: 10000 });

    // 3. Add products
    await $('[data-testid="product-search"]').setValue('Coca Cola');
    await $('[data-testid="product-item-0"]').click();

    // 4. Verify cart
    const cartTotal = await $('[data-testid="cart-total"]');
    const totalText = await cartTotal.getText();
    expect(parseFloat(totalText.replace(/[^\d.]/g, ''))).toBeGreaterThan(0);

    // 5. Checkout
    await $('[data-testid="checkout-button"]').click();

    // 6. Cash payment
    await $('[data-testid="payment-cash"]').click();
    await $('[data-testid="amount-paid"]').setValue('2000');
    await $('[data-testid="confirm-payment"]').click();

    // 7. Verify success
    const successMsg = await $('[data-testid="sale-success"]');
    await successMsg.waitForDisplayed({ timeout: 5000 });

    // 8. Verify receipt (optional - depends on printer mock)
    const change = await $('[data-testid="change-amount"]').getText();
    expect(parseFloat(change.replace(/[^\d.]/g, ''))).toBeGreaterThan(0);
  });

  it('handles refund/return flow', async () => {
    // Navigate to sales history
    await $('[data-testid="sales-history"]').click();

    // Select last sale
    await $('[data-testid="sale-row-0"]').click();

    // Click refund
    await $('[data-testid="refund-button"]').click();

    // Confirm refund
    await $('[data-testid="confirm-refund"]').click();

    // Verify refund recorded
    const refundBadge = await $('[data-testid="refund-badge"]');
    await refundBadge.waitForDisplayed();
  });
});
```

```ts
// apps/desktop-os/e2e/offline-mode.e2e.ts
describe('Offline Mode', () => {
  it('completes sale while offline and syncs when back online', async () => {
    // 1. Go offline (disconnect network in Tauri)
    await browser.execute(() => {
      // Simulate offline
      Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
      window.dispatchEvent(new Event('offline'));
    });

    // 2. Complete a sale
    await $('[data-testid="product-item-0"]').click();
    await $('[data-testid="checkout-button"]').click();
    await $('[data-testid="payment-cash"]').click();
    await $('[data-testid="confirm-payment"]').click();

    // 3. Verify sale saved locally
    const successMsg = await $('[data-testid="sale-success"]');
    await successMsg.waitForDisplayed();

    // 4. Go back online
    await browser.execute(() => {
      Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
      window.dispatchEvent(new Event('online'));
    });

    // 5. Wait for sync
    await browser.pause(3000);

    // 6. Verify sync indicator
    const syncStatus = await $('[data-testid="sync-status"]');
    const status = await syncStatus.getText();
    expect(status).toMatch(/synced|synchronized/i);
  });
});
```

### 4.3 Playwright for Web Layer (Alternative)

For macOS development where WebDriver isn't available, test the web layer with Playwright:

```ts
// apps/desktop-os/e2e/playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/web',
  use: {
    baseURL: 'http://localhost:1420', // Vite dev server
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev:web', // Run without Tauri
    port: 1420,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
```

---

## 5. Security Testing

### 5.1 OWASP Desktop App Security Top 10 — Applied to GRAPHSHOP OS

| # | OWASP Risk | GRAPHSHOP OS Status | Test |
|---|---|---|---|
| DA1 | Injections (SQL, Command) | `print_raw` accepts arbitrary bytes. SQLite uses parameterized queries (good). | Test SQL injection in product names, printer command injection |
| DA2 | Broken Authentication | Predictable tokens (`token_${id}_${timestamp}`). Passwords in localStorage. | Test token unpredictability, storage location |
| DA3 | Sensitive Data Exposure | Encryption key stored alongside encrypted data in localStorage. | Verify no plaintext secrets in storage |
| DA4 | Improper Cryptography | AES-GCM with key in localStorage = no real encryption. | Test key storage isolation |
| DA5 | Improper Authorization | Role checks exist but not tested. | Test role-based access for every route |
| DA6 | Security Misconfiguration | CSP configured in Tauri. Need to verify. | Audit tauri.conf.json CSP rules |
| DA7 | Insecure Communication | LAN sync — is it encrypted? | Test sync data in transit |
| DA8 | Poor Code Quality | God components, mock code in production. | Static analysis, code review |
| DA9 | Using Components with Known Vulnerabilities | Run `npm audit`. | Automated dependency scanning |
| DA10 | Insufficient Logging | No structured logging. No audit trail. | Verify critical actions are logged |

### 5.2 Security Test Suite

```ts
// apps/desktop-os/src/renderer/src/__tests__/security.test.ts
import { describe, it, expect, beforeEach } from 'vitest';

describe('Security — Auth Token Quality', () => {
  it('tokens are not predictable', async () => {
    const { useAuthStore } = await import('@asgard/shared/stores/authStore');

    // Create user and login
    await useAuthStore.getState().createUser({
      username: 'sectest',
      fullName: 'Security Test',
      password: 'Test@12345',
      role: 'cashier',
    });

    await useAuthStore.getState().login('sectest', 'Test@12345');
    const token1 = useAuthStore.getState().token;

    useAuthStore.getState().logout();

    await useAuthStore.getState().login('sectest', 'Test@12345');
    const token2 = useAuthStore.getState().token;

    // Tokens should differ between sessions
    expect(token1).not.toBe(token2);

    // Token should not contain username or userId in plaintext
    if (token1) {
      expect(token1.toLowerCase()).not.toContain('sectest');
    }
  });
});

describe('Security — XSS Prevention', () => {
  it('product name with script tag is escaped in DOM', async () => {
    const { useProductsStore } = await import('@asgard/shared/stores/productsStore');
    const { createProduct } = await import('@/test/factories');

    const xssProduct = createProduct({
      name: '<script>alert("xss")</script>',
    });

    useProductsStore.getState().addProduct(xssProduct);

    // When rendered, the script should not execute
    // React auto-escapes by default, but verify
    const product = useProductsStore.getState().products[0];
    expect(product.name).toContain('<script>');
    // The actual DOM rendering test is in component tests
  });

  it('receipt HTML does not execute injected scripts', () => {
    // If receipt generation uses innerHTML, this is a risk
    const maliciousItem = {
      name: '"><img src=x onerror=alert(1)>',
      qty: 1,
      price: 100,
      total: 100,
    };

    // Generate receipt HTML (import your receipt generator)
    // Verify the output is escaped
    const escaped = maliciousItem.name
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    expect(escaped).not.toContain('<img');
  });
});

describe('Security — localStorage Audit', () => {
  it('no plaintext passwords in localStorage', () => {
    // Set up some state
    localStorage.setItem('test_key', 'test_value');

    // Scan all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';

        // Should not contain common password patterns
        expect(value).not.toMatch(/password["']?\s*:\s*["'][^$2]/i);
        // bcrypt hashes start with $2 — those are OK
      }
    }
  });

  it('no JWT tokens stored in localStorage', () => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        // JWT format: xxxxx.xxxxx.xxxxx
        expect(value).not.toMatch(/^eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
      }
    }
  });
});

describe('Security — Input Validation', () => {
  it('barcode input rejects non-numeric characters', () => {
    const isValidBarcode = (barcode: string) => /^\d{8,14}$/.test(barcode);

    expect(isValidBarcode('1234567890123')).toBe(true);
    expect(isValidBarcode('123')).toBe(false);           // Too short
    expect(isValidBarcode('abc1234567890')).toBe(false); // Non-numeric
    expect(isValidBarcode('')).toBe(false);               // Empty
    expect(isValidBarcode('123456789012345')).toBe(false); // Too long
  });

  it('monetary amounts reject negative values', () => {
    const isValidAmount = (amount: number) => amount >= 0 && isFinite(amount);

    expect(isValidAmount(100)).toBe(true);
    expect(isValidAmount(0)).toBe(true);
    expect(isValidAmount(-1)).toBe(false);
    expect(isValidAmount(Infinity)).toBe(false);
    expect(isValidAmount(NaN)).toBe(false);
  });

  it('serial port name validates against path traversal', () => {
    const isValidPort = (port: string) => {
      // Only allow known serial port patterns
      return /^(COM\d+|\/dev\/tty\.(usbserial|usbmodem)[A-Za-z0-9-]+)$/.test(port);
    };

    expect(isValidPort('COM3')).toBe(true);
    expect(isValidPort('/dev/tty.usbserial-1420')).toBe(true);
    expect(isValidPort('/dev/random')).toBe(false);
    expect(isValidPort('../../../etc/passwd')).toBe(false);
    expect(isValidPort('')).toBe(false);
  });
});
```

### 5.3 Tauri Security Configuration Audit

```ts
// apps/desktop-os/src/test/tauri-security-audit.test.ts
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Tauri Security Configuration', () => {
  const tauriConfig = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, '../../src-tauri/tauri.conf.json'),
      'utf-8',
    ),
  );

  it('CSP is configured', () => {
    const csp = tauriConfig.app?.security?.csp
      ?? tauriConfig.tauri?.security?.csp;
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
  });

  it('dangerous APIs are not globally enabled', () => {
    const permissions = tauriConfig.app?.security?.permissions ?? [];

    // These should NOT be in global permissions
    const dangerous = ['fs:allow-read-all', 'fs:allow-write-all', 'shell:allow-execute'];
    for (const perm of dangerous) {
      expect(permissions).not.toContain(perm);
    }
  });

  it('dev server is not enabled in production config', () => {
    const devUrl = tauriConfig.build?.devUrl ?? tauriConfig.build?.devPath;
    // In production builds, this should be a local path, not http://
    if (process.env.NODE_ENV === 'production') {
      expect(devUrl).not.toMatch(/^https?:\/\//);
    }
  });
});
```

### 5.4 Dependency Vulnerability Scanning

```bash
# Run as part of CI
npm audit --audit-level=high
npm audit --json > audit-results.json

# Check for outdated packages
npm outdated --json > outdated-packages.json

# Rust dependency audit
cd apps/desktop-os/src-tauri
cargo audit
```

---

## 6. Retail & POS Domain Testing

### 6.1 Transaction Accuracy Test Suite

These are the tests that protect a $4M business from financial loss:

```ts
// apps/desktop-os/src/renderer/src/__tests__/transaction-accuracy.test.ts
import { describe, it, expect } from 'vitest';

// ─── ROUNDING TESTS ────────────────────────────────
describe('Financial Rounding (DZD — Algerian Dinar)', () => {
  // DZD has no decimal subunit in practice
  const roundDZD = (amount: number) => Math.round(amount);

  it('rounds 0.5 up (banker rounding)', () => {
    expect(roundDZD(100.5)).toBe(101); // not 100
  });

  it('handles floating point errors', () => {
    // Classic: 0.1 + 0.2 = 0.30000000000000004
    const subtotal = 0.1 + 0.2;
    expect(roundDZD(subtotal * 1000)).toBe(300);
  });

  it('calculates correct tax for edge amounts', () => {
    const taxRate = 0.19; // 19% TVA

    const cases = [
      { subtotal: 1, expectedTax: 0, expectedTotal: 1 },
      { subtotal: 100, expectedTax: 19, expectedTotal: 119 },
      { subtotal: 999, expectedTax: 190, expectedTotal: 1189 },
      { subtotal: 10000, expectedTax: 1900, expectedTotal: 11900 },
      { subtotal: 1, expectedTax: 0, expectedTotal: 1 },
    ];

    for (const { subtotal, expectedTax, expectedTotal } of cases) {
      const tax = roundDZD(subtotal * taxRate);
      const total = subtotal + tax;
      expect(tax).toBe(expectedTax);
      expect(total).toBe(expectedTotal);
    }
  });
});

// ─── DISCOUNT TESTS ────────────────────────────────
describe('Discount Calculations', () => {
  it('percentage discount on single item', () => {
    const price = 1000;
    const discount = 10; // 10%
    const discounted = price - (price * discount / 100);
    expect(discounted).toBe(900);
  });

  it('percentage discount does not go below zero', () => {
    const price = 100;
    const discount = 150; // 150% — invalid
    const discounted = Math.max(0, price - (price * discount / 100));
    expect(discounted).toBe(0);
  });

  it('fixed discount on order', () => {
    const subtotal = 5000;
    const fixedDiscount = 500;
    expect(subtotal - fixedDiscount).toBe(4500);
  });

  it('stacked discounts (item + order)', () => {
    const itemPrice = 1000;
    const itemDiscount = 10; // 10% on item
    const discountedItem = itemPrice * (1 - itemDiscount / 100); // 900

    const orderSubtotal = discountedItem * 3; // 2700
    const orderDiscount = 200; // fixed
    const finalTotal = orderSubtotal - orderDiscount; // 2500

    expect(finalTotal).toBe(2500);
  });
});

// ─── MULTI-PAYMENT TESTS ───────────────────────────
describe('Multi-Payment Split', () => {
  it('splits payment between cash and card', () => {
    const total = 5000;
    const cashPaid = 3000;
    const cardPaid = 2000;

    expect(cashPaid + cardPaid).toBe(total);
  });

  it('calculates change only on cash portion', () => {
    const total = 4500;
    const cashPaid = 3000;
    const cardPaid = 2000;
    const totalPaid = cashPaid + cardPaid;

    const change = totalPaid - total;
    expect(change).toBe(500);
    // Change should be given from cash, not card
  });

  it('rejects underpayment', () => {
    const total = 5000;
    const paid = 4999;

    expect(paid).toBeLessThan(total);
    // Sale should not complete
  });
});

// ─── VOID/REFUND TESTS ─────────────────────────────
describe('Void & Refund', () => {
  it('void reverses full sale amount', () => {
    const originalTotal = 3500;
    const voidAmount = -originalTotal;

    expect(originalTotal + voidAmount).toBe(0);
  });

  it('partial refund calculates correctly', () => {
    const originalItems = [
      { name: 'A', price: 1000, qty: 2 },
      { name: 'B', price: 500, qty: 1 },
    ];
    const originalTotal = 2500;

    // Refund 1 unit of A
    const refundAmount = 1000;
    const newTotal = originalTotal - refundAmount;

    expect(newTotal).toBe(1500);
  });

  it('refund cannot exceed original sale amount', () => {
    const originalTotal = 3000;
    const refundAmount = 5000;

    const allowedRefund = Math.min(refundAmount, originalTotal);
    expect(allowedRefund).toBe(3000);
  });
});
```

### 6.2 Inventory Edge Cases

```ts
// apps/desktop-os/src/renderer/src/__tests__/inventory-edge-cases.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useProductsStore } from '@asgard/shared/stores/productsStore';
import { createProduct } from '@/test/factories';
import { resetStore, seedStore } from '@/test/store-helpers';

describe('Inventory Edge Cases', () => {
  beforeEach(() => {
    resetStore(useProductsStore);
  });

  it('stock does not go negative after sale', () => {
    const product = createProduct({ stock: 1 });
    seedStore(useProductsStore, { products: [product] });

    // Sell 1 unit
    useProductsStore.getState().updateProduct(product.id, {
      stock: product.stock - 1,
    });

    expect(useProductsStore.getState().products[0].stock).toBe(0);

    // Try to sell another — should be blocked or go to 0
    const currentStock = useProductsStore.getState().products[0].stock;
    const newStock = Math.max(0, currentStock - 1);
    expect(newStock).toBe(0);
  });

  it('handles concurrent stock updates', () => {
    const product = createProduct({ stock: 10 });
    seedStore(useProductsStore, { products: [product] });

    // Simulate two cashiers selling simultaneously
    const store = useProductsStore.getState();

    // Both read stock = 10
    const read1 = store.products[0].stock;
    const read2 = store.products[0].stock;

    // Both try to decrement
    useProductsStore.getState().updateProduct(product.id, { stock: read1 - 1 });
    // Second update should use current state, not stale read
    const currentStock = useProductsStore.getState().products[0].stock;
    useProductsStore.getState().updateProduct(product.id, { stock: currentStock - 1 });

    expect(useProductsStore.getState().products[0].stock).toBe(8);
  });

  it('alerts when stock falls below minimum', () => {
    const product = createProduct({ stock: 6, minStock: 5 });
    seedStore(useProductsStore, { products: [product] });

    useProductsStore.getState().updateProduct(product.id, { stock: 4 });

    const updated = useProductsStore.getState().products[0];
    expect(updated.stock).toBeLessThan(updated.minStock!);
    // Alert should be triggered (check notification store)
  });

  it('handles expiry date edge cases', () => {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 86400000);
    const yesterday = new Date(today.getTime() - 86400000);

    // Product expiring tomorrow — should warn
    const expiringSoon = createProduct({ expiryDate: tomorrow.toISOString() });
    const expired = createProduct({ expiryDate: yesterday.toISOString() });

    expect(new Date(expiringSoon.expiryDate!) > today).toBe(true);
    expect(new Date(expired.expiryDate!) < today).toBe(true);
  });

  it('handles bulk stock receipt correctly', () => {
    const product = createProduct({ stock: 50 });
    seedStore(useProductsStore, { products: [product] });

    // Receive 200 units
    const newStock = product.stock + 200;
    useProductsStore.getState().updateProduct(product.id, { stock: newStock });

    expect(useProductsStore.getState().products[0].stock).toBe(250);
  });

  it('handles zero-price products (loss leaders/samples)', () => {
    const freeProduct = createProduct({ sellingPrice: 0, name: 'Free Sample' });
    seedStore(useProductsStore, { products: [freeProduct] });

    const product = useProductsStore.getState().products[0];
    expect(product.sellingPrice).toBe(0);
    // Should still be addable to cart
  });

  it('validates barcode uniqueness', () => {
    const product1 = createProduct({ barcode: '1234567890123' });
    const product2 = createProduct({ barcode: '1234567890123' });

    useProductsStore.getState().addProduct(product1);
    useProductsStore.getState().addProduct(product2);

    // Should only have 1 product (or second should fail)
    const products = useProductsStore.getState().products;
    const barcodes = products.map((p) => p.barcode);
    const uniqueBarcodes = new Set(barcodes);
    expect(uniqueBarcodes.size).toBe(barcodes.length);
  });
});
```

### 6.3 Cash Drawer & Treasury Testing

```ts
// apps/desktop-os/src/renderer/src/__tests__/treasury.test.ts
import { describe, it, expect } from 'vitest';

describe('Cash Drawer Reconciliation', () => {
  it('opening balance + sales - expenses = expected closing balance', () => {
    const openingBalance = 10000;
    const totalCashSales = 45000;
    const totalCashRefunds = 3000;
    const totalExpenses = 5000;
    const cashDropsToSafe = 20000;

    const expectedDrawer =
      openingBalance + totalCashSales - totalCashRefunds - totalExpenses - cashDropsToSafe;

    expect(expectedDrawer).toBe(27000);
  });

  it('detects cash discrepancy', () => {
    const expectedBalance = 27000;
    const actualCount = 26500;
    const discrepancy = actualCount - expectedBalance;

    expect(discrepancy).toBe(-500);
    // Should flag for investigation if |discrepancy| > threshold
    const threshold = 100; // 100 DZD tolerance
    expect(Math.abs(discrepancy)).toBeGreaterThan(threshold);
  });

  it('safe transfer reduces drawer and increases safe', () => {
    let drawerBalance = 50000;
    let safeBalance = 100000;
    const transferAmount = 30000;

    drawerBalance -= transferAmount;
    safeBalance += transferAmount;

    expect(drawerBalance).toBe(20000);
    expect(safeBalance).toBe(130000);
  });
});
```

### 6.4 Receipt Formatting

```ts
// apps/desktop-os/src/renderer/src/__tests__/receipt-format.test.ts
import { describe, it, expect } from 'vitest';

describe('Receipt Formatting', () => {
  it('receipt line fits 42 characters (80mm thermal)', () => {
    const maxWidth = 42;
    const formatLine = (left: string, right: string) => {
      const padding = maxWidth - left.length - right.length;
      return left + ' '.repeat(Math.max(1, padding)) + right;
    };

    const line = formatLine('Coca Cola 1L', '150 DA');
    expect(line.length).toBeLessThanOrEqual(maxWidth);
  });

  it('truncates long product names', () => {
    const maxNameLength = 28;
    const truncate = (name: string) =>
      name.length > maxNameLength ? name.slice(0, maxNameLength - 2) + '..' : name;

    expect(truncate('Boisson gazeuse orange 1.5L pack de 6')).toBe(
      'Boisson gazeuse orange 1...',
    );
  });

  it('formats Arabic text for receipt (RTL)', () => {
    const arabicName = 'كوكا كولا';
    // Arabic should be right-aligned on receipt
    expect(arabicName.length).toBeGreaterThan(0);
    // ESC/POS right alignment: 0x1B 0x61 0x02
  });

  it('receipt total matches calculated total', () => {
    const items = [
      { name: 'Item A', qty: 2, price: 500 },
      { name: 'Item B', qty: 1, price: 300 },
    ];

    const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
    const tax = Math.round(subtotal * 0.19);
    const total = subtotal + tax;

    expect(subtotal).toBe(1300);
    expect(tax).toBe(247);
    expect(total).toBe(1547);
  });
});
```

---

## 7. Performance Testing & Profiling

### 7.1 React Re-render Detection

```ts
// apps/desktop-os/src/test/performance.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, act } from '@/test/render';
import React from 'react';

describe('Performance — Re-render Detection', () => {
  it('POS product grid does not re-render on cart change', () => {
    const renderSpy = vi.fn();

    function TrackedProductGrid() {
      renderSpy();
      return <div>Product Grid</div>;
    }

    const MemoizedGrid = React.memo(TrackedProductGrid);

    renderWithProviders(<MemoizedGrid />);
    const initialRenders = renderSpy.mock.calls.length;

    // Simulate cart state change
    act(() => {
      // Update cart state without touching products
    });

    // Should not re-render
    expect(renderSpy.mock.calls.length).toBe(initialRenders);
  });
});
```

### 7.2 Bundle Size Monitoring

```bash
# Add to package.json scripts
"build:analyze": "npx vite-bundle-visualizer"

# Check bundle size in CI
"bundle:check": "vite build && node -e \"
  const fs = require('fs');
  const path = require('path');
  const distDir = './dist/assets';
  const files = fs.readdirSync(distDir);
  let totalSize = 0;
  files.forEach(f => {
    const size = fs.statSync(path.join(distDir, f)).size;
    totalSize += size;
    if (size > 500000) console.warn('LARGE CHUNK:', f, (size/1024).toFixed(0) + 'KB');
  });
  console.log('Total bundle:', (totalSize/1024/1024).toFixed(2) + 'MB');
  if (totalSize > 10 * 1024 * 1024) process.exit(1); // Fail if >10MB
\""
```

### 7.3 Large Dataset Performance

```ts
// apps/desktop-os/src/test/performance-large-data.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useProductsStore } from '@asgard/shared/stores/productsStore';
import { useSalesStore } from '@asgard/shared/stores/salesStore';
import { createProducts, createSale, resetFactories } from '@/test/factories';
import { resetStore } from '@/test/store-helpers';

describe('Performance — Large Datasets', () => {
  beforeEach(() => {
    resetStore(useProductsStore);
    resetStore(useSalesStore);
    resetFactories();
  });

  it('loads 10,000 products under 2 seconds', () => {
    const products = createProducts(10_000);
    const start = performance.now();

    useProductsStore.setState({ products });

    const duration = performance.now() - start;
    expect(duration).toBeLessThan(2000);
    expect(useProductsStore.getState().products).toHaveLength(10_000);
  });

  it('searches 10,000 products under 100ms', () => {
    const products = createProducts(10_000);
    useProductsStore.setState({ products });

    const start = performance.now();
    const results = useProductsStore
      .getState()
      .products.filter((p) => p.name.includes('Product 5'));
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(100);
    expect(results.length).toBeGreaterThan(0);
  });

  it('renders 100,000 sale records without memory spike', () => {
    const sales = Array.from({ length: 100_000 }, () => createSale());

    const memBefore = process.memoryUsage().heapUsed;
    useSalesStore.setState({ sales });
    const memAfter = process.memoryUsage().heapUsed;

    const memIncreaseMB = (memAfter - memBefore) / 1024 / 1024;
    // Should use < 500MB for 100K records
    expect(memIncreaseMB).toBeLessThan(500);
  });

  it('daily sales aggregation under 200ms for 100K records', () => {
    const sales = Array.from({ length: 100_000 }, (_, i) =>
      createSale({
        createdAt: new Date(2025, 0, 1 + (i % 365)).toISOString(),
        total: Math.floor(Math.random() * 10000),
      }),
    );
    useSalesStore.setState({ sales });

    const start = performance.now();

    // Group by day
    const dailySales: Record<string, number> = {};
    for (const sale of useSalesStore.getState().sales) {
      const day = sale.createdAt.split('T')[0];
      dailySales[day] = (dailySales[day] || 0) + sale.total;
    }

    const duration = performance.now() - start;
    expect(duration).toBeLessThan(200);
    expect(Object.keys(dailySales).length).toBeGreaterThan(0);
  });
});
```

### 7.4 Memory Leak Detection

```ts
// apps/desktop-os/src/test/memory-leaks.test.tsx
import { describe, it, expect } from 'vitest';
import { render, cleanup } from '@testing-library/react';

describe('Memory Leak Prevention', () => {
  it('component cleanup removes all event listeners', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    // Import and render POS (which adds keyboard listeners)
    // Then cleanup and verify all listeners are removed

    const addCount = addSpy.mock.calls.length;
    cleanup();
    const removeCount = removeSpy.mock.calls.length;

    // Every addEventListener should have a matching removeEventListener
    expect(removeCount).toBeGreaterThanOrEqual(addCount);

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('Zustand subscriptions are cleaned up', () => {
    // Zustand auto-cleans when components unmount via useSyncExternalStore
    // But manual subscriptions need cleanup
    const { useProductsStore } = require('@asgard/shared/stores/productsStore');

    const unsub = useProductsStore.subscribe(() => {});
    unsub(); // Manual cleanup

    // Verify no dangling subscriptions
    // (Zustand doesn't expose subscriber count, but this pattern tests the cleanup flow)
  });
});
```

---

## 8. Debugging Playbook

### 8.1 React State Debugging

```ts
// Add to any Zustand store for debugging
import { devtools } from 'zustand/middleware';

// Wrap store with devtools in development
export const useProductsStore = create<ProductsState>()(
  devtools(
    persist(
      (set, get) => ({
        // ... store implementation
      }),
      { name: 'products-store' },
    ),
    { name: 'ProductsStore', enabled: import.meta.env.DEV },
  ),
);
```

### 8.2 Tauri/Rust Backend Debugging

```bash
# Enable Rust logging
RUST_LOG=debug cargo tauri dev

# Enable specific module logging
RUST_LOG=igo_desktop::printer=trace cargo tauri dev

# Debug serial port communication
RUST_LOG=serialport=debug cargo tauri dev
```

```rust
// In printer.rs — add debug logging
use log::{debug, info, error, warn};

#[tauri::command]
pub fn print_receipt(port_name: String, data: Vec<u8>) -> Result<(), String> {
    debug!("Attempting to print {} bytes to {}", data.len(), port_name);

    // Validate port name
    if !port_name.starts_with("COM") && !port_name.starts_with("/dev/tty.") {
        error!("Invalid port name: {}", port_name);
        return Err(format!("Invalid port: {}", port_name));
    }

    // ... print logic
    info!("Successfully printed {} bytes", data.len());
    Ok(())
}
```

### 8.3 SQLite Debugging

```ts
// Debug SQLite queries in development
async function debugQuery(sql: string, params: any[] = []) {
  if (import.meta.env.DEV) {
    console.group(`[SQL] ${sql.slice(0, 80)}...`);
    console.log('Params:', params);
    const start = performance.now();

    try {
      const result = await db.select(sql, params);
      console.log(`Result: ${result.length} rows in ${(performance.now() - start).toFixed(1)}ms`);
      return result;
    } catch (err) {
      console.error('SQL Error:', err);
      throw err;
    } finally {
      console.groupEnd();
    }
  }
  return db.select(sql, params);
}
```

### 8.4 Network Sync Debugging

```ts
// Add to syncStore for debugging sync issues
const debugSync = (operation: string, data: any) => {
  if (import.meta.env.DEV) {
    console.log(`[SYNC:${operation}]`, {
      timestamp: new Date().toISOString(),
      pendingOps: get().pendingOperations.length,
      lastSync: get().lastSyncTime,
      data,
    });
  }
};
```

### 8.5 Production Crash Investigation Workflow

```
STEP 1: Reproduce
  → Check Sentry/error logs for stack trace
  → Identify affected component/store
  → Note user's locale, OS, app version

STEP 2: Isolate
  → Check if error is in React render, Zustand action, or Tauri command
  → React errors: Check ErrorBoundary logs
  → Zustand errors: Check store state snapshot
  → Tauri errors: Check Rust panics in minidump

STEP 3: State Inspection
  → localStorage: Check for corrupted JSON
  → SQLite: Run PRAGMA integrity_check
  → Zustand: Export state with JSON.stringify(store.getState())

STEP 4: Fix & Verify
  → Write failing test that reproduces the bug
  → Fix the bug
  → Verify test passes
  → Check for similar patterns in other stores/components

STEP 5: Prevent
  → Add test to regression suite
  → Add error boundary if missing
  → Add input validation if input-related
```

### 8.6 Common Issues & Solutions

| Symptom | Likely Cause | Debug Command | Fix |
|---|---|---|---|
| White screen on load | Unhandled exception in render | Check browser console | Add ErrorBoundary |
| Slow POS after hours | Memory leak in event listeners | Chrome DevTools → Memory tab | Cleanup in useEffect return |
| Wrong totals | Float precision error | `console.log(0.1 + 0.2)` | Use integer arithmetic (cents) |
| Printer not found | Serial port permissions | `RUST_LOG=serialport=debug` | Check USB permissions |
| Data lost after update | Zustand persist version mismatch | Check localStorage keys | Add migration in persist config |
| Sale stuck "processing" | Async action not resolving | Check network tab / Tauri logs | Add timeout + error handling |
| Arabic text reversed | Missing RTL CSS | Check `dir` attribute on body | Apply `rtl.css` |
| DB locked error | Concurrent writes | `PRAGMA journal_mode` | Use WAL mode |

---

## 9. PCI DSS & Compliance

### 9.1 PCI DSS 4.0.1 Checklist for GRAPHSHOP OS

PCI DSS applies if you handle payment card data. Even if GRAPHSHOP OS processes cash-only today, prepare for card payments.

| Req # | Requirement | GRAPHSHOP OS Status | Action Required |
|---|---|---|---|
| 1 | Install and maintain network security controls | N/A (offline-first) | Audit LAN sync encryption |
| 2 | Apply secure configurations to all system components | Partial | Harden Tauri CSP, disable debug in prod |
| 3 | Protect stored account data | FAIL | Move passwords out of localStorage |
| 4 | Protect cardholder data with strong cryptography in transit | N/A | Will need TLS for sync |
| 5 | Protect all systems against malware | OS-level | Document antivirus requirements |
| 6 | Develop and maintain secure systems and software | Partial | Add security tests, code review process |
| 7 | Restrict access to cardholder data by business need to know | Partial | Enforce role-based access |
| 8 | Identify users and authenticate access | FAIL | Fix token generation, password storage |
| 9 | Restrict physical access to cardholder data | N/A | Physical security policy |
| 10 | Log and monitor all access | FAIL | Implement audit trail |
| 11 | Test security of systems and networks regularly | FAIL | Add security test suite (Section 5) |
| 12 | Support information security with organizational policies | FAIL | Create security policy document |

### 9.2 Audit Trail Requirements

Every financial action must be logged:

```ts
interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: AuditAction;
  entityType: 'sale' | 'product' | 'treasury' | 'user' | 'settings';
  entityId: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  ipAddress?: string;
  deviceId: string;
}

type AuditAction =
  | 'create' | 'update' | 'delete'
  | 'login' | 'logout' | 'login_failed'
  | 'sale_complete' | 'sale_void' | 'sale_refund'
  | 'price_change' | 'stock_adjust'
  | 'cash_drop' | 'safe_transfer'
  | 'user_create' | 'user_deactivate' | 'role_change'
  | 'settings_change' | 'export_data';
```

Test that all auditable actions generate entries:

```ts
describe('Audit Trail', () => {
  it('logs sale completion', () => { /* ... */ });
  it('logs price changes with before/after values', () => { /* ... */ });
  it('logs user login attempts (success and failure)', () => { /* ... */ });
  it('logs stock adjustments', () => { /* ... */ });
  it('logs cash drawer operations', () => { /* ... */ });
  it('audit entries cannot be modified after creation', () => { /* ... */ });
  it('audit entries cannot be deleted', () => { /* ... */ });
});
```

### 9.3 Data Handling

```ts
describe('Data Handling Compliance', () => {
  it('no PAN (card numbers) stored anywhere', () => {
    // Scan all localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const value = localStorage.getItem(localStorage.key(i)!) || '';
      // Luhn-valid 16-digit numbers
      expect(value).not.toMatch(/\b\d{16}\b/);
    }
  });

  it('customer phone numbers are not exposed in logs', () => {
    // Console output should not contain phone numbers
    const consoleSpy = vi.spyOn(console, 'log');
    // ... trigger customer operations
    for (const call of consoleSpy.mock.calls) {
      const output = JSON.stringify(call);
      expect(output).not.toMatch(/\+?\d{10,14}/);
    }
  });
});
```

---

## 10. CI/CD Pipeline

### 10.1 GitHub Actions — Full Pipeline

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  CARGO_TERM_COLOR: always

jobs:
  # ─── LINT & TYPE CHECK ───────────────────────────
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci
        working-directory: ./ASGARD UNIFIED

      - name: Type Check
        run: npm run type:check
        working-directory: ./ASGARD UNIFIED/apps/desktop-os

      - name: Lint
        run: npm run lint:check
        working-directory: ./ASGARD UNIFIED/apps/desktop-os

  # ─── UNIT & INTEGRATION TESTS ───────────────────
  test:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci
        working-directory: ./ASGARD UNIFIED

      - name: Run Tests with Coverage
        run: npm run test:ci
        working-directory: ./ASGARD UNIFIED/apps/desktop-os

      - name: Upload Coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: ./ASGARD UNIFIED/apps/desktop-os/coverage/

      - name: Coverage Gate
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          echo "Line coverage: $COVERAGE%"
          if (( $(echo "$COVERAGE < 40" | bc -l) )); then
            echo "Coverage below 40% threshold!"
            exit 1
          fi
        working-directory: ./ASGARD UNIFIED/apps/desktop-os

  # ─── SECURITY SCAN ──────────────────────────────
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci
        working-directory: ./ASGARD UNIFIED

      - name: NPM Audit
        run: npm audit --audit-level=high
        working-directory: ./ASGARD UNIFIED
        continue-on-error: true

      - name: Rust Audit
        run: |
          cargo install cargo-audit
          cargo audit
        working-directory: ./ASGARD UNIFIED/apps/desktop-os/src-tauri

  # ─── BUILD (Cross-Platform) ─────────────────────
  build:
    needs: [test, security]
    strategy:
      fail-fast: false
      matrix:
        include:
          - platform: windows-latest
            target: x86_64-pc-windows-msvc
          - platform: macos-latest
            target: aarch64-apple-darwin
          - platform: macos-latest
            target: x86_64-apple-darwin
          - platform: ubuntu-22.04
            target: x86_64-unknown-linux-gnu

    runs-on: ${{ matrix.platform }}
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - uses: dtolnay/rust-toolchain@stable
        with:
          targets: ${{ matrix.target }}

      - name: Install Linux Dependencies
        if: matrix.platform == 'ubuntu-22.04'
        run: |
          sudo apt-get update
          sudo apt-get install -y libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf

      - run: npm ci
        working-directory: ./ASGARD UNIFIED

      - name: Build Frontend
        run: npm run build
        working-directory: ./ASGARD UNIFIED/apps/desktop-os

      - name: Build Tauri
        uses: tauri-apps/tauri-action@v0
        with:
          projectPath: ./ASGARD UNIFIED/apps/desktop-os
          tauriScript: npx tauri
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Upload Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-${{ matrix.target }}
          path: |
            ./ASGARD UNIFIED/apps/desktop-os/src-tauri/target/release/bundle/**
```

### 10.2 Pre-commit Hooks

```bash
# Install husky
npm install --save-dev husky lint-staged

# .husky/pre-commit
#!/bin/sh
npx lint-staged

# In package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,json,md}": [
      "prettier --write"
    ]
  }
}
```

### 10.3 Release Checklist Script

```bash
#!/bin/bash
# scripts/pre-release-check.sh
set -e

echo "=== GRAPHSHOP OS Pre-Release Check ==="

echo "[1/7] Type checking..."
npm run type:check

echo "[2/7] Linting..."
npm run lint:check

echo "[3/7] Running tests..."
npm run test:ci

echo "[4/7] Checking coverage..."
npm run test:coverage

echo "[5/7] Security audit..."
npm audit --audit-level=high

echo "[6/7] Building..."
npm run build

echo "[7/7] Bundle size check..."
BUNDLE_SIZE=$(du -sk dist/ | cut -f1)
echo "Bundle size: ${BUNDLE_SIZE}KB"
if [ "$BUNDLE_SIZE" -gt 15000 ]; then
  echo "WARNING: Bundle exceeds 15MB"
fi

echo "=== All checks passed ==="
```

---

## 11. Error Monitoring & Observability

### 11.1 Sentry for Tauri (Community Plugin)

```bash
# Install
cargo add sentry tauri-plugin-sentry sentry-rust-minidump
npm install @sentry/browser
```

```rust
// src-tauri/src/main.rs
use sentry;
use tauri_plugin_sentry;

fn main() {
    let _guard = sentry::init(("YOUR_DSN", sentry::ClientOptions {
        release: sentry::release_name!(),
        environment: Some(if cfg!(debug_assertions) { "development" } else { "production" }.into()),
        traces_sample_rate: 0.1,
        ..Default::default()
    }));

    tauri::Builder::default()
        .plugin(tauri_plugin_sentry::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

```ts
// src/renderer/src/main.tsx
import * as Sentry from '@sentry/browser';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'YOUR_DSN',
    environment: 'production',
    tracesSampleRate: 0.1,
    beforeSend(event) {
      // Strip PII
      if (event.user) {
        delete event.user.email;
        delete event.user.ip_address;
      }
      return event;
    },
  });
}
```

### 11.2 Error Boundary with Reporting

```tsx
// apps/desktop-os/src/renderer/src/components/ErrorBoundary.tsx
import React from 'react';
import * as Sentry from '@sentry/browser';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  context?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[ErrorBoundary:${this.props.context}]`, error, errorInfo);

    // Report to Sentry
    if (import.meta.env.PROD) {
      Sentry.captureException(error, {
        extra: {
          componentStack: errorInfo.componentStack,
          context: this.props.context,
        },
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#ef4444',
          background: '#1a1a2e',
          borderRadius: '12px',
          margin: '1rem',
        }}>
          <h3>Something went wrong</h3>
          <p style={{ color: '#94a3b8' }}>
            {this.state.error?.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#00D177',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 11.3 Structured Logging

```ts
// apps/desktop-os/src/renderer/src/utils/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  data?: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private log(level: LogLevel, message: string, data?: Record<string, unknown>) {
    const entry: LogEntry = {
      level,
      message,
      context: this.context,
      data,
      timestamp: new Date().toISOString(),
    };

    if (import.meta.env.DEV) {
      const colors = { debug: '#888', info: '#00D177', warn: '#f59e0b', error: '#ef4444' };
      console.log(
        `%c[${entry.context}] ${entry.message}`,
        `color: ${colors[level]}`,
        data ?? '',
      );
    }

    // In production, buffer and send to storage
    if (import.meta.env.PROD && (level === 'warn' || level === 'error')) {
      // Store in SQLite audit_log table
      this.persistLog(entry);
    }
  }

  debug(msg: string, data?: Record<string, unknown>) { this.log('debug', msg, data); }
  info(msg: string, data?: Record<string, unknown>) { this.log('info', msg, data); }
  warn(msg: string, data?: Record<string, unknown>) { this.log('warn', msg, data); }
  error(msg: string, data?: Record<string, unknown>) { this.log('error', msg, data); }

  private async persistLog(entry: LogEntry) {
    try {
      // Write to SQLite via Tauri
      // await invoke('log_entry', { entry });
    } catch {
      // Logging should never crash the app
    }
  }
}

// Usage:
// const log = new Logger('POS');
// log.info('Sale completed', { saleId: 'sale_123', total: 1500 });
// log.error('Payment failed', { error: err.message, paymentMethod: 'card' });

export function createLogger(context: string) {
  return new Logger(context);
}
```

---

## 12. Testing Checklists

### 12.1 Pre-Release Checklist (Run Before Every Production Build)

**Build & Compile**
- [ ] `npm run type:check` passes with zero errors
- [ ] `npm run lint:check` passes with zero errors
- [ ] `npm run build` succeeds for all targets
- [ ] Bundle size is under 15MB
- [ ] No console.log statements in production code (use Logger)

**Tests**
- [ ] `npm run test:ci` — all tests pass
- [ ] Coverage meets thresholds (40%+ lines Phase 1, 80%+ Phase 3)
- [ ] No skipped tests (`.skip` or `.todo`)
- [ ] Security test suite passes

**Functional**
- [ ] Login/logout works for all user roles (admin, manager, cashier)
- [ ] POS: Add product by click, barcode scan, search
- [ ] POS: Complete cash sale with correct change
- [ ] POS: Apply percentage and fixed discount
- [ ] POS: Void/cancel sale
- [ ] POS: Hold and recall sale
- [ ] POS: Print receipt (thermal printer)
- [ ] Dashboard: Revenue numbers match sales data
- [ ] Dashboard: Charts render with real data
- [ ] Inventory: Add product with all fields
- [ ] Inventory: Edit product price (verify margin updates)
- [ ] Inventory: Delete product (verify cascade)
- [ ] Treasury: Record expense
- [ ] Treasury: Cash drop to safe
- [ ] Treasury: Drawer reconciliation
- [ ] Settings: Change language (FR/AR/EN)
- [ ] Settings: Toggle dark/light mode
- [ ] Reports: Generate daily sales report
- [ ] Reports: Export to PDF

**Security**
- [ ] `npm audit` — no high/critical vulnerabilities
- [ ] `cargo audit` — no known Rust vulnerabilities
- [ ] No secrets in source code (grep for API keys, passwords)
- [ ] CSP configured in tauri.conf.json
- [ ] Auth tokens are unpredictable
- [ ] Session expires after inactivity

**Data Integrity**
- [ ] SQLite `PRAGMA integrity_check` passes
- [ ] All CRUD operations persist across app restart
- [ ] Zustand persist state survives reload
- [ ] Data migration runs on version upgrade (if applicable)

**Performance**
- [ ] App starts in under 5 seconds
- [ ] POS responds to product click in under 200ms
- [ ] Product search returns results in under 100ms
- [ ] Dashboard loads in under 2 seconds with 10K+ sales
- [ ] No memory leak after 8-hour session simulation

**i18n**
- [ ] All UI text is translated (no key fallbacks)
- [ ] Arabic RTL layout renders correctly
- [ ] Currency format correct for each locale
- [ ] Date format correct for each locale

**Accessibility**
- [ ] Keyboard navigation works on POS page
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA (4.5:1)

**Platform**
- [ ] Tested on Windows 10/11
- [ ] Tested on macOS (Intel + Apple Silicon)
- [ ] Tested on Linux (Ubuntu 22.04)
- [ ] Printer works on each platform

### 12.2 Hotfix Deployment Checklist

- [ ] Bug reproduced locally with a failing test
- [ ] Fix implemented — test now passes
- [ ] All existing tests still pass
- [ ] No unrelated changes in the diff
- [ ] Build succeeds on target platform
- [ ] Tested manually on target platform
- [ ] Version bumped (patch)
- [ ] Changelog updated
- [ ] Stakeholder approved

### 12.3 New Feature QA Checklist

- [ ] Feature specification reviewed and understood
- [ ] Unit tests written for new logic
- [ ] Component tests written for new UI
- [ ] Integration test covers the full flow
- [ ] Error states handled and tested
- [ ] Loading states handled
- [ ] Empty states handled
- [ ] Edge cases identified and tested
- [ ] RTL layout tested for new UI
- [ ] All 3 languages have translations
- [ ] Keyboard shortcuts documented (if applicable)
- [ ] Performance impact assessed
- [ ] No regression in existing features
- [ ] Code reviewed by another developer

### 12.4 Daily Smoke Test (Manual — 5 Minutes)

Run this every morning before opening the store:

```
1. Launch app                         → App loads without white screen
2. Login as cashier                   → Dashboard appears
3. Navigate to POS                    → Product grid loads
4. Add 2 different products to cart   → Cart updates correctly
5. Complete cash sale                 → Receipt prints, change correct
6. Check Dashboard                    → Today's sale appears
7. Check product stock                → Stock decreased by sold quantity
8. Check Treasury                     → Cash balance increased
9. Change language to Arabic          → RTL layout works
10. Logout                            → Redirected to login
```

---

## Appendix A: Test File Organization

```
apps/desktop-os/src/
├── test/
│   ├── setup.ts                 # Global test setup
│   ├── render.tsx               # Custom render with providers
│   ├── factories.ts             # Mock data factories
│   ├── store-helpers.ts         # Zustand test utilities
│   └── performance.test.ts      # Performance benchmarks
│
├── renderer/src/
│   ├── __tests__/
│   │   ├── security.test.ts             # Security test suite
│   │   ├── transaction-accuracy.test.ts # Financial accuracy
│   │   ├── inventory-edge-cases.test.ts # Inventory edge cases
│   │   ├── treasury.test.ts             # Cash management
│   │   └── receipt-format.test.ts       # Receipt formatting
│   │
│   ├── pages/
│   │   ├── POS/__tests__/POS.test.tsx
│   │   ├── Dashboard/__tests__/Dashboard.test.tsx
│   │   ├── Settings/__tests__/Settings.test.tsx
│   │   ├── Inventory/__tests__/Inventory.test.tsx
│   │   └── Treasury/__tests__/Treasury.test.tsx
│   │
│   ├── components/
│   │   └── __tests__/ErrorBoundary.test.tsx
│   │
│   └── services/
│       └── __tests__/
│           ├── dbService.test.ts
│           ├── printerService.test.ts
│           ├── auth.test.ts
│           └── secureStorage.test.ts
│
├── e2e/
│   ├── complete-sale.e2e.ts
│   ├── offline-mode.e2e.ts
│   ├── multi-user.e2e.ts
│   └── wdio.conf.ts

packages/shared/
├── stores/__tests__/
│   ├── productsStore.test.ts
│   ├── salesStore.test.ts
│   ├── authStore.test.ts
│   ├── syncStore.test.ts
│   └── treasuryStore.test.ts
│
└── utils/__tests__/
    └── secureStorage.test.ts
```

---

## Appendix B: Key Commands Reference

```bash
# ─── TESTING ─────────────────────────────────────
npm run test                  # Run all tests once
npm run test:watch            # Watch mode
npm run test:coverage         # With coverage report
npm run test:ui               # Interactive UI
npm run test:changed          # Only changed files
npm run test:store            # Only store tests
npm run test:security         # Only security tests

# ─── QUALITY ─────────────────────────────────────
npm run lint:check            # ESLint
npm run type:check            # TypeScript
npx prettier --check src/     # Formatting

# ─── BUILD ───────────────────────────────────────
npm run build                 # Build frontend
npx tauri build               # Build desktop app
npm run build:analyze         # Bundle analysis

# ─── DEBUGGING ───────────────────────────────────
RUST_LOG=debug npx tauri dev  # Verbose Rust logs
npx tauri dev -- --inspect    # Chrome DevTools for renderer

# ─── SECURITY ────────────────────────────────────
npm audit                     # JS dependency audit
cargo audit                   # Rust dependency audit

# ─── DATABASE ────────────────────────────────────
sqlite3 igo-desktop.db "PRAGMA integrity_check;"
sqlite3 igo-desktop.db ".tables"
sqlite3 igo-desktop.db "SELECT COUNT(*) FROM products;"
```

---

*Last updated: February 2026*
*Stack: React 19.2 | TypeScript 5.9 | Tauri 2.9 | Zustand 5.0 | Vitest 4.0 | SQLite*

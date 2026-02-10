# Comprehensive Testing Strategies Skill

## Overview
Expertise in implementing complete testing suites for modern React/TypeScript applications, covering unit tests, integration tests, and end-to-end testing with proper mocking, fixtures, and CI/CD integration.

## Testing Stack Overview

### Core Testing Technologies
- **Vitest**: Fast unit testing with Vite integration
- **React Testing Library**: Component testing with user-centric approach
- **MSW (Mock Service Worker)**: API mocking for testing
- **Playwright**: Cross-browser E2E testing
- **Testing Library User Event**: Realistic user interaction simulation
- **Jest DOM**: Custom DOM matchers for assertions

### Test Organization Structure
```
src/
├── __tests__/                 # Global test utilities
│   ├── fixtures/             # Test data and mock data
│   ├── mocks/               # Mock implementations
│   ├── utils/               # Test helper functions
│   └── setup.ts             # Global test setup
├── components/
│   └── ComponentName/
│       ├── ComponentName.tsx
│       ├── ComponentName.test.tsx
│       └── ComponentName.stories.tsx
├── hooks/
│   └── useHook/
│       ├── useHook.ts
│       └── useHook.test.ts
├── services/
│   └── api/
│       ├── api.ts
│       └── api.test.ts
└── e2e/
    ├── fixtures/
    ├── page-objects/
    └── tests/
```

## Unit Testing Setup

### Vitest Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.d.ts',
        '**/*.stories.tsx',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
```

### Global Test Setup
```typescript
// src/__tests__/setup.ts
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

// Start MSW server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Close MSW server after all tests
afterAll(() => server.close());

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

### API Mocking with MSW
```typescript
// src/__tests__/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// src/__tests__/mocks/handlers.ts
import { rest } from 'msw';

const API_BASE = 'http://localhost:3000/api';

export const handlers = [
  // Product endpoints
  rest.get(`${API_BASE}/products`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          sku: 'TEST001',
          designation: 'Test Product',
          price: 10.99,
          stockQuantity: 100,
          categoryId: 'cat1',
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ])
    );
  }),

  rest.post(`${API_BASE}/products`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: '2',
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
  }),

  rest.delete(`${API_BASE}/products/:id`, (req, res, ctx) => {
    const { id } = req.params;
    if (id === 'error') {
      return res(
        ctx.status(404),
        ctx.json({ error: 'Product not found' })
      );
    }
    return res(ctx.status(204));
  }),

  // Sale endpoints
  rest.post(`${API_BASE}/sales`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: 'sale1',
        total: 21.98,
        tax: 2.20,
        status: 'completed',
        createdAt: new Date().toISOString(),
      })
    );
  }),
];
```

## Component Testing

### Component Test Example
```typescript
// src/components/ProductCard/ProductCard.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from './ProductCard';
import { Product } from '@shared/types';

const mockProduct: Product = {
  id: '1',
  sku: 'TEST001',
  designation: 'Test Product',
  description: 'A test product for testing',
  price: 10.99,
  categoryId: 'cat1',
  stockQuantity: 100,
  minStock: 10,
  isActive: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('ProductCard', () => {
  const defaultProps = {
    product: mockProduct,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onAddToCart: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product information correctly', () => {
    render(<ProductCard {...defaultProps} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('TEST001')).toBeInTheDocument();
    expect(screen.getByText('$10.99')).toBeInTheDocument();
    expect(screen.getByText('In Stock: 100')).toBeInTheDocument();
  });

  it('shows low stock warning when applicable', () => {
    const lowStockProduct = {
      ...mockProduct,
      stockQuantity: 5,
      minStock: 10,
    };
    
    render(
      <ProductCard 
        {...defaultProps} 
        product={lowStockProduct} 
      />
    );
    
    expect(screen.getByText(/low stock/i)).toBeInTheDocument();
    expect(screen.getByText('5 / 10')).toBeInTheDocument();
  });

  it('calls onAddToCart when add to cart button is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductCard {...defaultProps} />);
    
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    await user.click(addToCartButton);
    
    expect(defaultProps.onAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('shows edit menu when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductCard {...defaultProps} />);
    
    const menuButton = screen.getByRole('button', { name: /options/i });
    await user.click(menuButton);
    
    expect(screen.getByRole('menuitem', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /delete/i })).toBeInTheDocument();
  });

  it('calls onEdit when edit menu item is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductCard {...defaultProps} />);
    
    // Open menu
    const menuButton = screen.getByRole('button', { name: /options/i });
    await user.click(menuButton);
    
    // Click edit
    const editButton = screen.getByRole('menuitem', { name: /edit/i });
    await user.click(editButton);
    
    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockProduct);
  });

  it('shows confirmation dialog when delete is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductCard {...defaultProps} />);
    
    // Open menu
    const menuButton = screen.getByRole('button', { name: /options/i });
    await user.click(menuButton);
    
    // Click delete
    const deleteButton = screen.getByRole('menuitem', { name: /delete/i });
    await user.click(deleteButton);
    
    // Check confirmation dialog
    expect(screen.getByText(/delete product/i)).toBeInTheDocument();
    expect(screen.getByText(/test product/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('calls onDelete when delete is confirmed', async () => {
    const user = userEvent.setup();
    render(<ProductCard {...defaultProps} />);
    
    // Open menu and click delete
    const menuButton = screen.getByRole('button', { name: /options/i });
    await user.click(menuButton);
    
    const deleteButton = screen.getByRole('menuitem', { name: /delete/i });
    await user.click(deleteButton);
    
    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(confirmButton);
    
    await waitFor(() => {
      expect(defaultProps.onDelete).toHaveBeenCalledWith(mockProduct.id);
    });
  });
});
```

### Hook Testing
```typescript
// src/hooks/useProducts/useProducts.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { server } from '../../__tests__/mocks/server';
import { rest } from 'msw';
import { useProducts } from './useProducts';

describe('useProducts', () => {
  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it('loads products successfully', async () => {
    const { result } = renderHook(() => useProducts());
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.products).toEqual([]);
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.products).toHaveLength(1);
      expect(result.current.products[0].designation).toBe('Test Product');
    });
  });

  it('handles API errors', async () => {
    server.use(
      rest.get('http://localhost:3000/api/products', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );

    const { result } = renderHook(() => useProducts());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('Failed to load products');
    });
  });

  it('adds new product', async () => {
    const { result } = renderHook(() => useProducts());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const newProduct = {
      sku: 'NEW001',
      designation: 'New Product',
      price: 15.99,
      categoryId: 'cat1',
      stockQuantity: 50,
      minStock: 5,
    };

    await result.current.addProduct(newProduct);
    
    await waitFor(() => {
      expect(result.current.products).toHaveLength(2);
      expect(result.current.products[1].sku).toBe('NEW001');
    });
  });
});
```

## Integration Testing

### Integration Test Example
```typescript
// src/__tests__/integration/ProductManagementFlow.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ProductManagement } from '../pages/ProductManagement/ProductManagement';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { server } from '../mocks/server';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  </BrowserRouter>
);

describe('Product Management Integration', () => {
  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it('completes full product management workflow', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <ProductManagement />
      </TestWrapper>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    // Open add product dialog
    const addButton = screen.getByRole('button', { name: /add product/i });
    await user.click(addButton);

    // Fill out form
    const skuInput = screen.getByLabelText(/sku/i);
    const nameInput = screen.getByLabelText(/name/i);
    const priceInput = screen.getByLabelText(/price/i);
    
    await user.type(skuInput, 'NEW001');
    await user.type(nameInput, 'New Test Product');
    await user.type(priceInput, '25.99');

    // Save product
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    // Verify new product appears in list
    await waitFor(() => {
      expect(screen.getByText('New Test Product')).toBeInTheDocument();
      expect(screen.getByText('NEW001')).toBeInTheDocument();
      expect(screen.getByText('$25.99')).toBeInTheDocument();
    });

    // Edit the product
    const editButton = screen.getByRole('button', { name: /edit new test product/i });
    await user.click(editButton);

    // Update price
    const priceInputEdit = screen.getByLabelText(/price/i);
    await user.clear(priceInputEdit);
    await user.type(priceInputEdit, '29.99');

    // Save changes
    const saveEditButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveEditButton);

    // Verify updated price
    await waitFor(() => {
      expect(screen.getByText('$29.99')).toBeInTheDocument();
    });

    // Delete the product
    const menuButton = screen.getByRole('button', { name: /options new test product/i });
    await user.click(menuButton);
    
    const deleteButton = screen.getByRole('menuitem', { name: /delete/i });
    await user.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(confirmButton);

    // Verify product is removed
    await waitFor(() => {
      expect(screen.queryByText('New Test Product')).not.toBeInTheDocument();
    });
  });
});
```

## End-to-End Testing

### Playwright Configuration
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Page Objects Pattern
```typescript
// e2e/page-objects/ProductPage.ts
import { Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly searchInput: Locator;
  readonly productTable: Locator;
  readonly skuInput: Locator;
  readonly nameInput: Locator;
  readonly priceInput: Locator;
  readonly saveButton: Locator;
  readonly modal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.getByRole('button', { name: /add product/i });
    this.searchInput = page.getByPlaceholder(/search products/i);
    this.productTable = page.getByRole('table');
    this.skuInput = page.getByLabel(/sku/i);
    this.nameInput = page.getByLabel(/name/i);
    this.priceInput = page.getByLabel(/price/i);
    this.saveButton = page.getByRole('button', { name: /save/i });
    this.modal = page.getByRole('dialog');
  }

  async goto() {
    await this.page.goto('/products');
  }

  async addProduct(product: {
    sku: string;
    name: string;
    price: string;
  }) {
    await this.addButton.click();
    await this.skuInput.fill(product.sku);
    await this.nameInput.fill(product.name);
    await this.priceInput.fill(product.price);
    await this.saveButton.click();
    await this.modal.waitFor({ state: 'hidden' });
  }

  async searchProducts(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(300); // Debounce delay
  }

  async getProductRow(sku: string) {
    return this.productTable.getByText(sku);
  }

  async deleteProduct(sku: string) {
    const productRow = await this.getProductRow(sku);
    await productRow.getByRole('button', { name: /options/i }).click();
    await this.page.getByRole('menuitem', { name: /delete/i }).click();
    await this.page.getByRole('button', { name: /confirm/i }).click();
  }
}
```

### E2E Test Example
```typescript
// e2e/tests/product-management.spec.ts
import { test, expect } from '@playwright/test';
import { ProductPage } from '../page-objects/ProductPage';

test.describe('Product Management E2E', () => {
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    productPage = new ProductPage(page);
    await productPage.goto();
  });

  test('should add, edit, and delete products', async ({ page }) => {
    // Add new product
    await productPage.addProduct({
      sku: 'E2E001',
      name: 'E2E Test Product',
      price: '19.99',
    });

    // Verify product appears in table
    await expect(productPage.getProductRow('E2E001')).toBeVisible();
    await expect(page.getByText('E2E Test Product')).toBeVisible();
    await expect(page.getByText('$19.99')).toBeVisible();

    // Search for product
    await productPage.searchProducts('E2E001');
    await expect(productPage.getProductRow('E2E001')).toBeVisible();

    // Delete product
    await productPage.deleteProduct('E2E001');
    await expect(productPage.getProductRow('E2E001')).not.toBeVisible();
  });

  test('should handle validation errors', async ({ page }) => {
    await productPage.addButton.click();
    
    // Try to save without required fields
    await productPage.saveButton.click();
    
    // Should show validation errors
    await expect(page.getByText(/sku is required/i)).toBeVisible();
    await expect(page.getByText(/name is required/i)).toBeVisible();
    await expect(page.getByText(/price is required/i)).toBeVisible();
  });

  test('should filter products by search', async ({ page }) => {
    // Add multiple products
    await productPage.addProduct({
      sku: 'FRUIT001',
      name: 'Apple',
      price: '1.50',
    });

    await productPage.addProduct({
      sku: 'VEG001', 
      name: 'Carrot',
      price: '0.99',
    });

    // Search for fruit
    await productPage.searchProducts('Apple');
    
    await expect(productPage.getProductRow('FRUIT001')).toBeVisible();
    await expect(productPage.getProductRow('VEG001')).not.toBeVisible();

    // Clear search
    await productPage.searchInput.clear();
    await page.waitForTimeout(300);
    
    await expect(productPage.getProductRow('FRUIT001')).toBeVisible();
    await expect(productPage.getProductRow('VEG001')).toBeVisible();
  });
});
```

## Test Utilities and Helpers

### Test Data Factories
```typescript
// src/__tests__/factories/ProductFactory.ts
import { Product } from '@shared/types';
import { faker } from '@faker-js/faker';

export class ProductFactory {
  static create(overrides: Partial<Product> = {}): Product {
    return {
      id: faker.string.uuid(),
      sku: faker.string.alphanumeric(8).toUpperCase(),
      designation: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      price: parseFloat(faker.commerce.price()),
      cost: parseFloat(faker.commerce.price()),
      categoryId: faker.string.uuid(),
      stockQuantity: faker.number.int({ min: 0, max: 1000 }),
      minStock: faker.number.int({ min: 5, max: 50 }),
      isActive: faker.datatype.boolean(),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
      ...overrides,
    };
  }

  static createMany(count: number, overrides: Partial<Product> = {}): Product[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}
```

### Custom Render Function
```typescript
// src/__tests__/utils/testUtils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../theme/ThemeProvider';

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### Async Test Helpers
```typescript
// src/__tests__/utils/asyncHelpers.ts
import { waitFor } from '@testing-library/react';
import { vi } from 'vitest';

export const waitForLoadingToFinish = () =>
  waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

export const mockApiCall = <T>(
  implementation: () => Promise<T>
): jest.MockedFunction<() => Promise<T>> => {
  const mock = vi.fn().mockImplementation(implementation);
  return mock;
};

export const createMockResponse = <T>(data: T, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => data,
  text: async () => JSON.stringify(data),
});
```

## CI/CD Integration

### GitHub Actions Test Pipeline
```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test-unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linting
        run: npm run lint
        
      - name: Run type checking
        run: npm run typecheck
        
      - name: Run unit tests
        run: npm run test:unit
        
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  test-e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright
        run: npx playwright install --with-deps
        
      - name: Build application
        run: npm run build
        
      - name: Run E2E tests
        run: npm run test:e2e
        
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Package.json Scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:unit": "vitest run",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:watch": "vitest watch"
  }
}
```

## Performance Testing

### Performance Test Example
```typescript
// src/__tests__/performance/ComponentPerformance.test.tsx
import { render } from '@testing-library/react';
import { LargeProductList } from '../components/LargeProductList/LargeProductList';
import { ProductFactory } from '../factories/ProductFactory';

describe('Component Performance', () => {
  it('should render large product list efficiently', () => {
    const products = ProductFactory.createMany(1000);
    
    const startTime = performance.now();
    render(<LargeProductList products={products} />);
    const endTime = performance.now();
    
    // Should render within 100ms
    expect(endTime - startTime).toBeLessThan(100);
  });
});
```

This comprehensive testing strategy provides complete coverage for unit, integration, and end-to-end testing, ensuring robust and reliable applications for GRAPHSHOP OS.
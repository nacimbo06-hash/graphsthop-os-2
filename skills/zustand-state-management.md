# Zustand State Management Skill

## Overview
Expertise in implementing scalable, performant state management using Zustand for React applications, with persistence, middleware, and complex state patterns.

## Core Concepts

### Basic Store Structure
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  // State
  count: number;
  user: User | null;
  isLoading: boolean;
  
  // Actions
  increment: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
}

const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      count: 0,
      user: null,
      isLoading: false,
      
      increment: () => set((state) => ({ count: state.count + 1 })),
      
      setUser: (user) => set({ user }),
      
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

## Advanced Patterns

### Store Composition & Modularity
```typescript
// Separate stores for different domains
const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  categories: [],
  filters: {},
  
  actions: {
    setProducts: (products) => set({ products }),
    addProduct: (product) => set((state) => ({ 
      products: [...state.products, product] 
    })),
    updateProduct: (id, updates) => set((state) => ({
      products: state.products.map(p => 
        p.id === id ? { ...p, ...updates } : p
      )
    })),
    deleteProduct: (id) => set((state) => ({
      products: state.products.filter(p => p.id !== id)
    })),
    setFilter: (key, value) => set((state) => ({
      filters: { ...state.filters, [key]: value }
    })),
  },
}));

// Combined store using Zustand's subscribe pattern
const useAppStore = create<AppState>((set, get) => ({
  // Derived state from other stores
  get productCount() {
    return useProductsStore.getState().products.length;
  },
  
  actions: {
    // Actions that coordinate between stores
    refreshAllData: async () => {
      await Promise.all([
        useProductsStore.getState().actions.loadProducts(),
        useSalesStore.getState().actions.loadSales(),
      ]);
    },
  },
}));
```

### Async Actions & Error Handling
```typescript
interface AsyncState {
  data: any[] | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface AsyncStore extends AsyncState {
  fetchData: (params?: any) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const createAsyncStore = (fetcher: (params?: any) => Promise<any[]>) => {
  return create<AsyncStore>((set, get) => ({
    data: null,
    isLoading: false,
    error: null,
    lastUpdated: null,
    
    fetchData: async (params) => {
      set({ isLoading: true, error: null });
      
      try {
        const data = await fetcher(params);
        set({ 
          data, 
          isLoading: false, 
          lastUpdated: new Date() 
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Unknown error',
          isLoading: false 
        });
      }
    },
    
    clearError: () => set({ error: null }),
    
    reset: () => set({ 
      data: null, 
      isLoading: false, 
      error: null, 
      lastUpdated: null 
    }),
  }));
};
```

### Middleware Implementation
```typescript
// Logger middleware
const logger = (config) => (set, get, api) => {
  const loggedSet = (...args) => {
    console.log('  applying', args);
    set(...args);
    console.log('  new state', get());
  };
  
  return config(loggedSet, get, api);
};

// Analytics middleware
const analytics = (config) => (set, get, api) => {
  const originalSet = set;
  
  set = (...args) => {
    const [stateOrFn, replace] = args;
    
    // Track state changes
    if (typeof stateOrFn === 'function') {
      const prevState = get();
      const newState = stateOrFn(prevState);
      
      // Send analytics
      trackStateChange(prevState, newState);
    }
    
    return originalSet(...args);
  };
  
  return config(set, get, api);
};

// Apply middleware
const useStore = create<AppState>()(
  logger(
    analytics(
      persist(
        (set, get) => ({
          // store implementation
        }),
        { name: 'app-storage' }
      )
    )
  )
);
```

## Persistence Strategies

### Selective Persistence
```typescript
const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // State that should be persisted
      userSettings: {
        theme: 'light',
        language: 'en',
        notifications: true,
      },
      
      // State that should NOT be persisted
      tempData: [],
      uiState: {
        sidebarOpen: true,
        activeModal: null,
      },
      
      actions: {
        updateUserSettings: (settings) => set((state) => ({
          userSettings: { ...state.userSettings, ...settings }
        })),
        
        setTempData: (data) => set({ tempData: data }),
        
        setUIState: (uiState) => set((state) => ({
          uiState: { ...state.uiState, ...uiState }
        })),
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist userSettings
      partialize: (state) => ({ userSettings: state.userSettings }),
      // Version handling
      version: 1,
      onRehydrateStorage: () => (state) => {
        console.log('Hydrated:', state);
      },
    }
  )
);
```

### Database Persistence with Dexie
```typescript
import Dexie from 'dexie';
import { subscribeWithSelector } from 'zustand/middleware';

class AppDatabase extends Dexie {
  products!: Dexie.Table<Product, string>;
  sales!: Dexie.Table<Sale, string>;
  
  constructor() {
    super('AppDatabase');
    this.version(1).stores({
      products: 'id, sku, designation, price, stock, createdAt',
      sales: 'id, customerId, total, createdAt',
    });
  }
}

const db = new AppDatabase();

const useOfflineStore = create<OfflineState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        products: [],
        sales: [],
        
        actions: {
          syncToDB: async () => {
            const { products, sales } = get();
            
            // Sync products
            await db.transaction('rw', db.products, async () => {
              await db.products.clear();
              await db.products.bulkPut(products);
            });
            
            // Sync sales
            await db.transaction('rw', db.sales, async () => {
              await db.sales.clear();
              await db.sales.bulkPut(sales);
            });
          },
          
          loadFromDB: async () => {
            const [products, sales] = await Promise.all([
              db.products.toArray(),
              db.sales.toArray(),
            ]);
            
            set({ products, sales });
          },
          
          addProduct: (product) => {
            set((state) => ({ products: [...state.products, product] }));
            // Auto-sync to DB
            db.products.put(product);
          },
        },
      }),
      {
        name: 'offline-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ 
          products: state.products.slice(0, 100), // Limit in memory
        }),
      }
    )
  )
);

// Auto-sync on changes
useOfflineStore.subscribe(
  (state) => state.products,
  (products) => {
    // Throttled sync
    setTimeout(() => {
      db.products.bulkPut(products);
    }, 1000);
  }
);
```

## Performance Optimization

### Memoized Selectors
```typescript
import { createSelector } from 'reselect';

// Raw selector
const selectProducts = (state: ProductsState) => state.products;
const selectFilters = (state: ProductsState) => state.filters;

// Memoized selector
const selectFilteredProducts = createSelector(
  [selectProducts, selectFilters],
  (products, filters) => {
    return products.filter(product => {
      if (filters.category && product.categoryId !== filters.category) {
        return false;
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return product.designation.toLowerCase().includes(searchTerm);
      }
      if (filters.minPrice && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && product.price > filters.maxPrice) {
        return false;
      }
      return true;
    });
  }
);

// Usage in store
const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  filters: {},
  
  // Memoized selector
  get filteredProducts() {
    return selectFilteredProducts(get());
  },
  
  actions: {
    setProducts: (products) => set({ products }),
    setFilters: (filters) => set({ filters }),
  },
}));
```

### Optimistic Updates
```typescript
const useOptimisticStore = create<OptimisticState>((set, get) => ({
  products: [],
  pendingUpdates: new Map<string, Product>(),
  
  actions: {
    updateProduct: async (id: string, updates: Partial<Product>) => {
      // Optimistic update
      const currentProduct = get().products.find(p => p.id === id);
      if (!currentProduct) return;
      
      const optimisticProduct = { ...currentProduct, ...updates };
      
      // Update local state immediately
      set((state) => ({
        products: state.products.map(p => 
          p.id === id ? optimisticProduct : p
        ),
        pendingUpdates: new Map(state.pendingUpdates).set(id, optimisticProduct),
      }));
      
      try {
        // Sync with backend
        await updateProductInBackend(id, updates);
        
        // Clear pending update
        set((state) => {
          const newPending = new Map(state.pendingUpdates);
          newPending.delete(id);
          return { pendingUpdates: newPending };
        });
      } catch (error) {
        // Rollback on error
        set((state) => ({
          products: state.products.map(p => 
            p.id === id ? currentProduct : p
          ),
          pendingUpdates: new Map(state.pendingUpdates).delete(id) 
            ? state.pendingUpdates 
            : new Map(),
        }));
        
        throw error;
      }
    },
  },
}));
```

## Testing Strategies

### Store Testing
```typescript
import { act, renderHook } from '@testing-library/react';
import { useProductsStore } from './productsStore';

describe('Products Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useProductsStore.setState({
      products: [],
      filters: {},
      actions: useProductsStore.getState().actions,
    });
  });
  
  test('should add product', () => {
    const { result } = renderHook(() => useProductsStore());
    
    const product = {
      id: '1',
      designation: 'Test Product',
      price: 10,
    };
    
    act(() => {
      result.current.actions.addProduct(product);
    });
    
    expect(result.current.products).toContain(product);
  });
  
  test('should filter products by category', () => {
    const { result } = renderHook(() => useProductsStore());
    
    const products = [
      { id: '1', designation: 'Product 1', categoryId: 'cat1', price: 10 },
      { id: '2', designation: 'Product 2', categoryId: 'cat2', price: 20 },
    ];
    
    act(() => {
      result.current.actions.setProducts(products);
      result.current.actions.setFilter('category', 'cat1');
    });
    
    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].id).toBe('1');
  });
});
```

## Store Patterns for GRAPHSHOP OS

### Domain-Specific Stores
```typescript
// POS Store
const usePOSStore = create<POSState>((set, get) => ({
  cart: [],
  customer: null,
  paymentMethods: [],
  
  actions: {
    addToCart: (product: Product, quantity: number = 1) => {
      set((state) => {
        const existingItem = state.cart.find(item => item.productId === product.id);
        
        if (existingItem) {
          return {
            cart: state.cart.map(item =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          };
        } else {
          return {
            cart: [...state.cart, {
              productId: product.id,
              product,
              quantity,
              price: product.price,
            }]
          };
        }
      });
    },
    
    removeFromCart: (productId: string) => {
      set((state) => ({
        cart: state.cart.filter(item => item.productId !== productId)
      }));
    },
    
    setCustomer: (customer: Customer) => set({ customer }),
    
    clearCart: () => set({ cart: [], customer: null }),
    
    getTotal: () => {
      return get().cart.reduce((total, item) => 
        total + (item.price * item.quantity), 0
      );
    },
  },
}));

// Treasury Store
const useTreasuryStore = create<TreasuryState>((set, get) => ({
  currentSession: null,
  expenses: [],
  cashMovements: [],
  
  actions: {
    startSession: (userId: string, openingBalance: number) => {
      const session: CashSession = {
        id: generateId(),
        userId,
        openingBalance,
        startTime: new Date(),
        cashIn: 0,
        cashOut: 0,
      };
      
      set({ currentSession: session });
    },
    
    addExpense: (expense: Expense) => {
      set((state) => ({
        expenses: [...state.expenses, expense]
      }));
      
      // Update session cash out
      if (get().currentSession) {
        set((state) => ({
          currentSession: state.currentSession ? {
            ...state.currentSession,
            cashOut: state.currentSession.cashOut + expense.amount,
          } : null,
        }));
      }
    },
    
    closeSession: async (closingBalance: number) => {
      const session = get().currentSession;
      if (!session) throw new Error('No active session');
      
      const closedSession = {
        ...session,
        endTime: new Date(),
        closingBalance,
        discrepancy: closingBalance - (
          session.openingBalance + session.cashIn - session.cashOut
        ),
      };
      
      // Generate Z-report
      const zReport = await generateZReport(closedSession);
      
      set({ currentSession: null });
      
      return { session: closedSession, zReport };
    },
  },
}));
```

## Best Practices

### Store Organization
1. **Single Responsibility**: Each store handles one domain
2. **Immutable Updates**: Always return new state objects
3. **Action Separation**: Keep actions in separate object
4. **Type Safety**: Use TypeScript interfaces for all state
5. **Performance**: Use selectors and memoization

### Common Pitfalls to Avoid
1. **Over-fetching**: Don't load all data at once
2. **State Bloat**: Keep only necessary state in stores
3. **Memory Leaks**: Clean up subscriptions in useEffect
4. **Race Conditions**: Handle async operations properly
5. **Persistence Overload**: Don't persist temporary UI state

This comprehensive skill covers all aspects of Zustand state management needed for complex applications like GRAPHSHOP OS.
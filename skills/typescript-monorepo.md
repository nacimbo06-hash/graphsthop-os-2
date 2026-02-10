# TypeScript Monorepo Architecture Skill

## Overview
Expertise in designing, implementing, and maintaining scalable TypeScript monorepo architectures using npm workspaces, with proper package management, dependency resolution, and build optimization.

## Core Architecture

### Monorepo Structure
```
asgard-unified/
├── package.json                 # Root package.json with workspaces
├── tsconfig.json               # Root TypeScript configuration
├── .gitignore
├── .npmrc
├── apps/                       # Applications
│   ├── desktop-os/            # Main Tauri application
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── src/
│   └── print-studio/          # Print design application
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
├── packages/                   # Shared packages
│   ├── shared/                # Core shared utilities
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── types/
│   │   │   ├── stores/
│   │   │   └── constants/
│   │   └── index.ts
│   └── ui-kit/                # Shared UI components
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
└── tools/                      # Development tools
    ├── build-scripts/
    └── generators/
```

### Root Configuration
```json
// package.json
{
  "name": "asgard-unified",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev:desktop": "npm run dev --workspace=apps/desktop-os",
    "dev:print": "npm run dev --workspace=apps/print-studio",
    "build": "npm run build --workspaces --if-present",
    "build:desktop:win": "npm run build:win --workspace=apps/desktop-os",
    "build:desktop:linux": "npm run build:linux --workspace=apps/desktop-os",
    "lint": "eslint . --ext .ts,.tsx",
    "typecheck": "npm run typecheck --workspaces --if-present",
    "clean": "npm run clean --workspaces --if-present && rm -rf node_modules",
    "test": "npm run test --workspaces --if-present",
    "postinstall": "npm run build:shared",
    "build:shared": "npm run build --workspace=packages/shared"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "typescript": "^5.0.0",
    "prettier": "^3.0.0"
  }
}
```

### TypeScript Project References
```json
// tsconfig.json (Root)
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@asgard/shared": ["packages/shared/src"],
      "@asgard/shared/*": ["packages/shared/src/*"],
      "@asgard/ui-kit": ["packages/ui-kit/src"],
      "@asgard/ui-kit/*": ["packages/ui-kit/src/*"]
    }
  },
  "references": [
    { "path": "./packages/shared" },
    { "path": "./packages/ui-kit" },
    { "path": "./apps/desktop-os" },
    { "path": "./apps/print-studio" }
  ],
  "exclude": ["node_modules", "dist", "build"]
}
```

## Package Management

### Shared Package Configuration
```json
// packages/shared/package.json
{
  "name": "@asgard/shared",
  "version": "1.0.0",
  "private": true,
  "description": "Shared types, stores, and constants for ASGARD ecosystem",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./types": {
      "import": "./dist/types/index.js",
      "types": "./dist/types/index.d.ts"
    },
    "./stores": {
      "import": "./dist/stores/index.js",
      "types": "./dist/stores/index.d.ts"
    },
    "./constants": {
      "import": "./dist/constants/index.js",
      "types": "./dist/constants/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "clean": "rm -rf dist",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "zustand": "^5.0.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/uuid": "^9.0.0"
  },
  "peerDependencies": {
    "react": ">=18.0.0"
  },
  "files": [
    "dist/**/*"
  ]
}
```

### Application Package Configuration
```json
// apps/desktop-os/package.json
{
  "name": "igo-desktop",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --ext .ts,.tsx",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build"
  },
  "dependencies": {
    "@asgard/shared": "workspace:*",
    "@tauri-apps/api": "^2.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.1",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "@tauri-apps/cli": "^2.0.0"
  }
}
```

## Build System Configuration

### Vite Configuration with Workspace Support
```typescript
// apps/desktop-os/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@shared': resolve(__dirname, '../../packages/shared/src'),
      '@shared/types': resolve(__dirname, '../../packages/shared/src/types'),
      '@shared/stores': resolve(__dirname, '../../packages/shared/src/stores'),
      '@shared/constants': resolve(__dirname, '../../packages/shared/src/constants'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: ['@tauri-apps/api'],
    },
  },
  server: {
    port: 3000,
  },
});
```

### TypeScript Build Configuration
```json
// packages/shared/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "dist",
    "node_modules"
  ]
}
```

## Dependency Management Strategies

### Version Management with npm Workspaces
```bash
# Install dependencies for all packages
npm install

# Add dependency to specific workspace
npm install lodash --workspace=packages/shared

# Add dependency to all workspaces
npm install --ws lodash

# Add dev dependency
npm install --save-dev --ws @types/lodash

# Remove dependency
npm uninstall lodash --workspace=packages/shared

# Check for outdated dependencies
npm outdated --ws

# Update dependencies
npm update --ws
```

### Dependency Constraints
```json
// .npmrc
save-exact=true
legacy-peer-deps=false
auto-install-peers=true
```

### Package Scripts Coordination
```json
// Root package.json scripts
{
  "scripts": {
    "dev": "concurrently \"npm run dev:shared\" \"npm run dev:desktop\" \"npm run dev:print\"",
    "dev:shared": "npm run dev --workspace=packages/shared",
    "build:all": "npm run build:shared && npm run build --workspaces --if-present",
    "test:all": "npm run test --workspaces --if-present",
    "lint:all": "npm run lint --workspaces --if-present",
    "typecheck:all": "npm run typecheck --workspaces --if-present"
  }
}
```

## Type Safety Across Packages

### Shared Type Definitions
```typescript
// packages/shared/src/types/index.ts
export interface Product {
  id: string;
  sku: string;
  designation: string;
  description?: string;
  price: number;
  cost?: number;
  categoryId: string;
  stockQuantity: number;
  minStock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  customerId?: string;
  items: SaleItem[];
  payments: Payment[];
  total: number;
  tax: number;
  discount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  userId: string;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  price: number;
  discount: number;
}
```

### Cross-Package Type Imports
```typescript
// apps/desktop-os/src/components/POS/ProductSelector.tsx
import { Product } from '@shared/types';
import { useProductsStore } from '@shared/stores';

export const ProductSelector: React.FC = () => {
  const { products, addProduct } = useProductsStore();
  
  const handleProductSelect = (product: Product) => {
    addProduct(product);
  };
  
  // Component implementation
};
```

## Development Workflow

### Hot Reload in Development
```typescript
// packages/shared/src/stores/index.ts
import { create } from 'zustand';

// Enable HMR for development
if (import.meta.hot) {
  import.meta.hot.accept(acceptNewModule => {
    // Re-initialize stores when they change
    const newStore = acceptNewModule?.default;
    if (newStore) {
      // Store rehydration logic
      console.log('Store updated');
    }
  });
}

export { useProductsStore } from './productsStore';
export { useSalesStore } from './salesStore';
export { useTreasuryStore } from './treasuryStore';
```

### Development Scripts
```bash
#!/bin/bash
# scripts/dev.sh

echo "Starting ASGARD development environment..."

# Build shared package first
echo "Building shared package..."
npm run build:shared

# Start development servers
echo "Starting development servers..."
concurrently \
  "npm run dev:shared -- --watch" \
  "npm run dev:desktop" \
  "npm run dev:print"

echo "Development environment started!"
```

## Testing Across Workspaces

### Jest Configuration for Monorepo
```javascript
// jest.config.js
module.exports = {
  projects: [
    {
      displayName: 'shared',
      testMatch: ['<rootDir>/packages/shared/**/*.test.ts'],
      preset: 'ts-jest',
      testEnvironment: 'node',
    },
    {
      displayName: 'desktop-os',
      testMatch: ['<rootDir>/apps/desktop-os/**/*.test.tsx'],
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/apps/desktop-os/src/test/setup.ts'],
    },
    {
      displayName: 'print-studio',
      testMatch: ['<rootDir>/apps/print-studio/**/*.test.tsx'],
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/apps/print-studio/src/test/setup.ts'],
    },
  ],
  collectCoverageFrom: [
    'packages/shared/src/**/*.{ts,tsx}',
    'apps/*/src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
};
```

### Shared Test Utilities
```typescript
// packages/shared/src/test/utils.ts
import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';

// Test wrapper for hooks that use stores
export const createTestWrapper = (initialState?: any) => {
  return ({ children }: { children: ReactNode }) => {
    // Setup test providers here
    return <>{children}</>;
  };
};

// Utility for testing store actions
export const testStoreAction = async (
  storeHook: () => { actions: any },
  actionName: string,
  ...args: any[]
) => {
  const { result } = renderHook(() => storeHook());
  
  await act(async () => {
    await result.current.actions[actionName](...args);
  });
  
  return result.current;
};
```

## CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type checking
        run: npm run typecheck:all
      
      - name: Run linting
        run: npm run lint:all
      
      - name: Run tests
        run: npm run test:all
      
      - name: Build applications
        run: npm run build:all

  build-desktop:
    needs: test
    runs-on: ${{ matrix.os }}
    
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Setup Rust
        uses: dtolnay/rust-toolchain@stable
        with:
          toolchain: stable
      
      - name: Build desktop app
        working-directory: apps/desktop-os
        run: npm run tauri:build
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: desktop-app-${{ matrix.os }}
          path: apps/desktop-os/src-tauri/target/release/bundle/
```

## Performance Optimization

### Bundle Analysis
```javascript
// vite.analyze.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
    }),
  ],
});
```

### Lazy Loading Across Packages
```typescript
// apps/desktop-os/src/pages/LazyPages.tsx
import { lazy } from 'react';

// Lazy load heavy components
const POS = lazy(() => import('./POS/POS'));
const Reports = lazy(() => import('./Reports/Reports'));
const Inventory = lazy(() => import('./Inventory/Inventory'));

export const pages = {
  pos: POS,
  reports: Reports,
  inventory: Inventory,
};
```

## Troubleshooting Common Issues

### Dependency Resolution Problems
```bash
# Check for duplicate dependencies
npm ls --depth=0 --json | jq '.dependencies | keys | length'

# Clean and reinstall
npm run clean
rm -rf node_modules package-lock.json
npm install

# Check workspace resolution
npm ls @asgard/shared --depth=0
```

### TypeScript Path Resolution
```typescript
// Ensure proper path mapping in all tsconfig files
// packages/shared/tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["./src/*"],
    }
  }
}
```

### Build Order Issues
```json
// Ensure proper build order in root package.json
{
  "scripts": {
    "prebuild": "npm run build:shared",
    "build": "npm run build --workspaces --if-present"
  }
}
```

This comprehensive skill covers all aspects of TypeScript monorepo architecture needed for managing complex projects like GRAPHSHOP OS.
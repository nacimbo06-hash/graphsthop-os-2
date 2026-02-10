# 🏗️ ASGARD UNIFIED - Project Architecture

## Overview
This is the unified monorepo for the IGO Retail Management ecosystem.

## Structure

```
ASGARD UNIFIED/
├── apps/
│   ├── desktop-os/      # Main Electron application (POS, Inventory, Treasury)
│   └── print-studio/    # Specialized label design tool
├── packages/
│   ├── shared/          # Types, stores, constants (Source of Truth)
│   └── ui-kit/          # Reusable UI components
└── dev-docs/            # Audit logs, architecture docs, API specs
```

## Quick Start

```bash
# Install all dependencies (from root)
npm install

# Run the main desktop app
npm run dev:desktop

# Run the print studio
npm run dev:print

# Build for Windows 64-bit
npm run build:desktop:win
```

## Packages

### @asgard/shared
The central source of truth containing:
- **Types**: Product, Sale, Customer, Treasury interfaces
- **Stores**: Zustand state management (productsStore, salesStore, etc.)
- **Constants**: Routes, config values, i18n keys

### apps/desktop-os
Full-featured Electron application for retail management:
- Point of Sale (POS)
- Inventory Management
- Treasury & Cash Management
- Customer Relationship (CRM)
- Supplier Management
- AI-Powered Reports
- LAN Network Sync (Server/Client)

### apps/print-studio
Label design and printing tool:
- Barcode generation
- Product label templates
- Thermal printer integration

## Development

Each app can be developed independently:
```bash
cd apps/desktop-os && npm run dev
cd apps/print-studio && npm run dev
```

## Builds

### Windows x64 (Server)
```bash
npm run build:desktop:win
# Output: apps/desktop-os/dist/igo-desktop-1.0.0-x64-setup.exe
```

### Linux (Cashier/Client)
```bash
npm run build:desktop:linux
# Output: apps/desktop-os/dist/igo-desktop-1.0.0.AppImage
```

---

**Created**: February 2026
**Maintainer**: IGO Team

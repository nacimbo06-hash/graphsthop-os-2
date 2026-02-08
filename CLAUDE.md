# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GRAPHSHOP OS is an AI-native retail management ecosystem for Algerian supermarkets, print shops, and specialized retailers. It contains multiple sub-projects under one workspace.

## Repository Structure

| Directory | Description |
|-----------|-------------|
| `ASGARD UNIFIED/` | Main monorepo — the core product (Tauri + React desktop app) |
| `BONILO APP V1/` | Standalone Vite + React POS/management app (web-based, IndexedDB) |
| `BONILO BRAND/` | Brand identity assets (logos, guidelines, AI files) |
| `BONILO BRAND HTML/` | Brand guidelines as a static HTML site |
| `skills/` | Development skill guides (Markdown reference docs) |
| `LIVRABLE_PRODUCTION/` | Production deliverables (Mac/Windows builds) |

## ASGARD UNIFIED — Primary Codebase

### Architecture

Monorepo using npm workspaces (`apps/*`, `packages/*`):

- **`apps/desktop-os`** — Main Tauri v2 + React 19 desktop application (IGO Desktop)
- **`apps/print-studio`** — Label design and thermal printer tool
- **`packages/shared`** — Central source of truth: TypeScript types, Zustand stores, constants
- **`packages/ui-kit`** — Reusable UI components (placeholder)

### Build & Dev Commands (run from `ASGARD UNIFIED/`)

```bash
npm install                    # Install all workspace dependencies
npm run dev:desktop            # Run desktop-os dev server (Vite on port 5173)
npm run dev:print              # Run print-studio dev server
npm run build:desktop:win      # Build Windows x64 via Tauri
npm run build:desktop:linux    # Build Linux AppImage via Tauri
npm run build:desktop:mac      # Build macOS via Tauri
npm run lint                   # ESLint across all workspaces
npm run typecheck              # TypeScript check across all workspaces
```

### Desktop-OS Commands (run from `ASGARD UNIFIED/apps/desktop-os/`)

```bash
npm run dev                    # Vite dev server only (no Tauri shell)
npm run dev:tauri              # Full Tauri dev (Rust + Vite)
npm run build:tauri            # Production Tauri build
npm run build:tauri:debug      # Debug Tauri build
npm run test                   # Vitest run (single pass)
npm run test:watch             # Vitest watch mode
npm run test:coverage          # Vitest with coverage
npm run format                 # Prettier
npm run lint                   # ESLint
npm run typecheck              # tsc --noEmit
```

### Key Architectural Patterns

- **Provider stack**: `QueryClientProvider → SettingsProvider → DBProvider → SyncProvider → ToastProvider → Router`
- **Hash-based routing** with React Router v7 — all pages lazy-loaded via `React.lazy()` + Suspense
- **Zustand stores** in `packages/shared/stores/` with localStorage persistence middleware — these are the single source of truth for all state
- **Treasury stores** are in a subdirectory: `packages/shared/stores/treasury/` with a facade pattern (`useTreasuryFacade.ts`)
- **Role-based access control**: 5 roles (owner, manager, cashier, stock_manager, accountant) controlling access to 11 modules
- **Offline-first**: SQLite via Tauri SQL plugin (`igo-desktop.db`), with network sync for multi-PC setups
- **Vite chunk splitting**: vendor, charts (recharts), pdf (jspdf), router, state (zustand), ui (lucide) are separate chunks

### Path Aliases (tsconfig)

```
@/*           → ./src/renderer/src/*
@shared/*     → ../../packages/shared/*
@asgard/shared/* → ../../packages/shared/*
```

### Source Layout (`apps/desktop-os/src/renderer/src/`)

- `pages/` — Feature modules: Dashboard, POS, Treasury, Inventory, Customers, Suppliers, Reports, PrintCenter, Settings, Users, Help, Login, Onboarding
- `components/` — Reusable UI organized by: `ui/`, `layout/`, `feedback/`, `data-display/`, `domain/`, `animations/`, `form/`, `NetworkSync/`
- `services/` — Business logic: `ai/forecastingService.ts`, `printing/` (ESC-POS commands, receipt/label generators)
- `hooks/` — Custom hooks: useApi, useDebounce, useInterval, useLocalStorage, useMediaQuery, usePerformance
- `contexts/SettingsContext.tsx` — Global settings (formatCurrency, useTVA, usePOSSettings)
- `providers/` — DBProvider (SQLite init), SyncProvider (network sync)
- `i18n/` — French as primary language, Arabic support for product/customer names
- `styles/` — CSS variables theming, RTL support (`rtl.css`), animations

### Hub + Tabs Pattern

Feature pages follow a consistent pattern: `*Hub.tsx` renders tab navigation, with each tab as a separate component in a `tabs/` subdirectory. Example: `InventoryHub.tsx` → `tabs/ProductsList.tsx`, `tabs/StockAlerts.tsx`, etc.

## BONILO APP V1 — Standalone Web POS

A parallel implementation of the POS system using Vite + React 18 + Tailwind CSS + IndexedDB (via `idb`). Same feature set as ASGARD desktop-os but runs in-browser without Tauri.

```bash
cd "BONILO APP V1"
npm install
npm run dev       # Vite dev server
npm run build     # tsc && vite build
npm run preview   # Preview production build
```

- State management: Zustand stores in `src/core/stores/` (mirrors `packages/shared/stores/`)
- Types: `src/core/types/` (mirrors `packages/shared/types/`)
- Styling: Tailwind CSS with HSL-based CSS variable theme, class-based dark mode
- Database: IndexedDB via `idb` library (`src/lib/db.ts`, `src/services/dbService.ts`)

## Tech Stack Summary

| Layer | ASGARD Desktop | BONILO Web |
|-------|---------------|------------|
| Runtime | Tauri v2 (Rust) | Browser |
| React | 19.2 | 18.2 |
| Router | React Router v7 (hash) | React Router v6 |
| State | Zustand v5 | Zustand v4 |
| DB | SQLite (Tauri plugin) | IndexedDB (idb) |
| Styling | CSS Modules + variables | Tailwind CSS |
| Charts | Recharts | — |
| PDF | jsPDF + autotable | — |
| i18n | i18next | — |
| Testing | Vitest + Testing Library | — |
| Build | Vite 7 | Vite 5 |

## Design System Conventions

- **Dark mode first**: Deep `#0D0D12` backgrounds with glassmorphism (`backdrop-filter: blur(16px)`)
- **Color grammar**: Green = Operational, Purple = AI-Powered, Cyan = Analytical
- **Accents**: Electric Blue, Neon Purple, Emerald Green for action states
- **Icons**: Lucide React throughout
- **Animations**: Framer Motion (motion library) for page transitions and micro-interactions

## Domain-Specific Context

- Target market is **Algerian retail** — product categories, brands, and naming conventions are Algeria-specific
- Product naming follows: `[MARQUE] + [NATURE] + [VARIÉTÉ] + [QUANTITÉ]` (e.g., `CANDIA Lait UHT Demi-Ecrémé 1L`)
- Brand names in UPPERCASE for readability
- Receipt printing must handle 20-40 character width limits (thermal printers) — standard abbreviation table exists in `PRODUCT_NAMING_BEST_PRACTICES.md`
- Payment methods: Cash, CIB, Dahabia, Credit
- Currency and TVA (tax) are configurable per store
- Multi-language: French primary UI, Arabic support for customer/product names, RTL stylesheet available

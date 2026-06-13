# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GRAPHSHOP OS is an offline-first retail management app for Algerian supermarkets — cashier checkout, inventory/FEFO, cash/treasury, suppliers, customer credit, and thermal receipt/label printing. French primary UI with Arabic support.

## Repository Structure

The workspace root is `GRAPHSHOP OS/`. The actual product is the **`bonilo/`** monorepo; everything else is supporting material.

| Path | Description |
|------|-------------|
| `bonilo/` | The product — Tauri v2 + React 19 monorepo (npm workspaces). **All app work happens here.** |
| `BONILO BRAND/` | Brand identity assets (logos, guidelines) |
| `_docs/` | Strategy, research, and overview documents |
| `skills/` | Markdown reference/skill guides |
| `_ARCHIVE_LEGACY/` | Abandoned earlier attempts — **git-ignored**, do not use |

## `bonilo/` — The Monorepo

### Architecture

npm workspaces (`apps/*`, `packages/*`):

- **`apps/desktop`** — Main Tauri v2 + React 19 desktop app (`@bonilo/desktop`). React renderer in `src/renderer/src/`, Rust shell in `src-tauri/`.
- **`apps/print-studio`** — Label design / thermal printer tool.
- **`packages/shared`** — Central source of truth: TypeScript types, Zustand stores, and the SQLite data layer (`db/`).

### Build & Dev Commands (run from `bonilo/`)

```bash
npm install                 # Install all workspace dependencies
npm run dev:desktop         # Desktop renderer dev server (Vite, no Tauri shell)
npm run dev:print           # print-studio dev server
npm run build:desktop:win   # Build Windows x64 via Tauri
npm run typecheck           # tsc --noEmit across all workspaces
npm run lint                # ESLint across all workspaces
```

### Desktop Commands (run from `bonilo/apps/desktop/`)

```bash
npm run dev          # Vite dev server only (browser, no Tauri)
npm run dev:tauri    # Full Tauri dev (Rust + Vite)
npm run build:tauri  # Production Tauri build
npm run test         # Vitest run (single pass)
npm run test:watch   # Vitest watch mode
npm run typecheck    # tsc --noEmit
```

### Data Layer

- **SQLite via `@tauri-apps/plugin-sql`**, database `sqlite:bonilo.db` (preloaded in `tauri.conf.json`, stored under the app config dir). WAL mode, `foreign_keys = ON`.
- **Repository pattern** in `packages/shared/db/` (`database.ts` + `*Repo.ts`). Stores hydrate from these repos when running under Tauri, and fall back to `localStorage` in plain-browser dev mode (`isTauri()` guard).
- **Migrations** run via `PRAGMA user_version` in `database.ts`.
- **Architectural direction:** multi-write money flows (checkout, goods receipt, treasury, session close, credit payment) are being moved into Rust `#[tauri::command]`s for true atomic transactions — `db.transaction()` over the plugin's connection pool is not atomic. Reads stay on plugin-sql `select()`. See the active plan in `~/.claude/plans/`.

### Key Architectural Patterns

- **Provider stack**: `QueryClientProvider → SettingsProvider → DBProvider → SyncProvider → ToastProvider → Router`
- **Hash-based routing** (React Router v7) — pages lazy-loaded via `React.lazy()` + Suspense
- **Zustand stores** in `packages/shared/stores/` — single source of truth for UI state; treasury stores live in `stores/treasury/` behind a facade (`useTreasuryFacade.ts`)
- **Role-based access control**: roles (owner, manager, cashier, stock_manager, accountant) gating modules
- **Thermal printing**: ESC/POS bytes generated in JS, sent to a serial printer via Rust commands (`src-tauri/src/printer.rs`); WebUSB / `window.print()` fallbacks in-browser

### Path Aliases (tsconfig / vitest)

```
@/*              → apps/desktop/src/renderer/src/*
@shared/*        → packages/shared/*
@bonilo/shared   → packages/shared        (also @bonilo/shared/*)
@asgard/shared   → packages/shared        (legacy alias, same target)
```

### Source Layout (`apps/desktop/src/renderer/src/`)

- `pages/` — Feature modules: Dashboard, POS, Treasury, Inventory, Customers, Suppliers, Reports, PrintCenter, Settings, Users, Help, Login, Onboarding
- `components/` — `ui/`, `layout/`, `feedback/`, `data-display/`, `domain/`, `animations/`, `form/`, `NetworkSync/`
- `services/` — printing (`printing/` ESC-POS commands + receipt/label generators), `tauriPrinterService.ts`
- `contexts/SettingsContext.tsx` — global settings (formatCurrency, useTVA, usePOSSettings)
- `providers/` — DBProvider (SQLite init), SyncProvider (network sync — currently a mock)
- `i18n/` — French primary, Arabic support
- `styles/` — CSS variable theming, RTL support (`rtl.css`)

### Hub + Tabs Pattern

Feature pages use `*Hub.tsx` for tab navigation, with each tab a component in a `tabs/` subdirectory. Example: `InventoryHub.tsx` → `tabs/ProductsList.tsx`, `tabs/StockAlerts.tsx`.

## Testing

- **Vitest** (jsdom) from `apps/desktop`. Config (`vitest.config.ts`) includes both `src/**` and `../../packages/shared/**` test files. Setup in `src/test/setup.ts` mocks `localStorage`, `crypto`, and defaults the env to Tauri-like (`window.__TAURI_INTERNALS__`).
- Integration tests under `src/test/integration/` mock the SQL plugin with `better-sqlite3` (single-connection) — note this does **not** reproduce the plugin's pooled-connection transaction behavior.

## Design System Conventions

- **Dark mode first**: deep `#0D0D12` backgrounds with glassmorphism (`backdrop-filter: blur(16px)`)
- **Color grammar**: Green = Operational, Purple = AI-Powered, Cyan = Analytical
- **Icons**: Lucide React; **Animations**: Framer Motion (`motion`)

## Domain-Specific Context

- Target market is **Algerian retail** — categories, brands, and naming are Algeria-specific
- Product naming: `[MARQUE] + [NATURE] + [VARIÉTÉ] + [QUANTITÉ]` (e.g. `CANDIA Lait UHT Demi-Ecrémé 1L`), brand names UPPERCASE
- Receipt printing handles 20–40 char width limits (thermal); abbreviation table in `_docs/PRODUCT_NAMING_BEST_PRACTICES.md`
- Payment methods: Cash, CIB, Dahabia, Credit
- Currency and TVA (tax) are configurable per store
- Multi-language: French primary UI, Arabic for customer/product names, RTL stylesheet available

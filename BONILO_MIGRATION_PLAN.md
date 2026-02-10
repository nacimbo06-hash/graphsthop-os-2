# 🟢 BONILO — Complete Migration & Evolution Plan

> **From ASGARD to Bonilo: The Full Blueprint**  
> **Last Updated**: February 10, 2026  
> **Status**: 🏗️ Phase A Complete — Ready for Phase B

---

## 🧭 What Is Bonilo?

> **bonilo** is a **Local-First, Offline-Ready POS System** for Algerian neighborhood grocery stores.  
> It runs on **Tauri v2** (native webview, ~15MB), stores data in **SQLite with WAL mode**,  
> and — in Phase B — gains **Algorithmic Intelligence** for demand forecasting and reorder optimization.

| Attribute | Value |
|:---|:---|
| **Target User** | Owner-operator of a 50–500m² grocery store |
| **Language** | French (primary), Arabic RTL (secondary) |
| **Hardware** | Low-spec Windows 10/11 PC, thermal printer, barcode scanner |
| **Currency** | DZD (Dinar Algérien) |
| **Connectivity** | Offline-first; cloud sync on-demand |

---

## 📊 Phase Tracker

| Phase | Name | Status | Description |
|:---:|:---|:---:|:---|
| **0** | 🎨 Identity Transformation | ✅ **DONE** | Rename + Rebrand to Bonilo |
| **A** | 🗄️ Data Architecture | ✅ **DONE** | SQLite schema, migrations, store rewiring |
| **B** | 🧠 Algorithmic Intelligence | ⏳ **NEXT** | Forecasting, ABC analysis, daily briefing |
| **C** | 🧹 Stability & Polish | 📋 Planned | Error boundaries, logging, edge cases |
| **D** | 📦 Build & Deploy | 📋 Planned | CI/CD, auto-updates, Windows installer |

---

## ✅ Phase 0: Identity Transformation — COMPLETE

### What Changed

| Item | Before | After |
|:---|:---|:---|
| Project Root | `ASGARD UNIFIED/` | `bonilo/` |
| Desktop App | `apps/desktop-os/` | `apps/desktop/` |
| Root Package | `asgard-unified` | `bonilo-monorepo` |
| Desktop Package | `igo-desktop` | `@bonilo/desktop` |
| Shared Package | `@asgard/shared` | `@bonilo/shared` *(alias added)* |
| Tauri Product | `IGO Desktop` | `bonilo` |
| Bundle ID | `dz.igo.desktop` | `com.bonilo.pos` |
| Window Title | `IGO - Gestion Commerciale` | `Bonilo POS` |
| APP_NAME const | `'IGO'` | `'bonilo'` |
| Primary Color | `#3b82f6` (Blue) | `#3D7C4F` (Green) |
| Background | `#0f172a` (Dark Navy) | `#FDFBF7` (Warm Cream) |
| Accent | `#f59e0b` (Amber) | `#E8A05D` (Soft Amber) |
| Font | `Inter` | `Nunito` |
| Theme Color | `#00D177` | `#3D7C4F` |
| DB File | `igo-desktop.db` | `bonilo.db` |
| Google Fonts | *(none)* | `Nunito` + `DM Sans` |

### Files Modified
- `package.json` (root)
- `apps/desktop/package.json`
- `packages/shared/package.json`
- `packages/shared/constants/index.ts`
- `apps/desktop/src-tauri/tauri.conf.json`
- `apps/desktop/index.html`
- `apps/desktop/src/renderer/src/styles/variables.css`
- `apps/desktop/vite.config.ts`
- `apps/desktop/tsconfig.json`

### Files Deleted
- 🗑️ `electron-builder.yml`
- 🗑️ `test-electron.js`
- 🗑️ `out/` directory

---

## ✅ Phase A: Data Architecture — COMPLETE

### The Problem
Data was stored as **JSON blobs in localStorage** via Zustand's `persist` middleware.  
This meant:
- 🔴 Data loss on cache clear
- 🔴 No relational integrity (orphaned sale items)
- 🔴 No audit trail for stock movements
- 🔴 No complex queries possible (top sellers, margin analysis)

### The Solution
A strict **relational SQLite schema** with:
- **WAL Mode** for crash-safe writes
- **Migration Runner** (`PRAGMA user_version` based)
- **Transaction Support** for atomic sale recording
- **Repository Pattern** bridging DB ↔ Zustand

### Schema Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────────┐
│   products   │◄────│  sale_items   │────►│        sales         │
│              │     │              │     │                      │
│ id           │     │ product_id   │     │ id                   │
│ barcode      │     │ sale_id      │     │ receipt_number       │
│ name         │     │ quantity     │     │ total_amount         │
│ category     │     │ unit_price   │     │ payment_method       │
│ selling_price│     │ cost_at_sale │     │ cashier_id           │
│ stock        │     └──────────────┘     └──────────────────────┘
│ min_stock    │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ inventory_movements  │
│                      │
│ product_id           │
│ type (sale/restock)  │
│ qty_change           │
│ stock_after          │
│ reference_id         │
└──────────────────────┘

Also: customers, suppliers, cash_sessions, expenses, settings, users
```

### Files Created
- `services/db/database.ts` — Core DB service with migration runner
- `services/db/productsRepo.ts` — Product CRUD + stock transactions
- `services/db/salesRepo.ts` — Atomic sale recording
- `services/db/index.ts` — Barrel export
- `services/db/migrations/001_initial_schema.sql` — Full schema

### Files Modified
- `packages/shared/stores/productsStore.ts` — Removed `persist`, added `hydrate()`
- `packages/shared/stores/salesStore.ts` — Removed `persist`, added `hydrate()`
- `providers/DBProvider.tsx` — Uses new `db.init()` + store hydration
- `App.tsx` — Removed dead `mockData` import

### Architecture Pattern

```
┌─────────────────────────────────────────────┐
│                  React UI                    │
│  (Components read from Zustand stores)       │
├─────────────────────────────────────────────┤
│              Zustand Stores                  │
│  (In-memory cache, hydrated from DB)         │
│  products: Product[]  |  sales: Sale[]       │
├─────────────────────────────────────────────┤
│            Repository Layer                  │
│  productsRepo  |  salesRepo                  │
│  (Maps DB rows ↔ domain models)              │
├─────────────────────────────────────────────┤
│           BoniloDatabase Service             │
│  (WAL, migrations, transactions)             │
├─────────────────────────────────────────────┤
│         SQLite via tauri-plugin-sql           │
│              bonilo.db                        │
└─────────────────────────────────────────────┘
```

---

## ⏳ Phase B: Algorithmic Intelligence — NEXT

> **Goal**: Make the app *think* about the store owner's business.

### Planned Features

| Feature | Description | Priority |
|:---|:---|:---:|
| 🔮 **Demand Forecasting** | 7-day demand prediction per product using Algerian calendar multipliers (Ramadan, Friday couscous, salary periods) | 🔥 |
| 📊 **ABC Analysis** | Classify products into A/B/C tiers by revenue contribution for smart reordering | ⚡ |
| 💰 **Margin Insights** | Real-time margin calculation per product, per sale line | ⚡ |
| 🚨 **Anomaly Detection** | Z-score based alerting for unusual sales patterns | 📌 |
| 📋 **Daily Briefing** | One-screen summary of what happened yesterday + what to do today | 🔥 |
| 🏷️ **Smart Reorder Points** | Dynamic min_stock based on actual velocity, not guesswork | 📌 |

### Data Source
All intelligence powers from the **real sales data** now captured in SQLite:
- `sale_items` × `products` → Revenue, velocity, margins
- `inventory_movements` → Stock patterns
- Algerian calendar → Ramadan, salary periods, Friday couscous

### Existing Code to Connect
- `services/ai/forecastingService.ts` — 479-line engine with Algerian multipliers
- Currently uses `generateMockHistory()` — needs rewiring to `salesRepo`

---

## 📋 Phase C: Stability & Polish — PLANNED

| Task | Description |
|:---|:---|
| 🛡️ Error Boundaries | Wrap each module in React error boundaries |
| 📝 Logging | Structured logging to file for debugging |
| 🔄 Store Migration | Migrating remaining stores (customers, treasury) to DB |
| 🧪 Testing | Unit tests for repos, integration tests for sale flow |
| 🌐 i18n Audit | Ensure all strings are in translation files |

---

## 📦 Phase D: Build & Deploy — PLANNED

| Task | Description |
|:---|:---|
| 🏗️ CI/CD | GitHub Actions for Windows `.msi` builds |
| 🔄 Auto-Update | Tauri updater plugin for OTA updates |
| 📦 Installer | NSIS-based Windows installer with shortcuts |
| 🧹 Code Signing | Sign `.exe` for Windows SmartScreen |

---

## 🔧 Developer Quick Reference

### How to Run
```bash
cd bonilo/apps/desktop
npm install
npm run dev          # Vite dev server (browser)
npm run dev:tauri    # Tauri native window
```

### How to Build
```bash
npm run build:tauri           # Production build for current OS
npm run build:win             # Cross-compile for Windows
```

### Project Structure
```
bonilo/
├── apps/
│   ├── desktop/              # Main Tauri + React app
│   │   ├── src/renderer/src/ # React source
│   │   │   ├── services/db/  # 🆕 SQLite layer
│   │   │   ├── services/ai/  # Forecasting engine
│   │   │   ├── pages/        # Route components
│   │   │   ├── providers/    # DBProvider, SyncProvider
│   │   │   └── styles/       # CSS variables
│   │   └── src-tauri/        # Rust backend
│   └── print-studio/         # Receipt/label designer
├── packages/
│   └── shared/               # @bonilo/shared
│       ├── stores/           # Zustand stores (hydrated from DB)
│       ├── types/            # TypeScript interfaces
│       └── constants/        # App-wide constants
└── skills/                   # Developer guide documents
```

---

> **Next Action**: Execute Phase B — connect `forecastingService.ts` to real `sale_items` data and build the Daily Briefing dashboard widget.

---

*Last Updated: February 10, 2026 | Maintainer: Bonilo Team*

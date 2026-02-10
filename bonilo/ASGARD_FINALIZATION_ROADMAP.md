# 🏗️ ASGARD UNIFIED — Finalization Roadmap
## From First Principles: What Must Be True for This App to Be "Production-Ready"

> **Date**: February 10, 2026  
> **Methodology**: First Principles Thinking — strip away assumptions, identify what's actually working vs. what's scaffolding, and define the minimum path to a shippable product.

---

## 1. First Principles: What IS This App?

Before listing tasks, let's answer the irreducible question: **What problem does this app solve?**

| Question | Answer |
|:---|:---|
| **Who is the user?** | Algerian supermarket owner/manager/cashier |
| **What do they need?** | Fast checkout (POS), inventory control, cash tracking, supplier management, receipts/labels | AI or algorithmic prevision and forcasting and reports
| **What environment?** | Desktop (Windows primary, Linux secondary), unreliable internet, thermal printers, barcode scanners |
| **What makes it "done"?** | A user can install it, onboard their store, add products, sell them, track cash, print receipts, and trust the data persists across restarts and crashes |

**The irreducible requirements are:**
1. **Data must not be lost** — persistence must be real, not localStorage
2. **Core workflows must complete end-to-end** — POS → sale recorded → stock decremented → cash updated → receipt printable
3. **App must start, run, and close without errors** — no crashes, no blank screens, no phantom states
4. **App must be installable and updatable** — real build artifacts, real installer, real update path

---

## 2. Current State: Honest Assessment

### 2.1 Architecture Overview (What's Good ✅)

```
ASGARD UNIFIED/
├── apps/
│   ├── desktop-os/          # 353 files — Main Tauri v2 + React 19 app
│   └── print-studio/        # 27 files — Label design tool
├── packages/
│   ├── shared/              # 34 files — Types, stores, constants (SSOT)
│   └── ui-kit/              # ⚠️ EMPTY — placeholder only
```

| What Works | Status |
|:---|:---|
| Monorepo structure (npm workspaces) | ✅ Clean |
| TAURI LATEST + Vite 7 + TypeScript | ✅ Modern stack |
| 13 pages with lazy loading + code splitting | ✅ Good architecture |
| Auth flow (login → protected routes → onboarding) | ✅ Functional |
| Provider stack (Query → Settings → DB → Sync → Toast → Router) | ✅ Proper pattern |
| Zustand stores in shared package (SSOT) | ✅ Good separation |
| Treasury facade pattern (4 sub-stores) | ✅ Well architected |
| Design system (dark mode, glassmorphism, CSS variables) | ✅ Premium feel |
| Printing services (ESC/POS, receipt/label generators) | ✅ Advanced |
| Role-based access control (5 roles, 11 modules) | ✅ Enterprise-grade |
| i18n support (French primary, Arabic secondary) | ✅ Market-appropriate |

### 2.2 Critical Issues (What's Broken/Missing ❌)

#### 🔴 SEVERITY: CRITICAL — App will lose data or crash

| # | Issue | Details |
|:---|:---|:---|
| C1 | **Data persistence is fake** | Zustand stores persist to `localStorage`, NOT SQLite. `dbService.ts` exists but stores all data as JSON blobs in TEXT columns — no relational schema, no indexes, no foreign keys. If localStorage is cleared, ALL data is gone. |
| C2 | **Dual DB confusion** | `package.json` includes both `dexie` (IndexedDB wrapper) AND `@tauri-apps/plugin-sql` (SQLite). No clear decision on which is primary. `DBProvider.tsx` initializes Tauri SQL but stores don't actually use it for reads. |
| C3 | **No schema migrations** | `dbService.ts` creates tables with `CREATE TABLE IF NOT EXISTS` but has no migration strategy. Schema changes in updates will silently fail or corrupt data. |
| C4 | **Near-zero test coverage** | `src/test/` contains only `setup.ts` and a README. `services/__tests__/` has 2 files. No component tests, no integration tests, no E2E tests. |
| C5 | **Mock data still wired in** | `App.tsx` imports `seedMockData` (commented out but imported). `data/mockData.ts` still exists. Risk of accidental seeding. |

#### 🟠 SEVERITY: HIGH — App can't be deployed properly

| # | Issue | Details |
|:---|:---|:---|
| H1 | **Electron/Tauri identity crisis** | Both `electron-builder.yml` AND `src-tauri/tauri.conf.json` exist. `out/` directory (Electron build output) AND `dist/` (Tauri build output) both present. README says "Electron," `CLAUDE.md` says "Tauri." |
| H2 | **No CI/CD pipeline** | `.github/` directory exists but no Actions workflow. Builds are manual only. |
| H3 | **No auto-update mechanism** | `electron-builder.yml` references `https://igo.dz/auto-updates` but no Tauri updater plugin configured. |
| H4 | **No error boundaries** | No React error boundaries found. A crash in any lazy-loaded page will white-screen the entire app. |
| H5 | **Security: JWT + bcrypt in front-end** | `jsonwebtoken` and `bcryptjs` in browser-side dependencies. Auth should use Tauri's Rust backend for crypto, not JS in WebView. |
| H6 | **`packages/ui-kit` is empty** | Listed as a workspace but contains nothing. Components live scattered in `apps/desktop-os/src/renderer/src/components/`. |

#### 🟡 SEVERITY: MEDIUM — App works but is fragile

| # | Issue | Details |
|:---|:---|:---|
| M1 | **Duplicate types** | Types exist in both `packages/shared/types/` (6 files) AND `apps/desktop-os/src/renderer/src/shared/types/` (6 files). |
| M2 | **No SQLite WAL mode** | `dbService.ts` doesn't enable WAL (`PRAGMA journal_mode = WAL`). Write performance and crash recovery are compromised. |
| M3 | **No data backup/export** | No mechanism for users to backup or restore their store data. |
| M4 | **SyncProvider is 21KB** | `SyncProvider.tsx` at 21KB suggests a God-component doing too much. Likely mixing network sync logic, UI, and state. |
| M5 | **API services are stubs** | `api/services/` has 6 files (auth, products, sales, sync, treasury, tests) but no backend server exists to connect to. |
| M6 | **Reports service directory is empty** | `services/reports/` exists but is empty. |
| M7 | **`db/` directory is empty** | `src/renderer/src/db/` exists but is empty — suggests abandoned migration. |
| M8 | **Print-studio is separate app** | `apps/print-studio` has its own store but should share from `packages/shared`. Divergence risk. |

---

## 3. Comparison: What Production POS Apps Get Right

Based on industry research of production-grade POS systems (Square, Lightspeed, Loyverse, ERPLY):

| Capability | Industry Standard | ASGARD Current | Gap |
|:---|:---|:---|:---|
| **Data persistence** | Relational DB with proper schema, indexes, FK constraints, WAL mode | JSON blobs in SQLite + localStorage | 🔴 Critical |
| **Offline-first sync** | Outbox pattern, incremental delta sync, conflict resolution | SyncProvider exists but ties to non-existent backend | 🟠 Partial |
| **Test coverage** | >60% unit, E2E for checkout flow | ~0% | 🔴 Critical |
| **Error handling** | Error boundaries, retry logic, graceful degradation | No error boundaries found | 🟠 Missing |
| **Schema migrations** | Versioned migrations with rollback | None | 🔴 Critical |
| **Auto-updates** | OTA with rollback capability | Not configured | 🟠 Missing |
| **Data backup** | Export/import, scheduled backups | None | 🟠 Missing |
| **Hardware integration** | USB printer/scanner via native bridge | ESC/POS service exists, uses Tauri shell | 🟡 Partial |
| **Installer + signing** | Code-signed installers for each OS | Tauri build configured but not tested cross-platform | 🟡 Partial |
| **Logging + crash reports** | Structured logging, crash telemetry | No logging infrastructure | 🟠 Missing |

---

## 4. The Finalization Roadmap

### Phase 0: Cleanup & Decision-Making (Week 1)
> *Remove what shouldn't exist before building what should.*

- [ ] **P0.1** — **Decide: Tauri-only.** Remove `electron-builder.yml`, `test-electron.js`, and the `out/` directory. Update README to say Tauri.
- [ ] **P0.2** — **Remove mock data.** Delete `data/mockData.ts` and its import from `App.tsx`. Dead code = risk.
- [ ] **P0.3** — **Resolve type duplication.** Audit `shared/types/` inside `desktop-os` — deduplicate against `packages/shared/types/`. One source of truth.
- [ ] **P0.4** — **Clean empty directories.** Remove empty `packages/ui-kit/`, `services/reports/`, `src/renderer/src/db/`, `src/renderer/src/components/form/`.
- [ ] **P0.5** — **Remove Dexie.** Choose Tauri SQLite as the sole database. Remove `dexie` and `@types/dexie` from dependencies.
- [ ] **P0.6** — **Move JWT/bcrypt to Rust.** Remove `jsonwebtoken` and `bcryptjs` from frontend deps. Auth hashing/signing should happen in `src-tauri/src/`.

---

### Phase 1: Data Layer — Make It Real (Week 2–3)
> *If you can't trust the data, nothing else matters.*

- [ ] **P1.1** — **Design proper relational schema.** Replace JSON-blob tables with real columns, proper types, indexes, and foreign keys for: `products`, `sales`, `sale_items`, `customers`, `suppliers`, `purchase_orders`, `purchase_items`, `inventory_movements`, `cash_sessions`, `expenses`, `safe_transactions`, `sinking_funds`, `users`, `settings`.
- [ ] **P1.2** — **Enable WAL mode and PRAGMAs.** Add `PRAGMA journal_mode = WAL; PRAGMA synchronous = normal; PRAGMA foreign_keys = ON;` at init.
- [ ] **P1.3** — **Build a migration system.** Use `PRAGMA user_version` for tracking. Create a `migrations/` folder with numbered SQL scripts. Run sequentially on startup.
- [ ] **P1.4** — **Connect Zustand stores to SQLite.** Replace localStorage persistence middleware with actual SQLite read/write. Stores should load from SQLite on init and write-through on mutations.
- [ ] **P1.5** — **Add data backup/restore.** Implement SQLite file copy for backup. Add UI in Settings for manual backup and restore.
- [ ] **P1.6** — **Add data validation layer.** Validate all writes before they hit SQLite — required fields, type checks, range validations.

---

### Phase 2: Stability & Error Handling (Week 3–4)
> *The app must never white-screen.*

- [ ] **P2.1** — **Add React error boundaries.** Wrap each lazy-loaded page in an error boundary. Show friendly error + "reload module" button.
- [ ] **P2.2** — **Add global error handler.** Catch unhandled promise rejections and runtime errors. Log to file via Tauri.
- [ ] **P2.3** — **Add structured logging.** Create a `LogService` that writes to `logs/` directory via Tauri FS plugin. Levels: DEBUG, INFO, WARN, ERROR.
- [ ] **P2.4** — **Refactor SyncProvider.** Break `SyncProvider.tsx` (21KB) into: `SyncEngine` (logic), `SyncStatus` (UI component), `useSyncHook` (consumer API). Apply single-responsibility principle.
- [ ] **P2.5** — **Add loading/empty/error states to all pages.** Every page should handle: loading skeleton, empty state message, and error state with retry.

---

### Phase 3: Core Workflow Verification (Week 4–5)
> *Every critical path must work end-to-end, tested.*

- [ ] **P3.1** — **Map and test the POS flow.** Verify: scan/search product → add to cart → apply discount → select payment → finalize sale → stock decremented → cash session updated → receipt generated.
- [ ] **P3.2** — **Map and test the Inventory flow.** Verify: add product → set stock levels → receive goods → stock updated → low-stock alert triggered → expiry tracking works.
- [ ] **P3.3** — **Map and test the Treasury flow.** Verify: open cash session → record sales → add/withdraw cash → close session → daily totals match → safe transfer works.
- [ ] **P3.4** — **Map and test the Supplier flow.** Verify: add supplier → create purchase order → receive goods → stock updated → supplier debt tracked.
- [ ] **P3.5** — **Map and test the Customer flow.** Verify: add customer → associate with sale → purchase history visible → credit/debt tracking works.
- [ ] **P3.6** — **Write unit tests for stores.** Target: all Zustand stores in `packages/shared/stores/`. Minimum 80% coverage on business logic.
- [ ] **P3.7** — **Write E2E test for POS checkout.** Use Vitest + Testing Library for the full checkout flow.

---

### Phase 4: Build & Deployment Pipeline (Week 5–6)
> *If you can't install it, it doesn't exist.*

- [ ] **P4.1** — **Create GitHub Actions CI workflow.** On push/PR: lint → typecheck → test → build. Fail on any error.
- [ ] **P4.2** — **Test Tauri builds.** Build and test `.msi`/`.exe` (Windows), `.dmg` (macOS), `.AppImage` (Linux). Verify each installer works end-to-end.
- [ ] **P4.3** — **Configure Tauri updater plugin.** Enable auto-update checking. Define update server URL. Handle update-available UI.
- [ ] **P4.4** — **Code signing.** Set up code signing for Windows (EV cert) and macOS (Apple Developer). Users need trusted installers.
- [ ] **P4.5** — **Create release workflow.** On tag push: build all platforms → generate changelogs → create GitHub release with attached artifacts.
- [ ] **P4.6** — **Version management.** Sync versions across `package.json`, `tauri.conf.json`, and `Cargo.toml`. Single source for version number.

---

### Phase 5: Polish & UX Hardening (Week 6–7)
> *The difference between "works" and "feels right."*

- [ ] **P5.1** — **Keyboard shortcuts for POS.** F1-F4 for payment methods, Enter for finalize, Esc for cancel, Tab for next field. Cashiers don't use mice.
- [ ] **P5.2** — **Barcode scanner input handling.** Detect rapid sequential input (scanner sends keystrokes fast). Auto-add to cart when barcode detected.
- [ ] **P5.3** — **Print-studio integration.** Ensure print-studio shares types from `packages/shared`. Fix its independent store to use the shared store.
- [ ] **P5.4** — **Receipt print preview.** Show exactly what will print before sending to thermal printer.
- [ ] **P5.5** — **Settings validation.** Ensure all Settings page values persist and apply correctly. Test: currency format, TVA rate, store name, printer config.
- [ ] **P5.6** — **Performance audit.** Run Lighthouse on the app. Target: <2s initial load, <100ms page transition, <500ms product search on 3500+ items.
- [ ] **P5.7** — **RTL audit.** Verify Arabic product/customer names render correctly. Check all layouts with RTL stylesheet enabled.

---

### Phase 6: Documentation & Handoff (Week 7–8)
> *If no one can understand it, you can't maintain it.*

- [ ] **P6.1** — **Update README.** Accurate architecture diagram, correct build instructions, prerequisites list.
- [ ] **P6.2** — **Create USER_GUIDE.md.** Step-by-step for: first install → onboarding → adding products → first sale → end-of-day cash close.
- [ ] **P6.3** — **Create DEPLOYMENT_GUIDE.md.** How to: build for each OS, configure for a new store, perform data migration from legacy system.
- [ ] **P6.4** — **API documentation.** Document all Tauri commands (Rust ↔ Frontend IPC bridge).
- [ ] **P6.5** — **Clean CLAUDE.md.** Update to reflect actual architecture post-cleanup. Remove references to Electron.

---

## 5. Priority Matrix

```
                    URGENT                          NOT URGENT
              ┌─────────────────────────┬─────────────────────────┐
              │                         │                         │
   IMPORTANT  │  P0 (Cleanup)           │  P5 (Polish)            │
              │  P1 (Data Layer)        │  P6 (Documentation)     │
              │  P2 (Stability)         │                         │
              │                         │                         │
              ├─────────────────────────┼─────────────────────────┤
              │                         │                         │
   NOT        │  P4 (Build Pipeline)    │  Print-studio polish    │
   IMPORTANT  │                         │  AI Vision features     │
              │                         │  IoT/ESL integration    │
              │                         │                         │
              └─────────────────────────┴─────────────────────────┘
```

> **Key Insight**: The 2026 Strategic Roadmap mentions AI Vision, IoT sensors, and food-rescue ecosystems — but **none of these matter if the app loses data or crashes.** First principles say: make the foundation solid, then build upward.

---

## 6. Estimated Effort

| Phase | Effort | Complexity | Dependency |
|:---|:---|:---|:---|
| **P0: Cleanup** | 2–3 days | Low | None |
| **P1: Data Layer** | 5–7 days | High | P0 |
| **P2: Stability** | 3–4 days | Medium | P0 |
| **P3: Workflow Testing** | 5–7 days | High | P1, P2 |
| **P4: Build Pipeline** | 3–4 days | Medium | P0 |
| **P5: Polish** | 4–5 days | Medium | P3 |
| **P6: Documentation** | 2–3 days | Low | P5 |
| **Total** | **~6–8 weeks** | | |

---

## 7. What NOT To Do

> First principles thinking also means knowing what to cut.

| Temptation | Why Not |
|:---|:---|
| Build a backend server | Not needed for V1. Local-first SQLite is sufficient. Backend can come in V2. |

| Add more UI modules | 13 modules is already ambitious. Ship V1 with fewer, polished modules rather than more broken ones. |
| Switch to PGlite | Tauri SQLite is already configured and working. Don't change horses mid-stream. |
| Build a mobile version | Desktop-first. Mobile is a separate product decision. |
| Populate `packages/ui-kit` | Only extract shared components if print-studio actually needs them. Don't abstract prematurely. |

---

*This roadmap applies first-principles thinking: start from what the user actually needs (reliable POS for their supermarket), work backward to what must be true (data persistence, tested workflows, installable builds), and ignore everything that doesn't serve those truths.* 🎯

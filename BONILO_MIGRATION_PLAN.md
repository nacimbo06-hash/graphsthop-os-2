# 📦 BONILO — Migration, Branding & Core Architecture Plan

> **Date**: February 10, 2026
> **Objective**: Transform "ASGARD UNIFIED" into "bonilo" (production-ready v1.0), tailored for low-spec hardware (Celeron/4GB RAM).
> **Focus**: Data Integrity + Algorithmic AI + New Brand Identity.

---

## 1. Hardware Reality Check & Strategy

| Constraint | Impact on Strategy |
|:---|:---|
| **POS Node** (Celeron J1800, 4GB RAM) | **No Local LLM (Ollama).** Too heavy. AI must be 100% algorithmic (statistical). React frontend must be optimized (virtual lists, memoization). |
| **Server Node** (Core i5-7Y54, 8GB RAM) | Still too weak for Llama 3 (needs ~6GB VRAM for decent speed). **Focus on efficient SQLite queries & background sync.** |
| **No GPU** | UI animations must be CSS-based (transform/opacity), not heavy JS. Glassmorphism is okay but test blurring performance. |

---

## 2. Phase 0: Identity Transformation (Renaming & Branding)

**Goal**: Erase "Asgard" and "IGO". Implement "bonilo" visual identity.

- [ ] **0.1 Rename Project Structure**
    - Rename root folder: `ASGARD UNIFIED` → `BONILO_MONOREPO`
    - Rename app: `apps/desktop-os` → `apps/bonilo-desktop`
    - Update `package.json` names: `@asgard/shared` → `@bonilo/shared`

- [ ] **0.2 Update Identifiers & Configs**
    - `tauri.conf.json`:
        - `productName`: "bonilo"
        - `identifier`: "com.bonilo.pos"
        - `version`: "1.0.0"
    - `Cargo.toml`: Update package metadata
    - `electron-builder.yml`: **DELETE** (Tauri only)

- [ ] **0.3 Apply Brand Identity (Design System)**
    - **Colors** (CSS Variables in `globals.css`):
        - Primary Green: `#3D7C4F` (was Blue/Purple)
        - Warm Cream: `#FDFBF7` (Background primary)
        - Soft Amber: `#E8A05D` (Accent)
        - Text Dark: `#2C2C2C`
    - **Typography**:
        - Install `Nunito` (Primary) and `DM Sans` (Secondary)
        - Remove current font stack
    - **Logo & Assets**:
        - Replace `app-icon.png` with new "b" circle icon
        - Update Login screen logo
        - Update Sidebar logo

- [ ] **0.4 Remove "Ghost" Code**
    - Delete `data/mockData.ts`
    - Delete `src/test/setup.ts` (if unused)
    - Delete `services/reports/` (empty)
    - Delete `packages/ui-kit` (empty)

---

## 3. Phase A: Data Architecture (The Real Foundation)

**Goal**: Zero data loss. Real SQLite persistence.

- [ ] **A.1 Database Schema Design (SQLite)**
    - Create `migrations/001_initial_schema.sql`:
        - `products` (id, name, barcode, price, cost, stock, category_id, created_at)
        - `categories` (id, name, color)
        - `sales` (id, receipt_ref, total, payment_method, cashier_id, created_at)
        - `sale_items` (id, sale_id, product_id, qty, price_at_sale, cost_at_sale)
        - `cash_sessions` (id, cashier_id, open_amount, close_amount, opened_at, closed_at)
        - `settings` (key, value)
    - **Critical**: Use `TEXT` for ISO8601 dates, `INTEGER` for money (cents) or `REAL` (carefully).

- [ ] **A.2 Database Service Upgrade**
    - Implement `DatabaseService.ts` using `@tauri-apps/plugin-sql`
    - Enable **WAL Mode**: `PRAGMA journal_mode=WAL;` (Crucial for performance on HDD/slow SSD)
    - Implement migration runner on app startup.

- [ ] **A.3 Connect Zustand Stores**
    - Refactor `productsStore`, `salesStore`, `cartStore`, `settingsStore`.
    - **Read**: Load from SQLite on `useEffect` / `onMount`.
    - **Write**: Optimistic UI update → Async DB write.
    - Remove `persist` middleware (localStorage) entirely.

---

## 4. Phase B: Algorithmic Intelligence (The "Brain")

**Goal**: Smart forecasting *without* heavy AI. 100% Algorithmic.

- [ ] **B.1 Connect Forecasting to Real Data**
    - Modify `ForecastingEngine` in `forecastingService.ts`:
        - Remove `generateMockHistory()`
        - Inject `DatabaseService`
        - Query: `SELECT sum(qty) FROM sale_items WHERE product_id = ? GROUP BY date...`

- [ ] **B.2 Smart Reordering (ABC Analysis)**
    - Implement "ABC Class" calculation:
        - **A**: Top 20% products by revenue (Critical stock)
        - **B**: Next 30%
        - **C**: Bottom 50%
    - Logic: "If Product A stock < 3 days coverage → CRITICAL ALERT"

- [ ] **B.3 Category & Margin Insights**
    - Insight: "Category X margin dropped by 2% this week"
    - Insight: "Product Y is top seller but low margin -> Suggest Price Increase"

- [ ] **B.4 Anomaly Detection (Statistical)**
    - Z-Score implementation on *real* daily sales.
    - Alert: "Sales for Milk dropped 40% vs 4-week moving average."

- [ ] **B.5 The "Bonilo Assistant" Panel (No LLM)**
    - Instead of Chat, use a **"Daily Briefing"** dashboard:
        - "Bonjour [Manager]. Yesterday you sold X DA."
        - "Today is [Holiday/Event]? Multiplier active."
        - "3 Alerts: Milk low, Bread expiring, Cash gap."

---

## 5. Execution Order

1.  **Renaming & Branding** (Get the visual identity right immediately)
2.  **Database Migration System** (The skeleton)
3.  **Store Connection** (The muscles)
4.  **Forecasting Connection** (The brain)
5.  **Polishing** (Keyboard shortcuts, RTL tweaks)

---

## 6. Definition of Done (v1.0)

- [ ] App is named "bonilo".
- [ ] Brand colors/fonts/logos are applied.
- [ ] Data persists to `bonilo.db` (SQLite) surviving restarts.
- [ ] 10,000 products can be loaded without UI lag (virtualized lists).
- [ ] Forecasting works on real sales data.
- [ ] Installer builds for Windows (.msi/.exe).

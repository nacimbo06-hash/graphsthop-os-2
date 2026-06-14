//! Atomic goods receipt — one Tauri command, one SQLite transaction.
//!
//! Ports the JS goods-receipt flow (`purchasesRepo.createGoodsReceipt` +
//! `GoodsReceipt.tsx`'s renderer-side lot/treasury follow-ups) into a single
//! `pool.begin()` transaction, so the whole receiving event commits or rolls
//! back as one unit. Folds in the work the old flow scattered across three
//! non-atomic steps, and fixes the money bugs the audit flagged:
//!   * lot creation is pulled INTO the transaction (was a separate
//!     `lotsStore.addLot` after the receipt committed);
//!   * the **double cash deduction** is gone — the old path wrote BOTH a
//!     `'withdrawal'` (inside `createGoodsReceipt`) and an `'expense'` (the
//!     renderer's separate `addMovement`), draining the drawer twice; here a
//!     cash-paid receipt writes exactly ONE `cash_movements` row;
//!   * the missing **supplier-debt write** is added — an unpaid receipt now
//!     increments `suppliers.current_debt` (a DELTA), instead of debt only
//!     being re-derived in JS;
//!   * the `gr_number` is minted INSIDE the transaction (DB-derived sequence),
//!     so concurrent receipts can't collide on a number.

use serde::{Deserialize, Serialize};
use sqlx::{Connection, Pool, Row, Sqlite};
use uuid::Uuid;

use crate::db::sqlite_pool;
use crate::error::{AppError, AppResult};

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReceiveGoodsItem {
    pub product_id: String,
    #[serde(default)]
    pub product_name: String,
    #[serde(default)]
    pub product_barcode: String,
    #[serde(default)]
    pub product_emoji: String,
    #[serde(default)]
    pub ordered_qty: f64,
    pub received_qty: f64,
    #[serde(default)]
    pub purchase_price: f64,
    #[serde(default)]
    pub total: f64,
    #[serde(default)]
    pub unit: String,
    /// Explicit expiry for the lot, if known. Empty/absent falls back to
    /// `created_at + shelf_life_days` when the line is perishable.
    #[serde(default)]
    pub expiry_date: Option<String>,
    #[serde(default)]
    pub lot_number: Option<String>,
    /// Mirror of the renderer rule `line.expiryDate || product.isPerishable`:
    /// a lot is created when there is an expiry OR the product is perishable.
    #[serde(default)]
    pub is_perishable: bool,
    /// Fallback shelf life (days) when perishable but no explicit expiry.
    /// Defaults to 30, matching the renderer's `shelfLifeDays || 30`.
    #[serde(default)]
    pub shelf_life_days: Option<i64>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReceiveGoodsInput {
    pub items: Vec<ReceiveGoodsItem>,
    pub supplier_id: String,
    #[serde(default)]
    pub supplier_name: String,
    pub date: String,
    #[serde(default)]
    pub invoice_number: String,
    pub total: f64,
    #[serde(default)]
    pub po_id: Option<String>,
    /// Receipt status; defaults to "completed" (the renderer always sends this).
    #[serde(default)]
    pub status: Option<String>,
    pub is_paid: bool,
    /// "cash" or "safe". Absent ⇒ treated as unpaid (supplier debt).
    #[serde(default)]
    pub paid_from: Option<String>,
    /// Open cash session, required to record a cash payment. A cash-paid
    /// receipt with no open session falls back to supplier debt (the old UI
    /// surfaced this as a toast: "enregistré comme dette fournisseur").
    #[serde(default)]
    pub session_id: Option<String>,
    /// ISO timestamp written on every row, so stored rows match the in-memory
    /// receipt the renderer keeps (same convention as `checkout_sale`).
    pub created_at: String,
    #[serde(default)]
    pub created_by: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LotCreated {
    pub product_id: String,
    pub lot_id: String,
    pub quantity: f64,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ReceiveGoodsResult {
    pub receipt_id: String,
    pub gr_number: String,
    pub created_at: String,
    pub lots_created: Vec<LotCreated>,
    /// Amount added to the supplier's debt by this receipt (0 when fully paid).
    pub supplier_debt_delta: f64,
}

/// Tauri entry point. Resolves the plugin pool, then runs the receipt.
#[tauri::command]
pub async fn receive_goods(
    app: tauri::AppHandle,
    input: ReceiveGoodsInput,
) -> AppResult<ReceiveGoodsResult> {
    let pool = sqlite_pool(&app).await?;
    run_receive_goods(&pool, input).await
}

/// The transactional core, decoupled from Tauri for testing against a throwaway
/// pool (see the tests below).
pub async fn run_receive_goods(
    pool: &Pool<Sqlite>,
    input: ReceiveGoodsInput,
) -> AppResult<ReceiveGoodsResult> {
    if input.items.is_empty() {
        return Err(AppError::Invalid("a goods receipt needs at least one item"));
    }

    // FK ON before BEGIN — the pragma is a no-op inside a transaction and plugin
    // pool connections default to FK off (same dance as `checkout_sale`).
    let mut conn = pool.acquire().await?;
    sqlx::query("PRAGMA foreign_keys = ON;")
        .execute(&mut *conn)
        .await?;
    let mut tx = conn.begin().await?;

    // Supplier must exist — the receipt's stock, lots and (when unpaid) debt all
    // hang off it. Validating here also gives the renderer a typed error.
    let supplier_exists = sqlx::query("SELECT 1 FROM suppliers WHERE id = ?")
        .bind(&input.supplier_id)
        .fetch_optional(&mut *tx)
        .await?
        .is_some();
    if !supplier_exists {
        return Err(AppError::UnknownSupplier(input.supplier_id.clone()));
    }

    // Mint the GR number from the current max for this year, inside the tx.
    // Format `BE-YYYY-NNN` (matches the old `purchasesStore` minting).
    let year = year_of(&input.created_at);
    let glob = format!("BE-{}-[0-9]*", year);
    let next_num: i64 = sqlx::query(
        "SELECT COALESCE(MAX(CAST(SUBSTR(gr_number, 9) AS INTEGER)), 0) + 1 AS n
           FROM goods_receipts
          WHERE gr_number GLOB ?",
    )
    .bind(&glob)
    .fetch_one(&mut *tx)
    .await?
    .try_get::<i64, _>("n")?;
    let gr_number = format!("BE-{}-{:03}", year, next_num);

    let receipt_id = Uuid::new_v4().to_string();
    let status = input.status.clone().unwrap_or_else(|| "completed".to_string());

    // 1. Receipt header.
    sqlx::query(
        "INSERT INTO goods_receipts
            (id, gr_number, po_id, supplier_id, supplier_name, date, invoice_number,
             total, status, paid_from, is_paid, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(&receipt_id)
    .bind(&gr_number)
    .bind(input.po_id.clone().unwrap_or_default())
    .bind(&input.supplier_id)
    .bind(&input.supplier_name)
    .bind(&input.date)
    .bind(&input.invoice_number)
    .bind(input.total)
    .bind(&status)
    .bind(input.paid_from.clone().unwrap_or_default())
    .bind(input.is_paid as i64)
    .bind(&input.created_at)
    .execute(&mut *tx)
    .await?;

    let mut lots_created: Vec<LotCreated> = Vec::new();

    // 2. Lines: receipt item + stock increment + inventory movement + lot.
    for item in &input.items {
        if item.received_qty <= 0.0 {
            return Err(AppError::Invalid("received quantity must be greater than zero"));
        }

        sqlx::query(
            "INSERT INTO goods_receipt_items
                (id, gr_id, product_id, product_name, product_barcode, product_emoji,
                 ordered_qty, received_qty, purchase_price, total, expiry_date, lot_number, unit)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        )
        .bind(Uuid::new_v4().to_string())
        .bind(&receipt_id)
        .bind(&item.product_id)
        .bind(&item.product_name)
        .bind(&item.product_barcode)
        .bind(&item.product_emoji)
        .bind(item.ordered_qty)
        .bind(item.received_qty)
        .bind(item.purchase_price)
        .bind(item.total)
        .bind(item.expiry_date.clone().unwrap_or_default())
        .bind(item.lot_number.clone().unwrap_or_default())
        .bind(&item.unit)
        .execute(&mut *tx)
        .await?;

        // Current stock (also validates the product exists).
        let current_stock: f64 = match sqlx::query("SELECT stock FROM products WHERE id = ?")
            .bind(&item.product_id)
            .fetch_optional(&mut *tx)
            .await?
        {
            Some(row) => row.try_get::<f64, _>("stock")?,
            None => return Err(AppError::UnknownProduct(item.product_id.clone())),
        };
        let new_stock = current_stock + item.received_qty;

        sqlx::query("UPDATE products SET stock = ?, updated_at = ? WHERE id = ?")
            .bind(new_stock)
            .bind(&input.created_at)
            .bind(&item.product_id)
            .execute(&mut *tx)
            .await?;

        sqlx::query(
            "INSERT INTO inventory_movements
                (id, product_id, type, qty_change, stock_after, reason, reference_id, created_at)
             VALUES (?, ?, 'entry', ?, ?, '', ?, ?)",
        )
        .bind(Uuid::new_v4().to_string())
        .bind(&item.product_id)
        .bind(item.received_qty)
        .bind(new_stock)
        .bind(&gr_number)
        .bind(&input.created_at)
        .execute(&mut *tx)
        .await?;

        // Lot creation, folded in. Renderer rule: a lot exists when the line has
        // an expiry OR the product is perishable.
        let expiry_in = item.expiry_date.clone().unwrap_or_default();
        if !expiry_in.is_empty() || item.is_perishable {
            let shelf_days = item.shelf_life_days.unwrap_or(30);

            // Resolve the effective expiry (explicit, else created_at + shelf
            // days) and its whole-day distance from the receipt date, in SQL —
            // SUBSTR(_,1,10) takes the YYYY-MM-DD so the ISO 'Z'/millis don't
            // trip up SQLite's date parsing.
            let row = sqlx::query(
                "SELECT eff_expiry,
                        CAST(julianday(SUBSTR(eff_expiry, 1, 10)) - julianday(SUBSTR(?, 1, 10)) AS INTEGER) AS days
                   FROM (SELECT CASE WHEN ? <> '' THEN ?
                                     ELSE date(SUBSTR(?, 1, 10), '+' || ? || ' days')
                                END AS eff_expiry)",
            )
            .bind(&input.created_at)
            .bind(&expiry_in)
            .bind(&expiry_in)
            .bind(&input.created_at)
            .bind(shelf_days)
            .fetch_one(&mut *tx)
            .await?;
            let eff_expiry: String = row.try_get("eff_expiry")?;
            let days: i64 = row.try_get("days")?;
            let lot_status = expiry_status(days);

            let lot_id = Uuid::new_v4().to_string();
            let lot_number = item
                .lot_number
                .clone()
                .filter(|s| !s.is_empty())
                .unwrap_or_else(|| {
                    format!("LOT-{}-{}", last4(&gr_number), last4(&item.product_id))
                });

            sqlx::query(
                "INSERT INTO lots
                    (id, product_id, product_name, product_barcode, lot_number, batch_number,
                     quantity, original_quantity, expiry_date, received_date, supplier_id,
                     supplier_name, goods_receipt_id, purchase_price, status, days_remaining, created_at)
                 VALUES (?, ?, ?, ?, ?, '', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            )
            .bind(&lot_id)
            .bind(&item.product_id)
            .bind(&item.product_name)
            .bind(&item.product_barcode)
            .bind(&lot_number)
            .bind(item.received_qty)
            .bind(item.received_qty)
            .bind(&eff_expiry)
            .bind(&input.created_at)
            .bind(&input.supplier_id)
            .bind(&input.supplier_name)
            .bind(&gr_number)
            .bind(item.purchase_price)
            .bind(lot_status)
            .bind(days)
            .bind(&input.created_at)
            .execute(&mut *tx)
            .await?;

            sqlx::query(
                "INSERT INTO lot_movements
                    (id, lot_id, product_id, type, quantity, reason, reference, created_by, created_at)
                 VALUES (?, ?, ?, 'receipt', ?, ?, ?, ?, ?)",
            )
            .bind(Uuid::new_v4().to_string())
            .bind(&lot_id)
            .bind(&item.product_id)
            .bind(item.received_qty)
            .bind("Reception marchandise")
            .bind(&gr_number)
            .bind(&input.created_by)
            .bind(&input.created_at)
            .execute(&mut *tx)
            .await?;

            lots_created.push(LotCreated {
                product_id: item.product_id.clone(),
                lot_id,
                quantity: item.received_qty,
            });
        }
    }

    // 3. Settlement — exactly one of: a single cash movement, a safe withdrawal,
    //    or a supplier-debt increment. A cash payment needs an open session;
    //    without one it falls back to debt (the old UI's toast behaviour).
    let mut supplier_debt_delta = 0.0;
    let paid_cash = input.is_paid
        && input.paid_from.as_deref() == Some("cash")
        && input.session_id.is_some();
    let paid_safe = input.is_paid && input.paid_from.as_deref() == Some("safe");

    if paid_cash {
        let session_id = input.session_id.as_ref().unwrap();
        let reason = format!(
            "Achat marchandise: {} ({})",
            gr_number, input.supplier_name
        );
        sqlx::query(
            "INSERT INTO cash_movements
                (id, session_id, type, amount, reason, category, reference, created_by, payment_method, created_at)
             VALUES (?, ?, 'expense', ?, ?, 'Achats', ?, ?, 'cash', ?)",
        )
        .bind(Uuid::new_v4().to_string())
        .bind(session_id)
        .bind(input.total)
        .bind(&reason)
        .bind(&gr_number)
        .bind(&input.created_by)
        .bind(&input.created_at)
        .execute(&mut *tx)
        .await?;
    } else if paid_safe {
        let reason = format!("Achat marchandise: {} ({})", gr_number, input.supplier_name);
        sqlx::query(
            "INSERT INTO safe_transactions
                (id, type, amount, reason, performed_by, created_at)
             VALUES (?, 'withdrawal', ?, ?, ?, ?)",
        )
        .bind(Uuid::new_v4().to_string())
        .bind(input.total)
        .bind(&reason)
        .bind(&input.created_by)
        .bind(&input.created_at)
        .execute(&mut *tx)
        .await?;
    } else {
        // Unpaid (or cash without an open session) → owe the supplier. Written
        // as a DELTA so concurrent receipts accumulate honestly.
        sqlx::query(
            "UPDATE suppliers SET current_debt = current_debt + ?, updated_at = ? WHERE id = ?",
        )
        .bind(input.total)
        .bind(&input.created_at)
        .bind(&input.supplier_id)
        .execute(&mut *tx)
        .await?;
        supplier_debt_delta = input.total;
    }

    tx.commit().await?;

    Ok(ReceiveGoodsResult {
        receipt_id,
        gr_number,
        created_at: input.created_at,
        lots_created,
        supplier_debt_delta,
    })
}

/// Four-digit year prefix of an ISO timestamp, defaulting to "0000" if the
/// string is too short to slice (so a malformed date can't panic the command).
fn year_of(iso: &str) -> &str {
    if iso.len() >= 4 {
        &iso[..4]
    } else {
        "0000"
    }
}

/// Last four chars of an id, used to build a readable fallback lot number.
fn last4(s: &str) -> String {
    let chars: Vec<char> = s.chars().collect();
    let start = chars.len().saturating_sub(4);
    chars[start..].iter().collect()
}

/// Expiry status thresholds — mirror `lotsStore.getExpiryStatus`.
fn expiry_status(days_remaining: i64) -> &'static str {
    if days_remaining < 0 {
        "expired"
    } else if days_remaining <= 3 {
        "critical"
    } else if days_remaining <= 7 {
        "warning"
    } else if days_remaining <= 14 {
        "attention"
    } else {
        "ok"
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use sqlx::sqlite::SqlitePoolOptions;

    fn item(product_id: &str, qty: f64, price: f64) -> ReceiveGoodsItem {
        ReceiveGoodsItem {
            product_id: product_id.to_string(),
            product_name: format!("P-{product_id}"),
            product_barcode: String::new(),
            product_emoji: String::new(),
            ordered_qty: qty,
            received_qty: qty,
            purchase_price: price,
            total: qty * price,
            unit: "unit".to_string(),
            expiry_date: None,
            lot_number: None,
            is_perishable: false,
            shelf_life_days: None,
        }
    }

    fn base_input(items: Vec<ReceiveGoodsItem>) -> ReceiveGoodsInput {
        let total: f64 = items.iter().map(|i| i.total).sum();
        ReceiveGoodsInput {
            items,
            supplier_id: "s1".to_string(),
            supplier_name: "Sup".to_string(),
            date: "2026-06-13".to_string(),
            invoice_number: "INV-1".to_string(),
            total,
            po_id: None,
            status: None,
            is_paid: false,
            paid_from: None,
            session_id: None,
            created_at: "2026-06-13T10:00:00.000Z".to_string(),
            created_by: "staff-1".to_string(),
        }
    }

    async fn schema_pool() -> Pool<Sqlite> {
        let pool = SqlitePoolOptions::new()
            .max_connections(1)
            .connect("sqlite::memory:")
            .await
            .unwrap();
        let ddl = r#"
            CREATE TABLE products (id TEXT PRIMARY KEY, name TEXT, stock REAL NOT NULL DEFAULT 0, updated_at TEXT);
            CREATE TABLE suppliers (id TEXT PRIMARY KEY, name TEXT, current_debt REAL NOT NULL DEFAULT 0, updated_at TEXT);
            CREATE TABLE goods_receipts (id TEXT PRIMARY KEY, gr_number TEXT NOT NULL, po_id TEXT, supplier_id TEXT,
                supplier_name TEXT, date TEXT, invoice_number TEXT, total REAL, status TEXT, paid_from TEXT,
                is_paid INTEGER, created_at TEXT);
            CREATE TABLE goods_receipt_items (id TEXT PRIMARY KEY, gr_id TEXT, product_id TEXT, product_name TEXT,
                product_barcode TEXT, product_emoji TEXT, ordered_qty REAL, received_qty REAL, purchase_price REAL,
                total REAL, expiry_date TEXT, lot_number TEXT, unit TEXT);
            CREATE TABLE inventory_movements (id TEXT PRIMARY KEY, product_id TEXT, type TEXT, qty_change REAL,
                stock_after REAL, reason TEXT, reference_id TEXT, created_at TEXT);
            CREATE TABLE lots (id TEXT PRIMARY KEY, product_id TEXT, product_name TEXT, product_barcode TEXT,
                lot_number TEXT, batch_number TEXT, quantity REAL, original_quantity REAL, expiry_date TEXT,
                received_date TEXT, supplier_id TEXT, supplier_name TEXT, goods_receipt_id TEXT, purchase_price REAL,
                status TEXT, days_remaining INTEGER, created_at TEXT);
            CREATE TABLE lot_movements (id TEXT PRIMARY KEY, lot_id TEXT, product_id TEXT, type TEXT, quantity REAL,
                reason TEXT, reference TEXT, created_by TEXT, created_at TEXT);
            CREATE TABLE cash_movements (id TEXT PRIMARY KEY, session_id TEXT, type TEXT, amount REAL, reason TEXT,
                category TEXT, reference TEXT, created_by TEXT, payment_method TEXT, created_at TEXT);
            CREATE TABLE safe_transactions (id TEXT PRIMARY KEY, type TEXT, amount REAL, reason TEXT,
                performed_by TEXT, created_at TEXT);
        "#;
        for stmt in ddl.split(';').map(str::trim).filter(|s| !s.is_empty()) {
            sqlx::query(stmt).execute(&pool).await.unwrap();
        }
        sqlx::query("INSERT INTO suppliers (id, name) VALUES ('s1', 'Sup')")
            .execute(&pool)
            .await
            .unwrap();
        pool
    }

    async fn stock_of(pool: &Pool<Sqlite>, id: &str) -> f64 {
        sqlx::query("SELECT stock FROM products WHERE id = ?")
            .bind(id)
            .fetch_one(pool)
            .await
            .unwrap()
            .get::<f64, _>("stock")
    }

    async fn debt_of(pool: &Pool<Sqlite>, id: &str) -> f64 {
        sqlx::query("SELECT current_debt FROM suppliers WHERE id = ?")
            .bind(id)
            .fetch_one(pool)
            .await
            .unwrap()
            .get::<f64, _>("current_debt")
    }

    async fn scalar_i64(pool: &Pool<Sqlite>, sql: &str) -> i64 {
        sqlx::query(sql).fetch_one(pool).await.unwrap().get::<i64, _>(0)
    }

    #[tokio::test]
    async fn unpaid_receipt_adds_stock_and_supplier_debt() {
        let pool = schema_pool().await;
        sqlx::query("INSERT INTO products (id, name, stock) VALUES ('p1', 'Coca', 4)")
            .execute(&pool)
            .await
            .unwrap();

        let res = run_receive_goods(&pool, base_input(vec![item("p1", 10.0, 50.0)]))
            .await
            .unwrap();

        assert_eq!(res.gr_number, "BE-2026-001");
        assert_eq!(res.supplier_debt_delta, 500.0);
        assert_eq!(stock_of(&pool, "p1").await, 14.0);
        assert_eq!(debt_of(&pool, "s1").await, 500.0);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM goods_receipts").await, 1);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM goods_receipt_items").await, 1);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM inventory_movements").await, 1);
        // Unpaid ⇒ no money moved.
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM cash_movements").await, 0);
    }

    #[tokio::test]
    async fn cash_paid_receipt_writes_exactly_one_movement_and_no_debt() {
        // Regression for the double-deduction bug: the old flow wrote both a
        // 'withdrawal' and an 'expense' for one cash purchase.
        let pool = schema_pool().await;
        sqlx::query("INSERT INTO products (id, name, stock) VALUES ('p1', 'Coca', 0)")
            .execute(&pool)
            .await
            .unwrap();

        let mut input = base_input(vec![item("p1", 2.0, 100.0)]);
        input.is_paid = true;
        input.paid_from = Some("cash".to_string());
        input.session_id = Some("sess-1".to_string());
        run_receive_goods(&pool, input).await.unwrap();

        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM cash_movements").await, 1);
        assert_eq!(
            scalar_i64(&pool, "SELECT COUNT(*) FROM cash_movements WHERE type = 'expense'").await,
            1
        );
        // Paid ⇒ no supplier debt.
        assert_eq!(debt_of(&pool, "s1").await, 0.0);
    }

    #[tokio::test]
    async fn cash_paid_without_session_falls_back_to_debt() {
        let pool = schema_pool().await;
        sqlx::query("INSERT INTO products (id, name, stock) VALUES ('p1', 'Coca', 0)")
            .execute(&pool)
            .await
            .unwrap();

        let mut input = base_input(vec![item("p1", 1.0, 300.0)]);
        input.is_paid = true;
        input.paid_from = Some("cash".to_string());
        input.session_id = None; // no open session
        run_receive_goods(&pool, input).await.unwrap();

        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM cash_movements").await, 0);
        assert_eq!(debt_of(&pool, "s1").await, 300.0);
    }

    #[tokio::test]
    async fn safe_paid_receipt_writes_safe_withdrawal_and_no_debt() {
        let pool = schema_pool().await;
        sqlx::query("INSERT INTO products (id, name, stock) VALUES ('p1', 'Coca', 0)")
            .execute(&pool)
            .await
            .unwrap();

        let mut input = base_input(vec![item("p1", 1.0, 250.0)]);
        input.is_paid = true;
        input.paid_from = Some("safe".to_string());
        run_receive_goods(&pool, input).await.unwrap();

        assert_eq!(
            scalar_i64(&pool, "SELECT COUNT(*) FROM safe_transactions WHERE type = 'withdrawal'").await,
            1
        );
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM cash_movements").await, 0);
        assert_eq!(debt_of(&pool, "s1").await, 0.0);
    }

    #[tokio::test]
    async fn perishable_item_creates_lot_and_movement() {
        let pool = schema_pool().await;
        sqlx::query("INSERT INTO products (id, name, stock) VALUES ('p1', 'Lait', 0)")
            .execute(&pool)
            .await
            .unwrap();

        let mut it = item("p1", 6.0, 80.0);
        it.expiry_date = Some("2026-12-01".to_string());
        run_receive_goods(&pool, base_input(vec![it])).await.unwrap();

        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM lots").await, 1);
        assert_eq!(
            scalar_i64(&pool, "SELECT COUNT(*) FROM lot_movements WHERE type = 'receipt'").await,
            1
        );
        let (qty, expiry, days): (f64, String, i64) =
            sqlx::query("SELECT quantity, expiry_date, days_remaining FROM lots")
                .fetch_one(&pool)
                .await
                .map(|r| (r.get("quantity"), r.get("expiry_date"), r.get("days_remaining")))
                .unwrap();
        assert_eq!(qty, 6.0);
        assert_eq!(expiry, "2026-12-01");
        assert_eq!(days, 171, "2026-06-13 → 2026-12-01 is 171 days");
    }

    #[tokio::test]
    async fn perishable_without_expiry_uses_shelf_life_fallback() {
        let pool = schema_pool().await;
        sqlx::query("INSERT INTO products (id, name, stock) VALUES ('p1', 'Pain', 0)")
            .execute(&pool)
            .await
            .unwrap();

        let mut it = item("p1", 3.0, 20.0);
        it.is_perishable = true;
        it.shelf_life_days = Some(7);
        run_receive_goods(&pool, base_input(vec![it])).await.unwrap();

        let (expiry, status): (String, String) =
            sqlx::query("SELECT expiry_date, status FROM lots")
                .fetch_one(&pool)
                .await
                .map(|r| (r.get("expiry_date"), r.get("status")))
                .unwrap();
        // created_at 2026-06-13 + 7 days.
        assert_eq!(&expiry[..10], "2026-06-20");
        assert_eq!(status, "warning", "7 days out ⇒ warning");
    }

    #[tokio::test]
    async fn non_perishable_item_creates_no_lot() {
        let pool = schema_pool().await;
        sqlx::query("INSERT INTO products (id, name, stock) VALUES ('p1', 'Vis', 0)")
            .execute(&pool)
            .await
            .unwrap();

        run_receive_goods(&pool, base_input(vec![item("p1", 100.0, 5.0)]))
            .await
            .unwrap();

        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM lots").await, 0);
    }

    #[tokio::test]
    async fn unknown_supplier_rejected_and_nothing_persists() {
        let pool = schema_pool().await;
        sqlx::query("INSERT INTO products (id, name, stock) VALUES ('p1', 'Coca', 5)")
            .execute(&pool)
            .await
            .unwrap();

        let mut input = base_input(vec![item("p1", 3.0, 100.0)]);
        input.supplier_id = "ghost".to_string();
        let err = run_receive_goods(&pool, input).await.unwrap_err();
        assert_eq!(err.code(), "UNKNOWN_SUPPLIER");

        assert_eq!(stock_of(&pool, "p1").await, 5.0);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM goods_receipts").await, 0);
    }

    #[tokio::test]
    async fn unknown_product_rolls_back_entirely() {
        let pool = schema_pool().await;
        // Only p1 exists; the receipt also references the missing p2.
        sqlx::query("INSERT INTO products (id, name, stock) VALUES ('p1', 'Coca', 5)")
            .execute(&pool)
            .await
            .unwrap();

        let input = base_input(vec![item("p1", 3.0, 100.0), item("p2", 1.0, 50.0)]);
        let err = run_receive_goods(&pool, input).await.unwrap_err();
        assert_eq!(err.code(), "UNKNOWN_PRODUCT");

        // p1's stock untouched, no header/items/debt persisted.
        assert_eq!(stock_of(&pool, "p1").await, 5.0);
        assert_eq!(debt_of(&pool, "s1").await, 0.0);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM goods_receipts").await, 0);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM goods_receipt_items").await, 0);
    }

    #[tokio::test]
    async fn gr_numbers_increment() {
        let pool = schema_pool().await;
        sqlx::query("INSERT INTO products (id, name, stock) VALUES ('p1', 'Coca', 0)")
            .execute(&pool)
            .await
            .unwrap();

        let r1 = run_receive_goods(&pool, base_input(vec![item("p1", 1.0, 100.0)])).await.unwrap();
        let r2 = run_receive_goods(&pool, base_input(vec![item("p1", 1.0, 100.0)])).await.unwrap();
        assert_eq!(r1.gr_number, "BE-2026-001");
        assert_eq!(r2.gr_number, "BE-2026-002");
    }

    #[tokio::test]
    async fn empty_receipt_rejected() {
        let pool = schema_pool().await;
        let err = run_receive_goods(&pool, base_input(vec![])).await.unwrap_err();
        assert_eq!(err.code(), "INVALID_INPUT");
    }
}

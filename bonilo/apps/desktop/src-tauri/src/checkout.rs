//! Atomic checkout — one Tauri command, one SQLite transaction.
//!
//! Ports the shape of BONILO CAISSE V13's `checkout.rs` to GRAPHSHOP's schema
//! (TEXT UUID ids, REAL money). Everything below runs inside a single
//! `pool.begin()` transaction on one connection, so any error rolls the whole
//! sale back. Fixes carried over the old JS `recordSale`:
//!   * the receipt number is minted INSIDE the transaction (no more printed-vs
//!     -stored mismatch);
//!   * stock is decremented WITHOUT the silent `MAX(0, …)` clamp — overselling
//!     is either blocked or recorded honestly, per `allow_negative_stock`;
//!   * customer credit is applied as a DELTA (`balance + amount`), not an
//!     absolute write that clobbers concurrent changes;
//!   * lots are drained FEFO (best-effort) so the lot ledger tracks sales.

use serde::{Deserialize, Serialize};
use sqlx::{Connection, Pool, Row, Sqlite};
use uuid::Uuid;

use crate::db::sqlite_pool;
use crate::error::{AppError, AppResult};

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CheckoutItem {
    pub product_id: String,
    #[serde(default)]
    pub product_name: String,
    pub quantity: f64,
    pub unit_price: f64,
    pub total: f64,
    #[serde(default)]
    pub tax_amount: f64,
    #[serde(default)]
    pub discount_percent: f64,
    #[serde(default)]
    pub cost_at_sale: f64,
    /// Stock units to decrement, when it differs from the displayed quantity
    /// (e.g. selling by pack). Defaults to `quantity`.
    #[serde(default)]
    pub stock_quantity: Option<f64>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CheckoutInput {
    pub items: Vec<CheckoutItem>,
    pub subtotal: f64,
    pub tax_amount: f64,
    pub discount_amount: f64,
    pub total_amount: f64,
    pub payment_method: String,
    #[serde(default)]
    pub customer_id: Option<String>,
    #[serde(default)]
    pub customer_name: String,
    #[serde(default)]
    pub cashier_id: String,
    #[serde(default)]
    pub cashier_name: String,
    #[serde(default)]
    pub status: Option<String>,
    /// ISO timestamp used for every row written, so the stored rows match the
    /// in-memory Sale the renderer keeps. (Server-side time is a later
    /// hardening; for now the renderer supplies it, as the old store did.)
    pub created_at: String,
    /// Open cash session, for the treasury movement on cash sales.
    #[serde(default)]
    pub session_id: Option<String>,
    #[serde(default)]
    pub created_by: String,
    /// When false (default), a line that would drive stock negative is
    /// rejected with INSUFFICIENT_STOCK and the whole sale rolls back.
    #[serde(default)]
    pub allow_negative_stock: bool,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LotDrain {
    pub product_id: String,
    pub lot_id: String,
    pub qty: f64,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CheckoutResult {
    pub sale_id: String,
    pub receipt_number: String,
    pub created_at: String,
    pub lots_drained: Vec<LotDrain>,
}

/// Tauri entry point. Resolves the plugin pool, then runs the checkout.
#[tauri::command]
pub async fn checkout_sale(app: tauri::AppHandle, input: CheckoutInput) -> AppResult<CheckoutResult> {
    let pool = sqlite_pool(&app).await?;
    run_checkout(&pool, input).await
}

/// The transactional core, decoupled from Tauri so it can be tested against a
/// throwaway pool (see the tests below and the M1.5 integration suite).
pub async fn run_checkout(pool: &Pool<Sqlite>, input: CheckoutInput) -> AppResult<CheckoutResult> {
    if input.items.is_empty() {
        return Err(AppError::EmptyCart);
    }
    if input.payment_method == "credit" && input.customer_id.is_none() {
        return Err(AppError::CreditRequiresCustomer);
    }

    // Acquire one connection and turn foreign keys ON *before* BEGIN — the
    // pragma is a no-op inside a transaction, and plugin pool connections
    // default to FK off.
    let mut conn = pool.acquire().await?;
    sqlx::query("PRAGMA foreign_keys = ON;")
        .execute(&mut *conn)
        .await?;
    let mut tx = conn.begin().await?;

    // Mint the receipt number from the current max, inside the transaction.
    let next_num: i64 = sqlx::query(
        "SELECT COALESCE(MAX(CAST(SUBSTR(receipt_number, 5) AS INTEGER)), 0) + 1 AS n
           FROM sales
          WHERE receipt_number GLOB 'REC-[0-9]*'",
    )
    .fetch_one(&mut *tx)
    .await?
    .try_get::<i64, _>("n")?;
    let receipt_number = format!("REC-{:06}", next_num);

    let sale_id = Uuid::new_v4().to_string();
    let status = input.status.clone().unwrap_or_else(|| "completed".to_string());

    // 1. Sale header.
    sqlx::query(
        "INSERT INTO sales
            (id, receipt_number, subtotal, tax_amount, discount_amount, total_amount,
             payment_method, customer_id, customer_name, cashier_id, cashier_name, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(&sale_id)
    .bind(&receipt_number)
    .bind(input.subtotal)
    .bind(input.tax_amount)
    .bind(input.discount_amount)
    .bind(input.total_amount)
    .bind(&input.payment_method)
    .bind(&input.customer_id)
    .bind(&input.customer_name)
    .bind(&input.cashier_id)
    .bind(&input.cashier_name)
    .bind(&status)
    .bind(&input.created_at)
    .execute(&mut *tx)
    .await?;

    let mut lots_drained: Vec<LotDrain> = Vec::new();

    // 2. Lines: sale_items + stock decrement + inventory movement + FEFO drain.
    for item in &input.items {
        if item.quantity <= 0.0 {
            return Err(AppError::Invalid("item quantity must be greater than zero"));
        }
        let stock_qty = item.stock_quantity.unwrap_or(item.quantity);

        sqlx::query(
            "INSERT INTO sale_items
                (id, sale_id, product_id, product_name, quantity, unit_price, total,
                 tax_amount, discount_percent, cost_at_sale, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        )
        .bind(Uuid::new_v4().to_string())
        .bind(&sale_id)
        .bind(&item.product_id)
        .bind(&item.product_name)
        .bind(item.quantity)
        .bind(item.unit_price)
        .bind(item.total)
        .bind(item.tax_amount)
        .bind(item.discount_percent)
        .bind(item.cost_at_sale)
        .bind(&input.created_at)
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

        let new_stock = current_stock - stock_qty;
        if new_stock < 0.0 && !input.allow_negative_stock {
            return Err(AppError::InsufficientStock {
                product_id: item.product_id.clone(),
                requested: stock_qty,
                available: current_stock,
            });
        }

        sqlx::query("UPDATE products SET stock = ?, updated_at = ? WHERE id = ?")
            .bind(new_stock)
            .bind(&input.created_at)
            .bind(&item.product_id)
            .execute(&mut *tx)
            .await?;

        sqlx::query(
            "INSERT INTO inventory_movements
                (id, product_id, type, qty_change, stock_after, reason, reference_id, created_at)
             VALUES (?, ?, 'sale', ?, ?, ?, ?, ?)",
        )
        .bind(Uuid::new_v4().to_string())
        .bind(&item.product_id)
        .bind(-stock_qty)
        .bind(new_stock)
        .bind(format!("Vente POS {}", receipt_number))
        .bind(&sale_id)
        .bind(&input.created_at)
        .execute(&mut *tx)
        .await?;

        // FEFO lot drain (best-effort): earliest expiry first; unknown/empty
        // expiries drain last. products.stock stays authoritative, so we never
        // block a sale just because lot data is incomplete.
        let mut remaining = stock_qty;
        if remaining > 0.0 {
            let lots = sqlx::query(
                "SELECT id, quantity FROM lots
                  WHERE product_id = ? AND quantity > 0
                  ORDER BY (expiry_date IS NULL OR expiry_date = ''), expiry_date, created_at",
            )
            .bind(&item.product_id)
            .fetch_all(&mut *tx)
            .await?;

            for row in lots {
                if remaining <= 1e-9 {
                    break;
                }
                let lot_id: String = row.try_get("id")?;
                let lot_qty: f64 = row.try_get("quantity")?;
                let take = remaining.min(lot_qty);

                sqlx::query("UPDATE lots SET quantity = quantity - ? WHERE id = ?")
                    .bind(take)
                    .bind(&lot_id)
                    .execute(&mut *tx)
                    .await?;

                sqlx::query(
                    "INSERT INTO lot_movements
                        (id, lot_id, product_id, type, quantity, reason, reference, created_by, created_at)
                     VALUES (?, ?, ?, 'sale', ?, ?, ?, ?, ?)",
                )
                .bind(Uuid::new_v4().to_string())
                .bind(&lot_id)
                .bind(&item.product_id)
                .bind(take)
                .bind("Vente POS")
                .bind(&receipt_number)
                .bind(&input.created_by)
                .bind(&input.created_at)
                .execute(&mut *tx)
                .await?;

                lots_drained.push(LotDrain {
                    product_id: item.product_id.clone(),
                    lot_id,
                    qty: take,
                });
                remaining -= take;
            }
        }
    }

    // 3. Credit sale → ledger row + balance DELTA.
    if input.payment_method == "credit" {
        let cid = input
            .customer_id
            .as_ref()
            .ok_or(AppError::CreditRequiresCustomer)?;

        sqlx::query(
            "INSERT INTO credit_transactions (id, customer_id, amount, type, date, sale_id, notes)
             VALUES (?, ?, ?, 'purchase', ?, ?, ?)",
        )
        .bind(Uuid::new_v4().to_string())
        .bind(cid)
        .bind(input.total_amount)
        .bind(&input.created_at)
        .bind(&sale_id)
        .bind(format!("Achat POS {}", receipt_number))
        .execute(&mut *tx)
        .await?;

        sqlx::query(
            "UPDATE customers
                SET current_balance = current_balance + ?,
                    total_purchases = total_purchases + ?,
                    updated_at = ?
              WHERE id = ?",
        )
        .bind(input.total_amount)
        .bind(input.total_amount)
        .bind(&input.created_at)
        .bind(cid)
        .execute(&mut *tx)
        .await?;
    }

    // 4. Cash sale with an open session → treasury movement.
    if input.payment_method == "cash" {
        if let Some(session_id) = &input.session_id {
            sqlx::query(
                "INSERT INTO cash_movements
                    (id, session_id, type, amount, reason, reference, created_by, payment_method, created_at)
                 VALUES (?, ?, 'sale', ?, ?, ?, ?, 'cash', ?)",
            )
            .bind(Uuid::new_v4().to_string())
            .bind(session_id)
            .bind(input.total_amount)
            .bind(format!("Vente POS {}", receipt_number))
            .bind(&receipt_number)
            .bind(&input.created_by)
            .bind(&input.created_at)
            .execute(&mut *tx)
            .await?;
        }
    }

    tx.commit().await?;

    Ok(CheckoutResult {
        sale_id,
        receipt_number,
        created_at: input.created_at,
        lots_drained,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use sqlx::sqlite::SqlitePoolOptions;

    fn item(product_id: &str, qty: f64, price: f64) -> CheckoutItem {
        CheckoutItem {
            product_id: product_id.to_string(),
            product_name: format!("P-{product_id}"),
            quantity: qty,
            unit_price: price,
            total: qty * price,
            tax_amount: 0.0,
            discount_percent: 0.0,
            cost_at_sale: 0.0,
            stock_quantity: None,
        }
    }

    fn base_input(items: Vec<CheckoutItem>, payment: &str) -> CheckoutInput {
        let total: f64 = items.iter().map(|i| i.total).sum();
        CheckoutInput {
            items,
            subtotal: total,
            tax_amount: 0.0,
            discount_amount: 0.0,
            total_amount: total,
            payment_method: payment.to_string(),
            customer_id: None,
            customer_name: String::new(),
            cashier_id: "cashier-1".to_string(),
            cashier_name: "Test".to_string(),
            status: None,
            created_at: "2026-06-13T10:00:00.000Z".to_string(),
            session_id: None,
            created_by: "cashier-1".to_string(),
            allow_negative_stock: false,
        }
    }

    async fn schema_pool() -> Pool<Sqlite> {
        let pool = SqlitePoolOptions::new()
            .max_connections(1)
            .connect("sqlite::memory:")
            .await
            .unwrap();
        // Minimal slice of the real schema that checkout touches.
        let ddl = r#"
            CREATE TABLE products (id TEXT PRIMARY KEY, name TEXT, stock REAL NOT NULL DEFAULT 0, updated_at TEXT);
            CREATE TABLE sales (id TEXT PRIMARY KEY, receipt_number TEXT NOT NULL, subtotal REAL, tax_amount REAL,
                discount_amount REAL, total_amount REAL, payment_method TEXT, customer_id TEXT, customer_name TEXT,
                cashier_id TEXT, cashier_name TEXT, status TEXT, created_at TEXT);
            CREATE TABLE sale_items (id TEXT PRIMARY KEY, sale_id TEXT, product_id TEXT, product_name TEXT, quantity REAL,
                unit_price REAL, total REAL, tax_amount REAL, discount_percent REAL, cost_at_sale REAL, created_at TEXT);
            CREATE TABLE inventory_movements (id TEXT PRIMARY KEY, product_id TEXT, type TEXT, qty_change REAL,
                stock_after REAL, reason TEXT, reference_id TEXT, created_at TEXT);
            CREATE TABLE customers (id TEXT PRIMARY KEY, name TEXT, current_balance REAL DEFAULT 0,
                total_purchases REAL DEFAULT 0, updated_at TEXT);
            CREATE TABLE credit_transactions (id TEXT PRIMARY KEY, customer_id TEXT, amount REAL, type TEXT, date TEXT,
                sale_id TEXT, notes TEXT);
            CREATE TABLE cash_sessions (id TEXT PRIMARY KEY, status TEXT);
            CREATE TABLE cash_movements (id TEXT PRIMARY KEY, session_id TEXT, type TEXT, amount REAL, reason TEXT,
                reference TEXT, created_by TEXT, payment_method TEXT, created_at TEXT);
            CREATE TABLE lots (id TEXT PRIMARY KEY, product_id TEXT, quantity REAL, expiry_date TEXT, created_at TEXT);
            CREATE TABLE lot_movements (id TEXT PRIMARY KEY, lot_id TEXT, product_id TEXT, type TEXT, quantity REAL,
                reason TEXT, reference TEXT, created_by TEXT, created_at TEXT);
        "#;
        for stmt in ddl.split(';').map(str::trim).filter(|s| !s.is_empty()) {
            sqlx::query(stmt).execute(&pool).await.unwrap();
        }
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

    async fn scalar_i64(pool: &Pool<Sqlite>, sql: &str) -> i64 {
        sqlx::query(sql).fetch_one(pool).await.unwrap().get::<i64, _>(0)
    }

    #[tokio::test]
    async fn cash_sale_decrements_stock_and_mints_receipt() {
        let pool = schema_pool().await;
        sqlx::query("INSERT INTO products (id, name, stock) VALUES ('p1', 'Coca', 10)")
            .execute(&pool)
            .await
            .unwrap();

        let res = run_checkout(&pool, base_input(vec![item("p1", 3.0, 100.0)], "cash"))
            .await
            .unwrap();

        assert_eq!(res.receipt_number, "REC-000001");
        assert_eq!(stock_of(&pool, "p1").await, 7.0);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM sales").await, 1);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM sale_items").await, 1);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM inventory_movements").await, 1);
    }

    #[tokio::test]
    async fn oversell_blocked_rolls_back_entirely() {
        let pool = schema_pool().await;
        sqlx::query("INSERT INTO products (id, name, stock) VALUES ('p1', 'Coca', 2)")
            .execute(&pool)
            .await
            .unwrap();

        let err = run_checkout(&pool, base_input(vec![item("p1", 5.0, 100.0)], "cash"))
            .await
            .unwrap_err();
        assert_eq!(err.code(), "INSUFFICIENT_STOCK");

        // Nothing persisted: stock untouched, no sale/sale_items rows.
        assert_eq!(stock_of(&pool, "p1").await, 2.0);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM sales").await, 0);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM sale_items").await, 0);
    }

    #[tokio::test]
    async fn oversell_allowed_records_negative_stock() {
        let pool = schema_pool().await;
        sqlx::query("INSERT INTO products (id, name, stock) VALUES ('p1', 'Coca', 2)")
            .execute(&pool)
            .await
            .unwrap();

        let mut input = base_input(vec![item("p1", 5.0, 100.0)], "cash");
        input.allow_negative_stock = true;
        run_checkout(&pool, input).await.unwrap();

        assert_eq!(stock_of(&pool, "p1").await, -3.0);
    }

    #[tokio::test]
    async fn credit_sale_adds_balance_as_delta() {
        let pool = schema_pool().await;
        sqlx::query("INSERT INTO products (id, name, stock) VALUES ('p1', 'Coca', 10)")
            .execute(&pool)
            .await
            .unwrap();
        sqlx::query("INSERT INTO customers (id, name, current_balance) VALUES ('c1', 'Ali', 500)")
            .execute(&pool)
            .await
            .unwrap();

        let mut input = base_input(vec![item("p1", 2.0, 100.0)], "credit");
        input.customer_id = Some("c1".to_string());
        run_checkout(&pool, input).await.unwrap();

        // 500 + 200 = 700 (delta, not absolute overwrite).
        let balance = sqlx::query("SELECT current_balance FROM customers WHERE id = 'c1'")
            .fetch_one(&pool)
            .await
            .unwrap()
            .get::<f64, _>("current_balance");
        assert_eq!(balance, 700.0);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM credit_transactions").await, 1);
    }

    #[tokio::test]
    async fn credit_without_customer_is_rejected() {
        let pool = schema_pool().await;
        sqlx::query("INSERT INTO products (id, name, stock) VALUES ('p1', 'Coca', 10)")
            .execute(&pool)
            .await
            .unwrap();

        let err = run_checkout(&pool, base_input(vec![item("p1", 1.0, 100.0)], "credit"))
            .await
            .unwrap_err();
        assert_eq!(err.code(), "CREDIT_REQUIRES_CUSTOMER");
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM sales").await, 0);
    }

    #[tokio::test]
    async fn lots_drain_fefo_earliest_expiry_first() {
        let pool = schema_pool().await;
        sqlx::query("INSERT INTO products (id, name, stock) VALUES ('p1', 'Lait', 10)")
            .execute(&pool)
            .await
            .unwrap();
        // Two lots: later expiry inserted first to prove ordering is by expiry.
        sqlx::query("INSERT INTO lots (id, product_id, quantity, expiry_date, created_at) VALUES ('late', 'p1', 5, '2026-12-01', '2026-06-01')")
            .execute(&pool).await.unwrap();
        sqlx::query("INSERT INTO lots (id, product_id, quantity, expiry_date, created_at) VALUES ('soon', 'p1', 5, '2026-07-01', '2026-06-02')")
            .execute(&pool).await.unwrap();

        // Sell 6 → drains all of 'soon' (5) then 1 from 'late'.
        run_checkout(&pool, base_input(vec![item("p1", 6.0, 100.0)], "cash"))
            .await
            .unwrap();

        let soon_qty = sqlx::query("SELECT quantity FROM lots WHERE id = 'soon'")
            .fetch_one(&pool).await.unwrap().get::<f64, _>("quantity");
        let late_qty = sqlx::query("SELECT quantity FROM lots WHERE id = 'late'")
            .fetch_one(&pool).await.unwrap().get::<f64, _>("quantity");
        assert_eq!(soon_qty, 0.0, "earliest-expiry lot drains first");
        assert_eq!(late_qty, 4.0, "later lot drains the remainder");
    }

    #[tokio::test]
    async fn receipt_numbers_increment() {
        let pool = schema_pool().await;
        sqlx::query("INSERT INTO products (id, name, stock) VALUES ('p1', 'Coca', 100)")
            .execute(&pool)
            .await
            .unwrap();

        let r1 = run_checkout(&pool, base_input(vec![item("p1", 1.0, 100.0)], "cash")).await.unwrap();
        let r2 = run_checkout(&pool, base_input(vec![item("p1", 1.0, 100.0)], "cash")).await.unwrap();
        assert_eq!(r1.receipt_number, "REC-000001");
        assert_eq!(r2.receipt_number, "REC-000002");
    }
}

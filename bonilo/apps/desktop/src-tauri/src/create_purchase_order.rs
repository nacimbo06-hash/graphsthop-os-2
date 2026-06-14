//! Atomic purchase-order creation — one Tauri command, one SQLite transaction.
//!
//! Ports the JS `purchasesRepo.createPurchaseOrder` (`db.transaction` over the
//! plugin pool) to a single `pool.begin()` transaction. A purchase order moves
//! no money and touches no stock — it is just a header plus its line items —
//! but it is still a multi-row write, so it gets the same atomicity guarantee
//! and the same DB-derived numbering as the money flows: the `po_number`
//! (`BC-YYYY-NNN`) is minted INSIDE the transaction instead of from a fragile
//! in-memory `purchaseOrders.length + 1` count.

use serde::{Deserialize, Serialize};
use sqlx::{Connection, Pool, Row, Sqlite};
use uuid::Uuid;

use crate::db::sqlite_pool;
use crate::error::{AppError, AppResult};

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PurchaseOrderItemInput {
    pub product_id: String,
    #[serde(default)]
    pub product_name: String,
    #[serde(default)]
    pub product_barcode: String,
    #[serde(default)]
    pub product_emoji: String,
    #[serde(default)]
    pub ordered_qty: f64,
    #[serde(default)]
    pub received_qty: f64,
    #[serde(default)]
    pub purchase_price: f64,
    #[serde(default)]
    pub total: f64,
    #[serde(default)]
    pub expiry_date: Option<String>,
    #[serde(default)]
    pub lot_number: Option<String>,
    #[serde(default)]
    pub unit: String,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreatePurchaseOrderInput {
    pub items: Vec<PurchaseOrderItemInput>,
    pub supplier_id: String,
    #[serde(default)]
    pub supplier_name: String,
    pub date: String,
    #[serde(default)]
    pub expected_date: String,
    /// Order status; defaults to "draft" (what the renderer always sends).
    #[serde(default)]
    pub status: Option<String>,
    #[serde(default)]
    pub subtotal: f64,
    #[serde(default)]
    pub tax_amount: f64,
    pub total: f64,
    #[serde(default)]
    pub notes: String,
    /// ISO timestamp written on the header, so the stored row matches the
    /// in-memory order the renderer keeps (same convention as the other flows).
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CreatePurchaseOrderResult {
    pub order_id: String,
    pub po_number: String,
    pub created_at: String,
}

/// Tauri entry point. Resolves the plugin pool, then runs the insert.
#[tauri::command]
pub async fn create_purchase_order(
    app: tauri::AppHandle,
    input: CreatePurchaseOrderInput,
) -> AppResult<CreatePurchaseOrderResult> {
    let pool = sqlite_pool(&app).await?;
    run_create_purchase_order(&pool, input).await
}

/// The transactional core, decoupled from Tauri for testing against a throwaway
/// pool (see the tests below).
pub async fn run_create_purchase_order(
    pool: &Pool<Sqlite>,
    input: CreatePurchaseOrderInput,
) -> AppResult<CreatePurchaseOrderResult> {
    if input.items.is_empty() {
        return Err(AppError::Invalid("a purchase order needs at least one item"));
    }

    let mut conn = pool.acquire().await?;
    sqlx::query("PRAGMA foreign_keys = ON;")
        .execute(&mut *conn)
        .await?;
    let mut tx = conn.begin().await?;

    // Supplier must exist — the order hangs off it (and FK ON would reject it
    // anyway). Validating here gives the renderer a typed error.
    let supplier_exists = sqlx::query("SELECT 1 FROM suppliers WHERE id = ?")
        .bind(&input.supplier_id)
        .fetch_optional(&mut *tx)
        .await?
        .is_some();
    if !supplier_exists {
        return Err(AppError::UnknownSupplier(input.supplier_id.clone()));
    }

    // Mint the PO number from the current max for this year, inside the tx.
    // Format `BC-YYYY-NNN` (matches the old `purchasesStore` minting).
    let year = year_of(&input.created_at);
    let glob = format!("BC-{}-[0-9]*", year);
    let next_num: i64 = sqlx::query(
        "SELECT COALESCE(MAX(CAST(SUBSTR(po_number, 9) AS INTEGER)), 0) + 1 AS n
           FROM purchase_orders
          WHERE po_number GLOB ?",
    )
    .bind(&glob)
    .fetch_one(&mut *tx)
    .await?
    .try_get::<i64, _>("n")?;
    let po_number = format!("BC-{}-{:03}", year, next_num);

    let order_id = Uuid::new_v4().to_string();
    let status = input.status.clone().unwrap_or_else(|| "draft".to_string());

    sqlx::query(
        "INSERT INTO purchase_orders
            (id, po_number, supplier_id, supplier_name, date, expected_date, status,
             subtotal, tax_amount, total, notes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(&order_id)
    .bind(&po_number)
    .bind(&input.supplier_id)
    .bind(&input.supplier_name)
    .bind(&input.date)
    .bind(&input.expected_date)
    .bind(&status)
    .bind(input.subtotal)
    .bind(input.tax_amount)
    .bind(input.total)
    .bind(&input.notes)
    .bind(&input.created_at)
    .execute(&mut *tx)
    .await?;

    for item in &input.items {
        sqlx::query(
            "INSERT INTO purchase_order_items
                (id, po_id, product_id, product_name, product_barcode, product_emoji,
                 ordered_qty, received_qty, purchase_price, total, expiry_date, lot_number, unit)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        )
        .bind(Uuid::new_v4().to_string())
        .bind(&order_id)
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
    }

    tx.commit().await?;

    Ok(CreatePurchaseOrderResult {
        order_id,
        po_number,
        created_at: input.created_at,
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

#[cfg(test)]
mod tests {
    use super::*;
    use sqlx::sqlite::SqlitePoolOptions;

    fn item(product_id: &str, qty: f64, price: f64) -> PurchaseOrderItemInput {
        PurchaseOrderItemInput {
            product_id: product_id.to_string(),
            product_name: format!("P-{product_id}"),
            product_barcode: String::new(),
            product_emoji: String::new(),
            ordered_qty: qty,
            received_qty: 0.0,
            purchase_price: price,
            total: qty * price,
            expiry_date: None,
            lot_number: None,
            unit: "unit".to_string(),
        }
    }

    fn base_input(items: Vec<PurchaseOrderItemInput>) -> CreatePurchaseOrderInput {
        let total: f64 = items.iter().map(|i| i.total).sum();
        CreatePurchaseOrderInput {
            items,
            supplier_id: "s1".to_string(),
            supplier_name: "Sup".to_string(),
            date: "2026-06-14".to_string(),
            expected_date: "2026-06-21".to_string(),
            status: None,
            subtotal: total,
            tax_amount: 0.0,
            total,
            notes: String::new(),
            created_at: "2026-06-14T10:00:00.000Z".to_string(),
        }
    }

    async fn schema_pool() -> Pool<Sqlite> {
        let pool = SqlitePoolOptions::new()
            .max_connections(1)
            .connect("sqlite::memory:")
            .await
            .unwrap();
        let ddl = r#"
            CREATE TABLE suppliers (id TEXT PRIMARY KEY, name TEXT);
            CREATE TABLE purchase_orders (id TEXT PRIMARY KEY, po_number TEXT NOT NULL, supplier_id TEXT,
                supplier_name TEXT, date TEXT, expected_date TEXT, status TEXT, subtotal REAL, tax_amount REAL,
                total REAL, notes TEXT, created_at TEXT);
            CREATE TABLE purchase_order_items (id TEXT PRIMARY KEY, po_id TEXT, product_id TEXT, product_name TEXT,
                product_barcode TEXT, product_emoji TEXT, ordered_qty REAL, received_qty REAL, purchase_price REAL,
                total REAL, expiry_date TEXT, lot_number TEXT, unit TEXT);
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

    async fn scalar_i64(pool: &Pool<Sqlite>, sql: &str) -> i64 {
        sqlx::query(sql).fetch_one(pool).await.unwrap().get::<i64, _>(0)
    }

    #[tokio::test]
    async fn creates_order_with_header_and_items() {
        let pool = schema_pool().await;

        let res = run_create_purchase_order(
            &pool,
            base_input(vec![item("p1", 10.0, 50.0), item("p2", 4.0, 25.0)]),
        )
        .await
        .unwrap();

        assert_eq!(res.po_number, "BC-2026-001");
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM purchase_orders").await, 1);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM purchase_order_items").await, 2);

        // Header defaults to 'draft' when none supplied, and links its items.
        let status: String = sqlx::query("SELECT status FROM purchase_orders WHERE id = ?")
            .bind(&res.order_id)
            .fetch_one(&pool)
            .await
            .unwrap()
            .get("status");
        assert_eq!(status, "draft");
        let linked = sqlx::query("SELECT COUNT(*) FROM purchase_order_items WHERE po_id = ?")
            .bind(&res.order_id)
            .fetch_one(&pool)
            .await
            .unwrap()
            .get::<i64, _>(0);
        assert_eq!(linked, 2);
    }

    #[tokio::test]
    async fn po_numbers_increment() {
        let pool = schema_pool().await;
        let r1 = run_create_purchase_order(&pool, base_input(vec![item("p1", 1.0, 10.0)])).await.unwrap();
        let r2 = run_create_purchase_order(&pool, base_input(vec![item("p1", 1.0, 10.0)])).await.unwrap();
        assert_eq!(r1.po_number, "BC-2026-001");
        assert_eq!(r2.po_number, "BC-2026-002");
    }

    #[tokio::test]
    async fn unknown_supplier_rejected_and_nothing_persists() {
        let pool = schema_pool().await;
        let mut input = base_input(vec![item("p1", 3.0, 100.0)]);
        input.supplier_id = "ghost".to_string();

        let err = run_create_purchase_order(&pool, input).await.unwrap_err();
        assert_eq!(err.code(), "UNKNOWN_SUPPLIER");

        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM purchase_orders").await, 0);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM purchase_order_items").await, 0);
    }

    #[tokio::test]
    async fn empty_order_rejected() {
        let pool = schema_pool().await;
        let err = run_create_purchase_order(&pool, base_input(vec![])).await.unwrap_err();
        assert_eq!(err.code(), "INVALID_INPUT");
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM purchase_orders").await, 0);
    }
}

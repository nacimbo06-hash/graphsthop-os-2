//! Atomic manual stock adjustment — one Tauri command, one SQLite transaction.
//!
//! Ports `productsRepo.updateStock` (`db.transaction` over the plugin pool) to a
//! single `pool.begin()` transaction: adjust `products.stock` + INSERT the
//! matching `inventory_movements` row.
//!
//! The old path had the renderer compute the new stock from a possibly-stale
//! in-memory value and write it absolutely. Here the current stock is READ
//! inside the transaction and the new value is derived from it, so a concurrent
//! adjustment can't be clobbered (SQLite serializes write transactions; the
//! read and write are one unit). The three adjustment kinds mirror the store:
//!   * `add`    → stock + qty   (movement type "restock")
//!   * `remove` → max(0, stock - qty), clamped at zero (movement type "sale")
//!   * `set`    → qty           (movement type "correction")

use serde::{Deserialize, Serialize};
use sqlx::{Connection, Pool, Row, Sqlite};
use uuid::Uuid;

use crate::db::sqlite_pool;
use crate::error::{AppError, AppResult};

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdjustStockInput {
    pub product_id: String,
    /// For `add`/`remove` this is the magnitude to apply; for `set` it is the
    /// target stock level (e.g. a physical inventory count).
    pub quantity: f64,
    /// "add" | "remove" | "set".
    #[serde(rename = "type")]
    pub adjustment_type: String,
    #[serde(default)]
    pub reference_id: Option<String>,
    /// ISO timestamp written on the product row and the movement.
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AdjustStockResult {
    pub new_stock: f64,
    pub qty_change: f64,
    pub movement_id: String,
}

/// Tauri entry point. Resolves the plugin pool, then runs the adjustment.
#[tauri::command]
pub async fn adjust_stock(
    app: tauri::AppHandle,
    input: AdjustStockInput,
) -> AppResult<AdjustStockResult> {
    let pool = sqlite_pool(&app).await?;
    run_adjust_stock(&pool, input).await
}

/// The transactional core, decoupled from Tauri for testing against a throwaway
/// pool (see the tests below).
pub async fn run_adjust_stock(
    pool: &Pool<Sqlite>,
    input: AdjustStockInput,
) -> AppResult<AdjustStockResult> {
    let mut conn = pool.acquire().await?;
    sqlx::query("PRAGMA foreign_keys = ON;")
        .execute(&mut *conn)
        .await?;
    let mut tx = conn.begin().await?;

    // Current stock — also validates the product exists.
    let current_stock: f64 = match sqlx::query("SELECT stock FROM products WHERE id = ?")
        .bind(&input.product_id)
        .fetch_optional(&mut *tx)
        .await?
    {
        Some(row) => row.try_get::<f64, _>("stock")?,
        None => return Err(AppError::UnknownProduct(input.product_id.clone())),
    };

    let (new_stock, movement_type) = match input.adjustment_type.as_str() {
        "add" => (current_stock + input.quantity, "restock"),
        // Clamp at zero so a manual removal can't drive stock negative.
        "remove" => ((current_stock - input.quantity).max(0.0), "sale"),
        "set" => (input.quantity, "correction"),
        other => {
            return Err(AppError::Invalid(match other {
                "" => "stock adjustment type is required",
                _ => "unknown stock adjustment type (expected add, remove or set)",
            }))
        }
    };
    let qty_change = new_stock - current_stock;

    sqlx::query("UPDATE products SET stock = ?, updated_at = ? WHERE id = ?")
        .bind(new_stock)
        .bind(&input.created_at)
        .bind(&input.product_id)
        .execute(&mut *tx)
        .await?;

    let movement_id = Uuid::new_v4().to_string();
    sqlx::query(
        "INSERT INTO inventory_movements
            (id, product_id, type, qty_change, stock_after, reference_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(&movement_id)
    .bind(&input.product_id)
    .bind(movement_type)
    .bind(qty_change)
    .bind(new_stock)
    .bind(input.reference_id.clone().unwrap_or_default())
    .bind(&input.created_at)
    .execute(&mut *tx)
    .await?;

    tx.commit().await?;

    Ok(AdjustStockResult {
        new_stock,
        qty_change,
        movement_id,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use sqlx::sqlite::SqlitePoolOptions;

    fn input(product_id: &str, quantity: f64, adjustment_type: &str) -> AdjustStockInput {
        AdjustStockInput {
            product_id: product_id.to_string(),
            quantity,
            adjustment_type: adjustment_type.to_string(),
            reference_id: None,
            created_at: "2026-06-14T10:00:00.000Z".to_string(),
        }
    }

    async fn schema_pool(initial_stock: f64) -> Pool<Sqlite> {
        let pool = SqlitePoolOptions::new()
            .max_connections(1)
            .connect("sqlite::memory:")
            .await
            .unwrap();
        let ddl = r#"
            CREATE TABLE products (id TEXT PRIMARY KEY, name TEXT, stock REAL NOT NULL DEFAULT 0, updated_at TEXT);
            CREATE TABLE inventory_movements (id TEXT PRIMARY KEY, product_id TEXT, type TEXT, qty_change REAL,
                stock_after REAL, reference_id TEXT, created_at TEXT);
        "#;
        for stmt in ddl.split(';').map(str::trim).filter(|s| !s.is_empty()) {
            sqlx::query(stmt).execute(&pool).await.unwrap();
        }
        sqlx::query("INSERT INTO products (id, name, stock) VALUES ('p1', 'Coca', ?)")
            .bind(initial_stock)
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

    async fn scalar_i64(pool: &Pool<Sqlite>, sql: &str) -> i64 {
        sqlx::query(sql).fetch_one(pool).await.unwrap().get::<i64, _>(0)
    }

    async fn movement_type(pool: &Pool<Sqlite>) -> String {
        sqlx::query("SELECT type FROM inventory_movements")
            .fetch_one(pool)
            .await
            .unwrap()
            .get::<String, _>("type")
    }

    #[tokio::test]
    async fn add_increases_stock_and_records_restock() {
        let pool = schema_pool(50.0).await;
        let res = run_adjust_stock(&pool, input("p1", 20.0, "add")).await.unwrap();

        assert_eq!(res.new_stock, 70.0);
        assert_eq!(res.qty_change, 20.0);
        assert_eq!(stock_of(&pool, "p1").await, 70.0);
        assert_eq!(movement_type(&pool).await, "restock");
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM inventory_movements").await, 1);
    }

    #[tokio::test]
    async fn remove_decreases_stock_and_records_sale() {
        let pool = schema_pool(50.0).await;
        let res = run_adjust_stock(&pool, input("p1", 5.0, "remove")).await.unwrap();

        assert_eq!(res.new_stock, 45.0);
        assert_eq!(res.qty_change, -5.0);
        assert_eq!(stock_of(&pool, "p1").await, 45.0);
        assert_eq!(movement_type(&pool).await, "sale");
    }

    #[tokio::test]
    async fn remove_clamps_at_zero() {
        let pool = schema_pool(50.0).await;
        let res = run_adjust_stock(&pool, input("p1", 100.0, "remove")).await.unwrap();

        assert_eq!(res.new_stock, 0.0, "stock never goes negative");
        assert_eq!(res.qty_change, -50.0, "qty_change reflects the clamped delta");
        assert_eq!(stock_of(&pool, "p1").await, 0.0);
    }

    #[tokio::test]
    async fn set_overwrites_to_target_and_records_correction() {
        let pool = schema_pool(50.0).await;
        // Physical count says 42 on the shelf.
        let res = run_adjust_stock(&pool, input("p1", 42.0, "set")).await.unwrap();

        assert_eq!(res.new_stock, 42.0);
        assert_eq!(res.qty_change, -8.0, "set records the delta from the prior stock");
        assert_eq!(stock_of(&pool, "p1").await, 42.0);
        assert_eq!(movement_type(&pool).await, "correction");
    }

    #[tokio::test]
    async fn unknown_product_rejected_and_nothing_persists() {
        let pool = schema_pool(50.0).await;
        let err = run_adjust_stock(&pool, input("ghost", 5.0, "add")).await.unwrap_err();
        assert_eq!(err.code(), "UNKNOWN_PRODUCT");

        assert_eq!(stock_of(&pool, "p1").await, 50.0);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM inventory_movements").await, 0);
    }

    #[tokio::test]
    async fn unknown_adjustment_type_rejected() {
        let pool = schema_pool(50.0).await;
        let err = run_adjust_stock(&pool, input("p1", 5.0, "frobnicate")).await.unwrap_err();
        assert_eq!(err.code(), "INVALID_INPUT");
        assert_eq!(stock_of(&pool, "p1").await, 50.0, "rejected before any write");
    }
}

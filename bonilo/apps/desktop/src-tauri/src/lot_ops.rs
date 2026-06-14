//! Atomic lot operations — Tauri commands, one SQLite transaction each.
//!
//! Ports the two `db.transaction()` call sites in `lotsRepo`:
//!   * `update_lot_with_movement` — set a lot's quantity + status and record a
//!     `lot_movements` row (used by manual reduction and disposal);
//!   * `bulk_update_lot_statuses` — persist a batch of recomputed expiry
//!     statuses (the periodic FEFO status refresh).
//!
//! Both run inside a single `pool.begin()` transaction so the writes commit or
//! roll back as one unit, the same guarantee the JS pool path could not give.

use serde::{Deserialize, Serialize};
use sqlx::{Connection, Pool, Row, Sqlite};
use uuid::Uuid;

use crate::db::sqlite_pool;
use crate::error::{AppError, AppResult};

// ───────────────────────── update_lot_with_movement ─────────────────────────

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LotMovementInput {
    #[serde(rename = "type")]
    pub movement_type: String,
    pub quantity: f64,
    #[serde(default)]
    pub reason: Option<String>,
    #[serde(default)]
    pub reference: Option<String>,
    #[serde(default)]
    pub created_by: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateLotWithMovementInput {
    pub lot_id: String,
    pub new_quantity: f64,
    pub status: String,
    pub movement: LotMovementInput,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateLotResult {
    pub lot_id: String,
    pub new_quantity: f64,
    pub movement_id: String,
}

#[tauri::command]
pub async fn update_lot_with_movement(
    app: tauri::AppHandle,
    input: UpdateLotWithMovementInput,
) -> AppResult<UpdateLotResult> {
    let pool = sqlite_pool(&app).await?;
    run_update_lot_with_movement(&pool, input).await
}

pub async fn run_update_lot_with_movement(
    pool: &Pool<Sqlite>,
    input: UpdateLotWithMovementInput,
) -> AppResult<UpdateLotResult> {
    let mut conn = pool.acquire().await?;
    sqlx::query("PRAGMA foreign_keys = ON;")
        .execute(&mut *conn)
        .await?;
    let mut tx = conn.begin().await?;

    // The movement's product_id is the lot's — derive it (and validate the lot
    // exists) rather than trusting a renderer-supplied value.
    let product_id: String = match sqlx::query("SELECT product_id FROM lots WHERE id = ?")
        .bind(&input.lot_id)
        .fetch_optional(&mut *tx)
        .await?
    {
        Some(row) => row.try_get::<String, _>("product_id")?,
        None => return Err(AppError::Invalid("unknown lot")),
    };

    sqlx::query("UPDATE lots SET quantity = ?, status = ? WHERE id = ?")
        .bind(input.new_quantity)
        .bind(&input.status)
        .bind(&input.lot_id)
        .execute(&mut *tx)
        .await?;

    let movement_id = Uuid::new_v4().to_string();
    sqlx::query(
        "INSERT INTO lot_movements
            (id, lot_id, product_id, type, quantity, reason, reference, created_by, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(&movement_id)
    .bind(&input.lot_id)
    .bind(&product_id)
    .bind(&input.movement.movement_type)
    .bind(input.movement.quantity)
    .bind(input.movement.reason.clone().unwrap_or_default())
    .bind(input.movement.reference.clone().unwrap_or_default())
    .bind(input.movement.created_by.clone().unwrap_or_default())
    .bind(&input.movement.created_at)
    .execute(&mut *tx)
    .await?;

    tx.commit().await?;

    Ok(UpdateLotResult {
        lot_id: input.lot_id,
        new_quantity: input.new_quantity,
        movement_id,
    })
}

// ───────────────────────── bulk_update_lot_statuses ─────────────────────────

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LotStatusUpdate {
    pub id: String,
    pub status: String,
    pub days_remaining: i64,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BulkUpdateLotStatusesInput {
    pub updates: Vec<LotStatusUpdate>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BulkUpdateLotStatusesResult {
    pub updated: i64,
}

#[tauri::command]
pub async fn bulk_update_lot_statuses(
    app: tauri::AppHandle,
    input: BulkUpdateLotStatusesInput,
) -> AppResult<BulkUpdateLotStatusesResult> {
    let pool = sqlite_pool(&app).await?;
    run_bulk_update_lot_statuses(&pool, input).await
}

pub async fn run_bulk_update_lot_statuses(
    pool: &Pool<Sqlite>,
    input: BulkUpdateLotStatusesInput,
) -> AppResult<BulkUpdateLotStatusesResult> {
    if input.updates.is_empty() {
        return Ok(BulkUpdateLotStatusesResult { updated: 0 });
    }

    let mut conn = pool.acquire().await?;
    let mut tx = conn.begin().await?;

    let mut updated: i64 = 0;
    for u in &input.updates {
        let res = sqlx::query("UPDATE lots SET status = ?, days_remaining = ? WHERE id = ?")
            .bind(&u.status)
            .bind(u.days_remaining)
            .bind(&u.id)
            .execute(&mut *tx)
            .await?;
        updated += res.rows_affected() as i64;
    }

    tx.commit().await?;

    Ok(BulkUpdateLotStatusesResult { updated })
}

#[cfg(test)]
mod tests {
    use super::*;
    use sqlx::sqlite::SqlitePoolOptions;

    async fn schema_pool() -> Pool<Sqlite> {
        let pool = SqlitePoolOptions::new()
            .max_connections(1)
            .connect("sqlite::memory:")
            .await
            .unwrap();
        let ddl = r#"
            CREATE TABLE lots (id TEXT PRIMARY KEY, product_id TEXT, quantity REAL, status TEXT,
                days_remaining INTEGER, expiry_date TEXT, created_at TEXT);
            CREATE TABLE lot_movements (id TEXT PRIMARY KEY, lot_id TEXT, product_id TEXT, type TEXT, quantity REAL,
                reason TEXT, reference TEXT, created_by TEXT, created_at TEXT);
        "#;
        for stmt in ddl.split(';').map(str::trim).filter(|s| !s.is_empty()) {
            sqlx::query(stmt).execute(&pool).await.unwrap();
        }
        sqlx::query(
            "INSERT INTO lots (id, product_id, quantity, status, days_remaining, expiry_date)
             VALUES ('lot1', 'p1', 10, 'ok', 30, '2026-07-14')",
        )
        .execute(&pool)
        .await
        .unwrap();
        pool
    }

    fn movement(movement_type: &str, quantity: f64) -> LotMovementInput {
        LotMovementInput {
            movement_type: movement_type.to_string(),
            quantity,
            reason: Some("test".to_string()),
            reference: None,
            created_by: Some("staff".to_string()),
            created_at: "2026-06-14T10:00:00.000Z".to_string(),
        }
    }

    async fn lot_qty(pool: &Pool<Sqlite>, id: &str) -> f64 {
        sqlx::query("SELECT quantity FROM lots WHERE id = ?")
            .bind(id)
            .fetch_one(pool)
            .await
            .unwrap()
            .get::<f64, _>("quantity")
    }

    async fn scalar_i64(pool: &Pool<Sqlite>, sql: &str) -> i64 {
        sqlx::query(sql).fetch_one(pool).await.unwrap().get::<i64, _>(0)
    }

    #[tokio::test]
    async fn reduces_quantity_and_records_movement() {
        let pool = schema_pool().await;
        let res = run_update_lot_with_movement(
            &pool,
            UpdateLotWithMovementInput {
                lot_id: "lot1".to_string(),
                new_quantity: 7.0,
                status: "ok".to_string(),
                movement: movement("sale", -3.0),
            },
        )
        .await
        .unwrap();

        assert_eq!(res.new_quantity, 7.0);
        assert_eq!(lot_qty(&pool, "lot1").await, 7.0);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM lot_movements").await, 1);
        // product_id is derived from the lot, not the caller.
        let pid: String = sqlx::query("SELECT product_id FROM lot_movements")
            .fetch_one(&pool)
            .await
            .unwrap()
            .get("product_id");
        assert_eq!(pid, "p1");
    }

    #[tokio::test]
    async fn disposal_zeroes_quantity_and_sets_expired() {
        let pool = schema_pool().await;
        run_update_lot_with_movement(
            &pool,
            UpdateLotWithMovementInput {
                lot_id: "lot1".to_string(),
                new_quantity: 0.0,
                status: "expired".to_string(),
                movement: movement("disposal", -10.0),
            },
        )
        .await
        .unwrap();

        assert_eq!(lot_qty(&pool, "lot1").await, 0.0);
        let status: String = sqlx::query("SELECT status FROM lots WHERE id = 'lot1'")
            .fetch_one(&pool)
            .await
            .unwrap()
            .get("status");
        assert_eq!(status, "expired");
    }

    #[tokio::test]
    async fn unknown_lot_rejected_and_nothing_persists() {
        let pool = schema_pool().await;
        let err = run_update_lot_with_movement(
            &pool,
            UpdateLotWithMovementInput {
                lot_id: "ghost".to_string(),
                new_quantity: 0.0,
                status: "expired".to_string(),
                movement: movement("disposal", -1.0),
            },
        )
        .await
        .unwrap_err();
        assert_eq!(err.code(), "INVALID_INPUT");
        assert_eq!(lot_qty(&pool, "lot1").await, 10.0, "real lot untouched");
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM lot_movements").await, 0);
    }

    #[tokio::test]
    async fn bulk_update_applies_statuses() {
        let pool = schema_pool().await;
        sqlx::query(
            "INSERT INTO lots (id, product_id, quantity, status, days_remaining, expiry_date)
             VALUES ('lot2', 'p2', 5, 'ok', 20, '2026-07-04')",
        )
        .execute(&pool)
        .await
        .unwrap();

        let res = run_bulk_update_lot_statuses(
            &pool,
            BulkUpdateLotStatusesInput {
                updates: vec![
                    LotStatusUpdate { id: "lot1".to_string(), status: "critical".to_string(), days_remaining: 2 },
                    LotStatusUpdate { id: "lot2".to_string(), status: "warning".to_string(), days_remaining: 6 },
                ],
            },
        )
        .await
        .unwrap();

        assert_eq!(res.updated, 2);
        let s1: String = sqlx::query("SELECT status FROM lots WHERE id = 'lot1'")
            .fetch_one(&pool).await.unwrap().get("status");
        assert_eq!(s1, "critical");
    }

    #[tokio::test]
    async fn bulk_update_empty_is_a_noop() {
        let pool = schema_pool().await;
        let res = run_bulk_update_lot_statuses(&pool, BulkUpdateLotStatusesInput { updates: vec![] })
            .await
            .unwrap();
        assert_eq!(res.updated, 0);
    }
}

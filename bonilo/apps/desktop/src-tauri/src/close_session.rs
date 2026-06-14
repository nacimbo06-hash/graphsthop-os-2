//! Atomic cash-session closure & bulk transfers — one Tauri command.
//!
//! Ports the last two `db.transaction()` users on the treasury side:
//!   * `treasuryRepo.recordSessionClosure` — close a session and post all of its
//!     end-of-day transfers; and
//!   * the facade's inline `performBulkTransfers` — the same set of transfers
//!     without the session-closure update.
//!
//! Both are the same shape: an optional session-closure update plus a list of
//! transfers (each a cash movement, optionally paired with a safe deposit or a
//! sinking-fund contribution). One `pool.begin()` transaction covers the lot,
//! so a day can't half-close. Fund balances are credited as DELTAs.

use serde::Deserialize;
use sqlx::{Connection, Pool, Sqlite};

use crate::db::sqlite_pool;
use crate::error::{AppError, AppResult};

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SessionClosureUpdate {
    pub closing_amount: f64,
    pub expected_amount: f64,
    pub difference: f64,
    pub closed_at: String,
    pub notes: String,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SessionTransferInput {
    pub movement_id: String,
    /// "transfer_to_safe" | "transfer_to_provision".
    pub movement_type: String,
    pub amount: f64,
    pub movement_reason: String,
    #[serde(default)]
    pub provision_type: String,
    pub created_by: String,
    pub created_at: String,
    // Safe leg.
    #[serde(default)]
    pub safe_tx_id: Option<String>,
    #[serde(default)]
    pub safe_reason: Option<String>,
    // Fund leg.
    #[serde(default)]
    pub fund_tx_id: Option<String>,
    #[serde(default)]
    pub fund_id: Option<String>,
    #[serde(default)]
    pub fund_reason: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CloseSessionInput {
    pub session_id: String,
    /// Present when closing the day; absent for a plain bulk transfer.
    #[serde(default)]
    pub closure: Option<SessionClosureUpdate>,
    pub transfers: Vec<SessionTransferInput>,
}

#[tauri::command]
pub async fn close_session(app: tauri::AppHandle, input: CloseSessionInput) -> AppResult<()> {
    let pool = sqlite_pool(&app).await?;
    run_close_session(&pool, input).await
}

pub async fn run_close_session(pool: &Pool<Sqlite>, input: CloseSessionInput) -> AppResult<()> {
    let mut conn = pool.acquire().await?;
    sqlx::query("PRAGMA foreign_keys = ON;").execute(&mut *conn).await?;
    let mut tx = conn.begin().await?;

    // 1. Close the session (when this is a day-closure).
    if let Some(c) = &input.closure {
        let res = sqlx::query(
            "UPDATE cash_sessions
                SET closing_amount = ?, expected_amount = ?, difference = ?, status = 'closed',
                    closed_at = ?, notes = ?
              WHERE id = ?",
        )
        .bind(c.closing_amount)
        .bind(c.expected_amount)
        .bind(c.difference)
        .bind(&c.closed_at)
        .bind(&c.notes)
        .bind(&input.session_id)
        .execute(&mut *tx)
        .await?;
        if res.rows_affected() == 0 {
            return Err(AppError::Invalid("unknown cash session"));
        }
    }

    // 2. Post every transfer.
    for t in &input.transfers {
        sqlx::query(
            "INSERT INTO cash_movements
                (id, session_id, type, amount, reason, provision_type, created_by, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        )
        .bind(&t.movement_id)
        .bind(&input.session_id)
        .bind(&t.movement_type)
        .bind(t.amount)
        .bind(&t.movement_reason)
        .bind(&t.provision_type)
        .bind(&t.created_by)
        .bind(&t.created_at)
        .execute(&mut *tx)
        .await?;

        if let Some(safe_tx_id) = t.safe_tx_id.as_ref() {
            sqlx::query(
                "INSERT INTO safe_transactions (id, type, amount, reason, performed_by, created_at)
                 VALUES (?, 'deposit', ?, ?, ?, ?)",
            )
            .bind(safe_tx_id)
            .bind(t.amount)
            .bind(t.safe_reason.clone().unwrap_or_default())
            .bind(&t.created_by)
            .bind(&t.created_at)
            .execute(&mut *tx)
            .await?;
        }

        if let (Some(fund_tx_id), Some(fund_id)) = (t.fund_tx_id.as_ref(), t.fund_id.as_ref()) {
            sqlx::query(
                "INSERT INTO sinking_fund_transactions (id, fund_id, type, amount, reason, performed_by, created_at)
                 VALUES (?, ?, 'contribution', ?, ?, ?, ?)",
            )
            .bind(fund_tx_id)
            .bind(fund_id)
            .bind(t.amount)
            .bind(t.fund_reason.clone().unwrap_or_default())
            .bind(&t.created_by)
            .bind(&t.created_at)
            .execute(&mut *tx)
            .await?;

            let res = sqlx::query(
                "UPDATE sinking_funds SET current_balance = current_balance + ?, last_contribution = ? WHERE id = ?",
            )
            .bind(t.amount)
            .bind(&t.created_at)
            .bind(fund_id)
            .execute(&mut *tx)
            .await?;
            if res.rows_affected() == 0 {
                return Err(AppError::Invalid("unknown sinking fund"));
            }
        }
    }

    tx.commit().await?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use sqlx::sqlite::SqlitePoolOptions;
    use sqlx::Row;

    async fn schema_pool() -> Pool<Sqlite> {
        let pool = SqlitePoolOptions::new()
            .max_connections(1)
            .connect("sqlite::memory:")
            .await
            .unwrap();
        let ddl = r#"
            CREATE TABLE cash_sessions (id TEXT PRIMARY KEY, status TEXT, closing_amount REAL, expected_amount REAL,
                difference REAL, closed_at TEXT, notes TEXT);
            CREATE TABLE cash_movements (id TEXT PRIMARY KEY, session_id TEXT, type TEXT, amount REAL, reason TEXT,
                provision_type TEXT, created_by TEXT, created_at TEXT);
            CREATE TABLE safe_transactions (id TEXT PRIMARY KEY, type TEXT, amount REAL, reason TEXT,
                performed_by TEXT, created_at TEXT);
            CREATE TABLE sinking_funds (id TEXT PRIMARY KEY, name TEXT, current_balance REAL NOT NULL DEFAULT 0,
                last_contribution TEXT);
            CREATE TABLE sinking_fund_transactions (id TEXT PRIMARY KEY, fund_id TEXT, type TEXT, amount REAL,
                reason TEXT, performed_by TEXT, created_at TEXT);
        "#;
        for stmt in ddl.split(';').map(str::trim).filter(|s| !s.is_empty()) {
            sqlx::query(stmt).execute(&pool).await.unwrap();
        }
        sqlx::query("INSERT INTO cash_sessions (id, status) VALUES ('sess1', 'open')")
            .execute(&pool)
            .await
            .unwrap();
        sqlx::query("INSERT INTO sinking_funds (id, name, current_balance) VALUES ('f1', 'Loyer', 1000)")
            .execute(&pool)
            .await
            .unwrap();
        pool
    }

    async fn scalar_i64(pool: &Pool<Sqlite>, sql: &str) -> i64 {
        sqlx::query(sql).fetch_one(pool).await.unwrap().get::<i64, _>(0)
    }

    async fn fund_balance(pool: &Pool<Sqlite>, id: &str) -> f64 {
        sqlx::query("SELECT current_balance FROM sinking_funds WHERE id = ?")
            .bind(id)
            .fetch_one(pool)
            .await
            .unwrap()
            .get::<f64, _>("current_balance")
    }

    fn safe_transfer() -> SessionTransferInput {
        SessionTransferInput {
            movement_id: "m_safe".into(),
            movement_type: "transfer_to_safe".into(),
            amount: 500.0,
            movement_reason: "Clôture journée (Coffre)".into(),
            provision_type: String::new(),
            created_by: "staff".into(),
            created_at: "2026-06-14T20:00:00.000Z".into(),
            safe_tx_id: Some("sf1".into()),
            safe_reason: Some("Clôture journée".into()),
            fund_tx_id: None,
            fund_id: None,
            fund_reason: None,
        }
    }

    fn fund_transfer() -> SessionTransferInput {
        SessionTransferInput {
            movement_id: "m_fund".into(),
            movement_type: "transfer_to_provision".into(),
            amount: 300.0,
            movement_reason: "Clôture journée (Loyer)".into(),
            provision_type: "rent".into(),
            created_by: "staff".into(),
            created_at: "2026-06-14T20:00:00.000Z".into(),
            safe_tx_id: None,
            safe_reason: None,
            fund_tx_id: Some("ft1".into()),
            fund_id: Some("f1".into()),
            fund_reason: Some("Clôture journée".into()),
        }
    }

    fn closure() -> SessionClosureUpdate {
        SessionClosureUpdate {
            closing_amount: 4200.0,
            expected_amount: 4200.0,
            difference: 0.0,
            closed_at: "2026-06-14T20:00:00.000Z".into(),
            notes: "RAS".into(),
        }
    }

    #[tokio::test]
    async fn closes_session_and_posts_all_transfers() {
        let pool = schema_pool().await;

        run_close_session(
            &pool,
            CloseSessionInput {
                session_id: "sess1".into(),
                closure: Some(closure()),
                transfers: vec![safe_transfer(), fund_transfer()],
            },
        )
        .await
        .unwrap();

        let status: String = sqlx::query("SELECT status FROM cash_sessions WHERE id = 'sess1'")
            .fetch_one(&pool).await.unwrap().get("status");
        assert_eq!(status, "closed");
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM cash_movements").await, 2);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM safe_transactions").await, 1);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM sinking_fund_transactions").await, 1);
        assert_eq!(fund_balance(&pool, "f1").await, 1300.0, "fund credited by the delta");
    }

    #[tokio::test]
    async fn bulk_transfer_without_closure_leaves_session_open() {
        let pool = schema_pool().await;

        run_close_session(
            &pool,
            CloseSessionInput {
                session_id: "sess1".into(),
                closure: None,
                transfers: vec![safe_transfer()],
            },
        )
        .await
        .unwrap();

        let status: String = sqlx::query("SELECT status FROM cash_sessions WHERE id = 'sess1'")
            .fetch_one(&pool).await.unwrap().get("status");
        assert_eq!(status, "open", "no closure ⇒ session stays open");
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM safe_transactions").await, 1);
    }

    #[tokio::test]
    async fn unknown_session_rolls_back_everything() {
        let pool = schema_pool().await;

        let err = run_close_session(
            &pool,
            CloseSessionInput {
                session_id: "ghost".into(),
                closure: Some(closure()),
                transfers: vec![safe_transfer()],
            },
        )
        .await
        .unwrap_err();
        assert_eq!(err.code(), "INVALID_INPUT");

        // The closure UPDATE matched no rows and bailed before any transfer.
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM cash_movements").await, 0);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM safe_transactions").await, 0);
    }

    #[tokio::test]
    async fn closure_with_no_transfers_just_closes() {
        let pool = schema_pool().await;
        run_close_session(
            &pool,
            CloseSessionInput { session_id: "sess1".into(), closure: Some(closure()), transfers: vec![] },
        )
        .await
        .unwrap();

        let diff: f64 = sqlx::query("SELECT difference FROM cash_sessions WHERE id = 'sess1'")
            .fetch_one(&pool).await.unwrap().get("difference");
        assert_eq!(diff, 0.0);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM cash_movements").await, 0);
    }
}

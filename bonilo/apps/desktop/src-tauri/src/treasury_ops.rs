//! Atomic treasury operations — Tauri commands, one SQLite transaction each.
//!
//! Ports the three `db.transaction()` call sites in `treasuryRepo`:
//!   * `transfer_to_safe`     — cash drawer → safe;
//!   * `contribute_to_fund`   — cash drawer → a sinking fund;
//!   * `record_expense_payment` — settle an expense from cash, the safe, or a
//!     provision fund.
//!
//! Each runs inside one `pool.begin()` transaction. Sinking-fund balances are
//! applied as DELTAs (`current_balance ± amount`) rather than the renderer
//! writing a precomputed absolute, so a concurrent contribution/withdrawal
//! can't be clobbered (the same fix the other money flows got).

use serde::Deserialize;
use sqlx::{Connection, Pool, Sqlite};

use crate::db::sqlite_pool;
use crate::error::{AppError, AppResult};

// ───────────────────────────── transfer_to_safe ─────────────────────────────

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TransferToSafeInput {
    pub movement_id: String,
    pub session_id: String,
    pub amount: f64,
    pub movement_reason: String,
    pub safe_tx_id: String,
    pub safe_reason: String,
    pub performed_by: String,
    pub created_at: String,
}

#[tauri::command]
pub async fn transfer_to_safe(app: tauri::AppHandle, input: TransferToSafeInput) -> AppResult<()> {
    let pool = sqlite_pool(&app).await?;
    run_transfer_to_safe(&pool, input).await
}

pub async fn run_transfer_to_safe(pool: &Pool<Sqlite>, input: TransferToSafeInput) -> AppResult<()> {
    let mut conn = pool.acquire().await?;
    sqlx::query("PRAGMA foreign_keys = ON;").execute(&mut *conn).await?;
    let mut tx = conn.begin().await?;

    sqlx::query(
        "INSERT INTO cash_movements (id, session_id, type, amount, reason, created_by, created_at)
         VALUES (?, ?, 'transfer_to_safe', ?, ?, ?, ?)",
    )
    .bind(&input.movement_id)
    .bind(&input.session_id)
    .bind(input.amount)
    .bind(&input.movement_reason)
    .bind(&input.performed_by)
    .bind(&input.created_at)
    .execute(&mut *tx)
    .await?;

    sqlx::query(
        "INSERT INTO safe_transactions (id, type, amount, reason, performed_by, created_at)
         VALUES (?, 'deposit', ?, ?, ?, ?)",
    )
    .bind(&input.safe_tx_id)
    .bind(input.amount)
    .bind(&input.safe_reason)
    .bind(&input.performed_by)
    .bind(&input.created_at)
    .execute(&mut *tx)
    .await?;

    tx.commit().await?;
    Ok(())
}

// ──────────────────────────── contribute_to_fund ────────────────────────────

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContributeToFundInput {
    pub movement_id: String,
    pub session_id: String,
    pub amount: f64,
    pub movement_reason: String,
    pub provision_type: String,
    pub fund_tx_id: String,
    pub fund_id: String,
    pub fund_reason: String,
    pub performed_by: String,
    pub created_at: String,
}

#[tauri::command]
pub async fn contribute_to_fund(
    app: tauri::AppHandle,
    input: ContributeToFundInput,
) -> AppResult<()> {
    let pool = sqlite_pool(&app).await?;
    run_contribute_to_fund(&pool, input).await
}

pub async fn run_contribute_to_fund(
    pool: &Pool<Sqlite>,
    input: ContributeToFundInput,
) -> AppResult<()> {
    let mut conn = pool.acquire().await?;
    sqlx::query("PRAGMA foreign_keys = ON;").execute(&mut *conn).await?;
    let mut tx = conn.begin().await?;

    sqlx::query(
        "INSERT INTO cash_movements (id, session_id, type, amount, reason, provision_type, created_by, created_at)
         VALUES (?, ?, 'transfer_to_provision', ?, ?, ?, ?, ?)",
    )
    .bind(&input.movement_id)
    .bind(&input.session_id)
    .bind(input.amount)
    .bind(&input.movement_reason)
    .bind(&input.provision_type)
    .bind(&input.performed_by)
    .bind(&input.created_at)
    .execute(&mut *tx)
    .await?;

    sqlx::query(
        "INSERT INTO sinking_fund_transactions (id, fund_id, type, amount, reason, performed_by, created_at)
         VALUES (?, ?, 'contribution', ?, ?, ?, ?)",
    )
    .bind(&input.fund_tx_id)
    .bind(&input.fund_id)
    .bind(input.amount)
    .bind(&input.fund_reason)
    .bind(&input.performed_by)
    .bind(&input.created_at)
    .execute(&mut *tx)
    .await?;

    // Delta, not an absolute write.
    let res = sqlx::query(
        "UPDATE sinking_funds SET current_balance = current_balance + ?, last_contribution = ? WHERE id = ?",
    )
    .bind(input.amount)
    .bind(&input.created_at)
    .bind(&input.fund_id)
    .execute(&mut *tx)
    .await?;
    if res.rows_affected() == 0 {
        return Err(AppError::Invalid("unknown sinking fund"));
    }

    tx.commit().await?;
    Ok(())
}

// ──────────────────────────── record_expense_payment ────────────────────────

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecordExpensePaymentInput {
    pub expense_id: String,
    pub amount: f64,
    /// "cash" | "safe" | "provision".
    pub paid_from: String,
    pub reason: String,
    pub performed_by: String,
    pub created_at: String,
    // cash branch
    #[serde(default)]
    pub session_id: Option<String>,
    #[serde(default)]
    pub movement_id: Option<String>,
    // safe branch
    #[serde(default)]
    pub safe_tx_id: Option<String>,
    // provision branch
    #[serde(default)]
    pub fund_tx_id: Option<String>,
    #[serde(default)]
    pub fund_id: Option<String>,
}

#[tauri::command]
pub async fn record_expense_payment(
    app: tauri::AppHandle,
    input: RecordExpensePaymentInput,
) -> AppResult<()> {
    let pool = sqlite_pool(&app).await?;
    run_record_expense_payment(&pool, input).await
}

pub async fn run_record_expense_payment(
    pool: &Pool<Sqlite>,
    input: RecordExpensePaymentInput,
) -> AppResult<()> {
    let mut conn = pool.acquire().await?;
    sqlx::query("PRAGMA foreign_keys = ON;").execute(&mut *conn).await?;
    let mut tx = conn.begin().await?;

    // 1. Mark the expense paid (also validates it exists).
    let res = sqlx::query(
        "UPDATE expenses SET is_paid = 1, paid_from = ?, payment_method = ? WHERE id = ?",
    )
    .bind(&input.paid_from)
    .bind(&input.paid_from)
    .bind(&input.expense_id)
    .execute(&mut *tx)
    .await?;
    if res.rows_affected() == 0 {
        return Err(AppError::Invalid("unknown expense"));
    }

    // 2. Record the financial impact for the chosen source.
    match input.paid_from.as_str() {
        "cash" => {
            // Only when there is an open session (mirrors the facade guard).
            if let (Some(session_id), Some(movement_id)) =
                (input.session_id.as_ref(), input.movement_id.as_ref())
            {
                sqlx::query(
                    "INSERT INTO cash_movements (id, session_id, type, amount, reason, created_by, created_at)
                     VALUES (?, ?, 'expense', ?, ?, ?, ?)",
                )
                .bind(movement_id)
                .bind(session_id)
                .bind(input.amount)
                .bind(&input.reason)
                .bind(&input.performed_by)
                .bind(&input.created_at)
                .execute(&mut *tx)
                .await?;
            }
        }
        "safe" => {
            if let Some(safe_tx_id) = input.safe_tx_id.as_ref() {
                sqlx::query(
                    "INSERT INTO safe_transactions (id, type, amount, reason, performed_by, created_at)
                     VALUES (?, 'withdrawal', ?, ?, ?, ?)",
                )
                .bind(safe_tx_id)
                .bind(input.amount)
                .bind(&input.reason)
                .bind(&input.performed_by)
                .bind(&input.created_at)
                .execute(&mut *tx)
                .await?;
            }
        }
        "provision" => {
            if let (Some(fund_tx_id), Some(fund_id)) =
                (input.fund_tx_id.as_ref(), input.fund_id.as_ref())
            {
                sqlx::query(
                    "INSERT INTO sinking_fund_transactions (id, fund_id, type, amount, reason, performed_by, created_at)
                     VALUES (?, ?, 'withdrawal', ?, ?, ?, ?)",
                )
                .bind(fund_tx_id)
                .bind(fund_id)
                .bind(input.amount)
                .bind(&input.reason)
                .bind(&input.performed_by)
                .bind(&input.created_at)
                .execute(&mut *tx)
                .await?;

                // Delta withdrawal from the fund.
                sqlx::query("UPDATE sinking_funds SET current_balance = current_balance - ? WHERE id = ?")
                    .bind(input.amount)
                    .bind(fund_id)
                    .execute(&mut *tx)
                    .await?;
            }
        }
        other => {
            return Err(AppError::Invalid(match other {
                "" => "expense payment source is required",
                _ => "unknown expense payment source (expected cash, safe or provision)",
            }))
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
            CREATE TABLE cash_movements (id TEXT PRIMARY KEY, session_id TEXT, type TEXT, amount REAL, reason TEXT,
                category TEXT, reference TEXT, provision_type TEXT, created_by TEXT, payment_method TEXT, created_at TEXT);
            CREATE TABLE safe_transactions (id TEXT PRIMARY KEY, type TEXT, amount REAL, reason TEXT,
                performed_by TEXT, created_at TEXT);
            CREATE TABLE sinking_funds (id TEXT PRIMARY KEY, name TEXT, current_balance REAL NOT NULL DEFAULT 0,
                last_contribution TEXT, created_at TEXT);
            CREATE TABLE sinking_fund_transactions (id TEXT PRIMARY KEY, fund_id TEXT, type TEXT, amount REAL,
                reason TEXT, performed_by TEXT, created_at TEXT);
            CREATE TABLE expenses (id TEXT PRIMARY KEY, category TEXT, description TEXT, amount REAL,
                payment_method TEXT, is_paid INTEGER NOT NULL DEFAULT 0, paid_from TEXT, created_at TEXT);
        "#;
        for stmt in ddl.split(';').map(str::trim).filter(|s| !s.is_empty()) {
            sqlx::query(stmt).execute(&pool).await.unwrap();
        }
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

    #[tokio::test]
    async fn transfer_to_safe_writes_both_rows() {
        let pool = schema_pool().await;
        run_transfer_to_safe(
            &pool,
            TransferToSafeInput {
                movement_id: "m1".into(),
                session_id: "s1".into(),
                amount: 1000.0,
                movement_reason: "Transfert vers coffre: surplus".into(),
                safe_tx_id: "sf1".into(),
                safe_reason: "surplus".into(),
                performed_by: "staff".into(),
                created_at: "2026-06-14T10:00:00.000Z".into(),
            },
        )
        .await
        .unwrap();

        assert_eq!(
            scalar_i64(&pool, "SELECT COUNT(*) FROM cash_movements WHERE type = 'transfer_to_safe'").await,
            1
        );
        assert_eq!(
            scalar_i64(&pool, "SELECT COUNT(*) FROM safe_transactions WHERE type = 'deposit'").await,
            1
        );
    }

    #[tokio::test]
    async fn contribute_to_fund_credits_balance_as_delta() {
        let pool = schema_pool().await;
        sqlx::query("INSERT INTO sinking_funds (id, name, current_balance) VALUES ('f1', 'Loyer', 500)")
            .execute(&pool)
            .await
            .unwrap();

        run_contribute_to_fund(
            &pool,
            ContributeToFundInput {
                movement_id: "m1".into(),
                session_id: "s1".into(),
                amount: 300.0,
                movement_reason: "Provision Loyer".into(),
                provision_type: "rent".into(),
                fund_tx_id: "ft1".into(),
                fund_id: "f1".into(),
                fund_reason: "mensuel".into(),
                performed_by: "staff".into(),
                created_at: "2026-06-14T10:00:00.000Z".into(),
            },
        )
        .await
        .unwrap();

        assert_eq!(fund_balance(&pool, "f1").await, 800.0);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM cash_movements WHERE type = 'transfer_to_provision'").await, 1);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM sinking_fund_transactions").await, 1);
    }

    #[tokio::test]
    async fn contribute_to_unknown_fund_rolls_back() {
        let pool = schema_pool().await;
        let err = run_contribute_to_fund(
            &pool,
            ContributeToFundInput {
                movement_id: "m1".into(),
                session_id: "s1".into(),
                amount: 300.0,
                movement_reason: "x".into(),
                provision_type: "rent".into(),
                fund_tx_id: "ft1".into(),
                fund_id: "ghost".into(),
                fund_reason: "y".into(),
                performed_by: "staff".into(),
                created_at: "2026-06-14T10:00:00.000Z".into(),
            },
        )
        .await
        .unwrap_err();
        assert_eq!(err.code(), "INVALID_INPUT");
        // Whole transaction rolled back — no movement or fund tx persisted.
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM cash_movements").await, 0);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM sinking_fund_transactions").await, 0);
    }

    fn expense_input(paid_from: &str) -> RecordExpensePaymentInput {
        RecordExpensePaymentInput {
            expense_id: "e1".into(),
            amount: 250.0,
            paid_from: paid_from.into(),
            reason: "Paiement depense: test".into(),
            performed_by: "staff".into(),
            created_at: "2026-06-14T10:00:00.000Z".into(),
            session_id: None,
            movement_id: None,
            safe_tx_id: None,
            fund_tx_id: None,
            fund_id: None,
        }
    }

    async fn seed_expense(pool: &Pool<Sqlite>) {
        sqlx::query("INSERT INTO expenses (id, category, description, amount, is_paid) VALUES ('e1', 'Achats', 'x', 250, 0)")
            .execute(pool)
            .await
            .unwrap();
    }

    #[tokio::test]
    async fn expense_paid_from_cash_marks_paid_and_posts_movement() {
        let pool = schema_pool().await;
        seed_expense(&pool).await;

        let mut input = expense_input("cash");
        input.session_id = Some("s1".into());
        input.movement_id = Some("m1".into());
        run_record_expense_payment(&pool, input).await.unwrap();

        assert_eq!(scalar_i64(&pool, "SELECT is_paid FROM expenses WHERE id = 'e1'").await, 1);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM cash_movements WHERE type = 'expense'").await, 1);
    }

    #[tokio::test]
    async fn expense_paid_from_provision_debits_fund_as_delta() {
        let pool = schema_pool().await;
        seed_expense(&pool).await;
        sqlx::query("INSERT INTO sinking_funds (id, name, current_balance) VALUES ('f1', 'Loyer', 1000)")
            .execute(&pool)
            .await
            .unwrap();

        let mut input = expense_input("provision");
        input.fund_tx_id = Some("ft1".into());
        input.fund_id = Some("f1".into());
        run_record_expense_payment(&pool, input).await.unwrap();

        assert_eq!(fund_balance(&pool, "f1").await, 750.0);
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM sinking_fund_transactions WHERE type = 'withdrawal'").await, 1);
    }

    #[tokio::test]
    async fn expense_payment_unknown_expense_rejected() {
        let pool = schema_pool().await;
        // No expense seeded.
        let mut input = expense_input("cash");
        input.session_id = Some("s1".into());
        input.movement_id = Some("m1".into());
        let err = run_record_expense_payment(&pool, input).await.unwrap_err();
        assert_eq!(err.code(), "INVALID_INPUT");
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM cash_movements").await, 0);
    }
}

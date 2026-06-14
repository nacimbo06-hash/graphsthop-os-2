//! Atomic customer credit transaction — one Tauri command, one SQLite tx.
//!
//! Ports `customersRepo.addCreditTransaction` (`db.transaction` over the plugin
//! pool) to a single `pool.begin()` transaction: INSERT a `credit_transactions`
//! row + adjust the customer's balance. Covers all three transaction kinds the
//! store uses — `payment` (debt down), `purchase` (debt up), `adjustment` —
//! via a single signed `amount`.
//!
//! Fixes carried over from the old JS path:
//!   * the balance is applied as a **DELTA** (`current_balance + amount`)
//!     instead of the renderer computing `newBalance` from a possibly-stale
//!     in-memory value and writing it absolutely (the clobber the audit flagged,
//!     the same one `checkout_sale` fixed for credit sales);
//!   * the authoritative resulting balance is returned, so the store reflects
//!     the DB truth rather than re-deriving it.

use serde::{Deserialize, Serialize};
use sqlx::{Connection, Pool, Row, Sqlite};
use uuid::Uuid;

use crate::db::sqlite_pool;
use crate::error::{AppError, AppResult};

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecordCreditTransactionInput {
    pub customer_id: String,
    /// Signed: positive raises the balance (purchase), negative lowers it
    /// (payment). `adjustment` may be either sign.
    pub amount: f64,
    /// "payment" | "purchase" | "adjustment".
    #[serde(rename = "type")]
    pub tx_type: String,
    /// Transaction date (ISO), stored on the ledger row.
    pub date: String,
    #[serde(default)]
    pub sale_id: Option<String>,
    #[serde(default)]
    pub notes: Option<String>,
    /// ISO timestamp for the customer row's `updated_at` (and the
    /// `last_payment_date` when this is a payment).
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RecordCreditTransactionResult {
    pub transaction_id: String,
    /// The customer's balance after the delta is applied.
    pub new_balance: f64,
    /// Set to `created_at` when this was a payment; otherwise null (the existing
    /// value is preserved in the DB via COALESCE).
    pub last_payment_date: Option<String>,
}

/// Tauri entry point. Resolves the plugin pool, then runs the transaction.
#[tauri::command]
pub async fn record_credit_transaction(
    app: tauri::AppHandle,
    input: RecordCreditTransactionInput,
) -> AppResult<RecordCreditTransactionResult> {
    let pool = sqlite_pool(&app).await?;
    run_record_credit_transaction(&pool, input).await
}

/// The transactional core, decoupled from Tauri for testing against a throwaway
/// pool (see the tests below).
pub async fn run_record_credit_transaction(
    pool: &Pool<Sqlite>,
    input: RecordCreditTransactionInput,
) -> AppResult<RecordCreditTransactionResult> {
    let mut conn = pool.acquire().await?;
    sqlx::query("PRAGMA foreign_keys = ON;")
        .execute(&mut *conn)
        .await?;
    let mut tx = conn.begin().await?;

    // Current balance — also validates the customer exists. Inside the
    // transaction on a single connection, no writer can interleave, so deriving
    // the result from this read is consistent with the delta UPDATE below.
    let current_balance: f64 =
        match sqlx::query("SELECT current_balance FROM customers WHERE id = ?")
            .bind(&input.customer_id)
            .fetch_optional(&mut *tx)
            .await?
        {
            Some(row) => row.try_get::<f64, _>("current_balance")?,
            None => return Err(AppError::UnknownCustomer(input.customer_id.clone())),
        };
    let new_balance = current_balance + input.amount;

    // Payments stamp last_payment_date; other kinds leave it untouched.
    let is_payment = input.tx_type == "payment" || input.amount < 0.0;
    let last_payment_date = if is_payment {
        Some(input.created_at.clone())
    } else {
        None
    };

    let transaction_id = Uuid::new_v4().to_string();
    sqlx::query(
        "INSERT INTO credit_transactions (id, customer_id, amount, type, date, sale_id, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(&transaction_id)
    .bind(&input.customer_id)
    .bind(input.amount)
    .bind(&input.tx_type)
    .bind(&input.date)
    .bind(input.sale_id.clone().unwrap_or_default())
    .bind(input.notes.clone().unwrap_or_default())
    .execute(&mut *tx)
    .await?;

    sqlx::query(
        "UPDATE customers
            SET current_balance = current_balance + ?,
                last_payment_date = COALESCE(?, last_payment_date),
                updated_at = ?
          WHERE id = ?",
    )
    .bind(input.amount)
    .bind(&last_payment_date)
    .bind(&input.created_at)
    .bind(&input.customer_id)
    .execute(&mut *tx)
    .await?;

    tx.commit().await?;

    Ok(RecordCreditTransactionResult {
        transaction_id,
        new_balance,
        last_payment_date,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use sqlx::sqlite::SqlitePoolOptions;

    fn input(customer_id: &str, amount: f64, tx_type: &str) -> RecordCreditTransactionInput {
        RecordCreditTransactionInput {
            customer_id: customer_id.to_string(),
            amount,
            tx_type: tx_type.to_string(),
            date: "2026-06-14T10:00:00.000Z".to_string(),
            sale_id: None,
            notes: Some("test".to_string()),
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
            CREATE TABLE customers (id TEXT PRIMARY KEY, name TEXT, current_balance REAL NOT NULL DEFAULT 0,
                last_payment_date TEXT, updated_at TEXT);
            CREATE TABLE credit_transactions (id TEXT PRIMARY KEY, customer_id TEXT, amount REAL, type TEXT,
                date TEXT, sale_id TEXT, notes TEXT);
        "#;
        for stmt in ddl.split(';').map(str::trim).filter(|s| !s.is_empty()) {
            sqlx::query(stmt).execute(&pool).await.unwrap();
        }
        sqlx::query("INSERT INTO customers (id, name, current_balance) VALUES ('c1', 'Ali', 5000)")
            .execute(&pool)
            .await
            .unwrap();
        pool
    }

    async fn balance_of(pool: &Pool<Sqlite>, id: &str) -> f64 {
        sqlx::query("SELECT current_balance FROM customers WHERE id = ?")
            .bind(id)
            .fetch_one(pool)
            .await
            .unwrap()
            .get::<f64, _>("current_balance")
    }

    async fn last_payment_of(pool: &Pool<Sqlite>, id: &str) -> Option<String> {
        sqlx::query("SELECT last_payment_date FROM customers WHERE id = ?")
            .bind(id)
            .fetch_one(pool)
            .await
            .unwrap()
            .get::<Option<String>, _>("last_payment_date")
    }

    async fn scalar_i64(pool: &Pool<Sqlite>, sql: &str) -> i64 {
        sqlx::query(sql).fetch_one(pool).await.unwrap().get::<i64, _>(0)
    }

    #[tokio::test]
    async fn payment_reduces_balance_as_delta_and_stamps_last_payment() {
        let pool = schema_pool().await;

        let res = run_record_credit_transaction(&pool, input("c1", -2000.0, "payment"))
            .await
            .unwrap();

        assert_eq!(res.new_balance, 3000.0);
        assert_eq!(balance_of(&pool, "c1").await, 3000.0);
        assert_eq!(
            last_payment_of(&pool, "c1").await.as_deref(),
            Some("2026-06-14T10:00:00.000Z")
        );
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM credit_transactions").await, 1);
    }

    #[tokio::test]
    async fn purchase_raises_balance_and_leaves_last_payment_untouched() {
        let pool = schema_pool().await;

        let res = run_record_credit_transaction(&pool, input("c1", 1500.0, "purchase"))
            .await
            .unwrap();

        assert_eq!(res.new_balance, 6500.0);
        assert_eq!(balance_of(&pool, "c1").await, 6500.0);
        assert_eq!(last_payment_of(&pool, "c1").await, None, "a purchase is not a payment");
        assert_eq!(res.last_payment_date, None);
    }

    #[tokio::test]
    async fn balance_is_a_delta_not_an_absolute_write() {
        // Two payments in a row must compound off the stored balance, proving we
        // never clobber it with a renderer-computed absolute.
        let pool = schema_pool().await;
        run_record_credit_transaction(&pool, input("c1", -2000.0, "payment")).await.unwrap();
        let res = run_record_credit_transaction(&pool, input("c1", -500.0, "payment")).await.unwrap();
        assert_eq!(res.new_balance, 2500.0);
        assert_eq!(balance_of(&pool, "c1").await, 2500.0);
    }

    #[tokio::test]
    async fn unknown_customer_rejected_and_nothing_persists() {
        let pool = schema_pool().await;
        let err = run_record_credit_transaction(&pool, input("ghost", -1000.0, "payment"))
            .await
            .unwrap_err();
        assert_eq!(err.code(), "UNKNOWN_CUSTOMER");

        assert_eq!(balance_of(&pool, "c1").await, 5000.0, "real customer untouched");
        assert_eq!(scalar_i64(&pool, "SELECT COUNT(*) FROM credit_transactions").await, 0);
    }
}

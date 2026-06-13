//! Access to the SQLite pool owned by `tauri-plugin-sql`.
//!
//! The plugin manages an sqlx connection pool keyed by the preload URL. By
//! borrowing that pool we can run a TRUE single-connection transaction
//! (`pool.begin()`), which the JS `db.transaction()` — issuing BEGIN / ops /
//! COMMIT as separate `execute()` calls over a multi-connection pool — cannot
//! guarantee (upstream tauri-plugin-sql issue #886). Reads stay on the JS
//! `select()`; only multi-write money flows move here.

use sqlx::{Pool, Sqlite};
use tauri::{AppHandle, Manager, Runtime};
use tauri_plugin_sql::{DbInstances, DbPool};

use crate::error::{AppError, AppResult};

/// Map key under which the plugin stores our database. Must match the
/// `plugins.sql.preload` entry in `tauri.conf.json`.
pub const DB_KEY: &str = "sqlite:bonilo.db";

/// Clone the SQLite pool handle the plugin manages.
///
/// `sqlx::Pool` is internally an `Arc`, so cloning is cheap and lets us drop
/// the plugin's `RwLock` read guard immediately instead of holding it across
/// the whole transaction.
pub async fn sqlite_pool<R: Runtime>(app: &AppHandle<R>) -> AppResult<Pool<Sqlite>> {
    let instances = app.state::<DbInstances>();
    let map = instances.0.read().await;
    // With only the `sqlite` feature enabled, `DbPool` has a single variant, so
    // the `Some(_)` arm is unreachable today; it is kept as a guard in case a
    // future build also enables the mysql/postgres drivers.
    #[allow(unreachable_patterns)]
    match map.get(DB_KEY) {
        Some(DbPool::Sqlite(pool)) => Ok(pool.clone()),
        Some(_) => Err(AppError::NotSqlite),
        None => Err(AppError::PoolNotFound(DB_KEY.to_string())),
    }
}

/// Smoke test that we can reach the plugin's pool and run a query against it.
/// Returns `1` on success. Used to verify the access path end-to-end in a
/// running app before the real money commands rely on it.
#[tauri::command]
pub async fn db_ping(app: AppHandle) -> AppResult<i64> {
    use sqlx::Row;
    let pool = sqlite_pool(&app).await?;
    let row = sqlx::query("SELECT 1").fetch_one(&pool).await?;
    Ok(row.try_get::<i64, _>(0)?)
}

#[cfg(test)]
mod tests {
    use sqlx::{sqlite::SqlitePoolOptions, Pool, Row, Sqlite};

    /// A single-connection in-memory pool, so the in-memory database persists
    /// across statements within one test (each new connection to
    /// `sqlite::memory:` would otherwise be a fresh, empty database).
    async fn mem_pool() -> Pool<Sqlite> {
        let pool = SqlitePoolOptions::new()
            .max_connections(1)
            .connect("sqlite::memory:")
            .await
            .expect("open in-memory sqlite");
        sqlx::query("CREATE TABLE t (id INTEGER PRIMARY KEY AUTOINCREMENT, v TEXT)")
            .execute(&pool)
            .await
            .unwrap();
        pool
    }

    async fn count(pool: &Pool<Sqlite>) -> i64 {
        sqlx::query("SELECT COUNT(*) FROM t")
            .fetch_one(pool)
            .await
            .unwrap()
            .get::<i64, _>(0)
    }

    /// The truth test the JS suite structurally cannot express: partial work
    /// inside a transaction that is not committed must persist NOTHING.
    ///
    /// In the real commands an early `?` return drops the `Transaction`, which
    /// rolls back identically; here we roll back explicitly for determinism.
    #[tokio::test]
    async fn rolled_back_transaction_persists_nothing() {
        let pool = mem_pool().await;

        let mut tx = pool.begin().await.unwrap();
        sqlx::query("INSERT INTO t (v) VALUES (?)")
            .bind("first")
            .execute(&mut *tx)
            .await
            .unwrap();
        sqlx::query("INSERT INTO t (v) VALUES (?)")
            .bind("second")
            .execute(&mut *tx)
            .await
            .unwrap();
        // Failure discovered mid-transaction -> roll back instead of commit.
        tx.rollback().await.unwrap();

        assert_eq!(count(&pool).await, 0, "a rolled-back transaction must leave zero rows");
    }

    /// Positive control: a committed transaction persists its rows.
    #[tokio::test]
    async fn committed_transaction_persists() {
        let pool = mem_pool().await;

        let mut tx = pool.begin().await.unwrap();
        sqlx::query("INSERT INTO t (v) VALUES (?)")
            .bind("kept")
            .execute(&mut *tx)
            .await
            .unwrap();
        tx.commit().await.unwrap();

        assert_eq!(count(&pool).await, 1, "a committed transaction must persist its row");
    }
}

//! Typed, serializable errors for Bonilo's Rust money-core commands.
//!
//! Each variant carries a stable `code` (which the frontend can switch on and
//! localize) plus a human-readable `message`. When a command rejects, the JS
//! side receives `{ "code": ..., "message": ... }`.

use serde::ser::{Serialize, SerializeStruct, Serializer};

// A deliberately complete error taxonomy for the money core. The checkout
// variants below are constructed by `checkout_sale` (M1.2); allow them ahead
// of that so this plumbing checkpoint stays warning-free.
#[allow(dead_code)]
#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("database error: {0}")]
    Db(#[from] sqlx::Error),

    #[error("database pool '{0}' is not loaded")]
    PoolNotFound(String),

    #[error("the managed database pool is not SQLite")]
    NotSqlite,

    #[error("the cart is empty")]
    EmptyCart,

    #[error("unknown product: {0}")]
    UnknownProduct(String),

    #[error("insufficient stock for {product_id}: requested {requested}, available {available}")]
    InsufficientStock {
        product_id: String,
        requested: f64,
        available: f64,
    },

    #[error("a credit sale requires a customer")]
    CreditRequiresCustomer,

    #[error("invalid input: {0}")]
    Invalid(&'static str),
}

impl AppError {
    /// Stable machine-readable code, safe for the frontend to branch on.
    pub fn code(&self) -> &'static str {
        match self {
            AppError::Db(_) => "DB_ERROR",
            AppError::PoolNotFound(_) => "POOL_NOT_FOUND",
            AppError::NotSqlite => "NOT_SQLITE",
            AppError::EmptyCart => "EMPTY_CART",
            AppError::UnknownProduct(_) => "UNKNOWN_PRODUCT",
            AppError::InsufficientStock { .. } => "INSUFFICIENT_STOCK",
            AppError::CreditRequiresCustomer => "CREDIT_REQUIRES_CUSTOMER",
            AppError::Invalid(_) => "INVALID_INPUT",
        }
    }
}

impl Serialize for AppError {
    fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        let mut s = serializer.serialize_struct("AppError", 2)?;
        s.serialize_field("code", self.code())?;
        s.serialize_field("message", &self.to_string())?;
        s.end()
    }
}

pub type AppResult<T> = Result<T, AppError>;

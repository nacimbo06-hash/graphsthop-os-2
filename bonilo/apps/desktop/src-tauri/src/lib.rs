mod adjust_stock;
mod checkout;
mod close_session;
mod create_purchase_order;
mod db;
mod error;
mod lot_ops;
mod printer;
mod receive_goods;
mod record_credit_transaction;
mod treasury_ops;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_sql::Builder::default().build())
    .invoke_handler(tauri::generate_handler![
        printer::list_printers,
        printer::print_receipt,
        printer::print_raw,
        db::db_ping,
        checkout::checkout_sale,
        receive_goods::receive_goods,
        create_purchase_order::create_purchase_order,
        record_credit_transaction::record_credit_transaction,
        adjust_stock::adjust_stock,
        lot_ops::update_lot_with_movement,
        lot_ops::bulk_update_lot_statuses,
        treasury_ops::transfer_to_safe,
        treasury_ops::contribute_to_fund,
        treasury_ops::record_expense_payment,
        close_session::close_session
    ])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

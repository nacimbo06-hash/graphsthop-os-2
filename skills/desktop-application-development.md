# Desktop Application Development Skill

## Overview
Expertise in building high-performance, cross-platform desktop applications using modern frameworks like Electron and Tauri, with focus on native integration, performance optimization, and user experience.

## Technology Stack Comparison

### Tauri (Rust + Web Frontend)
**Advantages:**
- Smaller bundle sizes (10-50MB vs 100-200MB for Electron)
- Better security by default
- Lower memory usage
- Rust backend performance
- Built-in security sandbox

**Use Cases:**
- Performance-critical applications
- Security-sensitive applications
- Applications requiring native system access

### Electron (Node.js + Web Frontend)
**Advantages:**
- Larger ecosystem and community
- More mature (been around longer)
- Easier Node.js integration
- Better tooling for some use cases

**Use Cases:**
- Applications requiring extensive Node.js modules
- Teams more comfortable with JavaScript/TypeScript on backend
- Rapid prototyping

## Tauri Development Patterns

### Project Structure
```
src-tauri/
├── src/
│   ├── main.rs              # Main application entry point
│   ├── commands.rs          # IPC command definitions
│   ├── database.rs          # Database operations
│   ├── printer.rs           # Native printing
│   └── utils.rs             # Utility functions
├── Cargo.toml               # Rust dependencies
├── tauri.conf.json          # Tauri configuration
├── build.rs                 # Build script
└── icons/                   # Application icons
```

### Core Tauri Configuration
```json
// src-tauri/tauri.conf.json
{
  "build": {
    "beforeBuildCommand": "npm run build",
    "beforeDevCommand": "npm run dev",
    "devUrl": "http://localhost:3000",
    "distDir": "../dist"
  },
  "package": {
    "productName": "GRAPHSHOP OS",
    "version": "1.0.0"
  },
  "tauri": {
    "allowlist": {
      "all": false,
      "fs": {
        "all": false,
        "readFile": true,
        "writeFile": true,
        "exists": true,
        "scope": ["$APPCONFIG/*", "$APPDATA/*", "$RESOURCE/*"]
      },
      "dialog": {
        "all": false,
        "open": true,
        "save": true
      },
      "notification": {
        "all": true
      },
      "printer": {
        "all": true
      }
    },
    "bundle": {
      "active": true,
      "targets": "all",
      "identifier": "com.igo.graphshop",
      "icon": ["icons/32x32.png", "icons/128x128.png", "icons/128x128@2x.png", "icons/icon.icns", "icons/icon.ico"]
    },
    "security": {
      "csp": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' asset: https: asset:"
    },
    "updater": {
      "active": false
    },
    "windows": [
      {
        "fullscreen": false,
        "resizable": true,
        "title": "GRAPHSHOP OS",
        "width": 1200,
        "height": 800,
        "minWidth": 800,
        "minHeight": 600
      }
    ]
  }
}
```

### Rust Backend Implementation
```rust
// src-tauri/src/main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use tauri::{State, Manager};

mod commands;
mod database;
mod printer;
mod models;

use commands::*;
use database::Database;

fn main() {
    tauri::Builder::default()
        .manage(Mutex::new(Database::new().expect("Failed to initialize database")))
        .invoke_handler(tauri::generate_handler![
            get_products,
            add_product,
            update_product,
            delete_product,
            get_sales,
            create_sale,
            print_receipt,
            print_label,
            get_system_info
        ])
        .setup(|app| {
            // Initialize application state
            let db = Database::new()?;
            
            // Store database instance in app state
            app.manage(Mutex::new(db));
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### IPC Commands Implementation
```rust
// src-tauri/src/commands.rs
use tauri::{State, Manager};
use crate::database::Database;
use crate::models::{Product, Sale, SaleItem};
use std::sync::Mutex;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiResponse<T> {
    success: bool,
    data: Option<T>,
    error: Option<String>,
}

#[tauri::command]
pub async fn get_products(
    db: State<'_, Mutex<Database>>
) -> Result<Vec<Product>, String> {
    let database = db.lock().unwrap();
    match database.get_products() {
        Ok(products) => Ok(products),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub async fn add_product(
    product: Product,
    db: State<'_, Mutex<Database>>
) -> Result<Product, String> {
    let mut database = db.lock().unwrap();
    match database.add_product(product) {
        Ok(product) => Ok(product),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub async fn create_sale(
    sale: Sale,
    db: State<'_, Mutex<Database>>
) -> Result<Sale, String> {
    let mut database = db.lock().unwrap();
    
    // Start transaction
    match database.create_sale(&sale) {
        Ok(sale_id) => {
            // Update product stock
            for item in &sale.items {
                if let Err(e) = database.update_product_stock(&item.product_id, -item.quantity) {
                    return Err(format!("Failed to update stock: {}", e));
                }
            }
            
            Ok(sale)
        },
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub async fn print_receipt(
    sale_data: serde_json::Value,
    window: tauri::Window
) -> Result<(), String> {
    crate::printer::print_thermal_receipt(sale_data, &window)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_system_info() -> Result<serde_json::Value, String> {
    let info = serde_json::json!({
        "platform": std::env::consts::OS,
        "arch": std::env::consts::ARCH,
        "version": env!("CARGO_PKG_VERSION")
    });
    Ok(info)
}
```

### Native Printing Integration
```rust
// src-tauri/src/printer.rs
use tauri::Window;
use std::process::Command;
use serde_json::Value;

pub fn print_thermal_receipt(receipt_data: Value, window: &Window) -> Result<(), Box<dyn std::error::Error>> {
    // Generate receipt text
    let receipt_text = generate_receipt_text(&receipt_data)?;
    
    // Try different printing methods based on platform
    match std::env::consts::OS {
        "windows" => print_windows_thermal(&receipt_text),
        "linux" => print_linux_thermal(&receipt_text),
        "macos" => print_macos_thermal(&receipt_text),
        _ => Err("Unsupported platform".into()),
    }
}

fn generate_receipt_text(data: &Value) -> Result<String, Box<dyn std::error::Error>> {
    let mut receipt = String::new();
    
    // Header
    receipt.push_str("================================\n");
    receipt.push_str(&format!("{}\n", data["storeName"].as_str().unwrap_or("STORE")));
    receipt.push_str(&format!("{}\n", data["address"].as_str().unwrap_or("")));
    receipt.push_str("================================\n\n");
    
    // Date and time
    receipt.push_str(&format!("Date: {}\n", 
        chrono::Local::now().format("%Y-%m-%d %H:%M:%S")
    ));
    receipt.push_str(&format!("Cashier: {}\n\n", 
        data["cashier"].as_str().unwrap_or("")
    ));
    
    // Items
    if let Some(items) = data["items"].as_array() {
        for item in items {
            let name = item["name"].as_str().unwrap_or("");
            let qty = item["quantity"].as_i64().unwrap_or(1);
            let price = item["price"].as_f64().unwrap_or(0.0);
            let total = qty as f64 * price;
            
            receipt.push_str(&format!("{:<20} {:>3} x {:>8.2} = {:>8.2}\n", 
                name, qty, price, total
            ));
        }
    }
    
    // Totals
    receipt.push_str("--------------------------------\n");
    if let Some(total) = data["total"].as_f64() {
        receipt.push_str(&format!("TOTAL: {:>28.2}\n", total));
    }
    if let Some(tax) = data["tax"].as_f64() {
        receipt.push_str(&format!("TAX: {:>30.2}\n", tax));
    }
    
    // Footer
    receipt.push_str("\n================================\n");
    receipt.push_str("Thank you for shopping!\n");
    
    Ok(receipt)
}

#[cfg(windows)]
fn print_windows_thermal(text: &str) -> Result<(), Box<dyn std::error::Error>> {
    // Use Windows API or printer driver
    Command::new("cmd")
        .args(&["/C", &format!("echo {} > LPT1", text)])
        .output()?;
    Ok(())
}

#[cfg(target_os = "linux")]
fn print_linux_thermal(text: &str) -> Result<(), Box<dyn std::error::Error>> {
    // Use lp command for Unix systems
    Command::new("lp")
        .args(&["-d", "thermal_printer", "-"])
        .stdin(std::process::Stdio::piped())
        .spawn()?
        .stdin
        .unwrap()
        .write_all(text.as_bytes())?;
    Ok(())
}
```

## Frontend Integration

### TypeScript Type Definitions
```typescript
// src/types/tauri.d.ts
declare global {
  interface Window {
    __TAURI__: {
        invoke<T>(command: string, args?: any): Promise<T>;
        listen(event: string, handler: (event: any) => void): Promise<() => void>;
        emit(event: string, payload?: any): Promise<void>;
    };
  }
}

export {};

// Generated types from Rust commands
export interface Product {
  id: string;
  sku: string;
  designation: string;
  description?: string;
  price: number;
  cost?: number;
  categoryId: string;
  stockQuantity: number;
  minStock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  customerId?: string;
  items: SaleItem[];
  payments: Payment[];
  total: number;
  tax: number;
  discount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  userId: string;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  price: number;
  discount: number;
}

export interface Payment {
  method: 'cash' | 'card' | 'credit';
  amount: number;
  reference?: string;
}
```

### Tauri API Wrapper
```typescript
// src/services/tauriApi.ts
import { invoke } from '@tauri-apps/api/core';
import { listen, emit } from '@tauri-apps/api/event';

export class TauriAPI {
  // Product operations
  static async getProducts(): Promise<Product[]> {
    return await invoke('get_products');
  }

  static async addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    return await invoke('add_product', { product });
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    return await invoke('update_product', { id, updates });
  }

  static async deleteProduct(id: string): Promise<void> {
    return await invoke('delete_product', { id });
  }

  // Sale operations
  static async getSales(params?: { startDate?: string; endDate?: string }): Promise<Sale[]> {
    return await invoke('get_sales', { params });
  }

  static async createSale(sale: Omit<Sale, 'id' | 'createdAt'>): Promise<Sale> {
    return await invoke('create_sale', { sale });
  }

  // Printing operations
  static async printReceipt(receiptData: any): Promise<void> {
    return await invoke('print_receipt', { receiptData });
  }

  static async printLabel(labelData: any): Promise<void> {
    return await invoke('print_label', { labelData });
  }

  // System operations
  static async getSystemInfo(): Promise<any> {
    return await invoke('get_system_info');
  }

  // Event listeners
  static onPrinterStatus(callback: (status: string) => void): Promise<() => void> {
    return listen('printer-status', (event) => callback(event.payload));
  }

  static onDatabaseUpdate(callback: (table: string, data: any) => void): Promise<() => void> {
    return listen('database-update', (event) => {
      const { table, data } = event.payload;
      callback(table, data);
    });
  }

  // Event emitters
  static emitDatabaseEvent(table: string, action: string, data: any): Promise<void> {
    return emit('database-event', { table, action, data });
  }
}
```

### React Hook for Tauri Operations
```typescript
// src/hooks/useTauriAPI.ts
import { useState, useEffect, useCallback } from 'react';
import { TauriAPI } from '../services/tauriApi';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await TauriAPI.getProducts();
      setProducts(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = useCallback(async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProduct = await TauriAPI.addProduct(product);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    try {
      const updatedProduct = await TauriAPI.updateProduct(id, updates);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      return updatedProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      await TauriAPI.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Listen for database updates
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    TauriAPI.onDatabaseUpdate((table, data) => {
      if (table === 'products') {
        loadProducts(); // Reload when database changes
      }
    }).then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      unsubscribe?.();
    };
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
```

## Performance Optimization

### Code Splitting and Lazy Loading
```typescript
// src/pages/LazyPages.tsx
import { lazy, Suspense } from 'react';
import { Loader } from '../components/UI/Loader';

const POS = lazy(() => import('../pages/POS/POS'));
const Inventory = lazy(() => import('../pages/Inventory/Inventory'));
const Treasury = lazy(() => import('../pages/Treasury/Treasury'));
const Reports = lazy(() => import('../pages/Reports/Reports'));

export const LazyPOS = () => (
  <Suspense fallback={<Loader />}>
    <POS />
  </Suspense>
);

export const LazyInventory = () => (
  <Suspense fallback={<Loader />}>
    <Inventory />
  </Suspense>
);
```

### Memory Management
```typescript
// src/utils/memory.ts
export class MemoryManager {
  private static cache = new Map<string, any>();
  private static maxCacheSize = 100;

  static set(key: string, value: any): void {
    if (this.cache.size >= this.maxCacheSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  static get(key: string): any {
    const value = this.cache.get(key);
    if (value) {
      // Move to end (LRU)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  static clear(): void {
    this.cache.clear();
  }

  static size(): number {
    return this.cache.size;
  }
}

// Usage with React hooks
export function useCachedData<T>(key: string, fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(() => MemoryManager.get(key));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) {
      setLoading(true);
      fetcher().then(result => {
        setData(result);
        MemoryManager.set(key, result);
        setLoading(false);
      });
    }
  }, [key, fetcher, data]);

  return { data, loading };
}
```

## Native System Integration

### File System Operations
```typescript
// src/services/fileSystem.ts
import { readTextFile, writeTextFile, exists, createDir } from '@tauri-apps/plugin-fs';

export class FileSystemManager {
  static async ensureDirectory(path: string): Promise<void> {
    if (!(await exists(path))) {
      await createDir(path, { recursive: true });
    }
  }

  static async saveConfig(config: any, filename: string = 'config.json'): Promise<void> {
    const configDir = await this.getConfigDir();
    await this.ensureDirectory(configDir);
    
    const configPath = `${configDir}/${filename}`;
    await writeTextFile(configPath, JSON.stringify(config, null, 2));
  }

  static async loadConfig(filename: string = 'config.json'): Promise<any> {
    const configDir = await this.getConfigDir();
    const configPath = `${configDir}/${filename}`;
    
    if (await exists(configPath)) {
      const content = await readTextFile(configPath);
      return JSON.parse(content);
    }
    
    return {};
  }

  private static async getConfigDir(): Promise<string> {
    return await invoke('get_config_dir');
  }
}
```

### System Notifications
```typescript
// src/services/notifications.ts
import { 
  isPermissionGranted, 
  requestPermission, 
  sendNotification 
} from '@tauri-apps/api/notification';

export class NotificationManager {
  private static initialized = false;

  static async init(): Promise<void> {
    if (this.initialized) return;

    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === 'granted';
    }

    this.initialized = permissionGranted;
  }

  static async notify(title: string, body: string): Promise<void> {
    await this.init();
    
    if (this.initialized) {
      sendNotification({ title, body });
    }
  }

  static async notifyLowStock(product: any): Promise<void> {
    await this.notify(
      'Low Stock Alert',
      `${product.designation} is below minimum stock (${product.stockQuantity}/${product.minStock})`
    );
  }

  static async notifySaleCompleted(sale: any): Promise<void> {
    await this.notify(
      'Sale Completed',
      `Sale #${sale.id} completed successfully - Total: ${sale.total}`
    );
  }
}
```

## Error Handling and Logging

### Global Error Handler
```typescript
// src/services/errorHandler.ts
export class ErrorHandler {
  static handle(error: Error, context?: string): void {
    console.error(`[${context || 'App'}]`, error);
    
    // Log to file if needed
    this.logToFile(error, context);
    
    // Show user-friendly notification
    this.showUserNotification(error);
  }

  private static async logToFile(error: Error, context?: string): Promise<void> {
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        context,
        message: error.message,
        stack: error.stack,
      };

      // Append to error log file
      await invoke('write_error_log', { logEntry });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  }

  private static showUserNotification(error: Error): void {
    const message = error.message.includes('Database') 
      ? 'Database operation failed'
      : error.message.includes('Network')
      ? 'Network connection error'
      : 'An unexpected error occurred';

    // Show toast notification
    NotificationManager.notify('Error', message);
  }
}

// Global error boundary
export function withErrorHandling<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P & { onError?: (error: Error) => void }> {
  return (props) => {
    const handleError = (error: Error) => {
      ErrorHandler.handle(error, 'Component');
      props.onError?.(error);
    };

    try {
      return <Component {...props} />;
    } catch (error) {
      handleError(error as Error);
      return <div>Something went wrong</div>;
    }
  };
}
```

This comprehensive skill covers all aspects of desktop application development needed for building robust applications like GRAPHSHOP OS.
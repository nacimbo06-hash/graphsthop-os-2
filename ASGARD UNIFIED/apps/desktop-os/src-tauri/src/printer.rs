use serde::{Deserialize, Serialize};
use std::time::Duration;

// ESC/POS Commands
const ESC: u8 = 0x1B;
const GS: u8 = 0x1D;

#[derive(Debug, Serialize, Deserialize)]
pub struct PrinterInfo {
    pub port: String,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ReceiptLine {
    pub text: String,
    pub bold: bool,
    pub align: String, // "left", "center", "right"
    pub size: u8,      // 1 = normal, 2 = double
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ReceiptData {
    pub lines: Vec<ReceiptLine>,
    pub cut: bool,
    pub open_drawer: bool,
}

/// List available serial ports (thermal printers)
#[tauri::command]
pub fn list_printers() -> Result<Vec<PrinterInfo>, String> {
    let ports = serialport::available_ports().map_err(|e| e.to_string())?;
    
    Ok(ports
        .into_iter()
        .map(|p| PrinterInfo {
            port: p.port_name.clone(),
            name: match p.port_type {
                serialport::SerialPortType::UsbPort(info) => {
                    info.product.unwrap_or_else(|| p.port_name.clone())
                }
                _ => p.port_name.clone(),
            },
        })
        .collect())
}

/// Print raw ESC/POS data to a thermal printer
#[tauri::command]
pub fn print_receipt(port_name: String, receipt: ReceiptData) -> Result<(), String> {
    let mut port = serialport::new(&port_name, 9600)
        .timeout(Duration::from_millis(1000))
        .open()
        .map_err(|e| format!("Failed to open port {}: {}", port_name, e))?;

    let mut buffer: Vec<u8> = Vec::new();

    // Initialize printer
    buffer.extend_from_slice(&[ESC, b'@']); // ESC @ - Initialize

    for line in &receipt.lines {
        // Set alignment
        let align_byte = match line.align.as_str() {
            "center" => 1,
            "right" => 2,
            _ => 0, // left
        };
        buffer.extend_from_slice(&[ESC, b'a', align_byte]);

        // Set bold
        if line.bold {
            buffer.extend_from_slice(&[ESC, b'E', 1]);
        }

        // Set text size
        if line.size > 1 {
            buffer.extend_from_slice(&[GS, b'!', 0x11]); // Double height + width
        } else {
            buffer.extend_from_slice(&[GS, b'!', 0x00]); // Normal
        }

        // Print text
        buffer.extend_from_slice(line.text.as_bytes());
        buffer.push(b'\n');

        // Reset bold
        if line.bold {
            buffer.extend_from_slice(&[ESC, b'E', 0]);
        }
    }

    // Open cash drawer if requested
    if receipt.open_drawer {
        buffer.extend_from_slice(&[ESC, b'p', 0, 25, 250]); // Pulse pin 2
    }

    // Cut paper if requested
    if receipt.cut {
        buffer.extend_from_slice(&[GS, b'V', 66, 3]); // Feed and partial cut
    }

    // Write to printer
    port.write_all(&buffer)
        .map_err(|e| format!("Failed to write to printer: {}", e))?;

    port.flush()
        .map_err(|e| format!("Failed to flush printer: {}", e))?;

    Ok(())
}

/// Print raw bytes directly (for advanced use)
#[tauri::command]
pub fn print_raw(port_name: String, data: Vec<u8>) -> Result<(), String> {
    let mut port = serialport::new(&port_name, 9600)
        .timeout(Duration::from_millis(1000))
        .open()
        .map_err(|e| format!("Failed to open port: {}", e))?;

    port.write_all(&data)
        .map_err(|e| format!("Failed to write: {}", e))?;

    port.flush().map_err(|e| format!("Failed to flush: {}", e))?;

    Ok(())
}

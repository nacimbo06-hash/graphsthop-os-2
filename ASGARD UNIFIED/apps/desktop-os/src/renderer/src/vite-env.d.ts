/// <reference types="vite/client" />

interface Window {
  // Tauri APIs are automatically available through @tauri-apps/api
  // Keeping this for backward compatibility during transition
  electronAPI?: {
    printReceipt?: (data: any) => Promise<void>;
    printLabel?: (data: any) => Promise<void>;
    openPrintDialog?: () => Promise<any>;
  };
}

export {};
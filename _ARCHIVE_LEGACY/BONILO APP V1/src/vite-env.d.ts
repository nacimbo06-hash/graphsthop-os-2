/// <reference types="vite/client" />

interface Window {
  // Keeping this for backward compatibility during transition
  electronAPI?: {
    printReceipt?: (data: any) => Promise<void>;
    printLabel?: (data: any) => Promise<void>;
    openPrintDialog?: () => Promise<any>;
  };
}

export { };
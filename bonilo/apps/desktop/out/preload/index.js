"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const api = {
  // Printer
  printReceipt: (data) => electron.ipcRenderer.invoke("print:receipt", data),
  printLabel: (data) => electron.ipcRenderer.invoke("print:label", data),
  // Scanner
  onBarcodeScanned: (callback) => {
    electron.ipcRenderer.on("scanner:barcode", (_, barcode) => callback(barcode));
  },
  // System
  getAppVersion: () => electron.ipcRenderer.invoke("app:version"),
  platform: process.platform,
  // Sync Server (LAN)
  startSyncServer: (port) => electron.ipcRenderer.invoke("sync:start-server", port),
  stopSyncServer: () => electron.ipcRenderer.invoke("sync:stop-server"),
  getSyncServerStatus: () => electron.ipcRenderer.invoke("sync:get-server-status"),
  onSyncServerStatus: (callback) => {
    electron.ipcRenderer.on("sync:server-status", (_, status) => callback(status));
  }
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("electronAPI", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.electronAPI = api;
}

"use strict";
const electron = require("electron");
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const ws = require("ws");
const http = require("http");
const Database = require("better-sqlite3");
const crypto = require("crypto");
const os = require("os");
function getPreloadPath() {
  return path.join(__dirname, "../preload/index.js");
}
function getUserDataPath() {
  return electron.app.getPath("userData");
}
function getLogsPath() {
  return path.join(getUserDataPath(), "logs");
}
const DEFAULT_PORT = 9876;
const SYNC_PORT = DEFAULT_PORT;
class SyncServer {
  app;
  httpServer;
  wss;
  db;
  clients = /* @__PURE__ */ new Map();
  isRunning = false;
  serverPort = SYNC_PORT;
  constructor() {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.wss = new ws.WebSocketServer({ server: this.httpServer });
    const dbPath = path.join(electron.app.getPath("userData"), "igo-sync.db");
    this.db = new Database(dbPath);
    this.initializeDatabase();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
  }
  initializeDatabase() {
    const collections = [
      "products",
      "sales",
      "customers",
      "suppliers",
      "goods_receipts",
      "purchase_orders",
      "inventory_movements",
      "treasury_movements",
      "expenses",
      "safe_transactions",
      "sinking_funds",
      "users",
      "settings",
      "store_settings"
    ];
    collections.forEach((collection) => {
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS ${collection} (
          id TEXT PRIMARY KEY,
          data TEXT NOT NULL,
          updated_at INTEGER NOT NULL,
          deleted INTEGER DEFAULT 0
        )
      `);
    });
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sync_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        collection TEXT NOT NULL,
        record_id TEXT NOT NULL,
        action TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        client_id TEXT
      )
    `);
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_sync_log_timestamp 
      ON sync_log(timestamp)
    `);
  }
  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use((req, _res, next) => {
      console.log(`[Sync Server] ${req.method} ${req.path}`);
      next();
    });
  }
  setupRoutes() {
    this.app.get("/health", (_req, res) => {
      res.json({
        status: "ok",
        server: "IGO Sync Server",
        version: "1.0.0",
        timestamp: Date.now(),
        clients: this.clients.size
      });
    });
    this.app.get("/info", (_req, res) => {
      res.json({
        name: "IGO Sync Server",
        version: "1.0.0",
        port: this.serverPort,
        hostname: os.hostname(),
        addresses: this.getLocalIPs()
      });
    });
    this.app.get("/api/:collection", (req, res) => {
      try {
        const { collection } = req.params;
        const since = parseInt(req.query.since) || 0;
        const stmt = this.db.prepare(`
          SELECT id, data, updated_at, deleted 
          FROM ${collection} 
          WHERE updated_at > ?
          ORDER BY updated_at ASC
        `);
        const rows = stmt.all(since);
        const items = rows.map((row) => ({
          ...JSON.parse(row.data),
          id: row.id,
          _syncedAt: row.updated_at,
          _deleted: row.deleted === 1
        }));
        res.json({ items, timestamp: Date.now() });
      } catch (error) {
        console.error("[Sync Server] Error fetching collection:", error);
        res.status(500).json({ error: "Failed to fetch collection" });
      }
    });
    this.app.post("/api/:collection", (req, res) => {
      try {
        const { collection } = req.params;
        const items = Array.isArray(req.body) ? req.body : [req.body];
        const timestamp = Date.now();
        const clientId = req.headers["x-client-id"] || "unknown";
        const upsertStmt = this.db.prepare(`
          INSERT INTO ${collection} (id, data, updated_at, deleted)
          VALUES (?, ?, ?, 0)
          ON CONFLICT(id) DO UPDATE SET
            data = excluded.data,
            updated_at = excluded.updated_at,
            deleted = 0
        `);
        const logStmt = this.db.prepare(`
          INSERT INTO sync_log (collection, record_id, action, timestamp, client_id)
          VALUES (?, ?, 'upsert', ?, ?)
        `);
        const transaction = this.db.transaction(() => {
          for (const item of items) {
            const id = item.id || crypto.randomUUID();
            const data = JSON.stringify({ ...item, id });
            upsertStmt.run(id, data, timestamp);
            logStmt.run(collection, id, timestamp, clientId);
          }
        });
        transaction();
        this.broadcast({
          type: "update",
          collection,
          data: items,
          timestamp,
          clientId
        });
        res.json({ success: true, timestamp });
      } catch (error) {
        console.error("[Sync Server] Error upserting:", error);
        res.status(500).json({ error: "Failed to upsert" });
      }
    });
    this.app.delete("/api/:collection/:id", (req, res) => {
      try {
        const { collection, id } = req.params;
        const timestamp = Date.now();
        const clientId = req.headers["x-client-id"] || "unknown";
        const stmt = this.db.prepare(`
          UPDATE ${collection} 
          SET deleted = 1, updated_at = ? 
          WHERE id = ?
        `);
        const logStmt = this.db.prepare(`
          INSERT INTO sync_log (collection, record_id, action, timestamp, client_id)
          VALUES (?, ?, 'delete', ?, ?)
        `);
        stmt.run(timestamp, id);
        logStmt.run(collection, id, timestamp, clientId);
        this.broadcast({
          type: "delete",
          collection,
          id,
          timestamp,
          clientId
        });
        res.json({ success: true, timestamp });
      } catch (error) {
        console.error("[Sync Server] Error deleting:", error);
        res.status(500).json({ error: "Failed to delete" });
      }
    });
    this.app.get("/api/sync/changes", (req, res) => {
      try {
        const since = parseInt(req.query.since) || 0;
        const stmt = this.db.prepare(`
          SELECT collection, record_id, action, timestamp, client_id
          FROM sync_log
          WHERE timestamp > ?
          ORDER BY timestamp ASC
          LIMIT 1000
        `);
        const changes = stmt.all(since);
        res.json({ changes, timestamp: Date.now() });
      } catch (error) {
        console.error("[Sync Server] Error fetching changes:", error);
        res.status(500).json({ error: "Failed to fetch changes" });
      }
    });
    this.app.get("/api/sync/full", (_req, res) => {
      try {
        const collections = [
          "products",
          "sales",
          "customers",
          "suppliers",
          "goods_receipts",
          "purchase_orders",
          "inventory_movements",
          "treasury_movements",
          "expenses",
          "safe_transactions",
          "sinking_funds",
          "users",
          "settings",
          "store_settings"
        ];
        const allData = {};
        for (const collection of collections) {
          const stmt = this.db.prepare(`
            SELECT id, data, updated_at, deleted 
            FROM ${collection} 
            WHERE deleted = 0
          `);
          const rows = stmt.all();
          allData[collection] = rows.map((row) => ({
            ...JSON.parse(row.data),
            id: row.id,
            _syncedAt: row.updated_at
          }));
        }
        res.json({ data: allData, timestamp: Date.now() });
      } catch (error) {
        console.error("[Sync Server] Error fetching full sync:", error);
        res.status(500).json({ error: "Failed to fetch full sync" });
      }
    });
  }
  setupWebSocket() {
    this.wss.on("connection", (ws2) => {
      const clientId = crypto.randomUUID();
      console.log(`[Sync Server] Client connected: ${clientId}`);
      const client = {
        ws: ws2,
        id: clientId,
        name: "Unknown",
        connectedAt: Date.now(),
        lastPing: Date.now()
      };
      this.clients.set(clientId, client);
      ws2.send(JSON.stringify({
        type: "welcome",
        clientId,
        timestamp: Date.now()
      }));
      ws2.on("message", (message) => {
        try {
          const msg = JSON.parse(message.toString());
          this.handleWebSocketMessage(clientId, msg);
        } catch (error) {
          console.error("[Sync Server] Error parsing message:", error);
        }
      });
      ws2.on("close", () => {
        console.log(`[Sync Server] Client disconnected: ${clientId}`);
        this.clients.delete(clientId);
      });
      ws2.on("error", (error) => {
        console.error(`[Sync Server] WebSocket error for ${clientId}:`, error);
        this.clients.delete(clientId);
      });
    });
  }
  handleWebSocketMessage(clientId, msg) {
    const client = this.clients.get(clientId);
    if (!client) return;
    switch (msg.type) {
      case "ping":
        client.lastPing = Date.now();
        client.ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
        break;
      case "sync":
        this.sendCollectionData(client, msg.collection, msg.timestamp || 0);
        break;
      case "update":
        this.handleClientUpdate(clientId, msg);
        break;
      case "delete":
        this.handleClientDelete(clientId, msg);
        break;
    }
  }
  sendCollectionData(client, collection, since) {
    try {
      const stmt = this.db.prepare(`
        SELECT id, data, updated_at, deleted 
        FROM ${collection} 
        WHERE updated_at > ?
        ORDER BY updated_at ASC
      `);
      const rows = stmt.all(since);
      const items = rows.map((row) => ({
        ...JSON.parse(row.data),
        id: row.id,
        _syncedAt: row.updated_at,
        _deleted: row.deleted === 1
      }));
      client.ws.send(JSON.stringify({
        type: "sync",
        collection,
        data: items,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error("[Sync Server] Error sending collection data:", error);
    }
  }
  handleClientUpdate(clientId, msg) {
    try {
      const timestamp = Date.now();
      const items = Array.isArray(msg.data) ? msg.data : [msg.data];
      const upsertStmt = this.db.prepare(`
        INSERT INTO ${msg.collection} (id, data, updated_at, deleted)
        VALUES (?, ?, ?, 0)
        ON CONFLICT(id) DO UPDATE SET
          data = excluded.data,
          updated_at = excluded.updated_at,
          deleted = 0
      `);
      const logStmt = this.db.prepare(`
        INSERT INTO sync_log (collection, record_id, action, timestamp, client_id)
        VALUES (?, ?, 'upsert', ?, ?)
      `);
      const transaction = this.db.transaction(() => {
        for (const item of items) {
          const id = item.id || crypto.randomUUID();
          const data = JSON.stringify({ ...item, id });
          upsertStmt.run(id, data, timestamp);
          logStmt.run(msg.collection, id, timestamp, clientId);
        }
      });
      transaction();
      this.broadcast({
        type: "update",
        collection: msg.collection,
        data: items,
        timestamp,
        clientId
      }, clientId);
    } catch (error) {
      console.error("[Sync Server] Error handling update:", error);
    }
  }
  handleClientDelete(clientId, msg) {
    try {
      const timestamp = Date.now();
      const stmt = this.db.prepare(`
        UPDATE ${msg.collection} 
        SET deleted = 1, updated_at = ? 
        WHERE id = ?
      `);
      const logStmt = this.db.prepare(`
        INSERT INTO sync_log (collection, record_id, action, timestamp, client_id)
        VALUES (?, ?, 'delete', ?, ?)
      `);
      stmt.run(timestamp, msg.id);
      logStmt.run(msg.collection, msg.id, timestamp, clientId);
      this.broadcast({
        type: "delete",
        collection: msg.collection,
        id: msg.id,
        timestamp,
        clientId
      }, clientId);
    } catch (error) {
      console.error("[Sync Server] Error handling delete:", error);
    }
  }
  broadcast(message, excludeClientId) {
    const msgString = JSON.stringify(message);
    this.clients.forEach((client, id) => {
      if (id !== excludeClientId && client.ws.readyState === ws.WebSocket.OPEN) {
        client.ws.send(msgString);
      }
    });
  }
  getLocalIPs() {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for (const name of Object.keys(interfaces)) {
      const iface = interfaces[name];
      if (!iface) continue;
      for (const info of iface) {
        if (info.family === "IPv4" && !info.internal) {
          addresses.push(info.address);
        }
      }
    }
    return addresses;
  }
  start(port = SYNC_PORT) {
    return new Promise((resolve, reject) => {
      if (this.isRunning) {
        resolve();
        return;
      }
      this.serverPort = port;
      this.httpServer.listen(port, "0.0.0.0", () => {
        this.isRunning = true;
        const ips = this.getLocalIPs();
        console.log(`[Sync Server] Running on port ${port}`);
        console.log(`[Sync Server] Local IPs: ${ips.join(", ")}`);
        resolve();
      });
      this.httpServer.on("error", (err) => {
        console.error("[Sync Server] Server error:", err);
        reject(err);
      });
    });
  }
  stop() {
    return new Promise((resolve) => {
      if (!this.isRunning) {
        resolve();
        return;
      }
      this.clients.forEach((client) => {
        client.ws.close();
      });
      this.clients.clear();
      this.db.close();
      this.httpServer.close(() => {
        this.isRunning = false;
        console.log("[Sync Server] Stopped");
        resolve();
      });
    });
  }
  getStatus() {
    return {
      running: this.isRunning,
      port: this.serverPort,
      clients: this.clients.size,
      ips: this.getLocalIPs()
    };
  }
  getConnectedClients() {
    return Array.from(this.clients.values()).map((c) => ({
      id: c.id,
      name: c.name,
      connectedAt: c.connectedAt
    }));
  }
}
let syncServerInstance = null;
function getSyncServer() {
  if (!syncServerInstance) {
    syncServerInstance = new SyncServer();
  }
  return syncServerInstance;
}
function startSyncServer(port) {
  return getSyncServer().start(port);
}
function stopSyncServer() {
  if (syncServerInstance) {
    return syncServerInstance.stop();
  }
  return Promise.resolve();
}
function setupSyncIpcHandlers() {
  electron.ipcMain.handle("sync:start-server", async (_event, port) => {
    try {
      await startSyncServer(port);
      const status = getSyncServer().getStatus();
      return { success: true, ...status };
    } catch (error) {
      console.error("[Sync IPC] Failed to start server:", error);
      return { success: false, error: error.message };
    }
  });
  electron.ipcMain.handle("sync:stop-server", async () => {
    try {
      await stopSyncServer();
      return { success: true };
    } catch (error) {
      console.error("[Sync IPC] Failed to stop server:", error);
      return { success: false, error: error.message };
    }
  });
  electron.ipcMain.handle("sync:get-server-status", () => {
    try {
      const server = getSyncServer();
      return {
        ...server.getStatus(),
        clients: server.getConnectedClients()
      };
    } catch (error) {
      return {
        running: false,
        port: 9876,
        clients: 0,
        ips: [],
        error: error.message
      };
    }
  });
  electron.ipcMain.handle("sync:get-clients", () => {
    try {
      return getSyncServer().getConnectedClients();
    } catch (error) {
      return [];
    }
  });
  setInterval(() => {
    try {
      const server = getSyncServer();
      const status = server.getStatus();
      if (status.running) {
        const windows = electron.BrowserWindow.getAllWindows();
        windows.forEach((win) => {
          if (!win.isDestroyed()) {
            win.webContents.send("sync:server-status", {
              ...status,
              clients: server.getConnectedClients()
            });
          }
        });
      }
    } catch (error) {
    }
  }, 5e3);
}
function cleanupSyncServer() {
  return stopSyncServer();
}
const icon = path.join(__dirname, "../../resources/icon.png");
const logsPath = electron.app.isPackaged ? getLogsPath() : path.join(__dirname, "../../logs");
if (!fs.existsSync(logsPath)) {
  try {
    fs.mkdirSync(logsPath, { recursive: true });
  } catch {
  }
}
function logError(context, error) {
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  const message = `[${timestamp}] ${context}: ${error}
`;
  console.error(message);
  try {
    const logFile = path.join(logsPath, "error.log");
    fs.writeFileSync(logFile, message, { flag: "a" });
  } catch {
  }
}
process.on("uncaughtException", (error) => {
  logError("Uncaught Exception", error);
});
process.on("unhandledRejection", (reason, promise) => {
  logError("Unhandled Rejection", `${reason} at ${promise}`);
});
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: "hidden",
    icon: process.platform === "linux" ? icon : void 0,
    webPreferences: {
      preload: getPreloadPath(),
      // Security: Enable context isolation (required for contextBridge)
      contextIsolation: true,
      // Security: Enable sandbox for renderer
      sandbox: true,
      // Security: Disable node integration in renderer
      nodeIntegration: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.on("render-process-gone", (_event, details) => {
    logError("Renderer Process Gone", JSON.stringify(details));
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (!electron.app.isPackaged && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  electron.app.setAppUserModelId("com.supermarket.controlos");
  if (!electron.app.isPackaged) {
    electron.app.on("browser-window-created", (_, window) => {
      window.webContents.on("before-input-event", (event, input) => {
        if (input.key === "F12") {
          window.webContents.toggleDevTools();
          event.preventDefault();
        }
      });
    });
  }
  electron.ipcMain.on("ping", () => console.log("pong"));
  electron.ipcMain.handle("print:receipt", async (_event, htmlContent) => {
    const printWindow = new electron.BrowserWindow({
      show: false,
      webPreferences: {
        offscreen: true,
        contextIsolation: true,
        sandbox: true
      }
    });
    await printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
    return new Promise((resolve, reject) => {
      printWindow.webContents.print({ silent: true, printBackground: true }, (success, failureReason) => {
        printWindow.close();
        if (success) resolve();
        else reject(new Error(failureReason));
      });
    });
  });
  electron.ipcMain.handle("print:label", async (_event, htmlContent) => {
    const printWindow = new electron.BrowserWindow({
      show: false,
      webPreferences: {
        offscreen: true,
        contextIsolation: true,
        sandbox: true
      }
    });
    await printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
    return new Promise((resolve, reject) => {
      printWindow.webContents.print({ silent: true, printBackground: true }, (success, failureReason) => {
        printWindow.close();
        if (success) resolve();
        else reject(new Error(failureReason));
      });
    });
  });
  electron.ipcMain.handle("app:version", () => electron.app.getVersion());
  setupSyncIpcHandlers();
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("before-quit", async () => {
  try {
    await cleanupSyncServer();
  } catch (error) {
    console.error("Failed to cleanup sync server:", error);
  }
});

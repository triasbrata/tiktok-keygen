// import { install } from "source-map-support";
// install();
import { app, BrowserWindow, ipcMain, dialog } from "electron";
import * as path from "path";
import { TiktokStreaming } from "./stream";
import { BrowserEngine } from "./tiktok";
import { loadConfig, saveConfig } from "./config";
import WebSocket from "ws";
import OBSWebSocket from "obs-websocket-js";

let mainWindow: BrowserWindow | null = null;
let streamInstance: TiktokStreaming | null = null;

const createWindow = () => {
  const preloadPath = path.join(__dirname, "renders/preload.js");
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../", "main.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// IPC Handlers
ipcMain.handle("load-config", async () => {
  return loadConfig();
});

ipcMain.handle("save-config", async (event, config) => {
  saveConfig(config);
});
ipcMain.handle("listen-obs", async (event, config) => {
  const obs = new OBSWebSocket();
  await obs.connect(`ws://${config.url}`, config.password);
});
ipcMain.handle("load-token", async () => {
  // Implement loadToken logic if needed
  // For simplicity, returning null here
  return null;
});

ipcMain.handle("fetch-online-token", async () => {
  const chromePath =
    process.platform === "darwin"
      ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      : process.platform === "win32"
      ? path.resolve(
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
        )
      : "";
  if (chromePath === "") {
    throw new Error("chrome browser not exists");
  }
  const retriever = new BrowserEngine(chromePath);
  const token = await retriever.retrieveToken();
  if (token) {
    saveConfig({ token });
  }
  return token;
});

ipcMain.handle("start-stream", async (event, { title, game }) => {
  if (!streamInstance) {
    const config = loadConfig();
    if (!config || !config.token) {
      return { success: false, message: "No token available." };
    }
    streamInstance = new TiktokStreaming(config.token);
  }

  try {
    const { rtmp, key } = await streamInstance.start(title, game);
    return { success: true, rtmp, key };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle("end-stream", async () => {
  if (!streamInstance) {
    return { success: false, message: "No active stream." };
  }

  const success = await streamInstance.end();
  if (success) {
    streamInstance = null;
    return { success: true };
  } else {
    return { success: false, message: "Failed to end stream." };
  }
});

ipcMain.handle("search-game", async (event, gameName: string) => {
  if (!streamInstance) {
    const config = loadConfig();
    if (!config || !config.token) {
      return [];
    }
    streamInstance = new TiktokStreaming(config.token);
  }

  const categories = await streamInstance.search(gameName);
  return categories;
});

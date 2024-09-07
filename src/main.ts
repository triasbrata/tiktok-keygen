import { app, BrowserWindow, ipcMain, dialog } from "electron";
import * as path from "path";
import { Stream } from "./stream";
import { TokenRetriever } from "./tiktok";
import { loadConfig, saveConfig } from "./config";

let mainWindow: BrowserWindow | null = null;
let streamInstance: Stream | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));

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

ipcMain.handle("load-token", async () => {
  // Implement loadToken logic if needed
  // For simplicity, returning null here
  return null;
});

ipcMain.handle("fetch-online-token", async () => {
  const retriever = new TokenRetriever();
  const token = await retriever.retrieveToken();
  return token;
});

ipcMain.handle("start-stream", async (event, { title, game }) => {
  if (!streamInstance) {
    const config = loadConfig();
    if (!config || !config.token) {
      return { success: false, message: "No token available." };
    }
    streamInstance = new Stream(config.token);
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
    streamInstance = new Stream(config.token);
  }

  const categories = await streamInstance.search(gameName);
  return categories;
});

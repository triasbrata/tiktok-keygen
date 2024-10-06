import path from "path";
import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { registerTitlebarIpc } from "./window/titlebarIpc";
import { createTable, db } from "./pg/connection";
import { IpcTiktok } from "./tiktok/ipc";
import repo from "./pg/repository";

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  createTable(db);
  await app.whenReady();
  const preloadPath = path.join(__dirname, "preload.js");
  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    autoHideMenuBar: true,
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      webSecurity: false,
      preload: preloadPath,
    },
  });

  if (isProd) {
    await mainWindow.loadURL("app://./setup/account");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/setup/account`);
    // mainWindow.webContents.openDevTools();
  }
  registerTitlebarIpc(mainWindow);
  await new IpcTiktok(mainWindow, repo).registerTiktokIpc().loadConfig();
})();

app.on("window-all-closed", async () => {
  try {
    await db.close();
    app.quit();
  } catch (error) {
    console.error(error);
  }
});
ipcMain.on("message", async (event, arg) => {
  event.reply("message", `${arg} World!`);
});

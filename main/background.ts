import { init, captureException, IPCMode } from "@sentry/electron/main";
init({
  dsn: "https://34f5da70eb23230897206b55f98ba63f@o4507871057608704.ingest.de.sentry.io/4508112020897872",
  sampleRate: 0.5,
  ipcMode: IPCMode.Protocol,
});
import path from "path";
import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { registerTitlebarIpc } from "./window/titlebarIpc";
import { createTable, db } from "./pg/connection";
import { IpcTiktok } from "./tiktok/ipc";
import repo from "./pg/repository";
import { registerObsIpc } from "./ipc/obs/ipc";
import { isProd } from "./config";
import { electron } from "process";
if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

async function main() {
  app.on("window-all-closed", async () => {
    try {
      await db.close();
      app.quit();
    } catch (error) {
      console.error(error);
      captureException(error);
    }
  });
  try {
    // createTable(db);
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
    //register ipc here
    registerTitlebarIpc(mainWindow);
    console.log("here");
    registerObsIpc(mainWindow);
    await new IpcTiktok(mainWindow, repo).registerTiktokIpc().loadConfig();

    if (isProd) {
      await mainWindow.loadURL("app://./setup/account");
    } else {
      const port = process.argv[2];
      await mainWindow.loadURL(`http://localhost:${port}/setup/account`);
    }
  } catch (error) {
    captureException(error);
  }
}
main();
process.on("unhandledRejection", (r) => {
  console.error(r, "unhandledRejection");
});
process.on("uncaughtException", (r) => {
  console.error(r, "uncaughtException");
});

import { IpcEventName } from "@share/ipcEvent";
import { app, BrowserWindow, dialog, ipcMain, shell } from "electron";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path, { join, resolve } from "path";
import { TokenRetriever } from "./tiktok";
import repo from "@main/pg/repository";

export function registerTiktokIpc(window: BrowserWindow) {
  const handleLoginTiktok = async (e: Electron.IpcMainInvokeEvent) => {
    const browserPath =
      process.platform === "darwin"
        ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        : process.platform === "win32"
        ? path.resolve(
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
          )
        : "";
    if (!existsSync(browserPath)) {
      throw new Error("No Chrome detected");
    }

    const cachePath = await repo.getCachePath();
    const retriever = new TokenRetriever(browserPath, cachePath);
    const token = await retriever.retrieveToken();
    if (token) {
      await repo.saveToken(token);
    }
    return;
  };
  const handleSelectCacheBrowser = async (
    e: Electron.IpcMainInvokeEvent
  ): Promise<boolean> => {
    const filePath = await dialog.showOpenDialogSync(window, {
      filters: [{ extensions: ["json"], name: "cache file" }],
    });
    if (!Array.isArray(filePath)) {
      return false;
    }
    const cookiePath = filePath[0];
    const cookiesPathAppData = join(app.getPath("appData"), "cookies.json");
    //copy file
    writeFileSync(cookiesPathAppData, readFileSync(cookiePath), { flag: "w" });
    await repo.setCachePath(cookiesPathAppData);
    return true;
  };
  const OpenLink = (e: Electron.IpcMainInvokeEvent, url: string) => {
    shell.openExternal(url);
  };
  ipcMain.handle(IpcEventName.OpenLink, OpenLink);
  ipcMain.handle(IpcEventName.SelectCacheBrowser, handleSelectCacheBrowser);
  ipcMain.handle(IpcEventName.LoginTiktok, handleLoginTiktok);
}

import { IpcEventName } from "@share/ipcEvent";
import { app, BrowserWindow, dialog, ipcMain, shell } from "electron";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path, { join, resolve } from "path";
import { TokenRetriever } from "./tiktok";
import repo from "@main/pg/repository";
import { appDataFolder } from "@main/utils/path";
import { TiktokStreaming } from "./stream";
import { ConfigRepoInterface } from "@main/config/interface";
export class IpcTiktok {
  private stream: TiktokStreaming;
  /**
   *
   */
  constructor(
    private readonly window: BrowserWindow,
    private readonly repo: ConfigRepoInterface
  ) {}
  async loadConfig() {
    this.stream = new TiktokStreaming(await this.repo.getStreamLabKey());
    return this;
  }
  registerTiktokIpc() {
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
        this.stream = new TiktokStreaming(token);
        await repo.saveStreamLabKey(token);
      }
      return;
    };
    const handleSelectCacheBrowser = async (
      e: Electron.IpcMainInvokeEvent
    ): Promise<boolean> => {
      const filePath = await dialog.showOpenDialogSync(this.window, {
        filters: [{ extensions: ["json"], name: "cache file" }],
      });
      if (!Array.isArray(filePath)) {
        return false;
      }
      const cookiePath = filePath[0];

      const cookiesPathAppData = join(appDataFolder, "cookies.json");
      //copy file
      writeFileSync(cookiesPathAppData, readFileSync(cookiePath), {
        flag: "w",
      });
      await repo.setCachePath(cookiesPathAppData);
      return true;
    };
    const OpenLink = (e: Electron.IpcMainInvokeEvent, url: string) => {
      shell.openExternal(url);
    };
    const handleGetStreamLabKey = () => {
      return repo.getStreamLabKey();
    };
    ipcMain.handle(IpcEventName.OpenLink, OpenLink);
    ipcMain.handle(IpcEventName.SelectCacheBrowser, handleSelectCacheBrowser);
    ipcMain.handle(IpcEventName.LoginTiktok, handleLoginTiktok);
    ipcMain.handle(IpcEventName.GetStreamLabKey, handleGetStreamLabKey);
    const handleGoTiktokLive = async (
      e: Electron.IpcMainInvokeEvent,
      liveForm: Record<string, any>
    ): Promise<{ key: string; rtmp: string }> => {
      const res = await this.stream.start(liveForm.title, liveForm.topic);
      console.log({ res });
      return res;
    };
    ipcMain.handle(IpcEventName.GoTiktokLive, handleGoTiktokLive);
    return this;
  }
}

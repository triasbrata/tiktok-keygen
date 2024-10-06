import { IpcEventName } from "@share/ipcEvent";
import { app, BrowserWindow, dialog, ipcMain, shell } from "electron";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path, { join, resolve } from "path";
import { BrowserEngine } from "./tiktok";
import repo from "@main/pg/repository";
import { appDataFolder } from "@main/utils/path";
import { TiktokStreaming } from "./stream";
import { ConfigRepoInterface } from "@main/config/interface";
import { StreamLabAuth } from "./streamlab-auth";
import { uniqueId } from "lodash";
import axios from "axios";
import { registerLiveEventIpc } from "./live-connector/liveIpc";
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
    const handleLoginTiktok = async (
      e: Electron.IpcMainInvokeEvent,
      username: string
    ) => {
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
      const browserEngine = new BrowserEngine(browserPath, cachePath);
      try {
        await browserEngine.startEngine();
        const userData = await browserEngine.openTiktok();
        const [token] = await Promise.all([
          // new StreamLabAuth(browserEngine).getToken(),
          this.saveUserData(e, userData),
        ]);

        if (token) {
          this.stream = new TiktokStreaming(token);
          await repo.saveStreamLabKey(token);
        }
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        await browserEngine.stopEngine();
      }
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
    const handleGoTiktokLive = async (
      liveForm: Record<string, any>
    ): Promise<{ key: string; rtmp: string }> => {
      const { streamId, ...res } = await this.stream.start(
        liveForm.title,
        liveForm.topic
      );
      await this.repo.saveStreamID(streamId);
      return res;
    };
    const handleStopTiktokLive = async () => {
      const streamID = await this.repo.getStreamId();
      if (streamID) {
        const res = this.stream.end(streamID);
        await this.repo.deleteStreamID(streamID);
        return res;
      }
      return false;
    };
    ipcMain.on(IpcEventName.IsTiktokStreamLive, async (e) => {
      const [_, remove] = await this.repo.getLiveUpdateTiktokStream((data) => {
        console.log({ data });
        e.reply(IpcEventName.IsTiktokStreamLive, data);
      });
      ipcMain.handleOnce(IpcEventName.IsTiktokStreamLive, (_, data) => {
        console.log({ data });
        if (data === false) {
          remove();
        }
      });
    });
    ipcMain.handle(IpcEventName.OpenLink, OpenLink);
    ipcMain.handle(IpcEventName.SelectCacheBrowser, handleSelectCacheBrowser);
    ipcMain.handle(IpcEventName.LoginTiktok, handleLoginTiktok);
    ipcMain.handle(IpcEventName.GetStreamLabKey, handleGetStreamLabKey);
    ipcMain.handle(IpcEventName.GoTiktokLive, handleGoTiktokLive);
    ipcMain.handle(IpcEventName.StopTiktokLive, handleStopTiktokLive);
    registerLiveEventIpc();
    return this;
  }
  async saveUserData(
    e: Electron.IpcMainInvokeEvent,
    userData: { pp: string; secuid: string; uid: string; nicName: string }
  ): Promise<any> {
    await Promise.all([
      this.downloadProfilePicture(e.sender, userData.pp),
      this.repo.savesecuid(userData.secuid),
      e.sender.send(IpcEventName.TiktokIdentity, {
        username: userData.uid,
        name: userData.nicName,
      }),
    ]);
  }
  async downloadProfilePicture(
    sender: Electron.WebContents,
    url: string
  ): Promise<any> {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    sender.send(
      IpcEventName.UpdateTiktokProfilePicture,
      Buffer.from(res.data).toString("base64")
    );
  }
}

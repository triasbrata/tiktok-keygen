import { IpcEventName } from "@share/ipcEvent";
import { app, BrowserWindow, dialog, ipcMain, session, shell } from "electron";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path, { join } from "path";
import { BrowserEngine } from "./tiktok";
import repo from "@main/pg/repository";
import { appDataFolder } from "@main/utils/path";
import { TiktokStreaming } from "./stream";
import { ConfigRepoInterface } from "@main/config/interface";
import axios from "axios";
import { registerLiveEventIpc } from "./live-connector/liveIpc";
import { LiveForm, tiktokLoginResponse } from "./type";
import { StreamLabAuth } from "./streamlab-auth";
import { populateStreamConfig } from "./inject";
import { getObs } from "@main/ipc/obs/ipc";
import { withSentry } from "@share/sentry-handler";
import { devtools } from "zustand/middleware";
import { Proxy } from "http-mitm-proxy";
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
    const handleLoginTiktok = async (): Promise<tiktokLoginResponse> => {
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
        const [token, profilePicture] = await Promise.allSettled([
          new StreamLabAuth(browserEngine).getToken(),
          this.downloadProfilePicture(userData.pp),
        ]);

        if (token.status == "fulfilled") {
          this.stream = new TiktokStreaming(token.value);
        }
        return {
          token: token.status === "fulfilled" ? token.value : undefined,
          username: userData.uid,
          secuid: userData.secuid,
          name: userData.nicName,
          profilePicture:
            profilePicture.status === "fulfilled"
              ? profilePicture.value
              : undefined,
        };
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        await browserEngine.stopEngine();
      }
    };
    const handleLoginTiktokNative = async () => {
      let moved = false;

      const win = new BrowserWindow({
        minWidth: 800,
        minHeight: 600,
        // show: false,
        webPreferences: {
          // session: customSession,
          devTools: true,
        },
      });
      // customSession.webRequest.
      const wb = win.webContents;
      const streamLabAuth = new StreamLabAuth(win);
      const waitUntilLogin = async () => {
        await new Promise<void>((res) => {
          wb.on("did-stop-loading", () => {
            const url = wb.getURL();
            const cond = url.includes("tiktok.com/foryou") && !moved;
            if (cond) {
              moved = true;
              res();
            }
          });
        });
        await streamLabAuth.getToken();
      };

      await Promise.all([
        waitUntilLogin(),
        win.loadURL("https://tiktok.com/login"),
      ]);
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
      e: Electron.IpcMainInvokeEvent,
      liveForm: LiveForm
    ): Promise<{ key: string; rtmp: string; streamId: string }> => {
      const res = await this.stream.start(
        liveForm.title,
        liveForm.topic,
        liveForm.streamlabToken
      );
      try {
        console.log({ liveForm });
        if (liveForm.injectConfig) {
          await populateStreamConfig(res, getObs());

          // if (liveForm.multistream) {
          //   populateMultistreamConfig(
          //     liveForm.configPath,
          //     res,
          //     liveForm.activeProfile,
          //     "TikTok"
          //   );
          // } else {
          // }
        }
      } catch (error) {
        this.stream.end(res.streamId, liveForm.streamlabToken);
        throw error;
      }
      // await this.repo.saveStreamID(streamId);
      return res;
    };
    const handleStopTiktokLive = async (_, token, streamID) => {
      if (streamID) {
        const res = this.stream.end(streamID, token);
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
    ipcMain.handle(IpcEventName.OpenLink, withSentry(OpenLink));
    ipcMain.handle(
      IpcEventName.SelectCacheBrowser,
      withSentry(handleSelectCacheBrowser)
    );
    ipcMain.handle(
      IpcEventName.LoginTiktok,
      withSentry(handleLoginTiktokNative)
    );
    ipcMain.handle(
      IpcEventName.GetStreamLabKey,
      withSentry(handleGetStreamLabKey)
    );
    ipcMain.handle(IpcEventName.GoTiktokLive, withSentry(handleGoTiktokLive));
    ipcMain.handle(
      IpcEventName.StopTiktokLive,
      withSentry(handleStopTiktokLive)
    );
    registerLiveEventIpc();
    return this;
  }
  async downloadProfilePicture(url: string): Promise<any> {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(res.data).toString("base64");
  }
}

import { IpcEventName } from "@share/ipcEvent";
import { ipcRenderer } from "electron";

export const context = {
  tiktokLogin() {
    return ipcRenderer.invoke(IpcEventName.LoginTiktok);
  },
  openLink(link: string) {
    return ipcRenderer.invoke(IpcEventName.OpenLink, link);
  },
  selectCacheBrowser() {
    return ipcRenderer.invoke(IpcEventName.SelectCacheBrowser);
  },
  getStreamLabKey() {
    return ipcRenderer.invoke(IpcEventName.GetStreamLabKey);
  },
  goLive(
    formLive: Record<string, any>
  ): Promise<{ key: string; rtmp: string }> {
    return ipcRenderer.invoke(IpcEventName.GoTiktokLive, formLive);
  },
  stopLive() {
    return ipcRenderer.invoke(IpcEventName.StopTiktokLive);
  },
  getTiktokStreamID(cb: (data: any) => void) {
    ipcRenderer.send(IpcEventName.IsTiktokStreamLive);
    const overideCb: (
      event: Electron.IpcRendererEvent,
      ...args: any[]
    ) => void = (_, data) => cb(data);
    ipcRenderer.on(IpcEventName.IsTiktokStreamLive, overideCb);
    return () => {
      ipcRenderer.invoke(IpcEventName.IsTiktokStreamLive, false);
      ipcRenderer.off(IpcEventName.IsTiktokStreamLive, overideCb);
    };
  },
};
export type TiktokIntegrationContextType = typeof context;

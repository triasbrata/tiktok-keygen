import { IpcEventName } from "@share/ipcEvent";
import { ipcRenderer } from "electron";
import { TiktokEventEnum } from "./live-connector/tiktok-event";
import { LiveForm } from "./type";

export const context = {
  tiktokLogin(username: string) {
    return ipcRenderer.invoke(IpcEventName.LoginTiktok, username);
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
  goLive(formLive: LiveForm): Promise<{ key: string; rtmp: string }> {
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
  updateTiktokProfile(cb: (url: string) => void) {
    const cbOverride: (
      event: Electron.IpcRendererEvent,
      ...args: any[]
    ) => void = (_, url) => {
      cb(url);
    };
    ipcRenderer.on(IpcEventName.UpdateTiktokProfilePicture, cbOverride);
    return () =>
      ipcRenderer.off(IpcEventName.UpdateTiktokProfilePicture, cbOverride);
  },
  updateTiktokProfileInfo(
    cb: (param: { username: string; name: string }) => void
  ) {
    const cbOverride: (
      event: Electron.IpcRendererEvent,
      ...args: any[]
    ) => void = (_, param) => {
      cb(param);
    };
    ipcRenderer.on(IpcEventName.TiktokIdentity, cbOverride);
    return () => ipcRenderer.off(IpcEventName.TiktokIdentity, cbOverride);
  },
  //tiktok live connect
  liveEventStart(username: string) {
    return ipcRenderer.invoke(IpcEventName.TikTokLiveEventStart, username);
  },
  liveEventStop() {
    return ipcRenderer.invoke(IpcEventName.TikTokLiveEventStop);
  },
  liveEvent(cb: (param: { event: TiktokEventEnum; data: any }) => void) {
    const oCb: (event: Electron.IpcRendererEvent, ...args: any[]) => void = (
      _,
      data
    ) => {
      cb(data);
    };
    ipcRenderer.on(IpcEventName.TikTokLiveEvent, oCb);
    return () => ipcRenderer.off(IpcEventName.TikTokLiveEvent, oCb);
  },
};
export type TiktokIntegrationContextType = typeof context;

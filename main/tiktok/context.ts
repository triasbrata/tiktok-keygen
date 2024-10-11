import { IpcEventName } from "@share/ipcEvent";
import { ipcRenderer } from "electron";
import { TiktokEventEnum } from "./live-connector/tiktok-event";
import { LiveForm, tiktokLoginResponse } from "./type";
import { TiktokLiveEvent } from "./types/tiktokLive";

export const context = {
  tiktokLogin(): Promise<tiktokLoginResponse> {
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
    formLive: LiveForm
  ): Promise<{ key: string; rtmp: string; streamId: string }> {
    return ipcRenderer.invoke(IpcEventName.GoTiktokLive, formLive);
  },
  stopLive(token: string, streamId: string) {
    return ipcRenderer.invoke(IpcEventName.StopTiktokLive, token, streamId);
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
  //tiktok live connect
  liveEventStart(username: string, roomID?: string) {
    return ipcRenderer.invoke(
      IpcEventName.TikTokLiveEventStart,
      username,
      roomID
    );
  },
  liveEventStop() {
    return ipcRenderer.invoke(IpcEventName.TikTokLiveEventStop);
  },
  liveEvent(cb: (param: Partial<TiktokLiveEvent>) => void) {
    const oCb: (event: Electron.IpcRendererEvent, ...args: any[]) => void = (
      _,
      data
    ) => {
      cb({ [data.event]: data.data });
    };
    ipcRenderer.on(IpcEventName.TikTokLiveEvent, oCb);
    return () => ipcRenderer.off(IpcEventName.TikTokLiveEvent, oCb);
  },
  async onEventDisconnected(cb: () => void) {
    const handleCb: any = () => {
      cb();
    };
    ipcRenderer.on(IpcEventName.OnTiktokEventDisconnectReply, handleCb);
    await ipcRenderer.invoke(IpcEventName.OnTiktokEventDisconnect);
    return () => {
      ipcRenderer.invoke(IpcEventName.OffTiktokEventDisconnect);
      ipcRenderer.removeListener(
        IpcEventName.OnTiktokEventDisconnectReply,
        handleCb
      );
    };
  },
};
export type TiktokIntegrationContextType = typeof context;

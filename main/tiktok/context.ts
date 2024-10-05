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
  ): Promise<{ key: string; rmtp: string }> {
    return ipcRenderer.invoke(IpcEventName.GoTiktokLive, formLive);
  },
};
export type TiktokIntegrationContextType = typeof context;

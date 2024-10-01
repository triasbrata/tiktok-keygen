import { contextBridge, ipcRenderer } from "electron";

const electronApi: ElectronAPIPreloadLogin = {
  exchangeAuthCode: (authCode: string) =>
    ipcRenderer.send("exchange-auth-code", authCode),
};
contextBridge.exposeInMainWorld("electronAPI", electronApi);

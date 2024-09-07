// preload.ts
import { contextBridge, ipcRenderer } from "electron";

const electronApi: Partial<ElectronAPI> = {
  loadConfig: () => ipcRenderer.invoke("load-config"),
  saveConfig: (config: any) => ipcRenderer.invoke("save-config", config),
  loadToken: () => ipcRenderer.invoke("load-token"),
  fetchOnlineToken: () => ipcRenderer.invoke("fetch-online-token"),
  startStream: (title: string, game: string) =>
    ipcRenderer.invoke("start-stream", { title, game }),
  endStream: () => ipcRenderer.invoke("end-stream"),
  searchGame: (gameName: string) => ipcRenderer.invoke("search-game", gameName),
};
contextBridge.exposeInMainWorld("electronAPI", electronApi);

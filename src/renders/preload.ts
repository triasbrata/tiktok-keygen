// preload.ts
console.log("hello");
import { contextBridge, ipcRenderer } from "electron";

const electronApi: Partial<ElectronAPIPreloadApp> = {
  loadConfig: () => ipcRenderer.invoke("load-config"),
  saveConfig: (config: any) => ipcRenderer.invoke("save-config", config),
  loadToken: () => ipcRenderer.invoke("load-token"),
  fetchOnlineToken: () => {
    console.log("boom");
    return ipcRenderer.invoke("fetch-online-token");
  },
  startStream: (title: string, game: string) =>
    ipcRenderer.invoke("start-stream", { title, game }),
  endStream: () => ipcRenderer.invoke("end-stream"),
  searchGame: (gameName: string) => ipcRenderer.invoke("search-game", gameName),
  listenObs: (config) => ipcRenderer.invoke("listen-obs", config),
  onServerObsClose(cb) {
    ipcRenderer.once("obs-disconnect", cb);
  },
};
contextBridge.exposeInMainWorld("electronAPI", electronApi);

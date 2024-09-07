import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  getToken: () => ipcRenderer.invoke("getToken"),
} as Partial<ElectronAPI>);

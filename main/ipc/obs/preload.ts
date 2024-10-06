import { contextBridge } from "electron";
import { ObsContext } from "./context";

contextBridge.exposeInMainWorld("obsWebsocket", ObsContext);

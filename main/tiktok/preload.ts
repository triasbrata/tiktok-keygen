import { contextBridge } from "electron";
import { context } from "./context";

contextBridge.exposeInMainWorld("tiktok_integration", context);

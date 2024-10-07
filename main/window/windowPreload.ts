import { contextBridge } from "electron";
import titlebarContext from "./titlebarContext";
contextBridge.exposeInMainWorld("titlebar", titlebarContext);

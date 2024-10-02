/**
 * Copyright (c) 2021, Guasam
 *
 * This software is provided "as-is", without any express or implied warranty. In no event
 * will the authors be held liable for any damages arising from the use of this software.
 * Read the LICENSE file for more details.
 *
 * @author  : guasam
 * @project : Electron Window
 * @package : Titlebar IPC (Renderer Process)
 */

import { ipcRenderer } from "electron";
import { IpcEventName } from "@share/ipcEvent";
import { removeListener } from "process";

const titlebarContext = {
  exit() {
    ipcRenderer.invoke(IpcEventName.WindowClose);
  },
  undo() {
    ipcRenderer.invoke(IpcEventName.WebUndo);
  },
  redo() {
    ipcRenderer.invoke(IpcEventName.WebRedo);
  },
  cut() {
    ipcRenderer.invoke(IpcEventName.WebCut);
  },
  copy() {
    ipcRenderer.invoke(IpcEventName.WebCopy);
  },
  paste() {
    ipcRenderer.invoke(IpcEventName.WebPaste);
  },
  delete() {
    ipcRenderer.invoke(IpcEventName.WebDelete);
  },
  select_all() {
    ipcRenderer.invoke(IpcEventName.WebSelectAll);
  },
  reload() {
    ipcRenderer.invoke(IpcEventName.WebReload);
  },
  force_reload() {
    ipcRenderer.invoke(IpcEventName.WebForceReload);
  },
  toggle_devtools() {
    ipcRenderer.invoke(IpcEventName.WebToggleDevtools);
  },
  actual_size() {
    ipcRenderer.invoke(IpcEventName.WebActualSize);
  },
  zoom_in() {
    ipcRenderer.invoke(IpcEventName.WebZoomIn);
  },
  zoom_out() {
    ipcRenderer.invoke(IpcEventName.WebZoomOut);
  },
  toggle_fullscreen() {
    ipcRenderer.invoke(IpcEventName.WebToggleFullscreen);
  },
  minimize() {
    ipcRenderer.invoke(IpcEventName.WindowMinimize);
  },
  toggle_maximize() {
    ipcRenderer.invoke(IpcEventName.WindowToggleMaximize);
  },
  open_url(url: string) {
    ipcRenderer.invoke(IpcEventName.OpenUrl, url);
  },
  os() {
    return ipcRenderer.invoke(IpcEventName.Os);
  },
  isFullScreen(cb: (isFullScreen: boolean) => void) {
    ipcRenderer.on(IpcEventName.IsFullScreen, (e, isFullScreen) => {
      cb(isFullScreen);
    });
  },
  removeListenerFullscreen(cb: (isFullScreen: boolean) => void) {
    ipcRenderer.removeListener(IpcEventName.IsFullScreen, (e, isFullScreen) => {
      cb(isFullScreen);
    });
  },
};

export type TitlebarContextApi = typeof titlebarContext;

export default titlebarContext;

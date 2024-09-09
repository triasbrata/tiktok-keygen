/**
 * Copyright (c) 2021, Guasam
 *
 * This software is provided "as-is", without any express or implied warranty. In no event
 * will the authors be held liable for any damages arising from the use of this software.
 * Read the LICENSE file for more details.
 *
 * @author  : guasam
 * @project : Electron Window
 * @package : Titlebar IPC (Main Process)
 */

import { IpcEventName } from '@share/ipcEvents';
import { BrowserWindow, ipcMain, shell } from 'electron';

export const registerTitlebarIpc = (mainWindow: BrowserWindow) => {
  ipcMain.handle(IpcEventName.Os, () => {
    if (process.platform === 'darwin') {
      return 'mac';
    }
    return 'windows';
  });
  ipcMain.handle(IpcEventName.WindowMinimize, () => {
    mainWindow.minimize();
  });

  ipcMain.handle(IpcEventName.WindowMaximize, () => {
    mainWindow.maximize();
  });

  ipcMain.handle(IpcEventName.WindowToggleMaximize, () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.handle(IpcEventName.WindowClose, () => {
    mainWindow.close();
  });

  ipcMain.handle(IpcEventName.WebUndo, () => {
    mainWindow.webContents.undo();
  });

  ipcMain.handle(IpcEventName.WebRedo, () => {
    mainWindow.webContents.redo();
  });

  ipcMain.handle(IpcEventName.WebCut, () => {
    mainWindow.webContents.cut();
  });

  ipcMain.handle(IpcEventName.WebCopy, () => {
    mainWindow.webContents.copy();
  });

  ipcMain.handle(IpcEventName.WebPaste, () => {
    mainWindow.webContents.paste();
  });

  ipcMain.handle(IpcEventName.WebDelete, () => {
    mainWindow.webContents.delete();
  });

  ipcMain.handle(IpcEventName.WebSelectAll, () => {
    mainWindow.webContents.selectAll();
  });

  ipcMain.handle(IpcEventName.WebReload, () => {
    mainWindow.webContents.reload();
  });

  ipcMain.handle(IpcEventName.WebForceReload, () => {
    mainWindow.webContents.reloadIgnoringCache();
  });

  ipcMain.handle(IpcEventName.WebToggleDevtools, () => {
    mainWindow.webContents.toggleDevTools();
  });

  ipcMain.handle(IpcEventName.WebActualSize, () => {
    mainWindow.webContents.setZoomLevel(0);
  });

  ipcMain.handle(IpcEventName.WebZoomIn, () => {
    mainWindow.webContents.setZoomLevel(mainWindow.webContents.zoomLevel + 0.5);
  });

  ipcMain.handle(IpcEventName.WebZoomOut, () => {
    mainWindow.webContents.setZoomLevel(mainWindow.webContents.zoomLevel - 0.5);
  });

  ipcMain.handle(IpcEventName.WebToggleFullscreen, () => {
    mainWindow.setFullScreen(!mainWindow.fullScreen);
  });

  ipcMain.handle(IpcEventName.OpenUrl, (e, url: string) => {
    shell.openExternal(url);
  });
};

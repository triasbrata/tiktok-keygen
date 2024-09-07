// src/TokenRetriever.ts
import { BrowserView, BrowserWindow } from "electron";
import * as fs from "fs";
import * as path from "path";

export class TokenRetriever {
  /**
   *
   */

  private CLIENT_KEY = "awdjaq9ide8ofrtz";
  private REDIRECT_URI = "https://streamlabs.com/tiktok/auth";
  private SCOPE =
    "user.info.basic,live.room.info,live.room.manage,user.info.profile,user.info.stats";
  private STREAMLABS_API_URL = "https://streamlabs.com/api/v5/auth/data";

  async retrieveToken(): Promise<string | null> {
    const browserPage = new BrowserWindow({
      width: 400,
      height: 300,
      webPreferences: {
        preload: path.resolve(__dirname, "renders/preloadLogin.js"),
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    // Navigate to Streamlabs login
    await browserPage.loadURL("https://streamlabs.com/m/login");
    const token = await new Promise<string>(() => {
      return "hello";
    });
    await browserPage.close();

    return token;
  }
}

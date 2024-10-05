import { app } from "electron";
import { existsSync, mkdir, mkdirSync } from "fs";
import { join } from "path";

export const appDataFolder = join(app.getPath("appData"), "tikobs");
if (!existsSync(appDataFolder)) {
  mkdirSync(appDataFolder);
}

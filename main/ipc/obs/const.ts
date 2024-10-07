import { app } from "electron";
import { platform } from "os";
import { join } from "path";

const obsWindowsPath = join(app.getPath("appData"), "obs-studio");
export const obsPath = () => (platform() === "win32" ? obsWindowsPath : "");

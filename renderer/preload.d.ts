import { IpcHandler } from "@main/preload";
import { TitlebarContextApi } from "@main/window/titlebarContext";

declare global {
  interface Window {
    ipc: IpcHandler;
    electron_window: {
      titlebar: TitlebarContextApi;
    };
  }
}

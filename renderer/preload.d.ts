import { IpcHandler } from "@main/preload";
import { TitlebarContextApi } from "@main/window/titlebarContext";

declare global {
  interface Window {
    ipc: IpcHandler;
    titlebar: TitlebarContextApi;
  }
}

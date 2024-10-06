import { IpcHandler } from "@main/preload";
import type { TitlebarContextApi } from "@main/window/titlebarContext";
import type { TiktokIntegrationContextType } from "@main/tiktok/context";
import type { ObsContextType } from "../main/ipc/obs/context";

declare global {
  interface Window {
    ipc: IpcHandler;
    electron_window: {
      titlebar: TitlebarContextApi;
    };
    tiktok_integration: TiktokIntegrationContextType;
    obsWebsocket: ObsContextType;
  }
}

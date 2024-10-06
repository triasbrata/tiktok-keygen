import { IpcEventName } from "@share/ipcEvent";
import { ipcRenderer } from "electron";
import { WebsocketPayload } from "./type";
import type { OBSEventTypes, OBSRequestTypes } from "obs-websocket-js";

export const ObsContext = {
  connectWebsocket(payload: WebsocketPayload) {
    return ipcRenderer.invoke(IpcEventName.OBSWebsocketStart, payload);
  },
  destroyWebsocket() {
    return ipcRenderer.invoke(IpcEventName.OBSWebsocketStop);
  },
  websocketEmit<T = OBSRequestTypes, R extends keyof T = keyof T, P = T[R]>(
    event: R,
    payload?: P
  ) {
    return ipcRenderer.invoke(
      IpcEventName.OBSWebsocketSendCommand,
      event,
      payload
    );
  },
  async listenWebsocket<
    T = OBSEventTypes,
    R extends keyof T = keyof T,
    P = T[R]
  >(event: R, cb: (payload: P) => void) {
    const ocb: (event: Electron.IpcRendererEvent, ...args: any[]) => void = (
      _,
      e,
      p
    ) => {
      if (event === e) {
        cb(p);
      }
    };
    const unsub = await ipcRenderer.invoke(
      IpcEventName.OBSWebsocketStartEvent,
      event
    );
    ipcRenderer.on(IpcEventName.OBSWebsocketReply, ocb);
    return () => {
      if (typeof unsub === "function") {
        unsub();
      }
      ipcRenderer.off(IpcEventName.OBSWebsocketReply, ocb);
    };
  },
};
export type ObsContextType = typeof ObsContext;

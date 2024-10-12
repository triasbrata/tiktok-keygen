import { StateCreator } from "zustand";

type OBSWebsocketData = {
  ip: string;
  port: number;
  password?: string;
  reconnectCount: number;
  programUUID: string;
};
type OBSWebsocketAction = {
  updateWebsocketOBS(
    data: Omit<OBSWebsocketData, "reconnectCount" | "programUUID">
  ): void;
  forceReconnect(): void;
  resetReconnectCount(): void;
  setProgramUUID(v: string): void;
};
export type OBSWebsocketContext = OBSWebsocketData & OBSWebsocketAction;

export const OBSWebsocketSlice: StateCreator<OBSWebsocketContext> = (set) => ({
  ip: "",
  port: 0,
  reconnectCount: 0,
  programUUID: "",
  setProgramUUID(v) {
    set({ programUUID: v });
  },
  resetReconnectCount() {
    set({ reconnectCount: 0 });
  },
  forceReconnect() {
    set((p) => ({
      reconnectCount: p.reconnectCount + 1,
    }));
  },
  updateWebsocketOBS(data) {
    console.log({ data });
    set((p) => {
      let inc = 0;
      if (
        data.ip == p.ip &&
        data.port === p.port &&
        data.password === p.password
      ) {
        inc = 1;
      }
      return {
        ip: data.ip,
        port: data.port,
        password: data.password,
        reconnectCount: p.reconnectCount + 1,
      };
    });
  },
});

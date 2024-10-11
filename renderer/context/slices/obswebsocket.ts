import { StateCreator } from "zustand";

type OBSWebsocketData = {
  ip: string;
  port: number;
  password?: string;
  reconnectCount: number;
  programUUID: string;
};
type OBSWebsocketAction = {
  updateWebsocketOBS(data: OBSWebsocketData): void;
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
    set({
      ip: data.ip,
      port: data.port,
      password: data.password,
    });
  },
});

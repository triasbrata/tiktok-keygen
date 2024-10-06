import { StateCreator } from "zustand";

type OBSWebsocketData = {
  ip: string;
  port: number;
  password?: string;
};
type OBSWebsocketAction = {
  updateWebsocketOBS(data: OBSWebsocketData): void;
};
export type OBSWebsocketContext = OBSWebsocketData & OBSWebsocketAction;

export const OBSWebsocketSlice: StateCreator<OBSWebsocketContext> = (set) => ({
  ip: "",
  port: 0,
  updateWebsocketOBS(data) {
    set({
      ip: data.ip,
      port: data.port,
      password: data.password,
    });
  },
});

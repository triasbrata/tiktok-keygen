import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserContextSlice, userSlice } from "./slices/user";
import { SpeakContextSlice, speakSettingSlice } from "./slices/speak";
import { OBSWebsocketContext, OBSWebsocketSlice } from "./slices/obswebsocket";
import {
  ObsConfigInjectContext,
  ObsConfigInjectSlice,
} from "./slices/obs-config-inject";

export const useZustandState = create<
  UserContextSlice &
    SpeakContextSlice &
    OBSWebsocketContext &
    ObsConfigInjectContext
>()(
  persist(
    (...a) => ({
      ...userSlice(...a),
      ...speakSettingSlice(...a),
      ...OBSWebsocketSlice(...a),
      ...ObsConfigInjectSlice(...a),
    }),
    {
      name: "user-storage",
    }
  )
);

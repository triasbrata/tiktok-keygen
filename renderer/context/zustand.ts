import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserContextSlice, userSlice } from "./slices/user";
import { SpeakContextSlice, speakSettingSlice } from "./slices/speak";
import { OBSWebsocketContext, OBSWebsocketSlice } from "./slices/obswebsocket";

export const useZustandState = create<
  UserContextSlice & SpeakContextSlice & OBSWebsocketContext
>()(
  persist(
    (...a) => ({
      ...userSlice(...a),
      ...speakSettingSlice(...a),
      ...OBSWebsocketSlice(...a),
    }),
    {
      name: "user-storage",
    }
  )
);

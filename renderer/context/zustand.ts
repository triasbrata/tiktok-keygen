import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserContextSlice, userSlice } from "./slices/user";
import { SpeakContextSlice, speakSettingSlice } from "./slices/speak";

export const useZustandState = create<UserContextSlice & SpeakContextSlice>()(
  persist(
    (...a) => ({
      ...userSlice(...a),
      ...speakSettingSlice(...a),
    }),
    {
      name: "user-storage",
    }
  )
);

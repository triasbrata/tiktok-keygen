import { StateCreator } from "zustand";

type tiktokLiveData = {
  isLive: boolean;
  isLiveEventStart: boolean;
};
type tiktokLiveAction = {
  setLive(v: boolean): void;
  setLiveEventStarted(v: boolean): void;
};
export type tiktokLiveContextSlice = tiktokLiveAction & tiktokLiveData;
export const tiktokLiveSlice: StateCreator<tiktokLiveContextSlice> = (set) => ({
  isLive: false,
  isLiveEventStart: false,
  setLive(v) {
    set({ isLive: v });
  },
  setLiveEventStarted(v) {
    set({ isLiveEventStart: v });
  },
});

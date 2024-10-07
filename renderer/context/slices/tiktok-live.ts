import { StateCreator } from "zustand";

type tiktokLiveData = {
  isLive: boolean;
  isLiveEventStart: boolean;
  title: string;
  topic: string;
};
type tiktokLiveAction = {
  setLive(v: boolean): void;
  setLiveEventStarted(v: boolean): void;
  setTopic(topic: string): void;
  setTitle(title: string): void;
};
export type tiktokLiveContextSlice = tiktokLiveAction & tiktokLiveData;
export const tiktokLiveSlice: StateCreator<tiktokLiveContextSlice> = (set) => ({
  isLive: false,
  isLiveEventStart: false,
  title: "",
  topic: "",
  setTopic(topic) {
    set({ topic });
  },
  setTitle(title) {
    set({ title });
  },
  setLive(v) {
    set({ isLive: v });
  },
  setLiveEventStarted(v) {
    set({ isLiveEventStart: v });
  },
});

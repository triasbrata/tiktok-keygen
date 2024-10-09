import { StateCreator } from "zustand";

type tiktokLiveData = {
  isLiveEventStart: boolean;
  title: string;
  topic: string;
  topicValue: string;
  streamId: string;
};
type tiktokLiveAction = {
  setLiveEventStarted(v: boolean): void;
  setStreamId(v?: string): void;
  setTopic(id: string, topic: string): void;
  setTitle(title: string): void;
};
export type tiktokLiveContextSlice = tiktokLiveAction & tiktokLiveData;
export const tiktokLiveSlice: StateCreator<tiktokLiveContextSlice> = (set) => ({
  isLiveEventStart: false,
  title: "",
  topic: "",
  topicValue: "",
  streamId: "",
  setStreamId(v) {
    set({ streamId: v ?? "" });
  },
  setTopic(topic, value) {
    set({ topic, topicValue: value });
  },
  setTitle(title) {
    set({ title });
  },
  setLiveEventStarted(v) {
    set({ isLiveEventStart: v });
  },
});

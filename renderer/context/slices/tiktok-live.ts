import { StateCreator } from "zustand";

type tiktokLiveData = {
  isLiveEventStart: boolean;
  title: string;
  topic: string;
  topicValue: string;
  streamId: string;
  eventReconnect: number;
};
type tiktokLiveAction = {
  setLiveEventStarted(v: boolean): void;
  setStreamId(v?: string): void;
  setTopic(id: string, topic: string): void;
  setTitle(title: string): void;
  resetReconnectEvent(): void;
  reconnectEvent(): void;
};
export type tiktokLiveContextSlice = tiktokLiveAction & tiktokLiveData;
export const tiktokLiveSlice: StateCreator<tiktokLiveContextSlice> = (
  set,
  get
) => ({
  isLiveEventStart: false,
  title: "",
  topic: "",
  topicValue: "",
  streamId: "",
  eventReconnect: 0,
  resetReconnectEvent() {
    if (get().eventReconnect !== 0) {
      set({ eventReconnect: 0 });
    }
  },
  reconnectEvent() {
    set((p) => ({ eventReconnect: p.eventReconnect + 1 }));
  },
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

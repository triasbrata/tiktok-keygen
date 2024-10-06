import { random } from "lodash";
import { StateCreator } from "zustand";

type speakData = {
  isRandom: boolean;
  lang: string;
  pitch: number;
  volume: number;
  rate: number;
};
type speakAction = {
  randomVoice(value: boolean): void;
  setLang(lang: string): void;
  setPitch(pich: number): void;
  setVolume(volume: number): void;
  setRate(rate: number): void;
};
export type SpeakContextSlice = speakData & speakAction;

export const speakSettingSlice: StateCreator<SpeakContextSlice> = (set) => ({
  isRandom: false,
  lang: "id",
  pitch: 1,
  volume: 1,
  rate: 1,
  setVolume(volume) {
    set({ volume });
  },
  setPitch(pitch) {
    set({ pitch: pitch });
  },
  setRate(rate) {
    set({ rate });
  },
  setLang(lang) {
    set({ lang });
  },
  randomVoice(value) {
    set({ isRandom: value });
  },
});

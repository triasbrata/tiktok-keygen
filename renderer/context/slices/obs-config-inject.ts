import { StateCreator } from "zustand";

type ObsConfigInjectData = {
  injectConfig: boolean;
  multistream: boolean;
  configPath?: string;
};

type ObsConfigInjectAction = {
  setInjectConfig(v: boolean): void;
  setMultistream(v: boolean): void;
  setConfigPath(v?: string): void;
};
export type ObsConfigInjectContext = ObsConfigInjectAction &
  ObsConfigInjectData;

export const ObsConfigInjectSlice: StateCreator<ObsConfigInjectContext> = (
  set
) => ({
  injectConfig: false,
  multistream: false,
  setConfigPath(v) {
    set({ configPath: v });
  },
  setInjectConfig(d) {
    set({
      injectConfig: d,
    });
  },
  setMultistream(v) {
    set({ multistream: v });
  },
});

import { StateCreator } from "zustand";

type ObsConfigInjectData = {
  injectConfig: boolean;
  multistream: boolean;
};

type ObsConfigInjectAction = {
  setInjectConfig(v: boolean): void;
  setMultistream(v: boolean): void;
};
export type ObsConfigInjectContext = ObsConfigInjectAction &
  ObsConfigInjectData;

export const ObsConfigInjectSlice: StateCreator<ObsConfigInjectContext> = (
  set
) => ({
  injectConfig: false,
  multistream: false,
  setInjectConfig(d) {
    set({
      injectConfig: d,
    });
  },
  setMultistream(v) {
    set({ multistream: v });
  },
});

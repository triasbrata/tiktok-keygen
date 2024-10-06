import type { ObsContextType } from "../../../main/ipc/obs/context";
export function ObsContext(): ObsContextType {
  if (window.obsWebsocket) {
    return window.obsWebsocket;
  }
  return {} as ObsContextType;
}

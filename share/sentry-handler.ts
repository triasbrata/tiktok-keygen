import { captureException } from "@sentry/electron/main";
import { IpcMainInvokeEvent } from "electron";

export function withSentry(
  handler: (e: IpcMainInvokeEvent, ...args: any[]) => Promise<any> | any
) {
  return async (e: IpcMainInvokeEvent, ...args: any[]) => {
    try {
      const val = handler(e, ...args);
      if (val instanceof Promise) {
        const res = await val;
        return res;
      }
      return val;
    } catch (error) {
      captureException(error);
    }
  };
}

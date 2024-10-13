import { IpcEventName } from "@share/ipcEvent";
import { ipcMain, IpcMainInvokeEvent } from "electron";
import { WebcastPushConnection } from "tiktok-live-connector";
import { TiktokEventEnum } from "./tiktok-event";
import { withSentry } from "@share/sentry-handler";

export function registerLiveEventIpc() {
  let con: WebcastPushConnection;
  const handleTiktokLiveEventStart = async (
    e: Electron.IpcMainInvokeEvent,
    username: string,
    roomID?: string
  ) => {
    console.log(Object.values(TiktokEventEnum));
    con = new WebcastPushConnection(username);
    Object.values(TiktokEventEnum).map((it) => {
      con.on(it, (data) => {
        e.sender.send(IpcEventName.TikTokLiveEvent, {
          event: it,
          data,
        });
      });
    });
    const retcon = await con.connect(roomID);
    return retcon;
  };
  const handleTiktokEventStop = () => {
    if (con) {
      Object.values(TiktokEventEnum).map((it) => {
        con.removeAllListeners(it);
      });
      con.disconnect();
    }
  };
  const handleOnTiktokEventDisconnected = (e: IpcMainInvokeEvent) => {
    if (!con) {
      return;
    }
    const cb = () => {
      e.sender.send(IpcEventName.OnTiktokEventDisconnectReply);
    };
    con.on("disconnected", cb);
    con.on("streamEnd", cb);
    ipcMain.handleOnce(IpcEventName.OffTiktokEventDisconnect, () => {
      con.off("disconnect", cb);
      con.off("streamEnd", cb);
    });
  };
  ipcMain.handle(
    IpcEventName.TikTokLiveEventStart,
    withSentry(handleTiktokLiveEventStart)
  );
  ipcMain.handle(
    IpcEventName.TikTokLiveEventStop,
    withSentry(handleTiktokEventStop)
  );
  ipcMain.handle(
    IpcEventName.OnTiktokEventDisconnect,
    withSentry(handleOnTiktokEventDisconnected)
  );
}

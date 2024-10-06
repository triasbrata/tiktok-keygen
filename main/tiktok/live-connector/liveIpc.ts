import { IpcEventName } from "@share/ipcEvent";
import { ipcMain } from "electron";
import { WebcastPushConnection } from "tiktok-live-connector";
import { TiktokEventEnum } from "./tiktok-event";
export function registerLiveEventIpc() {
  let con: WebcastPushConnection;
  const handleTiktokLiveEventStart = async (
    e: Electron.IpcMainInvokeEvent,
    username: string
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
    const retcon = await con.connect();
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
  ipcMain.handle(IpcEventName.TikTokLiveEventStart, handleTiktokLiveEventStart);
  ipcMain.handle(IpcEventName.TikTokLiveEventStop, handleTiktokEventStop);
}

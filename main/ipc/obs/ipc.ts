import { IpcEventName } from "@share/ipcEvent";
import { app, BrowserWindow, dialog, ipcMain } from "electron";
import OBSWebSocket, { type OBSEventTypes } from "obs-websocket-js";
import { WebsocketPayload } from "./type";
import { join } from "path";
import { obsPath } from "./const";
import { existsSync, readFileSync, writeFileSync } from "fs";

let obsClient: OBSWebSocket;
export function getObs() {
  return obsClient;
}
export function registerObsIpc(web: BrowserWindow) {
  const registerObsIpcListenerAndDestructive = (obsWebsocket: OBSWebSocket) => {
    const eventNames: Record<keyof OBSEventTypes, boolean> = {
      CurrentSceneCollectionChanging: false,
      CurrentSceneCollectionChanged: false,
      SceneCollectionListChanged: false,
      CurrentProfileChanging: false,
      CurrentProfileChanged: false,
      ProfileListChanged: false,
      SourceFilterListReindexed: false,
      SourceFilterCreated: false,
      SourceFilterRemoved: false,
      SourceFilterNameChanged: false,
      SourceFilterSettingsChanged: false,
      SourceFilterEnableStateChanged: false,
      ExitStarted: false,
      InputCreated: false,
      InputRemoved: false,
      InputNameChanged: false,
      InputSettingsChanged: false,
      InputActiveStateChanged: false,
      InputShowStateChanged: false,
      InputMuteStateChanged: false,
      InputVolumeChanged: false,
      InputAudioBalanceChanged: false,
      InputAudioSyncOffsetChanged: false,
      InputAudioTracksChanged: false,
      InputAudioMonitorTypeChanged: false,
      InputVolumeMeters: false,
      MediaInputPlaybackStarted: false,
      MediaInputPlaybackEnded: false,
      MediaInputActionTriggered: false,
      StreamStateChanged: false,
      RecordStateChanged: false,
      RecordFileChanged: false,
      ReplayBufferStateChanged: false,
      VirtualcamStateChanged: false,
      ReplayBufferSaved: false,
      SceneItemCreated: false,
      SceneItemRemoved: false,
      SceneItemListReindexed: false,
      SceneItemEnableStateChanged: false,
      SceneItemLockStateChanged: false,
      SceneItemSelected: false,
      SceneItemTransformChanged: false,
      SceneCreated: false,
      SceneRemoved: false,
      SceneNameChanged: false,
      CurrentProgramSceneChanged: false,
      CurrentPreviewSceneChanged: false,
      SceneListChanged: false,
      CurrentSceneTransitionChanged: false,
      CurrentSceneTransitionDurationChanged: false,
      SceneTransitionStarted: false,
      SceneTransitionEnded: false,
      SceneTransitionVideoEnded: false,
      StudioModeStateChanged: false,
      ScreenshotSaved: false,
      VendorEvent: false,
      CustomEvent: false,
    };
    const handleObsWebsocketStartEvent: (
      event: Electron.IpcMainInvokeEvent,
      ...args: any[]
    ) => Promise<any> | any = (e, eventName) => {
      const cbEvent: (...args: any) => void = (data) => {
        e.sender.send(IpcEventName.OBSWebsocketReply, eventName, data);
      };
      eventNames[eventName] = true;
      obsWebsocket.on(eventName, cbEvent);
      return () => obsWebsocket.off(eventName, cbEvent);
    };
    const handleSendCommand: (
      event: Electron.IpcMainEvent,
      ...args: any[]
    ) => void = (_, event, payload) => {
      return obsWebsocket.call(event, payload);
    };
    ipcMain.handleOnce(IpcEventName.OBSWebsocketStop, () => {
      console.log("unload here");
      ipcMain.removeHandler(IpcEventName.OBSWebsocketStartEvent);
      ipcMain.removeHandler(IpcEventName.OBSWebsocketSendCommand);
      for (const event of Object.keys(eventNames) as Array<
        keyof OBSEventTypes
      >) {
        if (eventNames[event]) {
          obsWebsocket.removeAllListeners(event);
        }
      }

      obsWebsocket.disconnect();
    });
    ipcMain.handle(IpcEventName.OBSWebsocketSendCommand, handleSendCommand);
    ipcMain.handle(
      IpcEventName.OBSWebsocketStartEvent,
      handleObsWebsocketStartEvent
    );
  };
  const handleObsWebsocketStart = async (
    e: Electron.IpcMainInvokeEvent,
    payload: WebsocketPayload
  ): Promise<{
    obsWebSocketVersion?: string;
    rpcVersion?: number;
    authentication?: { challenge: string; salt: string };
    negotiatedRpcVersion?: number;
  }> => {
    const obsWebsocket = new OBSWebSocket();
    const res = await obsWebsocket.connect(
      `http://${payload.ip}:${payload.port}`,
      payload.password
    );
    obsClient = obsWebsocket;
    if (res.rpcVersion) {
      registerObsIpcListenerAndDestructive(obsWebsocket);
    }
    return res;
  };
  const handleSelectObsConfigMultiStream = async () => {
    const pathData = join(
      obsPath(),
      "plugin_config/aitum-multistream/config.json"
    );
    if (existsSync(pathData)) {
      return pathData;
    }
    return null;
  };
  const handleSelectObsStreamConfig = (_, activeProfile: string) => {
    const pathData = join(
      obsPath(),
      "basic/profiles",
      activeProfile,
      "service.json"
    );
    if (existsSync(pathData)) {
      return pathData;
    }
    return null;
  };
  ipcMain.handle(IpcEventName.OBSWebsocketStart, handleObsWebsocketStart);
  ipcMain.handle(
    IpcEventName.SelectObsConfigMultiStream,
    handleSelectObsConfigMultiStream
  );
  ipcMain.handle(
    IpcEventName.SelectObsStreamConfig,
    handleSelectObsStreamConfig
  );
}

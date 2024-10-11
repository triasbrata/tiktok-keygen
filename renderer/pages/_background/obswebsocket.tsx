import { useToast } from "@/components/hooks/use-toast";
import { useWindowUnloadEffectNext } from "@/components/hooks/use-window-unload";
import { ObsContext } from "@/context/ipc/obs";
import { OBSWebsocketContext } from "@/context/slices/obswebsocket";
import { useZustandState } from "@/context/zustand";
import { toastErrorPayload } from "@/libs/utils";
import React, { useEffect } from "react";

export default function OBSWebsocket() {
  const { toast } = useToast();
  const {
    ip,
    password,
    port,
    reconnectCount,
    resetReconnectCount,
    setProgramUUID,
  } = useZustandState<OBSWebsocketContext>((s) => s);
  useWindowUnloadEffectNext(
    () => {
      const doSync = async () => {
        if (ip.length == 0) {
          return;
        }
        try {
          await ObsContext().connectWebsocket({ ip, password, port });
          const res = await ObsContext().sendCommand("GetCurrentProgramScene");
          setProgramUUID(res.currentProgramSceneUuid);

          // const res = await ObsContext().sendCommand("GetCurrentPreviewScene");
          // console.log({ res });
          toast({
            title: "OBS Websocket connected",
            description: `websocket connect to ${ip}:${port}`,
          });

          // const resVendor = await ObsContext().sendCommand(
          //   "CallVendorRequest",
          //   {
          //     vendorName: "obs-multi-rtmp",
          //     requestType: "add_new_target",
          //     requestData: {
          //       ping: "wow",
          //     },
          //   }
          // );
          // console.log({ resVendor });
        } catch (error) {
          toast(toastErrorPayload(error.message));
        }
      };
      doSync();
      return () => {
        resetReconnectCount();
        ObsContext()
          .destroyWebsocket()
          .catch((e) => console.error(e));
      };
    },
    true,
    [ip, password, port, reconnectCount]
  );
  return <></>;
}

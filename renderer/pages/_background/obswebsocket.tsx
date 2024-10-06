import { useToast } from "@/components/hooks/use-toast";
import { useWindowUnloadEffectNext } from "@/components/hooks/use-window-unload";
import { ObsContext } from "@/context/ipc/obs";
import { OBSWebsocketContext } from "@/context/slices/obswebsocket";
import { useZustandState } from "@/context/zustand";
import { toastErrorPayload } from "@/libs/utils";
import React from "react";

export default function OBSWebsocket() {
  const { toast } = useToast();
  const { ip, password, port } = useZustandState<OBSWebsocketContext>((s) => s);
  useWindowUnloadEffectNext(
    () => {
      const doSync = async () => {
        try {
          await ObsContext().connectWebsocket({ ip, password, port });
          toast({
            title: "OBS Websocket connected",
            description: `websocket connect to ${ip}:${port}`,
          });
          const res = await ObsContext().sendCommand("GetCurrentProgramScene");
          console.log({ res });
        } catch (error) {
          toast(toastErrorPayload(error.message));
        }
      };
      doSync();
      return () => {
        ObsContext()
          .destroyWebsocket()
          .catch((e) => console.error(e));
      };
    },
    true,
    [ip, password, port]
  );
  return <></>;
}

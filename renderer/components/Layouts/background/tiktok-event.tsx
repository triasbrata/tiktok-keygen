import { useWindowUnloadEffectNext } from "@/components/hooks/use-window-unload";
import React, { useState } from "react";
import { tiktokContext } from "@/context/ipc/tiktok";
import { TiktokEventEnum } from "@main/tiktok/live-connector/tiktok-event";
import { QueueTextToSpeak } from "./text-to-speach";
import { useZustandState } from "@/context/zustand";
import { useToast } from "@/components/hooks/use-toast";
import { sleep, toastErrorPayload } from "@/libs/utils";
import { UserContextSlice } from "@/context/slices/user";
import { tiktokLiveContextSlice } from "@/context/slices/tiktok-live";

export default function TiktokEvent() {
  const {
    username,
    setLiveEventStarted,
    eventReconnect,
    resetReconnectEvent,
    reconnectEvent,
  } = useZustandState<UserContextSlice & tiktokLiveContextSlice>((s) => s);
  const { toast } = useToast();
  useWindowUnloadEffectNext(
    () => {
      let unsub: () => void;
      let unsubDc: () => void;
      const doSync = async () => {
        try {
          await tiktokContext().liveEventStart(
            username
            // "aerostreet"
            // "7424574317905332997"
          );
          // unsubDc = await tiktokContext().onEventDisconnected(() => {
          //   setLiveEventStarted(false);
          // });
          setLiveEventStarted(true);
          toast({ title: "tiktok live event started" });
          unsub = tiktokContext().liveEvent((data) => {
            // console.log(data);
            // if (data.event === TiktokEventEnum.CHAT) {
            //   QueueTextToSpeak.next(
            //     `${data.data.nickname} bilang ${data.data.comment}`
            //   );
            // }
          });
        } catch (error) {
          console.error(error.message);
          setLiveEventStarted(false);
          // await sleep(10);
          // reconnectEvent();
          // toast(
          //   toastErrorPayload(
          //     error.message.replace(
          //       /Error occurred in handler for '.*?':\s*/g,
          //       ""
          //     )
          //   )
          // );
        }
      };

      doSync();
      return () => {
        resetReconnectEvent();
        tiktokContext().liveEventStop();
        if (typeof unsubDc === "function") {
          unsubDc();
        }
        if (typeof unsub === "function") {
          unsub();
        }
      };
    },
    true,
    [username, eventReconnect]
  );
  return <></>;
}

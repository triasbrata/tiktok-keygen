import { useWindowUnloadEffectNext } from "@/components/hooks/use-window-unload";
import React from "react";
import { tiktokContext } from "../../../main/tiktok/api";
import { TiktokEventEnum } from "../../../main/tiktok/live-connector/tiktok-event";
import { QueueTextToSpeak } from "./text-to-speach";
import { useZustandState } from "@/context/zustand";
import { useToast } from "@/components/hooks/use-toast";

export default function TiktokEvent() {
  const username = useZustandState((s) => s.username);
  const { toast } = useToast();
  useWindowUnloadEffectNext(() => {
    let unsub: () => void;
    const doSync = async () => {
      try {
        await tiktokContext().liveEventStart(username);
        unsub = tiktokContext().liveEvent((data) => {
          if (data.event === TiktokEventEnum.CHAT) {
            QueueTextToSpeak.next(data.data.comment);
          }
        });
      } catch (error) {
        console.error(error.message);
        toast({
          title: "woops",
          description: error.message.replace(
            /Error occurred in handler for '.*?':\s*/g,
            ""
          ),
          variant: "destructive",
        });
      }
    };
    doSync();
    return () => {
      tiktokContext().liveEventStop();
      if (typeof unsub === "function") {
        unsub();
      }
    };
  }, true);
  return <></>;
}

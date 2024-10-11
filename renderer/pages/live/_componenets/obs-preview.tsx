import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ObsContext } from "@/context/ipc/obs";
import { OBSWebsocketContext } from "@/context/slices/obswebsocket";
import { useZustandState } from "@/context/zustand";
import { sleep } from "@/libs/utils";
import { Pause, Play } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export default function ObsPreview() {
  const { programUUID } = useZustandState<OBSWebsocketContext>((s) => s);
  const [img, setImg] = useState(
    "https://images.unsplash.com/photo-1727961673785-689cad093cc7?q=80&w=3271&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  );
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    let validPromise = true;
    let timer: any;
    const cbTimer = async () => {
      if (!update) {
        await sleep(15);
        return cbTimer();
      }
      try {
        const res = await ObsContext().sendCommand("GetSourceScreenshot", {
          imageHeight: 720,
          imageWidth: 1280,
          imageFormat: "webp",
          sourceUuid: programUUID,
        });
        setImg(res.imageData);
      } catch (error) {
        console.error(error);
      }
      await sleep(0.6);
      if (validPromise) {
        cbTimer();
      }
    };
    cbTimer();
    return () => {
      validPromise = false;
      if (timer) {
        clearTimeout(timer);
      }
      // if (typeof unsub === "function") {
      //   unsub();
      // }
    };
  }, [update]);
  return (
    <Card
      className="grow max-h-[100%] rounded"
      style={{
        backgroundImage: `url(${img})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <CardContent
        className="p-0 min-h-[100%] flex items-stretch justify-center rounded"
        style={{
          backdropFilter: "blur(9px)",
          backgroundImage: `url(${img})`,
          backgroundRepeat: "no-repeat",
          // backgroundAttachment: "fixed",
          backgroundPosition: "center",
          backgroundSize: "contain",
        }}
      >
        <div
          className="w-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out rounded"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
        >
          <Button variant="ghost" onClick={() => setUpdate((p) => !p)}>
            {update ? <Pause /> : <Play />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

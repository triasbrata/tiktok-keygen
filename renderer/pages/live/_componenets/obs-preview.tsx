import { Card, CardContent } from "@/components/ui/card";
import { ObsContext } from "@/context/ipc/obs";
import React, { useEffect, useRef, useState } from "react";

export default function ObsPreview() {
  const ref = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef(new Image());
  const setPreview = (src: string) => {
    if (imageRef.current) {
      imageRef.current.src = src;
    }
  };
  useEffect(() => {
    if (ref.current) {
      const canvas = ref.current;
      const context = canvas.getContext("2d");
      if (imageRef.current) {
        const img = imageRef.current;
        img.onload = () => {
          // console.log({ img, context });
          context.drawImage(
            imageRef.current,
            0,
            0,
            canvas.width,
            canvas.height
          );
        };
      }
    }
    let timer: any;
    const cbTimer = async () => {
      try {
        const program = await ObsContext().sendCommand(
          "GetCurrentProgramScene"
        );
        const res = await ObsContext().sendCommand("GetSourceScreenshot", {
          imageHeight: 720,
          imageWidth: 1280,
          imageFormat: "webp",
          sourceUuid: program.currentProgramSceneUuid,
        });
        setPreview(res.imageData);
        cbTimer();
      } catch (error) {
        console.error(error);
      }
      // timer = setTimeout(() => {
      // }, 10);
    };
    cbTimer();
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      // if (typeof unsub === "function") {
      //   unsub();
      // }
    };
  }, []);
  return (
    <Card>
      <CardContent className="p-0 rounded">
        <canvas
          ref={ref}
          className="w-full rounded"
          width={1920}
          height={1080}
        />
      </CardContent>
    </Card>
  );
}

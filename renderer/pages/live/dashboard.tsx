import { ObsContext } from "@/context/ipc/obs";
import { tiktokContext } from "@/context/ipc/tiktok";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [preview, setpreview] = useState("/images/tiktok-icon.png");

  useEffect(() => {
    // const unsub = tiktokContext().liveEvent(({ event, data }) => {
    //   console.log(event, data);
    // });
    let timer: any;
    const cbTimer = async () => {
      try {
        // console.log({ scene });
        // const res = await ObsContext().sendCommand("GetSourceScreenshot", {
        //   imageHeight: 1280,
        //   imageWidth: 720,
        //   imageFormat: "webp",
        // });
        console.log(res.imageData);
      } catch (error) {
        console.error(error);
      }
      timer = setTimeout(() => {
        cbTimer();
      }, 1000);
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
    <div className="flex flex-row">
      <div className="flex flex-col">
        <div id="totalView"></div>
      </div>
      <div className="flex flex-row">
        <div className="flex-grow-1">
          <Image
            src={preview}
            alt={""}
            width={0}
            height={0}
            className="w-full"
          />
        </div>
        <div className="w-2/8">hello</div>
      </div>
    </div>
  );
}

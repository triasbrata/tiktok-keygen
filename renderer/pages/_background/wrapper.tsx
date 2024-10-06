import React, { useEffect } from "react";
import TextToSpeak from "./text-to-speach";
import TiktokEvent from "./tiktok-event";

export default function BackgroundProcess() {
  return (
    <>
      <TextToSpeak />
      <TiktokEvent />
    </>
  );
}

import { Maximize, Minimize, Minus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { TitlebarContextApi } from "../../../main/window/titlebarContext";

export default function WindowFrameWindowsButtons({
  context,
}: {
  context: TitlebarContextApi;
}) {
  const [fullScreen, setFullscreen] = useState(false);
  useEffect(() => {
    const cb = (fullScreen: boolean): void => {
      setFullscreen(fullScreen);
    };
    context.isFullScreen(cb);
    return () => {
      context.removeListenerFullscreen(cb);
    };
  }, []);

  return (
    <>
      <div>
        <button onClick={() => context.minimize()}>
          <Minus size={16} />
        </button>
      </div>
      <div>
        <button onClick={() => context.toggle_maximize()}>
          {fullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>
      </div>
      <div>
        <button onClick={() => context.exit()}>
          <X size={16} />
        </button>
      </div>
    </>
  );
}

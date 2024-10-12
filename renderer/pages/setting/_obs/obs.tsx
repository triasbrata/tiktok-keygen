import { Form } from "@/components/ui/form";
import React from "react";
import FormObsWebsocketSettings from "../../../components/pages/settings/obs/form-obs-websocket";
import FormObsStreamingInject from "../../../components/pages/settings/obs/form-obs-streaming-inject";
import { Button } from "@/components/ui/button";
import context from "@/context/ipc/window";

export default function ObsSetting() {
  return (
    <div className="flex flex-col gap-2 px-2 pb-4">
      <div className="pt-2">
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">OBS</h1>
        <p className="text-base text-muted-foreground">
          <span
            data-br=":rp6:"
            data-brr="1"
            style={{
              display: "inline-block",
              verticalAlign: "top",
              textDecoration: "inherit",
              minWidth: "358px",
            }}
          >
            Configuration obs websocket and setting injection.
          </span>
        </p>
      </div>
      <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
        OBS Connection
      </h2>
      <div className="px-3 gap-3 flex flex-col">
        <p className="leading-7">
          In OBS click "Tools" {">"} "WebSocket Server Settings" and enable the
          Websocket Server. Then click on "Show Connect Info" and enter the
          connection details here. Please note that the IP is always 127.0.0.1
          if OBS is running on the same system as TikObs.
        </p>
        <FormObsWebsocketSettings />
      </div>
      <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
        OBS Automation
      </h2>
      <div className="px-3 gap-3 flex flex-col">
        <p className="leading-7">
          This configuration will make obs auto start when you start tiktok
          live. <br /> If you do multistream you must install
          <Button
            variant="link"
            onClick={() =>
              context().open_url("https://aitum.tv/products/multi")
            }
          >
            Atium Multistream
          </Button>
          first!
        </p>
        <FormObsStreamingInject />
      </div>
    </div>
  );
}

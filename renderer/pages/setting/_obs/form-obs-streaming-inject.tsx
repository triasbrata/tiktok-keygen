import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ObsContext } from "@/context/ipc/obs";
import { ObsConfigInjectContext } from "@/context/slices/obs-config-inject";
import { useZustandState } from "@/context/zustand";
import { File } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

export default function FormObsStreamingInject() {
  const { injectConfig, multistream, setInjectConfig, setMultistream } =
    useZustandState<ObsConfigInjectContext>((s) => s);
  const [firstLoad, setFirstLoad] = useState(true);
  const handleSelectConfig = async () => {
    try {
      const res = await ObsContext().sendCommand("GetProfileList");
      if (!multistream) {
        // ObsContext().selectMultistreamConfig(res.currentProfileName);
      }
    } catch (error) {
    } finally {
    }
  };
  useEffect(() => {
    if (injectConfig && !firstLoad) {
      handleSelectConfig();
    }
    setFirstLoad(false);
  }, [injectConfig, multistream]);
  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex items-center space-x-2">
        <Switch
          id="airplane-mode"
          checked={injectConfig}
          onCheckedChange={() => setInjectConfig(!injectConfig)}
        />
        <Label htmlFor="airplane-mode">
          Enable Auto Inject Tiktok RTMP & Key
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="multi-stream"
          disabled={!injectConfig}
          checked={multistream}
          onCheckedChange={() => setMultistream(!multistream)}
        />
        <Label htmlFor="multi-stream">Multistream</Label>
      </div>
    </div>
  );
}

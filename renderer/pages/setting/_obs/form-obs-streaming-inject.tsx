import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ObsContext } from "@/context/ipc/obs";
import { ObsConfigInjectContext } from "@/context/slices/obs-config-inject";
import { useZustandState } from "@/context/zustand";
import { toastErrorPayload } from "@/libs/utils";
import { File } from "lucide-react";
import { setConfig } from "next/config";
import React, { useCallback, useEffect, useState } from "react";
import { boolean } from "zod";

export default function FormObsStreamingInject() {
  const { toast } = useToast();

  const {
    injectConfig,
    multistream,
    setInjectConfig,
    setMultistream,
    setConfigPath,
  } = useZustandState<ObsConfigInjectContext>((s) => s);
  const getConfig = (currentProfileName: string, multi: boolean) => {
    if (!multi) {
      return ObsContext().loadStreamConfig(currentProfileName);
    }
    return ObsContext().loadMultistreamConfig();
  };
  const handleLoadConfig = async (inject: boolean, multi: boolean) => {
    if (!inject) {
      setConfigPath();
      return;
    }
    try {
      const res = await ObsContext().sendCommand("GetProfileList");
      const configPath = await getConfig(res.currentProfileName, multi);
      if (configPath) {
        setConfigPath(configPath);
        toast({
          title: "Config Stream Loaded",
          description: "config stream loaded from " + configPath,
        });
      }
    } catch (error) {
      toast(toastErrorPayload(error.message));
      setMultistream(false);
      setInjectConfig(false);
    }
  };

  const handleInjectConfigChange = (e: boolean) => {
    setInjectConfig(e);
    setConfigPath();
  };
  const handleMultistreamChange = (e: boolean) => {
    setMultistream(e);
    setConfigPath();
  };
  useEffect(() => {
    handleLoadConfig(injectConfig, multistream);
  }, [injectConfig, multistream]);

  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex items-center space-x-2">
        <Switch
          id="airplane-mode"
          checked={injectConfig}
          onCheckedChange={handleInjectConfigChange}
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
          onCheckedChange={handleMultistreamChange}
        />
        <Label htmlFor="multi-stream">Multistream</Label>
      </div>
    </div>
  );
}

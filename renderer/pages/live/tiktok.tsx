import { Combobox } from "@/components/composite/combobox";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { tiktokContext } from "../../../main/tiktok/api";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Radio } from "lucide-react";
import { TextareaWithCounter } from "@/components/composite/text-area-with-counter";
import { useZustandState } from "@/context/zustand";
import { ObsConfigInjectContext } from "@/context/slices/obs-config-inject";
import { useToast } from "@/components/hooks/use-toast";
import { toastErrorPayload } from "@/libs/utils";
import { LiveForm } from "../../../main/tiktok/type";
export default function TiktokLivePage() {
  const { toast } = useToast();
  const { configPath, injectConfig, multistream } =
    useZustandState<ObsConfigInjectContext>((s) => s);
  const [formValue, _setFormValue] = useState<LiveForm>({
    multistream,
    configPath,
    title: "",
    topic: "",
  });
  const setFormValue = (key: string, value: string) =>
    _setFormValue((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  const handleOnSelected = (key: string, value: string): void => {
    setFormValue("topic", key);
  };
  const [liveKey, setLiveKey] = useState({ rtmp: "", key: "" });
  const [isLive, setLive] = useState(false);
  const [initialOptions, setInitialOptions] = useState([]);
  const handleOnSearch = async (
    search?: string
  ): Promise<Array<{ key: string; render: ReactNode; value: string }>> => {
    try {
      const slKey = await tiktokContext().getStreamLabKey();
      const response = await axios.get<{
        categories: Array<{ full_name: string; game_mask_id: string }>;
      }>(
        `https://streamlabs.com/api/v5/slobs/tiktok/info?category=${encodeURIComponent(
          search
        )}`,
        {
          headers: { Authorization: `Bearer ${slKey}` },
        }
      );
      const categories = response.data.categories;
      if (Array.isArray(categories)) {
        // categories.push({ full_name: "Others", game_mask_id: "" });
        return categories.map((it) => ({
          key: it.game_mask_id,
          render: it.full_name,
          value: it.full_name,
        }));
      }
    } catch (error) {
      console.error("Error fetching game categories:", error);
    }
    return [];
  };
  useEffect(() => {
    const doAsync = async () => {
      const res = await handleOnSearch();
      setInitialOptions(res);
    };
    doAsync();
  }, []);
  const speak = useRef(new SpeechSynthesisUtterance());
  useEffect(() => {
    window.speechSynthesis.speak(speak.current);
    return () => {};
  }, []);

  useEffect(() => {
    const removeListener = tiktokContext().getTiktokStreamID((data: any) => {
      setLive(data && data.value_data);
    });

    return () => {
      removeListener();
    };
  }, []);

  const handleGoLive = async () => {
    try {
      const res = await tiktokContext().goLive(formValue);
      setLiveKey(res);
    } catch (error) {
      toast(toastErrorPayload(error.message));
    }
  };

  const handleStopLive = async () => {
    await tiktokContext().stopLive();
    setLiveKey({ key: "", rtmp: "" });
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div>Topic</div>
        <div>
          <Combobox
            disable={isLive}
            onSearch={handleOnSearch}
            onSelected={handleOnSelected}
            options={initialOptions}
          />
        </div>
        <div>Title</div>
        <div>
          <TextareaWithCounter
            maxLength={250}
            onChange={(e) => setFormValue("title", e.target.value)}
            disabled={isLive}
          />
        </div>
      </div>
      <div className="flex justify-end gap-4 items-end">
        {!isLive ? (
          <div className="">
            <Button
              onClick={handleGoLive}
              className="flex items-center space-x-2"
              //
            >
              <Radio /> <span>Go Live</span>
            </Button>
          </div>
        ) : (
          <>
            <div className="">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Streaming Settings</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Streaming Settings</DialogTitle>
                    <DialogDescription>
                      <div className="flex flex-col gap-3 w-full">
                        <div className="grid items-center gap-1.5">
                          <Label htmlFor="rtmp">RTMP</Label>
                          <Input
                            type="rtmp"
                            id="rtmp"
                            placeholder="RTMP"
                            className="w-full"
                            readOnly
                            value={liveKey.rtmp}
                          />
                        </div>
                        <div className="grid items-center gap-1.5">
                          <Label htmlFor="key">Key</Label>
                          <Input
                            type="key"
                            id="key"
                            className="w-full"
                            placeholder="Key"
                            readOnly
                            value={liveKey.key}
                          />
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <div className="">
              <Button onClick={handleStopLive}>Stop Live</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

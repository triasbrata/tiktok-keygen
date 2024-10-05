import { Combobox } from "@/components/composite/combobox";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { tiktokContext } from "../../../main/tiktok/api";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
export default function TiktokLivePage() {
  const [formValue, _setFormValue] = useState({});
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
      console.log({ categories });
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
  const handleGoLive = async () => {
    const res = await tiktokContext().goLive(formValue);
    setLiveKey(res);
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div>Topic</div>
        <div>
          <Combobox
            onSearch={handleOnSearch}
            onSelected={handleOnSelected}
            options={initialOptions}
          />
        </div>
        <div>Title</div>
        <div>
          <Input onChange={(e) => setFormValue("title", e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-4 items-end">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="rtmp">RTMP</Label>
          <Input
            type="rtmp"
            id="rtmp"
            placeholder="RTMP"
            readOnly
            value={liveKey.rtmp}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="key">Key</Label>
          <Input
            type="key"
            id="key"
            placeholder="Key"
            readOnly
            value={liveKey.key}
          />
        </div>
        <div>
          <Button onClick={handleGoLive}> Go Live</Button>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { File } from "lucide-react";
import React, { useState } from "react";

export default function FormObsStreamingInject() {
  const [enableInject, setenableInject] = useState(false);
  return (
    <div className="flex flex-col w-1/3 space-y-6">
      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" />
        <Label htmlFor="airplane-mode">
          Enable Auto Inject Tiktok RTMP & Key
        </Label>
      </div>
      <div className="">
        <Button className="flex items-center space-x-2">
          <File className="" />
          <span>Select file</span>
        </Button>
      </div>
    </div>
  );
}

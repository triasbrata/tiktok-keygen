import { Button } from "@/components/ui/button";
import { Cookie, FileJson2, HardDriveDownload } from "lucide-react";
import React from "react";
import { tiktokContext } from "@/context/ipc/tiktok";
import { useToast } from "@/components/hooks/use-toast";
import Image from "next/image";

export function ExtractTiktokAccount() {
  const { toast } = useToast();
  const handleInstallCookiesEditor = () => {
    tiktokContext().openLink(
      "https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm"
    );
  };
  const handleOpenTiktok = () => {
    tiktokContext().openLink("https://www.tiktok.com/login");
  };
  const handleSelectCookies = async () => {
    const success = await tiktokContext().selectCacheBrowser();
    if (success) {
      toast({
        title: "success",
        description: "cookies browser alread loaded, try to login again",
      });
    }
  };
  return (
    <div className="gap-4 flex flex-col">
      <p className="leading-7">
        trouble to login, try to use existing cookies from your browser
      </p>
      <div className="gap-4 flex flex-col">
        <Button
          className={"flex items-center space-x-2"}
          onClick={handleInstallCookiesEditor}
        >
          <HardDriveDownload />
          <span>Install Cookies Editor</span>
        </Button>
        <Button
          className={"flex items-center space-x-2"}
          onClick={handleOpenTiktok}
        >
          <Cookie />
          <span>Extract Cookies</span>
        </Button>
        <Image
          src={"/images/enable_cookie_editor.png"}
          alt={""}
          width={100}
          height={100}
        />
        <Image
          src={"/images/export_cookie.png"}
          alt={""}
          width={100}
          height={100}
        />
        <div>
          <span>paste your json file in notepad and save as cookies.json</span>
        </div>
        <Button
          className={"flex items-center space-x-2"}
          onClick={handleSelectCookies}
        >
          <FileJson2 />
          <span>Set Cookies</span>
        </Button>
      </div>
    </div>
  );
}

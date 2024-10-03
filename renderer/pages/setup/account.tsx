import { Button } from "@/components/ui/button";
import {
  Cookie,
  FileJson2,
  HardDriveDownload,
  KeyRound,
  Loader2,
} from "lucide-react";
import React, {
  ButtonHTMLAttributes,
  MouseEventHandler,
  useState,
} from "react";
import { tiktokContext } from "../../../main/tiktok/api";
import { useToast } from "@/components/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Image from "next/image";
import { toast } from "sonner";

export default function SetupAccountPage() {
  return (
    <div>
      <div className="gap-4 items-center grid">
        <LoginTiktok />
        <ExtractTiktokAccount />
      </div>
    </div>
  );
}
function ExtractTiktokAccount() {
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
    <div>
      <span>
        trouble to login, try to use existing cookies from your browser
      </span>
      2024-10-03-17-23-51.png
      <div className="gap-4 items-center flex flex-row">
        <Button onClick={handleInstallCookiesEditor}>
          <HardDriveDownload />
          <span>Install Cookies Editor</span>
        </Button>
        <Button onClick={handleOpenTiktok}>
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
        <Button onClick={handleSelectCookies}>
          <FileJson2 />
          <span>Set Cookies</span>
        </Button>
      </div>
    </div>
  );
}
function LoginTiktok() {
  const [isLoading, setLoading] = useState(false);
  const { toast } = useToast();
  const handleOnClick = () => {
    setLoading(true);
    tiktokContext()
      .tiktokLogin()
      .catch((e) => {
        console.error(e);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: e.message,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      })
      .finally(() => setLoading(false));
  };
  return (
    <div className="gap-4 items-center flex flex-row">
      <span>Login Tiktok</span>
      <Button size="sm" onClick={handleOnClick}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <KeyRound className="mr-2 h-4 w-4" />
        )}
        Login
      </Button>
    </div>
  );
}

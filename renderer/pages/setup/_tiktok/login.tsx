import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { tiktokContext } from "@/context/ipc/tiktok";
import { UserContextSlice } from "@/context/slices/user";
import { useZustandState } from "@/context/zustand";
import { toastErrorPayload } from "@/libs/utils";
import { tiktokLoginResponse } from "@main/tiktok/type";
import { ToastAction } from "@radix-ui/react-toast";
import {
  AtSignIcon,
  Loader2,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";
import { useRef, useState } from "react";

export function LoginTiktok() {
  const {
    tiktokStreamlabToken,
    name,
    setTiktokStreamlabToken,
    setProfilePicture: updateProfilePicture,
    setTiktokIdentity: updateTiktokIdentity,
    setSecureID,
  } = useZustandState<UserContextSlice>((s) => s);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { toast } = useToast();
  const handleOnClick = () => {
    setLoading(true);
    tiktokContext()
      .tiktokLogin()
      .then((res) => {
        if (res.profilePicture) {
          updateProfilePicture(`data:image/jpeg;base64,${res.profilePicture}`);
        }
        if (res.username && res.name) {
          updateTiktokIdentity({ username: res.username, name: res.name });
        }
        if (res.token) {
          setTiktokStreamlabToken(res.token);
          toast({
            title: "Account Connected",
            description: `logged at tiktok as ${res.name} (${res.username})`,
          });
        }
        if (res.secuid) {
          setSecureID(res.secuid);
        }
      })
      .catch((e) => {
        console.error(e);
        toast(toastErrorPayload(e.message));
      })

      .finally(() => setLoading(false));
  };

  const handleLogout = () => {
    updateProfilePicture();
    updateTiktokIdentity({ name: "", username: "" });
    setSecureID();
    setTiktokStreamlabToken();
    console.log({ tiktokStreamlabToken });
  };
  return (
    <div className="gap-6 flex flex-col">
      <div>
        {tiktokStreamlabToken && (
          <div>
            <span>Logged at tiktok as {name}</span>
          </div>
        )}
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="email">Streamlab Token</Label>
        <div className="flex flex-row gap-4 items-center w-full">
          <Input
            type={showPassword ? "text" : "password"}
            readOnly
            className="w-128"
            endIcon={showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            onEndIconClick={() => setShowPassword((p) => !p)}
            value={tiktokStreamlabToken}
          />
          {!tiktokStreamlabToken && (
            <Button
              className={"flex items-center space-x-2"}
              size="sm"
              onClick={handleOnClick}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <KeyRound className="mr-2 h-4 w-4" />
              )}
              Login
            </Button>
          )}
          {tiktokStreamlabToken && (
            <Button
              className={"flex items-center space-x-2"}
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

import { StateCreator } from "zustand";
interface userData {
  username: string;
  name: string;
  profilePath: string;
  tiktokStreamlabToken?: string;
  secureID?: string;
}
interface userAction {
  setTiktokIdentity(param: { username: string; name: string }): void;
  setProfilePicture(base64?: string): void;
  setTiktokStreamlabToken(token?: string): void;
  setSecureID(v?: string): void;
}

export type UserContextSlice = userData & userAction;
export const userSlice: StateCreator<UserContextSlice> = (set) => ({
  name: "",
  username: "",
  profilePath: "/images/tiktok-icon.png",
  setSecureID(v) {
    set({ secureID: v });
  },
  setTiktokStreamlabToken(token) {
    set({ tiktokStreamlabToken: token });
  },
  setProfilePicture(url) {
    set({ profilePath: url ?? "/images/tiktok-icon.png" });
  },
  setTiktokIdentity(param) {
    set({
      username: param.username ?? "",
      name: param.name ?? "",
    });
  },
});

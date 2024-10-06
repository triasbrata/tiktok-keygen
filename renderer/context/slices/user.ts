import { StateCreator } from "zustand";
interface userData {
  username: string;
  name: string;
  profilePath: string;
}
interface userAction {
  updateTiktokIdentity: (param: { username: string; name: string }) => void;
  updateProfilePicture: (base64: string) => void;
}

export type UserContextSlice = userData & userAction;
export const userSlice: StateCreator<UserContextSlice> = (set) => ({
  name: "",
  username: "",
  profilePath: "",
  updateProfilePicture(url) {
    set({ profilePath: url });
  },
  updateTiktokIdentity(param) {
    set({
      username: param.username,
      name: param.name,
    });
  },
});

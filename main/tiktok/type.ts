export interface ObsConfigStream {
  type: "rtmp_custom";
  settings: Settings;
}

export interface Settings {
  server: string;
  use_auth: boolean;
  username: string;
  password: string;
  bwtest: boolean;
  key: string;
}
export interface LiveForm {
  title: string;
  topic: string;
  configPath?: string;
  multistream: boolean;
}

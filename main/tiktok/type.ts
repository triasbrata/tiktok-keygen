export interface ObsConfigStream {
  type: "rtmp_custom";
  settings: Settings;
}

export interface Settings {
  server: string;
  use_auth: boolean;
  username?: string;
  password?: string;
  bwtest: boolean;
  key: string;
}
export interface AitumMultistreamConfig {
  profiles: AitumProfile[];
}

export interface AitumProfile {
  name: string;
  outputs: Output[];
  video_encoder_description0: string;
}

export interface Output {
  name: string;
  stream_server: string;
  stream_key: string;
  scale_type: number;
  audio_encoder_settings: AudioEncoderSettings;
  audio_encoder: string;
  advanced: boolean;
  video_encoder?: string;
  video_encoder_settings?: VideoEncoderSettings;
}

export interface AudioEncoderSettings {
  bitrate: number;
}

export interface VideoEncoderSettings {
  bitrate: number;
  max_bitrate: number;
  keyint_sec: number;
  cqp: number;
  rate_control: string;
  preset2: string;
  multipass: string;
  tune: string;
  profile: string;
  psycho_aq: boolean;
  gpu: number;
  bf: number;
  repeat_headers: boolean;
}

export interface LiveForm {
  streamlabToken: string;
  title: string;
  topic: string;
  configPath?: string;
  multistream: boolean;
  activeProfile: string;
}
export interface tiktokLoginResponse {
  token?: string;
  name?: string;
  username?: string;
  secuid?: string;
  profilePicture?: string;
}

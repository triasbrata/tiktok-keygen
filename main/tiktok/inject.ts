import { existsSync, readFileSync, writeFileSync } from "fs";
import { AitumMultistreamConfig, ObsConfigStream } from "./type";
import type OBSWebSocket from "obs-websocket-js";

export function populateMultistreamConfig(
  configPath: string,
  res: { rtmp: string; key: string },
  activeProfile: string,
  platform: string
) {
  const configJson: AitumMultistreamConfig = loadConfigStream(configPath);
  let activeProfileIndex = configJson.profiles.findIndex(
    (it) => it.name === activeProfile
  );
  if (activeProfileIndex == -1) {
    activeProfileIndex = configJson.profiles.push({
      name: activeProfile,
      outputs: [],
      video_encoder_description0: "",
    });
    activeProfileIndex--; // make to profile
  }
  console.log({
    activeProfileIndex,
    configPath,
    res,
    activeProfile,
    platform,
    configJson,
  });
  let activeProfileConfig = configJson.profiles[activeProfileIndex];
  let indexPlatform = activeProfileConfig.outputs.findIndex(
    (it) => it.name === platform
  );
  if (indexPlatform === -1) {
    indexPlatform = activeProfileConfig.outputs.push({
      name: platform,
      advanced: false,
      audio_encoder: "ffmpeg_aac",
      audio_encoder_settings: {
        bitrate: 128,
      },
      scale_type: 3,
      stream_key: "",
      stream_server: "",
    });
    indexPlatform--; // to make last index
  }
  console.log(indexPlatform);
  console.log(activeProfileConfig.outputs);
  activeProfileConfig.outputs[indexPlatform].stream_key = res.key;
  activeProfileConfig.outputs[indexPlatform].stream_server = res.rtmp;
  configJson.profiles[activeProfileIndex] = activeProfileConfig;
  saveConfig(configPath, configJson);
}
export async function populateStreamConfig(
  res: { rtmp: string; key: string },
  obs: OBSWebSocket
) {
  try {
    await obs.call("SetStreamServiceSettings", {
      streamServiceType: "rtmp_custom",
      streamServiceSettings: {
        bwtest: false,
        key: res.key,
        server: res.rtmp,
        use_auth: false,
      },
    });
  } catch (error) {
    console.error("err populate", error);
  }
}
function loadConfigStream(configPath: string) {
  if (!existsSync(configPath)) {
    return {};
  }
  const content = readFileSync(configPath);
  createBackup(content, configPath);
  return JSON.parse(content.toString());
}
function createBackup(content: Buffer, configPath: string) {
  writeFileSync(`${configPath}.bck`, content);
}
function saveConfig(
  configPath: string,
  configJson: AitumMultistreamConfig | ObsConfigStream
) {
  const content = Buffer.from(JSON.stringify(configJson));
  writeFileSync(configPath, content);
}

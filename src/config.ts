import * as fs from "fs";
import * as path from "path";

const CONFIG_PATH = path.join(__dirname, "config.json");

export function loadConfig(): {
  title: string;
  game: string;
  token: string;
} | null {
  try {
    const data = fs.readFileSync(CONFIG_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading config:", error);
    return null;
  }
}

export function saveConfig(config: {
  title: string;
  game: string;
  token: string;
}) {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error("Error saving config:", error);
  }
}

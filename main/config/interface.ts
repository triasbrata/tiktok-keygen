export interface ConfigRepoInterface {
  getStreamLabKey(): Promise<string>;
  saveStreamLabKey(token: string): Promise<void>;
  getCachePath(): Promise<string | undefined>;
  setCachePath(path: string): Promise<void>;
}

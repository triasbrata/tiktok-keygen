export interface ConfigRepoInterface {
  saveToken(token: string): Promise<void>;
  getCachePath(): Promise<string | undefined>;
  setCachePath(path: string): Promise<void>;
}

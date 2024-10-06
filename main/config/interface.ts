export interface ConfigRepoInterface {
  savesecuid(secuid: string): any;
  getLiveUpdateTiktokStream(cb: (data: any) => void): Promise<any>;
  getStreamId(): Promise<string | undefined>;
  deleteStreamID(streamID: any): Promise<void>;
  saveStreamID(streamId: string): Promise<void>;
  getStreamLabKey(): Promise<string>;
  saveStreamLabKey(token: string): Promise<void>;
  getCachePath(): Promise<string | undefined>;
  setCachePath(path: string): Promise<void>;
}

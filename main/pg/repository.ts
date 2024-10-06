import { ConfigRepoInterface } from "@main/config/interface";
import { db } from "./connection";
import { PGlite } from "@electric-sql/pglite";
import { ConfigName } from "./const";
import { Change } from "./types";

type LiveChanges<T> = {
  fields: { name: string; dataTypeID: number }[];
  initialChanges: Array<Change<T>>;
  unsubscribe: () => Promise<void>;
  refresh: () => Promise<void>;
};
class DataRepository implements ConfigRepoInterface {
  /**
   *
   */
  constructor(private readonly db: PGlite & { live: any }) {}
  savesecuid(secuid: string) {
    console.log({ secuid });
  }
  async getLiveUpdateTiktokStream(cb: (data: any) => void) {
    const ret: LiveChanges<any> = await this.db.live.changes(
      `SELECT * FROM _config where name = $1`,
      [ConfigName.STREAMID_TIKTOK],
      "name",
      (res: Array<Change<{ name: string; value_data: string }>>) => {
        cb(res[0]);
      }
    );

    return [() => ret.refresh(), () => ret.unsubscribe()];
  }
  getStreamId(): Promise<string> {
    return this.getDataConfig(ConfigName.STREAMID_TIKTOK);
  }
  async deleteStreamID(streamID: any): Promise<void> {
    await db.query(`DELETE FROM _config where name = $1 and value_data = $2`, [
      ConfigName.STREAMID_TIKTOK,
      streamID,
    ]);
  }
  async saveStreamID(streamId: string): Promise<void> {
    await this.insertDataConfig(ConfigName.STREAMID_TIKTOK, streamId);
  }
  getStreamLabKey(): Promise<string> {
    return this.getDataConfig(ConfigName.TOKEN_STREAMLABS);
  }
  async saveStreamLabKey(token: string): Promise<void> {
    await this.insertDataConfig(ConfigName.TOKEN_STREAMLABS, token);
  }
  private insertDataConfig(config_name: string, token: string) {
    return db.query(
      `INSERT INTO _config (name, value_data) VALUES ($1, $2) ON CONFLICT (name)
DO UPDATE SET value_data = EXCLUDED.value_data;`,
      [config_name, token]
    );
  }

  async getCachePath(): Promise<string | undefined> {
    return await this.getDataConfig("cache_path");
  }
  private async getDataConfig(key: string) {
    const res = await db.query<{ value_data: string }>(
      `select value_data from _config where name = $1`,
      [key]
    );
    return res.rows[0]?.value_data;
  }

  async setCachePath(cachePath: string): Promise<void> {
    await db.query(
      `INSERT INTO _config (name, value_data) VALUES ('cache_path', $1) ON CONFLICT (name)
DO UPDATE SET value_data = EXCLUDED.value_data;`,
      [cachePath]
    );
  }
}
const repo: ConfigRepoInterface = new DataRepository(db as any);
export default repo;

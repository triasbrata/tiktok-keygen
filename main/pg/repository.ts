import { ConfigRepoInterface } from "@main/config/interface";
import { db } from "./connection";
import { PGlite } from "@electric-sql/pglite";

class DataRepository implements ConfigRepoInterface {
  /**
   *
   */
  constructor(private readonly db: PGlite) {}
  saveToken(token: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async getCachePath(): Promise<string | undefined> {
    const res = await db.query<{ value_data: string }>(
      `select value_data from _config where name = 'cache_path'`
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
const repo: ConfigRepoInterface = new DataRepository(db);
export default repo;

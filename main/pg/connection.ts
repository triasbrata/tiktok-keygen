import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { appDataFolder } from "@main/utils/path";
import { app } from "electron";
import { existsSync, mkdirSync, readFileSync } from "fs";
import path, { dirname, join } from "path";

const pathDb = join(appDataFolder, "db");
const dirName = path.dirname(pathDb);
if (!existsSync(dirName)) {
  mkdirSync(dirName);
}
export const db = new PGlite(pathDb, {
  extensions: { live },
});

export async function createTable(db: PGlite) {
  const sqlContentRaw = readFileSync("./resources/table.sql");
  const sqlText = sqlContentRaw.toString("utf-8");
  const res = await db.exec(sqlText);
}

import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { app } from "electron";
import { readFileSync } from "fs";
import { join } from "path";

export const db = new PGlite(join(app.getPath("appData"), "db"), {
  extensions: { live },
});

export async function createTable(db: PGlite) {
  const sqlContentRaw = readFileSync("./resources/table.sql");
  const sqlText = sqlContentRaw.toString("utf-8");
  const res = await db.exec(sqlText);
}

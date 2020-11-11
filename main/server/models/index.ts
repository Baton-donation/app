import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import envPaths from "env-paths";
import path from "path";
import del from "del";
import { Settings } from "./entity/Settings";
import { Sentence } from "./entity/Sentence";
import { Initial1604872621134 } from "./migration/initial";
import { AddSettingsSelectColumn1605132328043 } from "./migration/add-settings-select-column";

const DB_PATH = path.join(envPaths("baton").data, "db.sqlite");

export const getDBConnection = async (): Promise<Connection> => {
  console.log(`Storing database at: ${DB_PATH}`);

  return await createConnection({
    type: "sqlite",
    database: DB_PATH,
    entities: [Settings, Sentence],
    migrations: [Initial1604872621134, AddSettingsSelectColumn1605132328043],
    migrationsRun: true,
  });
};

export const deleteDB = async () => {
  await del(DB_PATH, { force: true });
};

export { Settings, Sentence };

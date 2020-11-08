import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import envPaths from "env-paths";
import path from "path";
import del from "del";
import { Settings } from "./entity/Settings";
import { Sentence } from "./entity/Sentence";

const DB_PATH = path.join(envPaths("baton").data, "db.sqlite");

export const getDBConnection = async (): Promise<Connection> => {
  console.log(`Storing database at: ${DB_PATH}`);

  return await createConnection({
    type: "sqlite",
    database: DB_PATH,
    entities: [Settings, Sentence],
    synchronize: true,
  });
};

export const deleteDB = async () => {
  await del(DB_PATH, { force: true });
};

export { Settings, Sentence };

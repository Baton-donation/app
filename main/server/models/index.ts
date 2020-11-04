import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import envPaths from "env-paths";
import path from "path";
import { Settings } from "./entity/Settings";
import { Sentence } from "./entity/Sentence";

let connection: Connection;

export const getDBConnection = async (): Promise<Connection> => {
  if (connection) {
    return connection;
  }

  const paths = envPaths("baton");

  const dbPath = path.join(paths.data, "db.sqlite");

  console.log(`Storing database at: ${dbPath}`);

  connection = await createConnection({
    type: "sqlite",
    database: dbPath,
    entities: [Settings, Sentence],
    synchronize: true,
  });

  return connection;
};

export { Settings, Sentence };

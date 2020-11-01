import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import envPaths from "env-paths";
import path from "path";
import { Settings } from "./entity/Settings";

let connection: Connection;

export const getDBConnection = async (): Promise<Connection> => {
  if (connection) {
    return connection;
  }

  const paths = envPaths("baton");

  connection = await createConnection({
    type: "sqlite",
    database: path.join(paths.data, "db.sqlite"),
    entities: [Settings],
    synchronize: true,
  });

  return connection;
};

export { Settings } from "./entity/Settings";

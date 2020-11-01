import { ipcMain } from "electron";
import { getDBConnection, Settings } from "./models";

export const registerIPCHandlers = async (): Promise<void> => {
  const connection = await getDBConnection();

  const getSettings = () => connection.manager.findOne(Settings);

  ipcMain.handle("is-first-open", async () => {
    const settings = await getSettings();

    return settings === undefined;
  });
};

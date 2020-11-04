import { ipcMain } from "electron";
import { v4 as uuidv4 } from "uuid";
import { getDBConnection, Settings, Sentence } from "./models";
import apps from "./apps";
import { getSentences } from "./lib/nlp";

const getInstalledApps = async () => {
  const installedApps = [];

  if (await apps.dasher.doesExist()) {
    installedApps.push(apps.dasher);
  }

  return installedApps;
};

export const registerIPCHandlers = async (): Promise<void> => {
  const connection = await getDBConnection();

  ipcMain.handle("is-first-open", async () => {
    const settings = await connection.manager.findOne(Settings);

    return settings === undefined;
  });

  ipcMain.handle(
    "create-settings",
    async (_, { includeId }: { includeId: boolean }) => {
      const settingsRepo = connection.manager.getRepository(Settings);

      const settings = settingsRepo.create({
        id: 0,
        includeUUID: includeId,
        uuid: uuidv4(),
      });

      await settingsRepo.save(settings);
    }
  );

  ipcMain.handle("get-installed-apps", async () => {
    return (await getInstalledApps()).map((app) => app.getName());
  });

  ipcMain.handle("import-from-installed-apps", async () => {
    const installedApps = await getInstalledApps();

    await Promise.all(
      installedApps.map(async (app) => {
        const text = await app.getText();

        const sentences = getSentences(text);

        await connection
          .createQueryBuilder()
          .insert()
          .into(Sentence)
          .values(
            sentences.map((s) => ({
              uuid: uuidv4(),
              createdAt: new Date().getTime(),
              submitted: false,
              viewed: false,
              content: s,
            }))
          )
          .execute();
      })
    );
  });
};

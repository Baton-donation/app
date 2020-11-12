import { ipcMain } from "electron";
import { v4 as uuidv4, v5 as uuidv5 } from "uuid";
import chunk from "chunk";
import { getDBConnection, deleteDB, Settings, Sentence, App } from "./models";
import apps, { appFactory } from "./apps";
import { getSentences } from "./lib/nlp";
import { AppName } from "./apps/types";
import { Connection } from "typeorm";

const UUID_NAMESPACE = "2b677848-e909-434b-9db8-f5a0b8113618";

const getInstalledApps = async () => {
  const installedApps = [];

  if (await apps.dasher.doesExist()) {
    installedApps.push(apps.dasher);
  }

  return installedApps;
};

const refreshDataFromAllApps = async (
  connection: Connection,
  { force = false, firstTime = false } = {}
) => {
  const appRepo = connection.manager.getRepository(App);
  const sentencesRepo = connection.manager.getRepository(Sentence);

  const installedApps = await appRepo.find();

  await Promise.all(
    installedApps.map(async (appModel) => {
      const thisApp = appFactory({
        name: appModel.name as AppName,
        path: appModel.path,
      });

      const currentHash = await thisApp.getHash();

      if (currentHash !== appModel.hash || force) {
        // Update
        const text = await thisApp.getText();

        if (firstTime) {
          const sentencesInChunks = chunk(getSentences(text), 50);

          // Can't use Promise.all, since insert order (therefore createdAt date) would be non-deterministic
          for (const chunk of sentencesInChunks) {
            await connection
              .createQueryBuilder()
              .insert()
              .into(Sentence)
              .values(
                chunk.map((s) => ({
                  uuid: uuidv5(s, UUID_NAMESPACE),
                  createdAt: new Date(),
                  submitted: false,
                  viewed: false,
                  content: s,
                }))
              )
              .orIgnore()
              .execute();
          }
        } else {
          // It's assumed that there's not going to be much new data when updating
          const sentences = getSentences(text).reverse();

          let seenDuplicateSentences = 0;

          for (const sentence of sentences) {
            if (seenDuplicateSentences > 5) {
              // Probably past the new data
              break;
            }

            const uuid = uuidv5(sentence, UUID_NAMESPACE);

            const existingSentence = await sentencesRepo.findOne({
              where: { uuid },
            });

            if (existingSentence) {
              seenDuplicateSentences++;
              continue;
            } else {
              const s = sentencesRepo.create({
                uuid,
                createdAt: new Date(),
                submitted: false,
                viewed: false,
                content: sentence,
              });

              await sentencesRepo.save(s);
            }
          }
        }
      }
    })
  );
};

export const registerIPCHandlers = async (): Promise<void> => {
  const connection = await getDBConnection();

  const sentencesRepo = connection.manager.getRepository(Sentence);
  const settingsRepo = connection.manager.getRepository(Settings);
  const appRepo = connection.manager.getRepository(App);

  ipcMain.handle("is-first-open", async () => {
    const settings = await connection.manager.findOne(Settings);

    return settings === undefined;
  });

  ipcMain.handle(
    "create-settings",
    async (_, { includeId }: { includeId: boolean }) => {
      const settings = settingsRepo.create({
        id: 0,
        includeUUID: includeId,
        uuid: uuidv4(),
        sentencesPerPage: 5,
      });

      await settingsRepo.save(settings);
    }
  );

  ipcMain.handle("get-settings", async () => {
    return connection.manager.findOne(Settings);
  });

  ipcMain.handle("get-installed-apps", async () => {
    return (await getInstalledApps()).map((app) => app.getName());
  });

  ipcMain.handle("import-from-installed-apps", async () => {
    const installedApps = await getInstalledApps();

    await Promise.all(
      installedApps.map(async (app) => {
        const newApp = appRepo.create({
          name: app.getName(),
          path: await app.getPath(),
          hash: await app.getHash(),
          updatedAt: new Date(),
        });

        await appRepo.save(newApp);
      })
    );

    await refreshDataFromAllApps(connection, { force: true, firstTime: true });
  });

  ipcMain.handle("get-sentence-batch", async (_, size: number) => {
    const sentences = await sentencesRepo.find({
      where: {
        submitted: false,
        viewed: false,
      },
      order: {
        createdAt: "DESC",
      },
      take: size,
    });

    return sentences;
  });

  ipcMain.handle(
    "get-submitted-sentences",
    async (_, { offset, limit }: { offset: number; limit: number }) => {
      return sentencesRepo.find({
        where: {
          submitted: true,
        },
        order: {
          createdAt: "DESC",
        },
        take: limit,
        skip: offset,
      });
    }
  );

  ipcMain.handle(
    "submit-sentences-by-uuids",
    async (_, { uuids }: { uuids: string[] }) => {
      await connection
        .createQueryBuilder()
        .update(Sentence)
        .where("sentence.uuid IN (:...uuids)", { uuids })
        .set({ submitted: true })
        .execute();
    }
  );

  ipcMain.handle(
    "mark-sentences-as-viewed-by-uuids",
    async (_, { uuids }: { uuids: string[] }) => {
      await connection
        .createQueryBuilder()
        .update(Sentence)
        .where("sentence.uuid IN (:...uuids)", { uuids })
        .set({ viewed: true })
        .execute();
    }
  );

  ipcMain.handle("get-stats", async () => {
    const [
      totalSentences,
      submittedSentences,
      unviewedSentences,
    ] = await Promise.all([
      sentencesRepo.count(),
      sentencesRepo.count({
        where: { submitted: true },
      }),
      sentencesRepo.count({
        where: { viewed: false },
      }),
    ]);

    return { totalSentences, submittedSentences, unviewedSentences };
  });

  ipcMain.handle(
    "delete-submitted-sentence",
    async (_, { uuid }: { uuid: string }) => {
      await sentencesRepo.update(uuid, { submitted: false });
    }
  );

  ipcMain.handle("delete-all-local-data", async () => {
    await connection.close();

    await deleteDB();

    // Refresh connection
    await connection.connect();
  });

  ipcMain.handle("put-settings", async (_, newSettings: Partial<Sentence>) => {
    const settings = await settingsRepo.findOne();

    if (!settings) {
      throw new Error("No existing settings found");
    }

    await settingsRepo.update(settings.id, newSettings);
  });

  ipcMain.handle("refresh-data", async () => {
    await refreshDataFromAllApps(connection);
  });
};

import { ipcMain } from "electron";
import { v4 as uuidv4 } from "uuid";
import chunk from "chunk";
import { getDBConnection, deleteDB, Settings, Sentence } from "./models";
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

  const sentencesRepo = connection.manager.getRepository(Sentence);
  const settingsRepo = connection.manager.getRepository(Settings);

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
        const text = await app.getText();

        const sentencesInChunks = chunk(getSentences(text), 100);

        await Promise.all(
          sentencesInChunks.map((chunk) =>
            connection
              .createQueryBuilder()
              .insert()
              .into(Sentence)
              .values(
                chunk.map((s) => ({
                  uuid: uuidv4(),
                  createdAt: new Date(),
                  submitted: false,
                  viewed: false,
                  content: s,
                }))
              )
              .execute()
          )
        );
      })
    );
  });

  ipcMain.handle("get-sentence-batch", async () => {
    const sentences = await sentencesRepo.find({
      where: {
        submitted: false,
        viewed: false,
      },
      order: {
        createdAt: "DESC",
      },
      take: 5,
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
};

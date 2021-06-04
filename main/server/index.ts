import { ipcMain } from "electron";
import { v4 as uuidv4 } from "uuid";
import chunk from "chunk";
import { getDBConnection, deleteDB, Settings, Sentence, App } from "./models";
import apps, { appFactory } from "./apps";
import { getSentences } from "./lib/nlp";
import { EPossibleSources } from "./apps/types";
import { Connection, In } from "typeorm";
import sodium from "libsodium-wrappers";
import APIClient, { ISentenceDto } from "./lib/api";

let SERVER_PUBLIC_KEY: Uint8Array;

const getInstalledApps = async () => {
  const installedApps = [];

  if (await apps.dasher.doesExist()) {
    installedApps.push(apps.dasher);
  }

  if (await apps.grid.doesExist()) {
    installedApps.push(apps.grid);
  }

  return installedApps;
};

const refreshDataFromAllApps = async (
  connection: Connection,
  {
    force = false,
    firstTime = false,
    appFilter = [],
  }: { force?: boolean; firstTime?: boolean; appFilter?: number[] } = {}
) => {
  const appRepo = connection.manager.getRepository(App);
  const sentencesRepo = connection.manager.getRepository(Sentence);

  const installedApps = await appRepo.find();

  await Promise.all(
    installedApps
      .filter((a) => (appFilter.length > 0 ? appFilter.includes(a.id) : true))
      .map(async (appModel) => {
        const thisApp = appFactory(appModel);

        const currentHash = await thisApp.getHash();

        if (currentHash !== appModel.hash || force) {
          // Update
          const text = await thisApp.getText();

          if (firstTime) {
            let sentencesInChunks = chunk(getSentences(text), 50);

            sentencesInChunks = sentencesInChunks.map((chunk) =>
              chunk.filter((s) => s.trim() !== "")
            );

            // Can't use Promise.all, since insert order (therefore createdAt date) would be non-deterministic
            for (const chunk of sentencesInChunks) {
              await connection
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
                .execute();
            }
          } else {
            // It's assumed that there's not going to be much new data when updating
            const sentences = getSentences(text).reverse();

            let seenDuplicateSentences = 0;

            for (const sentence of sentences) {
              // Don't add blank sentences
              if (sentence.trim() === "") {
                continue;
              }

              if (seenDuplicateSentences > 5) {
                // Probably past the new data
                break;
              }

              const existingSentence = await sentencesRepo.findOne({
                where: { content: sentence },
              });

              if (existingSentence) {
                seenDuplicateSentences++;
                continue;
              } else {
                const s = sentencesRepo.create({
                  uuid: uuidv4(),
                  createdAt: new Date(),
                  submitted: false,
                  viewed: false,
                  content: sentence,
                });

                await sentencesRepo.save(s);
              }
            }
          }

          appModel.hash = await thisApp.getHash();
          appModel.updatedAt = new Date();
          await appRepo.save(appModel);
        }
      })
  );
};

export const registerIPCHandlers = async (): Promise<void> => {
  const connection = await getDBConnection();

  const sentencesRepo = connection.manager.getRepository(Sentence);
  const settingsRepo = connection.manager.getRepository(Settings);
  const appRepo = connection.manager.getRepository(App);

  const api = new APIClient();

  // Get server's public key upon load
  api.getPublicKey().then((key) => {
    SERVER_PUBLIC_KEY = Buffer.from(key, "base64");
  });

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
        defaultToAllSelected: false,
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
      const settings = await connection.manager.findOne(Settings);

      if (!settings) {
        throw new Error("Missing settings");
      }

      if (!SERVER_PUBLIC_KEY) {
        throw new Error("Missing server's public key");
      }

      // Get sentences
      const sentences = await sentencesRepo.find({
        where: {
          uuid: In(uuids),
        },
      });

      await sodium.ready;

      const encryptedSentences: ISentenceDto[] = sentences.map((s) => {
        const content = Buffer.from(
          sodium.crypto_box_seal(s.content, SERVER_PUBLIC_KEY)
        );

        return {
          uuid: s.uuid,
          anonymousUUID: settings.includeUUID ? settings.uuid : null,
          content: content.toString("base64"),
        };
      });

      await api.submitSentences(encryptedSentences);

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
      await api.deleteSentence(uuid);
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

  ipcMain.handle("get-sources", async () => {
    return appRepo.find();
  });

  ipcMain.handle(
    "add-source",
    async (_, { name, path }: { name: EPossibleSources; path: string }) => {
      const app = appFactory({ name, path });

      const newApp = appRepo.create({
        name,
        path: await app.getPath(),
        hash: "",
        updatedAt: new Date(),
      });

      await appRepo.save(newApp);

      await refreshDataFromAllApps(connection, {
        firstTime: true,
        appFilter: [newApp.id],
      });
    }
  );

  ipcMain.handle("delete-source", async (_, id: number) => {
    const app = await appRepo.findOne({ where: { id } });

    if (app) {
      await appRepo.remove(app);
    } else {
      throw new Error(`App with ID ${id} does not exist.`);
    }
  });

  ipcMain.handle("get-possible-new-sources", async () => {
    const possible: EPossibleSources[] = [
      EPossibleSources.PlainText,
      EPossibleSources.NewlineSeparatedPlainText,
    ];

    const apps = await appRepo.find();

    if (!apps.find((a) => a.name === "Dasher")) {
      const dasher = appFactory({ name: EPossibleSources.Dasher, path: "" });
      if (await dasher.doesExist()) {
        possible.push(EPossibleSources.Dasher);
      }
    }

    if (!apps.find((a) => a.name === "Grid")) {
      const grid = appFactory({ name: EPossibleSources.Grid, path: "" });
      if (await grid.doesExist()) {
        possible.push(EPossibleSources.Grid);
      }
    }

    return possible;
  });

  ipcMain.handle("upload-user-details", async (_, stringifiedData: string) => {
    await sodium.ready;

    const encryptedData = Buffer.from(
      sodium.crypto_box_seal(stringifiedData, SERVER_PUBLIC_KEY)
    );
    const settings = await connection.manager.findOne(Settings);

    if (!settings?.uuid) {
      throw new Error("UUID has not been generated");
    }

    await api.putUserDetails({
      uuid: settings.uuid,
      encryptedData: encryptedData.toString("base64"),
    });
  });

  ipcMain.handle("check-unlock-code", async (_, code: string) => {
    await api.checkUnlockCode(code);
  });
};

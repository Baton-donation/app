import { Application } from "spectron";
import electronPath from "electron";
import path from "path";
import fs from "fs";

const deleteFileIfExists = async (path: string) => {
  try {
    await fs.promises.unlink(path);
  } catch {}
};

const DB_PATH = "./test-db.sqlite";

let app: Application;

beforeAll(async () => {
  // Clear database
  await deleteFileIfExists(DB_PATH);

  app = new Application({
    path: (electronPath as unknown) as string,
    args: [path.join(__dirname, "../")],
    env: {
      DB_PATH,
      NODE_ENV: "production",
    },
  });

  await app.start();
}, 15000);

afterAll(async () => {
  if (app && app.isRunning()) {
    const coverage = await app.webContents.executeJavaScript(
      "window.__coverage__;"
    );

    try {
      await fs.promises.mkdir(".nyc_output");
    } catch {}

    await fs.promises.writeFile(
      ".nyc_output/frontend.json",
      JSON.stringify(coverage),
      { flag: "w+" }
    );

    await app.stop();
  }

  await deleteFileIfExists(DB_PATH);
});

test("Displays app window", async () => {
  await app.client.waitUntilWindowLoaded();

  const windowCount = await app.client.getWindowCount();

  expect(windowCount).toBe(1);
});

test("Displays first setup step upon first open", async () => {
  const header = await app.client.$("h2");

  const text = await header.getText();

  expect(text).toBe("Get set up");
});

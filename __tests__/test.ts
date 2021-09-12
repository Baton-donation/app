import { Application } from "spectron";
import electronPath from "electron";
import path from "path";
import fs from "fs";
import * as dasher from "../test-data/lib/dasher";

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

  // Generate Dasher data file
  await dasher.build({ size: "1mb" });

  app = new Application({
    path: electronPath as unknown as string,
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

  expect(text).toBe("Unlock app");
});

/*test("Goes through setup process", async () => {
  let button = await app.client.$("span=Agree and continue");
  await button.click();

  button = await app.client.$("span=Next");
  await button.click();

  button = await app.client.$("span=Maybe later");
  await button.click();

  const header = await app.client.$("h2");

  expect(await header.getText()).toBe("Dashboard");
});*/

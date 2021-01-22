// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import { app } from "electron";
import serve from "electron-serve";
import { createServer } from "http";
import { createWindow } from "./helpers";
import { registerIPCHandlers } from "./server";

const isProd = app.isPackaged || process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  if (!isProd) {
    // Start Next.js in watch mode
    // Next isn't in prod bundle, so require here
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const next = require("next");
    const nextServer = next({ dev: true, dir: "renderer" });

    await nextServer.prepare();

    await new Promise<void>((resolve) => {
      createServer(nextServer.getRequestHandler()).listen(3000, () => {
        resolve();
      });
    });
  }

  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      enableRemoteModule: true,
    },
  });

  if (isProd) {
    await mainWindow.loadURL("app://./index.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/`);
    mainWindow.webContents.openDevTools();
  }

  registerIPCHandlers();
})();

app.on("window-all-closed", () => {
  app.quit();
});

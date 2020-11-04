import electron from "electron";

// Prevent SSR webpacking
const ipcRenderer = electron.ipcRenderer || false;

export const isFirstOpen = async (): Promise<boolean> => {
  return ipcRenderer.invoke("is-first-open");
};

export const createSettings = async ({ includeId }: { includeId: boolean }) => {
  return ipcRenderer.invoke("create-settings", { includeId });
};

export const getInstalledApps = async (): Promise<string[]> => {
  return ipcRenderer.invoke("get-installed-apps");
};

export const importFromInstalledApps = async () => {
  return ipcRenderer.invoke("import-from-installed-apps");
};

import electron from "electron";

// Prevent SSR webpacking
const ipcRenderer = electron.ipcRenderer || false;

export const isFirstOpen = async (): Promise<boolean> => {
  return ipcRenderer.invoke("is-first-open");
};

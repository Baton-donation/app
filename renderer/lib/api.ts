import electron from "electron";
import { EPossibleSources, ISentence, IStats, ISettings, IApp } from "./types";

// Prevent SSR webpacking
const ipcRenderer = electron.ipcRenderer || false;

export const isFirstOpen = async (): Promise<boolean> => {
  return ipcRenderer.invoke("is-first-open");
};

export const createSettings = async ({ includeId }: { includeId: boolean }) => {
  return ipcRenderer.invoke("create-settings", { includeId });
};

export const getSettings = async (): Promise<ISettings> => {
  return ipcRenderer.invoke("get-settings");
};

export const getInstalledApps = async (): Promise<string[]> => {
  return ipcRenderer.invoke("get-installed-apps");
};

export const importFromInstalledApps = async () => {
  return ipcRenderer.invoke("import-from-installed-apps");
};

export const getSentenceBatch = async (size: number): Promise<ISentence[]> => {
  return ipcRenderer.invoke("get-sentence-batch", size);
};

export const submitSentencesByUUIDs = async (uuids: string[]) => {
  return ipcRenderer.invoke("submit-sentences-by-uuids", { uuids });
};

export const markSentencesAsViewedByUUIDs = async (uuids: string[]) => {
  return ipcRenderer.invoke("mark-sentences-as-viewed-by-uuids", { uuids });
};

export const getSubmittedSentences = async ({
  offset,
  limit,
}: {
  offset: number;
  limit: number;
}): Promise<ISentence[]> => {
  return ipcRenderer.invoke("get-submitted-sentences", { offset, limit });
};

export const deleteSubmittedSentence = async (uuid: string) => {
  return ipcRenderer.invoke("delete-submitted-sentence", { uuid });
};

export const getStats = async (): Promise<IStats> => {
  return ipcRenderer.invoke("get-stats");
};

export const deleteAllLocalData = async () => {
  return ipcRenderer.invoke("delete-all-local-data");
};

export const putSettings = async (newSettings: Partial<ISettings>) => {
  return ipcRenderer.invoke("put-settings", newSettings);
};

export const refreshData = async () => {
  return ipcRenderer.invoke("refresh-data");
};

export const getSources = async (): Promise<IApp[]> => {
  return ipcRenderer.invoke("get-sources");
};

export const addSource = async ({
  name,
  path,
}: {
  name: string;
  path: string;
}) => {
  return ipcRenderer.invoke("add-source", { name, path });
};

export const deleteSource = async (id: number) => {
  return ipcRenderer.invoke("delete-source", id);
};

export const getPossibleNewSources = async (): Promise<[EPossibleSources]> => {
  return ipcRenderer.invoke("get-possible-new-sources");
};

export const uploadUserDetails = async (
  data: Record<string, unknown>
): Promise<void> => {
  ipcRenderer.invoke("upload-user-details", JSON.stringify(data));
};

export const checkUnlockCode = async (code: string) => {
  return ipcRenderer.invoke("check-unlock-code", code);
};

export type { ISentence, IStats, ISettings };

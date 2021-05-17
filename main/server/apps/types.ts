export type AppName = "Dasher" | "Grid" | "Plain Text";

export abstract class AAppDataGetters {
  abstract doesExist(): Promise<boolean>;
  abstract getHash(): Promise<string>;
  abstract getText(): Promise<string>;
  abstract getName(): AppName;
  abstract getPath(): Promise<string>;
}

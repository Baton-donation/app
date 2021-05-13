import fs from "fs";
import sqlite3 from "sqlite3";
import path from "path";
import { getHashFromFile } from "../lib/hash";
import { AAppDataGetters, AppName } from "./types";

interface DatabaseRow {
  Text: string;
}

class Grid extends AAppDataGetters {
  private name: AppName = "Grid";
  private staticLocations: string[];
  private gridRootDirectories: string[];
  private validLocations?: string[];

  constructor({
    name,
    staticLocations,
    gridRootDirectories,
  }: {
    name?: AppName;
    staticLocations: string[];
    gridRootDirectories: string[];
  }) {
    super();

    if (name) {
      this.name = name;
    }

    this.staticLocations = staticLocations;
    this.gridRootDirectories = gridRootDirectories;
  }

  private async addValidStaticLocations(): Promise<string[]> {
    const validStaticLocations = [];

    for await (const location of this.staticLocations) {
      try {
        await fs.promises.access(location);

        validStaticLocations.push(location);
      } catch {}
    }

    return validStaticLocations;
  }

  /**
   * Goes through the potential grid roots and looks for sqlite files.
   * Each Grid 3 root can have any number of users, we return all the users that we find
   *
   * A Grid 3 folder has this structure:
   * /Grid 3
   *  /Users
   *    /first
   *      /en-GB
   *        /Phrases
   *          history.sqlite
   *    /second
   *      /en-GB
   *        /Phrases
   *          history.sqlite
   */
  private async addValidDynamicLocations(): Promise<string[]> {
    const validDynamicLocations: string[] = [];

    for await (const currentRoot of this.gridRootDirectories) {
      try {
        const userDirectory = path.join(currentRoot, "./Users");

        await fs.promises.access(userDirectory);

        const allFilesInUserDir = await fs.promises.readdir(userDirectory, {
          withFileTypes: true,
        });
        const users = allFilesInUserDir.filter((source) =>
          source.isDirectory()
        );

        for await (const currentUser of users) {
          const userHistory = path.join(
            userDirectory,
            currentUser.name,
            "./en-GB/Phrases/history.sqlite"
          );

          await fs.promises.access(userHistory);

          validDynamicLocations.push(userHistory);
        }
      } catch {}
    }

    return validDynamicLocations;
  }

  private async getLocations(): Promise<string[]> {
    if (this.validLocations) {
      return this.validLocations;
    }

    const validDynamicLocations = await this.addValidDynamicLocations();
    const validStaticLocations = await this.addValidStaticLocations();

    this.validLocations = [...validDynamicLocations, ...validStaticLocations];

    return this.validLocations;
  }

  async doesExist() {
    try {
      const locations = await this.getLocations();
      return locations.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * We get the raw contents of all the files and hash them.
   *
   * We combine the hashes so that if any file changes we
   * re-fetch the text
   */
  async getHash() {
    const locations = await this.getLocations();
    const hashes = await Promise.all(
      locations.map(async (location) => await getHashFromFile(location))
    );
    const allHashes = hashes.join("");

    return allHashes;
  }

  async getText() {
    const locations = await this.getLocations();

    const phrases = await Promise.all(
      locations.map(async (location) => await this.getTextForLocation(location))
    );

    const rawPhrases = phrases.flat().join("\n");

    return rawPhrases;
  }

  /**
   * Queries the sqlite database given.
   *
   * Selects all the phrases in the PhraseHistory table.
   *
   * Only takes phrases with a real timestamp. For some reason
   * every phrase exists in history once without a timestamp even
   * when its never been said
   */
  private async getTextForLocation(location: string): Promise<string[]> {
    const database = new sqlite3.Database(location);

    const databaseResult = (await new Promise((resolve, reject) => {
      database.all(
        `
        SELECT Text
        FROM PhraseHistory ph
        INNER JOIN Phrases p ON p.Id = ph.PhraseId 
        WHERE "Timestamp" <> 0
      `,
        (err, result) => {
          if (err) return reject(err);

          resolve(result);
        }
      );
    })) as Array<DatabaseRow>;

    database.close();

    const phrases = databaseResult.map((result) => result.Text);

    return phrases;
  }

  getName() {
    return this.name;
  }

  /**
   * Join all the paths together as there is multiple paths
   */
  async getPath() {
    const locations = await this.getLocations();
    return locations.join(";");
  }
}

export default Grid;

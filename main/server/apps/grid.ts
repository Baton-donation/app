import fs from "fs";
import sqlite3 from "sqlite3";
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

  private async addValidDynamicLocations(): Promise<string[]> {
    const validLocations: string[] = [];

    // TODO

    return validLocations;
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

  async getPath() {
    const locations = await this.getLocations();
    return locations.join(";");
  }
}

export default Grid;

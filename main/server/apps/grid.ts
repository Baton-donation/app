import fs from "fs";
import sqlite3 from "sqlite3";
import { getHashFromFile } from "../lib/hash";
import { AAppDataGetters, AppName } from "./types";

interface DatabaseRow {
  Text: string;
}

class Grid extends AAppDataGetters {
  private name: AppName = "Grid";
  private cachedLocation?: string;
  private locations: string[];

  constructor({ name, locations }: { name?: AppName; locations: string[] }) {
    super();

    if (name) {
      this.name = name;
    }

    this.locations = locations;
  }

  private async getLocation(): Promise<string> {
    if (this.cachedLocation) {
      return this.cachedLocation;
    }

    for await (const location of this.locations) {
      try {
        await fs.promises.access(location);

        this.cachedLocation = location;

        return location;
      } catch {}
    }

    throw new Error("No location was valid.");
  }

  async doesExist() {
    try {
      await this.getLocation();
      return true;
    } catch {
      return false;
    }
  }

  async getHash() {
    return await getHashFromFile(await this.getLocation());
  }

  async getText() {
    const location = await this.getLocation();
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
    const rawPhrases = phrases.join("\n");

    return rawPhrases;
  }

  getName() {
    return this.name;
  }

  async getPath() {
    return this.getLocation();
  }
}

export default Grid;

import fs from "fs";
import { getHashFromFile } from "../lib/hash";
import { AAppDataGetters, EPossibleSources } from "./types";

class PlainText extends AAppDataGetters {
  private name: EPossibleSources = EPossibleSources.PlainText;
  private cachedLocation?: string;
  private locations: string[];
  private processFileFunc: (buff: Buffer) => string;

  constructor({
    name,
    locations,
    processFile = (t) => t.toString(),
  }: {
    name?: EPossibleSources;
    locations: string[];
    processFile?: (buff: Buffer) => string;
  }) {
    super();

    if (name) {
      this.name = name;
    }

    this.locations = locations;
    this.processFileFunc = processFile;
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
    return getHashFromFile(await this.getLocation());
  }

  async getText() {
    const contents = await fs.promises.readFile(await this.getLocation());

    return this.processFileFunc(contents);
  }

  getName() {
    return this.name;
  }

  async getPath() {
    return this.getLocation();
  }
}

export default PlainText;

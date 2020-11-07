import fs from "fs";
import hasha from "hasha";
import { AAppDataGetters } from "./types";

class PlainText extends AAppDataGetters {
  private name: string;
  private cachedLocation?: string;
  private locations: string[];
  private processFileFunc: (buff: Buffer) => string;

  constructor({
    name,
    locations,
    processFile = (t) => t.toString(),
  }: {
    name: string;
    locations: string[];
    processFile?: (buff: Buffer) => string;
  }) {
    super();

    this.name = name;
    this.locations = locations;
    this.processFileFunc = processFile;
  }

  private async getLocation(): Promise<string> {
    if (this.cachedLocation) {
      return this.cachedLocation
    }

    for await (let location of this.locations) {
      try {
        await fs.promises.access(location)

        this.cachedLocation = location;

        return location;
      } catch {}
    }

    throw new Error("No location was valid.");
  }

  async doesExist() {
    try {
      await this.getLocation()
      return true;
    } catch {
      return false;
    }
  }

  async getHash() {
    return hasha.fromFile(await this.getLocation());
  }

  async getText() {
    const contents = await fs.promises.readFile(await this.getLocation());

    return this.processFileFunc(contents);
  }

  getName() {
    return this.name;
  }
}

export default PlainText;

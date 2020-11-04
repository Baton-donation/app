import fs from "fs";
import hasha from "hasha";
import { AAppDataGetters } from "./types";

class PlainText extends AAppDataGetters {
  private name: string;
  private location: string;
  private processFileFunc: (buff: Buffer) => string;

  constructor({
    name,
    location,
    processFile = (t) => t.toString(),
  }: {
    name: string;
    location: string;
    processFile?: (buff: Buffer) => string;
  }) {
    super();

    this.name = name;
    this.location = location;
    this.processFileFunc = processFile;
  }

  async doesExist() {
    try {
      await fs.promises.access(this.location);

      return true;
    } catch {
      return false;
    }
  }

  async getHash() {
    if (!(await this.doesExist())) {
      throw new Error("File doesn't exist");
    }

    return hasha.fromFile(this.location);
  }

  async getText() {
    if (!(await this.doesExist())) {
      throw new Error("File doesn't exist");
    }

    const contents = await fs.promises.readFile(this.location);

    return this.processFileFunc(contents);
  }

  getName() {
    return this.name;
  }
}

export default PlainText;

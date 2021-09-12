import fs from "fs";
import { addEndMarkerToPhrase } from "../lib/add-end-marker-to-phrase";
import { getHashFromFile } from "../lib/hash";
import { AAppDataGetters, EPossibleSources } from "./types";

class Communicator extends AAppDataGetters {
  private name = EPossibleSources.Communicator;
  private location: string;

  constructor({ location }: { location: string }) {
    super();

    this.location = location;
  }

  async doesExist() {
    return false;
  }

  async getHash() {
    return getHashFromFile(await this.getPath());
  }

  async getText() {
    const contents = await fs.promises.readFile(await this.getPath());

    // Skip some header fields
    let fileOffsetBytes = 8;

    const numOfEntries = contents.readUInt32LE(fileOffsetBytes);
    fileOffsetBytes += 4;

    const phrases = [];

    for (let i = 0; i < numOfEntries; i++) {
      // Unknown field
      fileOffsetBytes += 3;

      const stringLength = contents.readUInt8(fileOffsetBytes);
      fileOffsetBytes += 1;

      const str = contents.toString(
        "utf16le",
        fileOffsetBytes,
        fileOffsetBytes + stringLength * 2
      );
      fileOffsetBytes += stringLength * 2;

      phrases.push(str);

      // Unknown field
      fileOffsetBytes += 4;
    }

    return phrases.map((phrase) => addEndMarkerToPhrase(phrase)).join("\n");
  }

  getName() {
    return this.name;
  }

  async getPath() {
    return this.location;
  }
}

export default Communicator;

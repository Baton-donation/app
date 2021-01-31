import stream from "stream";
import fs from "fs";
import byteParser from "byte-parser";
import Trunc from "truncating-stream";
import makeDir from "make-dir";
import path from "path";
import { INPUT_DATA_PATH, DASHER_OUTPUT_PATH } from "./constants";

const transform = new stream.Transform({
  writableObjectMode: true,
  transform(chunk, encoding, callback) {
    this.push(
      Buffer.concat([
        Buffer.from("C2A72323", "hex"),
        Buffer.from(chunk.toString().split("\n").join("")),
      ])
    );

    callback();
  },
});

export const build = async ({ size }: { size: string }) => {
  const trunc = new Trunc({ limit: byteParser(size) });

  await makeDir(path.join(__dirname, "../apps"));

  return new Promise<void>((resolve) => {
    fs.createReadStream(INPUT_DATA_PATH)
      .pipe(trunc)
      .pipe(transform)
      .pipe(fs.createWriteStream(DASHER_OUTPUT_PATH))
      .on("close", () => resolve());
  });
};

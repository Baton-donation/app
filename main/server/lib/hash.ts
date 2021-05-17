import fs from "fs";
import crypto from "crypto";

const HASH_TYPE = "sha256";

export const getHashFromFile = (path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(HASH_TYPE);
    const stream = fs.createReadStream(path);
    stream.on("error", (err) => reject(err));
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
};

export const hashString = (input: string): string => {
  return crypto.createHash(HASH_TYPE).update(input).digest("hex");
};

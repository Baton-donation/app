import bufferReplace from "buffer-replace";
import path from "path";
import PlainText from "./plain-text";
import { AAppDataGetters, AppName } from "./types";

const DASHER_PATHS = [path.join(__dirname, "../test-data/apps/dasher.txt")];

if (process.env.APPDATA) {
  DASHER_PATHS.push(
    path.join(process.env.APPDATA, "dasher.rc/training_english_GB.txt")
  );
}

const dasher = new PlainText({
  name: "Dasher",
  locations: DASHER_PATHS,
  processFile: (buff) => {
    const cleanedBuffer: Buffer = bufferReplace(
      buff,
      Buffer.from("C2A72323", "hex"),
      "\n"
    );

    return cleanedBuffer.toString();
  },
});

export const appFactory = ({
  name,
  path,
}: {
  name: AppName;
  path: string;
}): AAppDataGetters => {
  switch (name) {
    case "Dasher":
      return dasher;
    case "Plain Text":
      return new PlainText({ locations: [path] });
  }
};

export default { dasher };

import bufferReplace from "buffer-replace";
import path from "path";
import PlainText from "./plain-text";
import Grid from "./grid";
import { AAppDataGetters, AppName } from "./types";

const DASHER_PATHS = [
  path.join(__dirname, "../../../test-data/apps/dasher.txt"),
];
const GRID_PATHS = [path.join(__dirname, "../../../test-data/grid.sqlite")];

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

const grid = new Grid({
  name: "Grid",
  locations: GRID_PATHS,
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
    case "Grid":
      return grid;
    case "Plain Text":
      return new PlainText({ locations: [path] });
  }
};

export default { dasher, grid };

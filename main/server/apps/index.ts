import bufferReplace from "buffer-replace";
import path from "path";
import { app } from "electron";
import PlainText from "./plain-text";
import Grid from "./grid";
import { AAppDataGetters, AppName } from "./types";

const DASHER_PATHS = [
  path.join(__dirname, "../../../test-data/apps/dasher.txt"),
];

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

const GRID_PATHS = [path.join(__dirname, "../../../test-data/grid.sqlite")];
const GRID_ROOTS: Array<string> = [
  path.join(__dirname, "../../../test-data/Grid 3"),
  path.join(app.getPath("home"), "../Public/Documents/Smartbox/Grid 3"),
  path.join(app.getPath("home"), "./Documents/Smartbox/Grid 3"),
];

const grid = new Grid({
  name: "Grid",
  staticLocations: GRID_PATHS,
  gridRootDirectories: GRID_ROOTS,
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

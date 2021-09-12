import bufferReplace from "buffer-replace";
import path from "path";
import { app } from "electron";
import PlainText from "./plain-text";
import Grid from "./grid";
import Communicator from "./communicator";
import { AAppDataGetters, EPossibleSources } from "./types";
import { addEndMarkerToPhrase } from "../lib/add-end-marker-to-phrase";

const DASHER_PATHS = [
  path.join(__dirname, "../../../test-data/apps/dasher.txt"),
];

if (process.env.APPDATA) {
  DASHER_PATHS.push(
    path.join(process.env.APPDATA, "dasher.rc/training_english_GB.txt")
  );
}

const dasher = new PlainText({
  name: EPossibleSources.Dasher,
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
  name: EPossibleSources.Grid,
  staticLocations: GRID_PATHS,
  gridRootDirectories: GRID_ROOTS,
});

export const appFactory = ({
  name,
  path,
}: {
  name: string;
  path: string;
}): AAppDataGetters => {
  switch (name) {
    case EPossibleSources.Dasher:
      return dasher;
    case EPossibleSources.Grid:
      return grid;
    case EPossibleSources.PlainText:
      return new PlainText({ locations: [path] });
    case EPossibleSources.NewlineSeparatedPlainText:
      return new PlainText({
        locations: [path],
        processFile: (buff) => {
          return buff
            .toString()
            .split("\n")
            .map((phrase) => addEndMarkerToPhrase(phrase.trim()))
            .join(" ")
            .replace(/\.\./g, ".");
        },
      });
    case EPossibleSources.Communicator:
      return new Communicator({ location: path });
  }

  throw new Error(`${name} not implemented`);
};

export default { dasher, grid };

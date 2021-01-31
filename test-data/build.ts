#!/usr/bin/env node
import yargs from "yargs";
import * as dasher from "./lib/dasher";

yargs(process.argv.slice(3))
  .command(
    "dasher [size]",
    "build a dataset for Dasher",
    (yargs) => {
      yargs.positional("size", {
        describe: "size of file to generate (ex. 5MB)",
        default: "5MB",
      });
    },
    async (argv) => {
      await dasher.build({ size: argv.size as string });
    }
  )
  .command(
    "update",
    "add a single sentence to the Dasher dataset",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {},
    async () => {
      // Readable.from([`This is a new string at ${new Date()}.`])
      //   .pipe(dasher.transform)
      //   .pipe(fs.createWriteStream(DASHER_OUTPUT_PATH, { flags: "a" }));
    }
  )
  .command(
    "pii",
    "generate a static dataset containing personal information for Dasher",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {},
    async () => {
      // fs.createReadStream(PII_INPUT_DATA_PATH)
      //   .pipe(dasherTransform)
      //   .pipe(fs.createWriteStream(DASHER_OUTPUT_PATH));
    }
  )
  .command(
    "clear",
    "delete all locally generated datasets",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {},
    async () => {
      // await fs.promises.rm(DASHER_OUTPUT_PATH);
    }
  ).argv;

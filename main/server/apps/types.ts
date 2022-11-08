export enum EPossibleSources {
  Dasher = "Dasher",
  PlainText = "Plain Text",
  NewlineSeparatedPlainText = "Newline Separated Plain Text",
  Grid = "Grid",
  Communicator = "Tobii Communicator",
  Predictable = "Predictable",
}
export abstract class AAppDataGetters {
  abstract doesExist(): Promise<boolean>;
  abstract getHash(): Promise<string>;
  abstract getText(): Promise<string>;
  abstract getName(): EPossibleSources;
  abstract getPath(): Promise<string>;
}

type PredictableRecordedMessage = {
  FileName: string;
  Transcription: {
    Text: string;
  };
};

export type PredictableHistory = {
  RecordedMessages: Array<PredictableRecordedMessage>;
};

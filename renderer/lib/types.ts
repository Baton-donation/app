// Yes, a lot of this is duplicated.
// See: https://github.com/vercel/next.js/issues/706

export interface ISentence {
  uuid: string;
  createdAt: number;
  submitted: boolean;
  viewed: boolean;
  content: string;
}

export interface IStats {
  totalSentences: number;
  submittedSentences: number;
  unviewedSentences: number;
}

export interface ISettings {
  id: number;
  includeUUID: boolean;
  uuid: string;
  defaultToAllSelected: boolean;
  sentencesPerPage: number;
}

export interface IApp {
  id: number;
  name: string;
  path: string;
  hash: string;
  updatedAt: Date;
}

export enum EPossibleSources {
  Dasher = "Dasher",
  PlainText = "Plain Text",
  NewlineSeparatedPlainText = "Newline Separated Plain Text",
  Grid = "Grid",
}

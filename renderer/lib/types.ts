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

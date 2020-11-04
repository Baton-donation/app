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

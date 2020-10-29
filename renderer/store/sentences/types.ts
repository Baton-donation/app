export const SET_SENTENCES = "SET_SENTENCES";

export interface Sentence {
  id?: number;
  content: string;
  willSubmit: boolean;
  viewed: boolean;
}

export interface SentencesState {
  sentences: Sentence[];
}

interface SetSentences {
  type: typeof SET_SENTENCES;
  sentences: Sentence[];
}

export type SentencesActionTypes = SetSentences;

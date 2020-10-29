import { createSelector } from "reselect";
import { RootState } from "./types";

const sentences = (state: RootState) => state.sentences.sentences;

export const getSentencesByMostRecent = createSelector(sentences, (s) =>
  s.reverse()
);

export const getCurrentBatchOfSentences = createSelector(
  getSentencesByMostRecent,
  (sentences) => sentences.filter((s) => !s.viewed).slice(0, 5)
);

export const getTotalSentences = createSelector(sentences, (s) => s.length);
export const getTotalViewedSentences = createSelector(
  sentences,
  (s) => s.filter((st) => st.viewed).length
);

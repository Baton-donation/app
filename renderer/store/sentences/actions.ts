import { Sentence, SET_SENTENCES } from "./types";
import { AppThunk } from "../types";
import { extractSentences } from "../../lib/nlp";
import { db } from "../db";

export const loadFromDatabase = (): AppThunk<Promise<void>> => async (
  dispatch
) => {
  const s = await db.sentences.orderBy("id").toArray();

  dispatch({ type: SET_SENTENCES, sentences: s });
};

export const importSentencesFromText = (
  text: string
): AppThunk<Promise<void>> => async (dispatch) => {
  const sentences = extractSentences(text);

  const models: Sentence[] = sentences.map((s) => ({
    content: s,
    willSubmit: false,
    viewed: false,
  }));

  await db.sentences.bulkPut(models);

  await dispatch(loadFromDatabase());
};

export const updateSentence = (
  id: number,
  s: Partial<Sentence>
): AppThunk<Promise<void>> => async (dispatch) => {
  await db.sentences.update(id, s);
  await dispatch(loadFromDatabase());
};

export const bulkMarkViewed = (
  ids: number[]
): AppThunk<Promise<void>> => async (dispatch) => {
  await Promise.all(ids.map((id) => db.sentences.update(id, { viewed: true })));
  await dispatch(loadFromDatabase());
};

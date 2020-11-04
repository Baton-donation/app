import winkNLP from "wink-nlp";
import model from "wink-eng-lite-model";

const nlp = winkNLP(model);

export const getSentences = (text: string): string[] => {
  const doc = nlp.readDoc(text);

  return doc
    .sentences()
    .out()
    .map((s: string) => s.trim());
};

import nlp from "compromise";

export const extractSentences = (text: string): string[] => {
  const doc = nlp(text);

  const sentences: string[] = [];

  doc.sentences().forEach((s) => {
    sentences.push(s.text().trim());
  });

  return sentences;
};

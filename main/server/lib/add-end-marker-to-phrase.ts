export const addEndMarkerToPhrase = (phrase: string) => {
  const isPunctuationRegex = new RegExp(
    /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/,
    "g"
  );
  const lastCharacter = phrase[phrase.length - 1];
  const endsInPunctuation = isPunctuationRegex.test(lastCharacter);

  if (endsInPunctuation) {
    return phrase;
  } else {
    return `${phrase}.`;
  }
};

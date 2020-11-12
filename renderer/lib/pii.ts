const REGEXPS = {
  EMAIL: /([a-z0-9_\-.+]+)@\w+(\.\w+)*/,
  PHONE: /(\(?\+?[0-9]{1,2}\)?[-. ]?)?(\(?[0-9]{3}\)?|[0-9]{3})[-. ]?([0-9]{3}[-. ]?[0-9]{4}|\b[A-Z0-9]{7}\b)/,
  PROPERTY_UNIT_NUMBER: /(apt|bldg|dept|fl|hngr|lot |pier|rm|ste|slip|trlr|unit |#)\s*\.?#?\s*[0-9]+[a-z0-9-]*\b/i,
  PROPERTY_STREET_ADDRESS: /\d+(\s+[nsew]\.?)?(\s+\w+){1,}\s+(?:st(?:\.|reet)?|dr(?:\.|ive)?|pl(?:\.|ace)?|ave(?:\.|nue)?|rd|road|lane|boulevard|blvd|loop|way|circle|cir|court|ct|plaza|square|run|parkway|point|pike|square|driveway|trace|park|terrace)(\s|[^a-z]|$)/,
  SSN: /\b\d{3}[ -.]\d{2}[ -.]\d{4}\b/,
};

export const doesContainPersonalInformation = (text: string) => {
  return Object.values(REGEXPS).reduce((accum, filter) => {
    // Short circuit, testing regexs can be expensive
    if (accum || filter.test(text)) {
      accum = true;
    }

    return accum;
  }, false);
};

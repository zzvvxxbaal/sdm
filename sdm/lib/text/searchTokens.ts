// \u3131-\u318e: Hangul compatibility Jamo, \uac00-\ud7a3: Hangul syllables.
const SEARCH_NORMALIZE_REGEX = /[^0-9a-z\u3131-\u318e\uac00-\ud7a3]+/g;
const SEARCH_SPLIT_REGEX = /[^0-9a-z\u3131-\u318e\uac00-\ud7a3]+/;

export function normalizeSearchText(value: string) {
  return value.toLowerCase().replace(SEARCH_NORMALIZE_REGEX, "");
}

export function splitSearchTokens(value: string) {
  return value.toLowerCase().split(SEARCH_SPLIT_REGEX).filter(Boolean);
}

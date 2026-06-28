import { normalizeSearchText, splitSearchTokens } from "./searchTokens";

export function buildSearchTokens(...values: Array<string | null | undefined>) {
  const tokens = new Set<string>();

  values.forEach((value) => {
    if (!value) return;

    const normalized = normalizeSearchText(value);
    if (normalized) {
      for (let index = 2; index <= normalized.length; index += 1) {
        tokens.add(normalized.slice(0, index));
      }
    }

    splitSearchTokens(value).forEach((token) => {
      for (let index = 2; index <= token.length; index += 1) {
        tokens.add(token.slice(0, index));
      }
      tokens.add(token);
    });
  });

  return Array.from(tokens);
}

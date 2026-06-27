/**
 * Bible text file encoding detection and conversion.
 * Supports: UTF-8, UTF-8 with BOM, CP949, EUC-KR
 */

export const SUPPORTED_ENCODINGS = [
  "utf-8",
  "utf-8-bom",
  "cp949",
  "euc-kr",
] as const;

export type BibleEncoding = (typeof SUPPORTED_ENCODINGS)[number];

function decodeBuffer(buffer: Buffer, encoding: BibleEncoding): string {
  if (encoding === "utf-8-bom") {
    return buffer.toString("utf-8", 3);
  }
  if (encoding === "utf-8") {
    return buffer.toString("utf-8");
  }
  const decoderEncoding = encoding === "cp949" ? "euc-kr" : encoding;
  return new TextDecoder(decoderEncoding).decode(buffer);
}

/**
 * Detects the encoding of a Bible text file by trying multiple encodings.
 * Returns the detected encoding and the decoded text.
 *
 * @param buffer - Raw file buffer
 * @returns Object with encoding name and decoded text
 */
export function detectBibleEncoding(buffer: Buffer): {
  encoding: BibleEncoding;
  text: string;
} {
  // Check for BOM first
  if (buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    return {
      encoding: "utf-8-bom",
      text: decodeBuffer(buffer, "utf-8-bom"),
    };
  }

  // Try UTF-8
  if (isValidUTF8(buffer)) {
    const text = buffer.toString("utf-8");
    if (looksLikeKoreanBible(text)) {
      return { encoding: "utf-8", text };
    }
  }

  // Try CP949 (superset of EUC-KR, most common for Korean)
  try {
    const text = decodeBuffer(buffer, "cp949");
    if (looksLikeKoreanBible(text)) {
      return { encoding: "cp949", text };
    }
  } catch {
    // CP949 not available, try EUC-KR
  }

  // Try EUC-KR
  try {
    const text = decodeBuffer(buffer, "euc-kr");
    if (looksLikeKoreanBible(text)) {
      return { encoding: "euc-kr", text };
    }
  } catch {
    // EUC-KR not available
  }

  // Fallback to CP949 with best effort
  const fallbackText = decodeBuffer(buffer, "cp949");
  return { encoding: "cp949", text: fallbackText };
}

/**
 * Validates if a buffer is valid UTF-8 without decoding.
 */
function isValidUTF8(buffer: Buffer): boolean {
  try {
    const decoder = new TextDecoder("utf-8", { fatal: true });
    decoder.decode(buffer);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if the decoded text looks like a Korean Bible.
 * Looks for Korean characters and Bible patterns.
 */
function looksLikeKoreanBible(text: string): boolean {
  const sampleLines = text
    .split("\n")
    .filter((l) => l.trim().length > 0)
    .slice(0, 20);

  if (sampleLines.length === 0) return false;

  // Check for Korean characters
  const koreanRegex = /[\uac00-\ud7a3]/;
  const koreanLines = sampleLines.filter((l) => koreanRegex.test(l));

  // Check for Bible reference pattern (e.g., "창1:1", "출1:2")
  const biblePattern = /^[\uac00-\ud7a3]+\d+:\d+/;
  const bibleLines = sampleLines.filter((l) => biblePattern.test(l.trim()));

  return koreanLines.length >= 5 && bibleLines.length >= 3;
}

/**
 * Converts Bible text to UTF-8 for consistent processing.
 */
export function convertToUTF8(buffer: Buffer): string {
  const { text } = detectBibleEncoding(buffer);
  return text;
}

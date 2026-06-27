/**
 * Calculates the church "또래" (peer generation) label from a birth year.
 *
 * @example
 * getGeneration(1999) // "99또래"
 * getGeneration(2004) // "04또래"
 * getGeneration(2010) // "10또래"
 */
export function getGeneration(birthYear: number): string {
  const lastTwoDigits = String(birthYear % 100).padStart(2, "0");
  return `${lastTwoDigits}또래`;
}

const MIN_BIRTH_YEAR = 1900;

/**
 * Returns true when the provided birth year is within a plausible range.
 */
export function isValidBirthYear(birthYear: number): boolean {
  const currentYear = new Date().getFullYear();
  return (
    Number.isInteger(birthYear) &&
    birthYear >= MIN_BIRTH_YEAR &&
    birthYear <= currentYear
  );
}

/**
 * Computes an approximate age (Korean "만 나이") from a birth year.
 */
export function getAgeFromBirthYear(birthYear: number): number {
  return new Date().getFullYear() - birthYear;
}

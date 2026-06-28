/**
 * Format a Firestore timestamp or Date object to Korean date string
 * @param date - Firestore timestamp, Date, string, or null/undefined
 * @returns Formatted date string or "—" if invalid
 */
export function formatDateKorean(date: unknown): string {
  if (!date) return "—";
  try {
    // Handle Firestore Timestamp objects
    const d = typeof date === "object" && date !== null && "toDate" in (date as object)
      ? (date as { toDate(): Date }).toDate()
      : new Date(date as string | number);
    
    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return "—";
  }
}

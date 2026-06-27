import { z } from "zod";

export const bibleBookSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  shortName: z.string().min(1),
  testament: z.enum(["old", "new"]),
  order: z.number().int().min(0),
  chapterCount: z.number().int().min(1),
  abbreviation: z.string().min(1),
  aliases: z.array(z.string()).default([]),
});

export type BibleBook = z.infer<typeof bibleBookSchema>;

/**
 * Bible books with exact abbreviations matching the Korean Bible text file.
 * The abbreviation field MUST match the file's book abbreviations for parser compatibility.
 */
export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament
  { id: "gen", name: "창세기", shortName: "창세", testament: "old", order: 1, chapterCount: 50, abbreviation: "창", aliases: ["genesis"] },
  { id: "exo", name: "출애국기", shortName: "출애", testament: "old", order: 2, chapterCount: 40, abbreviation: "출", aliases: ["exodus"] },
  { id: "lev", name: "레위기", shortName: "레위", testament: "old", order: 3, chapterCount: 27, abbreviation: "레", aliases: ["leviticus"] },
  { id: "num", name: "민수기", shortName: "민수", testament: "old", order: 4, chapterCount: 36, abbreviation: "민", aliases: ["numbers"] },
  { id: "deu", name: "신명기", shortName: "신명", testament: "old", order: 5, chapterCount: 34, abbreviation: "신", aliases: ["deuteronomy"] },
  { id: "jos", name: "여호수아", shortName: "여호수", testament: "old", order: 6, chapterCount: 24, abbreviation: "수", aliases: ["joshua"] },
  { id: "jdg", name: "사사기", shortName: "사사", testament: "old", order: 7, chapterCount: 21, abbreviation: "삿", aliases: ["judges"] },
  { id: "rut", name: "뢸의기", shortName: "뢸", testament: "old", order: 8, chapterCount: 4, abbreviation: "룻", aliases: ["ruth"] },
  { id: "1sa", name: "사무엘상", shortName: "사무엘상", testament: "old", order: 9, chapterCount: 31, abbreviation: "삼상", aliases: ["1samuel"] },
  { id: "2sa", name: "사무엘하", shortName: "사무엘하", testament: "old", order: 10, chapterCount: 24, abbreviation: "삼하", aliases: ["2samuel"] },
  { id: "1ki", name: "열왕기상", shortName: "열왕상", testament: "old", order: 11, chapterCount: 22, abbreviation: "왕상", aliases: ["1kings"] },
  { id: "2ki", name: "열왕기하", shortName: "열왕하", testament: "old", order: 12, chapterCount: 25, abbreviation: "왕하", aliases: ["2kings"] },
  { id: "1ch", name: "역대상", shortName: "역대상", testament: "old", order: 13, chapterCount: 29, abbreviation: "대상", aliases: ["1chronicles"] },
  { id: "2ch", name: "역대하", shortName: "역대하", testament: "old", order: 14, chapterCount: 36, abbreviation: "대하", aliases: ["2chronicles"] },
  { id: "ezr", name: "에스라", shortName: "에스라", testament: "old", order: 15, chapterCount: 10, abbreviation: "스", aliases: ["ezra"] },
  { id: "neh", name: "느헤미야", shortName: "느헤미", testament: "old", order: 16, chapterCount: 13, abbreviation: "느", aliases: ["nehemiah"] },
  { id: "est", name: "에스더", shortName: "에스더", testament: "old", order: 17, chapterCount: 10, abbreviation: "에", aliases: ["esther"] },
  { id: "job", name: "욥기", shortName: "욥", testament: "old", order: 18, chapterCount: 42, abbreviation: "욥", aliases: ["job"] },
  { id: "psa", name: "시편", shortName: "시편", testament: "old", order: 19, chapterCount: 150, abbreviation: "시", aliases: ["psalms", "psalm"] },
  { id: "pro", name: "잘멸", shortName: "잘멸", testament: "old", order: 20, chapterCount: 31, abbreviation: "잠", aliases: ["proverbs"] },
  { id: "ecc", name: "전도서", shortName: "전도", testament: "old", order: 21, chapterCount: 12, abbreviation: "전", aliases: ["ecclesiastes"] },
  { id: "sos", name: "아가", shortName: "아가", testament: "old", order: 22, chapterCount: 8, abbreviation: "아", aliases: ["songofsolomon", "songs"] },
  { id: "isa", name: "이사야", shortName: "이사야", testament: "old", order: 23, chapterCount: 66, abbreviation: "사", aliases: ["isaiah"] },
  { id: "jer", name: "예레미야", shortName: "예레미", testament: "old", order: 24, chapterCount: 52, abbreviation: "렘", aliases: ["jeremiah"] },
  { id: "lam", name: "예레미야애가", shortName: "애가", testament: "old", order: 25, chapterCount: 5, abbreviation: "애", aliases: ["lamentations"] },
  { id: "eze", name: "에스겔", shortName: "에스겔", testament: "old", order: 26, chapterCount: 48, abbreviation: "겔", aliases: ["ezekiel"] },
  { id: "dan", name: "다니엘", shortName: "다니엘", testament: "old", order: 27, chapterCount: 12, abbreviation: "단", aliases: ["daniel"] },
  { id: "hos", name: "호세아", shortName: "호세아", testament: "old", order: 28, chapterCount: 14, abbreviation: "호", aliases: ["hosea"] },
  { id: "joe", name: "요엘", shortName: "요엘", testament: "old", order: 29, chapterCount: 3, abbreviation: "욜", aliases: ["joel"] },
  { id: "amo", name: "아모스", shortName: "아모스", testament: "old", order: 30, chapterCount: 9, abbreviation: "암", aliases: ["amos"] },
  { id: "oba", name: "오바댜", shortName: "오바댜", testament: "old", order: 31, chapterCount: 1, abbreviation: "옵", aliases: ["obadiah"] },
  { id: "jon", name: "요나", shortName: "요나", testament: "old", order: 32, chapterCount: 4, abbreviation: "욘", aliases: ["jonah"] },
  { id: "mic", name: "미가", shortName: "미가", testament: "old", order: 33, chapterCount: 7, abbreviation: "미", aliases: ["micah"] },
  { id: "nah", name: "나훔", shortName: "나훔", testament: "old", order: 34, chapterCount: 3, abbreviation: "나", aliases: ["nahum"] },
  { id: "hab", name: "하박국", shortName: "하박국", testament: "old", order: 35, chapterCount: 3, abbreviation: "합", aliases: ["habakkuk"] },
  { id: "zep", name: "스바냐", shortName: "스바냐", testament: "old", order: 36, chapterCount: 3, abbreviation: "습", aliases: ["zephaniah"] },
  { id: "hag", name: "학개", shortName: "학개", testament: "old", order: 37, chapterCount: 2, abbreviation: "학", aliases: ["haggai"] },
  { id: "zec", name: "스가랴", shortName: "스가랴", testament: "old", order: 38, chapterCount: 14, abbreviation: "슥", aliases: ["zechariah"] },
  { id: "mal", name: "말라기", shortName: "말라", testament: "old", order: 39, chapterCount: 4, abbreviation: "말", aliases: ["malachi"] },

  // New Testament
  { id: "mat", name: "마태복음", shortName: "마태", testament: "new", order: 40, chapterCount: 28, abbreviation: "마", aliases: ["matthew"] },
  { id: "mar", name: "마가복음", shortName: "마가", testament: "new", order: 41, chapterCount: 16, abbreviation: "막", aliases: ["mark"] },
  { id: "luk", name: "누가복음", shortName: "누가", testament: "new", order: 42, chapterCount: 24, abbreviation: "눅", aliases: ["luke"] },
  { id: "joh", name: "요한복음", shortName: "요한", testament: "new", order: 43, chapterCount: 21, abbreviation: "요", aliases: ["john"] },
  { id: "act", name: "사도행전", shortName: "사도", testament: "new", order: 44, chapterCount: 28, abbreviation: "행", aliases: ["acts"] },
  { id: "rom", name: "로마서", shortName: "로마", testament: "new", order: 45, chapterCount: 16, abbreviation: "롬", aliases: ["romans"] },
  { id: "1co", name: "고린도전서", shortName: "고린도전", testament: "new", order: 46, chapterCount: 16, abbreviation: "고전", aliases: ["1corinthians"] },
  { id: "2co", name: "고린도후서", shortName: "고린도후", testament: "new", order: 47, chapterCount: 13, abbreviation: "고후", aliases: ["2corinthians"] },
  { id: "gal", name: "갈라디아서", shortName: "갈라디아", testament: "new", order: 48, chapterCount: 6, abbreviation: "갈", aliases: ["galatians"] },
  { id: "eph", name: "에베소서", shortName: "에베소", testament: "new", order: 49, chapterCount: 6, abbreviation: "엡", aliases: ["ephesians"] },
  { id: "phi", name: "빌립보서", shortName: "빌립보", testament: "new", order: 50, chapterCount: 4, abbreviation: "빌", aliases: ["philippians"] },
  { id: "col", name: "골로새서", shortName: "골로새", testament: "new", order: 51, chapterCount: 4, abbreviation: "골", aliases: ["colossians"] },
  { id: "1th", name: "데살로니가전서", shortName: "데살로니가전", testament: "new", order: 52, chapterCount: 5, abbreviation: "살전", aliases: ["1thessalonians"] },
  { id: "2th", name: "데살로니가후서", shortName: "데살로니가후", testament: "new", order: 53, chapterCount: 3, abbreviation: "살후", aliases: ["2thessalonians"] },
  { id: "1ti", name: "디모데전서", shortName: "디모데전", testament: "new", order: 54, chapterCount: 6, abbreviation: "딤전", aliases: ["1timothy"] },
  { id: "2ti", name: "디모데후서", shortName: "디모데후", testament: "new", order: 55, chapterCount: 4, abbreviation: "딤후", aliases: ["2timothy"] },
  { id: "tit", name: "디도서", shortName: "디도", testament: "new", order: 56, chapterCount: 3, abbreviation: "딛", aliases: ["titus"] },
  { id: "phm", name: "빌레몬서", shortName: "빌레몬", testament: "new", order: 57, chapterCount: 1, abbreviation: "몬", aliases: ["philemon"] },
  { id: "heb", name: "히브리서", shortName: "히브리", testament: "new", order: 58, chapterCount: 13, abbreviation: "히", aliases: ["hebrews"] },
  { id: "jas", name: "야고보서", shortName: "야고보", testament: "new", order: 59, chapterCount: 5, abbreviation: "약", aliases: ["james"] },
  { id: "1pe", name: "베드로전서", shortName: "베드로전", testament: "new", order: 60, chapterCount: 5, abbreviation: "벧전", aliases: ["1peter"] },
  { id: "2pe", name: "베드로후서", shortName: "베드로후", testament: "new", order: 61, chapterCount: 3, abbreviation: "벧후", aliases: ["2peter"] },
  { id: "1jo", name: "요한일서", shortName: "요한일", testament: "new", order: 62, chapterCount: 5, abbreviation: "요일", aliases: ["1john"] },
  { id: "2jo", name: "요한이서", shortName: "요한이", testament: "new", order: 63, chapterCount: 1, abbreviation: "요이", aliases: ["2john"] },
  { id: "3jo", name: "요한삼서", shortName: "요한삼", testament: "new", order: 64, chapterCount: 1, abbreviation: "요삼", aliases: ["3john"] },
  { id: "jud", name: "유다서", shortName: "유다", testament: "new", order: 65, chapterCount: 1, abbreviation: "유", aliases: ["jude"] },
  { id: "rev", name: "요한계시록", shortName: "요한계시", testament: "new", order: 66, chapterCount: 22, abbreviation: "계", aliases: ["revelation", "rev"] },
];

export const OLD_TESTAMENT_BOOKS = BIBLE_BOOKS.filter((b) => b.testament === "old");
export const NEW_TESTAMENT_BOOKS = BIBLE_BOOKS.filter((b) => b.testament === "new");

export const BIBLE_BOOK_MAP: Record<string, BibleBook> = BIBLE_BOOKS.reduce(
  (acc, book) => {
    acc[book.id] = book;
    acc[book.abbreviation] = book;
    acc[book.name] = book;
    acc[book.shortName] = book;
    book.aliases.forEach((alias) => {
      acc[alias] = book;
    });
    return acc;
  },
  {} as Record<string, BibleBook>
);

export function getBookById(id: string): BibleBook | undefined {
  return BIBLE_BOOKS.find((b) => b.id === id);
}

export function getBookByAbbreviation(abbr: string): BibleBook | undefined {
  return BIBLE_BOOKS.find((b) => b.abbreviation === abbr);
}

export function getBookByName(name: string): BibleBook | undefined {
  return BIBLE_BOOK_MAP[name] || BIBLE_BOOKS.find((b) => b.name === name || b.shortName === name);
}

export function getChapterCount(bookId: string): number {
  const book = getBookById(bookId);
  return book?.chapterCount ?? 0;
}

export function getNextBook(bookId: string): BibleBook | null {
  const book = getBookById(bookId);
  if (!book) return null;
  return BIBLE_BOOKS.find((b) => b.order === book.order + 1) ?? null;
}

export function getPreviousBook(bookId: string): BibleBook | null {
  const book = getBookById(bookId);
  if (!book) return null;
  return BIBLE_BOOKS.find((b) => b.order === book.order - 1) ?? null;
}

export function searchBooks(query: string): BibleBook[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return BIBLE_BOOKS.filter((b) => {
    const fields = [b.name, b.shortName, b.abbreviation, ...b.aliases].map((f) =>
      f.toLowerCase()
    );
    return fields.some((f) => f.includes(q));
  });
}

export function getBookByFileAbbreviation(abbr: string): BibleBook | undefined {
  return BIBLE_BOOKS.find((b) => b.abbreviation === abbr);
}

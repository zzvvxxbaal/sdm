import { z } from "zod";

export const bibleBookSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  shortName: z.string().min(1),
  testament: z.enum(["old", "new"]),
  order: z.number().int().min(0),
  chapterCount: z.number().int().min(1),
  abbreviation: z.string().min(1),
});

export type BibleBook = z.infer<typeof bibleBookSchema>;

export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament
  { id: "gen", name: "창세기", shortName: "창", testament: "old", order: 1, chapterCount: 50, abbreviation: "창" },
  { id: "exo", name: "출애국기", shortName: "출", testament: "old", order: 2, chapterCount: 40, abbreviation: "출" },
  { id: "lev", name: "레위기", shortName: "레", testament: "old", order: 3, chapterCount: 27, abbreviation: "레" },
  { id: "num", name: "민수기", shortName: "민", testament: "old", order: 4, chapterCount: 36, abbreviation: "민" },
  { id: "deu", name: "신명기", shortName: "신", testament: "old", order: 5, chapterCount: 34, abbreviation: "신" },
  { id: "jos", name: "요사아트", shortName: "요", testament: "old", order: 6, chapterCount: 24, abbreviation: "요" },
  { id: "jdg", name: "사사기", shortName: "사", testament: "old", order: 7, chapterCount: 21, abbreviation: "사" },
  { id: "rut", name: "루타기", shortName: "루", testament: "old", order: 8, chapterCount: 4, abbreviation: "루" },
  { id: "1sa", name: "사무엘상", shortName: "살1", testament: "old", order: 9, chapterCount: 31, abbreviation: "살1" },
  { id: "2sa", name: "사무엘하", shortName: "살2", testament: "old", order: 10, chapterCount: 24, abbreviation: "살2" },
  { id: "1ki", name: "여화상", shortName: "여1", testament: "old", order: 11, chapterCount: 22, abbreviation: "여1" },
  { id: "2ki", name: "여화하", shortName: "여2", testament: "old", order: 12, chapterCount: 25, abbreviation: "여2" },
  { id: "1ch", name: "무리실", shortName: "무1", testament: "old", order: 13, chapterCount: 29, abbreviation: "무1" },
  { id: "2ch", name: "무리하", shortName: "무2", testament: "old", order: 14, chapterCount: 36, abbreviation: "무2" },
  { id: "ezr", name: "에스라", shortName: "에", testament: "old", order: 15, chapterCount: 10, abbreviation: "에" },
  { id: "neh", name: "네히미", shortName: "네", testament: "old", order: 16, chapterCount: 13, abbreviation: "네" },
  { id: "est", name: "에스터", shortName: "에스", testament: "old", order: 17, chapterCount: 10, abbreviation: "에스" },
  { id: "job", name: "요백", shortName: "요", testament: "old", order: 18, chapterCount: 42, abbreviation: "요" },
  { id: "psa", name: "시편", shortName: "시", testament: "old", order: 19, chapterCount: 150, abbreviation: "시" },
  { id: "pro", name: "잘멸", shortName: "잘", testament: "old", order: 20, chapterCount: 31, abbreviation: "잘" },
  { id: "ecc", name: "전도서", shortName: "전", testament: "old", order: 21, chapterCount: 12, abbreviation: "전" },
  { id: "sos", name: "아요에", shortName: "아", testament: "old", order: 22, chapterCount: 8, abbreviation: "아" },
  { id: "isa", name: "이사야", shortName: "이", testament: "old", order: 23, chapterCount: 66, abbreviation: "이" },
  { id: "jer", name: "예레미야", shortName: "예", testament: "old", order: 24, chapterCount: 52, abbreviation: "예" },
  { id: "lam", name: "예레미야 애가", shortName: "애", testament: "old", order: 25, chapterCount: 5, abbreviation: "애" },
  { id: "eze", name: "에촍곸", shortName: "에", testament: "old", order: 26, chapterCount: 48, abbreviation: "에쬰" },
  { id: "dan", name: "다니엘", shortName: "다", testament: "old", order: 27, chapterCount: 12, abbreviation: "다" },
  { id: "hos", name: "호세아", shortName: "호", testament: "old", order: 28, chapterCount: 14, abbreviation: "호" },
  { id: "joe", name: "요엘", shortName: "엘", testament: "old", order: 29, chapterCount: 3, abbreviation: "엘" },
  { id: "amo", name: "아모스", shortName: "모", testament: "old", order: 30, chapterCount: 9, abbreviation: "모" },
  { id: "oba", name: "오바디아", shortName: "오", testament: "old", order: 31, chapterCount: 1, abbreviation: "오" },
  { id: "jon", name: "요나", shortName: "나", testament: "old", order: 32, chapterCount: 4, abbreviation: "나" },
  { id: "mic", name: "미카", shortName: "미", testament: "old", order: 33, chapterCount: 7, abbreviation: "미" },
  { id: "nah", name: "나훔", shortName: "나훔", testament: "old", order: 34, chapterCount: 3, abbreviation: "나훔" },
  { id: "hab", name: "하밥쿠", shortName: "하", testament: "old", order: 35, chapterCount: 3, abbreviation: "하" },
  { id: "zep", name: "시팽야", shortName: "시팽", testament: "old", order: 36, chapterCount: 3, abbreviation: "시팽" },
  { id: "hag", name: "하개", shortName: "하개", testament: "old", order: 37, chapterCount: 2, abbreviation: "하개" },
  { id: "zec", name: "초가련", shortName: "초", testament: "old", order: 38, chapterCount: 14, abbreviation: "초" },
  { id: "mal", name: "말라기", shortName: "말", testament: "old", order: 39, chapterCount: 4, abbreviation: "말" },

  // New Testament
  { id: "mat", name: "마타보복음", shortName: "마", testament: "new", order: 40, chapterCount: 28, abbreviation: "마" },
  { id: "mar", name: "마가보복음", shortName: "막", testament: "new", order: 41, chapterCount: 16, abbreviation: "막" },
  { id: "luk", name: "룩가복음", shortName: "룩", testament: "new", order: 42, chapterCount: 24, abbreviation: "룩" },
  { id: "joh", name: "요한복음", shortName: "요", testament: "new", order: 43, chapterCount: 21, abbreviation: "요" },
  { id: "act", name: "사도행전", shortName: "사", testament: "new", order: 44, chapterCount: 28, abbreviation: "사" },
  { id: "rom", name: "로마서", shortName: "로", testament: "new", order: 45, chapterCount: 16, abbreviation: "로" },
  { id: "1co", name: "고린도전상", shortName: "콕1", testament: "new", order: 46, chapterCount: 16, abbreviation: "콕1" },
  { id: "2co", name: "고린도전하", shortName: "콕2", testament: "new", order: 47, chapterCount: 13, abbreviation: "콕2" },
  { id: "gal", name: "갈라티아서", shortName: "갈", testament: "new", order: 48, chapterCount: 6, abbreviation: "갈" },
  { id: "eph", name: "에베소서", shortName: "에", testament: "new", order: 49, chapterCount: 6, abbreviation: "에사" },
  { id: "phi", name: "빌립포서", shortName: "빌", testament: "new", order: 50, chapterCount: 4, abbreviation: "빌" },
  { id: "col", name: "콜로세서", shortName: "콜", testament: "new", order: 51, chapterCount: 4, abbreviation: "콜" },
  { id: "1th", name: "데살로니가전상", shortName: "덱1", testament: "new", order: 52, chapterCount: 5, abbreviation: "덱1" },
  { id: "2th", name: "데살로니가전하", shortName: "덱2", testament: "new", order: 53, chapterCount: 3, abbreviation: "덱2" },
  { id: "1ti", name: "디모데전상", shortName: "디1", testament: "new", order: 54, chapterCount: 6, abbreviation: "디1" },
  { id: "2ti", name: "디모데전하", shortName: "디2", testament: "new", order: 55, chapterCount: 4, abbreviation: "디2" },
  { id: "tit", name: "디도서", shortName: "디도", testament: "new", order: 56, chapterCount: 3, abbreviation: "디도" },
  { id: "phm", name: "빌듬서", shortName: "듬", testament: "new", order: 57, chapterCount: 1, abbreviation: "듬" },
  { id: "heb", name: "히브리서", shortName: "히", testament: "new", order: 58, chapterCount: 13, abbreviation: "히" },
  { id: "jas", name: "야고보서", shortName: "야", testament: "new", order: 59, chapterCount: 5, abbreviation: "야" },
  { id: "1pe", name: "베드로전상", shortName: "베1", testament: "new", order: 60, chapterCount: 5, abbreviation: "베1" },
  { id: "2pe", name: "베드로전하", shortName: "베2", testament: "new", order: 61, chapterCount: 3, abbreviation: "베2" },
  { id: "1jo", name: "요한일서", shortName: "요1", testament: "new", order: 62, chapterCount: 5, abbreviation: "요1" },
  { id: "2jo", name: "요한이서", shortName: "요2", testament: "new", order: 63, chapterCount: 1, abbreviation: "요2" },
  { id: "3jo", name: "요한삼서", shortName: "요3", testament: "new", order: 64, chapterCount: 1, abbreviation: "요3" },
  { id: "jud", name: "유다서", shortName: "유", testament: "new", order: 65, chapterCount: 1, abbreviation: "유" },
  { id: "rev", name: "요한계시록", shortName: "시", testament: "new", order: 66, chapterCount: 22, abbreviation: "시록" },
];

export const OLD_TESTAMENT_BOOKS = BIBLE_BOOKS.filter((b) => b.testament === "old");
export const NEW_TESTAMENT_BOOKS = BIBLE_BOOKS.filter((b) => b.testament === "new");

export function getBookById(id: string): BibleBook | undefined {
  return BIBLE_BOOKS.find((b) => b.id === id);
}

export function getBookByAbbreviation(abbr: string): BibleBook | undefined {
  return BIBLE_BOOKS.find((b) => b.abbreviation === abbr);
}

export function getBookByName(name: string): BibleBook | undefined {
  return BIBLE_BOOKS.find((b) => b.name === name || b.shortName === name);
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

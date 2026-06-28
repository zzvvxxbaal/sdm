import { readFileSync } from "fs";
import { join } from "path";
import { parseBibleText } from "@/lib/bible/parser";
import { detectBibleEncoding } from "@/lib/bible/encoding";
import { writeFileSync } from "fs";

async function main() {
  const filePath = join(process.cwd(), "data", "bible_korean.txt");

  console.log("Reading Bible file...");
  const buffer = readFileSync(filePath);

  console.log("Detecting encoding...");
  const { encoding, text } = detectBibleEncoding(buffer);
  console.log(`Detected encoding: ${encoding}`);

  console.log("Parsing Bible text...");
  const result = parseBibleText(text);

  console.log("\n=== Parse Results ===");
  console.log(`Total verses: ${result.stats.totalVerses}`);
  console.log(`Total books: ${result.stats.totalBooks}`);
  console.log(`Total chapters: ${result.stats.totalChapters}`);
  console.log(`Old Testament verses: ${result.stats.oldTestamentVerses}`);
  console.log(`New Testament verses: ${result.stats.newTestamentVerses}`);
  console.log(`Books parsed: ${result.stats.booksParsed.join(", ")}`);

  // Save as JSON
  const outputPath = join(process.cwd(), "data", "bible_parsed.json");
  writeFileSync(
    outputPath,
   JSON.stringify(
     {
       verses: result.verses,
       stats: result.stats,
     },
     null,
     2
   )
  );
  console.log(`\nSaved to: ${outputPath}`);

  // Sample verses
  console.log("\n=== Sample Verses ===");
  console.log("Genesis 1:1:", result.verses[0]?.text.substring(0, 50));
  console.log(
   "John 3:16:",
   result.verses
     .find((v) => v.bookId === "joh" && v.chapterNumber === 3 && v.verseNumber === 16)
     ?.text.substring(0, 50)
  );
  console.log("Revelation 22:21:", result.verses[result.verses.length - 1]?.text.substring(0, 50));
}

main().catch(console.error);

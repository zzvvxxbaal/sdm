import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const filePath = join(process.cwd(), 'data', 'bible_korean.txt');
const buffer = readFileSync(filePath);

function detectEncoding(buf) {
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    return { encoding: 'utf-8-bom', text: buf.toString('utf8', 3) };
  }
  try {
    const text = buf.toString('utf8');
    const lines = text.split('\n').filter((line) => line.trim()).slice(0, 10);
    const hasKorean = lines.some((line) => /[\uac00-\ud7a3]/.test(line));
    const hasPattern = lines.some((line) => /^[\uac00-\ud7a3]+\d+:\d+/.test(line));
    if (hasKorean && hasPattern) return { encoding: 'utf-8', text };
  } catch {}
  try {
    const text = buf.toString('cp949');
    const lines = text.split('\n').filter((line) => line.trim()).slice(0, 10);
    const hasKorean = lines.some((line) => /[\uac00-\ud7a3]/.test(line));
    const hasPattern = lines.some((line) => /^[\uac00-\ud7a3]+\d+:\d+/.test(line));
    if (hasKorean && hasPattern) return { encoding: 'cp949', text };
  } catch {}
  return { encoding: 'unknown', text: buf.toString('utf8') };
}

const { encoding, text } = detectEncoding(buffer);
console.log('Detected encoding:', encoding);

const lines = text.split('\n').filter((line) => line.trim());
console.log('Total lines:', lines.length);

const verses = [];
const bookAbbrevs = new Map();

for (const line of lines) {
  const trimmed = line.trim();
  const match = trimmed.match(/^([\uac00-\ud7a3]+)(\d+):(\d+)\s+(.+)$/);
  if (match) {
    const [, bookAbbreviation, chapterStr, verseStr, verseText] = match;
    const cleanedText = verseText.replace(/<[^>]+>\s*/, '').trim();
    verses.push({
      bookAbbreviation,
      chapterNumber: parseInt(chapterStr, 10),
      verseNumber: parseInt(verseStr, 10),
      text: cleanedText,
    });
    bookAbbrevs.set(bookAbbreviation, (bookAbbrevs.get(bookAbbreviation) || 0) + 1);
  }
}

console.log('\n=== Parse Results ===');
console.log('Total verses parsed:', verses.length);
console.log('Total books:', bookAbbrevs.size);

const sorted = [...bookAbbrevs.entries()].sort((a, b) => b[1] - a[1]);
console.log('\n=== Books in order of first appearance ===');
for (const [abbr, count] of sorted) {
  console.log(`  ${abbr}: ${count} verses`);
}

console.log('\n=== Sample Verses ===');
console.log('First:', verses[0]);
console.log('Last:', verses[verses.length - 1]);

/**
 * Bible Import Script
 * Imports parsed Bible verses into Firestore for indexed searching.
 *
 * Usage: npx ts-node --transpile-only scripts/bible/import_to_firestore.ts
 */

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  writeBatch,
  doc,
  setDoc,
} from "firebase/firestore";
import { readFileSync } from "fs";
import { join } from "path";
import type { BibleVerse } from "@/types/bible";

const firebaseConfig = {
  // Your Firebase config - will be loaded from environment
};

interface ParsedBibleData {
  verses: BibleVerse[];
  stats: {
    totalVerses: number;
    totalBooks: number;
    totalChapters: number;
    oldTestamentVerses: number;
    newTestamentVerses: number;
  };
}

async function importBibleToFirestore() {
  const filePath = join(process.cwd(), "data", "bible_parsed.json");
  const data: ParsedBibleData = JSON.parse(readFileSync(filePath, "utf8"));

  console.log(`Importing ${data.stats.totalVerses} verses...`);

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Import books metadata
  const booksRef = doc(db, "bible_metadata", "books");
  await setDoc(booksRef, {
    totalBooks: data.stats.totalBooks,
    totalChapters: data.stats.totalChapters,
    totalVerses: data.stats.totalVerses,
    oldTestamentVerses: data.stats.oldTestamentVerses,
    newTestamentVerses: data.stats.newTestamentVerses,
    updatedAt: new Date().toISOString(),
  });

  // Import verses in batches (Firestore batch limit: 500 operations)
  const BATCH_SIZE = 400;
  const verses = data.verses;

  for (let i = 0; i < verses.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const batchVerses = verses.slice(i, i + BATCH_SIZE);

    for (const verse of batchVerses) {
      const verseRef = doc(db, "bible_verses", verse.id);
      batch.set(verseRef, {
        bookId: verse.bookId,
        bookName: verse.bookName,
        chapterNumber: verse.chapterNumber,
        verseNumber: verse.verseNumber,
        text: verse.text,
        testament: verse.testament,
        // Search index fields
        searchText: verse.text.toLowerCase(),
        bookChapter: `${verse.bookId}_${verse.chapterNumber}`,
      });
    }

    await batch.commit();
    console.log(`Imported ${Math.min(i + BATCH_SIZE, verses.length)} / ${verses.length} verses`);
  }

  console.log("Bible import complete!");
}

// Run if called directly
if (require.main === module) {
  importBibleToFirestore().catch(console.error);
}

import { Book, Verse } from "@/types/bible";

const BIBLE_API_BASE = "https://bible-api.com";

export interface BibleBookData {
  [bookId: string]: {
    [chapter: number]: {
      chapter: number;
      verses: Verse[];
    };
  };
}

export const BIBLE_BOOKS: Book[] = [
  { id: "Genesis", name: "Genesis", testament: "old", chapters: 50 },
  { id: "Exodus", name: "Exodus", testament: "old", chapters: 40 },
  { id: "Leviticus", name: "Leviticus", testament: "old", chapters: 27 },
  { id: "Numbers", name: "Numbers", testament: "old", chapters: 36 },
  { id: "Deuteronomy", name: "Deuteronomy", testament: "old", chapters: 34 },
  { id: "Joshua", name: "Joshua", testament: "old", chapters: 24 },
  { id: "Judges", name: "Judges", testament: "old", chapters: 21 },
  { id: "Ruth", name: "Ruth", testament: "old", chapters: 4 },
  { id: "1Samuel", name: "1 Samuel", testament: "old", chapters: 31 },
  { id: "2Samuel", name: "2 Samuel", testament: "old", chapters: 24 },
  { id: "1Kings", name: "1 Kings", testament: "old", chapters: 22 },
  { id: "2Kings", name: "2 Kings", testament: "old", chapters: 25 },
  { id: "1Chronicles", name: "1 Chronicles", testament: "old", chapters: 29 },
  { id: "2Chronicles", name: "2 Chronicles", testament: "old", chapters: 36 },
  { id: "Ezra", name: "Ezra", testament: "old", chapters: 10 },
  { id: "Nehemiah", name: "Nehemiah", testament: "old", chapters: 13 },
  { id: "Esther", name: "Esther", testament: "old", chapters: 10 },
  { id: "Job", name: "Job", testament: "old", chapters: 42 },
  { id: "Psalms", name: "Psalms", testament: "old", chapters: 150 },
  { id: "Proverbs", name: "Proverbs", testament: "old", chapters: 31 },
  { id: "Ecclesiastes", name: "Ecclesiastes", testament: "old", chapters: 12 },
  {
    id: "SongofSolomon",
    name: "Song of Solomon",
    testament: "old",
    chapters: 8,
  },
  { id: "Isaiah", name: "Isaiah", testament: "old", chapters: 66 },
  { id: "Jeremiah", name: "Jeremiah", testament: "old", chapters: 52 },
  { id: "Lamentations", name: "Lamentations", testament: "old", chapters: 5 },
  { id: "Ezekiel", name: "Ezekiel", testament: "old", chapters: 48 },
  { id: "Daniel", name: "Daniel", testament: "old", chapters: 12 },
  { id: "Hosea", name: "Hosea", testament: "old", chapters: 14 },
  { id: "Joel", name: "Joel", testament: "old", chapters: 3 },
  { id: "Amos", name: "Amos", testament: "old", chapters: 9 },
  { id: "Obadiah", name: "Obadiah", testament: "old", chapters: 1 },
  { id: "Jonah", name: "Jonah", testament: "old", chapters: 4 },
  { id: "Micah", name: "Micah", testament: "old", chapters: 7 },
  { id: "Nahum", name: "Nahum", testament: "old", chapters: 3 },
  { id: "Habakkuk", name: "Habakkuk", testament: "old", chapters: 3 },
  { id: "Zephaniah", name: "Zephaniah", testament: "old", chapters: 3 },
  { id: "Haggai", name: "Haggai", testament: "old", chapters: 2 },
  { id: "Zechariah", name: "Zechariah", testament: "old", chapters: 14 },
  { id: "Malachi", name: "Malachi", testament: "old", chapters: 4 },
  { id: "Matthew", name: "Matthew", testament: "new", chapters: 28 },
  { id: "Mark", name: "Mark", testament: "new", chapters: 16 },
  { id: "Luke", name: "Luke", testament: "new", chapters: 24 },
  { id: "John", name: "John", testament: "new", chapters: 21 },
  { id: "Acts", name: "Acts", testament: "new", chapters: 28 },
  { id: "Romans", name: "Romans", testament: "new", chapters: 16 },
  { id: "1Corinthians", name: "1 Corinthians", testament: "new", chapters: 16 },
  { id: "2Corinthians", name: "2 Corinthians", testament: "new", chapters: 13 },
  { id: "Galatians", name: "Galatians", testament: "new", chapters: 6 },
  { id: "Ephesians", name: "Ephesians", testament: "new", chapters: 6 },
  { id: "Philippians", name: "Philippians", testament: "new", chapters: 4 },
  { id: "Colossians", name: "Colossians", testament: "new", chapters: 4 },
  {
    id: "1Thessalonians",
    name: "1 Thessalonians",
    testament: "new",
    chapters: 5,
  },
  {
    id: "2Thessalonians",
    name: "2 Thessalonians",
    testament: "new",
    chapters: 3,
  },
  { id: "1Timothy", name: "1 Timothy", testament: "new", chapters: 6 },
  { id: "2Timothy", name: "2 Timothy", testament: "new", chapters: 4 },
  { id: "Titus", name: "Titus", testament: "new", chapters: 3 },
  { id: "Philemon", name: "Philemon", testament: "new", chapters: 1 },
  { id: "Hebrews", name: "Hebrews", testament: "new", chapters: 13 },
  { id: "James", name: "James", testament: "new", chapters: 5 },
  { id: "1Peter", name: "1 Peter", testament: "new", chapters: 5 },
  { id: "2Peter", name: "2 Peter", testament: "new", chapters: 3 },
  { id: "1John", name: "1 John", testament: "new", chapters: 5 },
  { id: "2John", name: "2 John", testament: "new", chapters: 1 },
  { id: "3John", name: "3 John", testament: "new", chapters: 1 },
  { id: "Jude", name: "Jude", testament: "new", chapters: 1 },
  { id: "Revelation", name: "Revelation", testament: "new", chapters: 22 },
];

const bibleCache: BibleBookData = {};

export async function fetchChapter(
  bookId: string,
  bookName: string,
  chapter: number
): Promise<Verse[]> {
  try {
    if (bibleCache[bookId]?.[chapter]) {
      console.log(`Returning cached data for ${bookName} ${chapter}`);
      return bibleCache[bookId][chapter].verses;
    }

    console.log(`Fetching ${bookName} ${chapter} from API...`);

    const cleanBookName = bookName.replace(/\s/g, "");
    const response = await fetch(
      `${BIBLE_API_BASE}/${cleanBookName}+${chapter}?translation=kjv`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch chapter: ${response.statusText}`);
    }

    const data = await response.json();

    const verses: Verse[] = data.verses.map((verse: any) => ({
      book: bookName,
      chapter: verse.chapter,
      verse: verse.verse,
      text: verse.text,
    }));

    if (!bibleCache[bookId]) {
      bibleCache[bookId] = {};
    }

    bibleCache[bookId][chapter] = {
      chapter,
      verses,
    };

    console.log(
      `Fetched and cached ${verses.length} verses for ${bookName} ${chapter}`
    );

    return verses;
  } catch (error) {
    console.error(`Error fetching ${bookName} ${chapter}:`, error);
    throw error;
  }
}

export function getBook(bookName: string): Book | undefined {
  return BIBLE_BOOKS.find((b) => b.name === bookName || b.id === bookName);
}

export function getBookById(bookId: string): Book | undefined {
  return BIBLE_BOOKS.find((b) => b.id === bookId);
}

export function getOldTestamentBooks(): Book[] {
  return BIBLE_BOOKS.filter((b) => b.testament === "old");
}

export function getNewTestamentBooks(): Book[] {
  return BIBLE_BOOKS.filter((b) => b.testament === "new");
}

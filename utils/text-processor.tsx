/**
 * Text processing utilities for Bible text formatting and verse detection
 */

import { JSX } from "react";

/**
 * Convert Unicode escape sequences to proper characters
 */
export function decodeUnicodeEscapes(text: string): string {
  return text.replace(/\\u([\dA-Fa-f]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
}

/**
 * Normalize Bible text by handling special characters and formatting
 */
export function normalizeBibleText(text: string): string {
  let normalized = decodeUnicodeEscapes(text);

  // Replace common Bible formatting issues
  normalized = normalized
    .replace(/\\"/g, '"') // Replace escaped quotes
    .replace(/\\'/g, "'") // Replace escaped single quotes
    .replace(/\\n/g, "\n") // Replace escaped newlines
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();

  return normalized;
}

/**
 * Bible book names and their common abbreviations
 */
export const BIBLE_BOOK_NAMES = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Psalm",
  "Proverbs",
  "Ecclesiastes",
  "Song of Solomon",
  "Song of Songs",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation",
];

/**
 * Detect verse references in text and return them with positions
 */
export interface VerseReferenceMatch {
  book: string;
  chapter: number;
  verse: number;
  startIndex: number;
  endIndex: number;
  fullMatch: string;
}

export function detectVerseReferences(text: string): VerseReferenceMatch[] {
  const matches: VerseReferenceMatch[] = [];

  // Enhanced regex pattern for verse detection
  const versePattern =
    /\b([1-3]?\s?(?:[A-Z][a-z]+(?:\s+of\s+[A-Z][a-z]+)?))\s+(\d+)(?::(\d+(?:-\d+)?))?\b/g;

  let match;
  while ((match = versePattern.exec(text)) !== null) {
    const bookName = match[1].trim();
    const chapter = parseInt(match[2]);
    const verseStr = match[3] || "1"; // Default to verse 1 if not specified
    const verse = parseInt(verseStr.split("-")[0]); // Take first verse in range

    // Validate book name
    const normalizedBookName = normalizeBookName(bookName);
    if (BIBLE_BOOK_NAMES.includes(normalizedBookName)) {
      matches.push({
        book: normalizedBookName,
        chapter,
        verse,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        fullMatch: match[0],
      });
    }
  }

  return matches;
}

/**
 * Normalize book names to standard format
 */
export function normalizeBookName(bookName: string): string {
  const bookMap: Record<string, string> = {
    Psalm: "Psalms",
    "Song of Songs": "Song of Solomon",
    "1Sam": "1 Samuel",
    "2Sam": "2 Samuel",
    "1King": "1 Kings",
    "2King": "2 Kings",
    "1Chr": "1 Chronicles",
    "2Chr": "2 Chronicles",
    "1Cor": "1 Corinthians",
    "2Cor": "2 Corinthians",
    "1Thes": "1 Thessalonians",
    "2Thes": "2 Thessalonians",
    "1Tim": "1 Timothy",
    "2Tim": "2 Timothy",
    "1Pet": "1 Peter",
    "2Pet": "2 Peter",
    "1John": "1 John",
    "2John": "2 John",
    "3John": "3 John",
  };

  return bookMap[bookName] || bookName;
}

/**
 * Process text to make verse references clickable
 */
export function processTextWithVerseLinks(
  text: string,
  onVersePress: (book: string, chapter: number, verse: number) => void
): (string | JSX.Element)[] {
  const elements: (string | JSX.Element)[] = [];
  const references = detectVerseReferences(text);

  if (references.length === 0) {
    return [text];
  }

  let lastIndex = 0;

  references.forEach((ref, index) => {
    // Add text before the reference
    if (ref.startIndex > lastIndex) {
      elements.push(text.substring(lastIndex, ref.startIndex));
    }

    // Add the clickable reference
    elements.push(
      <Text
        key={`verse-${index}`}
        style={{ color: "#007AFF", fontWeight: "600" }}
        onPress={() => onVersePress(ref.book, ref.chapter, ref.verse)}
      >
        {ref.fullMatch}
      </Text>
    );

    lastIndex = ref.endIndex;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements;
}

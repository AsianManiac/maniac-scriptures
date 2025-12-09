// services/bible-service.ts - Enhanced with version switching
import { ALL_BIBLE_VERSIONS } from "@/constants/bible-versions-config";
import { BibleVersion, Verse, VerseReference } from "@/types/bible";
import { normalizeBibleText } from "@/utils/text-processor";
import { Directory, File, Paths } from "expo-file-system";

// Import all Bible versions statically
import akjv from "@/assets/bible/akjv.json";
import kjv from "@/assets/bible/kjv.json";
import web from "@/assets/bible/web.json";
// import amp from "@/assets/bible/amp.json";
// import asv from "@/assets/bible/asv.json";
// import esv from "@/assets/bible/esv.json";
// import gnv from "@/assets/bible/gnv.json";
// import mev from "@/assets/bible/mev.json";
// import niv from "@/assets/bible/niv.json";
// import nkjv from "@/assets/bible/nkjv.json";
// import nlt from "@/assets/bible/nlt.json";
// import nlv from "@/assets/bible/nlv.json";

// Available Bible versions
export const BIBLE_VERSIONS: BibleVersion[] = [
  {
    id: "akjv",
    name: "American King James Version",
    abbreviation: "AKJV",
    language: "English",
  },
  {
    id: "amp",
    name: "Amplified Bible",
    abbreviation: "AMP",
    language: "English",
  },
  {
    id: "asv",
    name: "American Standard Version",
    abbreviation: "ASV",
    language: "English",
  },
  {
    id: "esv",
    name: "English Standard Version",
    abbreviation: "ESV",
    language: "English",
  },
  { id: "gnv", name: "Geneva Bible", abbreviation: "GNV", language: "English" },
  {
    id: "kjv",
    name: "King James Version",
    abbreviation: "KJV",
    language: "English",
  },
  {
    id: "mev",
    name: "Modern English Version",
    abbreviation: "MEV",
    language: "English",
  },
  {
    id: "niv",
    name: "New International Version",
    abbreviation: "NIV",
    language: "English",
  },
  {
    id: "nkjv",
    name: "New King James Version",
    abbreviation: "NKJV",
    language: "English",
  },
  {
    id: "nlt",
    name: "New Living Translation",
    abbreviation: "NLT",
    language: "English",
  },
  {
    id: "nlv",
    name: "New Life Version",
    abbreviation: "NLV",
    language: "English",
  },
  {
    id: "web",
    name: "World English Bible",
    abbreviation: "WEB",
    language: "English",
  },
];

// Bible data structure type
export type BibleData = {
  [bookName: string]: {
    [chapter: number]: {
      [verse: number]: string;
    };
  };
};

// Static import map for all Bible versions
const BIBLE_DATA_MAP: Record<string, BibleData> = {
  akjv,
  kjv,
  web,
};

class BibleService {
  private cache: Map<string, BibleData> = new Map();
  private currentVersion: string = "kjv";

  // Define storage directory
  private versionsDir = new Directory(Paths.document, "bible_versions");

  constructor() {
    // Ensure directory exists on init
    if (!this.versionsDir.exists) {
      this.versionsDir.create();
    }
  }

  getVersion(versionId: string): BibleVersion | undefined {
    return ALL_BIBLE_VERSIONS.find((v) => v.id === versionId);
  }

  getDefaultVersion(): BibleVersion {
    return this.getVersion("kjv")!;
  }

  /**
   * Set the current Bible version
   */
  setCurrentVersion(versionId: string): void {
    if (this.getVersion(versionId)) {
      this.currentVersion = versionId;
    }
  }

  /**
   * Get the current Bible version
   */
  getCurrentVersion(): string {
    return this.currentVersion;
  }

  /**
   * Get all available Bible versions
   */
  getAllVersions(): BibleVersion[] {
    return ALL_BIBLE_VERSIONS;
  }

  /**
   * Check if a version is available locally (either static or downloaded)
   */
  isVersionAvailable(versionId: string): boolean {
    // 1. Check if it's static
    if (BIBLE_DATA_MAP[versionId]) return true;

    // 2. Check if file exists in storage
    const file = new File(this.versionsDir, `${versionId}.json`);
    return file.exists;
  }

  /**
   * Load a Bible version: Checks Cache -> File System -> Static Map
   */
  async loadVersion(versionId: string): Promise<BibleData> {
    // 1. Check RAM Cache
    if (this.cache.has(versionId)) {
      return this.cache.get(versionId)!;
    }

    let rawData: any = null;

    // 2. Check File System (Downloaded versions)
    const file = new File(this.versionsDir, `${versionId}.json`);

    if (file.exists) {
      console.log(`Loading ${versionId} from File System...`);
      try {
        const jsonString = file.textSync(); // or await file.text()
        rawData = JSON.parse(jsonString);
      } catch (e) {
        console.error(`Failed to parse ${versionId} from disk`, e);
        // If file is corrupt, maybe delete it?
        // file.delete();
      }
    }

    // 3. Check Static Map (Bundled versions)
    if (!rawData && BIBLE_DATA_MAP[versionId]) {
      console.log(`Loading ${versionId} from Static Assets...`);
      rawData = BIBLE_DATA_MAP[versionId];
    }

    if (!rawData) {
      throw new Error(
        `Bible version '${versionId}' not found locally. Please download it first.`
      );
    }

    // Process and normalize
    const processedData = this.processBibleData(rawData);

    // Cache
    this.cache.set(versionId, processedData);

    return processedData;
  }

  /**
   * Process Bible data to normalize all text
   */
  private processBibleData(data: BibleData): BibleData {
    const processed: BibleData = {};

    for (const [bookName, chapters] of Object.entries(data)) {
      processed[bookName] = {};

      for (const [chapterNum, verses] of Object.entries(chapters)) {
        const chapter = parseInt(chapterNum);
        processed[bookName][chapter] = {};

        for (const [verseNum, text] of Object.entries(verses)) {
          const verse = parseInt(verseNum);
          processed[bookName][chapter][verse] = normalizeBibleText(
            text as string
          );
        }
      }
    }

    return processed;
  }

  // New method to delete a downloaded version
  async deleteVersion(versionId: string): Promise<void> {
    // Prevent deleting static versions
    if (BIBLE_DATA_MAP[versionId]) {
      throw new Error("Cannot delete built-in Bible versions.");
    }

    const file = new File(this.versionsDir, `${versionId}.json`);
    if (file.exists) {
      file.delete();
      this.cache.delete(versionId); // Remove from RAM cache too
      console.log(`Deleted version ${versionId}`);
    }
  }

  /**
   * Preload a Bible version for faster access
   */
  async preloadVersion(versionId: string): Promise<void> {
    await this.loadVersion(versionId);
  }

  /**
   * Preload multiple versions for quick switching
   */
  async preloadVersions(versionIds: string[]): Promise<void> {
    await Promise.all(versionIds.map((id) => this.preloadVersion(id)));
  }

  /**
   * Get a specific verse with proper text formatting
   */
  async getVerse(
    bookName: string,
    chapter: number,
    verse: number,
    versionId?: string
  ): Promise<Verse | null> {
    const version = versionId || this.currentVersion;

    try {
      const bibleData = await this.loadVersion(version);
      const bookData = bibleData[bookName];

      if (!bookData) return null;

      const chapterData = bookData[chapter];
      if (!chapterData) return null;

      const verseText = chapterData[verse];
      if (!verseText) return null;

      return {
        book: bookName,
        chapter,
        verse,
        text: verseText,
        version,
      };
    } catch (error) {
      console.error(
        `Error getting verse ${bookName} ${chapter}:${verse} from ${version}:`,
        error
      );
      return null;
    }
  }

  /**
   * Get an entire chapter with proper text formatting
   */
  async getChapter(
    bookName: string,
    chapter: number,
    versionId?: string
  ): Promise<Verse[]> {
    const version = versionId || this.currentVersion;

    try {
      const bibleData = await this.loadVersion(version);
      const bookData = bibleData[bookName];

      if (!bookData) return [];

      const chapterData = bookData[chapter];
      if (!chapterData) return [];

      const verses: Verse[] = [];

      // Convert verse object to array
      Object.entries(chapterData).forEach(([verseNum, text]) => {
        const verseNumber = parseInt(verseNum);
        if (!isNaN(verseNumber) && text) {
          verses.push({
            book: bookName,
            chapter,
            verse: verseNumber,
            text: text as string,
            version,
          });
        }
      });

      // Sort by verse number
      return verses.sort((a, b) => a.verse - b.verse);
    } catch (error) {
      console.error(
        `Error getting chapter ${bookName} ${chapter} from ${version}:`,
        error
      );
      return [];
    }
  }

  /**
   * Switch to a different Bible version and get the same chapter
   */
  async switchVersion(
    bookName: string,
    chapter: number,
    newVersionId: string
  ): Promise<Verse[]> {
    this.setCurrentVersion(newVersionId);
    return this.getChapter(bookName, chapter, newVersionId);
  }

  /**
   * Search for text in the Bible
   */
  async search(
    query: string,
    versionId: string = "kjv",
    options: {
      caseSensitive?: boolean;
      wholeWord?: boolean;
      maxResults?: number;
    } = {}
  ): Promise<Verse[]> {
    const {
      caseSensitive = false,
      wholeWord = false,
      maxResults = 100,
    } = options;

    try {
      const bibleData = await this.loadVersion(versionId);
      const results: Verse[] = [];
      const searchTerm = caseSensitive ? query : query.toLowerCase();

      for (const [bookName, chapters] of Object.entries(bibleData)) {
        for (const [chapterNum, verses] of Object.entries(chapters)) {
          const chapter = parseInt(chapterNum);

          for (const [verseNum, text] of Object.entries(verses)) {
            const verse = parseInt(verseNum);
            const verseText = text as string;
            const searchText = caseSensitive
              ? verseText
              : verseText.toLowerCase();

            let found = false;

            if (wholeWord) {
              const words = searchText.split(/\s+/);
              found = words.some((word) => word === searchTerm);
            } else {
              found = searchText.includes(searchTerm);
            }

            if (found) {
              results.push({
                book: bookName,
                chapter,
                verse,
                text: verseText,
                version: versionId,
              });

              if (results.length >= maxResults) {
                return results;
              }
            }
          }
        }
      }

      return results;
    } catch (error) {
      console.error(`Error searching in version ${versionId}:`, error);
      return [];
    }
  }

  /**
   * Get multiple verses by reference
   */
  async getVerses(
    references: VerseReference[],
    versionId: string = "kjv"
  ): Promise<Verse[]> {
    const verses: Verse[] = [];

    for (const ref of references) {
      const verse = await this.getVerse(
        ref.book,
        ref.chapter,
        ref.verse,
        ref.version || versionId
      );
      if (verse) {
        verses.push(verse);
      }
    }

    return verses;
  }

  /**
   * Get available books for a version
   */
  async getBooks(versionId: string = "kjv"): Promise<string[]> {
    try {
      const bibleData = await this.loadVersion(versionId);
      return Object.keys(bibleData);
    } catch (error) {
      console.error(`Error getting books for version ${versionId}:`, error);
      return [];
    }
  }

  /**
   * Get chapters for a specific book
   */
  async getChapters(
    bookName: string,
    versionId: string = "kjv"
  ): Promise<number[]> {
    try {
      const bibleData = await this.loadVersion(versionId);
      const bookData = bibleData[bookName];

      if (!bookData) return [];

      return Object.keys(bookData)
        .map(Number)
        .filter((num) => !isNaN(num))
        .sort((a, b) => a - b);
    } catch (error) {
      console.error(
        `Error getting chapters for ${bookName} in version ${versionId}:`,
        error
      );
      return [];
    }
  }

  /**
   * Get verses for a specific chapter
   */
  async getVerseNumbers(
    bookName: string,
    chapter: number,
    versionId: string = "kjv"
  ): Promise<number[]> {
    try {
      const bibleData = await this.loadVersion(versionId);
      const bookData = bibleData[bookName];

      if (!bookData) return [];

      const chapterData = bookData[chapter];
      if (!chapterData) return [];

      return Object.keys(chapterData)
        .map(Number)
        .filter((num) => !isNaN(num))
        .sort((a, b) => a - b);
    } catch (error) {
      console.error(
        `Error getting verses for ${bookName} ${chapter} in version ${versionId}:`,
        error
      );
      return [];
    }
  }

  /**
   * Clear cache for a specific version or all versions
   */
  clearCache(versionId?: string): void {
    if (versionId) {
      this.cache.delete(versionId);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get memory usage information (for debugging)
   */
  getCacheInfo(): { cachedVersions: number; totalVersions: number } {
    return {
      cachedVersions: this.cache.size,
      totalVersions: BIBLE_VERSIONS.length,
    };
  }
}

// Export a singleton instance
export const bibleService = new BibleService();

// Preload the default version on startup
bibleService.preloadVersion("kjv").catch(console.error);

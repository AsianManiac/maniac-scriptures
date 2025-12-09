import {
  ALL_BIBLE_VERSIONS,
  getGoogleDriveDownloadUrl,
} from "@/constants/bible-versions-config";
import { bibleService } from "@/services/bible-service";
import {
  Collection,
  Favorite,
  Highlight,
  Note,
  ReadingHistory,
  UserSettings,
  VerseReference,
} from "@/types/bible";
import { clearBibleCache } from "@/utils/bible-api";
import { Directory, File, Paths } from "expo-file-system";
import { createDownloadResumable } from "expo-file-system/legacy";
import * as ExpoSecureStore from "expo-secure-store";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface DownloadState {
  progress: number; // 0 to 1
  totalBytes: number;
}

interface BibleState {
  highlights: Highlight[];
  notes: Note[];
  favorites: Favorite[];
  collections: Collection[];
  settings: UserSettings;
  history: ReadingHistory[];
  currentBook: string;
  currentChapter: number;
  targetVerse: number | null;
  clearCache: () => Promise<void>;
  resetAppData: () => void;
  setDefaultVersion: (versionId: string) => void;
  preloadVersion: (versionId: string) => Promise<void>;
  addHighlight: (highlight: Highlight) => void;
  removeHighlight: (id: string) => void;
  getHighlightForVerse: (ref: VerseReference) => Highlight | undefined;
  addNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  getNotesForVerse: (ref: VerseReference) => Note[];
  addFavorite: (favorite: Favorite) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (ref: VerseReference) => boolean;
  getFavoriteId: (ref: VerseReference) => string | undefined;
  addCollection: (collection: Collection) => void;
  updateCollection: (collection: Collection) => void;
  deleteCollection: (id: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  addHistory: (item: ReadingHistory) => void;
  setCurrentBook: (book: string) => void;
  setCurrentChapter: (chapter: number) => void;
  setTargetVerse: (verse: number | null) => void;
  navigateToVerse: (book: string, chapter: number, verse: number) => void;

  downloadingVersions: Record<string, boolean>; // track loading state
  downloadedVersions: string[]; // list of IDs available on disk
  downloadVersion: (versionId: string) => Promise<void>;
  deleteVersion: (versionId: string) => Promise<void>;
  checkDownloadedVersions: () => Promise<void>;

  // New Download State
  downloadProgress: Record<string, DownloadState>;
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: "system",
  fontSize: 17,
  lineSpacing: 1.5,
  notifications: true,
  defaultBibleVersion: "kjv", // Default to KJV
  themeVariant: "",
};

const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      if (Platform.OS === "web") {
        return ExpoSecureStore.getItem(name);
      }
      return await SecureStore.getItemAsync(name);
    } catch (error) {
      console.error("Error getting item from storage:", error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === "web") {
        await ExpoSecureStore.setItem(name, value);
      } else {
        await SecureStore.setItemAsync(name, value);
      }
    } catch (error) {
      console.error("Error setting item in storage:", error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      if (Platform.OS === "web") {
        await ExpoSecureStore.deleteItemAsync(name);
      } else {
        await SecureStore.deleteItemAsync(name);
      }
    } catch (error) {
      console.error("Error removing item from storage:", error);
    }
  },
};

export const useBibleStore = create<BibleState>()(
  persist(
    (set, get) => ({
      highlights: [],
      notes: [],
      favorites: [],
      collections: [],
      settings: DEFAULT_SETTINGS,
      history: [],
      currentBook: "John",
      currentChapter: 3,
      targetVerse: null,

      downloadingVersions: {},
      downloadProgress: {},
      downloadedVersions: [], // We'll populate this on mount

      // Check which files exist on disk
      checkDownloadedVersions: async () => {
        const versionsDir = new Directory(Paths.document, "bible_versions");
        if (!versionsDir.exists) versionsDir.create();

        const files = versionsDir.list(); // Returns (File | Directory)[]

        // Filter only Files and get their names (e.g. "niv.json")
        const existingIds = files
          .filter((item) => item instanceof File && item.name.endsWith(".json"))
          .map((file) => file.name.replace(".json", ""));

        // Also add static versions to this list so UI knows they are "downloaded"
        const staticIds = ALL_BIBLE_VERSIONS.filter((v) => v.isStatic).map(
          (v) => v.id
        );

        const allAvailable = [...new Set([...staticIds, ...existingIds])];

        set({ downloadedVersions: allAvailable });
      },

      downloadVersion: async (versionId: string) => {
        const version = ALL_BIBLE_VERSIONS.find((v) => v.id === versionId);
        if (!version || !version.googleDriveUrl) return;

        console.log(`Starting download for ${version.name}...`);

        // Set loading state
        set((state) => ({
          downloadingVersions: {
            ...state.downloadingVersions,
            [versionId]: true,
          },
          downloadProgress: {
            ...state.downloadProgress,
            [versionId]: { progress: 0, totalBytes: 0 },
          },
        }));

        try {
          // Prepare directory
          const versionsDir = new Directory(Paths.document, "bible_versions");
          if (!versionsDir.exists) versionsDir.create();

          // Prepare File destination
          const destinationFile = new File(versionsDir, `${versionId}.json`);

          // Convert View URL to Download URL
          const downloadUrl = getGoogleDriveDownloadUrl(version.googleDriveUrl);

          // Use createDownloadResumable for progress updates
          const downloadResumable = createDownloadResumable(
            downloadUrl,
            destinationFile.uri,
            {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              },
            },
            (downloadProgress) => {
              const progress =
                downloadProgress.totalBytesWritten /
                downloadProgress.totalBytesExpectedToWrite;

              set((state) => ({
                downloadProgress: {
                  ...state.downloadProgress,
                  [versionId]: {
                    progress: progress,
                    totalBytes: downloadProgress.totalBytesExpectedToWrite,
                  },
                },
              }));
            }
          );
          const result = await downloadResumable.downloadAsync();

          if (result && result.uri) {
            // Validation
            const fileContent = destinationFile.textSync();
            if (fileContent.trim().startsWith("<")) {
              destinationFile.delete();
              throw new Error("Google Drive permission error.");
            }

            try {
              JSON.parse(fileContent);

              set((state) => ({
                downloadedVersions: [...state.downloadedVersions, versionId],
                downloadingVersions: {
                  ...state.downloadingVersions,
                  [versionId]: false,
                },
                downloadProgress: {
                  ...state.downloadProgress,
                  [versionId]: {
                    progress: 1,
                    totalBytes:
                      state.downloadProgress[versionId]?.totalBytes || 0,
                  },
                },
              }));

              await bibleService.preloadVersion(versionId);
            } catch (jsonError) {
              destinationFile.delete();
              throw new Error("Downloaded file is not valid JSON.");
            }
          }
        } catch (error) {
          console.error(`Download failed for ${versionId}`, error);
          set((state) => ({
            downloadingVersions: {
              ...state.downloadingVersions,
              [versionId]: false,
            },
            downloadProgress: {
              ...state.downloadProgress,
              [versionId]: { progress: 0, totalBytes: 0 },
            }, // Reset on fail
          }));
          throw error;
        }
      },

      deleteVersion: async (versionId: string) => {
        try {
          await bibleService.deleteVersion(versionId);

          set((state) => ({
            downloadedVersions: state.downloadedVersions.filter(
              (id) => id !== versionId
            ),
            downloadProgress: {
              ...state.downloadProgress,
              [versionId]: { progress: 0, totalBytes: 0 },
            },
          }));

          // If deleted version was active, switch to default
          if (get().settings.defaultBibleVersion === versionId) {
            get().setDefaultVersion("kjv");
          }
        } catch (error) {
          console.error("Delete failed", error);
        }
      },

      setDefaultVersion: (versionId: string) => {
        console.log("Setting default Bible version:", versionId);
        set((state) => ({
          settings: { ...state.settings, defaultBibleVersion: versionId },
        }));
      },

      preloadVersion: async (versionId: string) => {
        console.log("Preloading Bible version:", versionId);
        await bibleService.preloadVersion(versionId);
      },

      addHighlight: (highlight) => {
        console.log("Adding highlight:", highlight);
        set((state) => ({
          highlights: [...state.highlights, highlight],
        }));
      },

      removeHighlight: (id) => {
        console.log("Removing highlight:", id);
        set((state) => ({
          highlights: state.highlights.filter((h) => h.id !== id),
        }));
      },

      getHighlightForVerse: (ref) => {
        return get().highlights.find(
          (h) =>
            h.reference.book === ref.book &&
            h.reference.chapter === ref.chapter &&
            h.reference.verse === ref.verse
        );
      },

      addNote: (note) => {
        console.log("Adding note:", note);
        set((state) => ({
          notes: [...state.notes, note],
        }));
      },

      updateNote: (note) => {
        console.log("Updating note:", note);
        set((state) => ({
          notes: state.notes.map((n) => (n.id === note.id ? note : n)),
        }));
      },

      deleteNote: (id) => {
        console.log("Deleting note:", id);
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        }));
      },

      getNotesForVerse: (ref) => {
        return get().notes.filter(
          (n) =>
            n.reference &&
            n.reference.book === ref.book &&
            n.reference.chapter === ref.chapter &&
            n.reference.verse === ref.verse
        );
      },

      addFavorite: (favorite) => {
        console.log("Adding favorite:", favorite);
        set((state) => ({
          favorites: [...state.favorites, favorite],
        }));
      },

      removeFavorite: (id) => {
        console.log("Removing favorite:", id);
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        }));
      },

      isFavorite: (ref) => {
        return get().favorites.some(
          (f) =>
            f.reference.book === ref.book &&
            f.reference.chapter === ref.chapter &&
            f.reference.verse === ref.verse
        );
      },

      getFavoriteId: (ref) => {
        return get().favorites.find(
          (f) =>
            f.reference.book === ref.book &&
            f.reference.chapter === ref.chapter &&
            f.reference.verse === ref.verse
        )?.id;
      },

      addCollection: (collection) => {
        console.log("Adding collection:", collection);
        set((state) => ({
          collections: [...state.collections, collection],
        }));
      },

      updateCollection: (collection) => {
        console.log("Updating collection:", collection);
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collection.id ? collection : c
          ),
        }));
      },

      deleteCollection: (id) => {
        console.log("Deleting collection:", id);
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== id),
        }));
      },

      updateSettings: (newSettings) => {
        console.log("Updating settings:", newSettings);
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      addHistory: (item) => {
        console.log("Adding history:", item);
        set((state) => ({
          history: [item, ...state.history.slice(0, 49)],
        }));
      },

      setCurrentBook: (book) => {
        console.log("Setting current book:", book);
        set({ currentBook: book });
      },

      setCurrentChapter: (chapter) => {
        console.log("Setting current chapter:", chapter);
        set({ currentChapter: chapter });
      },

      setTargetVerse: (verse) => {
        console.log("Setting target verse:", verse);
        set({ targetVerse: verse });
      },

      navigateToVerse: (book, chapter, verse) => {
        console.log("Navigating to verse:", { book, chapter, verse });
        set({
          currentBook: book,
          currentChapter: chapter,
          targetVerse: verse,
        });
      },
      clearCache: async () => {
        try {
          clearBibleCache();
          const storageDir = new Directory(Paths.document, "bible_versions");
          if (storageDir.exists) {
            storageDir.delete(); // Clear downloaded versions
            storageDir.create(); // Recreate empty
          }
          console.log("Cache cleared");
        } catch (error) {
          console.error("Clear cache failed:", error);
        }
      },
      resetAppData: () => {
        // Reset to defaults
        set({
          highlights: [],
          notes: [],
          favorites: [],
          collections: [],
          settings: DEFAULT_SETTINGS,
          history: [],
          currentBook: "Genesis",
          currentChapter: 3,
          targetVerse: null,
          downloadingVersions: {},
          downloadProgress: {},
        });
        // Clear storage
        SecureStore.deleteItemAsync("bible-storage");
        console.log("App data reset");
      },
    }),
    {
      name: "bible-storage",
      storage: createJSONStorage(() => secureStorage),
      onRehydrateStorage: () => (state) => {
        // When store rehydrates, check files
        state?.checkDownloadedVersions();
      },
    }
  )
);

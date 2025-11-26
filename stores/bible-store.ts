import {
  Collection,
  Favorite,
  Highlight,
  Note,
  ReadingHistory,
  UserSettings,
  VerseReference,
} from "@/types/bible";
import * as ExpoSecureStore from "expo-secure-store";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: "light",
  fontSize: 17,
  lineSpacing: 1.5,
  notifications: true,
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
    }),
    {
      name: "bible-storage",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);

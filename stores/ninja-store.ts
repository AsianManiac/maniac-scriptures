import { create } from "zustand";

interface WordObj {
  id: string;
  text: string;
  lane: number;
}

interface NinjaState {
  score: number;
  hearts: number;
  activeWords: WordObj[];
  targetVerse: string[];
  nextIndex: number; // The index of the word we need to slice next

  startGame: (verse: string) => void;
  spawnWord: () => void;
  handleSlice: (id: string, text: string) => boolean; // returns true if correct
  handleMiss: (id: string) => void;
  reset: () => void;
}

export const useNinjaStore = create<NinjaState>((set, get) => ({
  score: 0,
  hearts: 3,
  activeWords: [],
  targetVerse: [],
  nextIndex: 0,

  reset: () => set({ score: 0, hearts: 3, activeWords: [], nextIndex: 0 }),

  startGame: (verse) => {
    set({
      targetVerse: verse.split(" "),
      activeWords: [],
      score: 0,
      hearts: 3,
      nextIndex: 0,
    });
  },

  spawnWord: () => {
    const { targetVerse, nextIndex, activeWords } = get();
    // Logic: 60% chance to spawn the CORRECT next word, 40% chance for a random distractor
    // For simplicity, let's just spawn the remaining words randomly
    const correctWord = targetVerse[nextIndex];
    if (!correctWord) return;

    const newWord: WordObj = {
      id: Math.random().toString(),
      text: correctWord, // In real game, mix distractors here
      lane: Math.floor(Math.random() * 3), // 0, 1, 2
    };

    set({ activeWords: [...activeWords, newWord] });
  },

  handleSlice: (id, text) => {
    const { targetVerse, nextIndex, activeWords, score } = get();
    const correctWord = targetVerse[nextIndex];

    // Remove from screen regardless
    set({ activeWords: activeWords.filter((w) => w.id !== id) });

    if (text === correctWord) {
      set({ score: score + 10, nextIndex: nextIndex + 1 });
      return true;
    } else {
      set((state) => ({ hearts: state.hearts - 1 }));
      return false;
    }
  },

  handleMiss: (id) => {
    set((state) => ({
      activeWords: state.activeWords.filter((w) => w.id !== id),
    }));
  },
}));

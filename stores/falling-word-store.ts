import { bibleService } from "@/services/bible-service";
import { BIBLE_BOOKS } from "@/utils/bible-api";
import { secureStorage } from "@/utils/storage-adapter";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface WordObj {
  id: string;
  text: string;
  lane: number;
  isCorrect: boolean;
}

interface FallingWordState {
  status: "idle" | "countdown" | "playing" | "paused" | "won" | "lost";
  score: number;
  highScore: number;
  lives: number;
  speedMultiplier: number; // 1 = Normal, 1.5 = Fast, 2 = Crazy

  targetVerseText: string[];
  targetReference: string;

  nextWordIndex: number;
  shownHintIndex: number;
  activeWords: WordObj[];

  setSpeed: (speed: number) => void;
  startGameSetup: () => Promise<void>; // Prepares game, goes to countdown
  startPlaying: () => void; // Actually starts the game loop
  pauseGame: () => void;
  resumeGame: () => void;
  quitGame: () => void;
  spawnTick: () => void;
  handleSelectWord: (
    id: string,
    text: string,
    isCorrect: boolean
  ) => { correct: boolean; gameOver: boolean };
  handleMissedWord: (id: string, isCorrect: boolean) => { gameOver: boolean };
}

const COMMON_DISTRACTORS = [
  "and",
  "the",
  "for",
  "god",
  "love",
  "sin",
  "holy",
  "faith",
  "lord",
  "jesus",
  "christ",
  "spirit",
  "grace",
];

export const useFallingWordStore = create<FallingWordState>()(
  persist(
    (set, get) => ({
      status: "idle",
      score: 0,
      highScore: 0,
      lives: 3,
      speedMultiplier: 1.0,
      targetVerseText: [],
      targetReference: "",
      nextWordIndex: 0,
      shownHintIndex: 0,
      activeWords: [],

      setSpeed: (speed) => set({ speedMultiplier: speed }),

      startGameSetup: async () => {
        set({
          status: "idle", // Temporarily idle while loading
          score: 0,
          lives: 3,
          activeWords: [],
          nextWordIndex: 0,
        });

        try {
          // Get Data
          const randomBook =
            BIBLE_BOOKS[Math.floor(Math.random() * BIBLE_BOOKS.length)];
          const randomChapter =
            Math.floor(Math.random() * randomBook.chapters) + 1;
          const verses = await bibleService.getChapter(
            randomBook.name,
            randomChapter,
            "kjv"
          );

          if (!verses || verses.length === 0) throw new Error("No verses");

          const suitableVerses = verses.filter((v) => {
            const count = v.text.split(" ").length;
            return count > 8 && count < 35;
          });

          const selectedVerse =
            suitableVerses.length > 0
              ? suitableVerses[
                  Math.floor(Math.random() * suitableVerses.length)
                ]
              : verses[0];

          const cleanText = selectedVerse.text
            .replace(/[^\w\s]|_/g, "")
            .replace(/\s+/g, " ")
            .trim();

          const words = cleanText.split(" ");
          const hintCount = Math.max(3, Math.floor(words.length * 0.25));

          set({
            targetVerseText: words,
            targetReference: `${selectedVerse.book} ${selectedVerse.chapter}:${selectedVerse.verse}`,
            nextWordIndex: hintCount,
            shownHintIndex: hintCount,
            status: "countdown", // Go to countdown screen
          });
        } catch (e) {
          console.error("Start Error", e);
          set({ status: "idle" });
        }
      },

      startPlaying: () => set({ status: "playing" }),
      pauseGame: () => set({ status: "paused" }),
      resumeGame: () => set({ status: "playing" }),
      quitGame: () => set({ status: "idle", activeWords: [] }),

      spawnTick: () => {
        const { status, targetVerseText, nextWordIndex, activeWords } = get();
        if (status !== "playing") return;

        if (
          nextWordIndex >= targetVerseText.length &&
          activeWords.length === 0
        ) {
          const { score, highScore } = get();
          set({ status: "won", highScore: Math.max(score, highScore) });
          return;
        }

        if (nextWordIndex >= targetVerseText.length) return;

        const correctWordText = targetVerseText[nextWordIndex];
        const isCorrectAlreadyFalling = activeWords.some(
          (w) => w.text === correctWordText && w.isCorrect
        );

        // Increased spawn chance for correct word to keep game moving
        const shouldSpawnCorrect =
          !isCorrectAlreadyFalling && Math.random() > 0.25;

        let newWord: WordObj;

        if (shouldSpawnCorrect) {
          newWord = {
            id: Math.random().toString(),
            text: correctWordText,
            lane: Math.floor(Math.random() * 3),
            isCorrect: true,
          };
        } else {
          // Smart Distractors: sometimes pick words from the verse itself that are NOT the next word
          const useVerseDistractor = Math.random() > 0.4;
          let text = "";

          if (useVerseDistractor) {
            const randomVerseWord =
              targetVerseText[
                Math.floor(Math.random() * targetVerseText.length)
              ];
            text = randomVerseWord;
          } else {
            text =
              COMMON_DISTRACTORS[
                Math.floor(Math.random() * COMMON_DISTRACTORS.length)
              ];
          }

          if (text.toLowerCase() === correctWordText.toLowerCase())
            text = "Selah";

          newWord = {
            id: Math.random().toString(),
            text: text,
            lane: Math.floor(Math.random() * 3),
            isCorrect: false,
          };
        }

        set({ activeWords: [...activeWords, newWord] });
      },

      handleSelectWord: (id, text, isCorrect) => {
        const {
          activeWords,
          nextWordIndex,
          score,
          lives,
          targetVerseText,
          highScore,
        } = get();

        set({ activeWords: activeWords.filter((w) => w.id !== id) });

        if (isCorrect) {
          const expected = targetVerseText[nextWordIndex];
          if (text === expected) {
            const newIndex = nextWordIndex + 1;
            const newScore = score + 10;
            const won = newIndex >= targetVerseText.length;

            set({
              score: newScore,
              nextWordIndex: newIndex,
              status: won ? "won" : "playing",
              highScore: won ? Math.max(newScore, highScore) : highScore,
            });
            return { correct: true, gameOver: false };
          }
        }

        const newLives = lives - 1;
        set({ lives: newLives, status: newLives <= 0 ? "lost" : "playing" });
        return { correct: false, gameOver: newLives <= 0 };
      },

      handleMissedWord: (id, isCorrect) => {
        const { activeWords, lives } = get();
        set({ activeWords: activeWords.filter((w) => w.id !== id) });

        if (isCorrect) {
          const newLives = lives - 1;
          set({ lives: newLives, status: newLives <= 0 ? "lost" : "playing" });
          return { gameOver: newLives <= 0 };
        }
        return { gameOver: false };
      },
    }),
    {
      name: "falling-word-storage",
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        highScore: state.highScore,
        speedMultiplier: state.speedMultiplier,
      }),
    }
  )
);

import { TRIVIA_QUESTIONS, TriviaQuestion } from "@/data/trivia-data";
import { secureStorage } from "@/utils/storage-adapter";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TriviaState {
  questions: TriviaQuestion[];
  currentIndex: number;
  score: number;
  highScore: number;
  streak: number;
  lives: number;
  gameOver: boolean;
  selectedAnswerIndex: number | null; // null if waiting
  isCorrect: boolean | null; // for animation

  startTrivia: () => void;
  selectAnswer: (index: number) => void;
  nextQuestion: () => void;
  reset: () => void;
}

export const useTriviaStore = create<TriviaState>()(
  persist(
    (set, get) => ({
      questions: [],
      currentIndex: 0,
      score: 0,
      highScore: 0,
      streak: 0,
      lives: 3,
      gameOver: false,
      selectedAnswerIndex: null,
      isCorrect: null,

      startTrivia: () => {
        // Shuffle questions
        const shuffled = [...TRIVIA_QUESTIONS].sort(() => 0.5 - Math.random());
        set({
          questions: shuffled,
          currentIndex: 0,
          score: 0,
          highScore: 0,
          streak: 0,
          lives: 3,
          gameOver: false,
          selectedAnswerIndex: null,
          isCorrect: null,
        });
      },

      selectAnswer: (index) => {
        const { questions, currentIndex, streak, score, lives } = get();
        const currentQ = questions[currentIndex];

        if (get().selectedAnswerIndex !== null) return; // Already answered

        const correct = index === currentQ.correctIndex;

        set({
          selectedAnswerIndex: index,
          isCorrect: correct,
          streak: correct ? streak + 1 : 0,
          score: correct ? score + 10 * (1 + streak * 0.1) : score, // Streak multiplier
          lives: correct ? lives : lives - 1,
          gameOver: !correct && lives - 1 <= 0,
        });
      },

      nextQuestion: () => {
        const { currentIndex, questions, gameOver } = get();
        if (gameOver) return;

        if (currentIndex < questions.length - 1) {
          set({
            currentIndex: currentIndex + 1,
            selectedAnswerIndex: null,
            isCorrect: null,
          });
        } else {
          set({ gameOver: true }); // Finished all questions
        }
      },

      reset: () => {
        get().startTrivia();
      },
    }),
    {
      name: "trivia-storage",
      storage: createJSONStorage(() => secureStorage), // UPDATED
      partialize: (state) => ({ highScore: state.highScore }),
    }
  )
);

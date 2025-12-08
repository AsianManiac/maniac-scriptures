import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

// Secure Store Adapter for Zustand
const secureStorage = {
  getItem: async (name: string) => {
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  },
};

interface InsightState {
  seenIds: string[];
  favorites: string[];
  xp: number;
  markAsSeen: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addXp: (amount: number) => void;
}

export const useInsightStore = create<InsightState>()(
  persist(
    (set) => ({
      seenIds: [],
      favorites: [],
      xp: 0,
      markAsSeen: (id) => set((state) => {
        if (state.seenIds.includes(id)) return state;
        return { seenIds: [...state.seenIds, id], xp: state.xp + 10 };
      }),
      toggleFavorite: (id) => set((state) => {
        const isFav = state.favorites.includes(id);
        return {
          favorites: isFav 
            ? state.favorites.filter(f => f !== id)
            : [...state.favorites, id]
        };
      }),
      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
    }),
    {
      name: 'biblio-insight-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
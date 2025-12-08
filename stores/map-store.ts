import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

type MapMode = 'MODERN' | 'ANCIENT';

interface MapState {
  discoveredLocations: string[]; // IDs of places visited
  currentMode: MapMode;
  setMode: (mode: MapMode) => void;
  unlockLocation: (id: string) => void;
}

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      discoveredLocations: [],
      currentMode: 'ANCIENT',
      setMode: (mode) => set({ currentMode: mode }),
      unlockLocation: (id) =>
        set((state) => ({
          discoveredLocations: [...state.discoveredLocations, id],
        })),
    }),
    {
      name: 'bible-map-storage',
      storage: createJSONStorage(() => ({
        getItem: SecureStore.getItemAsync,
        setItem: SecureStore.setItemAsync,
        removeItem: SecureStore.deleteItemAsync,
      })),
    }
  )
);
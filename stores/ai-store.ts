// stores/ai-store.ts
import { sanitizeKey } from "@/utils/lib";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AiState {
  cache: Record<string, string>;
  cacheResult: (key: string, value: string) => Promise<void>;
  getCachedResult: (key: string) => Promise<string | null>;
  clearCache: () => Promise<void>;
}

export const useAiStore = create<AiState>()(
  persist(
    (set, get) => ({
      cache: {},

      cacheResult: async (key, value) => {
        const sanitizedKey = sanitizeKey(key);
        const secureKey = `ai_${sanitizedKey}`;

        // Save to in-memory cache (fast access)
        set((state) => ({
          cache: { ...state.cache, [key]: value },
        }));

        // Save to SecureStore in background (fire-and-forget)
        SecureStore.setItemAsync(secureKey, value).catch((err) =>
          console.warn("SecureStore write failed:", err)
        );
      },

      getCachedResult: async (key) => {
        // 1. Check in-memory cache first (fastest)
        const inMemory = get().cache[key];
        if (inMemory) return inMemory;

        // 2. Fallback to SecureStore with sanitized key
        const sanitizedKey = sanitizeKey(key);
        const secureKey = `ai_${sanitizedKey}`;

        try {
          const stored = await SecureStore.getItemAsync(secureKey);
          if (stored) {
            // Restore to in-memory cache for future quick access
            set((state) => ({
              cache: { ...state.cache, [key]: stored },
            }));
          }
          return stored;
        } catch (err) {
          console.warn("SecureStore read failed:", err);
          return null;
        }
      },

      clearCache: async () => {
        set({ cache: {} });
        // Optional: You could delete all keys starting with "ai_" but it's overkill
        // SecureStore doesn't provide bulk delete easily.
      },
    }),
    {
      name: "ai-cache-v2", // Changed name to force migration
      version: 2,
      storage: createJSONStorage(() => ({
        getItem: async (name: string) => {
          try {
            return await SecureStore.getItemAsync(name);
          } catch {
            return null;
          }
        },
        setItem: async (name: string, value: string) => {
          try {
            await SecureStore.setItemAsync(name, value);
          } catch (err) {
            console.warn("SecureStore persist failed:", err);
          }
        },
        removeItem: async (name: string) => {
          try {
            await SecureStore.deleteItemAsync(name);
          } catch {}
        },
      })),
      // Optional migration in case old corrupted data exists
      migrate: async (persistedState: any, version) => {
        if (version < 2) {
          // Fresh start – old data likely corrupted anyway
          return { cache: {} };
        }
        return persistedState;
      },
    }
  )
);

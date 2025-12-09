import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { StateStorage } from "zustand/middleware";

// Secure Store Adapter for Zustand
export const secureStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (Platform.OS === "web") {
      return localStorage.getItem(name);
    }
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (Platform.OS === "web") {
      localStorage.setItem(name, value);
    } else {
      await SecureStore.setItemAsync(name, value);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    if (Platform.OS === "web") {
      localStorage.removeItem(name);
    } else {
      await SecureStore.deleteItemAsync(name);
    }
  },
};

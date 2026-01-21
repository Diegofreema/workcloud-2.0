import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Href } from 'expo-router';

type PathnameState = {
  lastPathname: Href | null;
  setLastPathname: (path: Href) => void;
  reset: () => void;
};

export const usePathnameStore = create<PathnameState>()(
  persist(
    (set) => ({
      lastPathname: null,
      setLastPathname: (path) => set({ lastPathname: path }),
      reset: () => set({ lastPathname: null }),
    }),
    {
      name: 'last-pathname',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);

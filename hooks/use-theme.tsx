import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Store = {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
};

export const useTheme = create<Store>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () =>
        set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
    }),
    {
      name: 'theme',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

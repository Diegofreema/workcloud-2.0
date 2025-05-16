import { getItem, setItem } from 'expo-secure-store';
import { create } from 'zustand';

type DarkModeState = {
  darkMode: 'dark' | 'light';
  toggleDarkMode: () => void;
  // getDarkMode: () => void;
};

const darkMode: 'light' | 'dark' = (getItem('darkMode') as 'light' | 'dark') || 'light';
export const useDarkMode = create<DarkModeState>((set) => ({
  darkMode,
  toggleDarkMode: () => {
    set((state) => {
      const newDarkMode = state.darkMode === 'light' ? 'dark' : 'light';
      setItem('darkMode', newDarkMode);
      return { darkMode: newDarkMode };
    });
  },
  // getDarkMode: () => {
  //  const darkMode: 'light' | 'dark' =
  //    (getItem('darkMode') as 'light' | 'dark') || 'light';
  // }
}));

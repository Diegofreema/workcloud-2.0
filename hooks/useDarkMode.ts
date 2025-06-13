import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type DarkModeState = {
  darkMode: "dark" | "light";
  toggleDarkMode: () => void;
  // getDarkMode: () => void;
};

export const useDarkMode = create<DarkModeState>()(
  persist(
    (set) => ({
      darkMode: "light",
      toggleDarkMode: () => {
        set((state) => {
          const newDarkMode = state.darkMode === "light" ? "dark" : "light";

          return { darkMode: newDarkMode };
        });
      },
    }),
    {
      name: "darkMode",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

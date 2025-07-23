import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import { persist, createJSONStorage } from 'zustand/middleware';

type State = {
  isFirstTime: boolean;
  setIsFirstTime: () => void;
};

export const useIsFirstTime = create<State>()(
  persist(
    (set) => ({
      isFirstTime: true,
      setIsFirstTime: () => set({ isFirstTime: false }),
    }),
    {
      name: 'is-first-time',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

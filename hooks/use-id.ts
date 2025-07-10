import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Id } from '~/convex/_generated/dataModel';
type User = { id: Id<'users'>; name: string; pushToken?: string };
type Store = {
  user: User | null;
  getUser: (user: User) => void;
  clearUser: () => void;
};

export const useUser = create<Store>()(
  persist(
    (set) => ({
      user: null,
      getUser: (user) => {
        set({ user });
      },
      clearUser: () => {
        set({ user: null });
      },
    }),
    {
      name: 'use-user',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

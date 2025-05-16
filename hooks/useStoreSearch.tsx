import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
type data = { name: string; id: string };
interface SearchStore {
  orgs: data[];
  storeOrgs: (orgs: data) => void;
  removeOrg: (id: string) => void;
}

export const useStoreSearch = create<SearchStore>()(
  persist(
    (set) => ({
      orgs: [],
      storeOrgs: (orgs: data) =>
        set((state) => {
          const isInArray = state.orgs.find((org) => org.id === orgs.id);
          if (isInArray) {
            return state;
          }
          const lengthIsFour = state.orgs.length === 4;
          if (lengthIsFour) {
            const findLastInArray = state.orgs[state.orgs.length - 1];
            const newArray = state.orgs.filter((org) => org.id !== findLastInArray.id);
            return { orgs: [orgs, ...newArray] };
          }
          return { orgs: [orgs, ...state.orgs] };
        }),
      removeOrg: (id: string) =>
        set((state) => ({ orgs: state.orgs.filter((org) => org.id !== id) })),
    }),
    { name: 'orgs', storage: createJSONStorage(() => AsyncStorage) }
  )
);

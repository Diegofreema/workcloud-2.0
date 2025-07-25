import { create } from "zustand";

type State = {
  cat: string;
  setCat: (cat: string) => void;
  removeCat: () => void;
};

export const useGetCat = create<State>((set) => ({
  cat: "",
  removeCat: () => set({ cat: "" }),
  setCat: (cat: string) => set({ cat }),
}));

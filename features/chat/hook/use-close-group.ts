import { create } from "zustand";

type Store = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const useCloseGroup = create<Store>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));

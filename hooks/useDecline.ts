import { create } from "zustand";

type DeclineOptions = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useDecline = create<DeclineOptions>((set) => ({
  isOpen: false,
  _id: null,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

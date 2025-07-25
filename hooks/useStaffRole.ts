import { create } from "zustand";

type Store = {
  role: string;
  setRole: (role: string) => void;
  removeRole: () => void;
};

export const useStaffRole = create<Store>((set) => ({
  role: "",
  setRole: (role: string) => set({ role }),
  removeRole: () => set({ role: "" }),
}));

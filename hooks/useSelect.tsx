import { create } from 'zustand';

import { Id } from '~/convex/_generated/dataModel';

export type User = {
  name: string;
  role: string;
  id: Id<'workers'>;
  image: string;
};
type StaffStore = {
  user: User | null;
  onSelect: (user: User) => void;
  onDeselect: () => void;
};

export const useSelect = create<StaffStore>((set) => ({
  user: null,
  onSelect: (user) => set({ user }),
  onDeselect: () => set({ user: null }),
}));

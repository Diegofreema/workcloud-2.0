import { create } from 'zustand';

import { Id } from '~/convex/_generated/dataModel';

type State = {
  waitlistId: Id<'waitlists'> | null;
  setId: (id: Id<'waitlists'>, isWorker: boolean) => void;
  removeId: () => void;
  isWorker: boolean;
};

export const useWaitlistId = create<State>((set) => ({
  waitlistId: null,
  isWorker: false,
  removeId: () => set({ waitlistId: null, isWorker: false }),
  setId: (id, isWorker = false) => set({ waitlistId: id, isWorker }),
}));

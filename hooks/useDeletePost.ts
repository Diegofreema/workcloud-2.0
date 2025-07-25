import { create } from "zustand";

import { Id } from "~/convex/_generated/dataModel";

type State = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  id: Id<"posts"> | null;
  getId: (id: Id<"posts">) => void;
};

export const useDeletePost = create<State>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  id: null,
  getId: (id: Id<"posts">) => set({ id }),
}));

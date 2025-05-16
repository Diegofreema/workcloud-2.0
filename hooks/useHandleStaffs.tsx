import { create } from 'zustand';

import { WorkType } from '~/constants/types';

type ItemType = {
  item: WorkType | null;
  getItem: (item: WorkType) => void;
};

export const useHandleStaff = create<ItemType>((set) => ({
  item: null,
  getItem: (item: WorkType) => {
    set({ item });
  },
}));

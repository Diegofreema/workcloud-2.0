import {create} from 'zustand';
import {ProcessorType} from "~/features/staff/type";

type ItemType = {
  item: ProcessorType | null;
  getItem: (item: ProcessorType) => void;
};

export const useHandleStaff = create<ItemType>((set) => ({
  item: null,
  getItem: (item: ProcessorType) => {
    set({ item });
  },
}));

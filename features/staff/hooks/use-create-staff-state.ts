import { create } from "zustand";
import { StaffType } from "~/features/staff/type";

type StaffData = {
  type: StaffType;
  role: string | null;
};
type State = {
  staffData: StaffData;
  onClear: () => void;
  onGetData: (data: StaffData) => void;
};

export const useCreateStaffState = create<State>((set) => ({
  staffData: {
    type: "frontier",
    role: null,
  },
  onClear: () => set({ staffData: { type: "frontier", role: null } }),
  onGetData: (data) =>
    set((state) => ({ staffData: { ...state.staffData, data } })),
}));

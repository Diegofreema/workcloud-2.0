import { create } from "zustand";
import { ProcessorType } from "~/features/staff/type";
import { Id } from "~/convex/_generated/dataModel";

type StaffStore = {
  staffs: ProcessorType[];
  setStaffs: (staff: ProcessorType) => void;
  clear: () => void;
  removeStaff: (staffId: Id<"users">) => void;
};

export const useStaffStore = create<StaffStore>((set) => ({
  staffs: [],
  setStaffs: (staff) => {
    set((state) => {
      const newStaffs = [...state.staffs];
      const staffIndex = newStaffs.findIndex((s) => s.id === staff.id);
      if (staffIndex !== -1) {
        newStaffs.splice(staffIndex, 1);
        return {
          staffs: newStaffs,
        };
      }

      return {
        staffs: [...newStaffs, staff],
      };
    });
  },
  clear: () => {
    set({ staffs: [] });
  },
  removeStaff: (staffId) => {
    set((state) => {
      const staffs = [...state.staffs];
      const index = staffs.findIndex((s) => s.id === staffId);
      if (index !== -1) {
        staffs.splice(index, 1);
      }
      return { staffs };
    });
  },
}));

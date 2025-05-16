import { create } from 'zustand';

import { Id } from '~/convex/_generated/dataModel';
type DataType = {
  orgId: Id<'organizations'>;
  role?: string;
  workspaceId?: Id<'workspaces'>;
};
type Props = {
  workspaceId: any;
  role: any;
  orgId: any;
  getData: ({ orgId, role, workspaceId }: DataType) => void;
  personal: boolean;
  setPersonal: (personal: boolean) => void;
};

export const useDetailsToAdd = create<Props>((set, get) => ({
  workspaceId: '',
  role: '',
  orgId: '',
  personal: false,
  getData: ({ orgId, role, workspaceId }: DataType) => set({ role, workspaceId, orgId }),
  setPersonal: (personal: boolean) => {
    set((state) => ({ ...state, personal }));
  },
}));

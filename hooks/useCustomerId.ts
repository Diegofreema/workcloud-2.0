import { create } from 'zustand';

import { Id } from '~/convex/_generated/dataModel';

type StoreProps = {
  customerId: Id<'users'> | null;
  workspaceId: Id<'workspaces'> | null;
  getIds: (id: Id<'users'>, workspaceId: Id<'workspaces'>) => void;
  removeCustomerId: () => void;
};

export const useGetCustomerId = create<StoreProps>((set) => ({
  customerId: null,
  workspaceId: null,
  getIds: (customerId, workspaceId) => set({ customerId, workspaceId }),
  removeCustomerId: () => set({ customerId: null, workspaceId: null }),
}));

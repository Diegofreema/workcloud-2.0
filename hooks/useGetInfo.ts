import { create } from 'zustand';

import { Id } from '~/convex/_generated/dataModel';
type InfoType = {
  to: Id<'users'> | null;
  from: Id<'users'> | null;
  _id: Id<'requests'> | null;
  organizationId: Id<'organizations'> | null;
  role: string;
};
type Store = {
  infoIds: InfoType;
  getInfoIds: (info: InfoType) => void;
  removeInfoIds: () => void;
};

export const useInfos = create<Store>((set) => ({
  infoIds: {
    _id: null,
    from: null,
    organizationId: null,
    role: '',
    to: null,
  },
  getInfoIds: ({ _id, organizationId, to, role, from }: InfoType) => {
    set({ infoIds: { from, role, organizationId, _id, to } });
  },
  removeInfoIds: () => {
    set({
      infoIds: {
        organizationId: null,
        to: null,
        from: null,
        role: '',
        _id: null,
      },
    });
  },
}));

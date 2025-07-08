import { create } from 'zustand';
import { Id } from '~/convex/_generated/dataModel';

type Data = {
  callId: string;
  workerId: Id<'workers'> | null;
  workspaceId: Id<'workspaces'> | null;
};
type State = {
  data: Data;
  getData: (data: Data) => void;
  clear: () => void;
};

export const useCallStore = create<State>((set) => ({
  data: {
    callId: '',
    workerId: null,
    workspaceId: null,
  },
  getData: (data) => set({ data }),
  clear: () =>
    set({
      data: {
        callId: '',
        workerId: null,
        workspaceId: null,
      },
    }),
}));

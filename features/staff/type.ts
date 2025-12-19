import { Doc, Id } from '~/convex/_generated/dataModel';

export type StaffType = 'processor' | 'frontier';

export type WorkerData = {
  user: Doc<'users'>;
  worker: Doc<'workers'> | null;
};

export type ProcessorType = {
  name: string | undefined;
  id: Id<'users'>;
  _id?: Id<'workers'>;
  role: string;
  image: string;
  organizationId?: Id<'organizations'>;
  workspace: Doc<'workspaces'> | null;
  workspaceId?: Id<'workspaces'>;
};

import { ConvexError, v } from 'convex/values';

import { Id } from './_generated/dataModel';
import { mutation, query, QueryCtx } from './_generated/server';
import { getOrganizationByOrganizationId } from './organisation';
import {
  getLoggedInUser,
  getUserByUserId,
  getUserByWorkerId,
  getAuthUserBySubject,
  getWorkerProfile,
} from './users';
import { getAuthUserId } from '@convex-dev/auth/server';

export const getUserWorkspaceOrNull = query({
  args: { workerId: v.optional(v.id('workers')) },
  handler: async (ctx, args) => {
    if (!args.workerId) return null;
    const res = await ctx.db
      .query('workspaces')
      .withIndex('by_worker_id', (q) => q.eq('workerId', args.workerId))
      .first();
    if (!res) return null;
    const organization = await organisationByWorkSpaceId(
      ctx,
      res?.organizationId,
    );
    const workerProfile = await getUserByWorkerId(ctx, args.workerId);

    return {
      ...res,
      organization,
      image: workerProfile?.image,
    };
  },
});

const organisationByWorkSpaceId = async (
  ctx: QueryCtx,
  organizationId: Id<'organizations'>,
) => {
  const organization = await ctx.db.get(organizationId);
  if (!organization || !organization.avatar) return null;
  if (organization.avatar.startsWith('https')) {
    return organization;
  }
  const avatar = await ctx.storage.getUrl(
    organization.avatar as Id<'_storage'>,
  );
  return {
    ...organization,
    avatar,
  };
};

export const getRoles = query({
  handler: async (ctx) => {
    return await ctx.db.query('roles').collect();
  },
});

export const freeWorkspaces = query({
  args: {
    ownerId: v.id('users'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('workspaces')
      .filter((q) =>
        q.and(
          q.eq(q.field('ownerId'), args.ownerId),
          q.eq(q.field('workerId'), undefined),
        ),
      )
      .collect();
  },
});

export const getWorkspaceWithWaitingList = query({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) return;
    const [organization, worker, waitlist] = await Promise.all([
      getOrganizationByOrganizationId(ctx, workspace.organizationId),
      getUserByWorkerId(ctx, workspace?.workerId!),
      getWaitlist({ ctx, workspaceId: workspace._id }),
    ]);

    return {
      organization,
      worker,
      waitlist,
      workspace,
    };
  },
});
// mutation

export const starCustomer = mutation({
  args: {
    text: v.string(),
    customerId: v.id('users'),
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, { customerId, workspaceId, text }) => {
    const user = await getLoggedInUser(ctx, 'mutation');
    if (!user) {
      throw new ConvexError({ message: 'Unauthorized' });
    }
    const workspace = await ctx.db.get(workspaceId);
    if (!workspace) {
      throw new ConvexError({ message: 'Workspace not found' });
    }
    return await ctx.db.insert('stars', {
      customerId,
      workspaceId,
      text,
      status: 'unresolved',
      organizationId: workspace.organizationId,
      seen: false,
    });
  },
});

export const handleWaitlist = mutation({
  args: {
    customerId: v.id('users'),
    workspaceId: v.id('workspaces'),
    joinedAt: v.string(),
  },
  handler: async (ctx, { customerId, workspaceId, joinedAt }) => {
    const isInWaitlist = await ctx.db
      .query('waitlists')
      .withIndex('by_customer_id_workspace_id', (q) =>
        q.eq('workspaceId', workspaceId).eq('customerId', customerId),
      )
      .first();
    if (isInWaitlist) {
      await ctx.db.delete(isInWaitlist._id);
    }
    return await ctx.db.insert('waitlists', {
      customerId,
      workspaceId,
      joinedAt,
      type: 'waiting',
    });
  },
});
export const toggleWorkspaceStatus = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    type: v.union(v.literal('active'), v.literal('leisure')),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) return;
    if (args.type === 'active') {
      await ctx.db.patch(workspace._id, {
        active: !workspace.active,
      });
    } else {
      await ctx.db.patch(workspace._id, {
        leisure: !workspace.leisure,
      });
    }
  },
});
export const createAndAssignWorkspace = mutation({
  args: {
    ownerId: v.id('users'),
    organizationId: v.id('organizations'),
    role: v.string(),
    type: v.union(
      v.literal('personal'),
      v.literal('processor'),
      v.literal('front'),
    ),
    workerId: v.id('workers'),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('workspaces', {
      type: args.type,
      role: args.role,
      ownerId: args.ownerId,
      organizationId: args.organizationId,
      locked: args.type !== 'personal',
      active: false,
      leisure: false,
      waitlistCount: 0,
      workerId: args.workerId,
    });

    await ctx.db.patch(args.workerId, {
      workspaceId: id,
    });
    // update worker table with workspace id and boss id
  },
});
export const createWorkspace = mutation({
  args: {
    organizationId: v.id('organizations'),
    role: v.string(),
    type: v.literal('personal'),
    workerId: v.id('workers'),
  },
  handler: async (ctx, args) => {
    const owner = await getLoggedInUser(ctx, 'mutation');
    if (!owner) {
      throw new ConvexError('Unauthorized');
    }
    const id = await ctx.db.insert('workspaces', {
      type: args.type,
      role: args.role,
      ownerId: owner._id,
      organizationId: args.organizationId,
      locked: args.type !== 'personal',
      active: false,
      leisure: false,
      waitlistCount: 0,
      workerId: args.workerId,
    });

    await ctx.db.patch(args.workerId, {
      workspaceId: id,
      organizationId: args.organizationId,
      role: args.role,
      type: args.type,
    });

    return id;
    // update worker table with workspace id and boss id
  },
});
export const existLobby = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    customerToRemove: v.optional(v.id('users')),
  },
  handler: async (ctx, { workspaceId, customerToRemove }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ message: 'User not authenticated' });
    }
    const user = await getAuthUserBySubject(ctx, identity.subject);
    if (!user) {
      throw new ConvexError({ message: 'User not authenticated' });
    }

    const isSelfLeaving = !customerToRemove;
    const id = customerToRemove || user._id;

    const waitlist = await ctx.db
      .query('waitlists')
      .withIndex('by_customer_id_workspace_id', (q) =>
        q.eq('workspaceId', workspaceId).eq('customerId', id),
      )
      .first();

    if (waitlist) {
      await ctx.db.delete(waitlist._id);
    }

    // Only save as guest when the customer voluntarily leaves (not when removed by worker)
    if (isSelfLeaving) {
      const existingGuest = await ctx.db
        .query('guests')
        .withIndex('by_user_workspace', (q) =>
          q.eq('userId', user._id).eq('workspaceId', workspaceId),
        )
        .first();

      if (!existingGuest) {
        await ctx.db.insert('guests', {
          userId: user._id,
          workspaceId,
        });
      }
    }
  },
});
export const handleAttendance = mutation({
  args: {
    signOutAt: v.optional(v.string()),
    signInAt: v.optional(v.string()),

    today: v.string(),
    workspaceId: v.optional(v.id('workspaces')),
  },
  handler: async (ctx, { signOutAt, signInAt, today, workspaceId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ message: 'User not authenticated' });
    }
    const user = await getAuthUserBySubject(ctx, identity.subject);
    if (!user) {
      throw new ConvexError({ message: 'User not authenticated' });
    }
    const findTodayAttendance = await ctx.db
      .query('attendance')
      .withIndex('worker_id_date', (q) =>
        q.eq('workerId', user._id).eq('date', today),
      )
      .first();

    if (!findTodayAttendance && signInAt) {
      await ctx.db.insert('attendance', {
        signInAt,
        workerId: user._id,
        date: today,
      });
    }
    if (findTodayAttendance) {
      await ctx.db.patch(findTodayAttendance._id, {
        signOutAt,
      });
    }
    if (!workspaceId) return;
    await ctx.db.patch(workspaceId, {
      active: false,
    });
  },
});
export const checkIfWorkerSignedInToday = query({
  args: {
    today: v.string(),
  },
  handler: async (ctx, { today }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ message: 'User not authenticated' });
    }
    const user = await getAuthUserBySubject(ctx, identity.subject);
    if (!user) {
      throw new ConvexError({ message: 'User not found' });
    }
    const todayAttendance = await ctx.db
      .query('attendance')
      .withIndex('worker_id_date', (q) => q.eq('workerId', user._id))
      .filter((q) => q.eq(q.field('date'), today))
      .first();

    return {
      signedInToday: !!todayAttendance,
      signedOutToday: !!todayAttendance?.signOutAt,
    };
  },
});
export const deleteWorkspace = mutation({
  args: {
    id: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const workerAssignedToWorkspace = await ctx.db
      .query('workers')
      .withIndex('by_workspace_id', (q) => q.eq('workspaceId', args.id))
      .first();

    if (workerAssignedToWorkspace) {
      await ctx.db.patch(workerAssignedToWorkspace._id, {
        workspaceId: undefined,
      });
    }
    await ctx.db.delete(args.id);
  },
});
export const attendToCustomer = mutation({
  args: {
    waitlistId: v.id('waitlists'),
    nextWaitListId: v.optional(v.id('waitlists')),
    workerId: v.id('workers'),
  },
  handler: async (ctx, { waitlistId, nextWaitListId, workerId }) => {
    const waitlist = await ctx.db.get(waitlistId);

    if (!waitlist) {
      throw new ConvexError('Waitlist not found');
    }
    await ctx.db.patch(waitlist._id, {
      type: 'attending',
    });
    await ctx.db.patch(workerId, {
      attendingTo: waitlist._id,
    });
    if (nextWaitListId) {
      await ctx.db.patch(nextWaitListId, {
        type: 'next',
      });
    }
    const customer = await ctx.db.get(waitlist.customerId);

    if (!customer) {
      throw new ConvexError('Customer not found');
    }

    return customer;
  },
});

export const getWaitlistByCustomerId = query({
  args: {
    customerId: v.id('users'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('waitlists')
      .withIndex('customer_id', (q) => q.eq('customerId', args.customerId))
      .first();
  },
});

export const removeFromWaitlist = mutation({
  args: {
    waitlistId: v.id('waitlists'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.waitlistId);
  },
});
export const addStaffToWorkspace = mutation({
  args: {
    workerId: v.id('workers'),
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.workspaceId, {
      workerId: args.workerId,
    });
    await ctx.db.patch(args.workerId, {
      workspaceId: args.workspaceId,
    });
  },
});
export const removeFromWorkspace = mutation({
  args: {
    workerId: v.id('workers'),
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.workspaceId, {
      workerId: undefined,
      locked: true,
    });
    await ctx.db.patch(args.workerId, {
      workspaceId: undefined,
    });
  },
});

export const toggleWorkspace = mutation({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) return;
    await ctx.db.patch(workspace._id, {
      locked: !workspace.locked,
      active: false,
    });
  },
});
// helper
// const updateWorkerTableWithBossIdAndWorkspaceId = async (
//   ctx: QueryCtx,
//   bossId: Id<'users'>,
//   workspaceId: Id<'workspaces'>,
//   workerId: Id<'users'>
// ) => {};

export const getWaitlist = async ({
  ctx,
  workspaceId,
}: {
  ctx: QueryCtx;
  workspaceId: Id<'workspaces'>;
}) => {
  const waitlists = await ctx.db
    .query('waitlists')
    .withIndex('by_customer_id_workspace_id', (q) =>
      q.eq('workspaceId', workspaceId),
    )
    .order('desc')
    .collect();
  if (!waitlists) return [];
  const usersInWaitlist = waitlists.map(async (waitlist) => {
    const customer = await getUserByUserId(ctx, waitlist.customerId);

    return {
      ...waitlist,
      customer,
    };
  });
  return await Promise.all(usersInWaitlist);
};

export const deleteWaitlist = mutation({
  args: {
    waitlistId: v.id('waitlists'),
  },
  handler: async (ctx, args) => {
    const waitlist = await ctx.db.get(args.waitlistId);
    if (!waitlist) return;
    await ctx.db.delete(waitlist._id);
  },
});

export const getWaitListCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const user = await getAuthUserBySubject(ctx, identity.subject);
    if (!user) return 0;
    const worker = await getWorkerProfile(ctx, user._id);
    if (!worker || !worker.workspaceId) return 0;
    const waitlistCount = await ctx.db
      .query('waitlists')
      .withIndex('by_customer_id_workspace_id', (q) =>
        q.eq('workspaceId', worker.workspaceId as Id<'workspaces'>),
      )
      .order('desc')
      .collect();
    return waitlistCount.length;
  },
});

import { ConvexError, v } from 'convex/values';

import { filter } from 'convex-helpers/server/filter';
import { paginationOptsValidator } from 'convex/server';
import { Id } from './_generated/dataModel';
import { mutation, MutationCtx, query, QueryCtx } from './_generated/server';
import {
  getLoggedInUser,
  getOrganisationWithoutImageByWorker,
  getUserByIdHelper,
} from './users';

export const getAllOtherWorkers = query({
  handler: async (ctx, args) => {
    const boss = await getLoggedInUser(ctx, 'query');
    if (!boss) return [];
    const res = await ctx.db
      .query('workers')
      .filter((q) =>
        q.and(
          q.neq(q.field('userId'), boss._id),
          q.eq(q.field('bossId'), undefined),
          q.neq(q.field('type'), 'personal'),
          q.eq(q.field('organizationId'), undefined)
        )
      )
      .collect();

    return Promise.all(
      res.map(async (worker) => {
        const user = await getUserByIdHelper(ctx, worker.userId);
        return {
          worker,
          user,
        };
      })
    );
  },
});

export const getWorker = query({
  args: {
    workerId: v.id('workers'),
  },
  handler: async (ctx, args) => {
    const worker = await ctx.db.get(args.workerId);
    if (!worker || !worker.attendingTo) return null;
    const waitlist = await ctx.db.get(worker.attendingTo as Id<'waitlists'>);
    if (!waitlist) return null;
    return {
      ...worker,
      customerId: waitlist?.customerId,
    };
  },
});

export const getSingleWorkerProfile = query({
  args: {
    id: v.id('workers'),
  },
  handler: async (ctx, args) => {
    const worker = await ctx.db.get(args.id);
    if (!worker) return null;
    const user = await getUserByIdHelper(ctx, worker.userId);
    const organization = await getOrganisationWithoutImageByWorker(
      ctx,
      worker.organizationId as Id<'organizations'>
    );
    return {
      worker,
      user,
      organization,
    };
  },
});
export const getProcessors = query({
  args: {
    organizationId: v.id('organizations'),
  },
  handler: async (ctx, { organizationId }) => {
    const workers = await ctx.db
      .query('workers')
      .withIndex('by_org_id', (q) => q.eq('organizationId', organizationId))
      .filter((q) => q.eq(q.field('type'), 'processor'))
      .collect();
    if (!workers) return [];
    const workersWithUserProfile = workers.map(async (worker) => {
      const user = await getUserByIdHelper(ctx, worker._id);
      return {
        worker,
        user,
      };
    });

    return await Promise.all(workersWithUserProfile);
  },
});
export const checkIfWorkerIsEmployed = query({
  args: {
    id: v.id('users'),
  },
  handler: async (ctx, args) => {
    const worker = await getWorkerHelper(ctx, args.id);
    return !!worker?.organizationId;
  },
});

// mutations

export const acceptOffer = mutation({
  args: {
    role: v.string(),
    to: v.id('users'),
    _id: v.id('requests'),
    from: v.id('users'),
    organizationId: v.id('organizations'),
  },
  handler: async (ctx, args) => {
    const worker = await getWorkerHelper(ctx, args.to);
    const from = await getUserByIdHelper(ctx, args.from);
    if (!from) {
      throw new ConvexError('Failed to accept offer');
    }

    const org = await ctx.db.get(args.organizationId);
    if (!worker || !org) {
      throw new ConvexError('Failed to accept offer');
    }
    const prevWorkers = org.workers || [];
    await Promise.all([
      ctx.db.patch(args.organizationId, {
        workers: [...prevWorkers, worker._id],
      }),
      ctx.db.patch(worker?._id, {
        role: args.role,
        bossId: args.from,
        organizationId: args.organizationId,
        workspaceId: undefined,
        type: args.role === 'processor' ? 'processor' : 'front',
      }),
      ctx.db.patch(args._id, {
        status: 'accepted',
      }),
    ]);

    return from.pushToken;
  },
});

export const checkIfItMyStaff = query({
  args: {
    workerId: v.id('workers'),
    bossId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const worker = await ctx.db.get(args.workerId);
    return worker?.bossId === args.bossId;
  },
});

export const resignFromOrganization = mutation({
  args: {
    workerId: v.id('workers'),
  },
  handler: async (ctx, args) => {
    const worker = await ctx.db.get(args.workerId);
    if (!worker) {
      throw new ConvexError('Worker not found');
    }
    const user = await getUserByIdHelper(ctx, worker?.userId);
    if (!user) {
      throw new ConvexError('User not found');
    }
    if (worker?.workspaceId) {
      const workspace = await ctx.db.get(worker?.workspaceId);
      if (workspace) {
        await ctx.db.patch(workspace._id, {
          workerId: undefined,
        });
      }
    }

    const conversationsAsync = filter(
      ctx.db
        .query('conversations')
        .withIndex('by_last_message_last_message_time'),
      (conversation) =>
        conversation.participants.includes(worker.userId) &&
        conversation.type === 'group' &&
        conversation.creatorId === worker.bossId
    ).collect();

    const conversationsToLeave = await conversationsAsync;

    for (const conversation of conversationsToLeave) {
      await ctx.db.patch(conversation._id, {
        participants: conversation.participants.filter(
          (participant) => participant !== worker.userId
        ),
        participantNames: conversation.participantNames.filter(
          (participant) => participant !== user.name
        ),
      });
    }
    await ctx.db.patch(worker._id, {
      bossId: undefined,
      organizationId: undefined,
      workspaceId: undefined,
    });
  },
});

export const getWorkerRole = query({
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await getUserByIdHelper(ctx, identity.subject);
    if (!user) return null;

    const worker = await getWorkerHelper(ctx, user._id);
    if (!worker) return null;
    return {
      role: worker?.role,
      id: worker?._id,
    };
  },
});

export const getStarred = query({
  args: {
    id: v.optional(v.id('workspaces')),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ message: 'Unauthorized' });
    }
    const user = await getUserByIdHelper(ctx, identity.subject);
    if (!user) {
      throw new ConvexError({ message: 'Unauthorized' });
    }
    if (!user?.workerId) {
      throw new ConvexError({ message: 'Unauthorized' });
    }

    let stars;
    if (args.id) {
      const workspace = await ctx.db.get(args.id);
      if (!workspace) {
        throw new ConvexError({ message: 'Workspace not found' });
      }
      stars = await ctx.db
        .query('stars')
        .withIndex('by_workspace_id', (q) => q.eq('workspaceId', workspace._id))
        .order('desc')
        .paginate(args.paginationOpts);
    } else {
      stars = await ctx.db
        .query('stars')
        .withIndex('by_assignee_id', (q) => q.eq('assignedTo', user._id))
        .order('desc')
        .paginate(args.paginationOpts);
    }

    const page = await Promise.all(
      stars.page.map(async (star) => {
        const user = await getUserByIdHelper(ctx, star.customerId);
        return {
          ...star,
          user: user!,
        };
      })
    );

    return {
      ...stars,
      page,
    };
  },
});
export const getStarredProcessor = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({ message: 'Unauthorised' });
    }
    const user = await getUserByIdHelper(ctx, identity.subject);
    if (!user) {
      throw new ConvexError({ message: 'Unauthorized' });
    }
    if (!user?.workerId) {
      throw new ConvexError({ message: 'Unauthorized' });
    }

    const stars = await ctx.db
      .query('stars')
      .withIndex('by_assignee_id', (q) => q.eq('assignedTo', user._id))
      .order('desc')
      .paginate(args.paginationOpts);

    const page = await Promise.all(
      stars.page.map(async (star) => {
        const user = await getUserByIdHelper(ctx, star.customerId);
        return {
          ...star,
          user: user!,
        };
      })
    );

    return {
      ...stars,
      page,
    };
  },
});

export const updateStarStatus = mutation({
  args: {
    id: v.id('stars'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError('Unauthorized');
    }
    const user = await getUserByIdHelper(ctx, identity.subject);
    if (!user) {
      throw new ConvexError({ message: 'Unauthorized' });
    }

    const worker = await getWorkerHelper(ctx, user._id);
    if (!worker) {
      throw new ConvexError({ message: 'Unauthorized' });
    }

    const star = await ctx.db.get(args.id);
    if (!star) {
      throw new ConvexError({ message: 'Issue not found' });
    }
    await ctx.db.patch(star._id, {
      status: star.status === 'resolved' ? 'unresolved' : 'resolved',
    });
  },
});
export const deleteStarStatus = mutation({
  args: {
    id: v.id('stars'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ message: 'Unauthorized' });
    }

    const user = await getUserByIdHelper(ctx, identity.subject);
    if (!user) {
      throw new ConvexError({ message: 'Unauthorized' });
    }

    const worker = await getWorkerHelper(ctx, user._id);
    if (!worker) {
      throw new ConvexError({ message: 'Unauthorized' });
    }

    const star = await ctx.db.get(args.id);
    if (!star) {
      throw new ConvexError({ message: 'Issue not found' });
    }
    await ctx.db.delete(star._id);
  },
});
export const editStarStatus = mutation({
  args: {
    id: v.id('stars'),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ message: 'Unauthorized' });
    }

    const user = await getUserByIdHelper(ctx, identity.subject);
    if (!user) {
      throw new ConvexError({ message: 'Unauthorized' });
    }

    const worker = await getWorkerHelper(ctx, user._id);
    if (!worker) {
      throw new ConvexError({ message: 'Unauthorized' });
    }

    const star = await ctx.db.get(args.id);
    if (!star) {
      throw new ConvexError({ message: 'Issue not found' });
    }
    await ctx.db.patch(star._id, {
      text: args.text,
    });
  },
});
export const updateSeenStarred = mutation({
  args: {
    id: v.id('stars'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ message: 'Unauthorized' });
    }

    const user = await getUserByIdHelper(ctx, identity.subject);
    if (!user) {
      throw new ConvexError({ message: 'Unauthorized' });
    }

    const worker = await getWorkerHelper(ctx, user._id);
    if (!worker) {
      throw new ConvexError({ message: 'Unauthorized' });
    }

    const star = await ctx.db.get(args.id);
    if (!star) {
      throw new ConvexError({ message: 'Starred identity not found' });
    }

    if (!star.seen) {
      await ctx.db.patch(star._id, {
        seen: true,
      });
    }
  },
});

export const getWorkerHelper = async (
  ctx: QueryCtx | MutationCtx,
  id: Id<'users'>
) => {
  return await ctx.db
    .query('workers')
    .withIndex('userId', (q) => q.eq('userId', id))
    .first();
};

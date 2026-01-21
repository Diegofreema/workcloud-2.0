import { ConvexError, v } from 'convex/values';

import { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import {
  getLoggedInUser,
  getOrganisationWithoutImageByWorker,
  getUserByUserId,
  getUserByWorkerId,
} from './users';
import { User } from '../constants/types';
import { filter } from 'convex-helpers/server/filter';
import { getAuthUserId } from '@convex-dev/auth/server';
import { paginationOptsValidator } from 'convex/server';

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
          q.eq(q.field('organizationId'), undefined),
        ),
      )
      .collect();

    return Promise.all(
      res.map(async (worker) => {
        const user = await getUserByUserId(ctx, worker.userId);
        return {
          worker,
          user,
        };
      }),
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
    const user = await getUserByUserId(ctx, worker.userId);
    const organization = await getOrganisationWithoutImageByWorker(
      ctx,
      worker.organizationId as Id<'organizations'>,
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
      const user = await getUserByWorkerId(ctx, worker._id);
      return {
        worker,
        user: user as User,
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
    const worker = await ctx.db
      .query('workers')
      .filter((q) => q.eq(q.field('userId'), args.id))
      .first();
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
    const [from, org, worker, to] = await Promise.all([
      ctx.db.get('users', args.from),
      ctx.db.get('organizations', args.organizationId),
      ctx.db
        .query('workers')
        .withIndex('userId', (q) => q.eq('userId', args.to))
        .first(),
      ctx.db.get('users', args.to),
    ]);
    if (!from || !worker || !org || !to) {
      throw new ConvexError({ message: 'Failed to accept offer' });
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
    await ctx.db.insert('notifications', {
      userId: args.from,
      message: to.name + ' accepted your offer',
      title: 'Offer accepted',
      seen: false,
    });

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
    const user = await ctx.db.get(worker?.userId);
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
        conversation.creatorId === worker.bossId,
    ).collect();

    const conversationsToLeave = await conversationsAsync;

    for (const conversation of conversationsToLeave) {
      await ctx.db.patch(conversation._id, {
        participants: conversation.participants.filter(
          (participant) => participant !== worker.userId,
        ),
        participantNames: conversation.participantNames.filter(
          (participant) => participant !== user.name,
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
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const worker = await ctx.db
      .query('workers')
      .withIndex('userId', (q) => q.eq('userId', userId))
      .first();
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
    const userId = await getAuthUserId(ctx);
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
      if (!userId) {
        throw new ConvexError({ message: 'Unauthorised' });
      }
      stars = await ctx.db
        .query('stars')
        .withIndex('by_assignee_id', (q) => q.eq('assignedTo', userId))
        .order('desc')
        .paginate(args.paginationOpts);
    }

    const page = await Promise.all(
      stars.page.map(async (star) => {
        const user = await ctx.db.get(star.customerId);
        return {
          ...star,
          user: user!,
        };
      }),
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
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError({ message: 'Unauthorised' });
    }
    const stars = await ctx.db
      .query('stars')
      .withIndex('by_assignee_id', (q) => q.eq('assignedTo', userId))
      .order('desc')
      .paginate(args.paginationOpts);

    const page = await Promise.all(
      stars.page.map(async (star) => {
        const user = await ctx.db.get(star.customerId);
        return {
          ...star,
          user: user!,
        };
      }),
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
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError('Unauthorized');
    }

    const worker = await ctx.db
      .query('workers')
      .withIndex('userId', (q) => q.eq('userId', userId))
      .first();
    if (!worker) {
      throw new ConvexError('Unauthorized');
    }

    const star = await ctx.db.get(args.id);
    if (!star) {
      throw new ConvexError('Issue not found');
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
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError('Unauthorized');
    }

    const worker = await ctx.db
      .query('workers')
      .withIndex('userId', (q) => q.eq('userId', userId))
      .first();
    if (!worker) {
      throw new ConvexError('Unauthorized');
    }

    const star = await ctx.db.get(args.id);
    if (!star) {
      throw new ConvexError('Issue not found');
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
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError('Unauthorized');
    }

    const worker = await ctx.db
      .query('workers')
      .withIndex('userId', (q) => q.eq('userId', userId))
      .first();
    if (!worker) {
      throw new ConvexError('Unauthorized');
    }

    const star = await ctx.db.get(args.id);
    if (!star) {
      throw new ConvexError('Issue not found');
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
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError('Unauthorized');
    }

    const worker = await ctx.db
      .query('workers')
      .withIndex('userId', (q) => q.eq('userId', userId))
      .first();
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

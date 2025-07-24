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
          q.neq(q.field('type'), 'personal')
        )
      )
      .collect();

    return Promise.all(
      res.map(async (worker) => {
        const user = await getUserByUserId(ctx, worker.userId);
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
    const user = await getUserByUserId(ctx, worker.userId);
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
    const worker = await ctx.db
      .query('workers')
      .withIndex('userId', (q) => q.eq('userId', args.to))
      .first();
    const from = await ctx.db.get(args.from);
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

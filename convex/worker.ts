import { v } from 'convex/values';

import { Id } from '~/convex/_generated/dataModel';
import { mutation, query } from '~/convex/_generated/server';
import {
  getOrganisationWithoutImageByWorker,
  getUserByUserId,
  getUserByWorkerId,
} from '~/convex/users';
import { User } from '~/constants/types';

export const getAllOtherWorkers = query({
  args: {
    bossId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const res = await ctx.db
      .query('workers')
      .filter((q) =>
        q.and(q.neq(q.field('userId'), args.bossId), q.neq(q.field('bossId'), args.bossId))
      )
      .collect();

    return Promise.all(
      res.map(async (r) => {
        const user = await getUserByUserId(ctx, r.userId);
        const organization = await getOrganisationWithoutImageByWorker(
          ctx,
          r.organizationId as Id<'organizations'>
        );

        return {
          ...r,
          user,
          organization,
        };
      })
    );
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
      .filter((q) => q.eq(q.field('userId'), args.to))
      .first();

    const org = await ctx.db.get(args.organizationId);
    if (!worker || !org) return { message: 'failed' };
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
        type: args.role === 'Processor' ? 'processor' : 'normal',
      }),
      ctx.db.patch(args._id, {
        pending: false,
        accepted: true,
      }),
    ]);
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

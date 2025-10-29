import { ConvexError, v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { getOrganizationByOwnerId } from './organisation';
import { getLoggedInUser, getUserByUserId, getWorkerProfile } from './users';
import { internal } from './_generated/api';

export const getPendingRequestsAsBoolean = query({
  args: {
    from: v.id('users'),
    to: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    if (!args.from || !args.to) return null;
    return await ctx.db
      .query('requests')
      .filter((q) =>
        q.and(
          q.eq(q.field('from'), args.from),
          q.eq(q.field('to'), args.to),
          q.eq(q.field('status'), 'pending')
        )
      )
      .first();
  },
});

export const getPendingStaffsWithoutOrganization = query({
  handler: async (ctx, args) => {
    const user = await getLoggedInUser(ctx, 'query');
    if (!user) return [];
    const res = await ctx.db
      .query('requests')
      .filter((q) =>
        q.and(
          q.eq(q.field('from'), user._id),
          q.eq(q.field('status'), 'pending')
        )
      )
      .collect();

    return await Promise.all(
      res.map(async (r) => {
        const user = await getUserByUserId(ctx, r.to);
        const worker = await getWorkerProfile(ctx, r.to);
        return {
          request: r,
          user,
          worker,
        };
      })
    );
  },
});
export const getPendingRequestsWithOrganization = query({
  handler: async (ctx, args) => {
    const user = await getLoggedInUser(ctx, 'query');
    if (!user) return [];

    const res = await ctx.db
      .query('requests')
      .filter((q) => q.eq(q.field('to'), user._id))
      .order('desc')
      .collect();

    return await Promise.all(
      res.map(async (r) => {
        const organisation = await getOrganizationByOwnerId(ctx, r.from);
        return {
          request: r,
          organisation,
        };
      })
    );
  },
});
// mutations

export const cancelPendingRequests = mutation({
  args: {
    id: v.id('requests'),
  },
  handler: async (ctx, args) => {
    const request = await ctx.db.get(args.id);
    if (!request) {
      throw new ConvexError('Request not found');
    }
    await ctx.db.patch(request._id, {
      status: 'cancelled',
    });
  },
});

export const createRequest = mutation({
  args: {
    from: v.id('users'),
    to: v.id('users'),
    role: v.string(),
    salary: v.string(),
    responsibility: v.string(),
    qualities: v.string(),
  },
  handler: async (ctx, args) => {
    const getOrganization = await getOrganizationByOwnerId(ctx, args.from);
    if (!getOrganization) {
      throw new Error('No organization found');
    }
    await ctx.db.insert('requests', {
      ...args,
      status: 'pending',
    });

    await ctx.runMutation(internal.notifications.createNotification, {
      title: 'New job offer',
      message: `You have a new job offer from ${getOrganization.name}`,
      userId: args.to,
      requestId: getOrganization._id,
    });
  },
});

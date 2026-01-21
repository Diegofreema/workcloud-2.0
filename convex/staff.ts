import { v } from 'convex/values';

import { mutation, query, QueryCtx } from './_generated/server';
import { filter } from 'convex-helpers/server/filter';
import { Id } from './_generated/dataModel';
import { getAuthUserBySubject } from './users';

export const getStaffRoles = query({
  args: {
    bossId: v.id('users'),
  },
  handler: async (ctx, { bossId }) => {
    const roles = await ctx.db
      .query('workers')
      .withIndex('boss_Id', (q) => q.eq('bossId', bossId))
      .collect();

    return roles.map((role) => role.role!) || [];
  },
});

// mutations

export const createStaffRole = mutation({
  args: {
    role: v.string(),
  },
  handler: async (ctx, { role }) => {
    await ctx.db.insert('roles', {
      role,
    });
  },
});

export const searchStaffsToEmploy = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await getAuthUserBySubject(ctx, identity.subject);
    if (!user) return [];
    const users = await getUserWithSearchQuery(ctx, args.query, user._id);
    const workers = users.map(async (user) => {
      const worker = await getWorkersThatAreNotWorking(ctx, user.workerId);

      if (!worker) return null;
      return {
        user: {
          ...user,
          imageUrl: user.image,
        },
        worker,
      };
    });

    return await Promise.all(workers);
  },
});

const getUserWithSearchQuery = async (
  ctx: QueryCtx,
  query: string,
  loggedInUser: Id<'users'>,
) => {
  return filter(
    ctx.db
      .query('users')
      .withSearchIndex('name', (q) => q.search('name', query)),
    (user) => user.workerId !== undefined && user._id !== loggedInUser,
  ).collect();
};

export const getWorkersThatAreNotWorking = async (
  ctx: QueryCtx,
  workerId?: Id<'workers'>,
) => {
  if (!workerId) return null;
  const worker = await ctx.db.get(workerId);
  if (worker?.bossId) return null;
  return worker;
};

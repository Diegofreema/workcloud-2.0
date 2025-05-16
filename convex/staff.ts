import { v } from 'convex/values';

import { mutation, query } from '~/convex/_generated/server';

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

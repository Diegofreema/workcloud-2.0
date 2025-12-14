import { createAuth } from '../auth';
import { getStaticAuth } from '@convex-dev/better-auth';
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { doc } from 'convex-helpers/validators';
import schema from './schema';
// Export a static instance for Better Auth schema generation
export const auth = getStaticAuth(createAuth);
export const getUser = query({
  args: { userId: v.id('user') },
  returns: v.union(v.null(), doc(schema, 'user')),
  handler: async (ctx, args) => {
    return ctx.db.get(args.userId);
  },
});
export const deleteUser = mutation({
  args: { userId: v.id('user') },
  returns: v.union(v.null(), doc(schema, 'user')),
  handler: async (ctx, args) => {
    return ctx.db.delete(args.userId);
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id('user'),
    organizationId: v.optional(v.id('organizations')),
    workerId: v.optional(v.id('workers')),
  },
  returns: v.union(v.null(), doc(schema, 'user')),
  handler: async (ctx, args) => {
    const { userId, ...rest } = args;
    return ctx.db.patch(userId, {
      ...rest,
    });
  },
});

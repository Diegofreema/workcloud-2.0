import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getUserProfileByWorkerId } from './servicePoints';
import { getUserByIdHelper } from './users';

// export const getProcessorsByUserId = query({
//   args: {
//     userId: v.id("users"),
//   },
//   handler: async (ctx, args) => {},
// });

export const getProcessorThroughUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const userData = await getUserByIdHelper(ctx, args.userId);
    if (!userData) return [];
    const worker = await ctx.db
      .query('workers')
      .withIndex('userId', (q) => q.eq('userId', args.userId))
      .first();
    if (!worker) return [];
    const processors = await ctx.db
      .query('workers')
      .withIndex('by_org_id', (q) =>
        q.eq('organizationId', worker.organizationId)
      )
      .filter((q) => q.eq(q.field('type'), 'processor'))
      .collect();

    const processorsWithProfile = processors.map(async (p) => {
      return await getUserProfileByWorkerId(ctx, p._id);
    });

    return await Promise.all(processorsWithProfile);
  },
});

export const getProcessorDetail = query({
  args: {
    id: v.id('workers'),
  },
  handler: async (ctx, args) => {
    return getUserProfileByWorkerId(ctx, args.id);
  },
});

export const getProcessorsThroughWorkpaceId = query({
  args: { workspaceId: v.id('workspaces') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) {
      return [];
    }
    const organisation = await ctx.db.get(workspace.organizationId);
    if (!organisation) {
      return [];
    }
    const processors = await ctx.db
      .query('workers')
      .withIndex('boss_Id', (q) =>
        q.eq('bossId', organisation.ownerId).eq('type', 'processor')
      )
      .collect();
    const processorsWithDetails = processors.map(async (processor) => {
      const details = await getUserProfileByWorkerId(ctx, processor._id);
      // const image = await getUserImage(ctx, details.)
      const { _id, ...rest } = processor;
      return {
        ...rest,
        ...details,
      };
    });

    return await Promise.all(processorsWithDetails);
  },
});

export const assignProcessorStarred = mutation({
  args: { starId: v.id('stars'), id: v.id('users') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ message: 'Unauthorized' });
    }
    const worker = await ctx.db
      .query('workers')
      .withIndex('userId', (q) =>
        q.eq('userId', args.id).eq('type', 'processor')
      )
      .first();
    if (!worker) {
      throw new ConvexError({ message: 'Worker not found' });
    }
    const starred = await ctx.db.get(args.starId);
    if (!starred) {
      throw new ConvexError({ message: 'Starred Identity not found' });
    }

    await ctx.db.patch(starred._id, {
      assignedTo: args.id,
    });
  },
});

import { ConvexError, v } from 'convex/values';
import { api } from './_generated/api';
import { mutation, query } from './_generated/server';
import { getUserProfileByWorkerId } from './servicePoints';
import {
  getAuthUserBySubject,
  getLoggedInUser,
  getWorkerProfile,
} from './users';

// export const getProcessorsByUserId = query({
//   args: {
//     userId: v.id("users"),
//   },
//   handler: async (ctx, args) => {},
// });

export const getProcessorThroughUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ message: 'User not authenticated' });
    }
    const userData = await getAuthUserBySubject(ctx, identity.subject);
    if (!userData) return [];
    const worker = await getWorkerProfile(ctx, userData._id);
    if (!worker) return [];
    const processors = await ctx.db
      .query('workers')
      .withIndex('by_org_id', (q) =>
        q.eq('organizationId', worker.organizationId),
      )
      .filter((q) =>
        q.and(
          q.eq(q.field('type'), 'processor'),
          q.neq(q.field('userId'), userData._id),
        ),
      )
      .collect();

    const processorsWithProfile = await Promise.all(
      processors.map(async (p) => {
        const user = await ctx.db.get(p.userId);
        if (!user) {
          throw new ConvexError({ message: 'Processor user not found' });
        }
        const { _id, ...rest } = user;
        return {
          ...p,
          ...rest,
        };
      }),
    );

    return processorsWithProfile;
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
    const user = await getLoggedInUser(ctx, 'query');
    if (!user) {
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
        q.eq('bossId', organisation.ownerId).eq('type', 'processor'),
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
    const user = await getLoggedInUser(ctx, 'mutation');
    if (!user) {
      throw new ConvexError({ message: 'Unauthorized' });
    }

    const [worker, starred] = await Promise.all([
      ctx.db
        .query('workers')
        .withIndex('userId', (q) =>
          q.eq('userId', args.id).eq('type', 'processor'),
        )
        .first(),
      ctx.db.get(args.starId),
    ]);

    if (!starred) {
      throw new ConvexError({ message: 'Starred Identity not found' });
    }
    if (!worker) {
      throw new ConvexError({ message: 'Worker not found' });
    }
    const workerProfile = await getUserProfileByWorkerId(ctx, worker._id);

    if (!workerProfile) {
      throw new ConvexError({ message: 'Worker Profile not found' });
    }
    await ctx.db.patch(starred._id, {
      assignedTo: args.id,
    });
    await ctx.db.insert('notifications', {
      userId: worker.userId,
      title: 'Starred Identity',
      message:
        'You have been assigned a starred identity by ' + workerProfile.name,
      seen: false,
      imageUrl: workerProfile.image,
      type: 'task',
    });

    await ctx.scheduler.runAfter(0, api.pushNotification.sendPushNotification, {
      to: worker.userId,
      title: 'Starred Identity',
      body:
        'You have been assigned a starred identity by ' + workerProfile.name,
      data: {
        type: 'starred',
        id: starred._id.toString(),
      },
    });
  },
});

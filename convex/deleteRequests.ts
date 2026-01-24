import { filter } from 'convex-helpers/server/filter';
import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getLoggedInUser } from './users';

export const createDeletionRequest = mutation({
  args: {
    reason: v.optional(v.string()),
    feedback: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getLoggedInUser(ctx, 'mutation');
    if (!user) {
      throw new ConvexError({ message: 'Unauthorized' });
    }

    const userId = user._id;
    // Check if user already has a pending deletion request
    const existingRequest = await ctx.db
      .query('deletionRequests')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('status'), 'pending'))
      .first();

    if (existingRequest) {
      throw new ConvexError({
        message: 'Your account already has a pending deletion request',
      });
    }

    const deletionRequestId = await ctx.db.insert('deletionRequests', {
      userId: userId,
      reason: args.reason,
      feedback: args.feedback,
      requestedAt: Date.now(),
      status: 'pending',
    });

    return deletionRequestId;
  },
});

export const getUserDeletionRequest = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('deletionRequests')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('status'), 'pending'))
      .first();
  },
});

export const deleteUserAccount = mutation({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const deletionRequest = await ctx.db
      .query('deletionRequests')
      .withIndex('by_user', (q) =>
        q.eq('userId', args.userId).eq('status', 'pending'),
      )
      .first();
    if (!deletionRequest) {
      throw new ConvexError({ message: 'Deletion request not found' });
    }
    const userToDelete = await ctx.db.get(args.userId);
    if (!userToDelete) {
      throw new ConvexError({ message: 'User not found' });
    }
    await ctx.db.delete(args.userId);
    const userHasAnOrganization = await ctx.db
      .query('organizations')
      .withIndex('ownerId', (q) => q.eq('ownerId', args.userId))
      .first();
    if (userHasAnOrganization) {
      const userHasWorkers = await ctx.db
        .query('workers')
        .withIndex('boss_Id', (q) => q.eq('bossId', args.userId))
        .collect();
      if (userHasWorkers.length > 0) {
        for (const worker of userHasWorkers) {
          await ctx.db.patch(worker._id, { bossId: undefined });
        }
      }
      await ctx.db.delete(userHasAnOrganization._id);
    }
    const userHasAWorkerProfile = await ctx.db
      .query('workers')
      .withIndex('userId', (q) => q.eq('userId', args.userId))
      .first();
    if (userHasAWorkerProfile) {
      if (userHasAWorkerProfile.workspaceId) {
        const userIsAssignedAWorkspace = await ctx.db.get(
          userHasAWorkerProfile.workspaceId,
        );
        if (userIsAssignedAWorkspace) {
          await ctx.db.patch(userIsAssignedAWorkspace._id, {
            workerId: undefined,
          });
        }
      }
      await ctx.db.delete(userHasAWorkerProfile._id);
    }
    const userIsInAConversation = await filter(
      ctx.db.query('conversations'),
      (conversation) => conversation.participants.includes(args.userId),
    ).collect();

    if (userIsInAConversation.length > 0) {
      for (const conversation of userIsInAConversation) {
        await ctx.db.patch(conversation._id, {
          participants: conversation.participants.filter(
            (participant) => participant !== args.userId,
          ),
          participantNames: conversation.participantNames.filter(
            (participant) => participant !== userToDelete.name!,
          ),
        });
      }
    }
    const userIsCreatorOfAnyGroup = await ctx.db
      .query('conversations')
      .withIndex('type', (q) =>
        q.eq('type', 'group').eq('creatorId', args.userId),
      )
      .collect();
    if (userIsCreatorOfAnyGroup.length > 0) {
      for (const group of userIsCreatorOfAnyGroup) {
        await ctx.db.delete(group._id);
      }
    }

    const userConnections = await ctx.db
      .query('connections')
      .withIndex('by_ownerId_orgId', (q) => q.eq('ownerId', args.userId))
      .collect();
    if (userConnections.length > 0) {
      for (const connection of userConnections) {
        await ctx.db.delete(connection._id);
      }
    }
    await ctx.db.patch(deletionRequest._id, { status: 'processed' });
  },
});

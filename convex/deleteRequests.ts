import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const createDeletionRequest = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    reason: v.optional(v.string()),
    feedback: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already has a pending deletion request
    const existingRequest = await ctx.db
      .query('deletionRequests')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('status'), 'pending'))
      .first();

    if (existingRequest) {
      throw new Error('You already have a pending deletion request.');
    }

    const deletionRequestId = await ctx.db.insert('deletionRequests', {
      userId: args.userId,
      email: args.email,
      reason: args.reason,
      feedback: args.feedback,
      requestedAt: Date.now(),
      status: 'pending',
    });

    return deletionRequestId;
  },
});

export const getUserDeletionRequest = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('deletionRequests')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('status'), 'pending'))
      .first();
  },
});

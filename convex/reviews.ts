import { paginationOptsValidator } from 'convex/server';
import { ConvexError, v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { getAuthUserBySubject, getUserByUserId } from './users';
import { internal } from './_generated/api';

// mutation
export const addReview = mutation({
  args: {
    userId: v.id('users'),
    organizationId: v.id('organizations'),
    text: v.optional(v.string()),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    const [org, reviewer] = await Promise.all([
      ctx.db.get(args.organizationId),

      ctx.db.get(args.userId),
    ]);
    if (!org) {
      throw new ConvexError({ message: 'Organization not found' });
    }
    if (!reviewer) {
      throw new ConvexError({ message: 'Reviewer not found' });
    }
    const owner = await ctx.db.get(org.ownerId);
    if (!owner) {
      throw new ConvexError({ message: 'Owner not found' });
    }

    const id = await ctx.db.insert('reviews', {
      ...args,
    });

    await ctx.runMutation(internal.notifications.createNotification, {
      message: args.text || `${args.rating} stars`,
      title: `${reviewer.name} left a review`,
      userId: owner._id,
      reviewId: id,
    });
    if (owner.pushToken) {
      await ctx.scheduler.runAfter(
        0,
        internal.externalFuntions.sendPushNotificationConvex,
        {
          title: `${reviewer.name} left a review`,
          body: args.text || `${args.rating} stars`,
          expoPushToken: owner.pushToken,
          data: {
            type: 'review',
            reviewId: id,
            orgId: org._id,
          },
        },
      );
    }
  },
});

export const addReply = mutation({
  args: {
    reviewId: v.id('reviews'),
    reply: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ message: 'You are not authorized' });
    }
    const user = await getAuthUserBySubject(ctx, identity.subject);
    if (!user) {
      throw new ConvexError({ message: 'User not found' });
    }
    const review = await ctx.db.get(args.reviewId);
    if (!review) {
      throw new ConvexError('Review not found');
    }
    const replyTo = await ctx.db.get(review.userId);
    const organization = await ctx.db.get(review.organizationId);

    if (!replyTo || !organization) {
      throw new ConvexError('Reply to not found');
    }

    await ctx.db.insert('replies', {
      ...args,
      from: user._id,
    });
    const title = `${organization.name}'s admin replied to your review`;
    await ctx.runMutation(internal.notifications.createNotification, {
      message: args.reply,
      title,
      userId: review.userId,
      reviewId: review._id,
      // reviewId: review._id,
    });
    if (replyTo.pushToken) {
      await ctx.scheduler.runAfter(
        0,
        internal.externalFuntions.sendPushNotificationConvex,
        {
          title,
          body: args.reply,
          expoPushToken: replyTo.pushToken,
          data: {
            type: 'reply',
          },
        },
      );
    }
  },
});
export const deleteReply = mutation({
  args: { replyId: v.id('replies') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ message: 'You are not authorized' });
    }
    const user = await getAuthUserBySubject(ctx, identity.subject);
    if (!user) {
      throw new ConvexError({ message: 'User not found' });
    }
    const reply = await ctx.db.get(args.replyId);
    if (!reply) {
      throw new ConvexError({ message: 'Reply not found' });
    }
    if (reply.from !== user._id) {
      throw new ConvexError({ message: 'You are not authorized' });
    }

    await ctx.db.delete(reply._id);
  },
});
export const editReply = mutation({
  args: {
    replyId: v.id('replies'),
    newReply: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ message: 'You are not authorized' });
    }
    const user = await getAuthUserBySubject(ctx, identity.subject);
    if (!user) {
      throw new ConvexError({ message: 'User not found' });
    }
    const reply = await ctx.db.get(args.replyId);
    if (!reply) {
      throw new ConvexError({ message: 'Reply not foun d' });
    }
    if (reply.from !== user._id) {
      throw new ConvexError({ message: 'You are not authorized' });
    }

    await ctx.db.patch(reply._id, {
      reply: args.newReply,
    });
  },
});

// queries

export const fetchReviews = query({
  args: {
    organizationId: v.id('organizations'),
  },
  handler: async (ctx, { organizationId }) => {
    const reviews = await ctx.db
      .query('reviews')
      .withIndex('by_organization_id', (q) =>
        q.eq('organizationId', organizationId),
      )
      .order('desc')
      .collect();
    if (!reviews.length) return [];
    return await Promise.all(
      reviews.map(async (review) => {
        const userProfile = await getUserByUserId(ctx, review.userId);
        return {
          ...review,
          user: userProfile,
        };
      }),
    );
  },
});

export const getPaginatedReviews = query({
  args: {
    organizationId: v.id('organizations'),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { organizationId, paginationOpts }) => {
    const reviews = await ctx.db
      .query('reviews')
      .withIndex('by_organization_id', (q) =>
        q.eq('organizationId', organizationId),
      )
      .order('desc')
      .paginate(paginationOpts);
    const page = await Promise.all(
      reviews.page.map(async (review) => {
        const userProfile = await getUserByUserId(ctx, review.userId);
        return {
          ...review,
          user: userProfile,
        };
      }),
    );
    return {
      ...reviews,
      page,
    };
  },
});

export const getReply = query({
  args: {
    reviewId: v.id('reviews'),
  },
  handler: async (ctx, { reviewId }) => {
    const reply = await ctx.db
      .query('replies')
      .withIndex('by_review_id', (q) => q.eq('reviewId', reviewId))
      .first();
    if (!reply) return null;
    const organization = await ctx.db
      .query('organizations')
      .withIndex('ownerId', (q) => q.eq('ownerId', reply?.from))
      .first();
    if (!organization) return null;

    return {
      organizationName: organization.name,
      reply: reply.reply,
      id: reply._id,
      creationTime: reply._creationTime,
    };
  },
});

export const getReview = query({
  args: {
    reviewId: v.id('reviews'),
  },
  handler: async (ctx, { reviewId }) => {
    const review = await ctx.db.get(reviewId);
    if (!review) return null;
    const userProfile = await getUserByUserId(ctx, review.userId);
    return {
      ...review,
      user: userProfile,
    };
  },
});

import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';

import { mutation, query } from '~/convex/_generated/server';
import { getUserByUserId } from '~/convex/users';

// mutation
export const addReview = mutation({
  args: {
    userId: v.id('users'),
    organizationId: v.id('organizations'),
    text: v.optional(v.string()),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('reviews', {
      ...args,
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
      .withIndex('by_organization_id', (q) => q.eq('organizationId', organizationId))
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
      })
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
      .withIndex('by_organization_id', (q) => q.eq('organizationId', organizationId))
      .order('desc')
      .paginate(paginationOpts);
    const page = await Promise.all(
      reviews.page.map(async (review) => {
        const userProfile = await getUserByUserId(ctx, review.userId);
        return {
          ...review,
          user: userProfile,
        };
      })
    );
    return {
      ...reviews,
      page,
    };
  },
});

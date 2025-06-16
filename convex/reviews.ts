import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { mutation, query } from "~/convex/_generated/server";
import { getUserByUserId } from "~/convex/users";

// mutation
export const addReview = mutation({
  args: {
    userId: v.id("users"),
    organizationId: v.id("organizations"),
    text: v.optional(v.string()),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("reviews", {
      ...args,
    });
  },
});

export const addReply = mutation({
  args: {
    reviewId: v.id("reviews"),
    from: v.id("users"),
    reply: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("replies", {
      ...args,
    });
  },
});

// queries

export const fetchReviews = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, { organizationId }) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", organizationId),
      )
      .order("desc")
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
    organizationId: v.id("organizations"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { organizationId, paginationOpts }) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", organizationId),
      )
      .order("desc")
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
    reviewId: v.id("reviews"),
  },
  handler: async (ctx, { reviewId }) => {
    const reply = await ctx.db
      .query("replies")
      .withIndex("by_review_id", (q) => q.eq("reviewId", reviewId))
      .first();
    if (!reply) return null;
    const organization = await ctx.db
      .query("organizations")
      .withIndex("ownerId", (q) => q.eq("ownerId", reply?.from))
      .first();
    if (!organization) return null;

    return {
      organizationName: organization.name,
      reply: reply.reply,
      id: reply._id,
      creationTime: reply._creationTime
    };
  },
});

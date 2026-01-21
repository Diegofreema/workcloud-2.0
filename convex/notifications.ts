import { v } from 'convex/values';

import { internalMutation, mutation, query } from './_generated/server';
import { paginationOptsValidator } from 'convex/server';
import { getLoggedInUser } from './users';
import { Id } from './_generated/dataModel';

export const getNotifications = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await getLoggedInUser(ctx, 'query');

    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_user_id', (q) => q.eq('userId', user?._id as Id<'users'>))
      .order('desc')
      .paginate(args.paginationOpts);

    const page = await Promise.all(
      notifications.page.map(async (n) => {
        let image = '';
        if (n.reviewId) {
          const review = await ctx.db.get(n.reviewId);
          const user = await ctx.db.get(review?.userId!);
          if (user) {
            image = user.image as string;
          }
        } else if (n.requestId) {
          const org = await ctx.db.get(n.requestId);
          if (org) {
            image = org.avatar as string;
          }
        } else {
          image = n.imageUrl as string;
        }

        return {
          ...n,
          image,
        };
      }),
    );

    return {
      ...notifications,
      page,
    };
  },
});

export const getUnreadNotificationCount = query({
  handler: async (ctx) => {
    const user = await getLoggedInUser(ctx, 'query');
    if (!user) return 0;
    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_user_id', (q) => q.eq('userId', user._id))
      .filter((q) => q.eq(q.field('seen'), false))
      .collect();

    return notifications.length || 0;
  },
});

export const createNotification = internalMutation({
  args: {
    userId: v.id('users'),
    message: v.string(),
    title: v.string(),
    requestId: v.optional(v.id('organizations')),
    reviewId: v.optional(v.id('reviews')),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('notifications', {
      userId: args.userId,
      message: args.message,
      title: args.title,
      requestId: args.requestId,
      reviewId: args.reviewId,
      seen: false,
    });
  },
});

export const markNotificationAsRead = mutation({
  handler: async (ctx, args) => {
    const user = await getLoggedInUser(ctx, 'mutation');
    if (!user) return;
    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_user_id_seen', (q) =>
        q.eq('userId', user._id).eq('seen', false),
      )
      .collect();
    for (const notificationId of notifications) {
      await ctx.db.patch(notificationId._id, {
        seen: true,
      });
    }
  },
});

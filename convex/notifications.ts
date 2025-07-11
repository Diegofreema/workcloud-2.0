import { v } from 'convex/values';

import { internalMutation, mutation, query } from './_generated/server';
import { paginationOptsValidator } from 'convex/server';

export const getNotifications = query({
  args: {
    userId: v.id('users'),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .paginate(args.paginationOpts);

    const page = await Promise.all(
      notifications.page.map(async (n) => {
        let image = '';
        if (n.reviewerId) {
          const user = await ctx.db.get(n.reviewerId);
          if (user) {
            image = user.imageUrl as string;
          }
        }
        if (n.requestId) {
          const org = await ctx.db.get(n.requestId);
          if (org) {
            image = org.avatar as string;
          }
        }

        return {
          ...n,
          image,
        };
      })
    );

    return {
      ...notifications,
      page,
    };
  },
});

export const getUnreadNotificationCount = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
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
    reviewerId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('notifications', {
      userId: args.userId,
      message: args.message,
      title: args.title,
      requestId: args.requestId,
      seen: false,
    });
  },
});

export const markNotificationAsRead = mutation({
  args: {
    id: v.id('users'),
  },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_user_id_seen', (q) =>
        q.eq('userId', args.id).eq('seen', false)
      )
      .collect();
    for (const notificationId of notifications) {
      await ctx.db.patch(notificationId._id, {
        seen: true,
      });
    }
  },
});

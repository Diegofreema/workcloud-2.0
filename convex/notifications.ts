import { v } from 'convex/values';

import { internalMutation, mutation, query } from './_generated/server';

export const getNotifications = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('notifications')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();
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

    return notifications.length;
  },
});

export const createNotification = internalMutation({
  args: {
    userId: v.id('users'),
    message: v.string(),
    title: v.string(),
    requestId: v.optional(v.id('requests')),
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
    id: v.array(v.id('notifications')),
  },
  handler: async (ctx, args) => {
    for (const notificationId of args.id) {
      await ctx.db.patch(notificationId, {
        seen: true,
      });
    }
  },
});

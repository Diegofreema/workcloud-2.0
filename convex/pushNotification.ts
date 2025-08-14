import { PushNotifications } from '@convex-dev/expo-push-notifications';
import { components } from './_generated/api.js';
import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server.js';
import { getAuthUserId } from '@convex-dev/auth/server';
export type Email = string & { __isEmail: true };

const pushNotifications = new PushNotifications(components.pushNotifications);

export const recordPushNotificationToken = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    // Record push notification tokens
    await pushNotifications.recordToken(ctx, {
      userId: userId,
      pushToken: args.token,
    });
    // Query the push notification status for a user
    const status = await pushNotifications.getStatusForUser(ctx, {
      userId: userId,
    });
    if (!status.hasToken) {
      throw new ConvexError('Failed to record token');
    }
  },
});

export const sendPushNotification = mutation({
  args: {
    title: v.string(),
    to: v.id('users'),
    body: v.string(),
    data: v.record(v.string(), v.string()),
  },
  handler: async (ctx, args) => {
    // Sending a notification
    return pushNotifications.sendPushNotification(ctx, {
      userId: args.to,
      notification: {
        title: args.title,
        body: args.body,
        data: args.data,
      },
    });
  },
});

export const getNotificationStatus = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const notification = await pushNotifications.getNotification(ctx, args);
    return notification?.state;
  },
});

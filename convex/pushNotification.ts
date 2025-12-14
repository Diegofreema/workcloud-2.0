import { PushNotifications } from '@convex-dev/expo-push-notifications';
import { ConvexError, v } from 'convex/values';
import { api, components, internal } from './_generated/api.js';
import { internalAction } from './_generated/server';
import { mutation, query } from './_generated/server.js';
import { getUserByIdHelper } from './users.js';
const pushNotifications = new PushNotifications(components.pushNotifications);

export const recordPushNotificationToken = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const user = await getUserByIdHelper(ctx, identity.subject);
    if (!user) {
      return null;
    }
    // Record push notification tokens
    await pushNotifications.recordToken(ctx, {
      userId: user._id,
      pushToken: args.token,
    });
    // Query the push notification status for a user
    const status = await pushNotifications.getStatusForUser(ctx, {
      userId: user._id,
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
  args: { id: v.id('users') },
  handler: async (ctx, args) => {
    const notification = await pushNotifications.getNotification(ctx, args);
    return notification?.state;
  },
});

// Send to all users with pagination and rate limiting

const BATCH_SIZE = 1000; // Users per pagination batch
const DELAY_MS = 2000; // 2-second delay between batches (~500 notifications/sec)

// Send to all users with pagination and rate limiting
export const sendToAllUsers = internalAction({
  args: {
    orgId: v.id('organizations'),
    message: v.string(),
    cursor: v.optional(v.union(v.string(), v.null())), // Optional cursor for pagination
  },
  handler: async (ctx, { orgId, message, cursor: initialCursor = null }) => {
    let cursor = initialCursor;
    let isDone = false;

    while (!isDone) {
      // Fetch users with pagination using a query
      const pageResult = await ctx.runQuery(api.users.getUsersWithTokens, {
        cursor,
        numItems: BATCH_SIZE,
      });

      const users = pageResult.page;

      if (users.length === 0) {
        break; // No more users
      }

      const notifications = users.map((user) => ({
        userId: user._id,
        notification: {
          title: 'New Organization Alert',
          body: message,
          data: { orgId: orgId.toString() }, // Custom data for deep links
        },
      }));

      // Send the batch (component auto-batches to 100 tokens/request)

      // Handle errors (e.g., invalid tokens)
      for (const result of notifications) {
        await pushNotifications.sendPushNotification(ctx, {
          userId: result.userId,
          notification: result.notification,
        });
      }

      console.log(`Sent to ${users.length} users in this batch`);

      // Rate limiting: Delay before next batch
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));

      // Update for next iteration
      cursor = pageResult.continueCursor;
      isDone = pageResult.isDone;

      // Chain to a new action if more pages remain (to avoid timeout)
      if (!isDone && cursor !== null) {
        await ctx.scheduler.runAfter(
          0,
          internal.pushNotification.sendToAllUsers,
          {
            orgId,
            message,
            cursor,
          }
        );
        console.log('Chaining to next action for remaining users');
        return; // Exit to avoid timeout
      }
    }

    console.log('All notifications sent');
  },
});

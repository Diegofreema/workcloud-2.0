import { v } from 'convex/values';
import { internalAction } from './_generated/server';

export const sendPushNotificationConvex = internalAction({
  args: {
    body: v.string(),
    data: v.record(v.string(), v.string()),
    title: v.string(),
    expoPushToken: v.string(),
  },
  async handler(ctx, { body, data, expoPushToken, title }) {
    const message = {
      to: expoPushToken,
      title,
      body,
      sound: 'default',
      data,
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  },
});

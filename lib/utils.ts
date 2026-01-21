import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import * as Updates from 'expo-updates';
import { ConvexReactClient } from 'convex/react';
import { Id } from '~/convex/_generated/dataModel';
import { api } from '~/convex/_generated/api';

const BACKGROUND_TASK_NAME = 'task-run-expo-update';

TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  const update = await Updates.checkForUpdateAsync();
  if (update.isAvailable) {
    await Updates.fetchUpdateAsync();

    // You may not want to reload the app while it is backgrounded, this
    // will impact the user experience if your app state isn't saved
    // and restored.
    await Updates.reloadAsync();
  }
});

export async function registerTask() {
  const isRegistered = TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);
  if (!isRegistered) {
    await BackgroundTask.registerTaskAsync(BACKGROUND_TASK_NAME, {
      minimumInterval: 30, // Try to repeat every 30 minutes while backgrounded
    });
  }
}

type Props = {
  title: string;
  body: string;
  data: Record<string, string>;
  to: Id<'users'>;
};

export const convexPushNotificationsHelper = async (
  convex: ConvexReactClient,
  { body, data, title, to }: Props,
) => {
  try {
    return await convex.mutation(api.pushNotification.sendPushNotification, {
      body,
      data,
      title,
      to,
    });
  } catch (error) {
    console.log(error);
  }
};

export function getArticle(word: string) {
  if (!word || typeof word !== 'string') {
    return 'a';
  }

  const firstLetter = word.trim().toLowerCase().charAt(0);
  const vowels = ['a', 'e', 'i', 'o', 'u'];

  return vowels.includes(firstLetter) ? 'an' : 'a';
}
export type Reaction = {
  type: 'like' | 'love' | 'haha' | 'sad' | 'wow';
};
export const trimText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3) + '...';
  }
  return text;
};

export const renderReaction = (
  reaction?: Reaction,
  userId?: string,
  reactUserId?: string,
  reactUserName?: string,
) => {
  const isMyReaction = userId === reactUserId;
  if (!reaction) return '';

  if (reaction.type === 'like') {
    return `${isMyReaction ? 'You reacted 👍 to ' : `${reactUserName} reacted 👍 to `}`;
  }
  if (reaction.type === 'love') {
    return `${isMyReaction ? 'You reacted ❤️ to ' : `${reactUserName} reacted ❤️ to `}`;
  }
  if (reaction.type === 'haha') {
    return `${isMyReaction ? 'You reacted 😂 to ' : `${reactUserName} reacted 😂 to `}`;
  }
  if (reaction.type === 'sad') {
    return `${isMyReaction ? 'You reacted 😢 to ' : `${reactUserName} reacted 😢 to `}`;
  }
  if (reaction.type === 'wow') {
    return `${isMyReaction ? 'You reacted 😲 to ' : `${reactUserName} reacted 😲 to `}`;
  }
  return '';
};

export const changeFirstLetterToUpperCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const generateRandomString = (length: number = 20) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

import { useQuery } from 'convex/react';
import { useAuth } from '~/context/auth';
import { api } from '~/convex/_generated/api';

export const useUnreadMessageCount = () => {
  const unreadCount = useQuery(api.conversation.getUnreadAllMessages);

  return unreadCount || 0;
};
export const useUnreadProcessorMessageCount = () => {
  const { user } = useAuth();

  const id = user?._id;
  const unreadCount = useQuery(
    api.conversation.getUnreadProcessorMessages,
    id ? { userId: id } : 'skip'
  );

  return unreadCount || 0;
};

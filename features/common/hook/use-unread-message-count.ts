import { useQuery } from 'convex/react';
import { api } from '~/convex/_generated/api';
import { useGetUserId } from '~/hooks/useGetUserId';

export const useUnreadMessageCount = () => {
  const unreadCount = useQuery(api.conversation.getUnreadAllMessages);

  return unreadCount || 0;
};
export const useUnreadProcessorMessageCount = () => {
  const { id } = useGetUserId();
  const unreadCount = useQuery(
    api.conversation.getUnreadProcessorMessages,
    id ? { userId: id } : 'skip'
  );

  return unreadCount || 0;
};

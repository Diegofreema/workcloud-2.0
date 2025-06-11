import {useQuery} from "convex/react";
import {api} from "~/convex/_generated/api";
import {useGetUserId} from "~/hooks/useGetUserId";

export const useUnreadMessageCount = () => {
  const { id } = useGetUserId();
  const unreadCount = useQuery(
    api.conversation.getUnreadAllMessages,
    id ? { userId: id } : "skip",
  );

  return unreadCount || 0;
};

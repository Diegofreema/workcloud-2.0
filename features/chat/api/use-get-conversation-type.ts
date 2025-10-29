import { useQuery } from 'convex/react';
import { api } from '~/convex/_generated/api';

type ConversationProps = {
  type: 'processor' | 'single';
};

export const useGetConversationType = ({ type }: ConversationProps) => {
  return useQuery(api.conversation.getConversations, { type });
};

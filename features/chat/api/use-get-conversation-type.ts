import { useQuery } from 'convex/react';
import { api } from '~/convex/_generated/api';

type ConversationProps = {
  type: 'processor' | 'single';
};

export const useGetConversationType = ({ type }: ConversationProps) => {
  console.log({ type });

  return useQuery(api.conversation.getConversations, { type });
};

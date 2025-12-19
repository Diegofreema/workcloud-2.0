import { convexQuery } from '@convex-dev/react-query';
import { useQuery as useTanstackQuery } from '@tanstack/react-query';
import { usePaginatedQuery, useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { ChatComponentNative } from '~/components/Ui/ChatComponent.native';
import { ChatHeader } from '~/components/Ui/ChatHeader';
import ChatSkeleton from '~/components/Ui/ChatSkeleton';
import { Container } from '~/components/Ui/Container';
import { useAuth } from '~/context/auth';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useCreateConvo } from '~/hooks/useCreateConvo';
import { useMarkRead } from '~/hooks/useMarkRead';

const SingleChat = () => {
  const { chatId: userToChat, type } = useLocalSearchParams<{
    chatId: Id<'users'>;
    type: 'single' | 'processor';
  }>();

  const { user } = useAuth();
  const loggedInUserId = user?.id;
  const { data: conversationData, isPending } = useTanstackQuery(
    convexQuery(api.conversation.getSingleConversationWithMessages, {
      otherUserId: userToChat,
      type,
    })
  );
  const {
    status,
    loadMore,
    results: data,
    isLoading,
  } = usePaginatedQuery(
    api.conversation.getMessages,
    {
      conversationId: conversationData?._id,
    },
    { initialNumItems: 100 }
  );
  const loading = useCreateConvo({
    conversationData: conversationData!,
    id: userToChat!,
    type,
  });
  useMarkRead({
    conversationData: conversationData!,
  });
  const otherUser = useQuery(api.users.getUserById, { id: userToChat });
  if (otherUser === undefined || isPending || loading) return <ChatSkeleton />;

  return (
    <Container noPadding>
      <ChatHeader
        name={otherUser?.name as string}
        imageUrl={otherUser?.image as string}
      />
      <ChatComponentNative
        conversationId={conversationData?._id as Id<'conversations'>}
        otherUserId={userToChat}
        otherUserName={otherUser?.name as string}
        pushToken={otherUser?.pushToken as string}
        createdAt={conversationData?._creationTime as number}
        loggedInUserId={loggedInUserId as string}
        data={data || []}
        status={status}
        loadMore={loadMore}
        type={type}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default SingleChat;

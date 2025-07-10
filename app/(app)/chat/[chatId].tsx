import { convexQuery } from '@convex-dev/react-query';
import { useQuery as useTanstackQuery } from '@tanstack/react-query';
import { usePaginatedQuery, useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { ChatComponentNative } from '~/components/Ui/ChatComponent.native';
import { ChatHeader } from '~/components/Ui/ChatHeader';
import ChatSkeleton from '~/components/Ui/ChatSkeleton';
import { Container } from '~/components/Ui/Container';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useCreateConvo } from '~/hooks/useCreateConvo';
import { useGetUserId } from '~/hooks/useGetUserId';
import { useMarkRead } from '~/hooks/useMarkRead';

const SingleChat = () => {
  const { chatId: userToChat, type } = useLocalSearchParams<{
    chatId: Id<'users'>;
    type: 'single' | 'processor';
  }>();

  const { id: loggedInUserId } = useGetUserId();
  console.log({ type, userToChat, loggedInUserId });

  const { data: conversationData, isPending } = useTanstackQuery(
    convexQuery(api.conversation.getSingleConversationWithMessages, {
      loggedInUserId: loggedInUserId!,
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
      conversationId: conversationData?._id!,
    },
    { initialNumItems: 100 }
  );
  const loading = useCreateConvo({
    loggedInUserId: loggedInUserId!,
    conversationData: conversationData!,
    id: userToChat!,
    type,
  });
  useMarkRead({
    conversationData: conversationData!,
    loggedInUserId: loggedInUserId!,
  });
  const otherUser = useQuery(api.users.getUserById, { id: userToChat });
  if (otherUser === undefined || isPending || loading) return <ChatSkeleton />;

  return (
    <Container noPadding>
      <ChatHeader name={otherUser?.name!} imageUrl={otherUser?.imageUrl!} />
      <ChatComponentNative
        conversationId={conversationData?._id!}
        otherUserId={userToChat}
        otherUserName={otherUser?.name!}
        pushToken={otherUser?.pushToken}
        createdAt={conversationData?._creationTime!}
        loggedInUserId={loggedInUserId!}
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

import { convexQuery } from '@convex-dev/react-query';
import { useQuery as useTanstackQuery } from '@tanstack/react-query';
import { usePaginatedQuery, useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { ChatHeader } from '~/components/Ui/ChatHeader';
import ChatSkeleton from '~/components/Ui/ChatSkeleton';
import { Container } from '~/components/Ui/Container';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useCreateConvo } from '~/hooks/useCreateConvo';
import { useGetUserId } from '~/hooks/useGetUserId';
import { useMarkRead } from '~/hooks/useMarkRead';
import { ChatComponentNative } from '~/components/Ui/ChatComponent.native';

const ProcessorSingleChat = () => {
  const { chatId: userToChat } = useLocalSearchParams<{
    chatId: Id<'users'>;
  }>();
  const { id: loggedInUserId } = useGetUserId();
  console.log({ userToChat, loggedInUserId });
  const { data: conversationData, isPending } = useTanstackQuery(
    convexQuery(api.conversation.getSingleConversationWithMessages, {
      otherUserId: userToChat,
      type: 'processor',
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
    type: 'processor',
  });
  useMarkRead({
    conversationData: conversationData!,
  });
  const otherUser = useQuery(api.users.getUserById, { id: userToChat });
  if (!otherUser || isPending || loading) return <ChatSkeleton />;

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
        createdAt={conversationData?._creationTime as number}
        loggedInUserId={loggedInUserId!}
        data={data || []}
        status={status}
        loadMore={loadMore}
        isLoading={isLoading && status !== 'LoadingFirstPage'}
        type="processor"
      />
    </Container>
  );
};

export default ProcessorSingleChat;

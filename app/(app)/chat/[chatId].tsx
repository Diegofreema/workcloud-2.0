import { convexQuery } from '@convex-dev/react-query';
import { useQuery as useTanstackQuery } from '@tanstack/react-query';
import { usePaginatedQuery, useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { ChatComponent } from '~/components/Ui/ChatComponent';
import { ChatHeader } from '~/components/Ui/ChatHeader';
import ChatSkeleton from '~/components/Ui/ChatSkeleton';
import { Container } from '~/components/Ui/Container';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useCreateConvo } from '~/hooks/useCreateConvo';
import { useGetUserId } from '~/hooks/useGetUserId';
import { useMarkRead } from '~/hooks/useMarkRead';

const SingleChat = () => {
  const { chatId: userToChat } = useLocalSearchParams<{ chatId: Id<'users'> }>();
  const { id: loggedInUserId } = useGetUserId();

  const { data: conversationData, isPending } = useTanstackQuery(
    convexQuery(api.conversation.getSingleConversationWithMessages, {
      loggedInUserId: loggedInUserId!,
      otherUserId: userToChat,
    })
  );
  const {
    status,
    loadMore,
    results: data,
  } = usePaginatedQuery(
    api.conversation.getMessages,
    {
      conversationId: conversationData?.conversation?._id!,
    },
    { initialNumItems: 100 }
  );
  const loading = useCreateConvo({
    loggedInUserId: loggedInUserId!,
    conversationData: conversationData!,
    id: userToChat!,
    type: 'single',
  });
  useMarkRead({
    conversationData: conversationData!,
    loggedInUserId: loggedInUserId!,
  });
  const otherUser = useQuery(api.users.getUserById, { id: userToChat });
  if (!otherUser || isPending || loading) return <ChatSkeleton />;

  return (
    <Container noPadding>
      <ChatHeader name={otherUser?.name!} imageUrl={otherUser?.imageUrl!} />
      <ChatComponent
        conversationId={conversationData?.conversation?._id!}
        otherUserId={userToChat}
        otherUserName={conversationData?.otherUser?.name!}
        createdAt={conversationData?.conversation?._creationTime!}
        loggedInUserId={loggedInUserId!}
        data={data || []}
        status={status}
        loadMore={loadMore}
      />
    </Container>
  );
};

export default SingleChat;

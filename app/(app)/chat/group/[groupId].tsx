import { usePaginatedQuery, useQuery } from 'convex/react';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { toast } from 'sonner-native';
import { ChatHeader } from '~/components/Ui/ChatHeader';
import ChatSkeleton from '~/components/Ui/ChatSkeleton';
import { Container } from '~/components/Ui/Container';
import { useAuth } from '~/context/auth';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { ChatMenu } from '~/features/chat/components/chat-menu';
import { ChatGroupComponent } from '~/features/chat/components/group-gifted-chat.native';
import { useMarkRead } from '~/hooks/useMarkRead';

const GroupChatScreen = () => {
  const { groupId } = useLocalSearchParams<{ groupId: Id<'conversations'> }>();
  const { user } = useAuth();
  const loggedInUserId = user?._id;
  const group = useQuery(api.conversation.getGroup, { groupId });
  const {
    status,
    loadMore,
    results: data,
    isLoading,
  } = usePaginatedQuery(
    api.conversation.getGroupMessages,
    group && loggedInUserId
      ? {
          conversationId: group?._id!,
          loggedInUserId,
        }
      : 'skip',
    { initialNumItems: 100 }
  );
  useMarkRead({
    conversationData: group!,
  });
  if (group === undefined) {
    return <ChatSkeleton />;
  }

  if (group === null) {
    return <Redirect href={'/message'} />;
  }
  const isInGroup = !!group?.participants.includes(loggedInUserId!);
  if (!isInGroup) {
    toast.error('You are not in this group');
    return <Redirect href={'/message'} />;
  }
  const isCreator = group?.creatorId === loggedInUserId;

  return (
    <Container noPadding>
      <ChatHeader
        name={group?.name || 'Group'}
        imageUrl={group?.imageUrl || ''}
        rightContent={
          isCreator ? (
            <ChatMenu
              menuItems={[
                {
                  text: 'Group info',
                  onSelect: () =>
                    router.push(`/group-info?groupId=${group?._id}`),
                },
              ]}
            />
          ) : null
        }
      />
      <ChatGroupComponent
        conversationId={group?._id!}
        createdAt={group?._creationTime!}
        loggedInUserId={loggedInUserId!}
        data={data || []}
        status={status}
        loadMore={loadMore}
        isLoading={isLoading}
      />
    </Container>
  );
};
export default GroupChatScreen;

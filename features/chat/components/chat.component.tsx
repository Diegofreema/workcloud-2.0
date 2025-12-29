import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Channel as ChannelType } from 'stream-chat';
import { ChannelList } from 'stream-chat-expo';
import { useAppChatContext } from '~/components/providers/chat-context';
import { Container } from '~/components/Ui/Container';
import { useAuth } from '~/context/auth';
import { CustomListItem } from './custom-list-item';
import { MessageEmpty } from './message-empty';

export const ChatComponent = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { setChannel } = useAppChatContext();
  const id = user?._id!;
  const filters = useMemo(
    () => ({
      members: { $in: [id] },
      type: 'messaging',
    }),
    [id]
  );
  const sort = { last_updated: -1 } as any;
  const options = {
    state: true,
    watch: true,
  };
  const onPress = (channel: ChannelType) => {
    setChannel(channel);
    router.push(`/chat/${channel.cid}`);
  };

  return (
    <Container>
      <ChannelList
        filters={filters}
        options={options}
        sort={sort}
        onSelect={onPress}
        numberOfSkeletons={20}
        Preview={CustomListItem}
        EmptyStateIndicator={MessageEmpty}
      />
    </Container>
  );
};

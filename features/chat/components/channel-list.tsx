import { View, Text } from 'react-native';
import React from 'react';
import { ChannelList as Channels } from 'stream-chat-expo';
import { useRouter } from 'expo-router';
import { useAppChatContext } from '~/components/providers/chat-context';
import { ChannelFilters, Channel as ChannelType } from 'stream-chat';
import { CustomListItem } from './custom-list-item';
import { MessageEmpty } from './message-empty';
type Props = {
  filters: ChannelFilters;
};

export const ChannelList = ({ filters }: Props) => {
  const router = useRouter();
  const { setChannel } = useAppChatContext();
  const onPress = (channel: ChannelType) => {
    setChannel(channel);
    router.push(`/chat/${channel.cid}`);
  };
  const sort = { last_updated: -1 } as any;
  const options = {
    state: true,
    watch: true,
  };
  return (
    <Channels
      filters={filters}
      options={options}
      sort={sort}
      onSelect={onPress}
      numberOfSkeletons={20}
      Preview={CustomListItem}
      EmptyStateIndicator={MessageEmpty}
    />
  );
};

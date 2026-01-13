import { useRouter } from 'expo-router';
import React from 'react';
import {
  ChannelFilters,
  ChannelSort,
  Channel as ChannelType,
} from 'stream-chat';
import { ChannelList as Channels } from 'stream-chat-expo';
import { useAppChatContext } from '~/components/providers/chat-context';
import { CustomListItem } from './custom-list-item';
import { MessageEmpty } from './message-empty';
type Props = {
  filters: ChannelFilters;
};

export const ChannelList = ({ filters }: Props) => {
  const router = useRouter();
  const { setChannel } = useAppChatContext();
  const onPress = (channel: ChannelType) => {
    console.log('channel pressed');

    setChannel(channel);
    console.log(channel.cid);

    router.push(`/chat/${channel.cid}`);
  };
  const sort = { last_updated: -1 } as ChannelSort;
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

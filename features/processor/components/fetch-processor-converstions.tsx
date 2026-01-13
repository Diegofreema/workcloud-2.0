import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import {
  ChannelFilters,
  ChannelSort,
  Channel as ChannelType,
} from 'stream-chat';

import { ChannelList as Channels } from 'stream-chat-expo';
import { useAppChatContext } from '~/components/providers/chat-context';
import { colors } from '~/constants/Colors';
import { useAuth } from '~/context/auth';
import { CustomListItem } from '~/features/chat/components/custom-list-item';
import { MessageEmpty } from '~/features/chat/components/message-empty';
import { IconBtn } from '~/features/common/components/icon-btn';
import { SearchComponent } from '~/features/common/components/SearchComponent';

export const FetchProcessorConversations = () => {
  const router = useRouter();
  const { user } = useAuth();
  const id = user?.id!;

  const [value, setValue] = useState('');
  const filters: ChannelFilters = useMemo(
    () => ({
      members: { $in: [id] },
      type: 'messaging',
      filter_tags: { $eq: ['processor'] },
      'member.user.name': value ? { $autocomplete: value } : undefined,
    }),
    [id, value]
  );

  const { setChannel } = useAppChatContext();
  const onPress = (channel: ChannelType) => {
    console.log('channel pressed');

    setChannel(channel);
    console.log(channel.cid);

    router.push(`/chat/${channel.cid}`);
  };
  const onPress2 = () => {
    router.push('/processors/processors');
  };
  const sort = { last_updated: -1 } as ChannelSort;
  const options = {
    state: true,
    watch: true,
  };
  return (
    <View style={{ flex: 1 }}>
      <SearchComponent
        show={false}
        placeholder={'Search messages...'}
        value={value}
        setValue={setValue}
        showArrow={false}
      />
      <Channels
        filters={filters}
        options={options}
        sort={sort}
        onSelect={onPress}
        numberOfSkeletons={20}
        Preview={CustomListItem}
        EmptyStateIndicator={MessageEmpty}
      />
      <IconBtn onPress={onPress2} content={<Plus color={colors.white} />} />
    </View>
  );
};

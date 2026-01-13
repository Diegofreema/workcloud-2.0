import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { ChannelFilters, Channel as ChannelType } from 'stream-chat';
import { useAppChatContext } from '~/components/providers/chat-context';
import { useAuth } from '~/context/auth';
import { ChannelList } from '~/features/chat/components/channel-list';
import { SearchComponent } from '~/features/common/components/SearchComponent';
import { Title } from '~/features/common/components/title';
export const FetchMessages = () => {
  const { user } = useAuth();
  const id = user?.id!;
  const { setChannel } = useAppChatContext();
  const onPress = (channel: ChannelType) => {
    setChannel(channel);
    router.push(`/chat/${channel.cid}`);
  };
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
  console.log({ value });

  return (
    <View style={{ flex: 1, marginTop: 20, gap: 10 }}>
      <Title title={'Messages'} fontSize={2} />
      <SearchComponent
        show={false}
        placeholder={'Search messages...'}
        value={value}
        setValue={setValue}
        showArrow={false}
      />
      <ChannelList filters={filters} />
    </View>
  );
};

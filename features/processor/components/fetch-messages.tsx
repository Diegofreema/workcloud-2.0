import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { ChatPreviewSkeleton } from '~/components/ChatPreviewSkeleton';
import { useAuth } from '~/context/auth';
import { useGetConversationType } from '~/features/chat/api/use-get-conversation-type';
import { ChannelList } from '~/features/chat/components/channel-list';
import { RenderChats } from '~/features/chat/components/render-single-chats';
import { SearchComponent } from '~/features/common/components/SearchComponent';
import { Title } from '~/features/common/components/title';
import { ChannelFilters } from 'stream-chat';
export const FetchMessages = () => {
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

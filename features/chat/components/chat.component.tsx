import { useQuery } from 'convex/react';
import { useState } from 'react';
import Animated, { SlideInLeft } from 'react-native-reanimated';
import { useDebounce } from 'use-debounce';
import { ChatPreviewSkeleton } from '~/components/ChatPreviewSkeleton';
import { constantStyles } from '~/constants/styles';
import { api } from '~/convex/_generated/api';
import { useGetConversationType } from '~/features/chat/api/use-get-conversation-type';
import { RenderChats } from '~/features/chat/components/render-single-chats';
import { SearchComponent } from '~/features/common/components/SearchComponent';

export const ChatComponent = () => {
  const [value, setValue] = useState('');

  const [query] = useDebounce(value, 500);

  const queryData = useGetConversationType({
    type: 'single',
  });
  const searchQuery = useQuery(api.conversation.getConversationsSingleSearch, {
    query,
  });
  if (searchQuery === undefined || queryData === undefined)
    return (
      <Animated.View
        key={'group'}
        entering={SlideInLeft}
        style={constantStyles.full}
      >
        <SearchComponent
          show={false}
          placeholder={'Search messages...'}
          value={value}
          setValue={setValue}
          showArrow={false}
        />
        <ChatPreviewSkeleton length={4} />
      </Animated.View>
    );
  const safeData = searchQuery || [];

  const sortedResults =
    queryData?.sort(
      (a, b) => (b?.lastMessageTime || 0) - (a.lastMessageTime || 0)
    ) || [];
  const data = query ? safeData : sortedResults;

  return (
    <Animated.View key={'single'} entering={SlideInLeft} style={{ flex: 1 }}>
      <SearchComponent
        show={false}
        placeholder={'Search messages...'}
        value={value}
        setValue={setValue}
        showArrow={false}
      />
      {query && searchQuery === undefined ? (
        <ChatPreviewSkeleton length={4} />
      ) : (
        <RenderChats chats={data} />
      )}
    </Animated.View>
  );
};

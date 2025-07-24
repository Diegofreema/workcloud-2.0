import { useQuery } from 'convex/react';
import { View } from 'react-native';
import Animated, { SlideInRight } from 'react-native-reanimated';
import { ChatPreviewSkeleton } from '~/components/ChatPreviewSkeleton';
import { constantStyles } from '~/constants/styles';
import { api } from '~/convex/_generated/api';
import { RenderGroupChats } from '~/features/chat/components/render-group-chat';
import { SearchComponent } from '~/features/common/components/SearchComponent';
import { useSearch } from '~/features/common/hook/use-search';

export const GroupChats = () => {
  const { value, setValue, query } = useSearch();

  const paginatedQuery = useQuery(
    api.conversation.getGroupConversationThatIAmIn,
    {}
  );

  const searchQuery = useQuery(api.conversation.getConversationsGroupSearch, {
    query,
  });

  if (searchQuery === undefined || paginatedQuery === undefined)
    return (
      <Animated.View
        key={'group'}
        entering={SlideInRight}
        style={constantStyles.full}
      >
        <SearchComponent
          show={false}
          placeholder={'Search messages...'}
          value={value}
          setValue={setValue}
        />
        <ChatPreviewSkeleton length={4} />
      </Animated.View>
    );
  const sortedResults = paginatedQuery.sort(
    (a, b) => (b?.lastMessageTime || 0) - (a.lastMessageTime || 0)
  );
  const data = query ? searchQuery : sortedResults;

  const finalData = data.map((item) => ({
    name: item.name!,
    id: item._id,
    lastMessage: item.lastMessage,
    lastMessageSenderId: item.lastMessageSenderId,
    image: item.imageUrl,
    lastMessageTime: item.lastMessageTime,
    creatorId: item.creatorId!,
  }));
  return (
    <View style={constantStyles.full}>
      <SearchComponent
        show={false}
        placeholder={'Search messages...'}
        value={value}
        setValue={setValue}
      />
      {query && searchQuery === undefined ? (
        <ChatPreviewSkeleton length={4} />
      ) : (
        <RenderGroupChats chats={finalData} />
      )}
    </View>
  );
};

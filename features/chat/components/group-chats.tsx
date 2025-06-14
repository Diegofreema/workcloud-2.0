import {View} from "react-native";
import {constantStyles} from "~/constants/styles";
import {SearchComponent} from "~/features/common/components/SearchComponent";
import {useSearch} from "~/features/common/hook/use-search";
import {useGetUserId} from "~/hooks/useGetUserId";
import {usePaginatedQuery, useQuery} from "convex/react";
import {api} from "~/convex/_generated/api";
import {useCallback} from "react";
import {ChatPreviewSkeleton} from "~/components/ChatPreviewSkeleton";
import {RenderGroupChats} from "~/features/chat/components/render-group-chat";
import Animated, {SlideInRight} from "react-native-reanimated";

export const GroupChats = () => {
  const { value, setValue, query } = useSearch();
  const { id } = useGetUserId();

  const paginatedQuery = usePaginatedQuery(
    api.conversation.getGroupConversationThatIAmIn,
    id ? { loggedInUserId: id } : "skip",
    { initialNumItems: 20 },
  );

  const searchQuery = useQuery(
    api.conversation.getConversationsGroupSearch,
    id ? { query, userId: id } : "skip",
  );
  const { results, loadMore, isLoading, status } = paginatedQuery;

  const handleMore = useCallback(() => {
    if (!query) {
      if (status === "CanLoadMore" && !isLoading) {
        loadMore(20);
      }
    }
  }, [status, isLoading, loadMore]);
  const sortedResults = results.sort(
    (a, b) => (b?.lastMessageTime || 0) - (a.lastMessageTime || 0),
  );
  const data = query ? searchQuery : sortedResults;
  if (data === undefined)
    return (
      <Animated.View
        key={"group"}
        entering={SlideInRight}
        style={constantStyles.full}
      >
        <SearchComponent
          show={false}
          placeholder={"Search messages..."}
          value={value}
          setValue={setValue}
        />
        <ChatPreviewSkeleton length={4} />
      </Animated.View>
    );
  const loading = status !== "LoadingFirstPage" && isLoading;
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
        placeholder={"Search messages..."}
        value={value}
        setValue={setValue}
      />
      {query && searchQuery === undefined ? (
        <ChatPreviewSkeleton length={4} />
      ) : (
        <RenderGroupChats
          chats={finalData}
          loadMore={handleMore}
          isLoading={loading}
        />
      )}
    </View>
  );
};

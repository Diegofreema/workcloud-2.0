import {SearchComponent} from "~/features/common/components/SearchComponent";
import {useCallback, useState} from "react";
import {useDebounce} from "use-debounce";
import {useGetConversationType} from "~/features/chat/api/use-get-conversation-type";
import {useGetUserId} from "~/hooks/useGetUserId";
import {RenderChats} from "~/features/chat/components/render-single-chats";
import {useQuery} from "convex/react";
import {api} from "~/convex/_generated/api";
import {ChatPreviewSkeleton} from "~/components/ChatPreviewSkeleton";
import Animated, {SlideInLeft} from "react-native-reanimated";

export const ChatComponent = () => {
  const [value, setValue] = useState("");

  const [query] = useDebounce(value, 500);
  const { id } = useGetUserId();
  const paginatedQuery = useGetConversationType({
    userId: id!,
    type: "single",
  });
  const searchQuery = useQuery(
    api.conversation.getConversationsSingleSearch,
    id ? { userId: id!, query } : "skip",
  );
  const { results, loadMore, isLoading, status } = paginatedQuery;

  const handleMore = useCallback(() => {
    if (!query) {
      if (status === "CanLoadMore" && !isLoading) {
        loadMore(20);
      }
    }
  }, [status, isLoading, loadMore]);

  const safeData = searchQuery || [];

  const sortedResults = results.sort(
    (a, b) => (b?.lastMessageTime || 0) - (a.lastMessageTime || 0),
  );
  const data = query ? safeData : sortedResults;
  const loading = isLoading && status !== "LoadingFirstPage";
  return (
    <Animated.View key={'single'} entering={SlideInLeft} style={{ flex: 1 }}>
      <SearchComponent
        show={false}
        placeholder={"Search messages..."}
        value={value}
        setValue={setValue}
      />
      {query && searchQuery === undefined ? (
        <ChatPreviewSkeleton length={4} />
      ) : (
        <RenderChats chats={data} loadMore={handleMore} isLoading={loading} />
      )}
    </Animated.View>
  );
};

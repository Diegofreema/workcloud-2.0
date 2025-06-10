import {View} from "react-native";
import {Title} from "~/features/common/components/title";
import {useGetConversationType} from "~/features/chat/api/use-get-conversation-type";
import {useCallback} from "react";
import {useGetUserId} from "~/hooks/useGetUserId";
import {RenderChats} from "~/features/chat/components/render-single-chats";

export const FetchMessages = () => {
  const { id } = useGetUserId();
  const paginatedQuery = useGetConversationType({
    userId: id!,
    type: "processor",
  });
  const { results, loadMore, isLoading, status } = paginatedQuery;

  const handleMore = useCallback(() => {
    if (status === "CanLoadMore" && !isLoading) {
      loadMore(20);
    }
  }, [status, isLoading, loadMore]);
  const loading = isLoading && status !== "LoadingFirstPage";
  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <Title title={"Messages"} fontSize={2} />
      <RenderChats chats={results} loadMore={handleMore} isLoading={loading} />
    </View>
  );
};

import {View} from "react-native";
import {SearchComponent} from "~/features/common/components/SearchComponent";
import {useCallback, useState} from "react";
import {useDebounce} from "use-debounce";
import {useGetConversationType} from "~/features/chat/api/use-get-conversation-type";
import {useGetUserId} from "~/hooks/useGetUserId";
import {RenderChats} from "~/features/chat/components/render-single-chats";

export const ChatComponent = () => {
  const [value, setValue] = useState("");
  const [type, setType] = useState<"single" | "group">("single");
  const [query] = useDebounce(value, 500);
  const { id } = useGetUserId();
  const paginatedQuery = useGetConversationType({ userId: id! });
  const { results, loadMore, isLoading, status } = paginatedQuery;
  const handleMore = useCallback(() => {
    if (status === "CanLoadMore" && !isLoading) {
      loadMore(20);
    }
  }, [status, isLoading, loadMore]);
  return (
    <View style={{flex: 1}}>
      <SearchComponent
        show={false}
        placeholder={"Search messages..."}
        value={value}
        setValue={setValue}
      />

      <RenderChats
        chats={results}
        loadMore={handleMore}
        isLoading={isLoading}
      />
    </View>
  );
};

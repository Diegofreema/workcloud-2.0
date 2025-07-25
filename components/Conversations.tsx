import { FlatList } from "react-native";

import { Conversation } from "~/components/Conversation";
import { EmptyText } from "~/components/EmptyText";
import { Container } from "~/components/Ui/Container";
import { ResultType } from "~/constants/types";

type Props = {
  conversations: ResultType[];
  status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
  loadMore: (numOfItems: number) => void;
};
export const Conversations = ({ conversations, loadMore, status }: Props) => {
  const onLoadMore = async () => {
    if (status === "CanLoadMore") {
      loadMore(20);
    }
  };

  return (
    <Container>
      <FlatList
        style={{ marginTop: 20 }}
        data={conversations}
        renderItem={({ item }) => <Conversation conversation={item} />}
        onEndReachedThreshold={0.5}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={onLoadMore}
        ListEmptyComponent={() => <EmptyText text="No conversation yet" />}
      />
    </Container>
  );
};

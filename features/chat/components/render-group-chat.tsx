import { View } from "react-native";
import { LegendList } from "@legendapp/list";
import { constantStyles } from "~/constants/styles";
import { EmptyText } from "~/components/EmptyText";
import { SmallLoader } from "~/features/common/components/small-loader";
import { GroupType } from "~/features/chat/type";
import { RenderGroupChat } from "~/features/chat/components/group-chat";

type Props = {
  chats: GroupType[];
  loadMore: () => void;
  isLoading: boolean;
};
export const RenderGroupChats = ({ chats, loadMore, isLoading }: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <LegendList
        data={chats}
        renderItem={({ item }) => <RenderGroupChat chat={item} />}
        contentContainerStyle={constantStyles.contentContainerStyle}
        recycleItems
        ListEmptyComponent={<EmptyText text={"No conversation found"} />}
        onEndReachedThreshold={0.5}
        onEndReached={loadMore}
        keyExtractor={(item) => item.id}
        ListFooterComponent={isLoading ? <SmallLoader /> : null}
      />
    </View>
  );
};

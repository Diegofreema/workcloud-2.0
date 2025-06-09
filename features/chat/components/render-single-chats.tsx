import {View} from "react-native";
import {Doc} from "~/convex/_generated/dataModel";
import {LegendList} from "@legendapp/list";
import {constantStyles} from "~/constants/styles";
import {EmptyText} from "~/components/EmptyText";
import {RenderChat} from "~/features/chat/components/render-chat";
import {SmallLoader} from "~/features/common/components/small-loader";

type Props = {
  chats: Doc<"conversations">[];
  loadMore: () => void;
  isLoading: boolean;
};
export const RenderChats = ({ chats, loadMore, isLoading }: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <LegendList
        data={chats}
        renderItem={({ item }) => <RenderChat chat={item} />}
        contentContainerStyle={constantStyles.contentContainerStyle}
        recycleItems
        ListEmptyComponent={<EmptyText text={"No conversation found"} />}
        onEndReachedThreshold={0.5}
        onEndReached={loadMore}
        ListFooterComponent={isLoading ? <SmallLoader /> : null}
      />
    </View>
  );
};

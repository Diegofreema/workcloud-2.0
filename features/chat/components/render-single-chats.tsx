import { LegendList } from '@legendapp/list';
import { View } from 'react-native';
import { EmptyText } from '~/components/EmptyText';
import { constantStyles } from '~/constants/styles';
import { Doc } from '~/convex/_generated/dataModel';
import { RenderChat } from '~/features/chat/components/render-chat';

type Props = {
  chats: Doc<'conversations'>[];
};
export const RenderChats = ({ chats }: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <LegendList
        data={chats}
        renderItem={({ item }) => <RenderChat chat={item} />}
        contentContainerStyle={constantStyles.contentContainerStyle}
        recycleItems
        ListEmptyComponent={<EmptyText text={'No conversation found'} />}
        onEndReachedThreshold={0.5}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

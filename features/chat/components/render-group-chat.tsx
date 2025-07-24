import { LegendList } from '@legendapp/list';
import { View } from 'react-native';
import { EmptyText } from '~/components/EmptyText';
import { constantStyles } from '~/constants/styles';
import { RenderGroupChat } from '~/features/chat/components/group-chat';
import { GroupType } from '~/features/chat/type';

type Props = {
  chats: GroupType[];
};
export const RenderGroupChats = ({ chats }: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <LegendList
        data={chats}
        renderItem={({ item }) => <RenderGroupChat chat={item} />}
        contentContainerStyle={constantStyles.contentContainerStyle}
        recycleItems
        ListEmptyComponent={<EmptyText text={'No conversation found'} />}
        onEndReachedThreshold={0.5}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

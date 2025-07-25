import { View } from 'react-native';
import { ChatPreviewSkeleton } from '~/components/ChatPreviewSkeleton';
import { useGetConversationType } from '~/features/chat/api/use-get-conversation-type';
import { RenderChats } from '~/features/chat/components/render-single-chats';
import { Title } from '~/features/common/components/title';

export const FetchMessages = () => {
  const paginatedQuery = useGetConversationType({
    type: 'processor',
  });

  if (paginatedQuery === undefined) {
    return <ChatPreviewSkeleton />;
  }
  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <Title title={'Messages'} fontSize={2} />
      <RenderChats chats={paginatedQuery} />
    </View>
  );
};

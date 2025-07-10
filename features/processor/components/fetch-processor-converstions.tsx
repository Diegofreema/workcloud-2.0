import { useGetUserId } from '~/hooks/useGetUserId';
import { useGetConversationType } from '~/features/chat/api/use-get-conversation-type';
import { useCallback } from 'react';
import { RenderChats } from '~/features/chat/components/render-single-chats';
import { View } from 'react-native';
import { IconBtn } from '~/features/common/components/icon-btn';
import { Plus } from 'lucide-react-native';
import { colors } from '~/constants/Colors';
import { useRouter } from 'expo-router';

export const FetchProcessorConversations = () => {
  const { id } = useGetUserId();
  const router = useRouter();
  const paginatedQuery = useGetConversationType({
    userId: id,
    type: 'processor',
  });

  const { results, loadMore, isLoading, status } = paginatedQuery;
  console.log({ results, id });

  const handleMore = useCallback(() => {
    if (status === 'CanLoadMore' && !isLoading) {
      loadMore(20);
    }
  }, [status, isLoading, loadMore]);
  const loading = isLoading && status !== 'LoadingFirstPage';
  const onPress = () => {
    router.push('/processors/processors');
  };
  return (
    <View style={{ flex: 1 }}>
      <RenderChats chats={results} loadMore={handleMore} isLoading={loading} />
      <IconBtn onPress={onPress} content={<Plus color={colors.white} />} />
    </View>
  );
};

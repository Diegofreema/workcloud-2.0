import { LegendList } from '@legendapp/list';
import { useMutation, usePaginatedQuery } from 'convex/react';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { api } from '~/convex/_generated/api';
import { useGetUserId } from '~/hooks/useGetUserId';
import { Notification } from './notification';

export const FetchNotifications = () => {
  const markedNotificationsAsSeen = useMutation(
    api.notifications.markNotificationAsRead
  );
  const { id } = useGetUserId();
  const notifications = usePaginatedQuery(
    api.notifications.getNotifications,
    {
      userId: id,
    },
    { initialNumItems: 100 }
  );
  useEffect(() => {
    const markAsSeen = async () => {
      await markedNotificationsAsSeen({ id });
    };
    markAsSeen();
  }, [markedNotificationsAsSeen, id]);
  if (notifications === undefined) {
    return <LoadingComponent />;
  }
  const { results, isLoading, loadMore, status } = notifications;
  const onLoadMore = () => {
    if (status === 'CanLoadMore' && !isLoading) {
      loadMore(20);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <LegendList
        data={results}
        keyExtractor={(item) => item._id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <Notification notification={item} />}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoading ? <Text>Loading...</Text> : null}
        recycleItems
        contentContainerStyle={{ gap: 20 }}
      />
    </View>
  );
};

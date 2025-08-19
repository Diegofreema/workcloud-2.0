import { LegendList } from '@legendapp/list';
import { useMutation, usePaginatedQuery } from 'convex/react';
import { useEffect } from 'react';
import { View } from 'react-native';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { MyText } from '~/components/Ui/MyText';
import { api } from '~/convex/_generated/api';
import { Notification } from './notification';

export const FetchNotifications = () => {
  const markedNotificationsAsSeen = useMutation(
    api.notifications.markNotificationAsRead
  );

  const notifications = usePaginatedQuery(
    api.notifications.getNotifications,
    {},
    { initialNumItems: 100 }
  );
  useEffect(() => {
    const markAsSeen = async () => {
      await markedNotificationsAsSeen({});
    };
    markAsSeen();
  }, [markedNotificationsAsSeen]);
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
        ListFooterComponent={
          isLoading ? (
            <MyText poppins="Light" fontSize={12}>
              Loading...
            </MyText>
          ) : null
        }
        recycleItems
        contentContainerStyle={{ gap: 20 }}
      />
    </View>
  );
};

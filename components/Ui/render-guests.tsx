import { usePaginatedQuery } from 'convex/react';
import { LegendList } from '@legendapp/list';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { EmptyText } from '~/components/EmptyText';
import { GuestCard } from '~/components/Ui/guest-card';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';

type Props = {
  workspaceId: Id<'workspaces'>;
};

const ITEMS_PER_PAGE = 20;

export const RenderGuests = ({ workspaceId }: Props) => {
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.guests.getGuests,
    { workspaceId },
    { initialNumItems: ITEMS_PER_PAGE },
  );

  const onLoadMore = () => {
    if (status === 'CanLoadMore' && !isLoading) {
      loadMore(ITEMS_PER_PAGE);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LegendList
        data={results}
        recycleItems
        showsVerticalScrollIndicator={false}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => <GuestCard guest={item} />}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={() => <EmptyText text="No guests yet" />}
        ListFooterComponent={
          isLoading ? (
            <ActivityIndicator size="small" style={{ alignSelf: 'center' }} />
          ) : null
        }
      />
    </View>
  );
};

import { usePaginatedQuery } from 'convex/react';
import { FlatList, TouchableOpacity } from 'react-native';

import { ReviewComment } from '~/components/ReviewComment';
import { MyText } from '~/components/Ui/MyText';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { EmptyText } from '~/components/EmptyText';

type Props = {
  organizationId: Id<'organizations'>;
};

export const ReviewComments = ({ organizationId }: Props) => {
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.reviews.getPaginatedReviews,
    {
      organizationId,
    },
    { initialNumItems: 5 }
  );
  const canLoadMore = status === 'CanLoadMore';
  const onLoadMore = () => {
    if (canLoadMore && !isLoading) {
      loadMore(1);
    }
  };
  const text = isLoading ? 'Loading...' : 'Load more';
  return (
    <FlatList
      data={results}
      // @ts-ignore
      renderItem={({ item }) => <ReviewComment comment={item} />}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 25, marginTop: 20 }}
      scrollEnabled={false}
      ListFooterComponent={() =>
        canLoadMore ? (
          <TouchableOpacity onPress={onLoadMore} style={{ padding: 5 }}>
            <MyText poppins="Medium" style={{ textAlign: 'center' }}>
              {text}
            </MyText>
          </TouchableOpacity>
        ) : null
      }
      ListEmptyComponent={() => <EmptyText text="No review yet" />}
    />
  );
};

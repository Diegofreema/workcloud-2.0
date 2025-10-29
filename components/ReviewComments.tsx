import { usePaginatedQuery } from 'convex/react';
import { useColorScheme, View } from 'react-native';

import { LegendList } from '@legendapp/list';
import { ReviewComment } from '~/components/ReviewComment';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { Button } from '~/features/common/components/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Colors from '~/constants/Colors';

type Props = {
  organizationId: Id<'organizations'>;
  scroll?: boolean;
  hide?: boolean;
};

export const ReviewComments = ({ organizationId, scroll, hide }: Props) => {
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.reviews.getPaginatedReviews,
    {
      organizationId,
    },
    { initialNumItems: 5 }
  );
  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme ?? 'light'].text;
  const canLoadMore = status === 'CanLoadMore';
  const onLoadMore = () => {
    if (canLoadMore && !isLoading) {
      loadMore(10);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LegendList
        data={results}
        // @ts-ignore
        renderItem={({ item }) => <ReviewComment comment={item} />}
        renderScrollComponent={(props) => (
          <KeyboardAwareScrollView {...props} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 25, marginTop: 20, paddingBottom: 50 }}
        keyExtractor={(item) => item._id.toString()}
        scrollEnabled={scroll}
        ListFooterComponent={() =>
          canLoadMore && !hide ? (
            <Button
              title={'Load more'}
              style={{ backgroundColor: 'transparent' }}
              textStyle={{ color: textColor }}
              onPress={onLoadMore}
              disabled={isLoading}
              loading={isLoading}
              loadingTitle={'Loading more...'}
            />
          ) : null
        }
        recycleItems
      />
    </View>
  );
};

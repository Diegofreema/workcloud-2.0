import { usePaginatedQuery } from "convex/react";
import { View } from "react-native";

import { LegendList } from "@legendapp/list";
import { ReviewComment } from "~/components/ReviewComment";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import { Button } from "~/features/common/components/Button";

type Props = {
  organizationId: Id<"organizations">;
  scroll?: boolean;
  hide?: boolean;
};

export const ReviewComments = ({ organizationId, scroll, hide }: Props) => {
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.reviews.getPaginatedReviews,
    {
      organizationId,
    },
    { initialNumItems: 5 },
  );
  const canLoadMore = status === "CanLoadMore";
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 25, marginTop: 20, paddingBottom: 50 }}
        keyExtractor={(item) => item._id.toString()}
        scrollEnabled={scroll}
        ListFooterComponent={() =>
          canLoadMore && !hide ? (
            <Button
              title={"Load more"}
              style={{ backgroundColor: "transparent" }}
              textStyle={{ color: "black" }}
              onPress={onLoadMore}
              disabled={isLoading}
              loading={isLoading}
              loadingTitle={"Loading more..."}
            />
          ) : null
        }
        recycleItems
        // ListEmptyComponent={() => <EmptyText text="No review yet" />}
      />
    </View>
  );
};

import { usePaginatedQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { HeaderNav } from '~/components/HeaderNav';
import { Container } from '~/components/Ui/Container';
import { RenderActivities } from '~/components/Ui/render-activities';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
const ActivitiesScreen = () => {
  const { id } = useLocalSearchParams<{ id: Id<'workspaces'> }>();
  const { isLoading, loadMore, results, status } = usePaginatedQuery(
    api.worker.getStarred,
    { id },
    { initialNumItems: 50 }
  );

  const onLoadMore = () => {
    if (status === 'CanLoadMore' && !isLoading) {
      loadMore(50);
    }
  };

  return (
    <Container>
      <HeaderNav title="Activities" />
      <RenderActivities
        onLoadMore={onLoadMore}
        results={results}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default ActivitiesScreen;

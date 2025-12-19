import { usePaginatedQuery } from 'convex/react';
import React from 'react';
import { HeaderNav } from '~/components/HeaderNav';
import { Container } from '~/components/Ui/Container';
import { RenderActivities } from '~/components/Ui/render-activities';
import { api } from '~/convex/_generated/api';
const ProcessorActivities = () => {
  const { isLoading, loadMore, results, status } = usePaginatedQuery(
    api.worker.getStarredProcessor,
    {},
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

export default ProcessorActivities;

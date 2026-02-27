import { usePaginatedQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { HeaderNav } from '~/components/HeaderNav';
import { Container } from '~/components/Ui/Container';
import { RenderActivities } from '~/components/Ui/render-activities';
import { RenderGuests } from '~/components/Ui/render-guests';
import { TabsSelector } from '~/features/common/components/tabs';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';

const TABS = ['Activities', 'Guests'];

const ActivitiesScreen = () => {
  const { id } = useLocalSearchParams<{ id: Id<'workspaces'> }>();
  const [selectedTab, setSelectedTab] = useState(0);

  const { isLoading, loadMore, results, status } = usePaginatedQuery(
    api.worker.getStarred,
    { id },
    { initialNumItems: 50 },
  );

  const onLoadMore = () => {
    if (status === 'CanLoadMore' && !isLoading) {
      loadMore(50);
    }
  };

  return (
    <Container>
      <HeaderNav title="Activities" />
      <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <TabsSelector
          data={TABS}
          selectedIndex={selectedTab}
          onSelectIndex={setSelectedTab}
        />
      </View>

      {selectedTab === 0 ? (
        <RenderActivities
          onLoadMore={onLoadMore}
          results={results}
          isLoading={isLoading}
        />
      ) : (
        <RenderGuests workspaceId={id} />
      )}
    </Container>
  );
};

export default ActivitiesScreen;

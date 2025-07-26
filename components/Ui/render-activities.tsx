import { LegendList } from '@legendapp/list';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ActivitiesType } from '~/constants/types';
import { EmptyText } from '../EmptyText';
import { RenderActivity } from './render-activity';

type Props = {
  onLoadMore: () => void;
  results: ActivitiesType[];
  isLoading: boolean;
};

export const RenderActivities = ({
  onLoadMore,
  results,
  isLoading,
}: Props): JSX.Element => {
  return (
    <View style={{ flex: 1 }}>
      <LegendList
        data={results}
        recycleItems
        showsVerticalScrollIndicator={false}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => <RenderActivity item={item} />}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={() => <EmptyText text="Nothing to see here" />}
        ListFooterComponent={
          isLoading ? (
            <ActivityIndicator size="small" style={{ alignSelf: 'center' }} />
          ) : null
        }
      />
    </View>
  );
};

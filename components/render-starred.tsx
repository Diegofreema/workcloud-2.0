import { LegendList } from '@legendapp/list';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { EmptyText } from '~/components/EmptyText';
import { Starred } from '~/components/starred';
import { ActivitiesType } from '~/constants/types';

type Props = {
  onLoadMore: () => void;
  results: ActivitiesType[];
  isLoading: boolean;
};
export const RenderStarred = ({ onLoadMore, results, isLoading }: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <LegendList
        data={results}
        recycleItems
        showsVerticalScrollIndicator={false}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => <Starred item={item} />}
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

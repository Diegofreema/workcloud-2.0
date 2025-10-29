import { LegendList } from '@legendapp/list';
import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { EmptyText } from '~/components/EmptyText';
import { UserPreview } from '~/components/Ui/UserPreview';
import { ProcessorType } from '~/features/staff/type';

type Props = {
  data: ProcessorType[];
};

export const RenderProcessors = ({ data }: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <LegendList
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={({ item }) => (
          <UserPreview
            imageUrl={item.image}
            name={item.name}
            onPress={() => router.push(`/chat/${item?.id}?type=processor`)}
            id={item?.id}
            roleText={item.role}
          />
        )}
        style={{ marginTop: 20 }}
        contentContainerStyle={{ paddingBottom: 50, gap: 15 }}
        columnWrapperStyle={{ gap: 15 }}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => <EmptyText text={'No processors found'} />}
        recycleItems
      />
    </View>
  );
};

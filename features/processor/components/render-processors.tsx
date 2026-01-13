import { LegendList } from '@legendapp/list';
import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { EmptyText } from '~/components/EmptyText';
import { UserPreview } from '~/components/Ui/UserPreview';
import { ProcessorType } from '~/features/staff/type';
import { useMessage } from '~/hooks/use-message';

type Props = {
  data: ProcessorType[];
};

export const RenderProcessors = ({ data }: Props) => {
  const { onMessage } = useMessage();

  const onHandleMessage = async (id: string) => {
    await onMessage(id, 'processor');
  };
  return (
    <View style={{ flex: 1 }}>
      <LegendList
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={({ item }) => (
          <UserPreview
            imageUrl={item.image}
            name={item.name}
            onPress={() => onHandleMessage(item?.id)}
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

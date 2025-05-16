import { FlatList } from 'react-native';

import { EmptyText } from '~/components/EmptyText';
import { Processor } from '~/components/Processor';
import { ProcessorType } from '~/constants/types';

type Props = {
  processor: ProcessorType[];
};

export const Processors = ({ processor }: Props) => {
  return (
    <FlatList
      data={processor}
      renderItem={({ item }) => <Processor processor={item} />}
      ListEmptyComponent={() => <EmptyText text="No processors yet" />}
      contentContainerStyle={{ gap: 15 }}
      showsVerticalScrollIndicator={false}
      style={{ marginTop: 10 }}
    />
  );
};

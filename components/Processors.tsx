import { FunctionReturnType } from 'convex/server';
import { FlatList } from 'react-native';

import { EmptyText } from '~/components/EmptyText';
import { Processor } from '~/components/Processor';
import { api } from '~/convex/_generated/api';

type Props = {
  processor: FunctionReturnType<typeof api.worker.getProcessors>;
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

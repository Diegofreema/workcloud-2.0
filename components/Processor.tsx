import { FunctionReturnType } from 'convex/server';
import { router } from 'expo-router';

import { UserPreview } from '~/components/Ui/UserPreview';
import { api } from '~/convex/_generated/api';

type Props = {
  processor: FunctionReturnType<typeof api.worker.getProcessors>[number];
};
export const Processor = ({ processor }: Props) => {
  const onPress = () => router.push(`/processor/${processor.user?._id}`);
  return (
    <UserPreview
      name={processor?.user?.name}
      imageUrl={processor?.user?.image as string}
      onPress={onPress}
    />
  );
};

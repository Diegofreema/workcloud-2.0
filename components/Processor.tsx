import { router } from 'expo-router';

import { UserPreview } from '~/components/Ui/UserPreview';
import { ProcessorType } from '~/constants/types';

type Props = {
  processor: ProcessorType;
};
export const Processor = ({ processor }: Props) => {
  const onPress = () => router.push(`/processor/${processor.user._id}`);
  return (
    <UserPreview
      name={processor?.user?.name}
      imageUrl={processor?.user?.image!}
      onPress={onPress}
    />
  );
};

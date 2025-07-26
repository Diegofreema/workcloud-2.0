import { CheckBox } from '@rneui/base';
import { useMutation } from 'convex/react';
import { useState } from 'react';
import { View } from 'react-native';
import { toast } from 'sonner-native';
import { ActivitiesType } from '~/constants/types';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { generateErrorMessage } from '~/lib/helper';
import { HStack } from '../HStack';
import { MyText } from './MyText';
import { UserPreview } from './UserPreview';

type Props = {
  item: ActivitiesType;
};

export const RenderActivity = ({ item }: Props): JSX.Element => {
  const [updating, setUpdating] = useState(false);
  const updateStar = useMutation(api.worker.updateStarStatus);
  const onUpdate = async (id: Id<'stars'>) => {
    setUpdating(true);
    try {
      await updateStar({ id });
      toast.success('Success', {
        description: 'Status updated',
      });
    } catch (error) {
      const errorMessage = generateErrorMessage(error, 'Failed to update');
      toast.error('Error', {
        description: errorMessage,
      });
    } finally {
      setUpdating(false);
    }
  };
  return (
    <View>
      <UserPreview
        id={item.user._id}
        imageUrl={item?.user?.image}
        name={item?.user?.name}
        subText={item.text}
      />
      <HStack alignItems="center">
        <MyText poppins="Medium" fontSize={15}>
          Resolved
        </MyText>
        <CheckBox
          checked={item.status === 'resolved'}
          checkedColor="green"
          uncheckedColor="red"
          containerStyle={{ marginLeft: -2 }}
          disabled={updating}
          onPress={() => onUpdate(item._id)}
        />
      </HStack>
    </View>
  );
};

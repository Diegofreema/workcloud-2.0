import { PlusCircle } from 'lucide-react-native';
import { StyleProp, ViewStyle } from 'react-native';

import { CustomPressable } from '~/components/Ui/CustomPressable';

type Props = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};
export const ActionButton = ({ onPress, style }: Props) => {
  return (
    <CustomPressable onPress={onPress} style={style}>
      <PlusCircle />
    </CustomPressable>
  );
};

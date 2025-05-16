import { Plus } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { colors } from '~/constants/Colors';

type Props = {
  onPress: () => void;
};
export const NewBtn = ({ onPress }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        position: 'absolute',
        bottom: 50,
        right: 10,
        backgroundColor: colors.buttonBlue,
        borderRadius: 100,
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <Plus color="white" size={30} />
    </Pressable>
  );
};

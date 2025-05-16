import { PropsWithChildren } from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';

type Props = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export const CustomPressable = ({ children, onPress, style }: PropsWithChildren<Props>) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[{ padding: 5 }, style]}
      hitSlop={15}
      activeOpacity={0.5}>
      {children}
    </TouchableOpacity>
  );
};

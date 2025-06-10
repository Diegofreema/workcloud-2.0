import { PropsWithChildren } from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

type Props = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disable?: boolean;
};

export const CustomPressable = ({
  children,
  onPress,
  style,
  disable,
}: PropsWithChildren<Props>) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disable}
      style={[{ padding: 5, opacity: disable ? 0.5 : 1 }, style]}
      hitSlop={15}
      activeOpacity={0.5}
    >
      {children}
    </TouchableOpacity>
  );
};

import { PlusCircle } from "lucide-react-native";
import { StyleProp, ViewStyle } from "react-native";

import { CustomPressable } from "~/components/Ui/CustomPressable";
import { useDarkMode } from "~/hooks/useDarkMode";

type Props = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};
export const ActionButton = ({ onPress, style }: Props) => {
  const { darkMode } = useDarkMode();
  const iconColor = darkMode === "dark" ? "white" : "black";
  return (
    <CustomPressable onPress={onPress} style={style}>
      <PlusCircle color={iconColor} size={24} />
    </CustomPressable>
  );
};

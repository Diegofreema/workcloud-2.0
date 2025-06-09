import { CustomPressable } from "~/components/Ui/CustomPressable";
import { ReactNode } from "react";
import { Dimensions, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { colors } from "~/constants/Colors";

type Props = {
  content: ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

const { width } = Dimensions.get("window");

export const IconBtn = ({ content, onPress, style }: Props) => {
  return (
    <CustomPressable onPress={onPress} style={[styles.btn, style]}>
      {content}
    </CustomPressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    position: "absolute",
    bottom: "5%",
    right: "5%",
    backgroundColor: colors.dialPad,
    borderRadius: 99,
    width: width * 0.15,
    height: width * 0.15,
    alignItems: "center",
    justifyContent: "center",
  },
});

import { MyText } from "~/components/Ui/MyText";
import { CustomPressable } from "~/components/Ui/CustomPressable";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { colors } from "~/constants/Colors";

type Props = {
  title: string;
  onPress: () => void;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  loadingTitle?: string;
  loading?: boolean;
};
export const Button = ({
  onPress,
  title,
  textStyle,
  style,
  loadingTitle,
  disabled,
  loading,
}: Props) => {
  return (
    <CustomPressable
      onPress={onPress}
      disable={disabled}
      style={[
        {
          backgroundColor: colors.dialPad,
          height: 45,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 5,
        },
        style,
      ]}
    >
      <MyText
        poppins={"Medium"}
        fontSize={15}
        style={[{ color: "white" }, textStyle]}
      >
        {loading ? loadingTitle : title}
      </MyText>
    </CustomPressable>
  );
};

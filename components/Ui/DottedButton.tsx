import { AntDesign } from "@expo/vector-icons";
import { Text } from "@rneui/themed";
import { Pressable } from "react-native";

import { colors } from "~/constants/Colors";
import { useDarkMode } from "~/hooks/useDarkMode";

type Props = {
  onPress: () => void;
  text: string;
  isIcon?: boolean;
};

export const DottedButton = ({
  onPress,
  text,
  isIcon = true,
}: Props): JSX.Element => {
  const { darkMode } = useDarkMode();
  return (
    <Pressable
      style={({ pressed }) => ({
        borderWidth: 1,
        borderColor: colors.gray10,
        borderRadius: 10,
        borderStyle: "dashed",
        marginTop: 20,
        height: 50,
        flexDirection: "row",
        padding: 10,
        gap: 3,
        alignItems: "center",
        opacity: pressed ? 0.5 : 1,
      })}
      onPress={onPress}
    >
      <Text
        style={{
          color: darkMode === "dark" ? "white" : "black",
          fontFamily: "PoppinsLight",
        }}
      >
        {text}
      </Text>
      {isIcon && (
        <AntDesign
          name="plus"
          size={20}
          color={darkMode === "dark" ? "white" : "black"}
        />
      )}
    </Pressable>
  );
};

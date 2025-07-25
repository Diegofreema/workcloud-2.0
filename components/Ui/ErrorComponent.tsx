import { Text, View } from "react-native";

import { MyButton } from "./MyButton";

import { defaultStyle } from "~/constants";
import { useDarkMode } from "~/hooks/useDarkMode";

type Props = {
  refetch: any;
  text: string;
};

export const ErrorComponent = ({ refetch, text }: Props) => {
  const { darkMode } = useDarkMode();

  const handleRefetch = () => {
    refetch();
  };
  return (
    <View
      style={{
        flex: 1,
        ...defaultStyle,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        backgroundColor: darkMode === "dark" ? "black" : "white",
      }}
    >
      <Text
        style={{
          color: darkMode === "dark" ? "white" : "black",
          fontFamily: "PoppinsBold",
          fontSize: 20,
          textAlign: "center",
        }}
      >
        {text || "Something went wrong, please try again"}
      </Text>
      <MyButton onPress={handleRefetch} buttonStyle={{ width: 200 }}>
        Retry
      </MyButton>
    </View>
  );
};

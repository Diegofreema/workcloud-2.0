import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleProp, View, ViewStyle } from "react-native";

import { MyText } from "./Ui/MyText";
import VStack from "./Ui/VStack";

import { CustomPressable } from "~/components/Ui/CustomPressable";
import { colors } from "~/constants/Colors";
import { useDarkMode } from "~/hooks/useDarkMode";
import { ReactNode } from "react";

type Props = {
  title: string;
  rightComponent?: ReactNode;
  subTitle?: string;
  style?: StyleProp<ViewStyle>;
};

export const HeaderNav = ({
  title,
  rightComponent,
  subTitle,
  style,
}: Props): JSX.Element => {
  const router = useRouter();
  const { darkMode } = useDarkMode();

  const onGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };
  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: darkMode === "dark" ? "black" : "white",
          alignItems: "center",
          paddingRight: 5,
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,

        }}
      >
        <CustomPressable
          onPress={onGoBack}
          style={{
            paddingVertical: 5,
            paddingRight: 5,
          }}
        >
          <FontAwesome
            name="angle-left"
            color={darkMode === "dark" ? "white" : "black"}
            size={30}
          />
        </CustomPressable>
        <VStack>
          <MyText
            poppins="Bold"
            style={{
              fontSize: 20,
            }}
          >
            {title}
          </MyText>

          {subTitle && (
            <MyText
              poppins="Medium"
              style={{
                color: colors.grayText,

                fontSize: 12,
                marginTop: -8,
              }}
            >
              {subTitle}
            </MyText>
          )}
        </VStack>
      </View>

      {rightComponent}
    </View>
  );
};

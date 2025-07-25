import { PropsWithChildren } from "react";
import { ScrollView, StyleProp, ViewStyle } from "react-native";

import { useDarkMode } from "~/hooks/useDarkMode";

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export const CustomScrollView = ({
  children,
  contentContainerStyle,
}: PropsWithChildren<Props>): JSX.Element => {
  const { darkMode } = useDarkMode();
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: darkMode === "dark" ? "black" : "white",
      }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        { flexGrow: 1, paddingBottom: 20 },
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  );
};

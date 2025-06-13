import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, useWindowDimensions } from "react-native";

import { colors } from "~/constants/Colors";
import { ReactNode } from "react";

type Props = {
  uri?: string;
  name: string;
  darkMode: string;
  onPress: () => void;
  icon?: ReactNode;
};

export const WorkspaceDetails = ({
  uri,
  name,
  darkMode,
  onPress,
  icon,
}: Props) => {
  const { width } = useWindowDimensions();
  const size = (width - 40) / 4;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        { opacity: pressed ? 0.5 : 1 },
        { alignItems: "center", gap: 5, width: size, height: size },
      ]}
    >
      {icon ? (
        icon
      ) : (
        <Image source={uri} style={styles.image} contentFit={"cover"} />
      )}
      <Text
        style={{
          color: darkMode === "dark" ? colors.white : colors.black,
          fontFamily: "PoppinsBold",
          fontSize: 8,
        }}
      >
        {name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
});

import { Image } from "expo-image";
import { StyleSheet } from "react-native";

type Props = {
  url: string;
  size?: number;
};

export const Avatar = ({ url, size = 50 }: Props) => {
  return (
    <Image
      source={{ uri: url }}
      style={{
        width: size,
        height: size,
        borderRadius: size,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "black",
      }}
      placeholder={require("~/assets/images/icon.png")}
      placeholderContentFit="cover"
      contentFit="cover"
    />
  );
};

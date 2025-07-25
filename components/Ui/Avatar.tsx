import { Image } from "expo-image";
import { ImageSourcePropType } from "react-native";

type AvatarProps = {
  image: string;
  placeholder?: ImageSourcePropType;
  width?: number;
  height?: number;
};
export const Avatar = ({
  image,
  placeholder = require("~/assets/images/boy.png"),
  width = 60,
  height = 60,
}: AvatarProps) => {
  return (
    <Image
      source={{ uri: image }}
      placeholder={placeholder}
      placeholderContentFit="cover"
      style={{ borderRadius: 100, width, height }}
      contentFit="cover"
    />
  );
};

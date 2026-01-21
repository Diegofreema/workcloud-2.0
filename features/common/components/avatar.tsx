import { Image, ImageStyle } from 'expo-image';
import { StyleProp } from 'react-native';
import { StyleSheet } from 'react-native';

type Props = {
  url: string;
  size?: number;
  style?: StyleProp<ImageStyle>;
};

export const Avatar = ({ url, size = 50, style }: Props) => {
  return (
    <Image
      source={{ uri: url }}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: 'black',
        },
        style,
      ]}
      placeholder={require('~/assets/images/icon.png')}
      placeholderContentFit="cover"
      contentFit="cover"
    />
  );
};

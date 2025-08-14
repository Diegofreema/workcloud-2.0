import { StyleProp, TextStyle, useWindowDimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { fontFamily } from '~/constants';
import { ThemedText } from './themed-text';

type Props = {
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
  poppins: 'Bold' | 'Light' | 'Medium' | 'BoldItalic' | 'LightItalic';
  fontSize?: number;
};

export const MyText = ({
  children,
  poppins,
  style,
  fontSize = 10,
}: Props): JSX.Element => {
  const { height } = useWindowDimensions();
  return (
    <ThemedText
      style={[
        {
          fontFamily: fontFamily[poppins],
          fontSize: RFValue(fontSize, height),
        },
        style,
      ]}
    >
      {children}
    </ThemedText>
  );
};

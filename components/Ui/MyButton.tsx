import { ButtonProps, Button } from '@rneui/themed';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { colors } from '../../constants/Colors';
import { fontFamily } from '../../constants/index';

type Props = ButtonProps & {
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  buttonColor?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  loading?: boolean;
};

export const MyButton = ({
  children,
  contentStyle,
  buttonColor = colors.dialPad,
  textColor = 'white',
  style,
  labelStyle,
  loading,
  containerStyle,
  buttonStyle,
  ...props
}: Props): JSX.Element => {
  return (
    <Button
      {...props}
      loading={loading}
      buttonStyle={[{ minHeight: 50, alignItems: 'center' }, buttonStyle]}
      titleStyle={[
        {
          color: textColor,
          fontFamily: fontFamily.Medium,
          fontSize: 14,
        },
        labelStyle,
      ]}
      color={buttonColor}
      containerStyle={[{ borderRadius: 10, minWidth: 150 }, containerStyle]}
      style={[
        {
          alignItems: 'center',
        },
        style,
      ]}>
      {children}
    </Button>
  );
};

import { ReactNode } from 'react';
import { DimensionValue, StyleProp, View, ViewStyle } from 'react-native';

type Props = {
  children: ReactNode;
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  gap?: number;
  p?: number;
  m?: number;
  style?: StyleProp<ViewStyle>;
  width?: DimensionValue;
  mt?: number;
  mb?: number;
  mx?: number;
  mr?: number;
  flex?: number;
  px?: number;
  rounded?: number;
  borderWidth?: number;
  borderColor?: string;
};

const VStack = ({
  children,
  justifyContent,
  alignItems,
  gap,
  p,
  m,
  style,
  width,
  mr,
  mt,
  flex,
  px,
  rounded,
  borderWidth,
  borderColor,
  mx,
}: Props) => {
  return (
    <View
      style={[
        {
          flexDirection: 'column',
          justifyContent,
          alignItems,
          gap,
          padding: p,
          margin: m,
          width,
          marginRight: mr,
          flex,
          paddingHorizontal: px,
          marginTop: mt,
          borderRadius: rounded,
          borderWidth,
          borderColor,
          marginHorizontal: mx,
        },
        style,
      ]}>
      {children}
    </View>
  );
};
export default VStack;

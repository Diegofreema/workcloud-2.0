import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { View } from '../Themed';

import { useDarkMode } from '~/hooks/useDarkMode';

type Props = {
  children: React.ReactNode;
  noPadding?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const Container = ({ children, noPadding, style }: Props) => {
  const { darkMode } = useDarkMode();
  return (
    <View
      style={[
        {
          flex: 1,
          paddingHorizontal: noPadding ? 0 : 20,
          backgroundColor: darkMode === 'dark' ? 'black' : 'white',
        },
        style,
      ]}>
      {children}
    </View>
  );
};

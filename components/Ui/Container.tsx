import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { ThemedView } from './themed-view';

type Props = {
  children: React.ReactNode;
  noPadding?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const Container = ({ children, noPadding, style }: Props) => {
  return (
    <ThemedView
      collapsable={false}
      style={[
        {
          flex: 1,
          paddingHorizontal: noPadding ? 0 : 20,
        },
        style,
      ]}
    >
      {children}
    </ThemedView>
  );
};

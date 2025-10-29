import React from 'react';

import { RFPercentage } from 'react-native-responsive-fontsize';
import { ThemedText } from './Ui/themed-text';

type Props = {
  children: React.ReactNode;
};

export const AuthTitle = ({ children }: Props): JSX.Element => {
  return (
    <ThemedText
      style={{
        fontFamily: 'PoppinsBold',
        fontSize: RFPercentage(2),

        textAlign: 'center',
      }}
    >
      {children}
    </ThemedText>
  );
};

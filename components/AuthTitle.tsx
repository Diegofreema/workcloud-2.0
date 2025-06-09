import { Text } from '@rneui/themed';
import React from 'react';

import { useDarkMode } from '~/hooks/useDarkMode';
import {RFPercentage} from "react-native-responsive-fontsize";

type Props = {
  children: React.ReactNode;
};

export const AuthTitle = ({ children }: Props): JSX.Element => {
  const { darkMode } = useDarkMode();
  return (
    <Text
      h2
      style={{
        fontFamily: 'PoppinsBold',
        fontSize: RFPercentage(1.5),

        color: darkMode === 'dark' ? 'white' : 'black',
        textAlign: 'center',
      }}>
      {children}
    </Text>
  );
};

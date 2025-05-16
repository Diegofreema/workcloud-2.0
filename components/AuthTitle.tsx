import { Text } from '@rneui/themed';
import React from 'react';

import { useDarkMode } from '../hooks/useDarkMode';

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
        fontSize: 20,

        color: darkMode === 'dark' ? 'white' : 'black',
        textAlign: 'center',
      }}>
      {children}
    </Text>
  );
};

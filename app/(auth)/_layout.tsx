import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useDarkMode } from '~/hooks/useDarkMode';

const AuthLayout = () => {
  const { darkMode } = useDarkMode();

  return (
    // @ts-ignore
    <>
      <StatusBar
        style={darkMode === 'dark' ? 'light' : 'dark'}
        backgroundColor={darkMode === 'dark' ? 'black' : 'white'}
      />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
};

export default AuthLayout;

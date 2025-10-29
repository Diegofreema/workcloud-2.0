import { StatusBar } from 'expo-status-bar';
import { useTheme } from '~/hooks/use-theme';

export const CustomStatusBar = () => {
  const { theme } = useTheme();
  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </>
  );
};

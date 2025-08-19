import { StyleSheet, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '~/constants/Colors';

import { StatusBar } from 'expo-status-bar';
import { useTheme } from '~/hooks/use-theme';

export const CustomStatusBar = () => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].background;
  const { theme } = useTheme();
  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <View
        style={[
          styles.statusBar,
          {
            height: insets.top,
            backgroundColor,
            width: '100%',
          },
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});

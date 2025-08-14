import { ActivityIndicator, useColorScheme } from 'react-native';

import { defaultStyle } from '~/constants';
import { ThemedView } from './themed-view';

export const LoadingComponent = (): JSX.Element => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  return (
    <ThemedView
      style={{
        flex: 1,
        ...defaultStyle,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator
        style={{ height: 200, width: 200 }}
        color={isDark ? 'white' : 'black'}
        size="large"
      />
    </ThemedView>
  );
};

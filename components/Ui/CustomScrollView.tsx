import { PropsWithChildren } from 'react';
import { ScrollView, StyleProp, ViewStyle } from 'react-native';

import { useTheme } from '~/hooks/use-theme';

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export const CustomScrollView = ({
  children,
  contentContainerStyle,
}: PropsWithChildren<Props>): JSX.Element => {
  const { theme: darkMode } = useTheme();
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: darkMode === 'dark' ? 'black' : 'white',
      }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        { flexGrow: 1, paddingBottom: 20 },
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  );
};

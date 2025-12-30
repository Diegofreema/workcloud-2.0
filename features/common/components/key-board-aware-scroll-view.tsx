import React, { PropsWithChildren } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export const KeyboardAvoidingViewWithScroll = ({
  children,
}: PropsWithChildren) => {
  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 50 }}
      ScrollViewComponent={ScrollView}
      bottomOffset={50}
    >
      {children}
    </KeyboardAwareScrollView>
  );
};

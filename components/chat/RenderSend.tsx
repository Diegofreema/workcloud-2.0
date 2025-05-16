import { SendIcon } from 'lucide-react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { IMessage, Send, SendProps } from 'react-native-gifted-chat';

import { colors } from '~/constants/Colors';

export const RenderSend = ({ ...props }: SendProps<IMessage>) => {
  return (
    <Send {...props} containerStyle={[{ justifyContent: 'center' }, styles.send]}>
      <SendIcon color={colors.white} size={25} />
    </Send>
  );
};

const styles = StyleSheet.create({
  send: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dialPad,
    paddingHorizontal: 14,
    width: 50,
    borderRadius: 50,
    marginBottom: 7,
  },
});

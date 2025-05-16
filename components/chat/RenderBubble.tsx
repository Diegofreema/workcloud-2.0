import React from 'react';
import { Bubble, BubbleProps, IMessage } from 'react-native-gifted-chat';

import { colors } from '~/constants/Colors';

export const RenderBubble = ({ ...props }: BubbleProps<IMessage>) => {
  return (
    <Bubble
      onLongPress={console.log}
      onPress={() => console.warn('Press')}
      {...props}
      textStyle={{
        right: {
          color: '#fff',
        },
        left: {
          color: '#000',
        },
      }}
      wrapperStyle={{
        left: {
          backgroundColor: colors.otherChatBubble,
          borderRadius: 10,
          borderBottomLeftRadius: 0,
        },
        right: {
          borderRadius: 10,
          backgroundColor: colors.dialPad,
          borderBottomRightRadius: 0,
        },
      }}
    />
  );
};

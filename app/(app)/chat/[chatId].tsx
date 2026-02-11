import React from 'react';
import { ChatWrapper } from '~/components/providers/ChatWrapper';
import { Chat } from '~/features/chat/components/chat';

type Props = {};

const ChatScreen = (props: Props) => {
  return (
    <ChatWrapper>
      <Chat />
    </ChatWrapper>
  );
};

export default ChatScreen;

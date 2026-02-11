import React from 'react';
import { ChatWrapper } from '~/components/providers/ChatWrapper';
import { Messages } from '~/features/chat/components/messages';

const MessageScreen = () => {
  return (
    <ChatWrapper>
      <Messages />
    </ChatWrapper>
  );
};

export default MessageScreen;

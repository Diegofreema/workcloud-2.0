import React, { PropsWithChildren, useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, OverlayProvider } from 'stream-chat-expo';

import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { useGetUserId } from '~/hooks/useGetUserId';
import { useUnread } from '~/hooks/useUnread';

const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY!);
export const ChatWrapper = ({ children }: PropsWithChildren) => {
  const { user, id, isLoading } = useGetUserId();
  const [isReady, setIsReady] = useState(false);
  const { getUnread } = useUnread();
  useEffect(() => {
    if (!id || !user.name || !user.image || !user.streamToken) {
      return;
    }

    const connect = async () => {
      try {
        await client.connectUser(
          {
            id,
            name: user.name,
            image: user.image,
          },
          user.streamToken
        );

        getUnread(0);
        setIsReady(true);
      } catch (e) {
        console.log(e);
      }
    };

    connect();

    return () => {
      if (isReady) {
        client.disconnectUser();
      }
      setIsReady(false);
    };
  }, [id, user.name, user.image, user.streamToken, getUnread, isReady]);

  if (isLoading || !isReady) {
    return <LoadingComponent />;
  }

  return (
    <OverlayProvider>
      <Chat client={client} enableOfflineSupport>
        {children}
      </Chat>
    </OverlayProvider>
  );
};

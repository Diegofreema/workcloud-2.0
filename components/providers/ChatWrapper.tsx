import { PropsWithChildren, useEffect } from 'react';
import { Chat, OverlayProvider, useCreateChatClient } from 'stream-chat-expo';
import { useAuth } from '~/context/auth';
import { useUnread } from '~/hooks/useUnread';
import { LoadingComponent } from '../Ui/LoadingComponent';
import { ChatContext } from './chat-context';

const apiKey = 'cnvc46pm8uq9';

export const ChatWrapper = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();

  const setUnreadCount = useUnread((state) => state.getUnread);

  const client = useCreateChatClient({
    apiKey,
    userData: {
      id: user?.id as string,
      name: user?.name,
      image: user?.image ?? undefined,
    },
    tokenOrProvider: user?.streamToken,
  });

  useEffect(() => {
    if (client && user?.id) {
      const onFetchUnreadCount = async () => {
        try {
          const response = await client.getUnreadCount(user.id);
          setUnreadCount(response.total_unread_count);
        } catch (err) {
          console.log('getUnreadCount error', err);
        }
      };
      void onFetchUnreadCount();
    }
  }, [user?.id, setUnreadCount, client]);
  useEffect(() => {
    const listener = client?.on((e) => {
      if (e.total_unread_count !== undefined) {
        setUnreadCount(e.total_unread_count);
      }
    });

    return () => {
      if (listener) {
        listener.unsubscribe();
      }
    };
  }, [setUnreadCount, client]);

  if (!client) {
    return <LoadingComponent />;
  }

  const chatTheme = {
    channelPreview: {
      container: {
        backgroundColor: 'transparent',
      },
    },
  };

  return (
    <OverlayProvider value={{ style: chatTheme }}>
      <Chat client={client}>
        <ChatContext>{children}</ChatContext>
      </Chat>
    </OverlayProvider>
  );
};

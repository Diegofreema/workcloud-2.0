import { PropsWithChildren, useEffect } from 'react';
import {
  Chat,
  DeepPartial,
  OverlayProvider,
  Theme,
  useCreateChatClient,
} from 'stream-chat-expo';
import { useAuth } from '~/context/auth';
import { useTheme } from '~/hooks/use-theme';
import { useUnread } from '~/hooks/useUnread';
import { LoadingComponent } from '../Ui/LoadingComponent';
import { ChatContext } from './chat-context';
import { colors } from '~/constants/Colors';

const apiKey = 'cnvc46pm8uq9';

export const ChatWrapper = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();

  const { theme: darkMode } = useTheme();
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

  const chatTheme: DeepPartial<Theme> = {
    channelPreview: {
      container: {
        backgroundColor: darkMode === 'dark' ? colors.lightDark : colors.white,
      },
      title: {
        color: darkMode === 'dark' ? colors.white : colors.black,
      },
    },
    channelListMessenger: {
      flatListContent: {
        backgroundColor: darkMode === 'dark' ? 'black' : 'white',
      },
    },
    messageList: {
      container: {
        backgroundColor: darkMode === 'dark' ? 'black' : 'white',
      },
    },
    channelListSkeleton: {
      gradientStart: {
        stopColor: darkMode === 'dark' ? 'black' : 'white',
        stopOpacity: 0.5,
      },
      gradientStop: {
        stopColor: darkMode === 'dark' ? 'black' : 'white',
        stopOpacity: 0.5,
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

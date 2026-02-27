import { PropsWithChildren, useCallback, useEffect, useMemo } from 'react';
import {
  Chat,
  DeepPartial,
  OverlayProvider,
  Theme,
  useCreateChatClient,
} from 'stream-chat-expo';
import { colors } from '~/constants/Colors';
import { useAuth } from '~/context/auth';
import { useTheme } from '~/hooks/use-theme';
import { useUnread, useUnreadProcessor } from '~/hooks/useUnread';
import { streamApiKey } from '~/utils/constants';
import { LoadingComponent } from '../Ui/LoadingComponent';
import { ChatContext } from './chat-context';
import { tokenProvider } from '~/lib/utils';

export const ChatWrapper = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();

  const { theme: darkMode } = useTheme();
  const setUnreadCount = useUnread((state) => state.getUnread);
  const setUnreadProcessorCount = useUnreadProcessor(
    (state) => state.getUnread,
  );

  const userData = useMemo(
    () => ({
      id: user?.id as string,
      name: user?.name,
      image: user?.image as string,
    }),
    [user?.id, user?.name, user?.image],
  );

  const tokenProviderCallBack = useCallback(() => {
    return tokenProvider({
      email: user?.email,
      ...userData,
    });
  }, [user.email, userData]);

  const client = useCreateChatClient({
    apiKey: streamApiKey as string,
    userData,
    tokenOrProvider: tokenProviderCallBack,
  });

  useEffect(() => {
    if (client && user?.id) {
      const onFetchUnreadCount = async () => {
        try {
          const response = await client.getUnreadCount(user.id);
          const channels = await client.queryChannels({
            members: { $in: [user?.id] },
            type: 'messaging',
            filter_tags: { $eq: ['processor'] },
          });
          const unreadCount = channels.reduce((acc, channel) => {
            return acc + channel.countUnread();
          }, 0);
          setUnreadProcessorCount(unreadCount);

          setUnreadCount(response.total_unread_count);
        } catch (err) {
          console.log('getUnreadCount error', err);
        }
      };
      void onFetchUnreadCount();
    }
  }, [user?.id, setUnreadCount, setUnreadProcessorCount, client]);
  useEffect(() => {
    const listener = client?.on(async (e) => {
      if (e.total_unread_count !== undefined) {
        setUnreadCount(e.total_unread_count);
        if (user?.id) {
          const channels = await client.queryChannels({
            members: { $in: [user?.id] },
            type: 'messaging',
            filter_tags: { $eq: ['processor'] },
          });
          const unreadCount = channels.reduce((acc, channel) => {
            return acc + channel.countUnread();
          }, 0);
          setUnreadProcessorCount(unreadCount);
        }
      }
    });

    return () => {
      if (listener) {
        listener.unsubscribe();
      }
    };
  }, [setUnreadCount, setUnreadProcessorCount, user?.id, client]);

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

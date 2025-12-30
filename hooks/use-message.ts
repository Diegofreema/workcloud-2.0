import { router } from 'expo-router';
import { useChatContext } from 'stream-chat-expo';
import { useAppChatContext } from '~/components/providers/chat-context';
import { useAuth } from '~/context/auth';

export const useMessage = () => {
  const { user } = useAuth();
  const { setChannel } = useAppChatContext();
  const { client } = useChatContext();
  const onMessage = async (
    userToChat: string,
    type: 'single' | 'group' | 'processor'
  ) => {
    if (!user) return;
    const channel = client.channel('messaging', {
      members: [user?.id, userToChat],
      filter_tags: [type],
    });

    await channel.watch({ presence: true });
    setChannel(channel);
    router.push(`/chat/${channel.cid}`);
  };

  return {
    onMessage,
  };
};

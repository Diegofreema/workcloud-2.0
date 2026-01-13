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
    const base = [user?.id, userToChat].sort().join('-');
    const baseMax = Math.max(1, 64 - 1 - type.length);
    const channelId = `${base.slice(0, baseMax)}-${type}`;

    const channel = client.channel('messaging', channelId, {
      filter_tags: [type],
      members: [user?.id, userToChat],
    });

    await channel.watch({ presence: true });
    setChannel(channel);
    router.push(`/chat/${channel.cid}`);
  };
  const onCreateGroupChannel = async (
    members: string[],
    name: string,
    image?: string,
    description?: string
  ) => {
    if (!user) return;
    const channel = client.channel('messaging', '1', {
      members: [user?.id, ...members],
      filter_tags: ['group'],
      name,
      image,
      custom_data: { description },
    });

    await channel.watch({ presence: true });
    setChannel(channel);
    router.push(`/chat/${channel.cid}`);
  };

  return {
    onMessage,
    onCreateGroupChannel,
  };
};

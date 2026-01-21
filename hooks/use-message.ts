import { router } from 'expo-router';
import { useChatContext } from 'stream-chat-expo';
import { useAppChatContext } from '~/components/providers/chat-context';
import { useAuth } from '~/context/auth';
import { generateRandomString } from '~/lib/utils';

type CreateGroupChannelProps = {
  members: string[];
  name: string;
  image?: string;
  description?: string;
};

export const useMessage = () => {
  const { user } = useAuth();
  const { setChannel } = useAppChatContext();
  const { client } = useChatContext();
  const onMessage = async (
    userToChat: string,
    type: 'single' | 'group' | 'processor',
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
  const onCreateGroupChannel = async ({
    members,
    name,
    image,
    description,
  }: CreateGroupChannelProps) => {
    const type = 'group';
    const base = [generateRandomString(20), ...members].sort().join('-');
    const baseMax = Math.max(1, 64 - 1 - type.length);
    const channelId = `${base.slice(0, baseMax)}-${type}`;
    if (!user) return;
    const channel = client.channel('messaging', channelId, {
      members: [user?.id, ...members],
      filter_tags: [type],
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

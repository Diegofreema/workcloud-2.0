import { Call } from '@stream-io/video-client';
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { Mail, Phone } from 'lucide-react-native';
import { ChatPreviewSkeleton } from '~/components/ChatPreviewSkeleton';
import { HStack } from '~/components/HStack';
import { CustomPressable } from '~/components/Ui/CustomPressable';
import { MyText } from '~/components/Ui/MyText';
import VStack from '~/components/Ui/VStack';
import { useAuth } from '~/context/auth';
import { api } from '~/convex/_generated/api';
import { Avatar } from '~/features/common/components/avatar';
import { formatMessageTime } from '~/lib/helper';
import * as Crypto from 'expo-crypto';
import { useGetUserId } from '~/hooks/useGetUserId';
type Props = {
  videoCall: Call;
};
export const VideoCall = ({ videoCall }: Props) => {
  const { user } = useAuth();
  const { id } = useGetUserId();
  const callUser = videoCall.state.members.find((m) => m.user_id !== user?.id)!;

  const { user: call_user } = callUser;
  const otherUser = useQuery(
    api.users.getUser,
    call_user.id ? { userId: call_user.id } : 'skip'
  );
  const client = useStreamVideoClient();
  console.log({ otherUser });
  if (otherUser === undefined) {
    return <ChatPreviewSkeleton />;
  }
  const onChat = () => {
    router.push(`/chat/${otherUser?._id}?type=single`);
  };

  const onVideoCall = async () => {
    if (!client || !otherUser) return;
    const callId = Crypto.randomUUID();
    await client.call('default', callId).getOrCreate({
      ring: true,
      video: true,
      // notify: true,
      data: {
        members: [
          { user_id: user?.id!, custom: { convexId: id } },
          { user_id: otherUser?.clerkId, custom: { convexId: otherUser?._id } },
        ],
      },
    });
  };
  return (
    <HStack justifyContent={'space-between'} alignItems={'center'}>
      <HStack alignItems={'center'} gap={4}>
        <Avatar url={call_user.image!} size={50} />
        <VStack>
          <MyText poppins={'Medium'} fontSize={14}>
            {call_user.name}
          </MyText>
          <MyText poppins={'Medium'} fontSize={14}>
            {formatMessageTime(videoCall.state.createdAt)}
          </MyText>
        </VStack>
      </HStack>
      <HStack alignItems={'center'} gap={2}>
        <CustomPressable onPress={onVideoCall}>
          <Phone size={24} />
        </CustomPressable>
        <CustomPressable onPress={onChat}>
          <Mail size={24} />
        </CustomPressable>
      </HStack>
    </HStack>
  );
};

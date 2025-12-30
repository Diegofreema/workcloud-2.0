import { Call } from '@stream-io/video-client';
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import { useQuery } from 'convex/react';
import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';
import { ArrowDownLeft, ArrowUpRight, Mail, Phone } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import { ChatPreviewSkeleton } from '~/components/ChatPreviewSkeleton';
import { HStack } from '~/components/HStack';
import { CustomPressable } from '~/components/Ui/CustomPressable';
import { MyText } from '~/components/Ui/MyText';
import VStack from '~/components/Ui/VStack';
import Colors, { colors } from '~/constants/Colors';
import { useAuth } from '~/context/auth';
import { api } from '~/convex/_generated/api';
import { Avatar } from '~/features/common/components/avatar';
import { useMessage } from '~/hooks/use-message';
import { formatMessageTime } from '~/lib/helper';
type Props = {
  videoCall: Call;
};
export const VideoCall = ({ videoCall }: Props) => {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const { onMessage } = useMessage();
  const color = Colors[colorScheme ?? 'light'].text;
  const loggedInCallUser = videoCall.state.members.find(
    (m) => m.user_id !== user?.id
  )!;
  const missedCall = useQuery(
    api.users.getMissedCallByCallId,

    {
      callId: videoCall.id,
    }
  );

  const { user: call_user } = loggedInCallUser;
  const callIsCreatedByMe = videoCall.state.createdBy?.id === user?.id;

  const client = useStreamVideoClient();

  const onChat = () => {
    onMessage(call_user?.id, 'single');
  };

  const onVideoCall = async () => {
    if (!client) return;
    const callId = Crypto.randomUUID();
    await client.call('default', callId).getOrCreate({
      ring: true,
      video: true,
      // notify: true,
      data: {
        members: [
          { user_id: user?.id!, custom: { convexId: user?.id } },
          { user_id: call_user?.id, custom: { convexId: call_user?.id } },
        ],
      },
    });
  };

  if (missedCall === undefined) {
    return <ChatPreviewSkeleton length={1} />;
  }
  const arrowToShow = () => {
    if (callIsCreatedByMe) {
      return <ArrowUpRight size={16} color={colors.openBackgroundColor} />;
    } else {
      return (
        <ArrowDownLeft
          size={16}
          color={missedCall ? 'red' : colors.openBackgroundColor}
        />
      );
    }
  };

  return (
    <HStack justifyContent={'space-between'} alignItems={'center'}>
      <HStack alignItems={'center'} gap={4}>
        <Avatar url={call_user.image!} size={50} />
        <VStack>
          <MyText poppins={'Medium'} fontSize={14}>
            {call_user.name}
          </MyText>
          <HStack alignItems={'center'} gap={2}>
            {arrowToShow()}
            <MyText poppins={'Medium'} fontSize={14}>
              {formatMessageTime(videoCall.state.createdAt)}
            </MyText>
          </HStack>
        </VStack>
      </HStack>
      <HStack alignItems={'center'} gap={2}>
        <CustomPressable onPress={onVideoCall}>
          <Phone size={24} color={color} />
        </CustomPressable>
        <CustomPressable onPress={onChat}>
          <Mail size={24} color={color} />
        </CustomPressable>
      </HStack>
    </HStack>
  );
};

import { Call } from '@stream-io/video-client';
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';
import { Mail, Phone } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import { HStack } from '~/components/HStack';
import { CustomPressable } from '~/components/Ui/CustomPressable';
import { MyText } from '~/components/Ui/MyText';
import VStack from '~/components/Ui/VStack';
import Colors from '~/constants/Colors';
import { useAuth } from '~/context/auth';
import { Avatar } from '~/features/common/components/avatar';
import { formatMessageTime } from '~/lib/helper';
type Props = {
  videoCall: Call;
};
export const VideoCall = ({ videoCall }: Props) => {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? 'light'].text;
  const loggedInCallUser = videoCall.state.members.find(
    (m) => m.user_id !== user?._id
  )!;
  console.log({ loggedInCallUser });

  const { user: call_user } = loggedInCallUser;

  const client = useStreamVideoClient();

  const onChat = () => {
    router.push(`/chat/${call_user?.id}?type=single`);
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
          { user_id: user?._id!, custom: { convexId: user?._id } },
          { user_id: call_user?.id, custom: { convexId: call_user?.id } },
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
          <Phone size={24} color={color} />
        </CustomPressable>
        <CustomPressable onPress={onChat}>
          <Mail size={24} color={color} />
        </CustomPressable>
      </HStack>
    </HStack>
  );
};

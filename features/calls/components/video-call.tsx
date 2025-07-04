import { Call } from "@stream-io/video-client";
import { HStack } from "~/components/HStack";
import { Avatar } from "~/features/common/components/avatar";
import VStack from "~/components/Ui/VStack";
import { MyText } from "~/components/Ui/MyText";
import { formatMessageTime } from "~/lib/helper";
import { CustomPressable } from "~/components/Ui/CustomPressable";
import { Mail, Phone } from "lucide-react-native";
import { useAuth } from "~/context/auth";
import { router } from "expo-router";
import { useGetUserId } from "~/hooks/useGetUserId";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import {ChatPreviewSkeleton} from "~/components/ChatPreviewSkeleton";

type Props = {
  videoCall: Call;
};
export const VideoCall = ({ videoCall }: Props) => {
  const { user } = useAuth();
  const { id } = useGetUserId();
  const callUser = videoCall.state.members.find((m) => m.user_id !== user?.id)!;

  const { user: call_user, custom } = callUser;
  const otherUser = useQuery(
    api.users.getUser,
    call_user.id ? { userId: call_user.id } : "skip",
  );


  console.log({ otherUser });
if(otherUser === undefined) {
  return <ChatPreviewSkeleton />
}
  const onChat = () => {
    router.push(`/chat/${otherUser?._id}`);
  };
  return (
    <HStack justifyContent={"space-between"} alignItems={"center"}>
      <HStack alignItems={"center"} gap={4}>
        <Avatar url={call_user.image!} size={50} />
        <VStack>
          <MyText poppins={"Medium"} fontSize={14}>
            {call_user.name}
          </MyText>
          <MyText poppins={"Medium"} fontSize={14}>
            {formatMessageTime(videoCall.state.createdAt)}
          </MyText>
        </VStack>
      </HStack>
      <HStack alignItems={"center"} gap={2}>
        <CustomPressable onPress={() => {}}>
          <Phone size={24} />
        </CustomPressable>
        <CustomPressable onPress={onChat}>
          <Mail size={24} />
        </CustomPressable>
      </HStack>
    </HStack>
  );
};

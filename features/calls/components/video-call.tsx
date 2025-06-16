import {Call} from "@stream-io/video-client";
import {HStack} from "~/components/HStack";
import {Avatar} from "~/features/common/components/avatar";
import VStack from "~/components/Ui/VStack";
import {MyText} from "~/components/Ui/MyText";
import {formatMessageTime} from "~/lib/helper";
import {CustomPressable} from "~/components/Ui/CustomPressable";
import {Mail, Phone} from "lucide-react-native";

type Props = {
  videoCall: Call;
};
export const VideoCall = ({ videoCall }: Props) => {
  return (
    <HStack justifyContent={"space-between"} alignItems={"center"}>
      <HStack alignItems={"center"} gap={2}>
        <Avatar url={videoCall.state.createdBy?.image!} size={50} />
        <VStack>
          <MyText poppins={"Medium"} fontSize={14}>
            {videoCall.state.createdBy?.name}
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
        <CustomPressable onPress={() => {}}>
          <Mail size={24} />
        </CustomPressable>
      </HStack>
    </HStack>
  );
};

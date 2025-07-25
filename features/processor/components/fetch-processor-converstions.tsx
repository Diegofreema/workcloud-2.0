import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { View } from "react-native";
import ChatSkeleton from "~/components/Ui/ChatSkeleton";
import { colors } from "~/constants/Colors";
import { useGetConversationType } from "~/features/chat/api/use-get-conversation-type";
import { RenderChats } from "~/features/chat/components/render-single-chats";
import { IconBtn } from "~/features/common/components/icon-btn";

export const FetchProcessorConversations = () => {
  const router = useRouter();
  const paginatedQuery = useGetConversationType({
    type: "processor",
  });

  if (paginatedQuery === undefined) {
    return <ChatSkeleton />;
  }

  const onPress = () => {
    router.push("/processors/processors");
  };
  return (
    <View style={{ flex: 1 }}>
      <RenderChats chats={paginatedQuery} />
      <IconBtn onPress={onPress} content={<Plus color={colors.white} />} />
    </View>
  );
};

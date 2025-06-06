import { CustomPressable } from "~/components/Ui/CustomPressable";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { useGetUserId } from "~/hooks/useGetUserId";
import { Doc } from "~/convex/_generated/dataModel";
import { StyleSheet } from "react-native";
import { HStack } from "~/components/HStack";
import { Avatar } from "~/features/common/components/avatar";
import { ChatPreviewSkeleton } from "~/components/ChatPreviewSkeleton";
import { router } from "expo-router";
import VStack from "~/components/Ui/VStack";
import { MyText } from "~/components/Ui/MyText";
import { CheckCheck, File } from "lucide-react-native";
import { colors } from "~/constants/Colors";
import { trimText } from "~/lib/helper";
import { formatDistanceToNow } from "date-fns";
import { UnreadCount } from "~/components/Unread";

type Props = {
  chat: Doc<"conversations">;
};

export const RenderChat = ({ chat }: Props) => {
  const { id } = useGetUserId();

  const otherUserId = chat.participants.find((p) => p !== id);
  const getTypingUsers = useQuery(api.message.getTypingUsers, {
    conversationId: chat._id,
  });
  const otherUser = useQuery(
    api.users.getUserById,
    otherUserId ? { id: otherUserId } : "skip",
  );
  const { _id, lastMessageSenderId, lastMessage, lastMessageTime } = chat;
  const unread = useQuery(api.conversation.getUnreadMessages, {
    conversationId: _id,
    userId: id!,
  });

  if (
    otherUser === undefined ||
    id === undefined ||
    unread === undefined ||
    getTypingUsers === undefined
  ) {
    return <ChatPreviewSkeleton />;
  }
  const onPress = () => {
    router.push(`/chat/${otherUser?._id}`);
  };

  const numberOfUnread = unread || 0;
  const isMine = lastMessageSenderId === id;
  const isTyping =
    getTypingUsers.length > 0 && getTypingUsers.includes(otherUser?._id!);
  const isImage = lastMessage?.startsWith("https");
  const firstName = otherUser?.name?.split(" ")[0];
  return (
    <CustomPressable onPress={onPress} style={styles.pressable}>
      <HStack justifyContent="space-between" alignItems="flex-start">
        <HStack gap={10} alignItems="center">
          <Avatar url={otherUser?.imageUrl!} />
          <VStack>
            <MyText poppins="Medium" fontSize={12}>
              {firstName}
            </MyText>
            {isTyping ? (
              <MyText poppins="Medium" fontSize={12}>
                {firstName} is typing...
              </MyText>
            ) : (
              <HStack alignItems="center" gap={3}>
                {isMine && <CheckCheck size={20} color={colors.buttonBlue} />}
                {isImage ? (
                  <File color={colors.grayText} size={25} />
                ) : (
                  <MyText poppins="Medium" fontSize={14}>
                    {trimText(lastMessage || "", 20)}
                  </MyText>
                )}
              </HStack>
            )}
          </VStack>
        </HStack>
        <VStack gap={5} mt={10}>
          {lastMessageTime && (
            <MyText
              poppins="Medium"
              fontSize={10}
              style={{ color: colors.time }}
            >
              {formatDistanceToNow(lastMessageTime!, {
                includeSeconds: true,
              })}{" "}
              ago
            </MyText>
          )}
          {numberOfUnread > 0 && <UnreadCount unread={numberOfUnread} />}
        </VStack>
      </HStack>
    </CustomPressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 15,
  },
});

import { useQuery } from 'convex/react';
import { router, usePathname } from 'expo-router';
import { CheckCheck, File } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { ChatPreviewSkeleton } from '~/components/ChatPreviewSkeleton';
import { HStack } from '~/components/HStack';
import { CustomPressable } from '~/components/Ui/CustomPressable';
import { MyText } from '~/components/Ui/MyText';
import VStack from '~/components/Ui/VStack';
import { UnreadCount } from '~/components/Unread';
import { colors } from '~/constants/Colors';
import { useAuth } from '~/context/auth';
import { api } from '~/convex/_generated/api';
import { Doc } from '~/convex/_generated/dataModel';
import { Avatar } from '~/features/common/components/avatar';
import { formatMessageTime, trimText } from '~/lib/helper';

type Props = {
  chat: Doc<'conversations'>;
};

export const RenderChat = ({ chat }: Props) => {
  const { user } = useAuth();
  const id = user?._id;

  const otherUserId = chat.participants.find((p) => p !== id);
  const getTypingUsers = useQuery(api.message.getTypingUsers, {
    conversationId: chat._id,
  });

  const otherUser = useQuery(
    api.users.getUserById,
    otherUserId ? { id: otherUserId } : 'skip'
  );
  const { _id, lastMessageSenderId, lastMessage, lastMessageTime } = chat;
  const unread = useQuery(api.conversation.getUnreadMessages, {
    conversationId: _id,
  });
  const pathname = usePathname();
  const type = pathname === '/message' ? 'single' : 'processor';

  if (
    otherUser === undefined ||
    id === undefined ||
    unread === undefined ||
    getTypingUsers === undefined
  ) {
    return <ChatPreviewSkeleton />;
  }
  const onPress = () => {
    router.push(`/chat/${otherUser?._id}?type=${type}`);
  };

  const numberOfUnread = unread || 0;
  const isMine = lastMessageSenderId === id;
  const isTyping =
    getTypingUsers.length > 0 && getTypingUsers.includes(otherUser?._id!);
  const isImage = lastMessage?.startsWith('https');
  const firstName = otherUser?.name?.split(' ')[0];
  console.log({ image: otherUser?.imageUrl });

  return (
    <CustomPressable onPress={onPress} style={styles.pressable}>
      <HStack justifyContent="space-between" alignItems="flex-start">
        <HStack gap={10} alignItems="center">
          <Avatar url={otherUser?.image!} />
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
                    {trimText(lastMessage || '', 20)}
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
              {formatMessageTime(new Date(lastMessageTime))}
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
    borderRadius: 10,
    paddingVertical: 15,
  },
});

import { CustomPressable } from '~/components/Ui/CustomPressable';
import { useQuery } from 'convex/react';
import { api } from '~/convex/_generated/api';
import { useGetUserId } from '~/hooks/useGetUserId';
import { StyleSheet } from 'react-native';
import { HStack } from '~/components/HStack';
import { Avatar } from '~/features/common/components/avatar';
import { ChatPreviewSkeleton } from '~/components/ChatPreviewSkeleton';
import { router } from 'expo-router';
import VStack from '~/components/Ui/VStack';
import { MyText } from '~/components/Ui/MyText';
import { CheckCheck, File } from 'lucide-react-native';
import { colors } from '~/constants/Colors';
import { formatMessageTime, trimText } from '~/lib/helper';
import { UnreadCount } from '~/components/Unread';
import { GroupType } from '~/features/chat/type';

type Props = {
  chat: GroupType;
};

export const RenderGroupChat = ({ chat }: Props) => {
  const { id, user } = useGetUserId();

  const getTypingUsers = useQuery(api.message.getTypingUsers, {
    conversationId: chat.id,
  });

  const { id: _id, lastMessageSenderId, lastMessage, lastMessageTime } = chat;
  const unread = useQuery(api.conversation.getUnreadMessages, {
    conversationId: _id,
  });
  const member = useQuery(
    api.member.fetchMember,
    id ? { group: chat.id, userId: id } : 'skip'
  );
  if (
    id === undefined ||
    unread === undefined ||
    getTypingUsers === undefined ||
    member === undefined
  ) {
    return <ChatPreviewSkeleton />;
  }
  const onPress = () => {
    router.push(`/chat/group/${chat.id}`);
  };

  const numberOfUnread = unread || 0;
  const isMine = lastMessageSenderId === id;
  const isTyping = getTypingUsers.length > 0 && !getTypingUsers.includes(id!);
  const isImage = lastMessage?.startsWith('https');
  const typingText = getTypingUsers.length;
  const groupCreatedBeforeMemberJoined =
    (chat?.lastMessageTime ?? 0) < (member?._creationTime ?? 0);
  const typingIsGreaterThanOne = getTypingUsers.length > 1;
  const justCreated = !!chat.lastMessage?.includes(
    `${chat.name} was created by`
  );
  const iAmCreator = chat.creatorId === id;

  const lastText = justCreated
    ? `${lastMessage} ${iAmCreator ? 'you' : user?.name}`
    : groupCreatedBeforeMemberJoined
      ? `You were added by ${member?.addedBy}`
      : lastMessage;

  return (
    <CustomPressable onPress={onPress} style={styles.pressable}>
      <HStack justifyContent="space-between" alignItems="flex-start">
        <HStack gap={10} alignItems="center">
          <Avatar url={chat.image!} />
          <VStack>
            <MyText poppins="Medium" fontSize={12}>
              {chat.name}
            </MyText>
            {isTyping ? (
              <MyText poppins="Medium" fontSize={12}>
                {typingText} {typingIsGreaterThanOne ? 'users are' : 'user is'}{' '}
                typing...
              </MyText>
            ) : (
              <HStack alignItems="center" gap={3}>
                {isMine && <CheckCheck size={20} color={colors.buttonBlue} />}
                {isImage ? (
                  <File color={colors.grayText} size={25} />
                ) : (
                  <MyText poppins="Medium" fontSize={14}>
                    {trimText(lastText || '', 25)}
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

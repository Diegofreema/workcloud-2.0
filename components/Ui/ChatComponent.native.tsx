import { useConvex, useMutation, useQuery } from 'convex/react';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GiftedChat, SystemMessage } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import * as Clipboard from 'expo-clipboard';
import { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { toast } from 'sonner-native';
import { RenderActions } from '~/components/chat/RenderActions';
import { RenderBubble } from '~/components/chat/RenderBubble';
import { RenderComposer } from '~/components/chat/RenderComposer';
import { RenderMessageImage } from '~/components/chat/RenderMessageImage';
import { RenderSend } from '~/components/chat/RenderSend';
import { colors } from '~/constants/Colors';
import {
  DataType,
  EditType,
  EditType2,
  FileType,
  IMessage,
  ReplyType,
  SendIMessage,
  StatusType,
} from '~/constants/types';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import ReplyMessageBar from '~/features/chat/components/render-message';
import { useDebounce } from '~/features/chat/hook/use-debounce';
import { useGetUserId } from '~/hooks/useGetUserId';
import { generateErrorMessage, uploadProfilePicture } from '~/lib/helper';
import { convexPushNotificationsHelper } from '~/lib/utils';

type Props = {
  loggedInUserId: Id<'users'>;
  otherUserId: Id<'users'>;
  conversationId: Id<'conversations'>;
  data: DataType[];
  status: StatusType;
  loadMore: (numItems: number) => void;
  otherUserName: string;
  createdAt: number;
  isLoading: boolean;
  pushToken?: string;
  type: 'single' | 'processor';
};
export const ChatComponentNative = ({
  loggedInUserId,
  otherUserId,
  conversationId,
  data,
  loadMore,
  status,
  createdAt,
  otherUserName,
  isLoading,
  pushToken,
  type,
}: Props) => {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const { user } = useGetUserId();
  const [isTypingLocally, setIsTypingLocally] = useState(false);
  const setTypingState = useMutation(api.message.setTypingState);
  const [edit, setEdit] = useState<{
    messageId: Id<'messages'>;
    senderId: Id<'users'>;
  } | null>(null);
  const getTypingUsers = useQuery(
    api.message.getTypingUsers,
    conversationId
      ? {
          conversationId,
        }
      : 'skip'
  );
  const insets = useSafeAreaInsets();
  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);
  const [processing, setProcessing] = useState(false);
  const convex = useConvex();
  const sendMessage = useMutation(api.message.sendMessage);
  const editMessage = useMutation(api.message.editMessage);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateTypingState = useDebounce((isTyping: boolean) => {
    void setTypingState({ conversationId, userId: loggedInUserId, isTyping });
  }, 300);

  // Handle text input changes
  const onInputTextChanged = useCallback(
    (text: string) => {
      setText(text);
      const isTyping = text.length > 0;
      if (isTyping !== isTypingLocally) {
        setIsTypingLocally(isTyping);
        updateTypingState(isTyping);
      }
    },
    [isTypingLocally, updateTypingState]
  );

  const onSend = useCallback(
    async (messages: SendIMessage[]) => {
      try {
        if (edit) {
          setProcessing(true);
          await editMessage({
            message_id: edit.messageId,
            sender_id: loggedInUserId,
            text,
          });
          setEdit(null);
          setEditText(null);
        } else {
          if (replyMessage) {
            setReplyMessage(null);
          }
          for (const message of messages) {
            await sendMessage({
              content: message.text,
              conversationId,
              senderId: loggedInUserId,
              fileType: message.fileType,
              fileUrl: message.fileUrl,
              fileId: message.fileId,
              replyTo: replyMessage?._id,
            });
            const body = message.text ? message.text : 'File';
            await convexPushNotificationsHelper(convex, {
              data: { conversationId, type },
              body,
              title: user.name!,
              to: otherUserId,
            });
          }
        }
      } catch (e) {
        console.log('Error message', e);
      } finally {
        setProcessing(false);
      }
    },
    [
      conversationId,
      loggedInUserId,
      sendMessage,
      replyMessage,
      editMessage,
      text,
      edit,
      user,
      convex,
      otherUserId,
      type,
    ]
  );
  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const { assets } = result;
        setSending(true);
        const filePromises = assets.map(async (asset) => {
          const res = await uploadProfilePicture(generateUploadUrl, asset.uri);
          return {
            id: res?.storageId as Id<'_storage'>,
          };
        });

        const fileUrls = await Promise.all(filePromises);

        const messages = fileUrls.map((file) => {
          return {
            text: '',
            user: { _id: loggedInUserId },
            fileId: file.id,
            fileType: 'pdf' as FileType,
          };
        });
        void onSend(messages);
      }
    } catch (error) {
      console.error('Error picking file:', error);
    } finally {
      setSending(false);
    }
  };
  const handleImagePick = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.5,
        allowsMultipleSelection: true,
        base64: false,
      });

      if (!result.canceled) {
        const { assets } = result;

        setSending(true);
        const filePromises = assets.map(async (asset) => {
          const res = await uploadProfilePicture(generateUploadUrl, asset.uri);
          return {
            id: res?.storageId as Id<'_storage'>,
          };
        });
        const fileUrls = await Promise.all(filePromises);

        const messages = fileUrls.map((file) => {
          return {
            text: '',
            user: { _id: loggedInUserId },
            fileId: file.id,
            fileType: 'image' as FileType,
          };
        });
        await onSend(messages);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      toast.error('Error picking image');
    } finally {
      setSending(false);
    }
  };
  const deleteMessage = useMutation(api.message.deleteMessage);
  const swipeableRowRef = useRef<SwipeableMethods | null>(null);
  const [editText, setEditText] = useState<EditType | null>(null);

  const updateRowRef = useCallback(
    (ref: any) => {
      if (
        ref &&
        replyMessage &&
        ref.props.children.props.currentMessage?._id === replyMessage?._id
      ) {
        swipeableRowRef.current = ref;
        if (editText) {
          setEditText(null);
        }
      }
    },
    [replyMessage, editText, setEditText]
  );
  useEffect(() => {
    if (replyMessage && swipeableRowRef.current) {
      swipeableRowRef.current.close();
      swipeableRowRef.current = null;
    }
  }, [replyMessage]);

  const hasItem = data?.length > 0;
  const messages = hasItem
    ? [
        ...data?.map((message) => {
          return {
            _id: message?._id as Id<'messages'>,
            text: message?.content,
            createdAt: new Date(message?._creationTime),
            user: {
              _id: message?.senderId as Id<'users'>,
              name:
                message.senderId === loggedInUserId
                  ? 'You'
                  : otherUserName?.split(' ')[0],
            },
            reactions: message.reactions,
            fileType: message.fileType,
            fileUrl: message.fileUrl,
            reply: message.reply as ReplyType,
          };
        }),
        {
          _id: 0,
          system: true,
          text: '',
          createdAt: new Date(createdAt),
          user: {
            _id: 0,
            name: 'Bot',
          },
        },
      ]
    : [];

  const onCopy = useCallback(async (textToCopy: string) => {
    const copied = await Clipboard.setStringAsync(textToCopy);
    if (copied) {
      toast.success('Copied to clipboard');
    }
  }, []);
  const onDelete = useCallback(
    async (messageId: Id<'messages'>) => {
      Alert.alert('This is irreversible', 'Delete this message for everyone?', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            setProcessing(true);
            try {
              deleteMessage({
                message_id: messageId,
                sender_id: loggedInUserId,
              });
              toast.success('Message deleted');
            } catch (e) {
              toast.error(generateErrorMessage(e, 'Failed to delete message'));
            } finally {
              setProcessing(false);
            }
          },
          style: 'destructive',
        },
      ]);
    },
    [loggedInUserId, deleteMessage]
  );
  const onEdit = useCallback(
    async ({ textToEdit, messageId, senderId, senderName }: EditType2) => {
      setEditText({ text: textToEdit, senderId, senderName });
      setEdit({ messageId, senderId });
      setText(textToEdit);
    },
    []
  );

  const loadEarlier = status === 'CanLoadMore' && !isLoading;
  const onLoadMore = () => {
    if (loadEarlier) {
      loadMore(100);
    }
  };

  const disabled = sending || processing || text.length <= 0;
  const isTyping =
    getTypingUsers !== undefined &&
    getTypingUsers.length > 0 &&
    getTypingUsers.includes(otherUserId);

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        text={text}
        alwaysShowSend
        keyboardShouldPersistTaps="always"
        onSend={onSend}
        onInputTextChanged={onInputTextChanged}
        user={{
          _id: loggedInUserId,
        }}
        renderSystemMessage={(props) => (
          <SystemMessage {...props} textStyle={{ color: colors.gray }} />
        )}
        renderMessageImage={RenderMessageImage}
        renderActions={(props) => (
          <RenderActions onPickDocument={handleFilePick} {...props} />
        )}
        renderComposer={(props) => (
          <RenderComposer onPickImage={handleImagePick} {...props} />
        )}
        bottomOffset={insets.bottom}
        renderAvatar={null}
        maxComposerHeight={100}
        textInputProps={styles.input}
        isScrollToBottomEnabled
        renderUsernameOnMessage
        infiniteScroll
        loadEarlier={loadEarlier}
        // renderChatEmpty={EmptyChat}
        onLoadEarlier={onLoadMore}
        renderUsername={(user) => (
          <Text style={styles.username}>{user.name}</Text>
        )}
        renderBubble={(props) => (
          // @ts-ignore
          <RenderBubble
            {...props}
            onCopy={onCopy}
            onEdit={onEdit}
            onDelete={onDelete}
            loggedInUserId={loggedInUserId}
            updateRowRef={updateRowRef}
            setReplyOnSwipeOpen={setReplyMessage}
          />
        )}
        renderSend={(props) => (
          <RenderSend
            {...props}
            sending={processing || sending}
            disabled={disabled}
          />
        )}
        renderChatFooter={() => (
          <ReplyMessageBar
            clearReply={() => setReplyMessage(null)}
            message={replyMessage}
            editText={editText}
            clearEdit={() => setEditText(null)}
          />
        )}
        // renderFooter={renderFooter}
        isTyping={isTyping}
      />
      {Platform.OS === 'android' && <KeyboardAvoidingView behavior="height" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  messagesContainer: {
    padding: 10,
  },

  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    minHeight: 45,
    maxHeight: 100,
    borderWidth: 0,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    textAlignVertical: 'center',
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 7777,
    padding: 15,
  },
  username: { fontSize: 10, color: colors.black, paddingLeft: 7 },
  footer: {
    padding: 10,
  },
});

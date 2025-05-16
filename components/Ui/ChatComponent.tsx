import { useMutation } from 'convex/react';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { GiftedChat, IMessage, SystemMessage } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyChat } from '~/components/EmptyChat';
import { RenderActions } from '~/components/chat/RenderActions';
import { RenderBubble } from '~/components/chat/RenderBubble';
import { RenderComposer } from '~/components/chat/RenderComposer';
import { RenderMessageImage } from '~/components/chat/RenderMessageImage';
import { RenderSend } from '~/components/chat/RenderSend';
import { colors } from '~/constants/Colors';
import { DataType, StatusType } from '~/constants/types';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { uploadDoc, uploadProfilePicture } from '~/lib/helper';

type Props = {
  loggedInUserId: Id<'users'>;
  otherUserId: Id<'users'>;
  conversationId: Id<'conversations'>;
  data: DataType[];
  status: StatusType;
  loadMore: (numItems: number) => void;
  otherUserName: string;
  createdAt: number;
};
export const ChatComponent = ({
  loggedInUserId,
  otherUserId,
  conversationId,
  data,
  loadMore,
  status,
  createdAt,
  otherUserName,
}: Props) => {
  const createMessage = useMutation(api.conversation.createMessages);

  const [text, setText] = useState('');

  const insets = useSafeAreaInsets();
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  const hasItem = data?.length > 0;
  const messages: IMessage[] = hasItem
    ? [
        ...data?.map((message) => {
          return {
            _id: message?._id,
            text: message.contentType === 'text' ? message?.content : '',
            createdAt: new Date(message?._creationTime),
            image: message.contentType === 'image' ? message.content : undefined,
            user: {
              _id: message?.senderId,
              name: message.senderId === loggedInUserId ? 'You' : otherUserName.split(' ')[0],
            },
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
  const onPickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: true,
      type: ['application/*'],
    });
    if (!result.canceled) {
      const { storageId, uploadUrl } = await uploadDoc(result, generateUploadUrl);
      await createMessage({
        content: storageId,
        senderId: loggedInUserId,
        recipient: otherUserId,
        conversationId,
        contentType: 'image',
        uploadUrl,
      });
    }
  };
  const onSend = async () => {
    await createMessage({
      content: text.trim(),
      senderId: loggedInUserId,
      recipient: otherUserId,
      conversationId,
      contentType: 'text',
    });
  };
  const onPickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      const { storageId, uploadUrl } = await uploadProfilePicture(
        result?.assets[0],
        generateUploadUrl
      );
      console.log({ storageId, uploadUrl });
      if (!storageId) return;
      await createMessage({
        content: storageId,
        senderId: loggedInUserId,
        recipient: otherUserId,
        conversationId,
        contentType: 'image',
        uploadUrl,
      });
    }
  };
  const onLoadMore = () => {
    loadMore(5);
  };
  const loadEarlier = status === 'CanLoadMore';
  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        alignTop
        alwaysShowSend={false}
        keyboardShouldPersistTaps="always"
        onSend={onSend}
        onInputTextChanged={setText}
        user={{
          _id: loggedInUserId,
        }}
        renderSystemMessage={(props) => (
          <SystemMessage {...props} textStyle={{ color: colors.gray }} />
        )}
        renderMessageImage={RenderMessageImage}
        renderActions={(props) => <RenderActions onPickDocument={onPickDocument} {...props} />}
        renderComposer={(props) => <RenderComposer onPickImage={onPickImage} {...props} />}
        bottomOffset={insets.bottom}
        renderAvatar={null}
        maxComposerHeight={100}
        textInputProps={styles.input}
        scrollToBottom
        renderUsernameOnMessage
        infiniteScroll
        loadEarlier={loadEarlier}
        renderChatEmpty={EmptyChat}
        onLoadEarlier={onLoadMore}
        renderUsername={(user) => <Text style={styles.username}>{user.name}</Text>}
        renderBubble={RenderBubble}
        renderSend={RenderSend}
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
});

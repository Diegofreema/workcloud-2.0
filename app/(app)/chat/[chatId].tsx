import { View, Text } from 'react-native';
import React from 'react';
import { useAppChatContext } from '~/components/providers/chat-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { StatusBar } from 'react-native';
import { Container } from '~/components/Ui/Container';
import { StyleSheet } from 'react-native';
import { colors } from '~/constants/Colors';
import { CustomPressable } from '~/components/Ui/CustomPressable';
import {
  Channel,
  MessageInput,
  MessageList,
  SendButtonProps,
  useMessageInputContext,
} from 'stream-chat-expo';
import { Send } from 'lucide-react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { ChatHeader } from '~/components/Ui/ChatHeader';

const ChannelScreen = () => {
  const { channel } = useAppChatContext();
  const headerHeight = useHeaderHeight() + (StatusBar.currentHeight ?? 0);
  const { bottom } = useSafeAreaInsets();
  if (!channel) return null;
  return (
    <Container>
      <Channel
        channel={channel}
        hasCameraPicker={false}
        hasCommands={false}
        hasFilePicker={false}
        SendButton={SendButton}
        EmptyStateIndicator={EmptyStateIndicator}
        LoadingErrorIndicator={() => (
          <Text>Error loading messages for this chat</Text>
        )}
        MessageError={() => <Text>Error loading messages for this chat</Text>}
      >
        <View style={{ marginBottom: bottom, flex: 1 }}>
          <ChatHeader channel={channel} />
          <MessageList />
          <KeyboardAvoidingView
            behavior={'translate-with-padding'}
            keyboardVerticalOffset={headerHeight}
          >
            <MessageInput />
          </KeyboardAvoidingView>
        </View>
      </Channel>
    </Container>
  );
};

export default ChannelScreen;

export const SendButton = (props: SendButtonProps) => {
  const { disabled } = props;
  const { sendMessage } = useMessageInputContext();
  const onPress = () => {
    sendMessage && sendMessage();
  };
  return (
    <CustomPressable style={styles.send} onPress={onPress} disable={disabled}>
      <Send size={25} fill={colors.white} color={colors.white} />
    </CustomPressable>
  );
};

const EmptyStateIndicator = () => {
  return (
    <Container>
      <View style={styles.empty}>
        <Text>No messages yet</Text>
        <Text>Your messages will be found here!</Text>
      </View>
    </Container>
  );
};
const styles = StyleSheet.create({
  send: {
    backgroundColor: colors.buttonBlue,
    padding: 5,
    borderRadius: 30,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

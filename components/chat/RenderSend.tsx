import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { IMessage, Send, SendProps } from "react-native-gifted-chat";
import { colors } from "~/constants/Colors";
import { SendIcon } from "lucide-react-native";

type Props = SendProps<IMessage> & {
  disabled: boolean;
  sending: boolean;
};
export const RenderSend = ({
  disabled,
  sending,

  onSend,
  text,
  sendButtonProps,
  ...props
}: Props) => {
  const customSendPress = (
    onSend:
      | ((
          messages: Partial<IMessage> | Partial<IMessage>[],
          shouldResetInputToolbar: boolean,
        ) => void)
      | undefined,
    text?: string,
  ) => {
    if (text && onSend) {
      onSend({ text: text.trim() }, true);
    } else {
      return false;
    }
  };
  return (
    <Send
      {...props}
      disabled={disabled}
      sendButtonProps={{
        ...sendButtonProps,
        onPress: () => customSendPress(onSend, text),
      }}
      containerStyle={[
        {
          justifyContent: "center",
          marginBottom: 5,
          marginLeft: 5,
          opacity: disabled ? 0.5 : 1,
        },
        styles.send,
      ]}
    >
      {sending ? (
        <ActivityIndicator size={"small"} color={colors.white} />
      ) : (
        <SendIcon color={colors.white} size={23} />
      )}
    </Send>
  );
};

const styles = StyleSheet.create({
  send: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.dialPad,
    width: 40,
    borderRadius: 50,
  },
});

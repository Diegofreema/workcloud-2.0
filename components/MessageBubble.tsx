import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "~/constants/Colors";
import { MessageSection } from "~/constants/types";
import { formatDate } from "~/lib/helper";

export const renderMessageBubble = ({
  item,
}: {
  item: { id: string; text: string; isCurrentUser: boolean; timestamp: string };
}) => (
  <View
    style={[
      styles.messageBubble,
      item.isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
    ]}
  >
    <Text
      style={
        item.isCurrentUser
          ? styles.currentUserMessageText
          : styles.otherUserMessageText
      }
    >
      {item.text}
    </Text>
    <Text style={styles.timestampText}>
      {new Date(item.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </Text>
  </View>
);

export const renderSectionHeader = ({
  section: { title },
}: {
  section: MessageSection;
}) => (
  <View style={styles.sectionHeaderContainer}>
    <Text style={styles.sectionHeaderText}>{formatDate(title)}</Text>
  </View>
);

const styles = StyleSheet.create({
  sectionHeaderContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  sectionHeaderText: {
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    color: "#000",
    fontWeight: "500",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  currentUserMessage: {
    alignSelf: "flex-end",
    backgroundColor: colors.dialPad,
    borderBottomRightRadius: 0,
  },
  otherUserMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 0,
  },

  currentUserMessageText: {
    fontSize: 16,
    color: colors.white,
    fontFamily: "PoppinsLight",
  },
  otherUserMessageText: {
    fontSize: 16,
    color: colors.black,
    fontFamily: "PoppinsLight",
  },
  timestampText: {
    fontSize: 15,
    color: colors.gray10,
    textAlign: "right",
    marginTop: 5,
  },
});

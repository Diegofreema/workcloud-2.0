import { CustomPressable } from "~/components/Ui/CustomPressable";
import { Mail } from "lucide-react-native";
import { colors } from "~/constants/Colors";
import { router } from "expo-router";
import { useUnreadMessageCount } from "~/features/common/hook/use-unread-message-count";
import { StyleSheet, View } from "react-native";
import { Text } from "@rneui/themed";
import React from "react";

export const MessageBtn = () => {
  const count = useUnreadMessageCount();

  return (
    <CustomPressable onPress={() => router.push("/message")}>
      <Mail color={colors.grayText} />
      {count > 0 && (
        <View style={styles.con}>
          <Text style={styles.count}>{count}</Text>
        </View>
      )}
    </CustomPressable>
  );
};

const styles = StyleSheet.create({
  con: {
    backgroundColor: colors.closeTextColor,
    position: "absolute",
    top: -3,
    right: -2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    width: 20,
    height: 20,
  },
  count: {
    color: colors.white,
  },
});

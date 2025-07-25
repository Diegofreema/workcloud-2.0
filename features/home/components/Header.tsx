import { EvilIcons } from "@expo/vector-icons";
import { Text } from "@rneui/themed";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { colors } from "~/constants/Colors";
import { api } from "~/convex/_generated/api";
import { useDarkMode } from "~/hooks/useDarkMode";

export const Header = () => {
  const { darkMode } = useDarkMode();

  const data = useQuery(api.notifications.getUnreadNotificationCount, {});
  const router = useRouter();
  const onSearch = () => {
    router.push("/search");
  };
  const onNotify = () => {
    router.push("/notification");
  };

  const numberOfUnread = data === undefined ? 0 : data;

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontFamily: "PoppinsBoldItalic",
          color: colors.buttonBlue,
          fontSize: 15,
        }}
      >
        Workcloud
      </Text>
      <View style={styles.subContainer}>
        <Pressable
          onPress={onSearch}
          style={({ pressed }) => [
            { opacity: pressed ? 0.5 : 1, paddingHorizontal: 5 },
          ]}
        >
          <EvilIcons
            name="search"
            size={30}
            color={darkMode === "dark" ? "#fff" : "#000"}
          />
        </Pressable>
        <Pressable
          onPress={onNotify}
          style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
        >
          <EvilIcons
            name="bell"
            size={30}
            color={darkMode === "dark" ? "#fff" : "#000"}
          />
          {numberOfUnread > 0 && (
            <View style={styles.unread}>
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {numberOfUnread}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subContainer: {
    flexDirection: "row",
    gap: 20,
  },
  unread: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "red",
    width: 20,
    height: 20,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});

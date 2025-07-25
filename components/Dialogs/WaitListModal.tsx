import { Icon } from "@rneui/themed";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";

import { HStack } from "../HStack";

import { useDarkMode } from "~/hooks/useDarkMode";

type Props = {
  showMenu: boolean;
  onClose: () => void;
  text: string;
  onRemove: () => void;
  loading: boolean;
};

export const WaitListModal = ({
  showMenu,
  onClose,
  text,
  onRemove,
  loading,
}: Props) => {
  const { darkMode } = useDarkMode();
  return (
    <Modal
      hasBackdrop
      onDismiss={onClose}
      animationIn="slideInDown"
      isVisible={showMenu}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      backdropColor={darkMode === "dark" ? "white" : "black"}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: darkMode === "dark" ? "black" : "white",
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            { opacity: pressed ? 0.5 : 1 },
            styles.close,
          ]}
          onPress={onClose}
        >
          <Icon
            name="close"
            size={25}
            color={darkMode === "dark" ? "white" : "black"}
          />
        </Pressable>
        {!loading && (
          <Pressable
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
              padding: 5,
            })}
            onPress={onRemove}
          >
            <Text
              style={[
                styles.text,
                { color: darkMode === "dark" ? "white" : "red" },
              ]}
            >
              {text}
            </Text>
          </Pressable>
        )}
        {loading && (
          <HStack gap={5}>
            <Text
              style={[
                styles.text,
                { color: darkMode === "dark" ? "white" : "red" },
              ]}
            >
              processing...
            </Text>
            <ActivityIndicator size="small" color="green" />
          </HStack>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontFamily: "PoppinsMedium",
    fontSize: 16,
  },
  close: {
    padding: 5,
  },
});

import { FontAwesome } from "@expo/vector-icons";
import { Divider } from "@rneui/themed";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";

import { colors } from "../../constants/Colors";
import { MyButton } from "../Ui/MyButton";
import { MyText } from "../Ui/MyText";

import { useDarkMode } from "~/hooks/useDarkMode";

export const AddToWorkspace = ({
  onAdd,
  isOpen,
  onClose,
  loading,
}: {
  onAdd: () => void;
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
}) => {
  const { darkMode } = useDarkMode();
  return (
    <View>
      <Modal
        hasBackdrop
        onDismiss={onClose}
        animationIn="slideInDown"
        isVisible={isOpen}
        backdropColor={darkMode === "dark" ? "white" : "black"}
        onBackButtonPress={onClose}
        onBackdropPress={onClose}
      >
        <View
          style={[
            styles.centeredView,
            { backgroundColor: darkMode === "dark" ? "black" : "white" },
          ]}
        >
          <MyText poppins="Medium" fontSize={20}>
            Add staff to this workspace
          </MyText>
          <Pressable
            style={({ pressed }) => [
              { opacity: pressed ? 0.5 : 1 },
              styles.button,
            ]}
            onPress={onClose}
          >
            <FontAwesome name="times" size={20} color="black" />
          </Pressable>
          <Divider
            style={[
              styles.divider,
              {
                marginBottom: -10,
                backgroundColor: darkMode === "dark" ? "transparent" : "#ccc",
              },
            ]}
          />
          <View style={{ marginTop: "auto", marginBottom: 20 }}>
            <MyButton loading={loading} onPress={onAdd}>
              <MyText poppins="Bold" fontSize={20} style={{ color: "white" }}>
                Add staff
              </MyText>
            </MyButton>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: "white",
    width: "100%",
    height: 150,
    paddingVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

    borderRadius: 10,
  },
  trash: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 4,
    borderRadius: 15,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: colors.gray,
    marginVertical: 6,
  },
  button: {
    position: "absolute",
    top: 7,
    right: 15,
    padding: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.gray10,
    padding: 10,
    borderRadius: 10,
    borderStyle: "dashed",
  },
});

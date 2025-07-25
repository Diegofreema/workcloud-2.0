import { Image, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";

import { useSaved } from "../../hooks/useSaved";
import { MyText } from "../Ui/MyText";

import { useDarkMode } from "~/hooks/useDarkMode";
type Props = {
  text: string;
};

export const CompleteDialog = ({ text }: Props): JSX.Element => {
  const { isOpen, onClose } = useSaved();
  const { darkMode } = useDarkMode();
  return (
    <View>
      <Modal
        hasBackdrop={false}
        onDismiss={onClose}
        animationIn="slideInDown"
        isVisible={isOpen}
        onBackButtonPress={onClose}
        onBackdropPress={onClose}
      >
        <View
          style={[
            styles.centeredView,
            {
              backgroundColor: darkMode === "dark" ? "black" : "white",
              shadowColor: darkMode === "dark" ? "#fff" : "#000",
            },
          ]}
        >
          <MyText poppins="Medium" fontSize={15} style={{ marginBottom: 30 }}>
            {text}
          </MyText>

          <Image
            source={require("../../assets/images/good.png")}
            style={{ marginTop: "auto" }}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: "white",
    paddingVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

    borderRadius: 15,
  },
});

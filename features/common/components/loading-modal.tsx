import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import { colors } from "~/constants/Colors";

type Props = {
  isOpen: boolean;
};
export const LoadingModal = ({ isOpen }: Props) => {
  return (
    <Modal animationType="slide" visible={isOpen} transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ActivityIndicator size={"large"} color={colors.dialPad} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0, 0.3)",
  },
  modalView: {
    marginVertical: 20,

    borderRadius: 10,
    paddingVertical: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
});

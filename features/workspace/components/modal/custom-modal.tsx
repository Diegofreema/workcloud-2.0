import {Modal, StyleSheet, Text, View} from "react-native";
import {ReactNode} from "react";
import {RFPercentage} from "react-native-responsive-fontsize";
import {colors} from "~/constants/Colors";
import {CustomPressable} from "~/components/Ui/CustomPressable";
import {X} from "lucide-react-native";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};
export const CustomModal = ({ onClose, isOpen, children, title }: Props) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <CustomPressable onPress={onClose} style={styles.button}>
            <X size={25} />
          </CustomPressable>
          <View style={styles.title}>
            <Text style={styles.modalText}>{title}</Text>
          </View>
          <View style={styles.content}>{children}</View>
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
  },
  modalView: {
    marginVertical: 20,
    backgroundColor: "white",
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    position: "absolute",
    top: 5,
    right: 0,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: RFPercentage(2),
    fontFamily: "PoppinsMedium",
  },
  title: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    width: "100%",
  },
  content: {
    width: "100%",
  },
});

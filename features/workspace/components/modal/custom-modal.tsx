import { X } from 'lucide-react-native';
import { ReactNode } from 'react';
import { Modal, StyleSheet, useColorScheme, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { CustomPressable } from '~/components/Ui/CustomPressable';
import { ThemedText } from '~/components/Ui/themed-text';
import { ThemedView } from '~/components/Ui/themed-view';
import Colors from '~/constants/Colors';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};
export const CustomModal = ({ onClose, isOpen, children, title }: Props) => {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? 'light'].text;
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <ThemedView style={[styles.modalView, { shadowColor: color }]}>
          <CustomPressable onPress={onClose} style={styles.button}>
            <X size={25} color={color} />
          </CustomPressable>
          <View style={styles.title}>
            <ThemedText style={styles.modalText}>{title}</ThemedText>
          </View>
          <View style={styles.content}>{children}</View>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    marginVertical: 20,
    borderRadius: 10,
    paddingVertical: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 5,
    right: 0,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: RFPercentage(2),
    fontFamily: 'PoppinsMedium',
  },
  title: {
    width: '100%',
  },
  content: {
    width: '100%',
  },
});

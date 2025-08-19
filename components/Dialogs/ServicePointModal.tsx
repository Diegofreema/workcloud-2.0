import { router } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';

import { MyButton } from '../Ui/MyButton';
import { MyText } from '../Ui/MyText';

import { useTheme } from '~/hooks/use-theme';
type Props = {
  text: string;

  onClose: () => void;
  isOpen: boolean;
};

export const ServicePointModal = ({
  text,
  isOpen,
  onClose,
}: Props): JSX.Element => {
  const { theme: darkMode } = useTheme();
  const handleClose = () => {
    onClose();
    router.back();
  };
  return (
    <View>
      <Modal
        hasBackdrop
        onDismiss={onClose}
        animationIn="slideInDown"
        isVisible={isOpen}
        onBackButtonPress={onClose}
        onBackdropPress={onClose}
        backdropColor={darkMode === 'dark' ? 'white' : 'black'}
      >
        <View
          style={[
            styles.centeredView,
            {
              backgroundColor: darkMode === 'dark' ? 'black' : 'white',
              shadowColor: darkMode === 'dark' ? '#fff' : '#000',
              height: 180,
            },
          ]}
        >
          <Image
            source={require('../../assets/images/ok.png')}
            style={{ position: 'absolute', top: -40 }}
          />
          <MyText
            poppins="Bold"
            fontSize={25}
            style={{ marginBottom: 10, marginTop: 'auto' }}
          >
            {text}
          </MyText>
          <MyButton onPress={handleClose}>
            <MyText poppins="Bold" fontSize={20} style={{ color: 'white' }}>
              Continue
            </MyText>
          </MyButton>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'white',
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
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

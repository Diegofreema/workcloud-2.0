import { Button } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';

import { HStack } from '../HStack';
import { MyText } from '../Ui/MyText';

import { colors } from '~/constants/Colors';
import { useTheme } from '~/hooks/use-theme';

type Props = {
  onPress: () => void;
  title: string;
  isLoading: boolean;
  onClose: () => void;
  isOpen: boolean;
  btnText?: string;
  cancelText?: string;
  actionBtnColor?: string;
};
export const CustomModal = ({
  onPress,
  title,
  isLoading,
  onClose,
  isOpen,
  btnText = 'Yes',
  cancelText = 'No',
  actionBtnColor,
}: Props) => {
  const { theme: darkMode } = useTheme();

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
              backgroundColor: darkMode === 'dark' ? 'black' : 'white',
              shadowColor: darkMode === 'dark' ? '#fff' : '#000',
            },
          ]}
        >
          <MyText
            poppins="Bold"
            fontSize={17}
            style={{
              textAlign: 'center',
              marginBottom: 15,
              color: darkMode === 'dark' ? 'white' : 'black',
            }}
          >
            {title}
          </MyText>

          <HStack gap={10}>
            <Button
              titleStyle={{
                fontFamily: 'PoppinsMedium',
                color: colors.dialPad,
              }}
              buttonStyle={{
                backgroundColor: colors.lightBlueButton,
                borderRadius: 5,
                width: 120,
              }}
              onPress={onClose}
              color={colors.black}
            >
              {cancelText}
            </Button>
            <Button
              disabled={isLoading}
              loading={isLoading}
              titleStyle={{ fontFamily: 'PoppinsMedium' }}
              buttonStyle={{
                backgroundColor: actionBtnColor || colors.dialPad,
                borderRadius: 5,
                width: 120,
              }}
              onPress={onPress}
            >
              {btnText}
            </Button>
          </HStack>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'white',
    padding: 30,
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
  trash: {
    backgroundColor: 'white',
    shadowColor: '#000',
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
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    position: 'absolute',
    top: 10,
    right: 15,
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.gray10,
    padding: 10,
    borderRadius: 10,
    borderStyle: 'dashed',
  },
});

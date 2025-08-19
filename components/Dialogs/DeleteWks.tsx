import { Button } from '@rneui/themed';
import { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { toast } from 'sonner-native';

import { HStack } from '../HStack';
import { MyText } from '../Ui/MyText';

import { colors } from '~/constants/Colors';
import { useTheme } from '~/hooks/use-theme';
import { useDeleteWks } from '~/hooks/useDeleteWks';

export const DeleteWksSpaceModal = () => {
  const { onClose, isOpen } = useDeleteWks();

  const [deleting, setDeleting] = useState(false);
  const { theme: darkMode } = useTheme();
  const deleteWks = async () => {
    setDeleting(true);
    try {
      onClose();
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    } finally {
      setDeleting(false);
    }
  };
  return (
    <View>
      <Modal
        onDismiss={onClose}
        animationType="slide"
        visible={isOpen}
        onRequestClose={onClose}
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
            style={{ textAlign: 'center', marginBottom: 15 }}
          >
            Are you sure you want to delete this workspace?
          </MyText>

          <HStack gap={10}>
            <Button
              disabled={deleting}
              titleStyle={{ fontFamily: 'PoppinsMedium' }}
              buttonStyle={{
                backgroundColor: colors.closeTextColor,
                borderRadius: 5,
                width: 120,
              }}
              onPress={deleteWks}
            >
              Delete
            </Button>

            <Button
              titleStyle={{ fontFamily: 'PoppinsMedium' }}
              buttonStyle={{
                backgroundColor: colors.dialPad,
                borderRadius: 5,
                width: 120,
              }}
              onPress={onClose}
            >
              Cancel
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

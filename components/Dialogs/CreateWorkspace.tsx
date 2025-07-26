import { EvilIcons, FontAwesome } from '@expo/vector-icons';
import { Button } from '@rneui/themed';
import { useMutation } from 'convex/react';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { toast } from 'sonner-native';

import { EmptyText } from '../EmptyText';
import { HStack } from '../HStack';
import { DottedButton } from '../Ui/DottedButton';
import { MyText } from '../Ui/MyText';

import { colors } from '~/constants/Colors';
import { Wks } from '~/constants/types';
import { api } from '~/convex/_generated/api';
import { useCreate } from '~/hooks/useCreate';
import { useDarkMode } from '~/hooks/useDarkMode';
import { useDetailsToAdd } from '~/hooks/useDetailsToAdd';

export const CreateWorkspaceModal = ({ workspace }: { workspace: Wks }) => {
  const { isOpen, onClose } = useCreate();
  const { setPersonal } = useDetailsToAdd();
  const deleteWorkspace = useMutation(api.workspace.deleteWorkspace);
  const [deleteMode, setDeleteMode] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { darkMode } = useDarkMode();

  const router = useRouter();

  const handleClose = () => {
    onClose();
    router.push('/role');
    setPersonal(true);
  };
  const onDelete = async () => {
    setDeleting(true);
    try {
      await deleteWorkspace({ id: workspace._id });
      toast.success('Success', {
        description: 'Workspace deleted',
      });
      setDeleting(false);
      setDeleteMode(false);
      onClose();
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete this workspace');
    } finally {
      setDeleting(false);
    }
  };

  const handlePress = (id: string) => {
    router.push(`/wk/${id}`);
    onClose();
  };
  const thereIsWorkspace = !!workspace?._id;
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
          <MyText poppins="Bold" fontSize={20}>
            Your workspace
          </MyText>
          <Pressable
            style={({ pressed }) => [
              { opacity: pressed ? 0.5 : 1 },
              styles.button,
            ]}
            onPress={onClose}
          >
            <FontAwesome
              name="times"
              size={24}
              color={darkMode === 'dark' ? 'white' : 'black'}
              style={{ fontWeight: '300' }}
            />
          </Pressable>

          {!thereIsWorkspace && (
            <DottedButton onPress={handleClose} text="Create personal WKS" />
          )}
          <View style={{ marginTop: 20, width: '100%' }}>
            {thereIsWorkspace && (
              <Pressable onPress={() => handlePress(workspace._id)}>
                <HStack
                  justifyContent="space-between"
                  alignItems="center"
                  mb={15}
                  mx={5}
                >
                  <MyText fontSize={13} poppins="Medium">
                    {workspace?.role}
                  </MyText>
                  <Pressable
                    style={({ pressed }) => [
                      styles.trash,
                      { opacity: pressed ? 0.5 : 1 },
                    ]}
                    onPress={() => setDeleteMode(true)}
                  >
                    <EvilIcons
                      name="trash"
                      size={24}
                      color={colors.closeTextColor}
                    />
                  </Pressable>
                </HStack>
              </Pressable>
            )}
            {deleteMode && thereIsWorkspace && (
              <HStack gap={10} justifyContent="center">
                <Button
                  disabled={deleting}
                  titleStyle={{ fontFamily: 'PoppinsMedium' }}
                  buttonStyle={{
                    backgroundColor: colors.closeTextColor,
                    borderRadius: 5,
                    width: 120,
                  }}
                  onPress={onDelete}
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
                  onPress={() => setDeleteMode(false)}
                >
                  Cancel
                </Button>
              </HStack>
            )}
            {!workspace?._id && <EmptyText text="No personal WKS" />}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'white',
    padding: 10,
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
    borderRadius: 55,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
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
});

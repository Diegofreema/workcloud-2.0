import { FontAwesome } from '@expo/vector-icons';
import { BottomSheet } from '@rneui/themed';
import { useMutation } from 'convex/react';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { toast } from 'sonner-native';

import { HStack } from '~/components/HStack';
import { colors } from '~/constants/Colors';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useTheme } from '~/hooks/use-theme';
import { MyText } from './MyText';
import { useRemoveUser } from '~/hooks/useRemoveUser';
import { useHandleStaff } from '~/hooks/useHandleStaffs';
import { useRouter } from 'expo-router';
import { useMessage } from '~/hooks/use-message';

type Props = {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  array: (
    | { icon: React.ComponentProps<typeof FontAwesome>['name']; text: string }
    | undefined
  )[];
  onBottomOpen: () => void;
  bossId: Id<'users'>;
  userId: Id<'users'>;
};
export const StaffBottomSheet = ({
  isVisible,
  setIsVisible,
  array,
  onBottomOpen,
  userId,
}: Props) => {
  const { onOpen } = useRemoveUser();
  const toggleWorkspace = useMutation(api.workspace.toggleWorkspace);
  const router = useRouter();
  // const { client } = useChatContext();
  const { onMessage } = useMessage();
  const { item } = useHandleStaff();
  const { theme: darkMode } = useTheme();
  const onClose = () => {
    setIsVisible(false);
  };
  const onViewProfile = () => {
    router.push(`/workerProfile/${item?._id}`);
    onClose();
  };

  const onRemoveStaff = async () => {
    onOpen();
    onClose();
  };

  const onSendMessage = async () => {
    onClose();

    onMessage(userId, 'single');
  };

  const onUnlockWorkspace = async () => {
    try {
      await toggleWorkspace({ workspaceId: item?.workspaceId! });
      toast.success('Success', { description: 'Updated workspace' });
    } catch (e) {
      console.log(e);
      toast.error('Something went wrong', {
        description: 'Failed to update workspace',
      });
    } finally {
      setIsVisible(false);
    }
  };
  const handlePress = (text: string) => {
    switch (text) {
      case 'View profile':
        onViewProfile();
        break;
      case 'Remove staff':
        onRemoveStaff();
        break;
      case 'Send message':
        onSendMessage();
        break;
      case 'Unlock workspace':
        onUnlockWorkspace();
        break;
      case 'Lock workspace':
        onUnlockWorkspace();
        break;
      case 'Assign workspace':
        onBottomOpen();
        break;
      default:
        break;
    }
  };
  return (
    <BottomSheet isVisible={isVisible} onBackdropPress={onClose}>
      <Pressable
        onPress={onClose}
        style={[
          {
            backgroundColor:
              darkMode === 'dark' ? 'black' : 'rgba(255,255,255, 0.3)',
            shadowColor: darkMode === 'dark' ? '#fff' : '#000',
          },
        ]}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={[
            styles.modalView,
            {
              backgroundColor: darkMode === 'dark' ? 'black' : 'white',
              shadowColor: darkMode === 'dark' ? '#fff' : '#000',
            },
          ]}
        >
          {array.map((item, index) =>
            item?.text ? (
              <Pressable
                key={index}
                style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
                onPress={() => handlePress(item?.text!)}
              >
                <HStack gap={15} alignItems="center" p={10}>
                  {item?.icon && (
                    <FontAwesome
                      name={item?.icon}
                      size={28}
                      color={
                        item?.text === 'Remove staff'
                          ? 'red'
                          : darkMode === 'dark'
                            ? '#fff'
                            : 'black'
                      }
                    />
                  )}
                  {item?.text && (
                    <MyText
                      poppins="Medium"
                      fontSize={13}
                      style={{
                        color:
                          item?.text === 'Remove staff'
                            ? 'red'
                            : darkMode === 'dark'
                              ? '#fff'
                              : 'black',
                      }}
                    >
                      {item?.text}
                    </MyText>
                  )}
                </HStack>
              </Pressable>
            ) : null
          )}
        </Pressable>
      </Pressable>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'white',
    flex: 1,
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
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
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.gray,
    marginVertical: 6,
  },
  button: {
    position: 'absolute',
    top: 7,
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
  modalView: {
    gap: 14,
    backgroundColor: 'white',
    borderRadius: 10,
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
});

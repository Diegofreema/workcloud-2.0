import { useMutation, useQuery } from 'convex/react';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { toast } from 'sonner-native';

import { HStack } from '../HStack';
import { MyButton } from '../Ui/MyButton';
import { MyText } from '../Ui/MyText';

import { Avatar } from '~/components/Ui/Avatar';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import VStack from '~/components/Ui/VStack';
import { colors } from '~/constants/Colors';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useStarredModal } from '~/hooks/useStarredModal';

type Props = {
  customerId: Id<'users'>;
  workspaceId: Id<'workspaces'>;
};
const MAXLENGTH = 255;
export const StarredComponent = ({ customerId, workspaceId }: Props) => {
  const { isOpen, onClose } = useStarredModal();
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const user = useQuery(api.users.getUserById, { id: customerId });
  const starCustomer = useMutation(api.workspace.starCustomer);
  if (user === undefined) {
    return <LoadingComponent />;
  }
  const onSubmit = async () => {
    if (!value) return;
    setIsLoading(true);
    try {
      await starCustomer({ customerId, text: value, workspaceId });
      toast.success('Success', {
        description: 'You have starred this customer',
      });
    } catch {
      toast.error('Failed to star customer', {
        description: 'Please try again later',
      });
    }
  };
  const disable = !value || isLoading;
  return (
    <View style={{ flex: 1 }}>
      <Modal onRequestClose={onClose} animationType="slide" visible={isOpen}>
        <Pressable style={styles.centeredView} onPress={onClose}>
          <Pressable onPress={(e) => e.stopPropagation()} style={styles.modalView}>
            <VStack gap={10}>
              <MyText poppins="Medium" fontSize={15} style={{ marginBottom: 30 }}>
                Type the reason you want to star this customer
              </MyText>
              <HStack alignItems="center" gap={5}>
                <Avatar image={user?.imageUrl!} width={50} height={50} />
                <MyText poppins="Medium" fontSize={15}>
                  {user?.name}
                </MyText>
              </HStack>
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={setValue}
                multiline
                maxLength={MAXLENGTH}
                placeholder="Message..."
                placeholderTextColor={colors.textGray}
              />
              <MyText poppins="Light" fontSize={12}>
                {`${value.length}/${MAXLENGTH}`}
              </MyText>
              <HStack width="100%" justifyContent="space-between" gap={15} mt={20} h={50}>
                <MyButton
                  style={{
                    backgroundColor: colors.callButtonBlue,

                    height: 50,
                  }}
                  textColor={colors.dialPad}
                  buttonStyle={{ backgroundColor: 'transparent', flex: 1 }}
                  containerStyle={{ flex: 1, height: 50 }}
                  contentStyle={{ height: 50 }}>
                  Cancel
                </MyButton>

                <MyButton
                  onPress={onSubmit}
                  style={{
                    backgroundColor: colors.dialPad,
                    height: 50,
                  }}
                  disabled={disable}
                  buttonStyle={{ width: '100%' }}
                  containerStyle={{ flex: 1 }}
                  textColor={colors.white}>
                  Save
                </MyButton>
              </HStack>
            </VStack>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
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
  input: {
    borderWidth: 1,
    borderColor: colors.dialPad,
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderRadius: 10,
  },
});

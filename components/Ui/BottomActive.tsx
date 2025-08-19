import { BottomSheet, Icon, Switch } from '@rneui/themed';
import { useMutation } from 'convex/react';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { toast } from 'sonner-native';

import { HStack } from '~/components/HStack';
import VStack from '~/components/Ui/VStack';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useTheme } from '~/hooks/use-theme';

export const BottomActive = ({
  onClose,
  active,
  leisure,
  isVisible,
  id,
}: {
  onClose: () => void;
  active: boolean;
  leisure: boolean;
  isVisible: boolean;
  id: Id<'workspaces'>;
}) => {
  const { theme: darkMode } = useTheme();
  const toggleActiveStatus = useMutation(api.workspace.toggleWorkspaceStatus);
  const toggleActive = async () => {
    try {
      await toggleActiveStatus({ workspaceId: id, type: 'active' });
      toast.success('Active status updated', {
        description: 'Your active status has been updated',
      });
    } catch {
      toast.error('Failed to update active status', {
        description: 'Something went wrong',
      });
    }
  };

  const toggleLeisure = async () => {
    try {
      await toggleActiveStatus({ workspaceId: id, type: 'leisure' });
      toast.success('Leisure status updated', {
        description: 'Your leisure status has been updated',
      });
    } catch {
      toast.error('Failed to update leisure status', {
        description: 'Something went wrong',
      });
    }
  };

  return (
    <BottomSheet
      modalProps={{}}
      onBackdropPress={onClose}
      scrollViewProps={{
        showsVerticalScrollIndicator: false,
        style: {
          backgroundColor: darkMode === 'dark' ? 'black' : 'white',
          padding: 10,
          borderTopRightRadius: 40,
          borderTopLeftRadius: 40,
          height: '40%',
        },
        contentContainerStyle: {
          height: '100%',
        },
      }}
      isVisible={isVisible}
    >
      <HStack
        width="100%"
        justifyContent="center"
        alignItems="center"
        gap={10}
        mt={20}
      >
        <Text
          style={{
            color: darkMode === 'dark' ? 'white' : 'black',
            textAlign: 'center',
            fontFamily: 'PoppinsBold',
            fontSize: 20,
            marginTop: 10,
          }}
        >
          Set status
        </Text>
        <Icon
          name="close"
          onPress={onClose}
          color="black"
          style={{ position: 'absolute', right: 5, top: -10 }}
        />
      </HStack>

      <VStack gap={10} mx={10} mt={20}>
        <HStack alignItems="center" gap={5}>
          <VStack style={{ flex: 1 }}>
            <Text
              style={[
                styles.header,
                { color: darkMode === 'dark' ? 'white' : 'black' },
              ]}
            >
              Active
            </Text>
            <Text
              style={[
                styles.text,
                { color: darkMode === 'dark' ? 'white' : 'black' },
              ]}
            >
              This shows if you are active or not active
            </Text>
          </VStack>
          <VStack style={{ alignSelf: 'flex-end' }}>
            <Switch value={active} onValueChange={toggleActive} />
          </VStack>
        </HStack>
        <HStack alignItems="center" gap={10}>
          <VStack flex={1}>
            <Text
              style={[
                styles.header,
                { color: darkMode === 'dark' ? 'white' : 'black' },
              ]}
            >
              Leisure
            </Text>
            <Text
              style={[
                styles.text,
                { color: darkMode === 'dark' ? 'white' : 'black' },
              ]}
            >
              This shows that you are not completely active, probably on a break
            </Text>
          </VStack>
          <Switch value={leisure} onValueChange={toggleLeisure} />
        </HStack>
      </VStack>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  header: {
    color: 'black',
    fontSize: 17,
    fontFamily: 'PoppinsBold',
  },
  text: { color: 'black', fontFamily: 'PoppinsLight' },
});

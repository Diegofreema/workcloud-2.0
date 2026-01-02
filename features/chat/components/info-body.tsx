import { LegendList } from '@legendapp/list';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { toast } from 'sonner-native';
import { ChannelMemberResponse, Channel as ChannelType } from 'stream-chat';
import { CustomModal } from '~/components/Dialogs/CustomModal';
import { EmptyText } from '~/components/EmptyText';
import { HStack } from '~/components/HStack';
import { CustomPressable } from '~/components/Ui/CustomPressable';
import { MyText } from '~/components/Ui/MyText';
import { UserPreview } from '~/components/Ui/UserPreview';
import { colors } from '~/constants/Colors';
import { Id } from '~/convex/_generated/dataModel';
import { useCloseGroup } from '~/features/chat/hook/use-close-group';
import { useGetUserId } from '~/hooks/useGetUserId';
import { capitaliseFirstLetter, generateErrorMessage } from '~/lib/helper';
type Props = {
  members: ChannelMemberResponse[];
  channel: ChannelType;
};

export const RenderInfoStaffs = ({ members, channel }: Props) => {
  const data = members
    .sort((a, b) => {
      if (a.role === 'owner' && b.role !== 'owner') return -1;
      if (a.role !== 'owner' && b.role === 'owner') return 1;
      return 0;
    })
    .map((item) => ({
      name: item.user?.name as string,
      image: item.user?.image!,
      id: item.user_id!,
      role: item.role === 'owner' ? 'Admin' : item.role,
    }));

  const [loading, setLoading] = useState(false);

  const { id } = useGetUserId();

  const onRemoveStaff = async (id: string) => {
    const userToRemove = data.find((item) => item.id === id);
    setLoading(true);
    try {
      await channel.removeMembers([id], {
        text: `${userToRemove?.name?.split(' ')[0]} has been removed by the admin`,
      });
      toast.success('Staffs removed from conversation');
    } catch (e) {
      const errorMessage = generateErrorMessage(
        e,
        'Failed to remove staffs from conversation'
      );
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const onCloseGroup = async () => {
    setLoading(true);
    try {
      toast.success('Group has been closed');
      router.replace('/message');
    } catch (e) {
      const errorMessage = generateErrorMessage(e, 'Failed to close group');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const loggedInUserIsAdmin = channel.state.members[id]?.role === 'owner';
  const onAlertRemoveStaff = (id: string) => {
    if (!loggedInUserIsAdmin) return;
    Alert.alert(
      'Remove staff',
      'Are you sure you want to remove this staff?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => onRemoveStaff(id),
        },
      ],
      { cancelable: true }
    );
  };

  const onAlertCloseGroup = () => {
    Alert.alert(
      'Close group',
      'Are you sure you want to close this group?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Close',
          style: 'destructive',
          onPress: onCloseGroup,
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <LegendList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 15, flexGrow: 1 }}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HStack justifyContent="space-between" alignItems="center">
            <UserPreview
              id={item.id}
              imageUrl={item?.image}
              name={item?.name}
              subText={capitaliseFirstLetter(item?.role)}
            />
            {loggedInUserIsAdmin && item.role !== 'Admin' && (
              <ActionButton onPress={() => onAlertRemoveStaff(item.id)} />
            )}
          </HStack>
        )}
        ListEmptyComponent={() => <EmptyText text="No members found" />}
        ListFooterComponent={() => (
          <FooterButtons
            loggedInUserIsAdmin={loggedInUserIsAdmin}
            onCloseGroup={onAlertCloseGroup}
            disabled={loading}
          />
        )}
        ListFooterComponentStyle={{ marginTop: 'auto' }}
        style={{ flex: 1 }}
        recycleItems
      />
    </View>
  );
};

const ActionButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <CustomPressable onPress={onPress}>
      <MyText poppins={'Medium'} style={{ color: colors.closeTextColor }}>
        Remove Staff
      </MyText>
    </CustomPressable>
  );
};

type FooterProps = {
  loggedInUserIsAdmin: boolean;
  onCloseGroup: () => void;
  disabled: boolean;
};

const FooterButtons = ({
  loggedInUserIsAdmin,
  onCloseGroup,
  disabled,
}: FooterProps) => {
  const { groupId } = useLocalSearchParams<{ groupId: Id<'conversations'> }>();

  const router = useRouter();
  const onAdd = () => {
    router.push(`/add-staff?groupId=${groupId}`);
  };

  if (!loggedInUserIsAdmin) return null;

  return (
    <HStack mt={'auto'} gap={5}>
      <CustomPressable onPress={onAdd} style={[styles.btn, styles.add]}>
        <MyText
          poppins={'Medium'}
          fontSize={15}
          style={{ color: colors.white }}
        >
          Add Staff
        </MyText>
      </CustomPressable>
      <CustomPressable
        onPress={onCloseGroup}
        style={[styles.btn, styles.close]}
        disable={disabled}
      >
        <MyText
          poppins={'Medium'}
          fontSize={15}
          style={{ color: colors.white }}
        >
          Close group
        </MyText>
      </CustomPressable>
    </HStack>
  );
};

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    borderRadius: 5,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  close: {
    backgroundColor: colors.closeTextColor,
  },
  add: {
    backgroundColor: colors.dialPad,
  },
});

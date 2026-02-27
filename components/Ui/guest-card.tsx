import { useMutation } from 'convex/react';
import { useStreamVideoClient } from '@stream-io/video-react-bindings';
import * as Crypto from 'expo-crypto';
import { Phone, MessageCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { toast } from 'sonner-native';
import { HStack } from '~/components/HStack';
import { Avatar } from '~/features/common/components/avatar';
import { MyText } from '~/components/Ui/MyText';
import { CustomPressable } from '~/components/Ui/CustomPressable';
import VStack from '~/components/Ui/VStack';
import { colors } from '~/constants/Colors';
import { api } from '~/convex/_generated/api';
import { Doc } from '~/convex/_generated/dataModel';
import { useAuth } from '~/context/auth';
import { useMessage } from '~/hooks/use-message';
import { formatDistanceToNow } from 'date-fns';

type GuestWithUser = Doc<'guests'> & {
  user: Doc<'users'> | null;
  imageUrl: string | null;
};

type Props = {
  guest: GuestWithUser;
};

export const GuestCard = ({ guest }: Props) => {
  const { user: authUser } = useAuth();
  const client = useStreamVideoClient();
  const { onMessage } = useMessage();
  const deleteGuest = useMutation(api.guests.deleteGuest);

  const [callingOrMessaging, setCallingOrMessaging] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteGuest({ guestId: guest._id });
    } catch {
      // silently handle – guest may already be deleted
    }
  };

  const handleCall = async () => {
    if (!authUser || !client || !guest.user?.userId) return;
    setCallingOrMessaging(true);
    try {
      const callId = Crypto.randomUUID();
      await client.call('default', callId).getOrCreate({
        ring: true,
        video: true,
        data: {
          members: [{ user_id: authUser.id }, { user_id: guest.user.userId }],
        },
      });
      await handleDelete();
    } catch (error: any) {
      toast.error('Failed to start call', { description: error?.message });
    } finally {
      setCallingOrMessaging(false);
    }
  };

  const handleMessage = async () => {
    if (!guest.user?.userId) return;
    setCallingOrMessaging(true);
    try {
      await onMessage(guest.user.userId, 'single');
      await handleDelete();
    } catch (error: any) {
      toast.error('Failed to open chat', { description: error?.message });
    } finally {
      setCallingOrMessaging(false);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(guest._creationTime), {
    addSuffix: true,
  });

  const displayName = guest.user?.name ?? 'Unknown';
  const displayEmail = guest.user?.email ?? '';
  const imageUrl = guest.imageUrl ?? guest.user?.image ?? '';

  return (
    <HStack
      justifyContent="space-between"
      alignItems="center"
      style={styles.container}
    >
      <HStack gap={12} alignItems="center" style={styles.userInfo}>
        <Avatar url={imageUrl} size={48} />
        <VStack style={styles.textContainer}>
          <MyText poppins="Bold" fontSize={14}>
            {displayName}
          </MyText>
          {displayEmail ? (
            <MyText poppins="Light" fontSize={12} style={styles.email}>
              {displayEmail}
            </MyText>
          ) : null}
          <MyText poppins="Light" fontSize={11} style={styles.time}>
            {timeAgo}
          </MyText>
        </VStack>
      </HStack>

      {callingOrMessaging ? (
        <ActivityIndicator size="small" color={colors.dialPad} />
      ) : (
        <HStack gap={10} alignItems="center">
          <CustomPressable onPress={handleCall} style={styles.actionBtn}>
            <Phone size={18} color={colors.openBackgroundColor} />
          </CustomPressable>
          <CustomPressable onPress={handleMessage} style={styles.actionBtn}>
            <MessageCircle size={18} color={colors.dialPad} />
          </CustomPressable>
        </HStack>
      )}
    </HStack>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.grayText + '33',
  },
  userInfo: {
    flex: 1,
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  email: {
    color: colors.grayText,
  },
  time: {
    color: colors.grayText,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.grayText + '55',
  },
});

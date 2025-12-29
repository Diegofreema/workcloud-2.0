import { router } from 'expo-router';
import React from 'react';

import { Channel as ChannelType } from 'stream-chat';
import { CustomPressable } from './CustomPressable';
import { useAuth } from '~/context/auth';
import { colors } from '~/constants/Colors';
import { Avatar } from '~/features/common/components/avatar';
import { StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

type Props = {
  channel: ChannelType;
};

export const ChatHeader = ({ channel }: Props) => {
  const { user } = useAuth();

  const otherMember = Object.values(channel.state.members).find(
    (member) => member.user?.id !== user?._id
  );
  const image = otherMember?.user?.image as string;
  return (
    <CustomPressable style={styles.header} onPress={() => router.back()}>
      <ArrowLeft size={30} color={colors.black} />
      <Avatar url={image as string} size={50} />
    </CustomPressable>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
});

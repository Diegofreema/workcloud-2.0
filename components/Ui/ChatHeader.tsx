import React from 'react';
import {
  Avatar,
  useChannelPreviewDisplayAvatar,
  useChatContext,
} from 'stream-chat-expo';
import { StyleSheet, useColorScheme, View } from 'react-native';

import { Check } from 'stream-chat-react-native-core/src/icons/index';
import Colors, { colors } from '~/constants/Colors';
import { sizes } from '~/lib/contants';

import { Channel as ChannelType } from 'stream-chat';
import { CustomPressable } from './CustomPressable';
import { router } from 'expo-router';
import { ArrowLeft, MoreVertical } from 'lucide-react-native';
import { useAppChatContext } from '../providers/chat-context';
export interface SuperAvatarProps {
  channel: ChannelType;
  isSelected?: boolean;
  size?: number;
}

export const ChatHeader = ({
  channel,
  isSelected = false,
  size = sizes.xl + sizes.xs,
}: SuperAvatarProps) => {
  const colorScheme = useColorScheme();
  const { setChannel } = useAppChatContext();
  const text = Colors[colorScheme ?? 'light'].text;
  // if (!channel) return null;
  const { image, name } = useChannelPreviewDisplayAvatar(channel);

  const isGroup = !!channel.data?.filter_tags?.includes('group');
  const onBack = () => router.back();
  const onPressGroupIcon = () => {
    setChannel(channel);
    router.push('/group-info');
  };
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <CustomPressable onPress={onBack}>
          <ArrowLeft size={25} color={text} />
        </CustomPressable>
        <Avatar image={image} name={name} size={50} />
      </View>
      {isSelected && (
        <View style={styles.checkWrap}>
          <Check pathFill={text} width={size} height={size} />
        </View>
      )}
      {isGroup && !isSelected && (
        <CustomPressable
          onPress={onPressGroupIcon}
          style={{ alignSelf: 'flex-end' }}
        >
          <MoreVertical size={25} color={text} />
        </CustomPressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkWrap: {
    padding: 2,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.buttonBlue,
    backgroundColor: colors.buttonSmall,
    position: 'absolute',
    left: sizes.xxl,
    top: sizes.xxl,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.xs,
  },
});

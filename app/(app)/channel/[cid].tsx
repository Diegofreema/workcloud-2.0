import { useHeaderHeight } from '@react-navigation/elements';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Channel as ChannelType, ChannelMemberResponse } from 'stream-chat';
import {
  Channel,
  MessageInput,
  MessageList,
  useAttachmentPickerContext,
  useChatContext,
} from 'stream-chat-expo';

import { AvatarPile } from '~/components/AvatarPile';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { MyText } from '~/components/Ui/MyText';
import { colors } from '~/constants/Colors';
import { useFetchMember } from '~/hooks/useFetchMember';
import { useGetUserId } from '~/hooks/useGetUserId';

export default function ChannelScreen() {
  const { setTopInset } = useAttachmentPickerContext();
  const [channel, setChannel] = useState<ChannelType | null>(null);
  const { cid } = useLocalSearchParams<{ cid: string }>();
  const headerHeight = useHeaderHeight();
  const { client } = useChatContext();
  const { id } = useGetUserId();
  const { otherUsers, loading } = useFetchMember(channel, id!);
  useEffect(() => {
    const fetchChannel = async () => {
      const channels = await client.queryChannels({ cid });
      setChannel(channels[0]);
    };
    fetchChannel();
  }, [cid, client]);
  useEffect(() => {
    setTopInset(headerHeight);
  }, [headerHeight, setTopInset]);

  if (!channel || loading) {
    return <LoadingComponent />;
  }

  return (
    <Channel
      channel={channel}
      keyboardVerticalOffset={headerHeight}
      enableSwipeToReply
    >
      <MessageHeader channel={channel} otherUsers={otherUsers} />
      <MessageList />
      <MessageInput />
    </Channel>
  );
}

const MessageHeader = ({
  channel,
  otherUsers,
}: {
  channel: ChannelType;
  otherUsers: ChannelMemberResponse[];
}) => {
  const images = otherUsers.map((i) => i?.user?.image as string);
  const nameToDisplay =
    otherUsers?.length > 1 ? channel?.data?.name : otherUsers[0]?.user?.name;
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={5}>
          <ChevronLeft color={colors.black} size={30} />
        </TouchableOpacity>
        <AvatarPile avatars={images} />
      </View>
      <MyText poppins={'Bold'} fontSize={RFPercentage(2)}>
        {nameToDisplay}
      </MyText>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});

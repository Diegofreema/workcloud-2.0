import React from 'react';
import { StyleSheet, View } from 'react-native';

import { RFPercentage } from 'react-native-responsive-fontsize';
import { Channel as ChannelType } from 'stream-chat';
import { useChannelPreviewDisplayAvatar } from 'stream-chat-expo';
import { MyText } from '~/components/Ui/MyText';
import { colors } from '~/constants/Colors';
import { Avatar } from '~/features/common/components/avatar';
type Props = {
  count: number;
  channel: ChannelType;
};

export const RoomInfoTop = ({ count, channel }: Props) => {
  const memberText = count > 1 ? 'members' : 'member';
  const { image, name } = useChannelPreviewDisplayAvatar(channel);
  const description = channel.data?.custom_data?.description as string;

  return (
    <View style={{ gap: 10 }}>
      <View style={styles.container}>
        <View style={{ width: 100, height: 100 }}>
          <Avatar url={image!} size={100} />
        </View>
        <MyText
          poppins={'Bold'}
          fontSize={30}
          style={[styles.name, { textAlign: 'center' }]}
        >
          {name}
        </MyText>
        <MyText
          poppins={'Medium'}
          fontSize={15}
          style={[styles.count, { textAlign: 'center' }]}
        >
          {`${count} ${memberText} `}
        </MyText>
      </View>

      {description && (
        <MyText poppins={'Medium'} fontSize={25} style={[styles.description]}>
          {description}
        </MyText>
      )}
      <MyText poppins={'Light'} fontSize={20} style={[styles.name]}>
        Members
      </MyText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    gap: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: RFPercentage(1.5),

    flex: 0,
  },
  count: {
    color: colors.black,
    flex: 0,
    textAlign: 'center',
  },

  description: {
    fontSize: RFPercentage(2),
    flex: 0,
    textAlign: 'center',
    marginBottom: 10,
  },
});
